    const players = [
      { id: "p01", name: "鈴木彩艶", position: "GK", status: "確実", number: "", club: "パルマ", imageUrl: "pics/鈴木彩艶.jpg" },
      { id: "p02", name: "大迫敬介", position: "GK", status: "本命", number: "", club: "サンフレッチェ広島", imageUrl: "pics/大迫敬介.jpg" },
      { id: "p03", name: "谷晃生", position: "GK", status: "本命", number: "", club: "FC町田ゼルビア", imageUrl: "pics/谷晃生.jpg" },
      { id: "p04", name: "板倉滉", position: "CB", status: "確実", number: "", club: "ボルシアMG", imageUrl: "pics/板倉滉.jpg" },
      { id: "p05", name: "伊藤洋輝", position: "CB", status: "確実", number: "", club: "バイエルン", imageUrl: "pics/伊藤洋輝.jpg" },
      { id: "p06", name: "冨安健洋", position: "CB", status: "本命", number: "", club: "アヤックス", imageUrl: "pics/冨安健洋.jpg" },
      { id: "p07", name: "谷口彰悟", position: "CB", status: "本命", number: "", club: "シント＝トロイデン", imageUrl: "pics/谷口彰悟.jpg" },
      { id: "p08", name: "高井幸大", position: "CB", status: "本命", number: "", club: "ボルシアMG", imageUrl: "pics/高井幸大.jpg" },
      { id: "p09", name: "瀬古歩夢", position: "CB/SB", status: "本命", number: "", club: "ル・アーヴル", imageUrl: "pics/瀬古歩夢.jpg" },
      { id: "p10", name: "菅原由勢", position: "SB/WB", status: "確実", number: "", club: "サウサンプトン", imageUrl: "pics/菅原由勢.jpg" },
      { id: "p11", name: "毎熊晟矢", position: "SB/WB", status: "本命", number: "", club: "AZ", imageUrl: "pics/毎熊晟矢.jpg" },
      { id: "p12", name: "遠藤航", position: "DMF/CMF", status: "確実", number: "", club: "リヴァプール", imageUrl: "pics/遠藤航.jpg" },
      { id: "p13", name: "守田英正", position: "DMF/CMF", status: "確実", number: "", club: "スポルティング", imageUrl: "pics/守田英正.jpg" },
      { id: "p14", name: "田中碧", position: "DMF/CMF", status: "確実", number: "", club: "リーズ", imageUrl: "pics/田中碧.jpg" },
      { id: "p15", name: "佐野海舟", position: "DMF/CMF", status: "本命", number: "", club: "マインツ", imageUrl: "pics/佐野海舟.jpg" },
      { id: "p16", name: "藤田譲瑠チマ", position: "DMF/CMF", status: "本命", number: "", club: "シント＝トロイデン", imageUrl: "pics/藤田譲瑠チマ.jpg" },
      { id: "p17", name: "旗手怜央", position: "OMF/CMF/WB", status: "本命", number: "", club: "セルティック", imageUrl: "pics/旗手怜央.jpg" },
      { id: "p18", name: "久保建英", position: "OMF/SH", status: "確実", number: "", club: "レアル・ソシエダ", imageUrl: "pics/久保建英.jpg" },
      { id: "p19", name: "堂安律", position: "OMF/SH", status: "確実", number: "", club: "フランクフルト", imageUrl: "pics/堂安律.jpg" },
      { id: "p20", name: "鎌田大地", position: "OMF/SH", status: "確実", number: "", club: "クリスタル・パレス", imageUrl: "pics/鎌田大地.jpg" },
      { id: "p21", name: "伊東純也", position: "WG", status: "確実", number: "", club: "スタッド・ランス", imageUrl: "pics/伊東純也.jpg" },
      { id: "p22", name: "三笘薫", position: "WG", status: "本命", number: "", club: "ブライトン", imageUrl: "pics/三笘薫.jpg" },
      { id: "p23", name: "中村敬斗", position: "WG", status: "本命", number: "", club: "スタッド・ランス", imageUrl: "pics/中村敬斗.jpg" },
      { id: "p24", name: "前田大然", position: "WG/FW", status: "本命", number: "", club: "セルティック", imageUrl: "pics/前田大然.jpg" },
      { id: "p25", name: "上田綺世", position: "CF", status: "確実", number: "", club: "フェイエノールト", imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Go%20Ahead%20Eagles%20-%20Feyenoord%20-%2053679351240%20(Ayase%20Ueda).jpg?width=160" },
      { id: "p26", name: "小川航基", position: "CF", status: "本命", number: "", club: "NEC", imageUrl: "pics/小川航基.jpg" }
    ];

    const candidatePlayers = [
      { id: "p27", name: "前川黛也", position: "GK", status: "可能性", number: "", club: "ヴィッセル神戸", imageUrl: "pics/前川黛也.jpg" },
      { id: "p28", name: "早川友基", position: "GK", status: "可能性", number: "", club: "鹿島アントラーズ", imageUrl: "pics/早川友基.jpg" },
      { id: "p29", name: "渡辺剛", position: "CB", status: "可能性", number: "", club: "ヘント", imageUrl: "pics/渡辺剛.jpg" },
      { id: "p30", name: "橋岡大樹", position: "SB/WB", status: "可能性", number: "", club: "スラヴィア・プラハ", imageUrl: "pics/橋岡大樹.jpg" },
      { id: "p31", name: "中山雄太", position: "SB/CB", status: "可能性", number: "", club: "FC町田ゼルビア", imageUrl: "pics/中山雄太.jpg" },
      { id: "p32", name: "長友佑都", position: "SB/WB", status: "可能性", number: "", club: "FC東京", imageUrl: "pics/長友佑都.jpg" },
      { id: "p33", name: "関根大輝", position: "SB/WB", status: "可能性", number: "", club: "スタッド・ランス", imageUrl: "pics/関根大輝.jpg" },
      { id: "p34", name: "中村帆高", position: "SB/WB", status: "可能性", number: "", club: "FC東京", imageUrl: "pics/中村帆高.jpg" },
      { id: "p35", name: "佐野航大", position: "DMF/CMF", status: "可能性", number: "", club: "NEC", imageUrl: "pics/佐野航大.jpg" },
      { id: "p36", name: "川村拓夢", position: "DMF/CMF", status: "可能性", number: "", club: "レッドブル・ザルツブルク", imageUrl: "pics/川村拓夢.jpg" },
      { id: "p37", name: "南野拓実", position: "OMF/WG", status: "可能性", number: "", club: "モナコ", imageUrl: "pics/南野拓実.jpg" },
      { id: "p38", name: "鈴木唯人", position: "OMF/SH", status: "可能性", number: "", club: "フライブルク", imageUrl: "pics/鈴木唯人.jpg" },
      { id: "p39", name: "相馬勇紀", position: "WG/SH", status: "可能性", number: "", club: "FC町田ゼルビア", imageUrl: "pics/相馬勇紀.jpg" },
      { id: "p40", name: "古橋亨梧", position: "CF", status: "可能性", number: "", club: "バーミンガム", imageUrl: "pics/古橋亨梧.jpg" },
      { id: "p41", name: "町野修斗", position: "CF", status: "可能性", number: "", club: "ボルシアMG", imageUrl: "pics/町野修斗.jpg" },
      { id: "p42", name: "細谷真大", position: "CF", status: "可能性", number: "", club: "柏レイソル", imageUrl: "pics/細谷真大.jpg" },
      { id: "p43", name: "塩貝健人", position: "CF", group: "CF", status: "可能性", number: "", club: "NEC", imageUrl: "pics/塩貝健人.jpg" },
      { id: "p44", name: "鈴木淳之介", position: "CB/SB", group: "DF", status: "可能性", number: "", club: "湘南ベルマーレ", imageUrl: "pics/鈴木淳之介.jpg" },
      { id: "p45", name: "三戸舜介", position: "OMF/WG", group: "OMF/WG", status: "可能性", number: "", club: "スパルタ・ロッテルダム", imageUrl: "pics/三戸舜介.jpg" },
      { id: "p46", name: "大橋祐紀", position: "CF", group: "CF", status: "可能性", number: "", club: "ブラックバーン", imageUrl: "pics/大橋祐紀.jpg" },
      { id: "p47", name: "小杉啓太", position: "SB/WB", group: "DF", status: "可能性", number: "", club: "ユールゴーデン", imageUrl: "pics/小杉啓太.jpg" },
      { id: "goto_keisuke", name: "後藤啓介", position: "MF/FW", group: "OMF/WG", status: "可能性", number: "", club: "シントトロイデンVV", country: "ベルギー", imageUrl: "pics/後藤啓介.jpg" }
    ];

    const playerOverrides = {
      "鈴木唯人": { club: "フライブルク" },
      "堂安律": { club: "フランクフルト" },
      "後藤啓介": {
        position: "MF/FW",
        group: "OMF/WG",
        club: "シントトロイデンVV",
        country: "ベルギー",
        imageUrl: "pics/後藤啓介.jpg"
      }
    };

    const officialSquadNumbers = {
      "鈴木彩艶": "1",
      "菅原由勢": "2",
      "谷口彰悟": "3",
      "板倉滉": "4",
      "長友佑都": "5",
      "遠藤航": "6",
      "田中碧": "7",
      "久保建英": "8",
      "後藤啓介": "9",
      "堂安律": "10",
      "前田大然": "11",
      "大迫敬介": "12",
      "中村敬斗": "13",
      "伊東純也": "14",
      "鎌田大地": "15",
      "渡辺剛": "16",
      "鈴木唯人": "17",
      "上田綺世": "18",
      "小川航基": "19",
      "瀬古歩夢": "20",
      "伊藤洋輝": "21",
      "冨安健洋": "22",
      "早川友基": "23",
      "佐野海舟": "24",
      "鈴木淳之介": "25",
      "塩貝健人": "26"
    };

    const allPlayers = applyOfficialSquadNumbers(applyPlayerOverrides(loadPlayerMaster([...players, ...candidatePlayers])));
    const officialSquadNames = [
      "早川友基", "大迫敬介", "鈴木彩艶",
      "長友佑都", "谷口彰悟", "板倉滉", "渡辺剛", "冨安健洋", "伊藤洋輝", "瀬古歩夢", "菅原由勢", "鈴木淳之介",
      "遠藤航", "伊東純也", "鎌田大地", "小川航基", "前田大然", "堂安律", "上田綺世", "田中碧", "中村敬斗", "佐野海舟", "久保建英", "鈴木唯人", "塩貝健人", "後藤啓介"
    ];
    const officialSquadSourceUrl = "https://www.jfa.jp/samuraiblue/worldcup_2026/member.html";
    const officialSquadDefaultIds = new Set(officialSquadNames.map((name) => allPlayers.find((player) => player.name === name)?.id).filter(Boolean));
    const defaultKarinIds = new Set(officialSquadDefaultIds);
    const defaultRyoNames = [
      ...officialSquadNames
    ];
    const defaultRyoIds = new Set(defaultRyoNames.map((name) => allPlayers.find((player) => player.name === name)?.id).filter(Boolean));
    const requiredOwnerPlayerIds = {
      karin: ["goto_keisuke"],
      ryo: ["goto_keisuke"]
    };

    const teamName = "日本代表";

    const owners = {
      karin: "かりん",
      ryo: "りょう"
    };

    const excelColumns = [
      "id",
      "名前",
      "ポジション",
      "group",
      "所属クラブ",
      "国名",
      "かりん初期選出",
      "りょう初期選出",
      "背番号",
      "画像ファイル名",
      "国旗ファイル名",
      "メモ"
    ];

    const countryFlagFiles = {
      "イングランド": "イングランド.webp",
      "スコットランド": "スコットランド.jpeg"
    };

    const clubCountries = {
      "パルマ": "イタリア",
      "サンフレッチェ広島": "日本",
      "FC町田ゼルビア": "日本",
      "ボルシアMG": "ドイツ",
      "バイエルン": "ドイツ",
      "アヤックス": "オランダ",
      "シント＝トロイデン": "ベルギー",
      "シントトロイデンVV": "ベルギー",
      "ル・アーヴル": "フランス",
      "サウサンプトン": "イングランド",
      "AZ": "オランダ",
      "リヴァプール": "イングランド",
      "スポルティング": "ポルトガル",
      "リーズ": "イングランド",
      "マインツ": "ドイツ",
      "フライブルク": "ドイツ",
      "フランクフルト": "ドイツ",
      "セルティック": "スコットランド",
      "レアル・ソシエダ": "スペイン",
      "フライブルク": "ドイツ",
      "クリスタル・パレス": "イングランド",
      "スタッド・ランス": "フランス",
      "ブライトン": "イングランド",
      "フェイエノールト": "オランダ",
      "NEC": "オランダ",
      "ヴィッセル神戸": "日本",
      "鹿島アントラーズ": "日本",
      "ヘント": "ベルギー",
      "スラヴィア・プラハ": "チェコ",
      "FC東京": "日本",
      "レッドブル・ザルツブルク": "オーストリア",
      "モナコ": "フランス",
      "ブレンビー": "デンマーク",
      "バーミンガム": "イングランド",
      "柏レイソル": "日本",
      "湘南ベルマーレ": "日本",
      "スパルタ・ロッテルダム": "オランダ",
      "ブラックバーン": "イングランド",
      "ユールゴーデン": "スウェーデン"
    };

    const ownerPlayers = {
      karin: allPlayers.filter((player) => defaultKarinIds.has(player.id) || requiredOwnerPlayerIds.karin.includes(player.id)),
      ryo: allPlayers.filter((player) => defaultRyoIds.has(player.id) || requiredOwnerPlayerIds.ryo.includes(player.id))
    };

    const ratingOrder = ["◎", "〇", "△", "×"];
    const storageKeys = {
      karin: "formationBoard_karin_japan",
      ryo: "formationBoard_ryo_japan"
    };
    const playerMasterStorageKey = "formationBoard_players_japan";
    const betStorageKey = "formationBoard_bet_japan";
    const betResultsStorageKey = "worldCupBetResults";
    const championBetStorageKey = "worldCupChampionBet";
    const officialSquadStorageKey = "formationBoard_officialSquad_japan";
    const gistSettingsStorageKey = "worldcup2026_gist_settings";
    const gistStateFileName = "worldcup_state.json";
    const FIREBASE_DB_URL = "https://football-delay-watching-a8830-default-rtdb.firebaseio.com/worldcup2026/state";
    let firebaseSaveTimer = null;
    const betResultValues = ["pending", "selected", "not_selected"];
    const betResultLabels = {
      pending: "未確定",
      selected: "招集",
      not_selected: "落選"
    };
    const championRoundStages = [
      ["pre", "大会前", "最初の優勝予想国を決めます。"],
      ["r32", "ラウンド32敗退後", "賭け金を保持したまま、次の優勝予想国を決めます。"],
      ["r16", "ラウンド16敗退後", "残った国から次の優勝予想国を決めます。"],
      ["qf", "準々決勝敗退後", "同じ賭け金のまま次の候補へ乗り換えます。"],
      ["sf", "準決勝敗退後", "決勝前の最後の優勝予想です。"]
    ];
    const requiredBetResultDefaults = {
      goto_keisuke: "selected"
    };
    const currentFormations = {
      karin: "",
      ryo: ""
    };
    const ownerLocks = {
      karin: false,
      ryo: false
    };
    const saveLabels = {
      karin: "",
      ryo: ""
    };
    let betResultsLoadedFromStorage = false;
    const betState = loadBetState();
    let screenshotMode = false;
    let editingPlayerId = null;

    function currentPlayers() {
      return ownerPlayers[activeOwner];
    }

    function playersForOwner(owner) {
      return ownerPlayers[owner] || [];
    }

    function allPlayerById(playerId) {
      return allPlayers.find((player) => player.id === playerId);
    }

    function isOfficialSquadPlayer(playerId) {
      return officialSquadDefaultIds.has(playerId);
    }

    function officialSquadPlayers() {
      return officialSquadNames.map((name) => allPlayers.find((player) => player.name === name)).filter(Boolean);
    }

    function sortPlayersByMasterOrder(list) {
      return [...list].sort((a, b) => playerOriginalIndex(a) - playerOriginalIndex(b));
    }

    function ensureRequiredOwnerPlayers(owner) {
      const requiredIds = Array.from(new Set([...officialSquadDefaultIds, ...(requiredOwnerPlayerIds[owner] || [])]));
      ownerPlayers[owner] = sortPlayersByMasterOrder(ownerPlayers[owner].filter((player) => isOfficialSquadPlayer(player.id)));
      requiredIds.forEach((playerId) => {
        const player = allPlayerById(playerId);
        if (!player) return;
        if (!ownerPlayers[owner].some((item) => item.id === playerId)) {
          ownerPlayers[owner].push(player);
        }
      });
      ownerPlayers[owner] = officialSquadPlayers().filter((player) => ownerPlayers[owner].some((item) => item.id === player.id));
    }

    function syncPlayersArrayOrder() {
      players.length = 0;
      allPlayers.forEach((player) => players.push(player));
    }

    function createInitialState(owner) {
      return new Map(ownerPlayers[owner].map((player) => [
        player.id,
        { area: "bench", x: 50, y: 50, rating: initialRating(player.status), number: player.number || "", manual: false, playerId: player.id }
      ]));
    }

    function applyPlayerOverrides(list) {
      return list.map((player) => {
        const override = playerOverrides[player.name];
        return override ? { ...player, ...override } : player;
      });
    }

    function applyOfficialSquadNumbers(list) {
      return list.map((player) => {
        const number = officialSquadNumbers[player.name];
        return number ? { ...player, number } : player;
      });
    }

    function loadPlayerMaster(defaultPlayers) {
      try {
        const raw = localStorage.getItem("formationBoard_players_japan");
        if (!raw) return defaultPlayers;
        const saved = JSON.parse(raw);
        if (!Array.isArray(saved?.players)) return defaultPlayers;
        const merged = [...defaultPlayers];
        saved.players.forEach((savedPlayer) => {
          if (!savedPlayer?.id) return;
          const index = merged.findIndex((player) => player.id === savedPlayer.id);
          if (index === -1) {
            merged.push(savedPlayer);
          } else {
            merged[index] = { ...merged[index], ...savedPlayer };
          }
        });
        return merged;
      } catch (error) {
        console.warn("選手マスタの復元に失敗しました", error);
        return defaultPlayers;
      }
    }

    function savePlayerMaster() {
      try {
        localStorage.setItem(playerMasterStorageKey, JSON.stringify({
          version: 1,
          teamName,
          players: allPlayers
        }));
      } catch (error) {
        console.warn(`${playerMasterStorageKey} の保存に失敗しました`, error);
      }
    }

    function normalizeNumber(value) {
      if (value === undefined || value === null) return "";
      return String(value).trim().replace(/[０-９]/g, (char) => {
        return String.fromCharCode(char.charCodeAt(0) - 0xFEE0);
      });
    }

    function normalizePlacement(saved, fallback) {
      const safeArea = saved?.area === "pitch" ? "pitch" : "bench";
      const safeRating = ratingOrder.includes(saved?.rating) ? saved.rating : fallback.rating;
      const safeX = Number.isFinite(Number(saved?.x)) ? clamp(Number(saved.x), 0, 100) : fallback.x;
      const safeY = Number.isFinite(Number(saved?.y)) ? clamp(Number(saved.y), 0, 100) : fallback.y;
      const officialNumber = officialNumberForPlayerId(fallback.playerId);
      const normalizedNumber = validateNumber(officialNumber || saved?.number || fallback.number);
      const safeNumber = normalizedNumber === null ? fallback.number : normalizedNumber;
      return {
        area: safeArea,
        x: safeX,
        y: safeY,
        rating: safeRating,
        number: safeNumber,
        manual: Boolean(saved?.manual)
      };
    }

    function loadOwnerState(owner) {
      const initial = createInitialState(owner);
      const key = storageKeys[owner];
      if (!key) return initial;

      try {
        const raw = localStorage.getItem(key);
        if (!raw) return initial;
        const saved = JSON.parse(raw);
        const savedPlayers = saved?.players || {};
        if (Array.isArray(saved?.rosterIds)) {
          ownerPlayers[owner] = sortPlayersByMasterOrder(saved.rosterIds.map(allPlayerById).filter((player) => player && isOfficialSquadPlayer(player.id)));
        }
        ensureRequiredOwnerPlayers(owner);
        const initialForRoster = createInitialState(owner);
        const loaded = Array.isArray(saved?.rosterIds) ? new Map() : initial;
        currentFormations[owner] = typeof saved?.formation === "string" ? saved.formation : "";
        ownerLocks[owner] = Boolean(saved?.locked);

        ownerPlayers[owner].forEach((player) => {
          const fallback = initialForRoster.get(player.id);
          if (!fallback) return;
          loaded.set(player.id, normalizePlacement(savedPlayers[player.id], fallback));
        });
        return loaded;
      } catch (error) {
        console.warn(`${key} の復元に失敗しました`, error);
      }

      return initial;
    }

    function saveOwnerState(owner = activeOwner) {
      const key = storageKeys[owner];
      if (!key) return;

      const placements = {};
      states[owner].forEach((placement, playerId) => {
        placements[playerId] = {
          area: placement.area,
          x: placement.x,
          y: placement.y,
          rating: placement.rating,
          number: placement.number || "",
          manual: placement.manual
        };
      });

      try {
        localStorage.setItem(key, JSON.stringify({
          version: 1,
          teamName,
          owner,
          rosterIds: ownerPlayers[owner].map((player) => player.id),
          formation: currentFormations[owner] || "",
          locked: ownerLocks[owner],
          players: placements
        }));
        updateSaveState(owner);
      } catch (error) {
        console.warn(`${key} の保存に失敗しました`, error);
      }
    }

    function clearOwnerState(owner = activeOwner) {
      const key = storageKeys[owner];
      if (!key) return;
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.warn(`${key} の削除に失敗しました`, error);
      }
    }

    function loadBetState() {
      const initial = { amount: "500" };
      try {
        const raw = localStorage.getItem(betStorageKey);
        if (!raw) return initial;
        const saved = JSON.parse(raw);
        return {
          amount: saved?.amount ?? initial.amount
        };
      } catch (error) {
        console.warn(`${betStorageKey} の復元に失敗しました`, error);
        return initial;
      }
    }

    function saveBetState() {
      try {
        localStorage.setItem(betStorageKey, JSON.stringify(betState));
        updateSaveState(activeOwner);
      } catch (error) {
        console.warn(`${betStorageKey} の保存に失敗しました`, error);
      }
    }

    function loadChampionBetState() {
      const initial = { amount: "1000", karin: "", ryo: "", official: "", rounds: championBetInitialRounds(), eliminated: championBetInitialEliminations() };
      try {
        const raw = localStorage.getItem(championBetStorageKey);
        if (!raw) return initial;
        const saved = JSON.parse(raw);
        const state = {
          amount: saved?.amount ?? initial.amount,
          karin: saved?.karin || "",
          ryo: saved?.ryo || "",
          official: saved?.official || "",
          rounds: normalizeChampionRounds(saved?.rounds),
          eliminated: normalizeChampionEliminations(saved?.eliminated)
        };
        if (!saved?.rounds && (state.karin || state.ryo)) {
          state.rounds.pre = { karin: state.karin, ryo: state.ryo };
        }
        return state;
      } catch (error) {
        console.warn(`${championBetStorageKey} の復元に失敗しました`, error);
        return initial;
      }
    }

    function championBetInitialRounds() {
      return championRoundStages.reduce((rounds, [key]) => {
        rounds[key] = { karin: "", ryo: "" };
        return rounds;
      }, {});
    }

    function championBetInitialEliminations() {
      return championRoundStages.reduce((eliminated, [key]) => {
        eliminated[key] = { karin: false, ryo: false };
        return eliminated;
      }, {});
    }

    function normalizeChampionRounds(value) {
      const rounds = championBetInitialRounds();
      if (!value || typeof value !== "object") return rounds;
      championRoundStages.forEach(([key]) => {
        rounds[key] = {
          karin: value[key]?.karin || "",
          ryo: value[key]?.ryo || ""
        };
      });
      return rounds;
    }

    function normalizeChampionEliminations(value) {
      const eliminated = championBetInitialEliminations();
      if (!value || typeof value !== "object") return eliminated;
      championRoundStages.forEach(([key]) => {
        eliminated[key] = {
          karin: Boolean(value[key]?.karin),
          ryo: Boolean(value[key]?.ryo)
        };
      });
      return eliminated;
    }

    function saveChampionBetState() {
      try {
        localStorage.setItem(championBetStorageKey, JSON.stringify(championBetState));
        if (championBetSaveState) {
          championBetSaveState.textContent = `保存済み：${new Date().toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })}`;
        }
        updateSaveState(activeOwner);
      } catch (error) {
        console.warn(`${championBetStorageKey} の保存に失敗しました`, error);
        if (championBetSaveState) championBetSaveState.textContent = "保存失敗";
      }
    }

    function loadOfficialSquad() {
      return new Set(officialSquadDefaultIds);
    }

    function saveOfficialSquad() {
      try {
        localStorage.setItem(officialSquadStorageKey, JSON.stringify({
          version: 1,
          teamName,
          source: officialSquadSourceUrl,
          playerIds: Array.from(officialSquadIds)
        }));
        updateSaveState(activeOwner);
      } catch (error) {
        console.warn(`${officialSquadStorageKey} の保存に失敗しました`, error);
      }
    }

    function normalizeBetResultValue(value) {
      return betResultValues.includes(value) ? value : "pending";
    }

    function normalizeBetResults(raw = {}) {
      const source = raw?.results && typeof raw.results === "object" ? raw.results : raw;
      const normalized = {};
      const suppliedIds = new Set();
      if (source && typeof source === "object") {
        Object.entries(source).forEach(([playerId, value]) => {
          if (!allPlayerById(playerId)) return;
          normalized[playerId] = normalizeBetResultValue(value);
          suppliedIds.add(playerId);
        });
      }
      allPlayers.forEach((player) => {
        normalized[player.id] = isOfficialSquadPlayer(player.id) ? "selected" : "not_selected";
      });
      Object.entries(requiredBetResultDefaults).forEach(([playerId, value]) => {
        if (!allPlayerById(playerId)) return;
        if (!suppliedIds.has(playerId)) normalized[playerId] = normalizeBetResultValue(value);
      });
      return normalized;
    }

    function loadBetResults() {
      try {
        const raw = localStorage.getItem(betResultsStorageKey);
        if (!raw) {
          const migrated = {};
          loadOfficialSquad().forEach((playerId) => {
            if (allPlayerById(playerId)) migrated[playerId] = "selected";
          });
          return normalizeBetResults(migrated);
        }
        betResultsLoadedFromStorage = true;
        return normalizeBetResults(JSON.parse(raw));
      } catch (error) {
        console.warn(`${betResultsStorageKey} の復元に失敗しました`, error);
        return {};
      }
    }

    function saveBetResults() {
      try {
        betResults = normalizeBetResults(betResults);
        localStorage.setItem(betResultsStorageKey, JSON.stringify(betResults));
        betResultsLoadedFromStorage = true;
        console.log(betResultsStorageKey, betResults);
        updateBetDebug();
        if (betResultsSaveState) {
          betResultsSaveState.textContent = `保存済み：${new Date().toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" })}`;
        }
      } catch (error) {
        console.warn(`${betResultsStorageKey} の保存に失敗しました`, error);
        if (betResultsSaveState) betResultsSaveState.textContent = "保存失敗";
      }
    }

    function betResultForPlayer(playerId) {
      return normalizeBetResultValue(betResults[playerId]);
    }

    function betResultCounts() {
      return allPlayers.reduce((counts, player) => {
        const value = betResultForPlayer(player.id);
        counts[value] += 1;
        return counts;
      }, { selected: 0, not_selected: 0, pending: 0 });
    }

    function updateBetDebug() {
      if (!betDebugResult) return;
      const counts = betResultCounts();
      betDebugResult.textContent = `保存済み件数：${Object.keys(betResults).length}件 / 招集：${counts.selected}件 / 落選：${counts.not_selected}件 / 未確定：${counts.pending}件`;
    }

    function ownerPredictionForPlayer(owner, playerId) {
      return selectedOwnerIds(owner).has(playerId) ? "selected" : "not_selected";
    }

    function judgementForPlayer(owner, playerId) {
      const result = betResultForPlayer(playerId);
      if (result === "pending") return "未判定";
      return ownerPredictionForPlayer(owner, playerId) === result ? "的中" : "外れ";
    }

    function judgementClass(label) {
      if (label === "的中") return "hit";
      if (label === "外れ") return "miss";
      return "pending";
    }

    const states = {
      karin: loadOwnerState("karin"),
      ryo: loadOwnerState("ryo")
    };
    const officialSquadIds = loadOfficialSquad();
    let betResults = loadBetResults();
    let betResultDraft = { ...betResults };
    const championBetState = loadChampionBetState();
    let activeBetView = "squad";

    const benchSortModes = {
      karin: "original",
      ryo: "original"
    };

    const pitchLimit = 11;
    const rosterLimit = 26;
    const candidateLimit = 55;
    const positionSortOrder = ["GK", "DF", "MF", "OMF/WG", "CF"];
    const benchGroups = [
      { key: "GK", label: "GK" },
      { key: "DF", label: "DF" },
      { key: "MF", label: "MF" },
      { key: "OMF/WG", label: "OMF/WG" },
      { key: "CF", label: "CF" }
    ];

    const formations = {
      "3-4-2-1": [
        slot("GK", 50, 91),
        slot("CB", 30, 74, "LCB"), slot("CB", 50, 76, "CB"), slot("CB", 70, 74, "RCB"),
        slot("MF", 14, 54), slot("MF", 42, 56), slot("MF", 58, 56), slot("MF", 86, 54),
        slot("OMF/WG", 38, 34), slot("OMF/WG", 62, 34),
        slot("CF", 50, 13)
      ],
      "4-2-3-1": [
        slot("GK", 50, 91),
        slot("DF", 18, 73), slot("CB", 39, 74, "LCB"), slot("CB", 61, 74, "RCB"), slot("DF", 82, 73),
        slot("MF", 42, 55), slot("MF", 58, 55),
        slot("OMF/WG", 24, 35), slot("OMF/WG", 50, 34), slot("OMF/WG", 76, 35),
        slot("CF", 50, 13)
      ],
      "5-4-1": [
        slot("GK", 50, 91),
        slot("DF", 12, 73), slot("CB", 31, 75, "LCB"), slot("CB", 50, 76, "CB"), slot("CB", 69, 75, "RCB"), slot("DF", 88, 73),
        slot("MF", 20, 48), slot("MF", 40, 50), slot("MF", 60, 50), slot("MF", 80, 48),
        slot("CF", 50, 13)
      ]
    };

    let activeOwner = "karin";
    let activeView = "tournament";
    let positionGuideMode = "list";
    let statusTimer = null;
    let drag = null;

    const app = document.getElementById("app");
    const board = document.getElementById("board");
    const pitch = document.getElementById("pitch");
    const bench = document.getElementById("bench");
    const benchArea = document.getElementById("benchArea");
    const benchList = document.getElementById("benchList");
    const confirmedArea = document.getElementById("confirmedArea");
    const confirmedList = document.getElementById("confirmedList");
    const droppedArea = document.getElementById("droppedArea");
    const droppedList = document.getElementById("droppedList");
    const resetButton = document.getElementById("resetButton");
    const sortByRatingButton = document.getElementById("sortByRatingButton");
    const lockButton = document.getElementById("lockButton");
    const screenshotButton = document.getElementById("screenshotButton");
    const screenshotReturnButton = document.getElementById("screenshotReturnButton");
    const saveState = document.getElementById("saveState");
    const editModal = document.getElementById("editModal");
    const editPlayerName = document.getElementById("editPlayerName");
    const editPlayerPosition = document.getElementById("editPlayerPosition");
    const editPlayerClub = document.getElementById("editPlayerClub");
    const editNumberInput = document.getElementById("editNumberInput");
    const editModalError = document.getElementById("editModalError");
    const saveEditButton = document.getElementById("saveEditButton");
    const cancelEditButton = document.getElementById("cancelEditButton");
    const pitchCount = document.getElementById("pitchCount");
    const benchCount = document.getElementById("benchCount");
    const confirmedCount = document.getElementById("confirmedCount");
    const droppedCount = document.getElementById("droppedCount");
    const ratingTotal = document.getElementById("ratingTotal");
    const boardTitle = document.getElementById("boardTitle");
    const sideTitle = document.getElementById("sideTitle");
    const sideSub = document.getElementById("sideSub");
    const statusMessage = document.getElementById("statusMessage");
    const ownerTabs = document.querySelectorAll(".owner-tab");
    const formationButtons = document.querySelectorAll(".formation-button");
    const comparisonPanel = document.getElementById("comparisonPanel");
    const screenshotSelectedCount = document.getElementById("screenshotSelectedCount");
    const screenshotBenchTitle = document.getElementById("screenshotBenchTitle");
    const screenshotBenchList = document.getElementById("screenshotBenchList");
    const positionPanel = document.getElementById("positionPanel");
    const karinComparePitch = document.getElementById("karinComparePitch");
    const ryoComparePitch = document.getElementById("ryoComparePitch");
    const karinCompareBenchCount = document.getElementById("karinCompareBenchCount");
    const ryoCompareBenchCount = document.getElementById("ryoCompareBenchCount");
    const karinCompareBenchList = document.getElementById("karinCompareBenchList");
    const ryoCompareBenchList = document.getElementById("ryoCompareBenchList");
    const karinOnlyCount = document.getElementById("karinOnlyCount");
    const commonCount = document.getElementById("commonCount");
    const ryoOnlyCount = document.getElementById("ryoOnlyCount");
    const karinOnlyList = document.getElementById("karinOnlyList");
    const commonList = document.getElementById("commonList");
    const ryoOnlyList = document.getElementById("ryoOnlyList");
    const showBetButton = document.getElementById("showBetButton");
    const betPanel = document.getElementById("betPanel");
    const betTabs = Array.from(document.querySelectorAll(".bet-tab"));
    const betSheets = Array.from(document.querySelectorAll(".bet-sheet"));
    const betAmountInput = document.getElementById("betAmountInput");
    const betError = document.getElementById("betError");
    const betResultMain = document.getElementById("betResultMain");
    const officialSquadList = document.getElementById("officialSquadList");
    const officialSquadCount = document.getElementById("officialSquadCount");
    const betResultsSaveButton = document.getElementById("betResultsSaveButton");
    const betResultsSaveState = document.getElementById("betResultsSaveState");
    const betOfficialCountResult = document.getElementById("betOfficialCountResult");
    const betKarinResult = document.getElementById("betKarinResult");
    const betRyoResult = document.getElementById("betRyoResult");
    const betPendingResult = document.getElementById("betPendingResult");
    const betDiffResult = document.getElementById("betDiffResult");
    const betPaymentResult = document.getElementById("betPaymentResult");
    const betWinnerResult = document.getElementById("betWinnerResult");
    const betDirectionResult = document.getElementById("betDirectionResult");
    const betDebugResult = document.getElementById("betDebugResult");
    const betKarinHits = document.getElementById("betKarinHits");
    const betKarinMisses = document.getElementById("betKarinMisses");
    const betRyoHits = document.getElementById("betRyoHits");
    const betRyoMisses = document.getElementById("betRyoMisses");
    const betKarinHitSummary = document.getElementById("betKarinHitSummary");
    const betKarinMissSummary = document.getElementById("betKarinMissSummary");
    const betRyoHitSummary = document.getElementById("betRyoHitSummary");
    const betRyoMissSummary = document.getElementById("betRyoMissSummary");
    const betUnpickedSummary = document.getElementById("betUnpickedSummary");
    const betUnpickedList = document.getElementById("betUnpickedList");
    const championBetAmountInput = document.getElementById("championBetAmountInput");
    const championBetKarinSelect = document.getElementById("championBetKarinSelect");
    const championBetRyoSelect = document.getElementById("championBetRyoSelect");
    const championBetOfficialSelect = document.getElementById("championBetOfficialSelect");
    const championBetSaveState = document.getElementById("championBetSaveState");
    const championBetResultMain = document.getElementById("championBetResultMain");
    const championBetKarinResult = document.getElementById("championBetKarinResult");
    const championBetRyoResult = document.getElementById("championBetRyoResult");
    const championBetOfficialResult = document.getElementById("championBetOfficialResult");
    const championBetEliminationResult = document.getElementById("championBetEliminationResult");
    const championBetFinalResult = document.getElementById("championBetFinalResult");
    const championBetPaymentResult = document.getElementById("championBetPaymentResult");
    const championBetDirectionResult = document.getElementById("championBetDirectionResult");
    const championRoundList = document.getElementById("championRoundList");
    const tournamentPanel = document.getElementById("tournamentPanel");
    const countryNotesPanel = document.getElementById("countryNotesPanel");
    const venuesPanel = document.getElementById("venuesPanel");
    const rosterPanel = document.getElementById("rosterPanel");
    const matchLineupPanel = document.getElementById("matchLineupPanel");
    const rosterSearchInput = document.getElementById("rosterSearchInput");
    const rosterPositionFilter = document.getElementById("rosterPositionFilter");
    const rosterTotalCount = document.getElementById("rosterTotalCount");
    const karinRosterCount = document.getElementById("karinRosterCount");
    const ryoRosterCount = document.getElementById("ryoRosterCount");
    const rosterList = document.getElementById("rosterList");
    const playerImportText = document.getElementById("playerImportText");
    const playerImportButton = document.getElementById("playerImportButton");
    const playerImportResult = document.getElementById("playerImportResult");
    const positionMap = document.getElementById("positionMap");
    const positionModeTabs = document.getElementById("positionModeTabs");
    const positionModeButtons = document.querySelectorAll(".position-mode-button");
    const positionDetailExamples = document.getElementById("positionDetailExamples");
    const positionDetailTitle = document.getElementById("positionDetailTitle");
    const positionDetailName = document.getElementById("positionDetailName");
    const positionDetailRole = document.getElementById("positionDetailRole");
    const positionDetailPoint = document.getElementById("positionDetailPoint");

    const positionDetails = {
      "GK": {
        name: "ゴールキーパー",
        role: "ゴールを守る最後の砦。シュートストップだけでなく、後方からのパス出しや守備ラインへの指示も重要。",
        point: "安定感、足元、ハイボール対応、国際試合での落ち着き。"
      },
      "CB": {
        name: "センターバック",
        role: "中央で相手FWを止める守備の中心。空中戦、対人守備、カバーリング、ライン統率を担う。",
        point: "強豪相手に耐えられる対人能力、スピード対応、ビルドアップ、セットプレー守備。"
      },
      "LCB": {
        name: "左センターバック",
        role: "左センターバック。左サイドのカバー、左足でのビルドアップ、左WB/SBとの連携が重要。",
        point: "3バックでは左CB、4バックでは左CBとして、左側から攻撃を始めるパスやサイドの背後のカバーを見る。"
      },
      "RCB": {
        name: "右センターバック",
        role: "右センターバック。右サイドのカバー、右足でのビルドアップ、右WB/SBとの連携が重要。",
        point: "3バックでは右CB、4バックでは右CBとして、右側の対人守備とビルドアップの安定感を見る。"
      },
      "SB/WB": {
        name: "サイドバック / ウイングバック",
        role: "4バックでも5バックでも使えるサイド要員。試合展開によって守備的にも攻撃的にも動ける。",
        point: "複数システム対応、守備強度、運動量、戦術理解。"
      },
      "LWB": {
        name: "左ウイングバック",
        role: "左サイドを広く上下動し、守備時は5バック、攻撃時は高い位置を取る。",
        point: "走力、戻りの速さ、左からのクロス、左CBとの連携。"
      },
      "RWB": {
        name: "右ウイングバック",
        role: "右サイドを広く上下動し、守備時は5バック、攻撃時は高い位置を取る。",
        point: "走力、戻りの速さ、右からのクロス、右CBとの連携。"
      },
      "LB": {
        name: "左サイドバック",
        role: "4バックの左側で守備を担当し、攻撃時は左からサポートする。",
        point: "左サイドの1対1、背後の管理、攻撃参加のタイミング。"
      },
      "RB": {
        name: "右サイドバック",
        role: "4バックの右側で守備を担当し、攻撃時は右からサポートする。",
        point: "右サイドの1対1、背後の管理、攻撃参加のタイミング。"
      },
      "DMF/CMF": {
        name: "守備的MF / 中央MF",
        role: "守備も組み立ても担当できる中盤要員。強豪相手では特に重要なポジション。",
        point: "ボールを失わないこと、守備強度、試合を落ち着かせる力。"
      },
      "DMF": {
        name: "守備的ミッドフィルダー",
        role: "中盤の底で相手の攻撃を止め、ボールを奪って攻撃につなげる。チームのバランスを取る役割。",
        point: "守備範囲、ボール奪取、危機察知、パスの安定感。"
      },
      "CMF": {
        name: "セントラルミッドフィルダー",
        role: "中盤の中央で攻守をつなぐ選手。守備、配球、前進、サポートを幅広く担当する。",
        point: "運動量、判断力、プレス耐性、攻守のバランス。"
      },
      "OMF": {
        name: "攻撃的ミッドフィルダー",
        role: "CFの近く、または2列目中央・ハーフスペースで受けてチャンスを作る選手。中央MFと前線の間、いわゆるライン間で受けることが多い。",
        point: "パス、ターン、ミドルシュート、ラストパスが重要。中央で前を向けると攻撃の起点になりやすい。"
      },
      "L_SHADOW": {
        title: "Lシャドー / OMF",
        name: "Lシャドー / OMF",
        role: "CFの左斜め下でプレーする攻撃的MF。左ハーフスペースやライン間で受け、パス、ドリブル、シュートで攻撃に関わる。",
        point: "WGほど外に張らず、中央寄りに立つ。左側で前を向ける技術と得点関与が重要。"
      },
      "R_SHADOW": {
        title: "Rシャドー / OMF",
        name: "Rシャドー / OMF",
        role: "CFの右斜め下でプレーする攻撃的MF。右ハーフスペースやライン間で受け、パス、ドリブル、シュートで攻撃に関わる。",
        point: "WGほど外に張らず、中央寄りに立つ。右側で前を向ける技術と得点関与が重要。"
      },
      "WG": {
        name: "ウイング",
        role: "サイドの高い位置で幅を取り、ドリブル、裏への走り、カットイン、クロス、シュートで攻撃を作る選手。",
        point: "守備時には戻るが、基本的には攻撃色が強い。相手SBを押し下げられるかを見る。"
      },
      "LW": {
        title: "LW / WG",
        name: "LW / 左ウイング",
        role: "左サイド高い位置で幅を取り、縦突破、カットイン、クロス、シュートを担う。",
        point: "右利き左WGは中へカットインしやすい。縦にも中にも行けると守りにくい。"
      },
      "RW": {
        title: "RW / WG",
        name: "RW / 右ウイング",
        role: "右サイド高い位置で幅を取り、縦突破、カットイン、クロス、シュートを担う。",
        point: "左利き右WGは中へカットインしやすい。縦突破とカットインの両方があると強い。"
      },
      "SH": {
        name: "サイドハーフ",
        role: "中盤のサイドで、攻撃だけでなく守備にも強く関わる選手。4-4-2や5-4-1の守備時にサイドを埋める。",
        point: "相手SB/WBの攻撃参加に対応する。WGより守備タスクが明確で、守備負担が大きい。"
      },
      "LM_SH": {
        title: "LM/SH",
        name: "LM/SH",
        role: "左サイドハーフ。守備時に左サイドを埋め、攻撃時は左から前進する。",
        point: "SHはWGより守備負担が大きい。左サイドの守備参加とカウンターの運び役が重要。"
      },
      "RM_SH": {
        title: "RM/SH",
        name: "RM/SH",
        role: "右サイドハーフ。守備時に右サイドを埋め、攻撃時は右から前進する。",
        point: "SHはWGより守備負担が大きい。右サイドの守備参加とカウンターの運び役が重要。"
      },
      "WG/SH": {
        name: "ウイング / サイドハーフ",
        role: "4-2-3-1の左右2列目。攻撃時はWGのように幅を取り、守備時はSHとして中盤まで戻ることがある。",
        point: "突破力、スピード、クロス、守備参加、カウンター対応。"
      },
      "CF": {
        name: "センターフォワード",
        role: "最前線で得点を狙う選手。ポストプレー、裏抜け、空中戦、決定力が求められる。",
        point: "得点力、収まり、前線からの守備、強豪相手でも起点になれるか。"
      }
    };

    const positionGuideModes = {
      "3-4-2-1": {
        initial: "L_SHADOW",
        labels: [
          guideLabel("GK", "pos-label-gk", 50, 90),
          guideLabel("LCB", "pos-label-df", 30, 74, "LCB"),
          guideLabel("CB", "pos-label-df", 50, 76, "CB"),
          guideLabel("RCB", "pos-label-df", 70, 74, "RCB"),
          guideLabel("LWB", "pos-label-df", 14, 55, "LWB"),
          guideLabel("RWB", "pos-label-df", 86, 55, "RWB"),
          guideLabel("DMF", "pos-label-mf", 42, 56, "DMF"),
          guideLabel("CMF", "pos-label-mf", 58, 56, "CMF"),
          guideLabel("Lシャドー/OMF", "pos-label-omf", 38, 34, "L_SHADOW"),
          guideLabel("Rシャドー/OMF", "pos-label-omf", 62, 34, "R_SHADOW"),
          guideLabel("CF", "pos-label-cf", 50, 13)
        ]
      },
      "4-2-3-1": {
        initial: "OMF",
        labels: [
          guideLabel("GK", "pos-label-gk", 50, 90),
          guideLabel("LB", "pos-label-df", 18, 73, "LB"),
          guideLabel("LCB", "pos-label-df", 39, 74, "LCB"),
          guideLabel("RCB", "pos-label-df", 61, 74, "RCB"),
          guideLabel("RB", "pos-label-df", 82, 73, "RB"),
          guideLabel("DMF", "pos-label-mf", 42, 55, "DMF"),
          guideLabel("CMF", "pos-label-mf", 58, 55, "CMF"),
          guideLabel("LW/WG", "pos-label-omf", 24, 35, "LW"),
          guideLabel("OMF", "pos-label-omf", 50, 34, "OMF"),
          guideLabel("RW/WG", "pos-label-omf", 76, 35, "RW"),
          guideLabel("CF", "pos-label-cf", 50, 13)
        ]
      },
      "5-4-1": {
        initial: "SH/WM",
        labels: [
          guideLabel("GK", "pos-label-gk", 50, 90),
          guideLabel("LWB", "pos-label-df", 12, 73, "LWB"),
          guideLabel("LCB", "pos-label-df", 31, 75, "LCB"),
          guideLabel("CB", "pos-label-df", 50, 76, "CB"),
          guideLabel("RCB", "pos-label-df", 69, 75, "RCB"),
          guideLabel("RWB", "pos-label-df", 88, 73, "RWB"),
          guideLabel("LM/SH", "pos-label-mf", 20, 48, "LM_SH"),
          guideLabel("DMF", "pos-label-mf", 40, 50, "DMF"),
          guideLabel("CMF", "pos-label-mf", 60, 50, "CMF"),
          guideLabel("RM/SH", "pos-label-mf", 80, 48, "RM_SH"),
          guideLabel("CF", "pos-label-cf", 50, 13)
        ]
      },
      list: {
        initial: "GK",
        labels: [
          guideLabel("GK", "pos-label-gk", 50, 90),
          guideLabel("CB", "pos-label-df", 50, 73, "CB"),
          guideLabel("LB", "pos-label-df", 18, 66, "LB"),
          guideLabel("RB", "pos-label-df", 82, 66, "RB"),
          guideLabel("DMF", "pos-label-mf", 42, 51, "DMF"),
          guideLabel("CMF", "pos-label-mf", 58, 51, "CMF"),
          guideLabel("OMF", "pos-label-omf", 50, 33, "OMF"),
          guideLabel("LW/WG", "pos-label-omf", 25, 29, "LW"),
          guideLabel("RW/WG", "pos-label-omf", 75, 29, "RW"),
          guideLabel("CF", "pos-label-cf", 50, 12, "CF")
        ]
      }
    };

    const positionExampleGroups = [
      positionExampleGroup("GK", [["鈴木彩艶", "パルマ"], ["大迫敬介", "サンフレッチェ広島"]], [["マヌエル・ノイアー", "バイエルン"], ["ティボー・クルトワ", "レアル・マドリード"]]),
      positionExampleGroup("LCB", [["伊藤洋輝", "バイエルン"], ["瀬古歩夢", "ル・アーヴル"]], [["ヨシュコ・グヴァルディオル", "マンチェスター・シティ"], ["アレッサンドロ・バストーニ", "インテル"]]),
      positionExampleGroup("RCB", [["板倉滉", "ボルシアMG"], ["冨安健洋", "AFCアヤックス"]], [["ルベン・ディアス", "マンチェスター・シティ"], ["ウィリアン・サリバ", "アーセナル"]]),
      positionExampleGroup("CB", [["谷口彰悟", "シント＝トロイデン"], ["高井幸大", "ボルシアMG"]], [["フィルジル・ファン・ダイク", "リヴァプール"], ["キム・ミンジェ", "バイエルン"]]),
      positionExampleGroup("LWB", [["伊藤洋輝", "バイエルン"], ["旗手怜央", "セルティック"]], [["テオ・エルナンデス", "アル・ヒラル"], ["アンドリュー・ロバートソン", "リヴァプール"]]),
      positionExampleGroup("LB", [["伊藤洋輝", "バイエルン"], ["旗手怜央", "セルティック"]], [["テオ・エルナンデス", "アル・ヒラル"], ["アンドリュー・ロバートソン", "リヴァプール"]]),
      positionExampleGroup("RWB", [["菅原由勢", "ヴェルダー・ブレーメン"], ["毎熊晟矢", "AZ"]], [["アクラフ・ハキミ", "パリ・サンジェルマン"], ["トレント・アレクサンダー＝アーノルド", "レアル・マドリード"]]),
      positionExampleGroup("RB", [["菅原由勢", "ヴェルダー・ブレーメン"], ["毎熊晟矢", "AZ"]], [["アクラフ・ハキミ", "パリ・サンジェルマン"], ["トレント・アレクサンダー＝アーノルド", "レアル・マドリード"]]),
      positionExampleGroup("DMF", [["遠藤航", "リヴァプール"], ["守田英正", "スポルティング"]], [["ロドリ", "マンチェスター・シティ"], ["デクラン・ライス", "アーセナル"]]),
      positionExampleGroup("CMF", [["田中碧", "リーズ"], ["佐野海舟", "マインツ"]], [["フェデリコ・バルベルデ", "レアル・マドリード"], ["ルカ・モドリッチ", "レアル・マドリード"]]),
      positionExampleGroup("OMF", [["久保建英", "レアル・ソシエダ"], ["鎌田大地", "クリスタル・パレス"]], [["ジャマル・ムシアラ", "バイエルン"], ["フリアン・アルバレス", "アトレティコ・マドリード"]]),
      positionExampleGroup("L_SHADOW", [["久保建英", "レアル・ソシエダ"], ["鎌田大地", "クリスタル・パレス"]], [["ジャマル・ムシアラ", "バイエルン"], ["フリアン・アルバレス", "アトレティコ・マドリード"]]),
      positionExampleGroup("R_SHADOW", [["堂安律", "フランクフルト"], ["南野拓実", "モナコ"]], [["フィル・フォーデン", "マンチェスター・シティ"], ["ベルナルド・シウバ", "マンチェスター・シティ"]]),
      positionExampleGroup("WG", [["三笘薫", "ブライトン"], ["伊東純也", "KRCヘンク"]], [["ジェレミー・ドク", "マンチェスター・シティ"], ["モハメド・サラー", "リヴァプール"]]),
      positionExampleGroup("LW", [["三笘薫", "ブライトン"], ["中村敬斗", "スタッド・ランス"]], [["ヴィニシウス・ジュニオール", "レアル・マドリード"], ["ジェレミー・ドク", "マンチェスター・シティ"]]),
      positionExampleGroup("RW", [["伊東純也", "KRCヘンク"], ["堂安律", "フランクフルト"]], [["ラミン・ヤマル", "バルセロナ"], ["モハメド・サラー", "リヴァプール"]]),
      positionExampleGroup("SH", [["前田大然", "セルティック"], ["堂安律", "フランクフルト"]], [["キングスレイ・コマン", "バイエルン"], ["レロイ・サネ", "ガラタサライ"]]),
      positionExampleGroup("LM_SH", [["前田大然", "セルティック"], ["旗手怜央", "セルティック"]], [["ガブリエウ・マルティネッリ", "アーセナル"], ["ルイス・ディアス", "バイエルン"]]),
      positionExampleGroup("RM_SH", [["堂安律", "フランクフルト"], ["伊東純也", "KRCヘンク"]], [["ブカヨ・サカ", "アーセナル"], ["ジャロッド・ボーウェン", "ウェストハム"]]),
      positionExampleGroup("WG/SH", [["伊東純也", "KRCヘンク"], ["堂安律", "フランクフルト"]], [["ラファエル・レオン", "ミラン"], ["マイケル・オリーズ", "バイエルン"]]),
      positionExampleGroup("CF", [["上田綺世", "フェイエノールト"], ["小川航基", "NEC"]], [["アーリング・ハーランド", "マンチェスター・シティ"], ["ハリー・ケイン", "バイエルン"]])
    ];

    function slot(group, x, y, label = group) {
      return { group, x, y, label };
    }

    function guideLabel(label, className, x, y, code = label) {
      return { label, className, x, y, code };
    }

    function positionExampleGroup(code, japan, world) {
      const toExamples = (items) => items.map(([name, club]) => examplePlayer(name, club, `pics/${name}.jpg`));
      return { code, japan: toExamples(japan), world: toExamples(world) };
    }

    function examplePlayer(name, club, imageUrl) {
      return {
        name,
        club,
        imageUrl,
        imageFallbacks: uniqueList([
          `pics/${name}.webp`,
          `pics/${name}.jpeg`,
          `pics/${name}.jfif`,
          `pics/${name}.png`
        ])
      };
    }

    function initialOf(name) {
      return (name || "?").trim().charAt(0).toUpperCase();
    }

    function initialRating(status) {
      if (status === "確実") return "◎";
      if (status === "本命") return "〇";
      if (status === "可能性") return "△";
      return "△";
    }

    function uniqueList(items) {
      return [...new Set(items.filter(Boolean))];
    }

    function imagePathFromExcel(value) {
      const file = String(value || "").trim();
      if (!file) return "";
      if (/^https?:\/\//i.test(file) || file.startsWith("pics/")) return file;
      return `pics/${file}`;
    }

    function updatePlayerImageSources(player, excelImageFile = "") {
      const previous = player.imageUrl || "";
      const sources = uniqueList([
        `pics/${player.name}.jpg`,
        `pics/${player.name}.webp`,
        `pics/${player.name}.jpeg`,
        `pics/${player.name}.jfif`,
        `pics/${player.name}.png`,
        imagePathFromExcel(excelImageFile || player.imageFile),
        previous
      ]);
      player.imageUrl = sources[0] || "";
      player.imageFallbacks = sources.slice(1);
      if (excelImageFile) {
        player.imageFile = excelImageFile;
      }
    }

    function applyImageFallback(img, player, fallbackIndex = 0) {
      const fallbacks = player.imageFallbacks || [];
      if (fallbackIndex >= fallbacks.length) {
        return false;
      }
      img.dataset.fallbackIndex = String(fallbackIndex + 1);
      img.src = fallbacks[fallbackIndex];
      return true;
    }

    function shortPosition(position) {
      if (!position) return "";
      return position.split("/")[0];
    }

    function currentRating(playerId, owner = activeOwner) {
      return states[owner]?.get(playerId)?.rating || "△";
    }

    function currentNumber(playerId, owner = activeOwner) {
      return officialNumberForPlayerId(playerId) || states[owner]?.get(playerId)?.number || allPlayerById(playerId)?.number || "";
    }

    function officialNumberForPlayerId(playerId) {
      const player = allPlayerById(playerId);
      return player ? officialSquadNumbers[player.name] || "" : "";
    }

    function isInteractionLocked() {
      return screenshotMode || ownerLocks[activeOwner];
    }

    function updateSaveState(owner = activeOwner) {
      if (!saveState) return;
      const now = new Date();
      const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      saveLabels[owner] = `保存済み：${time}`;
      saveState.textContent = owner === activeOwner ? saveLabels[owner] : "自動保存済み";
    }

    function nextRating(rating) {
      const index = ratingOrder.indexOf(rating);
      return ratingOrder[(index + 1) % ratingOrder.length];
    }

    function ratingRank(player) {
      const rating = currentRating(player.id);
      const index = ratingOrder.indexOf(rating);
      return index === -1 ? ratingOrder.length : index;
    }

    function originalIndex(player) {
      return playerOriginalIndex(player);
    }

    function sortByRatingThenPosition(a, b) {
      const ratingDiff = ratingRank(a) - ratingRank(b);
      if (ratingDiff !== 0) return ratingDiff;
      return originalIndex(a) - originalIndex(b);
    }

    function sortByOriginalOrder(a, b) {
      return originalIndex(a) - originalIndex(b);
    }

    function sortBenchPlayers(players) {
      const sorted = [...players];
      if (benchSortModes[activeOwner] === "rating") {
        return sorted.sort(sortByRatingThenPosition);
      }
      return sorted.sort(sortByOriginalOrder);
    }

    function isAutoSelectable(player) {
      return currentRating(player.id) !== "×";
    }

    function playerOriginalIndex(player) {
      const index = allPlayers.findIndex((item) => item.id === player.id);
      return index === -1 ? Number.MAX_SAFE_INTEGER : index;
    }

    function positionSortRank(player) {
      const group = benchGroupKey(player.position);
      const index = positionSortOrder.indexOf(group);
      return index === -1 ? positionSortOrder.length : index;
    }

    function sortForComparison(a, b) {
      const groupDiff = positionSortRank(a) - positionSortRank(b);
      if (groupDiff !== 0) return groupDiff;
      return playerOriginalIndex(a) - playerOriginalIndex(b);
    }

    function updatePlacement(playerId, placement) {
      const current = states[activeOwner].get(playerId) || {};
      const area = placement.area === "pitch" ? "pitch" : "bench";
      states[activeOwner].set(playerId, {
        area,
        x: placement.x,
        y: placement.y,
        rating: current.rating || "△",
        number: officialNumberForPlayerId(playerId) || current.number || "",
        manual: placement.manual ?? current.manual ?? false
      });
    }

    function positionClass(position) {
      if (position === "GK") return "pos-gk";
      if (/CB|SB|WB/.test(position)) return /DMF|CMF|OMF|WG|FW|CF|SH/.test(position) ? "pos-mix" : "pos-df";
      if (/DMF|CMF|OMF|SH/.test(position)) return /WG|FW|CF/.test(position) ? "pos-mix" : "pos-mf";
      if (/WG|FW|CF/.test(position)) return "pos-fw";
      return "pos-mix";
    }

    function benchGroupKey(position) {
      if (position === "GK") return "GK";
      if (/CF/.test(position)) return "CF";
      if (/OMF|WG|SH|FW/.test(position)) return "OMF/WG";
      if (/DMF|CMF/.test(position)) return "MF";
      if (/CB|SB|WB/.test(position)) return "DF";
      return "MF";
    }

    function playerMatchesGroup(player, group) {
      const position = player.position;
      if (group === "GK") return position === "GK";
      if (group === "CB") return /CB/.test(position);
      if (group === "DF") return /CB|SB|WB/.test(position);
      if (group === "MF") return /DMF|CMF|WB/.test(position);
      if (group === "OMF/WG") return /OMF|WG|SH/.test(position);
      if (group === "CF") return /CF|FW/.test(position);
      return false;
    }

    function pitchPositionLabel(player, owner = activeOwner) {
      const placement = states[owner]?.get(player.id);
      if (!placement || !/CB/.test(player.position)) return shortPosition(player.position);
      if (placement.x < 45) return "LCB";
      if (placement.x > 55) return "RCB";
      return "CB";
    }

    function renderSlotLabels(target, formationName) {
      target.querySelectorAll(".slot-label").forEach((label) => label.remove());
      const slots = formations[formationName] || [];
      slots
        .filter((formationSlot) => /CB/.test(formationSlot.label))
        .forEach((formationSlot) => {
          const label = document.createElement("div");
          label.className = "slot-label";
          label.textContent = formationSlot.label;
          label.style.left = `${formationSlot.x}%`;
          label.style.top = `${formationSlot.y}%`;
          target.appendChild(label);
        });
    }

    function createBenchGroups() {
      const containers = new Map();
      benchGroups.forEach((group) => {
        const section = document.createElement("section");
        section.className = "bench-group";
        section.dataset.group = group.key;

        const heading = document.createElement("div");
        heading.className = "bench-group-title";
        heading.innerHTML = `<span>${group.label}</span><span data-group-count="${group.key}">0人</span>`;

        const list = document.createElement("div");
        list.className = "bench-group-list";

        section.append(heading, list);
        benchList.appendChild(section);
        containers.set(group.key, { section, list, count: heading.querySelector("[data-group-count]") });
      });
      return containers;
    }

    function createPlayerCard(player, onPitch, owner = activeOwner) {
      const card = document.createElement("article");
      card.className = `player-card${onPitch ? " on-pitch" : ""}`;
      card.dataset.playerId = player.id;
      card.setAttribute("aria-label", `${player.name} ${player.position} ${player.club}`);
      const photo = document.createElement("div");
      photo.className = "photo";

      if (player.imageUrl) {
        const img = document.createElement("img");
        img.src = player.imageUrl;
        img.alt = player.name;
        if (player.imageClass) {
          img.className = player.imageClass;
        }
        img.onerror = () => {
          const nextIndex = Number(img.dataset.fallbackIndex || 0);
          if (applyImageFallback(img, player, nextIndex)) return;
          photo.textContent = initialOf(player.name);
          img.remove();
        };
        photo.appendChild(img);
      } else {
        photo.textContent = initialOf(player.name);
      }

      const info = document.createElement("div");
      info.className = "info";

      const name = document.createElement("div");
      name.className = "name";
      name.textContent = player.name;

      const meta = document.createElement("div");
      meta.className = "meta";

      let rating = null;
      if (!onPitch) {
        rating = document.createElement("button");
        rating.className = "rating-mark clickable";
        rating.textContent = currentRating(player.id, owner);
        rating.setAttribute("aria-label", `${player.name} 評価 ${rating.textContent}`);
        rating.type = "button";
        rating.addEventListener("pointerdown", (event) => {
          event.stopPropagation();
        });
        rating.addEventListener("click", (event) => {
          event.stopPropagation();
          cycleRating(player.id);
        });
      }

      const position = document.createElement("span");
      position.className = `position ${positionClass(player.position)}`;
      position.textContent = onPitch ? pitchPositionLabel(player, owner) : player.position;

      const number = document.createElement("span");
      number.className = "number-badge";
      const displayNumber = currentNumber(player.id, owner);
      number.textContent = `#${displayNumber}`;

      const club = document.createElement("span");
      club.className = "club";
      club.textContent = player.club;

      if (rating) {
        meta.append(rating);
      }
      if (displayNumber) {
        meta.append(number);
      }
      meta.append(position, club);
      if (!onPitch && activeView === "owner" && !screenshotMode) {
        const edit = document.createElement("button");
        edit.className = "edit-player-button";
        edit.type = "button";
        edit.textContent = "編集";
        edit.addEventListener("pointerdown", (event) => {
          event.stopPropagation();
        });
        edit.addEventListener("click", (event) => {
          event.stopPropagation();
          openEditModal(player.id);
        });
        meta.append(edit);
      }
      info.append(name, meta);
      card.append(photo, info);

      if (isInteractionLocked()) {
        card.classList.add("locked");
      }

      if (activeView === "owner" && !isInteractionLocked()) {
        card.addEventListener("pointerdown", startDrag);
      }
      if (!onPitch && activeView === "owner" && !screenshotMode) {
        card.addEventListener("dblclick", (event) => {
          event.stopPropagation();
          openEditModal(player.id);
        });
      }
      return card;
    }

    function predictionStateForPlayer(playerId, owner = activeOwner) {
      const area = states[owner]?.get(playerId)?.area || "bench";
      return area === "dropped" ? "dropped" : "selected";
    }

    function shouldShowAsOwnerSelected(player, placement) {
      if (!player || !placement) return false;
      return isOfficialSquadPlayer(player.id);
    }

    function createPredictionBadge(playerId, owner = activeOwner) {
      const badge = document.createElement("span");
      const prediction = predictionStateForPlayer(playerId, owner);
      badge.className = `prediction-badge${prediction === "dropped" ? " out" : ""}`;
      badge.textContent = "";
      return badge;
    }

    function createResultBadge(text, className) {
      const badge = document.createElement("span");
      badge.className = `result-badge ${className || ""}`.trim();
      badge.textContent = text;
      return badge;
    }

    function createResultBadges(player, owner) {
      const wrap = document.createElement("div");
      wrap.className = "result-badges";
      const formalResult = betResultForPlayer(player.id);
      const judgement = judgementForPlayer(owner, player.id);
      wrap.append(
        createResultBadge(`正式結果：${betResultLabels[formalResult]}`, formalResult === "pending" ? "pending" : ""),
        createResultBadge(`判定：${judgement}`, judgementClass(judgement))
      );
      return wrap;
    }

    function clearPitchCards() {
      pitch.querySelectorAll(".player-card, .slot-label").forEach((card) => card.remove());
    }

    function render() {
      document.body.classList.toggle("screenshot-mode", screenshotMode);
      screenshotButton.classList.toggle("active", screenshotMode);

      if (activeView === "compare") {
        renderCompare();
        return;
      }

      if (activeView === "positions") {
        renderPositions();
        return;
      }

      if (activeView === "bet") {
        renderBet();
        return;
      }

      if (activeView === "roster") {
        renderRoster();
        return;
      }

      if (activeView === "tournament") {
        renderTournament();
        return;
      }

      if (["country-notes", "venues"].includes(activeView)) {
        renderWorldCupInfo(activeView);
        return;
      }

      if (activeView === "match-lineup") {
        renderMatchLineup();
        return;
      }

      benchList.innerHTML = "";
      confirmedList.innerHTML = "";
      droppedList.innerHTML = "";
      clearPitchCards();
      resetOwnerViewShell();

      const state = states[activeOwner];
      const benchContainers = createBenchGroups();
      let pitchTotal = 0;
      let benchTotal = 0;
      let confirmedTotal = 0;
      let droppedTotal = 0;
      const benchGroupTotals = Object.fromEntries(benchGroups.map((group) => [group.key, 0]));
      const benchGroupPlayers = new Map(benchGroups.map((group) => [group.key, []]));

      renderSlotLabels(pitch, currentFormations[activeOwner]);

      currentPlayers().forEach((player) => {
        const placement = state.get(player.id);
        const showAsSelected = shouldShowAsOwnerSelected(player, placement);
        if (placement.area === "pitch") {
          if (!showAsSelected) return;
          pitchTotal += 1;
          const card = createPlayerCard(player, true);
          card.style.left = `${placement.x}%`;
          card.style.top = `${placement.y}%`;
          pitch.appendChild(card);
        } else if (placement.area === "confirmed") {
          if (!showAsSelected) return;
          confirmedTotal += 1;
          confirmedList.appendChild(createPlayerCard(player, false));
        } else if (placement.area === "dropped") {
          droppedTotal += 1;
          droppedList.appendChild(createPlayerCard(player, false));
        } else {
          if (!showAsSelected) return;
          benchTotal += 1;
          const groupKey = benchGroupKey(player.position);
          benchGroupTotals[groupKey] += 1;
          benchGroupPlayers.get(groupKey).push(player);
        }
      });

      benchGroups.forEach((group) => {
        const container = benchContainers.get(group.key);
        const total = benchGroupTotals[group.key];
        container.count.textContent = `${total}人`;
        container.section.hidden = total === 0;
        sortBenchPlayers(benchGroupPlayers.get(group.key)).forEach((player) => {
          container.list.appendChild(createPlayerCard(player, false));
        });
      });
      benchSortModes[activeOwner] = "original";

      boardTitle.textContent = `${owners[activeOwner]}予想（${teamName}）`;
      sideTitle.textContent = `${owners[activeOwner]}の予想`;
      sideSub.textContent = "共有保存先はFirebase Realtime Databaseです。端末内保存は一時キャッシュです。";
      pitchCount.textContent = `ピッチ: ${pitchTotal}人/${pitchLimit}人`;
      pitchCount.classList.toggle("over-limit", pitchTotal > pitchLimit);
      benchCount.textContent = `ベンチ: ${benchTotal}人`;
      confirmedCount.textContent = `${confirmedTotal}人`;
      droppedCount.textContent = `${droppedTotal}人`;
      ratingTotal.textContent = `総人数：${currentPlayers().length}人`;
      saveState.textContent = saveLabels[activeOwner] || "端末内保存 / JSON共有可";
      lockButton.textContent = ownerLocks[activeOwner] ? "ロック解除" : "配置ロック";
      lockButton.classList.toggle("active", ownerLocks[activeOwner]);
      formationButtons.forEach((button) => {
        button.disabled = ownerLocks[activeOwner];
        button.classList.toggle("active", button.dataset.formation === currentFormations[activeOwner]);
      });
      renderScreenshotSummary(pitchTotal);
      ownerTabs.forEach((tab) => {
        tab.classList.toggle("active", tab.dataset.view === "owner" && tab.dataset.owner === activeOwner);
      });
    }

    function renderCompare() {
      clearPitchCards();
      clearComparePitches();
      clearCompareBenches();
      benchList.innerHTML = "";
      confirmedList.innerHTML = "";
      droppedList.innerHTML = "";

      app.classList.add("single-panel");
      board.classList.add("compare-only");
      board.classList.remove("with-panel");
      board.classList.remove("explain-only");
      board.classList.remove("bet-only");
      board.classList.remove("roster-only");
      board.classList.remove("tournament-only");
      board.classList.remove("info-only");
      board.classList.remove("lineup-only");
      comparisonPanel.classList.add("active");
      positionPanel.classList.remove("active");
      rosterPanel.classList.remove("active");
      betPanel.classList.remove("active");
      tournamentPanel.classList.remove("active");
      matchLineupPanel.classList.remove("active");
      hideWorldCupInfoPanels();

      boardTitle.textContent = `比較コート（${teamName}）`;
      sideTitle.textContent = "比較";
      sideSub.textContent = "";
      statusMessage.textContent = "";
      window.clearTimeout(statusTimer);
      pitchCount.textContent = "ピッチ比較";
      pitchCount.classList.remove("over-limit");
      saveState.textContent = "閲覧専用";

      renderOwnerComparePitch("karin", karinComparePitch);
      renderOwnerComparePitch("ryo", ryoComparePitch);
      renderCompareBench("karin", karinCompareBenchList, karinCompareBenchCount);
      renderCompareBench("ryo", ryoCompareBenchList, ryoCompareBenchCount);
      renderDiffPanel();
      ownerTabs.forEach((tab) => {
        tab.classList.toggle("active", tab.dataset.view === "compare");
      });
    }

    function clearComparePitches() {
      [karinComparePitch, ryoComparePitch].forEach((target) => {
        target.querySelectorAll(".player-card, .compare-card, .slot-label").forEach((card) => card.remove());
      });
    }

    function clearCompareBenches() {
      [karinCompareBenchList, ryoCompareBenchList].forEach((target) => {
        target.innerHTML = "";
      });
    }

    function renderOwnerComparePitch(owner, target) {
      const state = states[owner];
      renderSlotLabels(target, currentFormations[owner]);
      playersForOwner(owner).forEach((player) => {
        const placement = state.get(player.id);
        if (placement?.area !== "pitch") return;
        const card = createCompareCard(player, owner);
        card.style.left = `${clamp(placement.x, 10, 90)}%`;
        card.style.top = `${clamp(placement.y, 8, 92)}%`;
        target.appendChild(card);
      });
    }

    function createCompareCard(player, owner) {
      const card = createPlayerCard(player, true, owner);
      card.classList.remove("player-card", "on-pitch");
      card.classList.add("compare-card");
      return card;
    }

    function selectedPlayersForOwner(owner) {
      const state = states[owner];
      const selected = [];
      const used = new Set();
      officialSquadPlayers()
        .filter((player) => state.get(player.id)?.area === "pitch")
        .sort(sortForComparison)
        .forEach((player) => {
          selected.push(player);
          used.add(player.id);
        });
      officialSquadPlayers()
        .filter((player) => !used.has(player.id))
        .sort((a, b) => {
          const ratingDiff = ratingOrder.indexOf(currentRating(a.id, owner)) - ratingOrder.indexOf(currentRating(b.id, owner));
          if (ratingDiff !== 0) return ratingDiff;
          return playerOriginalIndex(a) - playerOriginalIndex(b);
        })
        .slice(0, Math.max(0, rosterLimit - selected.length))
        .forEach((player) => selected.push(player));
      return selected.slice(0, rosterLimit);
    }

    function benchPlayersForOwner(owner) {
      const state = states[owner];
      return officialSquadPlayers()
        .filter((player) => state.get(player.id)?.area !== "pitch")
        .sort(sortForComparison);
    }

    function visibleSelectedPlayersForOwner(owner) {
      return selectedPlayersForOwner(owner)
        .filter((player) => betResultForPlayer(player.id) === "selected");
    }

    function visibleBenchPlayersForOwner(owner) {
      const state = states[owner];
      return visibleSelectedPlayersForOwner(owner)
        .filter((player) => state.get(player.id)?.area !== "pitch")
        .sort(sortForComparison);
    }

    function createMiniPlayer(player, owner) {
      const row = document.createElement("div");
      row.className = "mini-player";

      const photo = document.createElement("div");
      photo.className = "photo";
      if (player.imageUrl) {
        const img = document.createElement("img");
        img.src = player.imageUrl;
        img.alt = player.name;
        if (player.imageClass) img.className = player.imageClass;
        img.onerror = () => {
          const nextIndex = Number(img.dataset.fallbackIndex || 0);
          if (applyImageFallback(img, player, nextIndex)) return;
          photo.textContent = initialOf(player.name);
          img.remove();
        };
        photo.appendChild(img);
      } else {
        photo.textContent = initialOf(player.name);
      }

      const info = document.createElement("div");
      const name = document.createElement("div");
      name.className = "mini-player-name";
      name.textContent = player.name;
      const position = document.createElement("div");
      position.className = "mini-player-position";
      position.textContent = `${player.position}${currentNumber(player.id, owner) ? ` #${currentNumber(player.id, owner)}` : ""}`;
      info.append(name, position);
      if (owner && activeView === "bet") {
        info.appendChild(createResultBadges(player, owner));
      }
      row.append(photo, info);
      return row;
    }

    function renderScreenshotSummary(pitchTotal) {
      if (!screenshotBenchList) return;
      screenshotBenchList.innerHTML = "";
      const selected = visibleSelectedPlayersForOwner(activeOwner);
      const benchPlayers = visibleBenchPlayersForOwner(activeOwner);
      screenshotSelectedCount.textContent = `選出人数：${selected.length}人`;
      screenshotBenchTitle.textContent = `ベンチメンバー：${benchPlayers.length}人`;
      benchPlayers.forEach((player) => {
        screenshotBenchList.appendChild(createMiniPlayer(player, activeOwner));
      });
      if (benchPlayers.length === 0 && pitchTotal > 0) {
        const empty = document.createElement("div");
        empty.className = "diff-empty";
        empty.textContent = "ベンチメンバーなし";
        screenshotBenchList.appendChild(empty);
      }
    }

    function renderCompareBench(owner, target, countTarget) {
      const players = benchPlayersForOwner(owner);
      target.innerHTML = "";
      countTarget.textContent = `${players.length}人`;
      if (players.length === 0) {
        const empty = document.createElement("div");
        empty.className = "diff-empty";
        empty.textContent = "なし";
        target.appendChild(empty);
        return;
      }
      players.forEach((player) => {
        target.appendChild(createMiniPlayer(player, owner));
      });
    }

    function pitchPlayersForOwner(owner) {
      const state = states[owner];
      return playersForOwner(owner)
        .filter((player) => state.get(player.id)?.area === "pitch")
        .sort(sortForComparison)
        .slice(0, pitchLimit);
    }

    function renderDiffPanel() {
      const karinSelected = selectedPlayersForOwner("karin");
      const ryoSelected = selectedPlayersForOwner("ryo");
      const karinIds = new Set(karinSelected.map((player) => player.id));
      const ryoIds = new Set(ryoSelected.map((player) => player.id));

      const karinOnly = karinSelected.filter((player) => !ryoIds.has(player.id));
      const common = karinSelected.filter((player) => ryoIds.has(player.id));
      const ryoOnly = ryoSelected.filter((player) => !karinIds.has(player.id));

      fillDiffList(karinOnlyList, karinOnly);
      fillDiffList(commonList, common);
      fillDiffList(ryoOnlyList, ryoOnly);
      karinOnlyCount.textContent = `${karinOnly.length}人`;
      commonCount.textContent = `${common.length}人`;
      ryoOnlyCount.textContent = `${ryoOnly.length}人`;
    }

    function fillDiffList(target, players) {
      target.innerHTML = "";
      if (players.length === 0) {
        const empty = document.createElement("div");
        empty.className = "diff-empty";
        empty.textContent = "なし";
        target.appendChild(empty);
        return;
      }

      players.forEach((player) => {
        const row = document.createElement("div");
        row.textContent = `${player.name}（${player.position}）`;
        target.appendChild(row);
      });
    }

    function renderTournament() {
      clearPitchCards();
      clearComparePitches();
      benchList.innerHTML = "";
      confirmedList.innerHTML = "";
      droppedList.innerHTML = "";

      app.classList.add("single-panel");
      board.classList.add("with-panel");
      board.classList.add("tournament-only");
      board.classList.remove("compare-only");
      board.classList.remove("bet-only");
      board.classList.remove("roster-only");
      board.classList.remove("explain-only");
      board.classList.remove("info-only");
      board.classList.remove("lineup-only");
      comparisonPanel.classList.remove("active");
      betPanel.classList.remove("active");
      rosterPanel.classList.remove("active");
      positionPanel.classList.remove("active");
      matchLineupPanel.classList.remove("active");
      tournamentPanel.classList.add("active");
      [comparisonPanel, betPanel, rosterPanel, positionPanel].forEach((panel) => panel.classList.remove("active"));
      hideWorldCupInfoPanels();
      clearPitchCards();
      clearComparePitches();

      boardTitle.textContent = "W杯2026";
      sideTitle.textContent = "スコア/日程";
      sideSub.textContent = "共有保存先はFirebase Realtime Databaseです。localStorageは一時キャッシュです。";
      statusMessage.textContent = "";
      window.clearTimeout(statusTimer);
      pitchCount.textContent = "2026本大会";
      pitchCount.classList.remove("over-limit");
      saveState.textContent = "端末内保存";
      window.WorldCupTournament?.init();
      window.WorldCupTournament?.renderContent();

      ownerTabs.forEach((tab) => {
        tab.classList.toggle("active", tab.dataset.view === "tournament");
      });
    }

    function hideWorldCupInfoPanels() {
      [countryNotesPanel, venuesPanel].forEach((panel) => panel?.classList.remove("active"));
    }

    function renderWorldCupInfo(view) {
      clearPitchCards();
      clearComparePitches();
      benchList.innerHTML = "";
      confirmedList.innerHTML = "";
      droppedList.innerHTML = "";

      app.classList.add("single-panel");
      board.classList.add("with-panel");
      board.classList.add("info-only");
      board.classList.remove("compare-only");
      board.classList.remove("bet-only");
      board.classList.remove("roster-only");
      board.classList.remove("explain-only");
      board.classList.remove("tournament-only");
      board.classList.remove("lineup-only");
      [comparisonPanel, betPanel, rosterPanel, positionPanel, tournamentPanel, matchLineupPanel].forEach((panel) => panel?.classList.remove("active"));
      hideWorldCupInfoPanels();

      const panelMap = {
        "country-notes": countryNotesPanel,
        venues: venuesPanel
      };
      panelMap[view]?.classList.add("active");

      const titleMap = {
        "country-notes": "各国データ",
        venues: "開催地・時差・移動"
      };
      const title = titleMap[view] || "W杯2026";
      boardTitle.textContent = title;
      sideTitle.textContent = title;
      sideSub.textContent = "共有保存先はFirebase Realtime Databaseです。localStorageは一時キャッシュです。";
      statusMessage.textContent = "";
      window.clearTimeout(statusTimer);
      pitchCount.textContent = "観戦メモ";
      pitchCount.classList.remove("over-limit");
      saveState.textContent = "端末内保存 / JSON共有可";

      window.WorldCupTournament?.init();
      window.WorldCupTournament?.renderAuxView(view);
      ownerTabs.forEach((tab) => {
        tab.classList.toggle("active", tab.dataset.view === view);
      });
    }

    function renderPositions() {
      clearPitchCards();
      clearComparePitches();
      benchList.innerHTML = "";
      confirmedList.innerHTML = "";
      droppedList.innerHTML = "";

      app.classList.add("single-panel");
      board.classList.add("with-panel");
      board.classList.add("explain-only");
      board.classList.remove("compare-only");
      board.classList.remove("bet-only");
      board.classList.remove("roster-only");
      board.classList.remove("tournament-only");
      board.classList.remove("info-only");
      board.classList.remove("lineup-only");
      comparisonPanel.classList.remove("active");
      betPanel.classList.remove("active");
      rosterPanel.classList.remove("active");
      tournamentPanel.classList.remove("active");
      matchLineupPanel.classList.remove("active");
      hideWorldCupInfoPanels();
      positionPanel.classList.add("active");

      boardTitle.textContent = "ポジション解説";
      sideTitle.textContent = "解説";
      sideSub.textContent = "";
      statusMessage.textContent = "";
      window.clearTimeout(statusTimer);
      pitchCount.textContent = "ポジション一覧";
      pitchCount.classList.remove("over-limit");
      saveState.textContent = "解説";
      renderPositionGuideMode(positionGuideMode);

      ownerTabs.forEach((tab) => {
        tab.classList.toggle("active", tab.dataset.view === "positions");
      });
    }

    function renderBet() {
      clearPitchCards();
      clearComparePitches();
      benchList.innerHTML = "";
      confirmedList.innerHTML = "";
      droppedList.innerHTML = "";

      app.classList.add("single-panel");
      board.classList.add("bet-only");
      board.classList.remove("with-panel");
      board.classList.remove("explain-only");
      board.classList.remove("compare-only");
      board.classList.remove("roster-only");
      board.classList.remove("tournament-only");
      board.classList.remove("info-only");
      board.classList.remove("lineup-only");
      comparisonPanel.classList.remove("active");
      positionPanel.classList.remove("active");
      rosterPanel.classList.remove("active");
      tournamentPanel.classList.remove("active");
      matchLineupPanel.classList.remove("active");
      hideWorldCupInfoPanels();
      betPanel.classList.add("active");

      boardTitle.textContent = "賭け結果";
      sideTitle.textContent = "賭け結果";
      sideSub.textContent = "選手ごとの正式結果を保存すると、かりん予想・りょう予想の的中人数と支払額を自動計算します。";
      statusMessage.textContent = "";
      window.clearTimeout(statusTimer);
      pitchCount.textContent = "賭け結果";
      pitchCount.classList.remove("over-limit");
      saveState.textContent = "自動保存対応";

      betAmountInput.value = betState.amount;
      renderOfficialSquadList();
      renderChampionBetSheet();
      renderBetTabs();
      if (betResultsSaveState?.textContent === "未保存") {
        betResultsSaveState.textContent = betResultsLoadedFromStorage ? "保存済み" : "未保存";
      }
      updateBetDebug();
      updateBetResult(false);

      ownerTabs.forEach((tab) => {
        tab.classList.toggle("active", tab.dataset.view === "bet");
      });
    }

    function renderRoster() {
      clearPitchCards();
      clearComparePitches();
      benchList.innerHTML = "";
      confirmedList.innerHTML = "";
      droppedList.innerHTML = "";

      app.classList.add("single-panel");
      board.classList.add("roster-only");
      board.classList.remove("with-panel");
      board.classList.remove("explain-only");
      board.classList.remove("compare-only");
      board.classList.remove("bet-only");
      board.classList.remove("tournament-only");
      board.classList.remove("info-only");
      board.classList.remove("lineup-only");
      comparisonPanel.classList.remove("active");
      positionPanel.classList.remove("active");
      betPanel.classList.remove("active");
      tournamentPanel.classList.remove("active");
      matchLineupPanel.classList.remove("active");
      hideWorldCupInfoPanels();
      rosterPanel.classList.add("active");

      boardTitle.textContent = "選手一覧";
      sideTitle.textContent = "選手一覧";
      sideSub.textContent = "";
      statusMessage.textContent = "";
      window.clearTimeout(statusTimer);
      pitchCount.textContent = "選手一覧";
      pitchCount.classList.remove("over-limit");
      saveState.textContent = "追加・削除を保存";

      renderRosterList();

      ownerTabs.forEach((tab) => {
        tab.classList.toggle("active", tab.dataset.view === "roster");
      });
    }

    // ===== 試合スタメンデータ =====
    const matchLineupData = [
      {
        id: "vs-ned-gs1",
        label: "vs オランダ（グループステージ 第1節）",
        date: "2026年6月15日",
        formation: "3-4-2-1",
        japan: {
          starters: [
            { name: "鈴木彩艶",   position: "GK",  x: 50, y: 90 },
            { name: "谷口彰悟",   position: "CB",  x: 70, y: 73 },
            { name: "渡辺剛",     position: "CB",  x: 50, y: 73 },
            { name: "伊藤洋輝",   position: "CB",  x: 30, y: 73 },
            { name: "堂安律",     position: "RWB", x: 84, y: 50 },
            { name: "佐野海舟",   position: "DMF", x: 60, y: 52 },
            { name: "鎌田大地",   position: "DMF", x: 40, y: 52 },
            { name: "中村敬斗",   position: "LWB", x: 16, y: 50 },
            { name: "久保建英",   position: "SH",  x: 67, y: 30 },
            { name: "上田綺世",   position: "CF",  x: 50, y: 13 },
            { name: "前田大然",   position: "SH",  x: 33, y: 30 },
          ],
          subs: [
            { minute: 66,  in: "伊東純也",  out: "前田大然",  inPos: "RW"  },
            { minute: 75,  in: "冨安健洋",  out: "渡辺剛",   inPos: "CB"  },
            { minute: 75,  in: "菅原由勢",  out: "堂安律",   inPos: "RWB" },
            { minute: 75,  in: "小川航基",  out: "久保建英", inPos: "CF"  },
            { minute: 83,  in: "塩貝健人",  out: "上田綺世", inPos: "CF"  },
          ],
        },
        opponent: {
          name: "オランダ",
          flag: "🇳🇱",
          formation: "4-3-3",
          starters: [
            { name: "フェルブルッヘン",         position: "GK",  x: 50, y: 90 },
            { name: "ダンフリース",             position: "RB",  x: 80, y: 73 },
            { name: "ファン・ヘッケ",           position: "CB",  x: 62, y: 73 },
            { name: "ファン・ダイク",           position: "CB",  x: 38, y: 73 },
            { name: "ファン・デ・フェン",       position: "LB",  x: 20, y: 73 },
            { name: "フラーフェンベルフ",       position: "CM",  x: 65, y: 50 },
            { name: "デ・ヨング",               position: "CM",  x: 50, y: 50 },
            { name: "ラインデルス",             position: "CM",  x: 35, y: 50 },
            { name: "サマーフィル",             position: "RW",  x: 76, y: 23 },
            { name: "ガクポ",                   position: "CF",  x: 50, y: 13 },
            { name: "マレン",                   position: "LW",  x: 24, y: 23 },
          ],
          subs: [
            { minute: 71,  in: "クインテン・ティンバー",    out: "ラインデルス",           inPos: "CM"  },
            { minute: 71,  in: "メンフィス・デパイ",         out: "マレン",                inPos: "LW"  },
            { minute: 71,  in: "コープマイネルス",           out: "サマーフィル",           inPos: "RW"  },
            { minute: 81,  in: "ナタン・アケ",              out: "フラーフェンベルフ",      inPos: "CB"  },
            { minute: 84,  in: "ブライアン・ブロビー",       out: "ガクポ",                inPos: "CF"  },
          ],
        },
      },
    ];

    let activeMatchLineupId = matchLineupData[0]?.id;

    function renderMatchLineup() {
      clearPitchCards();
      clearComparePitches();
      benchList.innerHTML = "";
      confirmedList.innerHTML = "";
      droppedList.innerHTML = "";

      app.classList.add("single-panel");
      board.classList.add("lineup-only");
      board.classList.remove("with-panel");
      board.classList.remove("explain-only");
      board.classList.remove("compare-only");
      board.classList.remove("bet-only");
      board.classList.remove("roster-only");
      board.classList.remove("tournament-only");
      board.classList.remove("info-only");
      comparisonPanel.classList.remove("active");
      positionPanel.classList.remove("active");
      betPanel.classList.remove("active");
      rosterPanel.classList.remove("active");
      tournamentPanel.classList.remove("active");
      hideWorldCupInfoPanels();
      matchLineupPanel.classList.add("active");

      boardTitle.textContent = "日本代表 試合記録";
      sideTitle.textContent = "試合記録";
      sideSub.textContent = "";
      statusMessage.textContent = "";
      window.clearTimeout(statusTimer);
      pitchCount.textContent = "スタメン・交代";
      pitchCount.classList.remove("over-limit");
      saveState.textContent = "閲覧専用";

      matchLineupPanel.innerHTML = "";
      matchLineupPanel.appendChild(buildMatchLineupContent());

      ownerTabs.forEach((tab) => {
        tab.classList.toggle("active", tab.dataset.view === "match-lineup");
      });
    }

    function buildMatchLineupContent() {
      const match = matchLineupData.find((m) => m.id === activeMatchLineupId) || matchLineupData[0];
      if (!match) return document.createTextNode("データがありません");

      const wrapper = document.createElement("div");
      wrapper.className = "lineup-wrapper";

      // ── 試合選択ヘッダー ──
      const header = document.createElement("div");
      header.className = "lineup-header";

      if (matchLineupData.length > 1) {
        const sel = document.createElement("select");
        sel.className = "lineup-match-select";
        matchLineupData.forEach((m) => {
          const opt = document.createElement("option");
          opt.value = m.id;
          opt.textContent = m.label;
          opt.selected = m.id === activeMatchLineupId;
          sel.appendChild(opt);
        });
        sel.addEventListener("change", () => {
          activeMatchLineupId = sel.value;
          matchLineupPanel.innerHTML = "";
          matchLineupPanel.appendChild(buildMatchLineupContent());
        });
        header.appendChild(sel);
      } else {
        const title = document.createElement("h2");
        title.className = "lineup-match-title";
        title.textContent = match.label;
        header.appendChild(title);
      }

      const dateBadge = document.createElement("span");
      dateBadge.className = "lineup-date";
      dateBadge.textContent = match.date;
      header.appendChild(dateBadge);
      wrapper.appendChild(header);

      // ── ピッチ2面（日本 | 相手） ──
      const courts = document.createElement("div");
      courts.className = "lineup-courts";
      courts.appendChild(buildLineupCourt("🇯🇵 日本", match.formation, match.japan.starters, "japan"));
      courts.appendChild(buildLineupCourt(`${match.opponent.flag} ${match.opponent.name}`, match.opponent.formation, match.opponent.starters, "opponent"));
      wrapper.appendChild(courts);

      // ── 交代セクション ──
      const subsSection = document.createElement("div");
      subsSection.className = "lineup-subs-section";

      const subsGrid = document.createElement("div");
      subsGrid.className = "lineup-subs-grid";

      subsGrid.appendChild(buildSubsList("🇯🇵 日本 交代", match.japan.subs));
      subsGrid.appendChild(buildSubsList(`${match.opponent.flag} ${match.opponent.name} 交代`, match.opponent.subs));

      subsSection.appendChild(subsGrid);
      wrapper.appendChild(subsSection);

      return wrapper;
    }

    function buildLineupCourt(teamLabel, formation, players, side) {
      const court = document.createElement("section");
      court.className = "lineup-court";

      const courtHeader = document.createElement("div");
      courtHeader.className = "lineup-court-header";
      const teamTitle = document.createElement("h3");
      teamTitle.className = "lineup-team-title";
      teamTitle.textContent = teamLabel;
      const formationBadge = document.createElement("span");
      formationBadge.className = "lineup-formation-badge";
      formationBadge.textContent = formation;
      courtHeader.append(teamTitle, formationBadge);
      court.appendChild(courtHeader);

      // ピッチ（compare-pitch 流用）
      const pitch = document.createElement("div");
      pitch.className = "compare-pitch lineup-pitch";
      ["goal", "penalty", "goal-area", "arc"].forEach((areaClass) => {
        const area = document.createElement("div");
        area.className = `area ${areaClass}`;
        pitch.appendChild(area);
      });
      [["guide-gk", "GK"], ["guide-df", "DF"], ["guide-dmf", "DMF"], ["guide-omf", "OMF"], ["guide-cf", "CF"]].forEach(([cls, text]) => {
        const lbl = document.createElement("div");
        lbl.className = `guide-label ${cls}`;
        lbl.textContent = text;
        pitch.appendChild(lbl);
      });

      players.forEach((player) => {
        const card = buildLineupCard(player);
        card.style.left = `${player.x}%`;
        card.style.top  = `${player.y}%`;
        pitch.appendChild(card);
      });

      court.appendChild(pitch);
      return court;
    }

    function buildLineupCard(player) {
      const card = document.createElement("div");
      card.className = "compare-card lineup-card";

      // allPlayers から名前で選手を検索して写真を取得
      const fullPlayer = allPlayers.find((p) => p.name === player.name);

      const photo = document.createElement("div");
      photo.className = "photo";

      if (fullPlayer?.imageUrl) {
        const img = document.createElement("img");
        img.src = fullPlayer.imageUrl;
        img.alt = fullPlayer.name;
        if (fullPlayer.imageClass) img.className = fullPlayer.imageClass;
        img.onerror = () => {
          const nextIndex = Number(img.dataset.fallbackIndex || 0);
          if (applyImageFallback(img, fullPlayer, nextIndex)) return;
          photo.textContent = initialOf(player.name);
          img.remove();
        };
        photo.appendChild(img);
      } else {
        // 海外選手など allPlayers にいない場合はイニシャル表示
        photo.textContent = initialOf(player.name);
      }

      // テキスト情報
      const info = document.createElement("div");
      info.className = "info";
      const name = document.createElement("div");
      name.className = "name";
      name.textContent = player.name;
      const meta = document.createElement("div");
      meta.className = "meta";
      const pos = document.createElement("span");
      pos.className = `position ${positionClass(player.position)}`;
      pos.textContent = player.position;
      meta.appendChild(pos);
      info.append(name, meta);
      card.append(photo, info);
      return card;
    }

    function buildSubsList(heading, subs) {
      const section = document.createElement("section");
      section.className = "lineup-subs-col";
      const h = document.createElement("h4");
      h.className = "lineup-subs-title";
      h.textContent = heading;
      section.appendChild(h);
      if (!subs.length) {
        const empty = document.createElement("p");
        empty.className = "lineup-subs-empty";
        empty.textContent = "交代なし";
        section.appendChild(empty);
        return section;
      }
      const ul = document.createElement("ul");
      ul.className = "lineup-subs-list";
      subs.forEach((sub) => {
        const li = document.createElement("li");
        li.className = "lineup-sub-item";
        li.innerHTML = `
          <span class="sub-minute">${sub.minute}'</span>
          <span class="sub-in">▲ ${sub.in}</span>
          <span class="sub-out">▼ ${sub.out}</span>
        `;
        ul.appendChild(li);
      });
      section.appendChild(ul);
      return section;
    }

    function resetOwnerViewShell() {
      app.classList.remove("single-panel");
      board.classList.remove("with-panel");
      board.classList.remove("explain-only");
      board.classList.remove("compare-only");
      board.classList.remove("bet-only");
      board.classList.remove("roster-only");
      board.classList.remove("tournament-only");
      board.classList.remove("info-only");
      board.classList.remove("lineup-only");
      comparisonPanel.classList.remove("active");
      positionPanel.classList.remove("active");
      betPanel.classList.remove("active");
      rosterPanel.classList.remove("active");
      tournamentPanel.classList.remove("active");
      matchLineupPanel.classList.remove("active");
      hideWorldCupInfoPanels();
      clearComparePitches();
    }

    function selectPositionDetail(code) {
      const detail = positionDetails[code];
      if (!detail) return;
      positionDetailTitle.textContent = detail.title || code;
      positionDetailName.textContent = detail.name;
      positionDetailRole.textContent = detail.role;
      positionDetailPoint.textContent = detail.point;
      document.querySelectorAll(".position-label").forEach((label) => {
        label.classList.toggle("active", label.dataset.positionCode === code);
      });
      renderPositionDetailExamples(code);
    }

    function renderPositionGuideMode(mode) {
      const config = positionGuideModes[mode] || positionGuideModes.list;
      positionGuideMode = mode;
      positionModeButtons.forEach((button) => {
        button.classList.toggle("active", button.dataset.positionMode === mode);
      });
      positionMap.querySelectorAll(".position-label").forEach((label) => label.remove());
      config.labels.forEach((item) => {
        const button = document.createElement("button");
        button.className = `position-label ${item.className}`;
        button.type = "button";
        button.dataset.positionCode = item.code;
        button.style.left = `${item.x}%`;
        button.style.top = `${item.y}%`;
        button.textContent = item.label;
        button.addEventListener("click", () => selectPositionDetail(item.code));
        positionMap.appendChild(button);
      });
      selectPositionDetail(config.initial);
    }

    function renderPositionDetailExamples(code) {
      positionDetailExamples.innerHTML = "";
      const group = positionExampleGroups.find((item) => item.code === code);
      if (!group) return;

      const groups = document.createElement("div");
      groups.className = "detail-example-groups";
      groups.append(
        createExampleGroup("日本代表", group.japan),
        createExampleGroup("世界的に有名な選手", group.world)
      );
      positionDetailExamples.appendChild(groups);
    }

    function createExampleGroup(title, examples) {
      const wrapper = document.createElement("div");
      wrapper.className = "detail-example-block";
      const heading = document.createElement("div");
      heading.className = "example-group-title";
      heading.textContent = title;

      const cards = document.createElement("div");
      cards.className = "example-cards";
      examples.forEach((player) => {
        cards.appendChild(createExampleCard(player));
      });

      wrapper.append(heading, cards);
      return wrapper;
    }

    function createExampleCard(player) {
      const card = document.createElement("article");
      card.className = "example-card";

      const avatar = document.createElement("div");
      avatar.className = "example-avatar";
      if (player.imageUrl) {
        const img = document.createElement("img");
        img.src = player.imageUrl;
        img.alt = player.name;
        img.onerror = () => {
          const fallback = (player.imageFallbacks || []).shift();
          if (fallback) {
            img.src = fallback;
            return;
          }
          img.remove();
          avatar.textContent = initialOf(player.name);
        };
        avatar.appendChild(img);
      } else {
        avatar.textContent = initialOf(player.name);
      }

      const info = document.createElement("div");
      const name = document.createElement("div");
      name.className = "example-name";
      name.textContent = player.name;
      const club = document.createElement("div");
      club.className = "example-club";
      club.textContent = player.club;

      info.append(name, club);
      card.append(avatar, info);
      return card;
    }

    function startDrag(event) {
      if (event.button !== 0) return;
      if (isInteractionLocked()) {
        showStatus(ownerLocks[activeOwner] ? "配置ロック中です" : "");
        return;
      }

      const source = event.currentTarget;
      const playerId = source.dataset.playerId;
      const player = currentPlayers().find((item) => item.id === playerId);
      if (!player) return;

      event.preventDefault();
      source.classList.add("dragging-source");

      const ghost = createPlayerCard(player, false);
      ghost.classList.add("drag-ghost");
      document.body.appendChild(ghost);

      drag = {
        playerId,
        source,
        ghost
      };

      moveGhost(event.clientX, event.clientY);
      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", endDrag, { once: true });
      window.addEventListener("pointercancel", cancelDrag, { once: true });
    }

    function moveGhost(clientX, clientY) {
      if (!drag) return;
      drag.ghost.style.left = `${clientX}px`;
      drag.ghost.style.top = `${clientY}px`;
    }

    function onPointerMove(event) {
      if (!drag) return;
      moveGhost(event.clientX, event.clientY);
      markDropTarget(event.clientX, event.clientY);
    }

    function endDrag(event) {
      if (!drag) return;

      const pitchRect = pitch.getBoundingClientRect();
      const benchRect = benchArea.getBoundingClientRect();
      const confirmedRect = confirmedArea.getBoundingClientRect();
      const droppedRect = droppedArea.getBoundingClientRect();

      if (inside(event.clientX, event.clientY, pitchRect)) {
        const x = ((event.clientX - pitchRect.left) / pitchRect.width) * 100;
        const y = ((event.clientY - pitchRect.top) / pitchRect.height) * 100;
        updatePlacement(drag.playerId, {
          area: "pitch",
          x: clamp(x, 6, 94),
          y: clamp(y, 7, 93),
          manual: true
        });
      } else if (inside(event.clientX, event.clientY, confirmedRect)) {
        updatePlacement(drag.playerId, { area: "confirmed", x: 50, y: 50, manual: false });
      } else if (inside(event.clientX, event.clientY, droppedRect)) {
        updatePlacement(drag.playerId, { area: "dropped", x: 50, y: 50, manual: false });
      } else if (inside(event.clientX, event.clientY, benchRect)) {
        updatePlacement(drag.playerId, { area: "bench", x: 50, y: 50, manual: false });
      }

      finishDrag();
      saveOwnerState(activeOwner);
      render();
    }

    function cancelDrag() {
      finishDrag();
    }

    function finishDrag() {
      window.removeEventListener("pointermove", onPointerMove);
      clearDropTargets();

      if (drag) {
        drag.source.classList.remove("dragging-source");
        drag.ghost.remove();
      }

      drag = null;
    }

    function markDropTarget(clientX, clientY) {
      const dropTargets = [
        [pitch, pitch.getBoundingClientRect()],
        [benchArea, benchArea.getBoundingClientRect()],
        [confirmedArea, confirmedArea.getBoundingClientRect()],
        [droppedArea, droppedArea.getBoundingClientRect()]
      ];

      dropTargets.forEach(([element, rect]) => {
        element.classList.toggle("drop-active", inside(clientX, clientY, rect));
      });
    }

    function clearDropTargets() {
      [pitch, benchArea, confirmedArea, droppedArea].forEach((element) => {
        element.classList.remove("drop-active");
      });
    }

    function countArea(area) {
      let total = 0;
      states[activeOwner].forEach((placement) => {
        if (placement.area === area) total += 1;
      });
      return total;
    }

    function cycleRating(playerId) {
      const current = states[activeOwner].get(playerId);
      if (!current) return;
      states[activeOwner].set(playerId, {
        ...current,
        rating: nextRating(current.rating)
      });
      saveOwnerState(activeOwner);
      render();
    }

    function applyFormation(name) {
      const slots = formations[name];
      const players = currentPlayers();
      if (!slots || players.length === 0) {
        showStatus(`${owners[activeOwner]}の選手リストが空です`);
        return;
      }

      const state = states[activeOwner];
      const availablePlayers = players.filter((player) => {
        const area = state.get(player.id)?.area;
        return area === "pitch" || area === "bench" || area === "confirmed";
      });

      if (availablePlayers.length === 0) {
        showStatus("配置できる選手がベンチにいません");
        return;
      }

      const currentPitchIds = availablePlayers
        .filter((player) => state.get(player.id)?.area === "pitch")
        .map((player) => player.id);
      const manualPitchPlayers = availablePlayers
        .filter((player) => {
          const placement = state.get(player.id);
          return placement?.area === "pitch" && placement.manual;
        })
        .sort(sortByRatingThenPosition);
      const autoCandidates = availablePlayers
        .filter((player) => isAutoSelectable(player))
        .sort(sortByRatingThenPosition);
      const selected = [];
      const used = new Set();

      slots.forEach((formationSlot) => {
        const manualMatch = manualPitchPlayers.find((player) => {
          return !used.has(player.id) && playerMatchesGroup(player, formationSlot.group);
        });
        const autoMatch = autoCandidates.find((player) => {
          return !used.has(player.id) && playerMatchesGroup(player, formationSlot.group);
        });
        const manualFallback = manualPitchPlayers.find((player) => !used.has(player.id));
        const currentPitchMatch = currentPitchIds
          .map((id) => availablePlayers.find((player) => player.id === id))
          .filter((player) => player && isAutoSelectable(player))
          .sort(sortByRatingThenPosition)
          .find((player) => !used.has(player.id) && playerMatchesGroup(player, formationSlot.group));
        const autoFallback = autoCandidates.find((player) => !used.has(player.id));
        const player = manualMatch || autoMatch || manualFallback || currentPitchMatch || autoFallback;
        if (!player) return;
        const wasManual = state.get(player.id)?.manual || false;
        used.add(player.id);
        selected.push({ player, formationSlot, wasManual });
      });

      availablePlayers.forEach((player) => {
        updatePlacement(player.id, { area: "bench", x: 50, y: 50, manual: false });
      });

      selected.forEach(({ player, formationSlot, wasManual }) => {
        updatePlacement(player.id, {
          area: "pitch",
          x: formationSlot.x,
          y: formationSlot.y,
          manual: wasManual
        });
      });

      currentFormations[activeOwner] = name;
      saveOwnerState(activeOwner);
      showStatus(`${name}で初期配置しました`);
      render();
    }

    function showStatus(message) {
      statusMessage.textContent = message;
      window.clearTimeout(statusTimer);
      statusTimer = window.setTimeout(() => {
        statusMessage.textContent = "";
      }, 2200);
    }

    function formatWager(total) {
      return `${total}人（500円x${total}人＝${total * 500}円）`;
    }

    function formatYen(value) {
      return `${Number(value).toLocaleString("ja-JP")}円`;
    }

    function parseWholeNumber(value) {
      const normalized = normalizeNumber(value);
      if (normalized === "" || !/^\d+$/.test(normalized)) return null;
      return Number(normalized);
    }

    function ownerHasPlayer(owner, playerId) {
      return ownerPlayers[owner].some((player) => player.id === playerId);
    }

    function rosterRating(player, owner) {
      return states[owner]?.get(player.id)?.rating || initialRating(player.status);
    }

    function rosterNumber(player) {
      return currentNumber(player.id, "karin") || currentNumber(player.id, "ryo") || player.number || "";
    }

    function clubCountry(player) {
      return player.country || clubCountries[player.club] || "";
    }

    function flagUrl(player) {
      if (player.flagFile) return `flags/${player.flagFile}`;
      const country = clubCountry(player);
      if (!country) return "";
      return `flags/${countryFlagFiles[country] || `${country}.png`}`;
    }

    function updateRosterCounts() {
      const karinTotal = ownerPlayers.karin.length;
      const ryoTotal = ownerPlayers.ryo.length;
      rosterTotalCount.textContent = `候補者総数：${allPlayers.length}人${allPlayers.length > candidateLimit ? "（候補者数が55人を超えています）" : ""}`;
      const karinWarning = karinTotal > rosterLimit ? "（26人超過）" : karinTotal < rosterLimit ? "（26人未満）" : "";
      const ryoWarning = ryoTotal > rosterLimit ? "（26人超過）" : ryoTotal < rosterLimit ? "（26人未満）" : "";
      karinRosterCount.textContent = `かりん：${karinTotal}人${karinWarning}`;
      ryoRosterCount.textContent = `りょう：${ryoTotal}人${ryoWarning}`;
      rosterTotalCount.classList.toggle("warning", allPlayers.length > candidateLimit);
      karinRosterCount.classList.toggle("warning", karinTotal !== rosterLimit);
      ryoRosterCount.classList.toggle("warning", ryoTotal !== rosterLimit);
    }

    function renderRosterList() {
      const query = rosterSearchInput.value.trim().toLowerCase();
      const filter = rosterPositionFilter.value;
      rosterList.innerHTML = "";
      updateRosterCounts();

      const groupedPlayers = allPlayers
        .filter((player) => {
          const matchesText = !query ||
            player.name.toLowerCase().includes(query) ||
            player.club.toLowerCase().includes(query) ||
            clubCountry(player).toLowerCase().includes(query);
          const matchesPosition = filter === "all" || (player.group || benchGroupKey(player.position)) === filter;
          return matchesText && matchesPosition;
        })
        .reduce((groups, player) => {
          const group = player.group || benchGroupKey(player.position);
          if (!groups.has(group)) groups.set(group, []);
          groups.get(group).push(player);
          return groups;
        }, new Map());

      positionSortOrder.forEach((group) => {
        const players = groupedPlayers.get(group) || [];
        if (players.length === 0) return;
        rosterList.appendChild(createRosterGroup(group, players));
      });
    }

    function createRosterGroup(group, players) {
      const section = document.createElement("section");
      section.className = "roster-group";

      const title = document.createElement("div");
      title.className = "roster-group-title";
      title.innerHTML = `<span>${group}</span><span>${players.length}人</span>`;

      const list = document.createElement("div");
      list.className = "roster-group-list";
      players.forEach((player) => {
        list.appendChild(createRosterCard(player));
      });

      section.append(title, list);
      return section;
    }

    function createRosterCard(player) {
      const card = document.createElement("article");
      card.className = "roster-card";

      const photo = document.createElement("div");
      photo.className = "photo";
      if (player.imageUrl) {
        const img = document.createElement("img");
        img.src = player.imageUrl;
        img.alt = player.name;
        if (player.imageClass) img.className = player.imageClass;
        img.onerror = () => {
          const nextIndex = Number(img.dataset.fallbackIndex || 0);
          if (applyImageFallback(img, player, nextIndex)) return;
          photo.textContent = initialOf(player.name);
          img.remove();
        };
        photo.appendChild(img);
      } else {
        photo.textContent = initialOf(player.name);
      }

      const info = document.createElement("div");
      info.className = "info";
      const name = document.createElement("div");
      name.className = "name";
      name.textContent = player.name;
      const meta = document.createElement("div");
      meta.className = "meta";

      const number = rosterNumber(player);
      if (number) {
        const numberBadge = document.createElement("span");
        numberBadge.className = "number-badge";
        numberBadge.textContent = `#${number}`;
        meta.appendChild(numberBadge);
      }
      const position = document.createElement("span");
      position.className = `position ${positionClass(player.position)}`;
      position.textContent = player.position;
      const club = document.createElement("span");
      club.className = "club";
      club.textContent = player.club;
      meta.append(position, club);

      const country = clubCountry(player);
      const countryRow = document.createElement("div");
      countryRow.className = "roster-country";
      const flag = flagUrl(player);
      if (flag) {
        const flagImg = document.createElement("img");
        flagImg.className = "flag-img";
        flagImg.src = flag;
        flagImg.alt = country;
        flagImg.onerror = () => flagImg.remove();
        countryRow.appendChild(flagImg);
      }
      countryRow.appendChild(document.createTextNode(country || "所属国未設定"));
      info.append(name, meta, countryRow);

      const actions = document.createElement("div");
      actions.className = "roster-card-actions";
      actions.append(
        createRosterActionButton(ownerHasPlayer("karin", player.id) ? "かりんから削除" : "かりんに追加", () => toggleRosterPlayer("karin", player.id)),
        createRosterActionButton(ownerHasPlayer("ryo", player.id) ? "りょうから削除" : "りょうに追加", () => toggleRosterPlayer("ryo", player.id))
      );

      card.append(photo, info, actions);
      return card;
    }

    function createRosterActionButton(label, action) {
      const button = document.createElement("button");
      const isRemove = label.includes("削除");
      button.className = `utility-button ${isRemove ? "roster-action-remove" : "roster-action-add"}`;
      button.type = "button";
      button.textContent = label;
      button.addEventListener("click", action);
      return button;
    }

    function toggleRosterPlayer(owner, playerId) {
      if (ownerHasPlayer(owner, playerId)) {
        removePlayerFromOwner(owner, playerId);
      } else {
        addPlayerToOwner(owner, playerId);
      }
      saveOwnerState(owner);
      renderRosterList();
      if (activeView === "bet") {
        updateBetResult(false);
      }
    }

    function addPlayerToOwner(owner, playerId) {
      const player = allPlayerById(playerId);
      if (!player || ownerHasPlayer(owner, playerId)) return;
      if (!isOfficialSquadPlayer(playerId)) {
        showStatus("正式招集26名以外は予想シートには追加されません");
        return;
      }
      ownerPlayers[owner] = sortPlayersByMasterOrder([...ownerPlayers[owner], player]);
      if (!states[owner].has(playerId)) {
        states[owner].set(playerId, { area: "bench", x: 50, y: 50, rating: initialRating(player.status), number: player.number || "", manual: false });
      } else {
        states[owner].set(playerId, { ...states[owner].get(playerId), area: "bench", x: 50, y: 50, manual: false });
      }
    }

    function removePlayerFromOwner(owner, playerId) {
      ownerPlayers[owner] = ownerPlayers[owner].filter((player) => player.id !== playerId);
      states[owner].delete(playerId);
    }

    function parseDelimitedText(text) {
      const delimiter = text.includes("\t") ? "\t" : ",";
      const rows = [];
      let row = [];
      let cell = "";
      let inQuotes = false;

      for (let i = 0; i < text.length; i += 1) {
        const char = text[i];
        const next = text[i + 1];
        if (char === '"' && inQuotes && next === '"') {
          cell += '"';
          i += 1;
        } else if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === delimiter && !inQuotes) {
          row.push(cell);
          cell = "";
        } else if ((char === "\n" || char === "\r") && !inQuotes) {
          if (char === "\r" && next === "\n") i += 1;
          row.push(cell);
          if (row.some((value) => value.trim() !== "")) rows.push(row);
          row = [];
          cell = "";
        } else {
          cell += char;
        }
      }
      row.push(cell);
      if (row.some((value) => value.trim() !== "")) rows.push(row);
      return rows;
    }

    function rowValue(row, headers, names) {
      for (const name of names) {
        const index = headers.indexOf(name);
        if (index !== -1) return (row[index] || "").trim();
      }
      return "";
    }

    function truthyExcelValue(value) {
      return /^(1|true|yes|y|○|〇|◯|選出|追加|する|はい)$/i.test(String(value || "").trim());
    }

    function generatePlayerId(name, usedIds) {
      const base = "player";
      let index = 1;
      let candidate = `${base}-${index}`;
      while (usedIds.has(candidate)) {
        index += 1;
        candidate = `${base}-${index}`;
      }
      usedIds.add(candidate);
      return candidate;
    }

    function normalizeImportedPlayer(row, headers, usedIds, lineNumber) {
      const name = rowValue(row, headers, ["名前", "name"]);
      if (!name) {
        return { error: `行${lineNumber}: 名前が空欄です` };
      }
      let id = rowValue(row, headers, ["id", "ID"]);
      if (!id) {
        id = generatePlayerId(name, usedIds);
      } else if (usedIds.has(id)) {
        const existing = allPlayerById(id);
        if (!existing) {
          id = generatePlayerId(id, usedIds);
        }
      } else {
        usedIds.add(id);
      }

      const existing = allPlayerById(id);
      const position = rowValue(row, headers, ["ポジション", "position"]) || existing?.position || "";
      if (!position) {
        return { error: `行${lineNumber}: ポジションが空欄です` };
      }
      const club = rowValue(row, headers, ["所属クラブ", "クラブ", "club"]) || clubOverrides[name] || existing?.club || "";
      const country = rowValue(row, headers, ["国名", "country"]) || existing?.country || clubCountries[club] || "";
      const group = rowValue(row, headers, ["group", "グループ"]) || existing?.group || benchGroupKey(position);
      const number = normalizeNumber(rowValue(row, headers, ["背番号", "number"]));
      const imageFile = rowValue(row, headers, ["画像ファイル名", "画像", "imageFile"]);
      const flagFile = rowValue(row, headers, ["国旗ファイル名", "flagFile"]);
      const memo = rowValue(row, headers, ["メモ", "memo"]);

      const player = {
        ...(existing || {}),
        id,
        name,
        position,
        group,
        club,
        country,
        status: rowValue(row, headers, ["初期評価", "status"]) || existing?.status || "可能性",
        number: number || existing?.number || "",
        flagFile: flagFile || existing?.flagFile || "",
        memo: memo || existing?.memo || "",
        karinInitial: truthyExcelValue(rowValue(row, headers, ["かりん初期選出"])),
        ryoInitial: truthyExcelValue(rowValue(row, headers, ["りょう初期選出"]))
      };
      updatePlayerImageSources(player, imageFile);
      return { player, isNew: !existing, excelNumber: number };
    }

    function applyImportedPlayers(text) {
      const rows = parseDelimitedText(text);
      if (rows.length < 2) {
        return { total: 0, added: 0, updated: 0, errors: ["ヘッダー行とデータ行が必要です"] };
      }
      const headers = rows[0].map((header) => header.replace(/^\uFEFF/, "").trim());
      const usedIds = new Set(allPlayers.map((player) => player.id));
      const errors = [];
      let added = 0;
      let updated = 0;

      rows.slice(1).forEach((row, index) => {
        const result = normalizeImportedPlayer(row, headers, usedIds, index + 2);
        if (result.error) {
          errors.push(result.error);
          return;
        }
        const { player, isNew, excelNumber } = result;
        const existingIndex = allPlayers.findIndex((item) => item.id === player.id);
        if (existingIndex === -1) {
          allPlayers.push(player);
          syncPlayersArrayOrder();
          added += 1;
          if (player.karinInitial) addPlayerToOwner("karin", player.id);
          if (player.ryoInitial) addPlayerToOwner("ryo", player.id);
        } else {
          allPlayers[existingIndex] = player;
          ["karin", "ryo"].forEach((owner) => {
            ownerPlayers[owner] = sortPlayersByMasterOrder(ownerPlayers[owner].map((item) => item.id === player.id ? player : item));
            const placement = states[owner].get(player.id);
            if (placement && excelNumber) {
              states[owner].set(player.id, { ...placement, number: excelNumber });
            }
          });
          updated += 1;
        }
      });

      savePlayerMaster();
      syncPlayersArrayOrder();
      saveOwnerState("karin");
      saveOwnerState("ryo");
      return { total: rows.length - 1, added, updated, errors };
    }

    function importPlayersFromText() {
      const text = playerImportText.value.trim();
      if (!text) {
        playerImportResult.textContent = "TSVを貼り付けてください。";
        return;
      }
      const result = applyImportedPlayers(text);
      const summary = [
        `取り込み完了：${result.total}名`,
        `新規追加：${result.added}名`,
        `更新：${result.updated}名`,
        `エラー：${result.errors.length}件`
      ];
      if (result.errors.length) {
        summary.push("", ...result.errors.slice(0, 10));
      }
      playerImportResult.textContent = summary.join("\n");
      saveState.textContent = "選手一覧を保存済み";
      render();
    }

    function selectedOwnerIdsFromSaved(owner) {
      const key = storageKeys[owner];
      if (!key) return null;
      try {
        const raw = localStorage.getItem(key);
        if (!raw) return null;
        const saved = JSON.parse(raw);
        if (!Array.isArray(saved?.rosterIds)) return null;
        const savedPlayers = saved?.players && typeof saved.players === "object" ? saved.players : {};
        const rosterPlayers = sortPlayersByMasterOrder(saved.rosterIds.map(allPlayerById).filter(Boolean));
        const selected = [];
        const used = new Set();

        rosterPlayers
          .filter((player) => savedPlayers[player.id]?.area === "pitch")
          .sort(sortForComparison)
          .forEach((player) => {
            selected.push(player);
            used.add(player.id);
          });

        rosterPlayers
          .filter((player) => !used.has(player.id) && savedPlayers[player.id]?.area !== "dropped")
          .sort((a, b) => {
            const aRating = savedPlayers[a.id]?.rating || "A";
            const bRating = savedPlayers[b.id]?.rating || "A";
            const ratingDiff = ratingOrder.indexOf(aRating) - ratingOrder.indexOf(bRating);
            if (ratingDiff !== 0) return ratingDiff;
            return playerOriginalIndex(a) - playerOriginalIndex(b);
          })
          .slice(0, Math.max(0, rosterLimit - selected.length))
          .forEach((player) => selected.push(player));

        return new Set(selected.slice(0, rosterLimit).map((player) => player.id));
      } catch (error) {
        console.warn(`${key} の賭け結果参照に失敗しました`, error);
        return null;
      }
    }

    function selectedOwnerIds(owner) {
      const savedIds = selectedOwnerIdsFromSaved(owner);
      if (savedIds) return savedIds;
      return new Set(selectedPlayersForOwner(owner).map((player) => player.id));
    }

    function playerNamesFromIds(ids) {
      return ids
        .map((id) => allPlayers.find((player) => player.id === id)?.name)
        .filter(Boolean);
    }

    function renderNameList(names) {
      return names.length ? names.join("、") : "なし";
    }

    function renderBetPlayerList(target, ids, owner) {
      target.innerHTML = "";
      const players = ids.map(allPlayerById).filter(Boolean).sort(sortForComparison);
      if (players.length === 0) {
        target.textContent = "なし";
        return;
      }
      players.forEach((player) => {
        target.appendChild(createMiniPlayer(player, owner));
      });
    }

    function championTeams() {
      return window.WorldCupTournament?.championBetTeams?.() || [];
    }

    function championTeamName(teamId) {
      if (!teamId) return "未選択";
      const team = championTeams().find((item) => item.id === teamId);
      return team ? team.name : teamId;
    }

    function fillChampionSelect(select, value, placeholder) {
      if (!select) return;
      const teams = championTeams();
      select.innerHTML = "";
      const blank = document.createElement("option");
      blank.value = "";
      blank.textContent = placeholder;
      select.appendChild(blank);
      teams.forEach((team) => {
        const option = document.createElement("option");
        option.value = team.id;
        option.textContent = `${team.name}${team.group ? ` / Group ${team.group}` : ""}${team.rank ? ` / FIFA ${team.rank}位` : ""}`;
        select.appendChild(option);
      });
      select.value = teams.some((team) => team.id === value) ? value : "";
    }

    function createChampionRoundField(roundKey, owner, value, disabled = false) {
      const label = document.createElement("label");
      label.className = "champion-bet-field";
      label.textContent = "次の予想国";
      const select = document.createElement("select");
      select.dataset.roundKey = roundKey;
      select.dataset.owner = owner;
      select.disabled = disabled;
      fillChampionSelect(select, value, `${owners[owner]}の予想国`);
      select.addEventListener("change", () => {
        const previousValue = championBetState.rounds[roundKey][owner];
        championBetState.rounds[roundKey][owner] = select.value;
        if (previousValue !== select.value) {
          resetChampionEliminationsFrom(roundKey, owner);
        }
        if (roundKey === "pre") {
          championBetState[owner] = select.value;
          if (owner === "karin") championBetKarinSelect.value = select.value;
          if (owner === "ryo") championBetRyoSelect.value = select.value;
        }
        updateChampionBetResult(true);
      });
      label.appendChild(select);
      return label;
    }

    function resetChampionEliminationsFrom(roundKey, owner) {
      const startIndex = championRoundStages.findIndex(([key]) => key === roundKey);
      if (startIndex < 0) return;
      championRoundStages.slice(startIndex).forEach(([key]) => {
        championBetState.eliminated[key][owner] = false;
      });
    }

    function previousChampionStageKey(roundKey) {
      const index = championRoundStages.findIndex(([key]) => key === roundKey);
      return index > 0 ? championRoundStages[index - 1][0] : "";
    }

    function isChampionRoundUnlocked(roundKey, owner) {
      if (roundKey === "pre") return true;
      const previousKey = previousChampionStageKey(roundKey);
      const previousPick = championBetState.rounds?.[previousKey]?.[owner] || "";
      return Boolean(previousPick && championBetState.eliminated?.[previousKey]?.[owner]);
    }

    function createChampionEliminatedToggle(roundKey, owner, teamId) {
      const label = document.createElement("label");
      label.className = "champion-eliminated-toggle";
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.disabled = !teamId;
      checkbox.checked = Boolean(teamId && championBetState.eliminated?.[roundKey]?.[owner]);
      const text = document.createElement("span");
      text.textContent = teamId ? `${championTeamName(teamId)}の敗退確定` : "前の予想国を選択してください";
      checkbox.addEventListener("change", () => {
        championBetState.eliminated[roundKey][owner] = checkbox.checked;
        updateChampionBetResult(true);
      });
      label.append(checkbox, text);
      return label;
    }

    function renderChampionRounds() {
      championRoundList.innerHTML = "";
      championBetState.rounds = normalizeChampionRounds(championBetState.rounds);
      championBetState.eliminated = normalizeChampionEliminations(championBetState.eliminated);
      Object.keys(owners).forEach((owner) => {
        const ownerCard = document.createElement("section");
        ownerCard.className = "champion-owner-path";
        const ownerHead = document.createElement("div");
        ownerHead.className = "champion-round-head";
        const title = document.createElement("span");
        title.className = "champion-owner-title";
        title.textContent = owners[owner];
        const current = document.createElement("span");
        current.className = "champion-owner-current";
        current.textContent = `有効予想：${championTeamName(currentChampionPick(owner))}`;
        ownerHead.append(title, current);
        ownerCard.appendChild(ownerHead);

        championRoundStages.slice(1).forEach(([key]) => {
          const previousKey = previousChampionStageKey(key);
          const previousPick = championBetState.rounds[previousKey][owner];
          const unlocked = isChampionRoundUnlocked(key, owner);
          const row = document.createElement("section");
          row.className = "champion-round-card";
          row.classList.toggle("locked", !unlocked);

          const head = document.createElement("div");
          head.className = "champion-round-head";
          const roundTitle = document.createElement("span");
          roundTitle.textContent = previousPick ? `${championTeamName(previousPick)}敗退後` : "前の予想国の敗退後";
          const badge = document.createElement("span");
          badge.className = "result-save-state";
          badge.textContent = unlocked ? "選択可能" : "敗退確定待ち";
          head.append(roundTitle, badge);

          const noteEl = document.createElement("div");
          noteEl.className = "champion-round-note";
          noteEl.textContent = previousPick
            ? `${championTeamName(previousPick)}の敗退が確定したら、その時点で1口分を精算し、次の予想国を選びます。`
            : "まず直前の予想国を選んでください。";

          row.append(
            head,
            noteEl,
            createChampionEliminatedToggle(previousKey, owner, previousPick),
            createChampionRoundField(key, owner, championBetState.rounds[key][owner], !unlocked)
          );
          ownerCard.appendChild(row);
        });
        championRoundList.appendChild(ownerCard);
      });
    }

    function renderChampionBetSheet() {
      window.WorldCupTournament?.init?.();
      championBetState.rounds = normalizeChampionRounds(championBetState.rounds);
      championBetState.eliminated = normalizeChampionEliminations(championBetState.eliminated);
      championBetState.karin = championBetState.rounds.pre.karin || championBetState.karin;
      championBetState.ryo = championBetState.rounds.pre.ryo || championBetState.ryo;
      fillChampionSelect(championBetKarinSelect, championBetState.karin, "かりんの初回優勝予想");
      fillChampionSelect(championBetRyoSelect, championBetState.ryo, "りょうの初回優勝予想");
      fillChampionSelect(championBetOfficialSelect, championBetState.official, "正式優勝国");
      championBetAmountInput.value = championBetState.amount;
      renderChampionRounds();
      if (championTeams().length === 0) {
        window.setTimeout(() => {
          if (activeView === "bet") renderChampionBetSheet();
        }, 600);
      }
      updateChampionBetResult(false);
    }

    function renderBetTabs() {
      betTabs.forEach((tab) => {
        tab.classList.toggle("active", tab.dataset.betView === activeBetView);
      });
      betSheets.forEach((sheet) => {
        sheet.classList.toggle("active", sheet.id === `${activeBetView}BetSheet`);
      });
      if (activeBetView === "champion") {
        sideSub.textContent = "優勝国ベットの予想と正式優勝国を保存できます。";
      } else {
        sideSub.textContent = "選手ごとの正式結果を保存すると、かりん予想・りょう予想の的中人数と支払額を自動計算します。";
      }
    }

    function updateChampionBetResult(shouldSave = true) {
      const previousKarinInitial = championBetState.rounds?.pre?.karin || "";
      const previousRyoInitial = championBetState.rounds?.pre?.ryo || "";
      championBetState.amount = championBetAmountInput.value;
      championBetState.karin = championBetKarinSelect.value;
      championBetState.ryo = championBetRyoSelect.value;
      championBetState.official = championBetOfficialSelect.value;
      championBetState.rounds = normalizeChampionRounds(championBetState.rounds);
      championBetState.eliminated = normalizeChampionEliminations(championBetState.eliminated);
      championBetState.rounds.pre.karin = championBetState.karin;
      championBetState.rounds.pre.ryo = championBetState.ryo;
      if (previousKarinInitial !== championBetState.karin) resetChampionEliminationsFrom("pre", "karin");
      if (previousRyoInitial !== championBetState.ryo) resetChampionEliminationsFrom("pre", "ryo");

      const amount = parseWholeNumber(championBetState.amount);
      const invalidAmount = amount === null || amount <= 0;
      const karinActivePick = currentChampionPick("karin");
      const ryoActivePick = currentChampionPick("ryo");
      const karinHit = championBetState.official && karinActivePick === championBetState.official;
      const ryoHit = championBetState.official && ryoActivePick === championBetState.official;
      const eliminationSettlement = invalidAmount ? { balance: 0, summary: "-" } : championEliminationSettlement(amount);
      let finalBalance = 0;
      let finalSummary = "未確定";

      championBetKarinResult.textContent = championTeamName(karinActivePick);
      championBetRyoResult.textContent = championTeamName(ryoActivePick);
      championBetOfficialResult.textContent = championBetState.official ? championTeamName(championBetState.official) : "未確定";

      if (invalidAmount) {
        championBetResultMain.textContent = "金額は1以上の数字で入力してください";
        championBetEliminationResult.textContent = "-";
        championBetFinalResult.textContent = "-";
        championBetPaymentResult.textContent = "-";
        championBetDirectionResult.textContent = "-";
      } else if (!championBetState.official) {
        championBetResultMain.textContent = eliminationSettlement.balance
          ? "途中敗退の精算があります。正式優勝国を選ぶと最終精算も計算します"
          : "正式優勝国を選ぶと計算します";
      } else if (karinHit === ryoHit) {
        finalSummary = karinHit ? "両方的中のため支払いなし" : "両方外れのため支払いなし";
        championBetResultMain.textContent = finalSummary;
      } else if (karinHit) {
        finalBalance = amount;
        finalSummary = `りょう → かりん ${formatYen(amount)}`;
        championBetResultMain.textContent = "かりんが優勝国を的中";
      } else {
        finalBalance = -amount;
        finalSummary = `かりん → りょう ${formatYen(amount)}`;
        championBetResultMain.textContent = "りょうが優勝国を的中";
      }

      if (!invalidAmount) {
        const totalBalance = eliminationSettlement.balance + finalBalance;
        championBetEliminationResult.textContent = eliminationSettlement.summary;
        championBetFinalResult.textContent = finalSummary;
        championBetPaymentResult.textContent = formatYen(Math.abs(totalBalance));
        championBetDirectionResult.textContent = championPaymentDirection(totalBalance);
      }

      if (shouldSave) {
        renderChampionRounds();
        saveChampionBetState();
      }
    }

    function championPaymentDirection(balance) {
      if (balance > 0) return "りょう → かりん";
      if (balance < 0) return "かりん → りょう";
      return "なし";
    }

    function championEliminationSettlement(amount) {
      let balance = 0;
      const items = [];
      championRoundStages.forEach(([key]) => {
        const karinPick = championBetState.rounds?.[key]?.karin || "";
        const ryoPick = championBetState.rounds?.[key]?.ryo || "";
        const karinOut = Boolean(karinPick && championBetState.eliminated?.[key]?.karin);
        const ryoOut = Boolean(ryoPick && championBetState.eliminated?.[key]?.ryo);
        if (!karinOut && !ryoOut) return;
        if (karinOut && ryoOut) {
          items.push(`${championTeamName(karinPick)}・${championTeamName(ryoPick)}敗退：支払いなし`);
          return;
        }
        if (karinOut && ryoPick) {
          balance -= amount;
          items.push(`${championTeamName(karinPick)}敗退：かりん → りょう ${formatYen(amount)}`);
          return;
        }
        if (ryoOut && karinPick) {
          balance += amount;
          items.push(`${championTeamName(ryoPick)}敗退：りょう → かりん ${formatYen(amount)}`);
        }
      });
      return {
        balance,
        summary: items.length ? items.join(" / ") : "なし"
      };
    }

    function currentChampionPick(owner) {
      let latest = championBetState.rounds?.pre?.[owner] || "";
      for (let index = 1; index < championRoundStages.length; index += 1) {
        const key = championRoundStages[index][0];
        if (!isChampionRoundUnlocked(key, owner)) break;
        const value = championBetState.rounds?.[key]?.[owner] || "";
        if (value) latest = value;
      }
      return latest;
    }

    function renderOfficialSquadList() {
      officialSquadList.innerHTML = "";
      betResultDraft = { ...betResults };
      positionSortOrder.forEach((group) => {
        allPlayers
          .filter((player) => (player.group || benchGroupKey(player.position)) === group)
          .forEach((player) => {
            const label = document.createElement("label");
            label.className = "official-player";

            const meta = document.createElement("span");
            meta.className = "official-player-meta";
            const name = document.createElement("span");
            name.className = "official-player-name";
            name.textContent = player.name;
            const sub = document.createElement("span");
            sub.className = "official-player-sub";
            sub.textContent = `${player.position} / ${player.club}`;
            meta.append(name, sub);

            const select = document.createElement("select");
            select.setAttribute("aria-label", `${player.name} 正式結果`);
            betResultValues.forEach((value) => {
              const option = document.createElement("option");
              option.value = value;
              option.textContent = betResultLabels[value];
              select.appendChild(option);
            });
            select.value = betResultForPlayer(player.id);
            select.addEventListener("change", () => {
              betResults[player.id] = normalizeBetResultValue(select.value);
              betResultDraft = { ...betResults };
              saveBetResults();
              updateBetResult(false);
            });

            label.append(meta, select);
            officialSquadList.appendChild(label);
          });
      });
    }

    function updateBetResult(shouldSave = true) {
      const amount = parseWholeNumber(betAmountInput.value);

      betState.amount = betAmountInput.value;

      const invalidAmount = amount === null || amount <= 0;
      const officialSelectedIds = allPlayers.filter((player) => betResultForPlayer(player.id) === "selected").map((player) => player.id);
      const officialNotSelectedIds = allPlayers.filter((player) => betResultForPlayer(player.id) === "not_selected").map((player) => player.id);
      const officialPendingIds = allPlayers.filter((player) => betResultForPlayer(player.id) === "pending").map((player) => player.id);
      const officialIds = new Set(officialSelectedIds);
      const officialCount = officialSelectedIds.length;
      const officialDroppedCount = officialNotSelectedIds.length;
      const pendingCount = officialPendingIds.length;
      const officialWarning = officialCount !== rosterLimit;

      officialSquadCount.textContent = `招集：${officialCount}人 / 落選：${officialDroppedCount}人 / 未確定：${pendingCount}人`;
      officialSquadCount.classList.toggle("warning", officialWarning);
      betOfficialCountResult.textContent = `招集 ${officialCount}人 / 落選 ${officialDroppedCount}人`;
      betPendingResult.textContent = `${pendingCount}人`;

      if (invalidAmount) {
        betError.textContent = "金額は1以上の数字で入力してください";
        betResultMain.textContent = "入力内容を確認してください";
        betKarinResult.textContent = "-";
        betRyoResult.textContent = "-";
        betPendingResult.textContent = "-";
        betDiffResult.textContent = "-";
        betPaymentResult.textContent = "-";
        betWinnerResult.textContent = "-";
        betDirectionResult.textContent = "-";
        [betKarinHits, betKarinMisses, betRyoHits, betRyoMisses, betUnpickedList].forEach((target) => {
          target.textContent = "なし";
        });
        betKarinHitSummary.textContent = "的中：0人";
        betKarinMissSummary.textContent = "外れ：0人";
        betRyoHitSummary.textContent = "的中：0人";
        betRyoMissSummary.textContent = "外れ：0人";
        betUnpickedSummary.textContent = "未選出：0人";
        return;
      }

      betError.textContent = officialWarning
        ? `正式招集メンバーは${rosterLimit}人想定です（現在${officialCount}人）。保存はできます。`
        : "";
      const karinIds = selectedOwnerIds("karin");
      const ryoIds = selectedOwnerIds("ryo");
      const karinHitIds = Array.from(karinIds).filter((id) => officialIds.has(id));
      const ryoHitIds = Array.from(ryoIds).filter((id) => officialIds.has(id));
      const officialDroppedIds = new Set(officialNotSelectedIds);
      const karinMissIds = Array.from(karinIds).filter((id) => officialDroppedIds.has(id));
      const ryoMissIds = Array.from(ryoIds).filter((id) => officialDroppedIds.has(id));
      const karinUnpickedIds = officialSelectedIds.filter((id) => !karinIds.has(id));
      const ryoUnpickedIds = officialSelectedIds.filter((id) => !ryoIds.has(id));
      const unpickedIds = Array.from(new Set([...karinUnpickedIds, ...ryoUnpickedIds]));
      const karinCorrect = karinHitIds.length;
      const ryoCorrect = ryoHitIds.length;
      const diff = Math.abs(karinCorrect - ryoCorrect);
      const payment = diff * amount;
      const resultPrefix = pendingCount > 0 ? "暫定結果：" : "";
      betKarinResult.textContent = `${karinCorrect}人`;
      betRyoResult.textContent = `${ryoCorrect}人`;
      betDiffResult.textContent = `${diff}人`;
      betPaymentResult.textContent = formatYen(payment);
      betKarinHitSummary.textContent = `的中：${karinHitIds.length}人`;
      betKarinMissSummary.textContent = `外れ：${karinMissIds.length}人`;
      betRyoHitSummary.textContent = `的中：${ryoHitIds.length}人`;
      betRyoMissSummary.textContent = `外れ：${ryoMissIds.length}人`;
      betUnpickedSummary.textContent = `未選出：${unpickedIds.length}人`;
      renderBetPlayerList(betKarinHits, karinHitIds, "karin");
      renderBetPlayerList(betKarinMisses, karinMissIds, "karin");
      renderBetPlayerList(betRyoHits, ryoHitIds, "ryo");
      renderBetPlayerList(betRyoMisses, ryoMissIds, "ryo");
      renderBetPlayerList(betUnpickedList, unpickedIds);

      if (diff === 0) {
        betResultMain.textContent = `${resultPrefix}同点のため支払いなし`;
        betWinnerResult.textContent = "同点";
        betDirectionResult.textContent = "なし";
      } else if (karinCorrect > ryoCorrect) {
        betResultMain.textContent = `${resultPrefix}かりんが${diff}人多く的中`;
        betWinnerResult.textContent = "かりん";
        betDirectionResult.textContent = "りょう → かりん";
      } else {
        betResultMain.textContent = `${resultPrefix}りょうが${diff}人多く的中`;
        betWinnerResult.textContent = "りょう";
        betDirectionResult.textContent = "かりん → りょう";
      }

      if (shouldSave) {
        saveBetState();
      }
    }

    function inside(clientX, clientY, rect) {
      return clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom;
    }

    function clamp(value, min, max) {
      return Math.min(Math.max(value, min), max);
    }

    function validateNumber(value) {
      const normalized = normalizeNumber(value);
      if (normalized === "") return "";
      if (!/^\d{1,2}$/.test(normalized)) return null;
      const numeric = Number(normalized);
      if (numeric < 1 || numeric > 99) return null;
      return String(numeric);
    }

    function openEditModal(playerId) {
      const player = currentPlayers().find((item) => item.id === playerId);
      if (!player) return;
      editingPlayerId = playerId;
      editPlayerName.textContent = player.name;
      editPlayerPosition.textContent = `ポジション：${player.position}`;
      editPlayerClub.textContent = `所属：${player.club}`;
      editNumberInput.value = currentNumber(playerId);
      editModalError.textContent = "";
      editModal.classList.add("active");
      editNumberInput.focus();
      editNumberInput.select();
    }

    function closeEditModal() {
      editModal.classList.remove("active");
      editingPlayerId = null;
      editModalError.textContent = "";
    }

    function savePlayerEdit() {
      if (!editingPlayerId) return;
      const normalized = validateNumber(editNumberInput.value);
      if (normalized === null) {
        editModalError.textContent = "背番号は1〜99の数字、または空欄で入力してください";
        return;
      }

      const current = states[activeOwner].get(editingPlayerId);
      if (!current) return;
      states[activeOwner].set(editingPlayerId, {
        ...current,
        number: normalized
      });
      saveOwnerState(activeOwner);
      closeEditModal();
      render();
    }

    function exportCurrentState() {
      if (activeView === "compare") {
        copyJsonToClipboard(buildGistExportData(), "共有JSONをコピーしました");
        return;
      }
      if (activeView !== "owner") return;
      const data = buildExportData(activeOwner);
      const text = JSON.stringify(data, null, 2);
      const fallback = () => {
        window.prompt("以下のJSONをコピーしてください", text);
      };

      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(text)
          .then(() => showStatus("エクスポートJSONをコピーしました"))
          .catch(fallback);
      } else {
        fallback();
      }
    }

    function buildExportData(owner) {
      const placements = {};
      states[owner].forEach((placement, playerId) => {
        placements[playerId] = {
          rating: placement.rating,
          number: placement.number || "",
          location: placement.area,
          area: placement.area,
          x: placement.x,
          y: placement.y,
          manual: placement.manual
        };
      });
      return {
        version: 1,
        type: "worldcup2026_japan_prediction",
        owner,
        teamName,
        officialSquadSource: officialSquadSourceUrl,
        officialSquad: Array.from(officialSquadDefaultIds),
        rosterIds: ownerPlayers[owner].map((player) => player.id),
        formation: currentFormations[owner] || "",
        locked: ownerLocks[owner],
        players: placements
      };
    }

    function buildGistExportData() {
      return buildWorldCupStateData();
    }

    function buildWorldCupStateData() {
      const karinPrediction = buildExportData("karin");
      const ryoPrediction = buildExportData("ryo");
      return {
        version: 3,
        type: "worldcup2026_gist_state",
        fileName: gistStateFileName,
        lastUpdated: new Date().toISOString(),
        teamName,
        officialSquadSource: officialSquadSourceUrl,
        officialSquad: Array.from(officialSquadDefaultIds),
        playerIds: allPlayers.map((player) => player.id),
        tournament: window.WorldCupTournament?.exportState?.() || null,
        owners: {
          karin: karinPrediction,
          ryo: ryoPrediction
        },
        karinPrediction,
        ryoPrediction,
        betResults: { ...betResults },
        bet: { amount: betState.amount },
        championBet: { ...championBetState }
      };
    }

    function loadGistSettings() {
      try {
        const parsed = JSON.parse(localStorage.getItem(gistSettingsStorageKey) || "{}");
        return {
          gistId: parsed.gistId || "",
          token: parsed.token || "",
          rawUrl: parsed.rawUrl || "",
          lastLoadedUpdated: parsed.lastLoadedUpdated || ""
        };
      } catch (error) {
        return { gistId: "", token: "", rawUrl: "", lastLoadedUpdated: "" };
      }
    }

    function saveGistSettings(settings) {
      localStorage.setItem(gistSettingsStorageKey, JSON.stringify(settings));
    }

    function configureGistSettings() {
      const current = loadGistSettings();
      const gistId = window.prompt("Gist IDを入力してください（worldcup_state.json を含むGist）", current.gistId);
      if (gistId === null) return;
      const rawUrl = window.prompt("Raw URLを入力してください（読込用、省略可）", current.rawUrl);
      if (rawUrl === null) return;
      const token = window.prompt("Gist保存用GitHubトークンを入力してください（保存しない場合は空欄）。公開コードには保存されず、この端末のlocalStorageにだけ保存されます。", current.token ? "********" : "");
      if (token === null) return;
      saveGistSettings({
        ...current,
        gistId: gistId.trim(),
        rawUrl: rawUrl.trim(),
        token: token === "********" ? current.token : token.trim()
      });
      showStatus("Gist設定を保存しました");
    }

    async function fetchGistStateFromRawUrl(url) {
      const response = await fetch(url, { cache: "no-store" });
      if (!response.ok) throw new Error(`通信エラー: ${response.status}`);
      return response.json();
    }

    async function fetchGistFile(settings) {
      if (!settings.gistId) throw new Error("Gist IDが未設定です");
      const headers = settings.token ? { Authorization: `Bearer ${settings.token}`, Accept: "application/vnd.github+json" } : { Accept: "application/vnd.github+json" };
      const response = await fetch(`https://api.github.com/gists/${settings.gistId}`, { cache: "no-store", headers });
      if (!response.ok) throw new Error(`Gist取得エラー: ${response.status}`);
      const gist = await response.json();
      const file = gist.files?.[gistStateFileName];
      if (!file) throw new Error(`${gistStateFileName} がGist内にありません`);
      const content = file.content !== undefined
        ? file.content
        : await fetch(file.raw_url, { cache: "no-store" }).then((raw) => raw.text());
      return JSON.parse(content);
    }

    function applyWorldCupStateData(payload) {
      const ownersPayload = payload.owners || payload;
      applyOwnerImportData("karin", payload.karinPrediction || ownersPayload.karin || payload.karin);
      applyOwnerImportData("ryo", payload.ryoPrediction || ownersPayload.ryo || payload.ryo);
      if (payload.tournament) {
        window.WorldCupTournament?.importState?.(payload.tournament);
      }
      if (payload.betResults && typeof payload.betResults === "object") {
        betResults = normalizeBetResults(payload.betResults);
        betResultDraft = { ...betResults };
        saveBetResults();
      } else if (Array.isArray(payload.officialSquad)) {
        const importedResults = {};
        payload.officialSquad.forEach((id) => {
          if (allPlayerById(id)) importedResults[id] = "selected";
        });
        betResults = normalizeBetResults(importedResults);
        betResultDraft = { ...betResults };
        saveBetResults();
      }
      if (payload.bet?.amount !== undefined) {
        betState.amount = String(payload.bet.amount);
        saveBetState();
      }
      if (payload.championBet && typeof payload.championBet === "object") {
        championBetState.amount = String(payload.championBet.amount ?? championBetState.amount);
        championBetState.karin = payload.championBet.karin || "";
        championBetState.ryo = payload.championBet.ryo || "";
        championBetState.official = payload.championBet.official || "";
        championBetState.rounds = normalizeChampionRounds(payload.championBet.rounds);
        championBetState.eliminated = normalizeChampionEliminations(payload.championBet.eliminated);
        if (!payload.championBet.rounds && (championBetState.karin || championBetState.ryo)) {
          championBetState.rounds.pre = {
            karin: championBetState.karin,
            ryo: championBetState.ryo
          };
        }
        saveChampionBetState();
      }
      const settings = loadGistSettings();
      saveGistSettings({
        ...settings,
        lastLoadedUpdated: payload.lastUpdated || payload.exportedAt || new Date().toISOString()
      });
    }

    async function loadGistState() {
      const settings = loadGistSettings();
      const url = settings.rawUrl;
      if (!settings.gistId && !url) {
        window.alert("先にGist設定でGist IDまたはRaw URLを設定してください。");
        return;
      }
      const ok = window.confirm("Gistの worldcup_state.json を読み込み、現在の端末内データより優先して反映します。よろしいですか？");
      if (!ok) return;
      showStatus("Gistから読み込み中...");
      try {
        const payload = url ? await fetchGistStateFromRawUrl(url) : await fetchGistFile(settings);
        applyWorldCupStateData(payload);
        showStatus("Gistの内容を読み込みました");
        render();
      } catch (error) {
        window.alert(`Gistから読み込めませんでした。\n${error.message || error}`);
        showStatus("Gist読み込みに失敗しました");
      }
    }

    async function saveGistState() {
      const settings = loadGistSettings();
      if (!settings.gistId || !settings.token) {
        window.alert("Gistへ保存するには、Gist設定でGist IDとGitHubトークンを設定してください。トークンは公開コードには書き込まれません。");
        return;
      }
      showStatus("Gistの更新確認中...");
      try {
        const remotePayload = await fetchGistFile(settings).catch((error) => {
          if (String(error.message || error).includes(gistStateFileName)) return null;
          throw error;
        });
        const remoteUpdated = remotePayload?.lastUpdated || remotePayload?.exportedAt || "";
        if (remoteUpdated && (!settings.lastLoadedUpdated || Date.parse(remoteUpdated) > Date.parse(settings.lastLoadedUpdated))) {
          const ok = window.confirm(`Gist側の方が新しい可能性があります。\nGist: ${remoteUpdated}\nこの端末で最後に読込: ${settings.lastLoadedUpdated || "未読込"}\n上書き保存しますか？`);
          if (!ok) {
            showStatus("Gist保存を中止しました");
            return;
          }
        }
        const payload = buildWorldCupStateData();
        const response = await fetch(`https://api.github.com/gists/${settings.gistId}`, {
          method: "PATCH",
          headers: {
            Accept: "application/vnd.github+json",
            Authorization: `Bearer ${settings.token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            files: {
              [gistStateFileName]: {
                content: JSON.stringify(payload, null, 2)
              }
            }
          })
        });
        if (!response.ok) throw new Error(`Gist保存エラー: ${response.status}`);
        saveGistSettings({
          ...settings,
          lastLoadedUpdated: payload.lastUpdated
        });
        showStatus(`Gistへ保存しました: ${payload.lastUpdated}`);
      } catch (error) {
        window.alert(`Gistへ保存できませんでした。\n${error.message || error}`);
        showStatus("Gist保存に失敗しました");
      }
    }

    function copyJsonToClipboard(data, successMessage) {
      const text = JSON.stringify(data, null, 2);
      const fallback = () => {
        window.prompt("以下のJSONをコピーしてください", text);
      };
      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(text)
          .then(() => showStatus(successMessage))
          .catch(fallback);
      } else {
        fallback();
      }
    }

    function applyOwnerImportData(owner, data) {
      if (!data?.players || typeof data.players !== "object") {
        throw new Error(`${owners[owner]}の players 情報がありません`);
      }
      if (Array.isArray(data.rosterIds)) {
        ownerPlayers[owner] = sortPlayersByMasterOrder(data.rosterIds.map(allPlayerById).filter((player) => player && isOfficialSquadPlayer(player.id)));
      }
      ensureRequiredOwnerPlayers(owner);
      const imported = createInitialState(owner);
      ownerPlayers[owner].forEach((player) => {
        const fallback = imported.get(player.id);
        const saved = data.players[player.id];
        if (!fallback || !saved) return;
        imported.set(player.id, normalizePlacement({
          ...saved,
          area: saved.area || saved.location
        }, fallback));
      });
      states[owner] = imported;
      currentFormations[owner] = typeof data.formation === "string" ? data.formation : "";
      ownerLocks[owner] = Boolean(data.locked);
      saveOwnerState(owner);
    }

    function exportGistState() {
      copyJsonToClipboard(buildGistExportData(), "worldcup_state.json 用JSONをコピーしました");
    }

    async function saveFirebaseState() {
      showStatus("DBに保存中...");
      try {
        const payload = buildWorldCupStateData();
        const res = await fetch(`${FIREBASE_DB_URL}.json`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error(`保存エラー: ${res.status}`);
        showStatus(`DBに保存しました: ${payload.lastUpdated}`);
      } catch (error) {
        window.alert(`DBへ保存できませんでした。\n${error.message || error}`);
        showStatus("DB保存に失敗しました");
      }
    }

    async function loadFirebaseState(silent = false) {
      if (!silent) {
        const ok = window.confirm("DBの最新データを読み込み、現在の端末内データより優先して反映します。よろしいですか？");
        if (!ok) return;
        showStatus("DBから読み込み中...");
      }
      try {
        const res = await fetch(`${FIREBASE_DB_URL}.json`, { cache: "no-store" });
        if (!res.ok) return;
        const payload = await res.json();
        if (!payload) return;

        // トーナメントスコアは常に適用（オーナーデータがなくても）
        if (payload.tournament) {
          window.WorldCupTournament?.importState?.(payload.tournament);
        }

        // オーナーデータがある場合は全体適用
        const hasOwnerData = payload.karinPrediction || payload.owners?.karin || payload.karin;
        if (hasOwnerData) {
          try { applyWorldCupStateData(payload); } catch (e) { console.warn("applyWorldCupStateData:", e); }
        }

        if (!silent) {
          showStatus("DBの内容を読み込みました");
          render();
        }
      } catch (e) {
        if (!silent) {
          showStatus("DB読み込みに失敗しました");
          console.warn("loadFirebaseState:", e);
        }
      }
    }

    async function importGistStateFromRawUrl() {
      const url = window.prompt("Gistの worldcup_state.json Raw URLを貼り付けてください");
      if (!url) return;
      const ok = window.confirm("Gistの内容を、スコア/日程・観戦メモ・予想・各国データ・開催地に反映します。よろしいですか？");
      if (!ok) return;
      showStatus("Gist Raw URLから読み込み中...");
      try {
        const payload = await fetchGistStateFromRawUrl(url);
        applyWorldCupStateData(payload);
        const settings = loadGistSettings();
        saveGistSettings({ ...settings, rawUrl: url.trim() });
        showStatus("Gistの内容を読み込みました");
        render();
      } catch (error) {
        window.alert(`Gist Raw URLから読み込めませんでした。\n${error.message || error}`);
        showStatus("Gist読み込みに失敗しました");
      }
    }

    function importCurrentState() {
      if (!["owner", "compare"].includes(activeView)) return;
      const text = window.prompt("インポートするJSON文字列を貼り付けてください");
      if (!text) return;

      let data;
      try {
        data = JSON.parse(text);
      } catch (error) {
        window.alert("JSON形式が正しくありません。コピー内容を確認してください。");
        return;
      }

      if (activeView === "compare") {
        const ownersPayload = data.owners || data;
        if (!data.karinPrediction && !data.ryoPrediction && (!ownersPayload.karin || !ownersPayload.ryo)) {
          window.alert("共有JSONには karinPrediction / ryoPrediction、または owners.karin / owners.ryo が必要です。");
          return;
        }
        const ok = window.confirm("共有JSONで、かりん・りょう両方の予想を上書きします。よろしいですか？");
        if (!ok) return;
        applyOwnerImportData("karin", data.karinPrediction || ownersPayload.karin);
        applyOwnerImportData("ryo", data.ryoPrediction || ownersPayload.ryo);
        showStatus("共有JSONを読み込みました");
        render();
        return;
      }

      const ownerData = data.karinPrediction || data.ryoPrediction || data.owners?.[activeOwner] || data;
      if (!ownerData?.players || typeof ownerData.players !== "object") {
        window.alert("インポートデータに players 情報がありません。");
        return;
      }

      const ok = window.confirm("このタブの現在の予想をインポートデータで上書きします。よろしいですか？");
      if (!ok) return;

      applyOwnerImportData(activeOwner, ownerData);
      showStatus("インポートしました");
      render();
    }

    resetButton.addEventListener("click", () => {
      if (ownerLocks[activeOwner]) {
        showStatus("配置ロック中です。解除してからリセットしてください");
        return;
      }
      const ok = window.confirm("ピッチ上の配置だけをリセットします。評価・背番号は残ります。よろしいですか？");
      if (!ok) return;
      states[activeOwner].forEach((placement, playerId) => {
        if (placement.area !== "pitch") return;
        states[activeOwner].set(playerId, {
          ...placement,
          area: "bench",
          x: 50,
          y: 50,
          manual: false
        });
      });
      currentFormations[activeOwner] = "";
      benchSortModes[activeOwner] = "original";
      saveOwnerState(activeOwner);
      showStatus(`${owners[activeOwner]}のピッチ配置をリセットしました`);
      render();
    });

    sortByRatingButton.addEventListener("click", () => {
      benchSortModes[activeOwner] = "rating";
      showStatus("ベンチを優先順で並び替えました");
      render();
    });

    betAmountInput.addEventListener("input", () => updateBetResult(true));
    betTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        activeBetView = tab.dataset.betView || "squad";
        if (activeBetView === "champion") renderChampionBetSheet();
        renderBetTabs();
      });
    });
    [championBetAmountInput, championBetKarinSelect, championBetRyoSelect, championBetOfficialSelect].forEach((control) => {
      control.addEventListener("input", () => updateChampionBetResult(true));
      control.addEventListener("change", () => updateChampionBetResult(true));
    });
    betResultsSaveButton.addEventListener("click", () => {
      betResults = normalizeBetResults(betResults);
      betResultDraft = { ...betResults };
      saveBetResults();
      showStatus("正式結果マスタを保存しました");
      render();
    });

    showBetButton.addEventListener("click", () => {
      activeView = "bet";
      statusMessage.textContent = "";
      window.clearTimeout(statusTimer);
      render();
    });

    [rosterSearchInput, rosterPositionFilter].forEach((control) => {
      control.addEventListener("input", renderRosterList);
      control.addEventListener("change", renderRosterList);
    });
    playerImportButton.addEventListener("click", importPlayersFromText);

    positionModeButtons.forEach((button) => {
      button.addEventListener("click", () => renderPositionGuideMode(button.dataset.positionMode));
    });

    formationButtons.forEach((button) => {
      button.addEventListener("click", () => {
        if (ownerLocks[activeOwner]) {
          showStatus("配置ロック中です");
          return;
        }
        applyFormation(button.dataset.formation);
      });
    });

    lockButton.addEventListener("click", () => {
      ownerLocks[activeOwner] = !ownerLocks[activeOwner];
      saveOwnerState(activeOwner);
      showStatus(ownerLocks[activeOwner] ? "配置をロックしました" : "ロックを解除しました");
      render();
    });


    screenshotButton.addEventListener("click", () => {
      screenshotMode = !screenshotMode;
      render();
    });

    screenshotReturnButton.addEventListener("click", () => {
      screenshotMode = false;
      render();
    });

    saveEditButton.addEventListener("click", savePlayerEdit);
    cancelEditButton.addEventListener("click", closeEditModal);
    editModal.addEventListener("click", (event) => {
      if (event.target === editModal) {
        closeEditModal();
      }
    });
    editNumberInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        savePlayerEdit();
      } else if (event.key === "Escape") {
        closeEditModal();
      }
    });

    ownerTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        activeView = tab.dataset.view;
        if (tab.dataset.owner) {
          activeOwner = tab.dataset.owner;
        }
        statusMessage.textContent = "";
        window.clearTimeout(statusTimer);
        render();
      });
    });

    renderPositionGuideMode(positionGuideMode);
    window.WorldCupTournament?.init();

    ownerTabs.forEach((tab) => {
      if (tab.dataset.view === "owner") {
        tab.textContent = `${owners[tab.dataset.owner]}予想（${teamName}）`;
      } else if (tab.dataset.view === "compare") {
        tab.textContent = `比較コート（${teamName}）`;
      }
    });

    render();
    loadFirebaseState(true).then(() => render());
