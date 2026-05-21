(function () {
  const STORAGE_KEY = "worldcup2026_tournament_state";
  const DATA_URL = "data/worldcup2026_matches.json";
  const JAPAN_TEAM_ID = "JPN";
  const JST_TIME_ZONE = "Asia/Tokyo";
  const DAY_MS = 24 * 60 * 60 * 1000;

  const stageLabels = {
    group: "グループステージ",
    round_of_32: "ラウンド32",
    round_of_16: "ラウンド16",
    quarter_final: "準々決勝",
    semi_final: "準決勝",
    third_place: "3位決定戦",
    final: "決勝"
  };

  const knockoutStageOrder = [
    "round_of_32",
    "round_of_16",
    "quarter_final",
    "semi_final",
    "third_place",
    "final"
  ];

  const weekdayLabels = ["日", "月", "火", "水", "木", "金", "土"];

  const state = {
    initialized: false,
    loaded: false,
    loadError: "",
    view: "japan",
    matches: [],
    teams: {},
    groupFilter: "all",
    calendarMode: "month",
    calendarDate: null,
    saved: loadSavedState(),
    elements: {}
  };

  function init() {
    if (state.initialized) return;
    state.elements = {
      tabs: Array.from(document.querySelectorAll(".tournament-tab")),
      content: document.getElementById("tournamentContent"),
      summary: document.getElementById("tournamentSummary"),
      updateButton: document.getElementById("tournamentUpdateButton"),
      groupFilter: document.getElementById("tournamentGroupFilter"),
      exportButton: document.getElementById("tournamentExportButton"),
      importButton: document.getElementById("tournamentImportButton"),
      saveState: document.getElementById("saveState")
    };

    state.elements.tabs.forEach((button) => {
      button.addEventListener("click", () => {
        state.view = button.dataset.tournamentView || "japan";
        renderContent();
      });
    });
    state.elements.updateButton?.addEventListener("click", updateTournamentSnapshots);
    state.elements.groupFilter?.addEventListener("change", () => {
      state.groupFilter = state.elements.groupFilter.value;
      renderContent();
    });
    state.elements.exportButton?.addEventListener("click", exportToClipboard);
    state.elements.importButton?.addEventListener("click", importFromPrompt);

    state.initialized = true;
    loadMatches();
  }

  async function loadMatches() {
    try {
      const response = await fetch(DATA_URL, { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const payload = await response.json();
      state.matches = Array.isArray(payload.matches) ? payload.matches.map(normalizeMatch) : [];
      state.teams = buildTeamMap(payload.teams, state.matches);
      logFlagMapping();
      state.calendarDate = firstMatchDate() || new Date("2026-06-12T00:00:00+09:00");
      state.loaded = true;
      state.loadError = "";
    } catch (error) {
      state.loadError = `${DATA_URL} を読み込めませんでした: ${error.message || error}`;
    }
    renderContent();
  }

  function buildTeamMap(teamRows, matches) {
    const teams = {};
    if (Array.isArray(teamRows)) {
      teamRows.forEach((team) => {
        teams[team.team_id] = team;
      });
    }
    matches.forEach((match) => {
      if (match.stage !== "group") return;
      const homeId = matchHomeId(match);
      const awayId = matchAwayId(match);
      teams[homeId] ||= fallbackTeam(homeId, match.home_name_ja, match.group);
      teams[awayId] ||= fallbackTeam(awayId, match.away_name_ja, match.group);
    });
    return teams;
  }

  function normalizeMatch(match) {
    return {
      ...match,
      home_team_id: match.home_team_id || match.home || "",
      away_team_id: match.away_team_id || match.away || ""
    };
  }

  function fallbackTeam(teamId, name, group) {
    return {
      team_id: teamId,
      name_ja: name || teamId,
      fifa_code: teamId,
      flag_code: "",
      group
    };
  }

  function loadSavedState() {
    const fallback = {
      version: 1,
      scoreOverrides: {},
      lastUpdatedAt: "",
      standings: null,
      thirdRanking: null,
      knockout: null
    };
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      const scoreOverrides = parsed?.scoreOverrides && typeof parsed.scoreOverrides === "object"
        ? parsed.scoreOverrides
        : parsed?.scores && typeof parsed.scores === "object"
          ? parsed.scores
          : {};
      return {
        version: parsed?.version || fallback.version,
        scoreOverrides,
        lastUpdatedAt: parsed?.lastUpdatedAt || fallback.lastUpdatedAt,
        standings: parsed?.standings || fallback.standings,
        thirdRanking: parsed?.thirdRanking || fallback.thirdRanking,
        knockout: parsed?.knockout || fallback.knockout
      };
    } catch (error) {
      return fallback;
    }
  }

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.saved));
  }

  function renderContent() {
    const { content, summary, tabs } = state.elements;
    if (!content) return;
    content.innerHTML = "";
    tabs?.forEach((tab) => tab.classList.toggle("active", tab.dataset.tournamentView === state.view));

    if (state.loadError) {
      content.appendChild(message(state.loadError, "tournament-error"));
      if (summary) summary.textContent = "読み込みエラー";
      return;
    }
    if (!state.loaded) {
      content.appendChild(message(`${DATA_URL} を読み込み中...`));
      return;
    }

    const scoreCount = savedScoreCount();
    if (summary) {
      const updated = state.saved.lastUpdatedAt ? ` / 最終更新 ${formatSavedDateTime(state.saved.lastUpdatedAt)}` : "";
      summary.textContent = `スコア/日程 / 全${state.matches.length}試合 / スコア保存 ${scoreCount}試合${updated}`;
    }

    if (state.view === "japan") {
      content.appendChild(renderMatchList(computedMatches().filter(isJapanMatch)));
    } else if (state.view === "schedule") {
      content.appendChild(renderMatchList(filterByGroup(computedMatches())));
    } else if (state.view === "calendar") {
      content.appendChild(renderCalendarView());
    } else if (state.view === "groups") {
      content.appendChild(renderStandingsSnapshot());
    } else if (state.view === "thirds") {
      content.appendChild(renderThirdRankingSnapshot());
    } else {
      content.appendChild(renderKnockoutSnapshot());
    }
  }

  function isJapanMatch(match) {
    return matchHomeId(match) === JAPAN_TEAM_ID || matchAwayId(match) === JAPAN_TEAM_ID;
  }

  function sortedMatches(matches) {
    return [...matches].sort((a, b) => {
      const aTime = Date.parse(a.kickoff_jst || "");
      const bTime = Date.parse(b.kickoff_jst || "");
      if (Number.isFinite(aTime) && Number.isFinite(bTime) && aTime !== bTime) return aTime - bTime;
      if (Number.isFinite(aTime)) return -1;
      if (Number.isFinite(bTime)) return 1;
      return String(a.match_id).localeCompare(String(b.match_id));
    });
  }

  function filterByGroup(matches) {
    if (state.groupFilter === "all") return matches;
    return matches.filter((match) => match.group === state.groupFilter);
  }

  function renderMatchList(matches) {
    const list = document.createElement("div");
    list.className = "match-list";
    if (matches.length === 0) {
      list.appendChild(message("表示できる試合がありません"));
      return list;
    }
    sortedMatches(matches).forEach((match) => list.appendChild(createMatchCard(match)));
    return list;
  }

  function createMatchCard(match) {
    const card = document.createElement("details");
    card.className = "match-card";
    if (isJapanMatch(match)) card.classList.add("japan-highlight");
    card.open = true;

    const summary = document.createElement("summary");
    summary.className = "match-summary";
    summary.append(
      textDiv(match.match_id, "match-id"),
      matchTitle(match),
      textDiv(scoreText(match.match_id), "match-score-display"),
      statusBadge(match.match_id)
    );

    const body = document.createElement("div");
    body.className = "match-card-body";

    const meta = document.createElement("div");
    meta.className = "match-meta";
    meta.append(
      textDiv(stageLabels[match.stage] || match.stage),
      textDiv(match.group ? `Group ${match.group}` : ""),
      textDiv(formatJstDateTime(match.kickoff_jst), "match-jst"),
      textDiv(venueText(match))
    );

    const teams = document.createElement("div");
    teams.className = "match-teams";
    teams.append(
      teamLabel(matchHomeId(match), match.home_name_ja, "match-team"),
      textDiv(scoreText(match.match_id), "match-score-display"),
      teamLabel(matchAwayId(match), match.away_name_ja, "match-team away")
    );

    body.append(meta, teams, createScoreEditor(match.match_id));
    card.append(summary, body);
    return card;
  }

  function matchTitle(match) {
    const wrapper = document.createElement("div");
    wrapper.className = "match-title";
    wrapper.append(teamLabel(matchHomeId(match), match.home_name_ja), textDiv("vs"), teamLabel(matchAwayId(match), match.away_name_ja));
    return wrapper;
  }

  function statusBadge(matchId) {
    const status = matchStatus(matchId);
    const badge = document.createElement("div");
    badge.className = `match-status ${status.className}`.trim();
    badge.textContent = status.label;
    return badge;
  }

  function matchStatus(matchId) {
    const score = normalizedScore(matchId);
    const hasHome = score.score_home !== "";
    const hasAway = score.score_away !== "";
    const hasPenaltyHome = score.penalty_home !== "";
    const hasPenaltyAway = score.penalty_away !== "";
    if (hasHome !== hasAway || hasPenaltyHome !== hasPenaltyAway) return { label: "要確認", className: "review" };
    if (!hasHome && !hasAway && !hasPenaltyHome && !hasPenaltyAway) return { label: "未入力", className: "" };
    if (hasPenaltyHome && hasPenaltyAway) return { label: "PKあり", className: "pk" };
    return { label: "入力済み", className: "entered" };
  }

  function createScoreEditor(matchId) {
    const fields = [
      ["score_home", "H"],
      ["score_away", "A"],
      ["penalty_home", "H PK"],
      ["penalty_away", "A PK"]
    ];
    const score = normalizedScore(matchId);
    const editor = document.createElement("div");
    editor.className = "score-editor";
    fields.forEach(([key, labelText]) => {
      const label = document.createElement("label");
      label.textContent = labelText;
      const input = document.createElement("input");
      input.type = "number";
      input.inputMode = "numeric";
      input.min = "0";
      input.step = "1";
      input.pattern = "\\d*";
      input.value = score[key];
      input.dataset.matchId = matchId;
      input.dataset.scoreKey = key;
      input.addEventListener("input", handleScoreInput);
      input.addEventListener("change", renderContent);
      label.appendChild(input);
      editor.appendChild(label);
    });
    return editor;
  }

  function handleScoreInput(event) {
    const input = event.currentTarget;
    const matchId = input.dataset.matchId;
    const key = input.dataset.scoreKey;
    const value = input.value.replace(/[^\d]/g, "");
    if (input.value !== value) input.value = value;
    const current = state.saved.scoreOverrides[matchId] || {};
    if (value === "") {
      delete current[key];
    } else {
      current[key] = value;
    }
    if (hasAnyScore(current)) {
      state.saved.scoreOverrides[matchId] = current;
    } else {
      delete state.saved.scoreOverrides[matchId];
    }
    state.saved.lastUpdatedAt = new Date().toISOString();
    persist();
    if (state.elements.saveState) state.elements.saveState.textContent = "スコア保存済み";
  }

  function normalizedScore(matchId) {
    const score = state.saved.scoreOverrides[matchId] || {};
    const match = state.matches.find((item) => item.match_id === matchId) || {};
    return {
      score_home: valueOrEmpty(score.score_home ?? match.score_home),
      score_away: valueOrEmpty(score.score_away ?? match.score_away),
      penalty_home: valueOrEmpty(score.penalty_home ?? match.penalty_home),
      penalty_away: valueOrEmpty(score.penalty_away ?? match.penalty_away)
    };
  }

  function computedMatches() {
    return state.matches.map((match) => {
      const score = normalizedScore(match.match_id);
      return {
        ...match,
        score_home: scoreNumber(score, "score_home"),
        score_away: scoreNumber(score, "score_away"),
        penalty_home: scoreNumber(score, "penalty_home"),
        penalty_away: scoreNumber(score, "penalty_away")
      };
    });
  }

  function savedScoreCount() {
    return Object.keys(state.saved.scoreOverrides || {}).filter((matchId) => hasMainScore(normalizedScore(matchId))).length;
  }

  function scoreSignature() {
    const normalized = {};
    Object.keys(state.saved.scoreOverrides || {}).sort().forEach((matchId) => {
      const score = normalizedScore(matchId);
      const entry = {};
      ["score_home", "score_away", "penalty_home", "penalty_away"].forEach((key) => {
        if (score[key] !== "") entry[key] = score[key];
      });
      if (hasAnyScore(entry)) normalized[matchId] = entry;
    });
    return JSON.stringify(normalized);
  }

  function valueOrEmpty(value) {
    return value === null || value === undefined ? "" : String(value);
  }

  function scoreNumber(score, key) {
    const value = score[key];
    return value === "" ? null : Number(value);
  }

  function hasMainScore(score) {
    return scoreNumber(score, "score_home") !== null && scoreNumber(score, "score_away") !== null;
  }

  function hasAnyScore(score) {
    return score && Object.values(score).some((value) => value !== "" && value !== null && value !== undefined);
  }

  function scoreText(matchId) {
    const score = normalizedScore(matchId);
    if (!hasMainScore(score)) return "未入力";
    let text = `${score.score_home}-${score.score_away}`;
    if (score.penalty_home !== "" && score.penalty_away !== "") {
      text += ` PK ${score.penalty_home}-${score.penalty_away}`;
    }
    return text;
  }

  function renderCalendarView() {
    const wrapper = document.createElement("div");
    wrapper.className = "calendar-view";
    wrapper.append(createCalendarToolbar());
    if (state.calendarMode === "month") {
      wrapper.append(renderMonthCalendar());
    } else if (state.calendarMode === "week") {
      wrapper.append(renderWeekCalendar());
    } else {
      wrapper.append(renderDayCalendar());
    }
    return wrapper;
  }

  function createCalendarToolbar() {
    const toolbar = document.createElement("div");
    toolbar.className = "calendar-toolbar";

    const nav = document.createElement("div");
    nav.className = "calendar-nav";
    const previous = calendarButton("前へ", () => moveCalendar(-1));
    const today = calendarButton("今日", () => {
      state.calendarDate = firstMatchDate() || new Date();
      renderContent();
    });
    const next = calendarButton("次へ", () => moveCalendar(1));
    nav.append(previous, today, next);

    const title = document.createElement("div");
    title.className = "calendar-title";
    title.textContent = calendarTitle();

    const modes = document.createElement("div");
    modes.className = "calendar-mode-tabs";
    [
      ["month", "月別"],
      ["week", "週別"],
      ["day", "日別"]
    ].forEach(([mode, label]) => {
      const button = calendarButton(label, () => {
        state.calendarMode = mode;
        renderContent();
      });
      button.classList.toggle("active", state.calendarMode === mode);
      modes.appendChild(button);
    });

    toolbar.append(nav, title, modes);
    return toolbar;
  }

  function calendarButton(label, onClick) {
    const button = document.createElement("button");
    button.className = "utility-button calendar-button";
    button.type = "button";
    button.textContent = label;
    button.addEventListener("click", onClick);
    return button;
  }

  function calendarTitle() {
    const date = calendarDate();
    if (state.calendarMode === "month") return `${date.getFullYear()}年${date.getMonth() + 1}月`;
    if (state.calendarMode === "week") {
      const start = startOfWeek(date);
      const end = addDays(start, 6);
      return `${formatMonthDay(start)} - ${formatMonthDay(end)}`;
    }
    return formatJstDate(date);
  }

  function moveCalendar(direction) {
    const date = calendarDate();
    if (state.calendarMode === "month") {
      state.calendarDate = new Date(date.getFullYear(), date.getMonth() + direction, 1);
    } else if (state.calendarMode === "week") {
      state.calendarDate = addDays(date, direction * 7);
    } else {
      state.calendarDate = addDays(date, direction);
    }
    renderContent();
  }

  function renderMonthCalendar() {
    const date = calendarDate();
    const first = new Date(date.getFullYear(), date.getMonth(), 1);
    const start = startOfWeek(first);
    const grid = document.createElement("div");
    grid.className = "calendar-month";
    weekdayLabels.forEach((label) => {
      const head = document.createElement("div");
      head.className = "calendar-weekday";
      head.textContent = label;
      grid.appendChild(head);
    });
    for (let i = 0; i < 42; i += 1) {
      const day = addDays(start, i);
      const matches = matchesOnDay(day);
      const cell = document.createElement("div");
      cell.className = "calendar-day-cell";
      if (day.getMonth() !== date.getMonth()) cell.classList.add("outside");
      const dayHead = document.createElement("button");
      dayHead.type = "button";
      dayHead.className = "calendar-day-number";
      dayHead.textContent = String(day.getDate());
      dayHead.addEventListener("click", () => {
        state.calendarDate = day;
        state.calendarMode = "day";
        renderContent();
      });
      cell.appendChild(dayHead);
      matches.slice(0, 3).forEach((match) => cell.appendChild(createCalendarMiniMatch(match)));
      if (matches.length > 3) {
        const more = document.createElement("button");
        more.type = "button";
        more.className = "calendar-more";
        more.textContent = `他${matches.length - 3}試合`;
        more.addEventListener("click", () => {
          state.calendarDate = day;
          state.calendarMode = "day";
          renderContent();
        });
        cell.appendChild(more);
      }
      grid.appendChild(cell);
    }
    return grid;
  }

  function renderWeekCalendar() {
    const start = startOfWeek(calendarDate());
    const grid = document.createElement("div");
    grid.className = "calendar-week";
    for (let i = 0; i < 7; i += 1) {
      const day = addDays(start, i);
      const column = document.createElement("section");
      column.className = "calendar-week-day";
      const heading = document.createElement("button");
      heading.type = "button";
      heading.className = "calendar-week-heading";
      heading.textContent = formatJstDate(day);
      heading.addEventListener("click", () => {
        state.calendarDate = day;
        state.calendarMode = "day";
        renderContent();
      });
      column.appendChild(heading);
      const matches = matchesOnDay(day);
      if (matches.length === 0) {
        column.appendChild(message("試合なし", "calendar-empty"));
      } else {
        matches.forEach((match) => column.appendChild(createCalendarMatchCard(match, false, "week")));
      }
      grid.appendChild(column);
    }
    return grid;
  }

  function renderDayCalendar() {
    const matches = matchesOnDay(calendarDate());
    const list = document.createElement("div");
    list.className = "calendar-day-list";
    if (matches.length === 0) {
      list.appendChild(message("この日の試合はありません", "calendar-empty"));
      return list;
    }
    matches.forEach((match) => list.appendChild(createCalendarMatchCard(match, true, "day")));
    return list;
  }

  function createCalendarMiniMatch(match) {
    const row = document.createElement("button");
    row.type = "button";
    row.className = "calendar-mini-match";
    if (isJapanMatch(match)) row.classList.add("japan-highlight");
    row.addEventListener("click", () => {
      state.calendarDate = jstDate(match.kickoff_jst);
      state.calendarMode = "day";
      renderContent();
    });
    row.append(
      textSpan(formatJstTime(match.kickoff_jst), "calendar-mini-time"),
      teamLabel(matchHomeId(match), match.home_name_ja),
      textSpan("vs", "calendar-vs"),
      teamLabel(matchAwayId(match), match.away_name_ja),
      textSpan(scoreText(match.match_id), "calendar-mini-score")
    );
    return row;
  }

  function createCalendarMatchCard(match, includeEditor, layout = "day") {
    const card = document.createElement(layout === "week" ? "button" : "div");
    card.className = `calendar-match-card calendar-match-card-${layout}`;
    if (layout === "week") {
      card.type = "button";
      card.addEventListener("click", () => {
        state.calendarDate = jstDate(match.kickoff_jst);
        state.calendarMode = "day";
        renderContent();
      });
    }
    if (isJapanMatch(match)) card.classList.add("japan-highlight");

    const main = document.createElement("div");
    main.className = "calendar-match-main";
    main.append(
      textDiv(formatJstTime(match.kickoff_jst), "calendar-match-time"),
      teamLabel(matchHomeId(match), match.home_name_ja),
      textDiv(scoreText(match.match_id), "match-score-display"),
      teamLabel(matchAwayId(match), match.away_name_ja)
    );

    const meta = document.createElement("div");
    meta.className = "calendar-match-meta";
    meta.append(
      textSpan(match.match_id),
      textSpan(stageLabels[match.stage] || match.stage),
      textSpan(match.group ? `Group ${match.group}` : ""),
      textSpan(venueText(match))
    );

    card.append(main, meta);
    if (includeEditor) card.appendChild(createScoreEditor(match.match_id));
    return card;
  }

  function matchesOnDay(day) {
    const key = dateKey(day);
    return sortedMatches(filterByGroup(computedMatches())).filter((match) => dateKey(jstDate(match.kickoff_jst)) === key);
  }

  function firstMatchDate() {
    const first = sortedMatches(state.matches).find((match) => match.kickoff_jst);
    return first ? jstDate(first.kickoff_jst) : null;
  }

  function calendarDate() {
    return state.calendarDate ? new Date(state.calendarDate) : firstMatchDate() || new Date();
  }

  function jstDate(value) {
    if (!value) return new Date(NaN);
    return new Date(value);
  }

  function startOfWeek(date) {
    const start = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    start.setDate(start.getDate() - start.getDay());
    return start;
  }

  function addDays(date, days) {
    return new Date(date.getTime() + days * DAY_MS);
  }

  function dateKey(date) {
    if (Number.isNaN(date.getTime())) return "";
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  }

  function formatJstDateTime(value) {
    const date = jstDate(value);
    if (Number.isNaN(date.getTime())) return "JST未入力";
    return `${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(date.getDate())}（${weekdayLabels[date.getDay()]}）${pad(date.getHours())}:${pad(date.getMinutes())} JST`;
  }

  function formatSavedDateTime(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value || "";
    return date.toLocaleString("ja-JP", {
      timeZone: JST_TIME_ZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  function formatJstDate(date) {
    return `${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(date.getDate())}（${weekdayLabels[date.getDay()]}）`;
  }

  function formatMonthDay(date) {
    return `${date.getMonth() + 1}/${date.getDate()}（${weekdayLabels[date.getDay()]}）`;
  }

  function formatJstTime(value) {
    const date = jstDate(value);
    if (Number.isNaN(date.getTime())) return "--:--";
    return `${pad(date.getHours())}:${pad(date.getMinutes())} JST`;
  }

  function pad(value) {
    return String(value).padStart(2, "0");
  }

  function updateTournamentSnapshots() {
    const updatedAt = new Date().toISOString();
    const signature = scoreSignature();
    const standings = calculateGroupTables();
    const thirds = Object.values(standings)
      .map((table) => table[2])
      .filter(Boolean)
      .sort(sortStats)
      .map((team, index, list) => ({
        ...team,
        reviewNeeded: team.reviewNeeded || tiedWithAny(team, list),
        advances: index < 8
      }));
    state.saved.standings = {
      updatedAt,
      scoreSignature: signature,
      groups: standings
    };
    state.saved.thirdRanking = {
      updatedAt,
      scoreSignature: signature,
      teams: thirds
    };
    state.saved.knockout = {
      updatedAt,
      scoreSignature: signature,
      rounds: calculateKnockoutCards(standings)
    };
    persist();
    renderContent();
    setSavedLabel("順位・3位ランキング・トーナメントを更新しました");
  }

  function calculateGroupTables() {
    const tables = {};
    computedMatches().filter((match) => match.stage === "group").forEach((match) => {
      const homeId = matchHomeId(match);
      const awayId = matchAwayId(match);
      [homeId, awayId].forEach((teamId) => {
        tables[match.group] ||= {};
        tables[match.group][teamId] ||= createTeamStats(teamId, match.group);
      });
      const score = normalizedScore(match.match_id);
      if (!hasMainScore(score)) return;
      const homeScore = scoreNumber(score, "score_home");
      const awayScore = scoreNumber(score, "score_away");
      const home = tables[match.group][homeId];
      const away = tables[match.group][awayId];
      home.played += 1;
      away.played += 1;
      home.gf += homeScore;
      home.ga += awayScore;
      away.gf += awayScore;
      away.ga += homeScore;
      if (homeScore > awayScore) {
        home.wins += 1;
        away.losses += 1;
        home.points += 3;
      } else if (homeScore < awayScore) {
        away.wins += 1;
        home.losses += 1;
        away.points += 3;
      } else {
        home.draws += 1;
        away.draws += 1;
        home.points += 1;
        away.points += 1;
      }
    });
    Object.keys(tables).forEach((group) => {
      const sorted = Object.values(tables[group]).sort(sortStats);
      tables[group] = sorted.map((team) => ({
        ...team,
        reviewNeeded: team.played > 0 && tiedWithAny(team, sorted)
      }));
    });
    return tables;
  }

  function createTeamStats(teamId, group) {
    return {
      teamId,
      name: displayTeam(teamId),
      group,
      played: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      gf: 0,
      ga: 0,
      points: 0,
      reviewNeeded: false
    };
  }

  function sortStats(a, b) {
    return (b.points - a.points) || ((b.gf - b.ga) - (a.gf - a.ga)) || (b.gf - a.gf) || a.teamId.localeCompare(b.teamId);
  }

  function tiedWithAny(team, list) {
    return list.some((other) => {
      if (team.teamId === other.teamId) return false;
      return team.points === other.points && (team.gf - team.ga) === (other.gf - other.ga) && team.gf === other.gf;
    });
  }

  function renderStandingsSnapshot() {
    if (!state.saved.standings?.groups || state.saved.standings.scoreSignature !== scoreSignature()) {
      return message("まだ順位を更新していません。「更新」ボタンで再計算してください。");
    }
    const wrapper = document.createElement("div");
    wrapper.className = "group-standings-grid";
    Object.keys(state.saved.standings.groups).sort().filter((group) => state.groupFilter === "all" || group === state.groupFilter).forEach((group) => {
      const card = document.createElement("details");
      card.className = "standing-card";
      card.open = true;
      const heading = document.createElement("summary");
      heading.textContent = `Group ${group}`;
      card.append(heading, createStandingTable(state.saved.standings.groups[group]));
      wrapper.appendChild(card);
    });
    return wrapper;
  }

  function renderThirdRankingSnapshot() {
    if (!state.saved.thirdRanking?.teams || state.saved.thirdRanking.scoreSignature !== scoreSignature()) {
      return message("まだ3位ランキングを更新していません。「更新」ボタンで再計算してください。");
    }
    const card = document.createElement("details");
    card.className = "standing-card";
    card.open = true;
    const heading = document.createElement("summary");
    heading.textContent = "3位ランキング";
    card.append(heading, createStandingTable(state.saved.thirdRanking.teams, true));
    const wrapper = document.createElement("div");
    wrapper.className = "third-ranking-list";
    wrapper.appendChild(card);
    return wrapper;
  }

  function createStandingTable(stats, includeGroup = false) {
    const table = document.createElement("table");
    table.className = "standing-table";
    const head = document.createElement("thead");
    head.innerHTML = `<tr><th>順位</th>${includeGroup ? "<th>組</th>" : ""}<th>チーム</th><th>勝点</th><th>試</th><th>勝</th><th>分</th><th>敗</th><th>得</th><th>失</th><th>差</th><th>状態</th></tr>`;
    const body = document.createElement("tbody");
    stats.forEach((team, index) => {
      const hasAdvanceStatus = Object.prototype.hasOwnProperty.call(team, "advances");
      const status = team.reviewNeeded ? "要確認" : hasAdvanceStatus ? (team.advances ? "突破" : "敗退") : "";
      const row = document.createElement("tr");
      if (team.teamId === JAPAN_TEAM_ID) row.classList.add("japan-highlight");
      if (includeGroup && index === 8) row.classList.add("cutline");
      appendCell(row, index + 1);
      if (includeGroup) appendCell(row, team.group);
      const teamCell = appendCell(row, "");
      teamCell.appendChild(teamLabel(team.teamId, team.name));
      appendCell(row, team.points);
      appendCell(row, team.played);
      appendCell(row, team.wins);
      appendCell(row, team.draws);
      appendCell(row, team.losses);
      appendCell(row, team.gf);
      appendCell(row, team.ga);
      appendCell(row, team.gf - team.ga);
      appendCell(row, status);
      body.appendChild(row);
    });
    table.append(head, body);
    return table;
  }

  function calculateKnockoutCards(standings) {
    const resolved = resolveEntrants(standings);
    const rounds = {};
    knockoutStageOrder.forEach((stage) => {
      rounds[stage] = [];
      sortedMatches(computedMatches().filter((match) => match.stage === stage)).forEach((match) => {
        const home = resolveRef(matchHomeId(match), resolved);
        const away = resolveRef(matchAwayId(match), resolved);
        const winnerName = winner(match.match_id, home, away);
        if (winnerName) {
          resolved[`W-${match.match_id}`] = winnerName;
          resolved[`L-${match.match_id}`] = winnerName === home ? away : home;
        }
        rounds[stage].push({
          matchId: match.match_id,
          stage,
          home,
          away,
          score: scoreText(match.match_id),
          winner: winnerName
        });
      });
    });
    return rounds;
  }

  function resolveEntrants(standings) {
    const resolved = {};
    Object.entries(standings || {}).forEach(([group, table]) => {
      if (table.some((team) => team.played < 3) || table.some((team) => team.reviewNeeded)) return;
      if (table[0]) resolved[`1${group}`] = table[0].teamId;
      if (table[1]) resolved[`2${group}`] = table[1].teamId;
      if (table[2]) resolved[`3${group}`] = table[2].teamId;
    });
    return resolved;
  }

  function resolveRef(value, resolved) {
    if (!value) return "TBD";
    if (resolved[value]) return resolved[value];
    if (value.includes("/")) {
      const resolvedOptions = value.split("/").map((part) => resolved[part]).filter(Boolean);
      return resolvedOptions.length === 1 ? resolvedOptions[0] : "TBD";
    }
    if (/^[123][A-L]$/.test(value) || /^[WL]-/.test(value)) return "TBD";
    return value;
  }

  function winner(matchId, homeName, awayName) {
    if (homeName === "TBD" || awayName === "TBD") return "";
    const score = normalizedScore(matchId);
    if (!hasMainScore(score)) return "";
    const homePenalty = scoreNumber(score, "penalty_home");
    const awayPenalty = scoreNumber(score, "penalty_away");
    if (homePenalty !== null && awayPenalty !== null && homePenalty !== awayPenalty) {
      return homePenalty > awayPenalty ? homeName : awayName;
    }
    const homeScore = scoreNumber(score, "score_home");
    const awayScore = scoreNumber(score, "score_away");
    if (homeScore === awayScore) return "";
    return homeScore > awayScore ? homeName : awayName;
  }

  function renderKnockoutSnapshot() {
    if (!state.saved.knockout?.rounds || state.saved.knockout.scoreSignature !== scoreSignature()) {
      return message("まだトーナメントを更新していません。「更新」ボタンで再計算してください。");
    }
    const wrapper = document.createElement("div");
    wrapper.className = "knockout-list";
    knockoutStageOrder.forEach((stage) => {
      const matches = state.saved.knockout.rounds[stage] || [];
      const card = document.createElement("details");
      card.className = "knockout-card";
      card.open = true;
      const heading = document.createElement("summary");
      heading.textContent = stageLabels[stage];
      const list = document.createElement("div");
      list.className = "knockout-round";
      matches.forEach((match) => {
        const row = document.createElement("div");
        row.className = "knockout-match";
        if (match.home === JAPAN_TEAM_ID || match.away === JAPAN_TEAM_ID) row.classList.add("japan-highlight");
        row.append(textDiv(match.matchId), teamLabel(match.home), textDiv(match.score), teamLabel(match.away));
        list.appendChild(row);
      });
      card.append(heading, list);
      wrapper.appendChild(card);
    });
    return wrapper;
  }

  function exportState() {
    return {
      version: 1,
      source: DATA_URL,
      scoreOverrides: state.saved.scoreOverrides,
      lastUpdatedAt: state.saved.lastUpdatedAt,
      standings: state.saved.standings,
      thirdRanking: state.saved.thirdRanking,
      knockout: state.saved.knockout
    };
  }

  function exportToClipboard() {
    const text = JSON.stringify(exportState(), null, 2);
    const fallback = () => window.prompt("スコア/日程JSON", text);
    if (!navigator.clipboard?.writeText) {
      fallback();
      return;
    }
    navigator.clipboard.writeText(text).then(
      () => setSummary("スコア/日程JSONをコピーしました"),
      fallback
    );
  }

  function importFromPrompt() {
    const text = window.prompt("インポートするスコア/日程JSONを貼り付けてください");
    if (!text) return;
    try {
      const payload = JSON.parse(text);
      if (!importState(payload)) throw new Error("scores が見つかりません");
      setSavedLabel("スコア/日程JSONをインポートしました");
    } catch (error) {
      window.alert(`JSONをインポートできませんでした。\n${error.message || error}`);
    }
  }

  function importState(payload) {
    const scoreOverrides = payload?.scoreOverrides && typeof payload.scoreOverrides === "object"
      ? payload.scoreOverrides
      : payload?.scores && typeof payload.scores === "object"
        ? payload.scores
        : payload;
    if (!scoreOverrides || typeof scoreOverrides !== "object") return false;
    state.saved = {
      version: 1,
      scoreOverrides,
      lastUpdatedAt: payload?.lastUpdatedAt || "",
      standings: payload?.standings || null,
      thirdRanking: payload?.thirdRanking || null,
      knockout: payload?.knockout || null
    };
    persist();
    renderContent();
    return true;
  }

  function displayTeam(teamId, fallback = "") {
    if (teamId === "TBD") return "未確定";
    const team = state.teams[teamId];
    const name = team?.name_ja || fallback || teamId;
    return team?.fifa_rank ? `${name}（${team.fifa_rank}位）` : name;
  }

  function matchHomeId(match) {
    return match?.home_team_id || match?.home || "";
  }

  function matchAwayId(match) {
    return match?.away_team_id || match?.away || "";
  }

  function teamFifaCode(teamId) {
    return state.teams[teamId]?.fifa_code || teamId || "";
  }

  function teamFlag(teamId) {
    return state.teams[teamId]?.flag_code || "";
  }

  function teamFlagUrl(teamId) {
    const code = teamFlag(teamId);
    return code ? `assets/flags/${code}.svg` : "";
  }

  function teamLabel(teamId, fallback = "", className = "") {
    const wrapper = document.createElement("span");
    wrapper.className = `team-label ${className}`.trim();
    if (teamId === "TBD") {
      wrapper.textContent = "未確定";
      return wrapper;
    }
    const flagCode = teamFlag(teamId);
    const flagUrl = teamFlagUrl(teamId);
    const fallbackCode = teamFifaCode(teamId);
    const flagSpan = document.createElement("span");
    flagSpan.className = "team-flag";
    flagSpan.setAttribute("aria-hidden", "true");
    if (flagCode && flagUrl) {
      const img = document.createElement("img");
      img.className = "team-flag-img";
      img.src = flagUrl;
      img.alt = "";
      img.loading = "lazy";
      img.decoding = "async";
      img.onerror = () => {
        img.remove();
        flagSpan.textContent = fallbackCode;
      };
      flagSpan.appendChild(img);
    } else {
      flagSpan.textContent = fallbackCode;
    }
    wrapper.appendChild(flagSpan);
    const name = document.createElement("span");
    name.textContent = displayTeam(teamId, fallback || teamId);
    wrapper.appendChild(name);
    return wrapper;
  }

  function logFlagMapping() {
    if (!window.console?.table) return;
    const rows = Object.values(state.teams)
      .sort((a, b) => String(a.team_id).localeCompare(String(b.team_id)))
      .map((team) => ({
        name: team.name_ja,
        team_id: team.team_id,
        fifa_code: team.fifa_code,
        flag_code: team.flag_code,
        flagPath: team.flag_code ? `assets/flags/${team.flag_code}.svg` : ""
      }));
    console.table(rows);
  }

  function textDiv(text, className = "") {
    const div = document.createElement("div");
    if (className) div.className = className;
    div.textContent = text || "";
    return div;
  }

  function textSpan(text, className = "") {
    const span = document.createElement("span");
    if (className) span.className = className;
    span.textContent = text || "";
    return span;
  }

  function venueText(match) {
    const venue = (match.venue || "").trim();
    const city = (match.city || "").trim();
    if (venue && city) return `${venue}（${city}）`;
    if (venue) return venue;
    return "会場未定";
  }

  function appendCell(row, value) {
    const cell = document.createElement("td");
    cell.textContent = value ?? "";
    row.appendChild(cell);
    return cell;
  }

  function message(text, className = "tournament-empty") {
    const empty = document.createElement("div");
    empty.className = className;
    empty.textContent = text;
    return empty;
  }

  function setSavedLabel(text) {
    if (state.elements.saveState) state.elements.saveState.textContent = text;
  }

  function setSummary(text) {
    if (state.elements.summary) state.elements.summary.textContent = text;
  }

  window.WorldCupTournament = {
    init,
    renderContent,
    updateTournamentSnapshots,
    exportState,
    importState
  };
})();
