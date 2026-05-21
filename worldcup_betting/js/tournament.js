(function () {
  const STORAGE_KEY = "worldcup2026_tournament_state";
  const DATA_URL = "data/worldcup2026_matches.json";
  const KNOCKOUT_MAPPING_URL = "data/knockout_mapping.json";
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

  const scheduleStageOrder = ["group", ...knockoutStageOrder];
  const weekdayLabels = ["日", "月", "火", "水", "木", "金", "土"];

  const defaultCountryNotes = [
    ["JPN", "日本", "日本代表。全試合を観戦軸にする", "久保建英、遠藤航、堂安律、鈴木彩艶", "組織力、切り替え、2列目の質", "強豪相手の自陣耐久、セットプレー対応", "オランダ級には守備時間の整理が鍵", "試合前後の空気まで残す"],
    ["NED", "オランダ", "日本の同組かつFIFA上位", "ファン・ダイク、フレンキー・デ・ヨング", "高さ、個の強度、中央の展開力", "押し込まれた時の運動量", "日本は速い切り替えで背後を狙いたい", "日本戦の最大基準点"],
    ["TUN", "チュニジア", "日本の同組", "守備陣、カウンターの前線", "守備ブロック、球際", "得点力の波", "日本がボールを持つ展開になりやすい", "取りこぼせない相手として見る"],
    ["SWE", "スウェーデン", "日本の同組", "イサク、クルゼフスキ", "高さ、前線の個、セットプレー", "細かい連係への対応", "日本は地上戦と背後管理が重要", "プレミア勢の質をチェック"],
    ["ARG", "アルゼンチン", "FIFAランキングが日本以上、レジェンド枠", "メッシ、ラウタロ", "勝負強さ、前線の決定力", "世代交代の揺れ", "日本は守備の集中が最優先", "レジェンドの状態を追う"],
    ["FRA", "フランス", "FIFAランキングが日本以上、プレミア勢も注目", "エムバペ、グリーズマン、サリバ", "個の破壊力、選手層", "主力依存とコンディション", "日本はサイド裏と中盤守備が鍵", "優勝候補の基準値"],
    ["ENG", "イングランド", "プレミア勢が多い国", "ベリンガム、フォーデン、ケイン", "プレミア基準の強度、2列目", "重圧下の試合運び", "日本は守備ブロックとカウンター", "プレミア選手の状態を見る"],
    ["BRA", "ブラジル", "FIFAランキングが日本以上、レジェンド候補多数", "ヴィニシウス、ロドリゴ", "個人技、前線のスピード", "守備の距離感", "日本は奪った後の一手が重要", "スター選手の見どころが多い"],
    ["CAN", "カナダ", "開催国", "デイヴィス、デイヴィッド", "推進力、ホーム環境", "守備の安定感", "日本とはスピード勝負に注意", "開催国の雰囲気込みで見る"],
    ["MEX", "メキシコ", "開催国", "ヒメネス、ロサーノ", "ホーム熱量、技術", "守備の切り替え", "日本はテンポを乱されないこと", "開幕戦と会場熱を確認"],
    ["USA", "アメリカ", "開催国、プレミア関係選手も多い", "プリシッチ、マッケニー、レイナ", "運動量、若さ、ホーム環境", "試合運びの成熟度", "日本は中盤の強度勝負", "北米大会の主役候補"]
  ].map(([id, country, reason, keyPlayers, strengths, weaknesses, japanFit, comment]) => ({
    id,
    country,
    reason,
    keyPlayers,
    strengths,
    weaknesses,
    japanFit,
    comment,
    sourceUrl: "",
    updatedAt: "2026-05-21"
  }));

  const defaultStarPlayers = [
    ["kubo", "久保建英", "日本", "レアル・ソシエダ", "ラ・リーガ", "なし", "なし", "主力", "日本の攻撃の中心。右サイド、中央で違いを作れるか", "高", "選出想定", "確認中"],
    ["endo", "遠藤航", "日本", "リバプール", "プレミアリーグ", "現所属", "なし", "ベテラン", "強豪相手の中盤防波堤。球際と回収力", "高", "選出想定", "確認中"],
    ["van_dijk", "フィルジル・ファン・ダイク", "オランダ", "リバプール", "プレミアリーグ", "現所属", "なし", "ベテラン", "空中戦と最終ライン統率", "高", "選出状況確認", "確認中"],
    ["isak", "アレクサンデル・イサク", "スウェーデン", "ニューカッスル", "プレミアリーグ", "現所属", "なし", "主力", "高さと足元を兼ねるCF。日本戦の危険人物", "高", "選出状況確認", "確認中"],
    ["kulusevski", "デヤン・クルゼフスキ", "スウェーデン", "トッテナム", "プレミアリーグ", "現所属", "なし", "主力", "右サイドからの運びと左足", "中", "選出状況確認", "確認中"],
    ["foden", "フィル・フォーデン", "イングランド", "マンチェスター・シティ", "プレミアリーグ", "現所属", "現所属", "主力", "狭い場所でのターンと左足", "高", "選出状況確認", "確認中"],
    ["de_bruyne", "ケヴィン・デ・ブライネ", "ベルギー", "ナポリ", "セリエA", "元プレミア", "元所属", "レジェンド/ベテラン", "一発のパスと試合を変える力", "高", "選出状況確認", "確認中"],
    ["messi", "リオネル・メッシ", "アルゼンチン", "インテル・マイアミ", "MLS", "なし", "なし", "レジェンド", "最後の大舞台になる可能性。プレー時間と状態に注目", "高", "選出状況確認", "確認中"],
    ["mbappe", "キリアン・エムバペ", "フランス", "レアル・マドリード", "ラ・リーガ", "なし", "なし", "主力", "背後へのスピードと決定力", "高", "選出状況確認", "確認中"],
    ["pulisic", "クリスチャン・プリシッチ", "アメリカ", "ミラン", "セリエA", "元プレミア", "なし", "主力", "開催国の攻撃の顔。ドリブルと決定力", "中", "選出状況確認", "確認中"]
  ].map(([id, name, country, club, league, premierRelation, cityRelation, legendType, highlight, risk, selectionStatus, condition]) => ({
    id,
    name,
    country,
    club,
    league,
    premierRelation,
    cityRelation,
    legendType,
    highlight,
    risk,
    selectionStatus,
    condition,
    sourceUrl: "",
    updatedAt: "2026-05-21"
  }));

  const defaultVenues = [
    ["toronto", "Toronto", "カナダ", "東部", "Toronto Stadium", "America/Toronto", "夏時間: 日本より13時間遅れ", "開閉式屋根なし", "五大湖沿いで比較的涼しい", "東部拠点。米国東海岸との移動は短め", "日本戦なら朝時間の観戦になりやすい", 585, 165],
    ["vancouver", "Vancouver", "カナダ", "西部", "BC Place Vancouver", "America/Vancouver", "夏時間: 日本より16時間遅れ", "屋根あり", "西海岸で穏やか", "西海岸内の移動は比較的組みやすい", "日本時間は午前帯になりやすい", 205, 185],
    ["seattle", "Seattle", "アメリカ", "西部", "Seattle Stadium", "America/Los_Angeles", "夏時間: 日本より16時間遅れ", "屋根なし", "涼しめ、雨に注意", "バンクーバーと近い", "移動負担は小さめ", 230, 220],
    ["san-francisco", "San Francisco Bay Area", "アメリカ", "西部", "San Francisco Bay Area Stadium", "America/Los_Angeles", "夏時間: 日本より16時間遅れ", "屋根なし", "乾燥、夜は涼しい", "西海岸移動の中心", "日本時間は午前帯", 220, 320],
    ["los-angeles", "Los Angeles", "アメリカ", "西部", "Los Angeles Stadium", "America/Los_Angeles", "夏時間: 日本より16時間遅れ", "屋根あり", "暑さと乾燥に注意", "西海岸の大拠点", "スター感のある会場", 245, 385],
    ["guadalajara", "Guadalajara", "メキシコ", "中部", "Guadalajara Stadium", "America/Mexico_City", "夏時間なし想定: 日本より15時間遅れ", "屋根なし", "高地、暑さに注意", "メキシコ国内移動", "標高と環境を確認", 365, 520],
    ["mexico-city", "Mexico City", "メキシコ", "中部", "Mexico City Stadium", "America/Mexico_City", "夏時間なし想定: 日本より15時間遅れ", "屋根なし", "高地、空気の薄さ", "メキシコ国内の中心", "開幕戦の熱量", 420, 535],
    ["monterrey", "Monterrey", "メキシコ", "北部", "Monterrey Stadium", "America/Monterrey", "夏時間なし想定: 日本より15時間遅れ", "屋根なし", "暑さに注意", "米国南部と近い", "暑熱対応を見たい", 405, 460],
    ["houston", "Houston", "アメリカ", "南部", "Houston Stadium", "America/Chicago", "夏時間: 日本より14時間遅れ", "屋根あり/空調あり", "高温多湿", "ダラス、カンザスシティへ移動しやすい", "屋内環境でプレーしやすい", 505, 440],
    ["dallas", "Dallas", "アメリカ", "南部", "Dallas Stadium", "America/Chicago", "夏時間: 日本より14時間遅れ", "屋根あり/空調あり", "暑いが屋内環境", "米国中南部の大拠点", "決勝級の大型会場感", 505, 385],
    ["kansas-city", "Kansas City", "アメリカ", "中西部", "Kansas City Stadium", "America/Chicago", "夏時間: 日本より14時間遅れ", "屋根なし", "暑さと雷雨に注意", "中西部移動の中継点", "雰囲気が強そう", 535, 330],
    ["atlanta", "Atlanta", "アメリカ", "南東部", "Atlanta Stadium", "America/New_York", "夏時間: 日本より13時間遅れ", "屋根あり/空調あり", "高温多湿だが屋内", "東部、南部の移動拠点", "屋内でテンポが出そう", 650, 410],
    ["miami", "Miami", "アメリカ", "南東部", "Miami Stadium", "America/New_York", "夏時間: 日本より13時間遅れ", "屋根あり", "暑熱と湿度", "南東端で移動距離は長め", "コンディション差に注目", 700, 500],
    ["philadelphia", "Philadelphia", "アメリカ", "東部", "Philadelphia Stadium", "America/New_York", "夏時間: 日本より13時間遅れ", "屋根なし", "暑さは中程度", "NY/NJ、Bostonと近い", "東海岸連戦向き", 720, 285],
    ["new-york-new-jersey", "New York New Jersey", "アメリカ", "東部", "New York New Jersey Stadium", "America/New_York", "夏時間: 日本より13時間遅れ", "屋根なし", "夏は蒸し暑い", "東海岸の中心", "決勝会場。雰囲気重視", 735, 250],
    ["boston", "Boston", "アメリカ", "東部", "Boston Stadium", "America/New_York", "夏時間: 日本より13時間遅れ", "屋根なし", "比較的涼しめ", "東海岸北部", "早朝観戦になりやすい", 760, 205]
  ].map(([id, city, country, region, stadium, timezone, jstDiff, roofAir, climateMemo, travelMemo, watchMemo, x, y]) => ({
    id,
    city,
    country,
    region,
    stadium,
    timezone,
    jstDiff,
    roofAir,
    climateMemo,
    travelMemo,
    watchMemo,
    x,
    y
  }));

  const state = {
    initialized: false,
    loaded: false,
    loadError: "",
    view: "japan",
    matches: [],
    teams: {},
    knockoutMapping: {},
    groupFilter: "all",
    scheduleStatusFilter: "all",
    scheduleSort: "date",
    scheduleOpenStages: { group: true },
    calendarMode: "month",
    calendarDate: null,
    selectedVenueId: "toronto",
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
      sharedUrlInput: document.getElementById("sharedScoreUrlInput"),
      sharedUrlButton: document.getElementById("sharedScoreUrlButton"),
      sharedTextInput: document.getElementById("sharedScoreTextInput"),
      sharedTextButton: document.getElementById("sharedScoreTextButton"),
      sharedStatus: document.getElementById("sharedScoreStatus"),
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
    state.elements.sharedUrlButton?.addEventListener("click", loadSharedScoreUrl);
    state.elements.sharedTextButton?.addEventListener("click", importSharedScoreText);
    if (state.elements.sharedUrlInput) {
      state.elements.sharedUrlInput.value = state.saved.sharedScoreUrl || "";
    }

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
      state.knockoutMapping = await loadKnockoutMapping();
      logFlagMapping();
      state.calendarDate = firstMatchDate() || new Date("2026-06-12T00:00:00+09:00");
      state.loaded = true;
      state.loadError = "";
    } catch (error) {
      state.loadError = `${DATA_URL} を読み込めませんでした: ${error.message || error}`;
    }
    renderContent();
    renderActiveAuxView();
  }

  function renderActiveAuxView() {
    const active = document.querySelector(".owner-tab.active")?.dataset.view;
    if (["country-notes", "star-players", "venues"].includes(active)) renderAuxView(active);
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
      sharedScoreOverrides: {},
      sharedScoreUrl: "",
      sharedScoreLoadedAt: "",
      lastUpdatedAt: "",
      matchNotes: {},
      countryNotes: {},
      starPlayers: {},
      venueNotes: {},
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
        sharedScoreOverrides: parsed?.sharedScoreOverrides && typeof parsed.sharedScoreOverrides === "object" ? parsed.sharedScoreOverrides : {},
        sharedScoreUrl: parsed?.sharedScoreUrl || fallback.sharedScoreUrl,
        sharedScoreLoadedAt: parsed?.sharedScoreLoadedAt || fallback.sharedScoreLoadedAt,
        lastUpdatedAt: parsed?.lastUpdatedAt || fallback.lastUpdatedAt,
        matchNotes: parsed?.matchNotes && typeof parsed.matchNotes === "object" ? parsed.matchNotes : {},
        countryNotes: parsed?.countryNotes && typeof parsed.countryNotes === "object" ? parsed.countryNotes : {},
        starPlayers: parsed?.starPlayers && typeof parsed.starPlayers === "object" ? parsed.starPlayers : {},
        venueNotes: parsed?.venueNotes && typeof parsed.venueNotes === "object" ? parsed.venueNotes : {},
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
      if (summary) summary.textContent = `読み込み失敗: ${state.loadError}`;
      return;
    }
    if (!state.loaded) {
      content.appendChild(message(`${DATA_URL} を読み込み中...`));
      if (summary) summary.textContent = "スコア/日程データを読み込み中...";
      return;
    }

    const scoreCount = savedScoreCount();
    if (summary) {
      const updated = state.saved.lastUpdatedAt ? ` / 最終更新 ${formatSavedDateTime(state.saved.lastUpdatedAt)}` : "";
      const shared = state.saved.sharedScoreLoadedAt ? ` / 共有JSON ${formatSavedDateTime(state.saved.sharedScoreLoadedAt)}` : "";
      summary.textContent = `スコア/日程 / 全${state.matches.length}試合 / スコア保存 ${scoreCount}試合${updated}${shared}`;
    }
    updateSharedScoreStatus();

    if (state.view === "japan") {
      content.appendChild(renderMatchList(computedSchedule().filter(isJapanMatch)));
    } else if (state.view === "schedule") {
      content.appendChild(renderScheduleView(filterByGroup(computedSchedule())));
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

  function renderScheduleView(matches) {
    const wrapper = document.createElement("div");
    wrapper.className = "schedule-view";
    wrapper.appendChild(createScheduleControls());

    const filtered = matches.filter((match) => {
      if (state.scheduleStatusFilter === "all") return true;
      return matchStatusKey(match.match_id) === state.scheduleStatusFilter;
    });

    const grouped = groupMatchesByStage(sortScheduleMatches(filtered));
    const list = document.createElement("div");
    list.className = "schedule-phase-list";
    scheduleStageOrder.forEach((stage) => {
      const stageMatches = grouped[stage] || [];
      if (stageMatches.length === 0 && state.scheduleStatusFilter !== "all") return;
      const details = document.createElement("details");
      details.className = "schedule-phase";
      details.open = state.scheduleOpenStages[stage] ?? stage === "group";
      details.addEventListener("toggle", () => {
        state.scheduleOpenStages[stage] = details.open;
        updateScheduleSummaryArrow(details);
      });

      const summary = document.createElement("summary");
      summary.className = "schedule-phase-summary";
      const enteredCount = stageMatches.filter((match) => ["entered", "pk"].includes(matchStatusKey(match.match_id))).length;
      summary.append(
        textSpan(details.open ? "▼" : "▶", "schedule-phase-arrow"),
        textSpan(stageLabels[stage] || stage, "schedule-phase-title"),
        textSpan(`${stageMatches.length}試合`, "schedule-phase-count"),
        textSpan(`入力済み${enteredCount}試合`, "schedule-phase-count")
      );

      const phaseList = document.createElement("div");
      phaseList.className = "match-list schedule-phase-matches";
      if (stageMatches.length === 0) {
        phaseList.appendChild(message("表示できる試合がありません"));
      } else {
        stageMatches.forEach((match) => phaseList.appendChild(createMatchCard(match)));
      }
      details.append(summary, phaseList);
      list.appendChild(details);
    });

    if (!list.children.length) list.appendChild(message("条件に一致する試合がありません"));
    wrapper.appendChild(list);
    return wrapper;
  }

  function createScheduleControls() {
    const controls = document.createElement("div");
    controls.className = "schedule-controls";
    controls.append(
      createSelectControl("表示", state.scheduleStatusFilter, [
        ["all", "全て"],
        ["unentered", "未入力"],
        ["entered", "入力済み"],
        ["pk", "PKあり"],
        ["review", "要確認"]
      ], (value) => {
        state.scheduleStatusFilter = value;
        renderContent();
      }),
      createSelectControl("並び順", state.scheduleSort, [
        ["date", "日時順"],
        ["unentered_first", "未入力を上"],
        ["entered_first", "入力済みを上"]
      ], (value) => {
        state.scheduleSort = value;
        renderContent();
      })
    );
    return controls;
  }

  function createSelectControl(labelText, value, options, onChange) {
    const label = document.createElement("label");
    label.className = "schedule-control";
    label.appendChild(textSpan(labelText));
    const select = document.createElement("select");
    options.forEach(([optionValue, text]) => {
      const option = document.createElement("option");
      option.value = optionValue;
      option.textContent = text;
      select.appendChild(option);
    });
    select.value = value;
    select.addEventListener("change", () => onChange(select.value));
    label.appendChild(select);
    return label;
  }

  function updateScheduleSummaryArrow(details) {
    const arrow = details.querySelector(".schedule-phase-arrow");
    if (arrow) arrow.textContent = details.open ? "▼" : "▶";
  }

  function groupMatchesByStage(matches) {
    return matches.reduce((groups, match) => {
      groups[match.stage] ||= [];
      groups[match.stage].push(match);
      return groups;
    }, {});
  }

  function sortScheduleMatches(matches) {
    const sorted = sortedMatches(matches);
    if (state.scheduleSort === "date") return sorted;
    const priority = state.scheduleSort === "unentered_first"
      ? { unentered: 0, review: 1, entered: 2, pk: 3 }
      : { entered: 0, pk: 1, review: 2, unentered: 3 };
    return sorted.sort((a, b) => (priority[matchStatusKey(a.match_id)] ?? 9) - (priority[matchStatusKey(b.match_id)] ?? 9));
  }

  function createMatchCard(match) {
    const card = document.createElement("article");
    card.className = "match-card";
    if (isJapanMatch(match)) card.classList.add("japan-highlight");

    const body = document.createElement("div");
    body.className = "match-card-body";

    const meta = document.createElement("div");
    meta.className = "match-meta";
    meta.append(
      textDiv(match.match_id, "match-id"),
      textDiv(stageLabels[match.stage] || match.stage),
      textDiv(match.group ? `Group ${match.group}` : "", "match-group"),
      textDiv(formatJstDateTime(match.kickoff_jst), "match-jst"),
      textDiv(venueText(match), "match-venue")
    );

    const teams = document.createElement("div");
    teams.className = "match-teams";
    teams.append(
      participantLabel(matchHomeId(match), match.home_name_ja, "match-team"),
      textDiv(scoreText(match.match_id), "match-score-display"),
      participantLabel(matchAwayId(match), match.away_name_ja, "match-team away")
    );

    const play = document.createElement("div");
    play.className = "match-play";
    play.append(teams, statusBadge(match.match_id), createScoreEditor(match.match_id));

    body.append(meta, play);
    card.append(body, createMatchWatchPanel(match));
    return card;
  }

  function createMatchWatchPanel(match) {
    const note = matchNote(match.match_id);
    const panel = document.createElement("div");
    panel.className = "match-watch-panel";
    panel.append(
      watchSelect(match.match_id, "watchPlan", "観戦予定", note.watchPlan, [
        ["", "未設定"],
        ["live", "観戦予定"],
        ["highlight", "ハイライトで見る"],
        ["result", "結果だけでよい"],
        ["skip", "見ない"]
      ]),
      watchSelect(match.match_id, "attention", "注目度", note.attention, [
        ["", "未設定"],
        ["5", "★★★★★"],
        ["4", "★★★★"],
        ["3", "★★★"],
        ["2", "★★"],
        ["1", "★"]
      ]),
      watchTextarea(match.match_id, "preComment", "試合前コメント", note.preComment, "見る理由・注目ポイント"),
      watchTextarea(match.match_id, "oneLineComment", "1行コメント", note.oneLineComment, "見る理由 / 結果だけでよい理由"),
      watchTextarea(match.match_id, "postMemo", "試合後メモ", note.postMemo, "結果、印象、後で見返す点"),
      watchCheckbox(match.match_id, "highlightChecked", "ハイライト確認", note.highlightChecked),
      mapButton(match)
    );
    return panel;
  }

  function watchSelect(matchId, key, labelText, value, options) {
    const label = document.createElement("label");
    label.className = "watch-field";
    label.appendChild(textSpan(labelText));
    const select = document.createElement("select");
    options.forEach(([optionValue, text]) => {
      const option = document.createElement("option");
      option.value = optionValue;
      option.textContent = text;
      select.appendChild(option);
    });
    select.value = value || "";
    select.addEventListener("change", () => updateMatchNote(matchId, key, select.value));
    label.appendChild(select);
    return label;
  }

  function watchTextarea(matchId, key, labelText, value, placeholder) {
    const label = document.createElement("label");
    label.className = "watch-field";
    label.appendChild(textSpan(labelText));
    const textarea = document.createElement("textarea");
    textarea.value = value || "";
    textarea.placeholder = placeholder || "";
    textarea.addEventListener("input", () => updateMatchNote(matchId, key, textarea.value));
    label.appendChild(textarea);
    return label;
  }

  function watchCheckbox(matchId, key, labelText, checked) {
    const label = document.createElement("label");
    label.className = "watch-checkbox";
    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = Boolean(checked);
    input.addEventListener("change", () => updateMatchNote(matchId, key, input.checked));
    label.append(input, document.createTextNode(labelText));
    return label;
  }

  function mapButton(match) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "utility-button watch-map-button";
    button.textContent = "地図で見る";
    button.addEventListener("click", () => openVenueFromMatch(match));
    return button;
  }

  function statusBadge(matchId) {
    const status = matchStatus(matchId);
    const badge = document.createElement("div");
    badge.className = `match-status ${status.className}`.trim();
    badge.textContent = status.label;
    return badge;
  }

  function matchStatus(matchId) {
    const statusKey = matchStatusKey(matchId);
    if (statusKey === "review") return { label: "要確認", className: "review" };
    if (statusKey === "unentered") return { label: "未入力", className: "" };
    if (statusKey === "pk") return { label: "PKあり", className: "pk" };
    return { label: "入力済み", className: "entered" };
  }

  function matchStatusKey(matchId) {
    const score = normalizedScore(matchId);
    const main = [score.score_home, score.score_away];
    const penalties = [score.penalty_home, score.penalty_away];
    const hasMain = main.map((value) => value !== "");
    const hasPenalty = penalties.map((value) => value !== "");
    const allEmpty = [...main, ...penalties].every((value) => value === "");
    if (allEmpty) return "unentered";
    if ([...main, ...penalties].some((value) => value !== "" && !isNumericScore(value))) return "review";
    if (hasMain[0] !== hasMain[1]) return "review";
    if (!hasMain[0] && (hasPenalty[0] || hasPenalty[1])) return "review";
    if (hasPenalty[0] !== hasPenalty[1]) return "review";
    if (hasMain[0] && hasPenalty[0]) return "pk";
    if (hasMain[0]) return "entered";
    return "review";
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

  function matchNote(matchId) {
    return state.saved.matchNotes?.[matchId] || {};
  }

  function updateMatchNote(matchId, key, value) {
    state.saved.matchNotes ||= {};
    const current = { ...(state.saved.matchNotes[matchId] || {}) };
    if (value === "" || value === false || value === null || value === undefined) {
      delete current[key];
    } else {
      current[key] = value;
    }
    if (Object.keys(current).length) {
      state.saved.matchNotes[matchId] = current;
    } else {
      delete state.saved.matchNotes[matchId];
    }
    state.saved.lastUpdatedAt = new Date().toISOString();
    persist();
    setSavedLabel("観戦メモ保存済み");
  }

  function openVenueFromMatch(match) {
    const city = normalizeCity(match.city || "");
    const venue = defaultVenues.find((item) => normalizeCity(item.city) === city);
    if (venue) state.selectedVenueId = venue.id;
    document.querySelector('[data-view="venues"]')?.click();
    renderAuxView("venues");
  }

  function normalizedScore(matchId) {
    const score = state.saved.scoreOverrides[matchId] || {};
    const sharedScore = state.saved.sharedScoreOverrides?.[matchId] || {};
    const match = state.matches.find((item) => item.match_id === matchId) || {};
    return {
      score_home: valueOrEmpty(score.score_home ?? sharedScore.score_home ?? match.score_home),
      score_away: valueOrEmpty(score.score_away ?? sharedScore.score_away ?? match.score_away),
      penalty_home: valueOrEmpty(score.penalty_home ?? sharedScore.penalty_home ?? match.penalty_home),
      penalty_away: valueOrEmpty(score.penalty_away ?? sharedScore.penalty_away ?? match.penalty_away)
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

  function computedSchedule() {
    const knockoutByMatch = currentKnockoutByMatch();
    return computedMatches().map((match) => {
      const knockoutMatch = knockoutByMatch[match.match_id];
      if (!knockoutMatch) return match;
      const home = normalizeScheduleParticipant(knockoutMatch.home);
      const away = normalizeScheduleParticipant(knockoutMatch.away);
      return {
        ...match,
        home_team_id: home.teamId,
        away_team_id: away.teamId,
        home: home.teamId,
        away: away.teamId,
        home_name_ja: home.label,
        away_name_ja: away.label
      };
    });
  }

  function currentKnockoutByMatch() {
    if (!state.saved.knockout?.rounds || state.saved.knockout.scoreSignature !== scoreSignature()) return {};
    const map = {};
    Object.values(state.saved.knockout.rounds).forEach((matches) => {
      (matches || []).forEach((match) => {
        map[match.matchId] = match;
      });
    });
    return map;
  }

  function normalizeScheduleParticipant(value) {
    if (isResolvedTeam(value)) return { teamId: value, label: displayTeam(value) };
    const label = value && value !== "TBD" ? value : "未確定";
    return { teamId: "TBD", label };
  }

  function savedScoreCount() {
    return Object.keys(effectiveScoreOverrides()).filter((matchId) => hasMainScore(normalizedScore(matchId))).length;
  }

  function scoreSignature() {
    const normalized = {};
    Object.keys(effectiveScoreOverrides()).sort().forEach((matchId) => {
      const score = normalizedScore(matchId);
      const entry = {};
      ["score_home", "score_away", "penalty_home", "penalty_away"].forEach((key) => {
        if (score[key] !== "") entry[key] = score[key];
      });
      if (hasAnyScore(entry)) normalized[matchId] = entry;
    });
    return JSON.stringify(normalized);
  }

  function effectiveScoreOverrides() {
    return {
      ...(state.saved.sharedScoreOverrides || {}),
      ...(state.saved.scoreOverrides || {})
    };
  }

  function valueOrEmpty(value) {
    return value === null || value === undefined ? "" : String(value);
  }

  function scoreNumber(score, key) {
    const value = score[key];
    if (value === "") return null;
    if (!isNumericScore(value)) return null;
    const number = Number(value);
    return Number.isFinite(number) ? number : null;
  }

  function hasMainScore(score) {
    return isNumericScore(score.score_home) && isNumericScore(score.score_away);
  }

  function isNumericScore(value) {
    return /^\d+$/.test(String(value));
  }

  function hasAnyScore(score) {
    return score && Object.values(score).some((value) => value !== "" && value !== null && value !== undefined);
  }

  function scoreText(matchId) {
    const score = normalizedScore(matchId);
    const statusKey = matchStatusKey(matchId);
    if (statusKey === "review") return "要確認";
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
    const wrapper = document.createElement("div");
    wrapper.className = "calendar-month-wrap";
    const weekdays = document.createElement("div");
    weekdays.className = "calendar-weekdays";
    weekdayLabels.forEach((label) => {
      const head = document.createElement("div");
      head.className = "calendar-weekday";
      head.textContent = label;
      weekdays.appendChild(head);
    });
    const grid = document.createElement("div");
    grid.className = "calendar-month";
    for (let i = 0; i < 42; i += 1) {
      const day = addDays(start, i);
      const matches = matchesOnDay(day);
      const cell = document.createElement("div");
      cell.className = "calendar-day-cell";
      if (day.getMonth() !== date.getMonth()) cell.classList.add("outside");
      if (matches.some(isJapanMatch)) cell.classList.add("has-japan-match");
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
      if (matches.some(isJapanMatch)) {
        const label = document.createElement("div");
        label.className = "calendar-japan-label";
        label.textContent = "日本戦";
        cell.appendChild(label);
      }
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
    wrapper.append(weekdays, grid);
    return wrapper;
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
      participantLabel(matchHomeId(match), match.home_name_ja),
      textSpan("vs", "calendar-vs"),
      participantLabel(matchAwayId(match), match.away_name_ja),
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
    if (layout === "day") {
      main.append(
        participantLabel(matchHomeId(match), match.home_name_ja),
        textDiv(scoreText(match.match_id), "match-score-display"),
        participantLabel(matchAwayId(match), match.away_name_ja)
      );

      const info = document.createElement("div");
      info.className = "calendar-match-info";
      info.append(
        textDiv(match.match_id, "match-id"),
        textDiv(stageLabels[match.stage] || match.stage),
        textDiv(match.group ? `Group ${match.group}` : "", "match-group"),
        textDiv(formatJstDateTime(match.kickoff_jst), "match-jst"),
        textDiv(venueText(match), "match-venue")
      );

      const center = document.createElement("div");
      center.className = "calendar-match-center";
      const status = statusBadge(match.match_id);
      status.classList.add("calendar-match-status");
      center.append(main, status);

      card.append(info, center);
      if (includeEditor) card.appendChild(createScoreEditor(match.match_id));
      return card;
    }

    main.append(
      textDiv(formatJstTime(match.kickoff_jst), "calendar-match-time"),
      participantLabel(matchHomeId(match), match.home_name_ja),
      textDiv(scoreText(match.match_id), "match-score-display"),
      participantLabel(matchAwayId(match), match.away_name_ja)
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
    return sortedMatches(filterByGroup(computedSchedule())).filter((match) => dateKey(jstDate(match.kickoff_jst)) === key);
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
    table.className = includeGroup ? "standing-table standing-table-thirds" : "standing-table";
    table.appendChild(createStandingColGroup(includeGroup));
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

  function createStandingColGroup(includeGroup = false) {
    const widths = includeGroup
      ? [56, 56, 400, 72, 56, 56, 56, 56, 56, 56, 56, 88]
      : [56, 400, 72, 56, 56, 56, 56, 56, 56, 56, 88];
    const colgroup = document.createElement("colgroup");
    widths.forEach((width) => {
      const col = document.createElement("col");
      col.style.width = `${width}px`;
      colgroup.appendChild(col);
    });
    return colgroup;
  }

  function calculateKnockoutCards(standings) {
    const resolved = resolveEntrants(standings);
    const rounds = {};
    knockoutStageOrder.forEach((stage) => {
      rounds[stage] = [];
      sortedMatches(computedMatches().filter((match) => match.stage === stage)).forEach((match) => {
        const home = resolveSlot(slotFor(match.match_id, "home", matchHomeId(match)), resolved);
        const away = resolveSlot(slotFor(match.match_id, "away", matchAwayId(match)), resolved);
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
    return resolveSlot(parseKnockoutSlot(value), resolved);
  }

  function slotFor(matchId, side, fallback) {
    return state.knockoutMapping?.matches?.[matchId]?.[side] || parseKnockoutSlot(fallback);
  }

  function resolveSlot(slot, resolved) {
    if (!slot) return "TBD";
    if (typeof slot === "string") return resolveRef(slot, resolved);
    if (slot.type === "group_winner") {
      return resolved[`1${slot.group}`] || `Group ${slot.group} 1位`;
    }
    if (slot.type === "group_runner_up") {
      return resolved[`2${slot.group}`] || `Group ${slot.group} 2位`;
    }
    if (slot.type === "best_third") {
      return "3位上位枠（未確定）";
    }
    if (slot.type === "match_winner") {
      return resolved[`W-${slot.match_id}`] || "未確定";
    }
    if (slot.type === "match_loser") {
      return resolved[`L-${slot.match_id}`] || "未確定";
    }
    const teamId = slot.team_id || slot.value;
    if (teamId && resolved[teamId]) return resolved[teamId];
    return teamId || "TBD";
  }

  function parseKnockoutSlot(value) {
    const text = String(value || "");
    const groupWinner = text.match(/^1([A-L])$/);
    if (groupWinner) return { type: "group_winner", group: groupWinner[1] };
    const groupRunnerUp = text.match(/^2([A-L])$/);
    if (groupRunnerUp) return { type: "group_runner_up", group: groupRunnerUp[1] };
    if (/^3[A-L](\/3[A-L])*$/.test(text)) {
      return {
        type: "best_third",
        groups: text.split("/").map((part) => part.slice(1))
      };
    }
    const matchResult = text.match(/^([WL])-(.+)$/);
    if (matchResult) {
      return {
        type: matchResult[1] === "W" ? "match_winner" : "match_loser",
        match_id: matchResult[2]
      };
    }
    return { type: "team", value: text };
  }

  function winner(matchId, homeName, awayName) {
    if (!isResolvedTeam(homeName) || !isResolvedTeam(awayName)) return "";
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

  function isResolvedTeam(value) {
    return Boolean(value && state.teams[value]);
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
        row.append(textDiv(match.matchId), knockoutParticipantLabel(match.home), textDiv(match.score), knockoutParticipantLabel(match.away));
        list.appendChild(row);
      });
      card.append(heading, list);
      wrapper.appendChild(card);
    });
    return wrapper;
  }

  function knockoutParticipantLabel(value) {
    if (isResolvedTeam(value) || value === "TBD") return teamLabel(value);
    return textSpan(value || "未確定", "team-label knockout-placeholder");
  }

  function renderAuxView(view) {
    const target = {
      "country-notes": document.getElementById("countryNotesContent"),
      "star-players": document.getElementById("starPlayersContent"),
      venues: document.getElementById("venuesContent")
    }[view];
    if (state.loadError) {
      if (target) target.replaceChildren(message(state.loadError, "tournament-error"));
      return;
    }
    if (!state.loaded) {
      init();
      if (target) target.replaceChildren(message(`${DATA_URL} を読み込み中...`));
      return;
    }
    if (view === "country-notes") renderCountryNotes();
    if (view === "star-players") renderStarPlayers();
    if (view === "venues") renderVenues();
  }

  function renderCountryNotes() {
    const target = document.getElementById("countryNotesContent");
    if (!target) return;
    target.innerHTML = "";
    target.appendChild(infoHead("国別メモ", "日本、日本の同組、FIFA上位、プレミア勢、レジェンド候補、開催国を中心に絞って管理します。"));
    const grid = document.createElement("div");
    grid.className = "info-grid";
    defaultCountryNotes.forEach((base) => {
      const item = { ...base, ...(state.saved.countryNotes?.[base.id] || {}) };
      grid.appendChild(countryNoteCard(item));
    });
    target.appendChild(grid);
  }

  function countryNoteCard(item) {
    const card = document.createElement("article");
    card.className = "info-card";
    card.appendChild(textHeading(item.country));
    const form = document.createElement("div");
    form.className = "info-form-grid";
    [
      ["reason", "対象理由", "textarea"],
      ["keyPlayers", "中心選手", "textarea"],
      ["strengths", "強み", "textarea"],
      ["weaknesses", "弱み", "textarea"],
      ["japanFit", "日本との相性", "textarea"],
      ["comment", "観戦コメント", "textarea"],
      ["sourceUrl", "情報源URL", "input"],
      ["updatedAt", "更新日", "input"]
    ].forEach(([key, label, type]) => {
      form.appendChild(infoField(label, item[key], type, (value) => updateAuxNote("countryNotes", item.id, key, value)));
    });
    card.appendChild(form);
    return card;
  }

  function renderStarPlayers() {
    const target = document.getElementById("starPlayersContent");
    if (!target) return;
    target.innerHTML = "";
    target.appendChild(infoHead("注目選手", "プレミア関係、マンチェスター・シティ関係、レジェンド/ベテラン、日本にとっての危険度を観戦前に整理します。"));
    const grid = document.createElement("div");
    grid.className = "info-grid";
    defaultStarPlayers.forEach((base) => {
      const item = { ...base, ...(state.saved.starPlayers?.[base.id] || {}) };
      grid.appendChild(starPlayerCard(item));
    });
    target.appendChild(grid);
  }

  function starPlayerCard(item) {
    const card = document.createElement("article");
    card.className = "info-card";
    card.appendChild(textHeading(item.name));
    const form = document.createElement("div");
    form.className = "info-form-grid";
    [
      ["country", "国", "input"],
      ["club", "所属クラブ", "input"],
      ["league", "リーグ", "input"],
      ["premierRelation", "プレミア関係", "input"],
      ["cityRelation", "マンチェスター・シティ関係", "input"],
      ["legendType", "レジェンド/ベテラン区分", "input"],
      ["highlight", "見どころ", "textarea"],
      ["risk", "日本にとっての危険度", "input"],
      ["selectionStatus", "選出状況", "input"],
      ["condition", "コンディション", "input"],
      ["sourceUrl", "情報源URL", "input"],
      ["updatedAt", "更新日", "input"]
    ].forEach(([key, label, type]) => {
      form.appendChild(infoField(label, item[key], type, (value) => updateAuxNote("starPlayers", item.id, key, value)));
    });
    card.appendChild(form);
    return card;
  }

  function renderVenues() {
    const target = document.getElementById("venuesContent");
    if (!target) return;
    target.innerHTML = "";
    target.appendChild(infoHead("開催地・時差・移動", "16開催都市を簡易地図で確認できます。日本戦開催地は赤で強調します。"));
    const layout = document.createElement("div");
    layout.className = "venue-layout";
    layout.append(renderVenueMap(), renderVenueDetail());
    target.appendChild(layout);
  }

  function renderVenueMap() {
    const wrap = document.createElement("div");
    wrap.className = "venue-map-card";
    const japanCities = new Set(computedSchedule().filter(isJapanMatch).map((match) => normalizeCity(match.city)));
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 900 620");
    svg.setAttribute("class", "north-america-map");
    svg.setAttribute("role", "img");
    svg.setAttribute("aria-label", "北米の簡易開催地マップ");
    svg.innerHTML = `
      <path d="M155 90 L520 75 L800 160 L785 305 L705 390 L740 540 L560 565 L430 505 L310 560 L210 470 L150 330 Z" fill="#d7ecff" stroke="#9ac5e8" stroke-width="2"></path>
      <path d="M290 430 L465 445 L520 560 L360 590 L265 540 Z" fill="#d9f2df" stroke="#9fcfb0" stroke-width="2"></path>
      <text x="190" y="125" fill="#557" font-size="20" font-weight="800">Canada / USA</text>
      <text x="330" y="575" fill="#557" font-size="20" font-weight="800">Mexico</text>
    `;
    defaultVenues.forEach((venue) => {
      const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
      group.setAttribute("class", [
        "venue-pin",
        venue.id === state.selectedVenueId ? "selected" : "",
        japanCities.has(normalizeCity(venue.city)) ? "japan-venue" : ""
      ].filter(Boolean).join(" "));
      group.setAttribute("tabindex", "0");
      group.setAttribute("role", "button");
      group.addEventListener("click", () => selectVenue(venue.id));
      group.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          selectVenue(venue.id);
        }
      });
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", venue.x);
      circle.setAttribute("cy", venue.y);
      circle.setAttribute("r", "9");
      const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
      label.setAttribute("x", venue.x + 12);
      label.setAttribute("y", venue.y + 4);
      label.textContent = shortCityLabel(venue.city);
      group.append(circle, label);
      svg.appendChild(group);
    });
    wrap.appendChild(svg);
    return wrap;
  }

  function renderVenueDetail() {
    const base = defaultVenues.find((venue) => venue.id === state.selectedVenueId) || defaultVenues[0];
    const item = { ...base, ...(state.saved.venueNotes?.[base.id] || {}) };
    const card = document.createElement("section");
    card.className = "venue-detail-card";
    card.appendChild(textHeading(item.city));
    const list = document.createElement("dl");
    list.className = "venue-meta-list";
    [
      ["国", item.country],
      ["地域", item.region],
      ["スタジアム", item.stadium],
      ["タイムゾーン", item.timezone],
      ["日本時間との差", item.jstDiff],
      ["屋根/空調", item.roofAir]
    ].forEach(([label, value]) => {
      const row = document.createElement("div");
      row.append(textTag("dt", label), textTag("dd", value));
      list.appendChild(row);
    });
    card.appendChild(list);
    const form = document.createElement("div");
    form.className = "info-form-grid";
    [
      ["climateMemo", "気候メモ", "textarea"],
      ["travelMemo", "移動メモ", "textarea"],
      ["watchMemo", "観戦メモ", "textarea"]
    ].forEach(([key, label, type]) => {
      form.appendChild(infoField(label, item[key], type, (value) => updateAuxNote("venueNotes", item.id, key, value, false)));
    });
    card.appendChild(form);
    return card;
  }

  function selectVenue(id) {
    state.selectedVenueId = id;
    renderVenues();
  }

  function infoHead(title, sub) {
    const head = document.createElement("div");
    head.className = "info-head";
    const text = document.createElement("div");
    const h = document.createElement("h2");
    h.className = "info-title";
    h.textContent = title;
    const p = document.createElement("p");
    p.className = "info-sub";
    p.textContent = sub;
    text.append(h, p);
    head.appendChild(text);
    return head;
  }

  function infoField(labelText, value, type, onInput) {
    const label = document.createElement("label");
    label.className = `info-field ${type === "textarea" ? "full" : ""}`.trim();
    label.appendChild(textSpan(labelText));
    const input = document.createElement(type === "textarea" ? "textarea" : "input");
    input.value = value || "";
    input.addEventListener("input", () => onInput(input.value));
    label.appendChild(input);
    return label;
  }

  function updateAuxNote(bucket, id, key, value, rerender = false) {
    state.saved[bucket] ||= {};
    state.saved[bucket][id] ||= {};
    if (value === "") {
      delete state.saved[bucket][id][key];
    } else {
      state.saved[bucket][id][key] = value;
    }
    if (Object.keys(state.saved[bucket][id]).length === 0) delete state.saved[bucket][id];
    state.saved.lastUpdatedAt = new Date().toISOString();
    persist();
    setSavedLabel("観戦メモ保存済み");
    if (rerender) renderAuxView(bucket);
  }

  function textHeading(text) {
    const h = document.createElement("h3");
    h.textContent = text || "";
    return h;
  }

  function textTag(tag, text) {
    const node = document.createElement(tag);
    node.textContent = text || "";
    return node;
  }

  function shortCityLabel(city) {
    return String(city).replace("New York New Jersey", "NY/NJ").replace("San Francisco Bay Area", "SF Bay");
  }

  function normalizeCity(city) {
    return String(city || "").trim().toLowerCase().replace(/\s+/g, " ");
  }

  function participantLabel(teamId, fallback = "", className = "", options = {}) {
    if (isResolvedTeam(teamId)) return teamLabel(teamId, fallback, className, options);
    const label = fallback || (teamId && teamId !== "TBD" ? teamId : "未確定");
    return textSpan(label, `team-label ${className} knockout-placeholder`.trim());
  }

  function exportState() {
    return {
      version: 1,
      type: "worldcup2026_watch_and_score_state",
      source: DATA_URL,
      scoreOverrides: effectiveScoreOverrides(),
      matchNotes: state.saved.matchNotes || {},
      countryNotes: state.saved.countryNotes || {},
      starPlayers: state.saved.starPlayers || {},
      venueNotes: state.saved.venueNotes || {},
      lastUpdatedAt: state.saved.lastUpdatedAt || new Date().toISOString()
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
    const input = state.elements.sharedTextInput;
    if (input) {
      input.focus();
      setSharedScoreStatus("JSONエクスポートでコピーした全文を、下のJSON本文インポート欄に貼り付けてください");
      return;
    }
    window.alert("JSON本文インポート欄が見つかりません。ページを再読み込みしてください。");
  }

  function importState(payload) {
    const scoreOverrides = payload?.scoreOverrides && typeof payload.scoreOverrides === "object"
      ? payload.scoreOverrides
      : payload?.scores && typeof payload.scores === "object"
        ? payload.scores
        : payload;
    if (!scoreOverrides || typeof scoreOverrides !== "object") return false;
    importScoreOverrides(scoreOverrides, {
      lastUpdatedAt: payload?.lastUpdatedAt || new Date().toISOString(),
      matchNotes: payload?.matchNotes,
      countryNotes: payload?.countryNotes,
      starPlayers: payload?.starPlayers,
      venueNotes: payload?.venueNotes
    });
    return true;
  }

  async function loadSharedScoreUrl() {
    const input = state.elements.sharedUrlInput;
    const url = (input?.value || "").trim();
    if (!url) {
      setSharedScoreStatus("スマホ/PC共有用のスコアJSON URLを入力してください");
      return;
    }
    if (url.startsWith("{")) {
      setSharedScoreStatus("ここはURL入力欄です。JSON本文は下のインポート欄に貼り付けてください");
      return;
    }
    if (!url.startsWith("https://")) {
      setSharedScoreStatus("URL欄には https:// で始まる共有JSON URLを入力してください");
      return;
    }
    setSharedScoreStatus("共有スコアJSONを読み込み中...");
    try {
      const response = await fetch(url, { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const payload = await response.json();
      applySharedScorePayload(payload, { url });
      setSharedScoreStatus(`共有スコア読込済み: ${formatSavedDateTime(state.saved.sharedScoreLoadedAt)}（端末内にも保存）`);
      setSavedLabel("共有スコアを端末内に保存済み");
    } catch (error) {
      setSharedScoreStatus(`共有スコアJSONを読み込めませんでした: ${error.message || error}`);
    }
  }

  function importSharedScoreText() {
    const text = (state.elements.sharedTextInput?.value || "").trim();
    if (!text) {
      setSharedScoreStatus("JSON本文または G-F-01:1-2 のような簡易スコア形式を貼り付けてください");
      return;
    }
    if (!text.startsWith("{") && !text.startsWith("[")) {
      try {
        const scoreOverrides = parseSimpleScoreText(text);
        importScoreOverrides(scoreOverrides, { lastUpdatedAt: new Date().toISOString() });
        setSharedScoreStatus(`簡易スコア形式をインポートしました: ${formatSavedDateTime(state.saved.lastUpdatedAt)}（端末内に保存）`);
        setSavedLabel("簡易スコアを端末内に保存済み");
      } catch (error) {
        setSharedScoreStatus(error.message || "簡易スコア形式を読み込めませんでした");
      }
      return;
    }
    try {
      const payload = JSON.parse(text);
      if (!importState(payload)) throw new Error("scoreOverrides が見つかりません");
      setSharedScoreStatus(`JSON本文をインポートしました: ${formatSavedDateTime(state.saved.lastUpdatedAt)}（端末内に保存）`);
      setSavedLabel("スコアJSONを端末内に保存済み");
    } catch (error) {
      setSharedScoreStatus("JSON形式が壊れています。途中で切れていないか、ダブルクォートが閉じているか確認してください");
    }
  }

  function parseSimpleScoreText(text) {
    const scoreOverrides = {};
    const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    if (lines.length === 0) throw new Error("簡易スコア形式が空です");
    lines.forEach((line) => {
      const match = line.match(/^([A-Z0-9-]+)\s*:\s*(\d+)\s*-\s*(\d+)(?:\s*:\s*(\d+)\s*-\s*(\d+))?$/);
      if (!match) {
        throw new Error(`簡易スコア形式を読み込めません: ${line}`);
      }
      const [, matchId, home, away, homePenalty, awayPenalty] = match;
      scoreOverrides[matchId] = {
        score_home: home,
        score_away: away,
        penalty_home: homePenalty ?? null,
        penalty_away: awayPenalty ?? null
      };
    });
    return scoreOverrides;
  }

  function importScoreOverrides(scoreOverrides, options = {}) {
    state.saved = {
      version: 1,
      scoreOverrides,
      sharedScoreOverrides: state.saved.sharedScoreOverrides || {},
      sharedScoreUrl: state.saved.sharedScoreUrl || "",
      sharedScoreLoadedAt: state.saved.sharedScoreLoadedAt || "",
      lastUpdatedAt: options.lastUpdatedAt || new Date().toISOString(),
      matchNotes: options.matchNotes && typeof options.matchNotes === "object" ? options.matchNotes : state.saved.matchNotes || {},
      countryNotes: options.countryNotes && typeof options.countryNotes === "object" ? options.countryNotes : state.saved.countryNotes || {},
      starPlayers: options.starPlayers && typeof options.starPlayers === "object" ? options.starPlayers : state.saved.starPlayers || {},
      venueNotes: options.venueNotes && typeof options.venueNotes === "object" ? options.venueNotes : state.saved.venueNotes || {},
      standings: null,
      thirdRanking: null,
      knockout: null
    };
    persist();
    renderContent();
  }

  async function loadKnockoutMapping() {
    try {
      const response = await fetch(KNOCKOUT_MAPPING_URL, { cache: "no-store" });
      if (!response.ok) return {};
      return await response.json();
    } catch (error) {
      return {};
    }
  }

  function applySharedScorePayload(payload, options = {}) {
    const scoreOverrides = extractScoreOverrides(payload);
    if (!scoreOverrides) throw new Error("scoreOverrides が見つかりません");
    state.saved.sharedScoreOverrides = scoreOverrides;
    if (options.url !== undefined) {
      state.saved.sharedScoreUrl = options.url;
    }
    state.saved.sharedScoreLoadedAt = new Date().toISOString();
    state.saved.lastUpdatedAt = state.saved.sharedScoreLoadedAt;
    ["matchNotes", "countryNotes", "starPlayers", "venueNotes"].forEach((key) => {
      if (payload?.[key] && typeof payload[key] === "object") state.saved[key] = payload[key];
    });
    persist();
    renderContent();
  }

  function extractScoreOverrides(payload) {
    if (payload?.scoreOverrides && typeof payload.scoreOverrides === "object") return payload.scoreOverrides;
    if (payload?.scores && typeof payload.scores === "object") return payload.scores;
    return payload && typeof payload === "object" ? payload : null;
  }

  function updateSharedScoreStatus() {
    if (!state.elements.sharedStatus) return;
    if (state.saved.sharedScoreLoadedAt) {
      state.elements.sharedStatus.textContent = `共有スコア読込済み: ${formatSavedDateTime(state.saved.sharedScoreLoadedAt)}（端末内にも保存）`;
    } else {
      state.elements.sharedStatus.textContent = "端末内保存のみ。スマホとPCは自動同期されません。";
    }
  }

  function setSharedScoreStatus(text) {
    if (state.elements.sharedStatus) state.elements.sharedStatus.textContent = text;
  }

  function displayTeam(teamId, fallback = "", options = {}) {
    if (teamId === "TBD") return "未確定";
    const team = state.teams[teamId];
    const name = team?.name_ja || fallback || teamId;
    return options.showRank === false || !team?.fifa_rank ? name : `${name}（${team.fifa_rank}位）`;
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

  function teamLabel(teamId, fallback = "", className = "", options = {}) {
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
    name.textContent = displayTeam(teamId, fallback || teamId, options);
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
    const countryJa = (match.country_ja || "").trim();
    if (venue && city && countryJa) return `${venue}（${city}・${countryJa}）`;
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
    renderAuxView,
    exportState,
    importState
  };
})();
