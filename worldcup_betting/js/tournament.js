(function () {
  const STORAGE_KEY = "worldcup2026_tournament_state";
  const DATA_URL = "data/worldcup2026_matches.json";
  const JAPAN_TEAM_ID = "JPN";

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

  const state = {
    initialized: false,
    loaded: false,
    loadError: "",
    view: "japan",
    matches: [],
    teams: {},
    groupFilter: "all",
    saved: loadSavedState(),
    elements: {}
  };

  function init() {
    if (state.initialized) return;
    state.elements = {
      tabs: Array.from(document.querySelectorAll(".tournament-tab")),
      content: document.getElementById("tournamentContent"),
      summary: document.getElementById("tournamentSummary"),
      updateStandingsButton: document.getElementById("standingsUpdateButton"),
      updateThirdsButton: document.getElementById("thirdRankingUpdateButton"),
      updateKnockoutButton: document.getElementById("knockoutUpdateButton"),
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
    state.elements.updateStandingsButton?.addEventListener("click", updateStandings);
    state.elements.updateThirdsButton?.addEventListener("click", updateThirdRanking);
    state.elements.updateKnockoutButton?.addEventListener("click", updateKnockout);
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
      state.matches = Array.isArray(payload.matches) ? payload.matches : [];
      state.teams = buildTeamMap(payload.teams, state.matches);
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
      teams[match.home] ||= { team_id: match.home, name_ja: match.home_name_ja || match.home, fifa_code: match.home, flag_code: match.home.toLowerCase(), flag_url: "", group: match.group };
      teams[match.away] ||= { team_id: match.away, name_ja: match.away_name_ja || match.away, fifa_code: match.away, flag_code: match.away.toLowerCase(), flag_url: "", group: match.group };
    });
    return teams;
  }

  function loadSavedState() {
    const fallback = {
      version: 1,
      scores: {},
      lastUpdatedAt: "",
      standings: null,
      thirdRanking: null,
      knockout: null
    };
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      return {
        ...fallback,
        ...parsed,
        scores: parsed?.scores && typeof parsed.scores === "object" ? parsed.scores : {}
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

    const scoreCount = Object.keys(state.saved.scores).filter((matchId) => hasAnyScore(state.saved.scores[matchId])).length;
    if (summary) {
      const updated = state.saved.lastUpdatedAt ? ` / 最終更新 ${formatDateTime(state.saved.lastUpdatedAt)}` : "";
      summary.textContent = `本大会のみ / 全${state.matches.length}試合 / スコア保存 ${scoreCount}試合${updated}`;
    }

    if (state.view === "japan") {
      content.appendChild(renderMatchList(state.matches.filter(isJapanMatch)));
    } else if (state.view === "schedule") {
      content.appendChild(renderMatchList(filterByGroup(state.matches)));
    } else if (state.view === "groups") {
      content.appendChild(renderStandingsSnapshot());
    } else if (state.view === "thirds") {
      content.appendChild(renderThirdRankingSnapshot());
    } else {
      content.appendChild(renderKnockoutSnapshot());
    }
  }

  function isJapanMatch(match) {
    return match.home === JAPAN_TEAM_ID || match.away === JAPAN_TEAM_ID;
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
    if (match.home === JAPAN_TEAM_ID || match.away === JAPAN_TEAM_ID) {
      card.classList.add("japan-highlight");
    }
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
      textDiv(match.kickoff_jst || "JST未入力"),
      textDiv(match.venue || "")
    );

    const teams = document.createElement("div");
    teams.className = "match-teams";
    teams.append(
      teamLabel(match.home, match.home_name_ja, "match-team"),
      textDiv(scoreText(match.match_id), "match-score-display"),
      teamLabel(match.away, match.away_name_ja, "match-team away")
    );

    body.append(meta, teams, createScoreEditor(match.match_id));
    card.append(summary, body);
    return card;
  }

  function matchTitle(match) {
    const wrapper = document.createElement("div");
    wrapper.className = "match-title";
    wrapper.append(teamLabel(match.home, match.home_name_ja), textDiv("vs"), teamLabel(match.away, match.away_name_ja));
    return wrapper;
  }

  function statusBadge(matchId) {
    const status = matchStatus(matchId);
    const badge = document.createElement("div");
    badge.className = `match-status ${status.className}`;
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
    const current = state.saved.scores[matchId] || {};
    if (value === "") {
      delete current[key];
    } else {
      current[key] = value;
    }
    state.saved.scores[matchId] = current;
    state.saved.lastUpdatedAt = new Date().toISOString();
    persist();
    if (state.elements.saveState) state.elements.saveState.textContent = "スコア保存済み";
  }

  function normalizedScore(matchId) {
    const score = state.saved.scores[matchId] || {};
    const match = state.matches.find((item) => item.match_id === matchId) || {};
    return {
      score_home: valueOrEmpty(score.score_home ?? match.score_home),
      score_away: valueOrEmpty(score.score_away ?? match.score_away),
      penalty_home: valueOrEmpty(score.penalty_home ?? match.penalty_home),
      penalty_away: valueOrEmpty(score.penalty_away ?? match.penalty_away)
    };
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

  function updateStandings() {
    state.saved.standings = {
      updatedAt: new Date().toISOString(),
      groups: calculateGroupTables()
    };
    persist();
    state.view = "groups";
    renderContent();
    setSavedLabel("順位を更新しました");
  }

  function updateThirdRanking() {
    const standings = state.saved.standings?.groups || calculateGroupTables();
    const thirds = Object.values(standings)
      .map((table) => table[2])
      .filter(Boolean)
      .sort(sortStats)
      .map((team, index, list) => ({
        ...team,
        reviewNeeded: team.reviewNeeded || tiedWithAny(team, list),
        advances: index < 8
      }));
    state.saved.thirdRanking = {
      updatedAt: new Date().toISOString(),
      teams: thirds
    };
    persist();
    state.view = "thirds";
    renderContent();
    setSavedLabel("3位ランキングを更新しました");
  }

  function updateKnockout() {
    const standings = state.saved.standings?.groups || calculateGroupTables();
    state.saved.knockout = {
      updatedAt: new Date().toISOString(),
      rounds: calculateKnockoutCards(standings)
    };
    persist();
    state.view = "knockout";
    renderContent();
    setSavedLabel("トーナメントを更新しました");
  }

  function calculateGroupTables() {
    const tables = {};
    state.matches.filter((match) => match.stage === "group").forEach((match) => {
      [match.home, match.away].forEach((teamId) => {
        tables[match.group] ||= {};
        tables[match.group][teamId] ||= createTeamStats(teamId, match.group);
      });
      const score = normalizedScore(match.match_id);
      if (!hasMainScore(score)) return;
      const homeScore = scoreNumber(score, "score_home");
      const awayScore = scoreNumber(score, "score_away");
      const home = tables[match.group][match.home];
      const away = tables[match.group][match.away];
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
    if (!state.saved.standings?.groups) {
      return message("まだ順位を更新していません。「順位を更新」ボタンで再計算してください。");
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
    if (!state.saved.thirdRanking?.teams) {
      return message("まだ3位ランキングを更新していません。「3位ランキングを更新」ボタンで再計算してください。");
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
      sortedMatches(state.matches.filter((match) => match.stage === stage)).forEach((match) => {
        const home = resolveRef(match.home, resolved);
        const away = resolveRef(match.away, resolved);
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
    if (!state.saved.knockout?.rounds) {
      return message("まだトーナメントを更新していません。「トーナメントを更新」ボタンで再計算してください。");
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
      scores: state.saved.scores,
      lastUpdatedAt: state.saved.lastUpdatedAt,
      standings: state.saved.standings,
      thirdRanking: state.saved.thirdRanking,
      knockout: state.saved.knockout
    };
  }

  function exportToClipboard() {
    const text = JSON.stringify(exportState(), null, 2);
    const fallback = () => window.prompt("本大会管理JSON", text);
    if (!navigator.clipboard?.writeText) {
      fallback();
      return;
    }
    navigator.clipboard.writeText(text).then(
      () => setSummary("本大会管理JSONをコピーしました"),
      fallback
    );
  }

  function importFromPrompt() {
    const text = window.prompt("インポートする本大会管理JSONを貼り付けてください");
    if (!text) return;
    try {
      const payload = JSON.parse(text);
      if (!importState(payload)) throw new Error("scores が見つかりません");
      setSavedLabel("本大会管理JSONをインポートしました");
    } catch (error) {
      window.alert(`JSONをインポートできませんでした。\n${error.message || error}`);
    }
  }

  function importState(payload) {
    const scores = payload?.scores && typeof payload.scores === "object" ? payload.scores : payload;
    if (!scores || typeof scores !== "object") return false;
    state.saved = {
      version: 1,
      scores,
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
    return state.teams[teamId]?.name_ja || fallback || teamId;
  }

  function teamFlag(teamId) {
    return state.teams[teamId]?.flag_code || state.teams[teamId]?.fifa_code || "";
  }

  function teamFlagUrl(teamId) {
    return state.teams[teamId]?.flag_url || "";
  }

  function teamText(teamId, fallback = "") {
    if (teamId === "TBD") return "未確定";
    return displayTeam(teamId, fallback || teamId);
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
    if (flagCode || flagUrl) {
      const flagSpan = document.createElement("span");
      flagSpan.className = "team-flag";
      if (flagUrl) {
        const img = document.createElement("img");
        img.className = "team-flag-img";
        img.src = flagUrl;
        img.alt = "";
        img.loading = "lazy";
        img.decoding = "async";
        img.onerror = () => {
          img.remove();
          flagSpan.textContent = flagCode;
        };
        flagSpan.appendChild(img);
      } else {
        flagSpan.textContent = flagCode;
      }
      wrapper.appendChild(flagSpan);
    }
    const name = document.createElement("span");
    name.textContent = displayTeam(teamId, fallback || teamId);
    wrapper.appendChild(name);
    return wrapper;
  }

  function appendCell(row, value) {
    const cell = document.createElement("td");
    cell.textContent = value ?? "";
    row.appendChild(cell);
    return cell;
  }

  function textDiv(text, className = "") {
    const div = document.createElement("div");
    if (className) div.className = className;
    div.textContent = text || "";
    return div;
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

  function formatDateTime(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  window.WorldCupTournament = {
    init,
    renderContent,
    updateStandings,
    updateThirdRanking,
    updateKnockout,
    exportState,
    importState
  };
})();
