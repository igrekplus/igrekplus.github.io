(function () {
  const STORAGE_KEY = "worldcup2026_tournament_state";
  const DATA_URL = "data/worldcup2026_matches.json";
  const KNOCKOUT_MAPPING_URL = "data/knockout_mapping.json";
  const JAPAN_TEAM_ID = "JPN";
  const JST_TIME_ZONE = "Asia/Tokyo";
  const DAY_MS = 24 * 60 * 60 * 1000;
  const FIREBASE_TOURNAMENT_URL = "https://football-delay-watching-a8830-default-rtdb.firebaseio.com/worldcup2026/state/tournament";
  let firebasePersistTimer = null;

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

  const confederationByTeam = {
    MEX: "北中米カリブ海 / CONCACAF", RSA: "アフリカ / CAF", KOR: "アジア / AFC", CZE: "欧州 / UEFA",
    CAN: "北中米カリブ海 / CONCACAF", SUI: "欧州 / UEFA", QAT: "アジア / AFC", BIH: "欧州 / UEFA",
    BRA: "南米 / CONMEBOL", MAR: "アフリカ / CAF", HAI: "北中米カリブ海 / CONCACAF", SCO: "欧州 / UEFA",
    USA: "北中米カリブ海 / CONCACAF", PAR: "南米 / CONMEBOL", AUS: "アジア / AFC", TUR: "欧州 / UEFA",
    GER: "欧州 / UEFA", CUW: "北中米カリブ海 / CONCACAF", CIV: "アフリカ / CAF", ECU: "南米 / CONMEBOL",
    NED: "欧州 / UEFA", JPN: "アジア / AFC", TUN: "アフリカ / CAF", SWE: "欧州 / UEFA",
    BEL: "欧州 / UEFA", EGY: "アフリカ / CAF", IRN: "アジア / AFC", NZL: "オセアニア / OFC",
    ESP: "欧州 / UEFA", CPV: "アフリカ / CAF", KSA: "アジア / AFC", URU: "南米 / CONMEBOL",
    FRA: "欧州 / UEFA", SEN: "アフリカ / CAF", NOR: "欧州 / UEFA", IRQ: "アジア / AFC",
    ARG: "南米 / CONMEBOL", ALG: "アフリカ / CAF", AUT: "欧州 / UEFA", JOR: "アジア / AFC",
    POR: "欧州 / UEFA", UZB: "アジア / AFC", COL: "南米 / CONMEBOL", COD: "アフリカ / CAF",
    ENG: "欧州 / UEFA", CRO: "欧州 / UEFA", GHA: "アフリカ / CAF", PAN: "北中米カリブ海 / CONCACAF"
  };

  const qualificationByTeam = {
    CAN: "開催国", MEX: "開催国", USA: "開催国",
    JPN: "アジア予選突破", KOR: "アジア予選突破", QAT: "アジア予選突破", AUS: "アジア予選突破", IRN: "アジア予選突破", KSA: "アジア予選突破", IRQ: "アジア予選突破", JOR: "アジア予選突破", UZB: "アジア予選突破",
    BRA: "南米予選突破", ARG: "南米予選突破", ECU: "南米予選突破", URU: "南米予選突破", COL: "南米予選突破", PAR: "南米予選突破",
    NZL: "オセアニア予選突破"
  };

  const countryDataOverrides = {
    JPN: {
      features: "久保、堂安、三笘、伊東ら2列目の質と、遠藤を軸にした中盤の回収力が土台。前から奪って短い時間でゴールへ向かえる。",
      style: "相手のビルドアップに圧をかけ、奪った後はサイドのスピードとハーフスペースの受け手を使う。強豪相手では5バック気味に耐える時間も想定。",
      strengths: "切り替えの速さ、複数ポジションをこなせる選手層、サイド攻撃、組織的な撤退守備。",
      weaknesses: "高さのある相手へのセットプレー対応、押し込まれ続けた時のクリア後の回収、CFが孤立する展開。",
      watchPoint: "オランダ相手に前進できる時間をどれだけ作れるか。チュニジア、スウェーデン戦では先制点を取れるかが大きい。",
      japanChance: "自国。Group Fでオランダ、チュニジア、スウェーデンと直接対戦する。",
      watchMemo: "グループ順位だけでなく、1位通過ならR32でGroup C 2位、2位通過ならGroup C 1位と当たる山まで意識して見る。"
    },
    NED: {
      features: "ファン・ダイク級の大型DFを中心に、後方の安定感と中盤の技術で試合を支配しにくる欧州上位国。",
      style: "3バック/4バックを使い分けながら後方から前進し、サイドの幅と中央の配球で相手を押し込む。",
      strengths: "空中戦、最終ラインの対人、セットプレー、デ・ヨング系の中盤が出た時の前進力。",
      weaknesses: "相手にテンポを落とされると攻撃が外回りになりやすく、背後を突かれた時の戻りも焦点。",
      watchPoint: "日本がプレスを外された後に、サイド深くまで運ばれない守備を作れるか。",
      japanChance: "日本と同じGroup F。グループステージで直接対戦するため、日本にとって最重要チェック対象。",
      watchMemo: "日本の守備ブロック、セットプレー耐性、強豪相手の前進力を測る基準試合。"
    },
    TUN: {
      features: "北アフリカらしい球際の粘りと、低い位置からのカウンターで勝点を拾いにくるチーム。",
      style: "守備ブロックを作って中央を締め、奪ったら前線へ早くつける。試合を荒くせず接戦に持ち込む狙いが強い。",
      strengths: "守備時の集中力、カウンターの初速、接戦での粘り、相手を焦らせる試合運び。",
      weaknesses: "自分たちがボールを保持して崩す展開になると攻撃の選択肢が限られやすい。",
      watchPoint: "日本が先制できない場合、時間経過とともに難しい試合になる可能性がある。",
      japanChance: "日本と同じGroup F。グループステージで直接対戦するため、突破計算に直結する相手。",
      watchMemo: "勝ち切るべき試合として、セットプレーとカウンター被弾をどれだけ避けられるかを見る。"
    },
    SWE: {
      features: "イサク、クルゼフスキなどプレミア基準の前線を抱え、高さと左足の創造性を同時に持つ。",
      style: "前線に収めてから2列目が絡み、サイドからのクロスやカットインでゴールへ向かう。",
      strengths: "CFの個の質、クロス対応力、セットプレー、フィジカル勝負での優位。",
      weaknesses: "細かいパス交換で揺さぶられると守備の横移動に負荷がかかる。",
      watchPoint: "日本のCBとボランチがイサクへの縦パスをどこで潰せるか。",
      japanChance: "日本と同じGroup F。グループステージで直接対戦するため、順位争いの直接ライバル。",
      watchMemo: "高さと欧州的な強度に対して、日本が地上戦と切り替えで上回れるかを確認。"
    },
    BRA: {
      features: "ヴィニシウス、ロドリゴ級の前線を中心に、個人技で局面を壊せる南米最上位クラス。",
      style: "左サイドの突破、速いトランジション、前線の自由度を使いながら相手の守備を引き裂く。",
      strengths: "1対1の突破、シュートまでの速さ、攻撃の選択肢、試合を一発で変える個の質。",
      weaknesses: "前がかりになった時の中盤背後、守備時の距離感、強度の高い相手にテンポを乱される時間。",
      watchPoint: "Group Cを1位で抜けるか2位になるかで、日本のR32の相手候補が変わる。",
      japanChance: "Group C所属。日本がGroup Fを2位通過した場合、ラウンド32でGroup C 1位と対戦する枠に入るため、早い段階で当たる可能性がある。",
      watchMemo: "日本が2位通過になった時の最大級の壁として、守備の距離感とカウンター耐性を見ておきたい。"
    },
    MAR: {
      features: "2022年大会で示した堅守と移行の速さがベース。欧州トップリーグ経験者を多く抱えるアフリカ上位国。",
      style: "守備ブロックで中央を締め、奪った後はサイドの推進力と前線の機動力で一気に出る。",
      strengths: "撤退守備の統率、対人守備、カウンター、試合終盤まで崩れにくい集中力。",
      weaknesses: "相手に引かれた時の崩し切り、先に失点した後に攻撃人数を増やすリスク。",
      watchPoint: "ブラジルと同組でどこまで首位争いに絡むか。2位なら日本1位通過時のR32相手候補。",
      japanChance: "Group C所属。日本がGroup Fを1位通過した場合、ラウンド32でGroup C 2位と対戦する枠に入るため、早い段階で当たる可能性がある。",
      watchMemo: "日本が主導権を持つ展開になっても、カウンター一発を受けない試合管理が必要になりそう。"
    },
    HAI: {
      features: "個のスピードと勢いで番狂わせを狙うカリブ海勢。守備の時間が長くなる前提で粘れるかが焦点。",
      style: "低い位置で耐え、前線の走力を使って縦に速く出る。セットプレーやこぼれ球も重要。",
      strengths: "前線のスピード、勢いが出た時の推進力、失うものが少ない挑戦者のメンタリティ。",
      weaknesses: "長時間押し込まれた時の守備整理、ビルドアップの安定感、試合終盤の集中力。",
      watchPoint: "Group Cで勝点を取れば、日本のR32候補を大きく変える存在になる。",
      japanChance: "Group C所属。日本がGroup Fを1位または2位で通過した場合、Group Cの順位次第でラウンド32で当たる可能性がある。",
      watchMemo: "ブラジル、モロッコ、スコットランド相手にどれだけ耐えられるかで、Group Cの順位表が動く。"
    },
    SCO: {
      features: "プレミア経験者を含む中盤とサイドの強度が特徴。欧州予選を勝ち抜いた勢いがある。",
      style: "コンパクトな守備からサイドへ展開し、クロスやセカンドボールで圧をかける。",
      strengths: "球際、運動量、セットプレー、サイドからの押し込み。",
      weaknesses: "細かい中央攻略や背後へのスピード対応で後手に回る可能性。",
      watchPoint: "Group Cで2位以内に入ると、日本のR32固定枠に入る可能性がある。",
      japanChance: "Group C所属。日本がGroup Fを1位通過ならGroup C 2位、2位通過ならGroup C 1位とラウンド32で当たるため、順位次第で早期対戦がある。",
      watchMemo: "日本にとっては高さと球際の耐性を測る相手候補。セットプレー守備を想定して見る。"
    },
    FRA: {
      features: "エムバペを中心に、スピード、パワー、選手層の厚さを兼ねるFIFAランキング首位級の優勝候補。",
      style: "自陣で耐えても一気に背後を取れる。保持でも非保持でも前線の個で試合を動かせる。",
      strengths: "前線の爆発力、守備者の身体能力、交代カードの質、トーナメント経験。",
      weaknesses: "主力のコンディション依存、相手にボールを持たれる時間の中盤管理。",
      watchPoint: "Group Iを首位で抜けた場合の山と、ノルウェーやセネガル相手の守備対応。",
      japanChance: "Group I所属。日本のGroup F 1位/2位通過時のR32固定枠では直接当たらない。3位上位枠で同じ山に入る可能性はあるが、割当は現時点では要確認。",
      watchMemo: "日本が深く勝ち進む場合に避けて通れない基準値として、攻守の切り替え速度を見たい。"
    },
    ESP: {
      features: "若いタレントとボール保持の構造が強み。サイドの幅と中盤の技術で相手を動かす。",
      style: "保持で相手を押し込み、ハーフスペースとワイドの使い分けで崩す。奪われた直後の即時回収も重要。",
      strengths: "パスワーク、ポジショニング、若いウイングの突破、試合のテンポ管理。",
      weaknesses: "縦に速い相手へのカウンター対応、押し込んでも決め切れない時間帯。",
      watchPoint: "Group Hでウルグアイ、サウジアラビア、カーボベルデ相手に保持の質を出せるか。",
      japanChance: "Group H所属。日本のGroup F 1位/2位通過時のR32固定枠では直接当たらない。3位上位枠や以降の山は組み合わせ次第のため要確認。",
      watchMemo: "日本がボールを持てない相手と当たる時の想定として、プレス回避と即時奪回を見る。"
    },
    ARG: {
      features: "世界王者の勝負強さと、メッシ世代から次世代への移行が同居する南米の完成度が高いチーム。",
      style: "中盤でテンポを作り、前線のひらめきと細かい連係で崩す。試合終盤の管理も巧い。",
      strengths: "大舞台経験、試合運び、前線の決定力、ファウルを受けながら前進する技術。",
      weaknesses: "主力年齢層のコンディション、強度の高い試合が続いた時の運動量。",
      watchPoint: "Group Jでアルジェリア、オーストリア、ヨルダン相手にどれだけ消耗せず進めるか。",
      japanChance: "Group J所属。日本のR32固定枠とは別山になる想定で、3位上位枠や以降の再配置は要確認。",
      watchMemo: "日本が終盤に守り切る展開を想定するなら、アルゼンチンの試合管理は参考になる。"
    },
    ENG: {
      features: "ベリンガム、フォーデン、ケイン級のタレントを抱えるが、配置と役割整理が結果を左右する。",
      style: "中盤の個で前進し、2列目の創造性とCFの収めで崩す。サイドバックの使い方が鍵。",
      strengths: "プレミア基準の強度、前線と2列目の質、セットプレー、選手層。",
      weaknesses: "攻撃的タレントの共存、慎重になった時のテンポ低下、重圧下の采配。",
      watchPoint: "Group Lでクロアチア、ガーナ、パナマ相手に主導権を握り切れるか。",
      japanChance: "Group L所属。日本のGroup F 1位/2位通過時のR32固定枠では直接当たらない。3位上位枠の割当や以降の山は要確認。",
      watchMemo: "日本が強豪の個を止める想定として、2列目への受け渡しとセットプレーを見たい。"
    },
    POR: {
      features: "ブルーノ、ベルナルド、レオンら創造性の高い選手を抱え、サイドと中央の両方から崩せる。",
      style: "保持で相手を押し込み、ライン間の受け手と外の突破を組み合わせる。試合によってCFの使い方が変わる。",
      strengths: "中盤の創造性、サイドの質、シュートレンジ、交代選手の豪華さ。",
      weaknesses: "守備への切り替えが遅れた時の中盤背後、主力の役割整理。",
      watchPoint: "Group Kでコロンビア、ウズベキスタン、DRコンゴ相手に守備の安定感を保てるか。",
      japanChance: "Group K所属。日本のR32固定枠とは直接つながらないが、3位上位枠や勝ち上がり後の山は要確認。",
      watchMemo: "日本が押し込まれる相手として、サイドから中央へ入る攻撃への対応を想像しながら見る。"
    },
    GER: {
      features: "開催地ではないが大会経験値が高く、若手とベテランのバランスで再上昇を狙う欧州の大国。",
      style: "中盤で主導権を取り、SBや2列目が内側に入って人数をかける。前線の決定力が鍵。",
      strengths: "ポジション取り、中盤の技術、セットプレー、試合ごとの修正力。",
      weaknesses: "高いラインの背後、トランジション守備、相手の速攻を受けた時の脆さ。",
      watchPoint: "Group Eでエクアドル、コートジボワール、キュラソー相手に守備の安定を示せるか。",
      japanChance: "Group E所属。日本がGroup F 3位で上位通過した場合、R32でGroup E 1位と当たる割当候補があるが、3位枠の割当は現時点では要確認。",
      watchMemo: "日本が過去に勝っている相手だからこそ、今大会での修正力と強度を見ておきたい。"
    },
    BEL: {
      features: "黄金世代後の移行期だが、デ・ブライネ系の創造性と前線の個はまだ大きな武器。",
      style: "中盤の配球から前線を動かし、サイドやCFへの速い展開で決定機を作る。",
      strengths: "ラストパス、前線の個、経験値、試合を落ち着かせる時間の作り方。",
      weaknesses: "守備陣の世代交代、速い相手へのトランジション対応、主力依存。",
      watchPoint: "Group Gでエジプト、イラン、ニュージーランド相手に守備の綻びを出さないか。",
      japanChance: "Group G所属。日本のR32固定枠では直接当たらない。3位上位枠や以降の山は組み合わせ次第のため要確認。",
      watchMemo: "日本が欧州の創造的MFをどう消すかを考える材料になる。"
    }
  };

  const countryKeyPlayers = {
    JPN: [
      {
        player_id: "jpn_kubo_takefusa",
        name_ja: "久保建英",
        position: "MF / WG",
        club: "レアル・ソシエダ",
        image_url: "pics/久保建英.jpg",
        description: "狭いエリアで半身で受け、左足のラストパスやカットインで守備のズレを作れる。相手のプレスを外して前進の起点になれるかに注目。"
      },
      {
        player_id: "jpn_endo_wataru",
        name_ja: "遠藤航",
        position: "MF",
        club: "リバプール",
        image_url: "pics/遠藤航.jpg",
        description: "中盤の底でセカンドボールを拾い、カウンターの芽を早い段階で止める役割。強豪相手では守備ライン前の防波堤として重要。"
      },
      {
        player_id: "jpn_doan_ritsu",
        name_ja: "堂安律",
        position: "MF / WG",
        club: "フランクフルト",
        image_url: "pics/堂安律.jpg",
        description: "右サイドから内側へ入り、左足のシュートやラストパスで局面を変えられる。日本が押し込めない時間帯の単独打開に注目。"
      }
    ],
    NED: [
      {
        player_id: "ned_van_dijk",
        name_ja: "フィルジル・ファン・ダイク",
        position: "DF",
        club: "リバプール",
        image_url: "pics/フィルジル・ファン・ダイク.jpg",
        description: "最終ラインで空中戦とカバー範囲を担う守備の基準点。日本戦では前線への縦パスをどこまで跳ね返すかが焦点。"
      },
      {
        player_id: "ned_frenkie_de_jong",
        name_ja: "フレンキー・デ・ヨング",
        position: "MF",
        club: "バルセロナ",
        image_url: "https://commons.wikimedia.org/wiki/Special:FilePath/Frenkie%20de%20Jong%202018.jpg?width=180",
        description: "中盤の低い位置で受けて、相手のプレスを運ぶドリブルと縦パスで外せる。日本が前から行く時に最も消したい前進役。"
      },
      {
        player_id: "ned_xavi_simons",
        name_ja: "シャビ・シモンズ",
        position: "MF / FW",
        club: "ライプツィヒ",
        image_url: "https://commons.wikimedia.org/wiki/Special:FilePath/Xavi%20Simons%202024.jpg?width=180",
        description: "ライン間で前を向き、細かいタッチからラストパスやミドルを狙える。日本のボランチ脇で自由にさせないことが大事。"
      }
    ],
    TUN: [
      {
        player_id: "tun_ellyes_skhiri",
        name_ja: "エリス・スキリ",
        position: "MF",
        club: "フランクフルト",
        image_url: "https://commons.wikimedia.org/wiki/Special:FilePath/Ellyes%20Skhiri%202019.jpg?width=180",
        description: "中盤でボールを回収し、守備ブロックの前を埋め続ける選手。日本が中央から崩す時に、彼を動かせるかがポイント。"
      },
      {
        player_id: "tun_hannibal_mejbri",
        name_ja: "ハンニバル・メイブリ",
        position: "MF",
        club: "バーンリー",
        image_url: "https://commons.wikimedia.org/wiki/Special:FilePath/Hannibal%20Mejbri%202021.jpg?width=180",
        description: "球際に強く、狭い場所でも前向きに運ぼうとするタイプ。試合が荒れた時間帯にテンポを変える存在になり得る。"
      },
      {
        player_id: "tun_hamza_rafia",
        name_ja: "ハムザ・ラフィア",
        position: "MF",
        club: "レッチェ",
        image_url: "https://commons.wikimedia.org/wiki/Special:FilePath/Hamza%20Rafia%20%28cropped%29.jpg?width=180",
        description: "2列目で受けて前線との距離を縮める役割。守備的な時間が長い中で、数少ない前進の受け皿になれるかを見る。"
      }
    ],
    SWE: [
      {
        player_id: "swe_alexander_isak",
        name_ja: "アレクサンデル・イサク",
        position: "FW",
        club: "ニューカッスル",
        image_url: "https://commons.wikimedia.org/wiki/Special:FilePath/Alexander%20Isak%202018.jpg?width=180",
        description: "長いボールを収めるだけでなく、足元で受けて反転できるCF。日本のCBが縦パスを受ける前に制限できるかが重要。"
      },
      {
        player_id: "swe_dejan_kulusevski",
        name_ja: "デヤン・クルゼフスキ",
        position: "MF / WG",
        club: "トッテナム",
        image_url: "https://commons.wikimedia.org/wiki/Special:FilePath/Dejan%20Kulusevski%202019.jpg?width=180",
        description: "右から内側へ運び、左足で時間を作りながらパスとシュートを選べる。日本のサイド守備の受け渡しを試す存在。"
      },
      {
        player_id: "swe_viktor_gyokeres",
        name_ja: "ヴィクトル・ギェケレシュ",
        position: "FW",
        club: "スポルティングCP",
        image_url: "https://commons.wikimedia.org/wiki/Special:FilePath/Viktor%20Gy%C3%B6keres%202023.jpg?width=180",
        description: "縦への推進力とゴール前の強引さがあり、相手を背負ってもフィニッシュへ持ち込める。セットプレー以外の肉弾戦にも注意。"
      }
    ],
    BRA: [
      {
        player_id: "bra_vinicius_junior",
        name_ja: "ヴィニシウス・ジュニオール",
        position: "FW",
        club: "レアル・マドリード",
        image_url: "pics/ヴィニシウス・ジュニオール.jpg",
        description: "左サイドで加速して一気に背後を取れる。守備が整っていても1対1から試合を壊せるため、カバーの距離が大事。"
      },
      {
        player_id: "bra_rodrygo",
        name_ja: "ロドリゴ",
        position: "FW",
        club: "レアル・マドリード",
        image_url: "https://commons.wikimedia.org/wiki/Special:FilePath/Rodrygo%20Goes%202018.jpg?width=180",
        description: "中央とサイドを行き来し、狭い局面でワンタッチの崩しに絡める。ヴィニシウスに守備が寄った時の逆側の怖さ。"
      },
      {
        player_id: "bra_bruno_guimaraes",
        name_ja: "ブルーノ・ギマランイス",
        position: "MF",
        club: "ニューカッスル",
        image_url: "https://commons.wikimedia.org/wiki/Special:FilePath/Bruno%20Guimar%C3%A3es%202022.jpg?width=180",
        description: "中盤で相手を背負いながら前を向き、前線の個へ良い形で渡せる。ブラジルの速攻を支える配球役。"
      }
    ],
    MAR: [
      {
        player_id: "mar_achraf_hakimi",
        name_ja: "アクラフ・ハキミ",
        position: "DF",
        club: "パリ・サンジェルマン",
        image_url: "pics/アクラフ・ハキミ.jpg",
        description: "右サイドを大きく押し上げ、守備から攻撃へ一気に距離を進められる。相手の左サイドを押し込む推進力が武器。"
      },
      {
        player_id: "mar_yassine_bounou",
        name_ja: "ヤシン・ブヌ",
        position: "GK",
        club: "アル・ヒラル",
        image_url: "https://commons.wikimedia.org/wiki/Special:FilePath/Yassine%20Bounou%202018.jpg?width=180",
        description: "反応とPK対応に強く、劣勢の試合でも流れを切れるGK。堅守で接戦に持ち込むモロッコの土台になる。"
      },
      {
        player_id: "mar_sofyan_amrabat",
        name_ja: "ソフィアン・アムラバト",
        position: "MF",
        club: "フェネルバフチェ",
        image_url: "https://commons.wikimedia.org/wiki/Special:FilePath/Sofyan%20Amrabat%202018.jpg?width=180",
        description: "中盤で相手の前進ルートを潰し、奪った後にシンプルに前へつける。守備の粘りを支える回収役。"
      }
    ],
    HAI: [
      {
        player_id: "hai_duckens_nazon",
        name_ja: "デュケンス・ナゾン",
        position: "FW",
        club: "カイセリスポル",
        image_url: "https://commons.wikimedia.org/wiki/Special:FilePath/Duckens%20Nazon%202018.jpg?width=180",
        description: "前線で身体を張り、少ないチャンスを強引にシュートへ持ち込む。格上相手に耐える試合で出口になれるかが鍵。"
      },
      {
        player_id: "hai_frantzdy_pierrot",
        name_ja: "フランツディ・ピエロ",
        position: "FW",
        club: "AEKアテネ",
        image_url: "https://images.mlssoccer.com/image/private/t_editorial_landscape_8_desktop_mobile/f_auto/mls-col/pg6iveb7qz5q1flh2hig.jpg",
        description: "高さとゴール前への入り方で勝負するストライカー。押し込まれる時間が長い中で、セットプレーの的になれる。"
      },
      {
        player_id: "hai_jean_ricner_bellegarde",
        name_ja: "ジャン＝リクネル・ベルガルド",
        position: "MF",
        club: "ウルヴァーハンプトン",
        image_url: "https://commons.wikimedia.org/wiki/Special:FilePath/Jean-Ricner%20Bellegarde%202019.jpg?width=180",
        description: "中盤から前へ運ぶ力があり、守備一辺倒になりそうな試合でリズムを変えられる。カウンターの初動に注目。"
      }
    ],
    SCO: [
      {
        player_id: "sco_scott_mctominay",
        name_ja: "スコット・マクトミネイ",
        position: "MF",
        club: "ナポリ",
        image_url: "https://commons.wikimedia.org/wiki/Special:FilePath/Scott%20McTominay%202018.jpg?width=180",
        description: "中盤からゴール前へ入るタイミングが鋭く、クロスやこぼれ球に強い。守備だけでなく得点源として警戒したい。"
      },
      {
        player_id: "sco_andy_robertson",
        name_ja: "アンドリュー・ロバートソン",
        position: "DF",
        club: "リバプール",
        image_url: "pics/アンドリュー・ロバートソン.jpg",
        description: "左サイドで運動量とクロスの質を出せる主将格。押し込む時間を作ると、スコットランドの攻撃が一気に厚くなる。"
      },
      {
        player_id: "sco_john_mcginn",
        name_ja: "ジョン・マッギン",
        position: "MF",
        club: "アストン・ヴィラ",
        image_url: "https://commons.wikimedia.org/wiki/Special:FilePath/John%20McGinn%202019.jpg?width=180",
        description: "低い重心でボールを守り、相手の中盤に身体を当てながら前進できる。試合のテンションを上げる存在。"
      }
    ],
    FRA: [
      {
        player_id: "fra_kylian_mbappe",
        name_ja: "キリアン・エムバペ",
        position: "FW",
        club: "レアル・マドリード",
        image_url: "https://commons.wikimedia.org/wiki/Special:FilePath/Kylian%20Mbapp%C3%A9%202018.jpg?width=180",
        description: "背後への一歩目とシュートまでの速さが突出する。守備が低くても高くても、数秒で決定機に変えられる。"
      },
      {
        player_id: "fra_antoine_griezmann",
        name_ja: "アントワーヌ・グリーズマン",
        position: "MF / FW",
        club: "アトレティコ・マドリード",
        image_url: "https://commons.wikimedia.org/wiki/Special:FilePath/Antoine%20Griezmann%202018.jpg?width=180",
        description: "前線と中盤の間で受け、守備にも戻りながらラストパスを出せる。フランスの攻守の接着剤として効く。"
      },
      {
        player_id: "fra_william_saliba",
        name_ja: "ウィリアン・サリバ",
        position: "DF",
        club: "アーセナル",
        image_url: "pics/ウィリアン・サリバ.jpg",
        description: "スピードのある相手にも慌てず、広いスペースを守れるCB。フランスが高いラインを保つ時の安定材料。"
      }
    ],
    ESP: [
      {
        player_id: "esp_rodri",
        name_ja: "ロドリ",
        position: "MF",
        club: "マンチェスター・シティ",
        image_url: "pics/ロドリ.jpg",
        description: "中盤の底で受け、相手のプレス方向を見てテンポを変えられる。スペインの保持が詰まらないための基準点。"
      },
      {
        player_id: "esp_pedri",
        name_ja: "ペドリ",
        position: "MF",
        club: "バルセロナ",
        image_url: "https://commons.wikimedia.org/wiki/Special:FilePath/Pedri%202020.jpg?width=180",
        description: "狭いライン間で受け、ワンタッチで守備の向きを変えられる。相手を走らせるスペインらしい崩しの中心。"
      },
      {
        player_id: "esp_lamine_yamal",
        name_ja: "ラミン・ヤマル",
        position: "FW",
        club: "バルセロナ",
        image_url: "pics/ラミン・ヤマル.jpg",
        description: "右サイドで縦にも内側にも行ける左利き。早い時間から1対1で優位を作ると、相手の守備計画を崩せる。"
      }
    ],
    ARG: [
      {
        player_id: "arg_lionel_messi",
        name_ja: "リオネル・メッシ",
        position: "FW / MF",
        club: "インテル・マイアミ",
        image_url: "pics/リオネル・メッシ.jpg",
        description: "歩きながら守備の隙間を探し、受けた瞬間に決定的なパスやシュートへ移れる。出場時間と状態そのものが見どころ。"
      },
      {
        player_id: "arg_lautaro_martinez",
        name_ja: "ラウタロ・マルティネス",
        position: "FW",
        club: "インテル",
        image_url: "https://commons.wikimedia.org/wiki/Special:FilePath/Lautaro%20Mart%C3%ADnez%202018.jpg?width=180",
        description: "DFの間で駆け引きし、少ないスペースでもシュートを打ち切れる。メッシの周囲で最後に仕上げる役割。"
      },
      {
        player_id: "arg_alexis_mac_allister",
        name_ja: "アレクシス・マック・アリスター",
        position: "MF",
        club: "リバプール",
        image_url: "https://commons.wikimedia.org/wiki/Special:FilePath/Alexis%20Mac%20Allister%202022.jpg?width=180",
        description: "中盤で受け直しながら前進ルートを作り、守備でも位置を埋められる。アルゼンチンの試合管理を支える。"
      }
    ],
    ENG: [
      {
        player_id: "eng_jude_bellingham",
        name_ja: "ジュード・ベリンガム",
        position: "MF",
        club: "レアル・マドリード",
        image_url: "https://commons.wikimedia.org/wiki/Special:FilePath/Jude%20Bellingham%202020.jpg?width=180",
        description: "中盤からゴール前まで一気に入れる万能型。相手の守備ラインと中盤の間で受けると、攻撃の方向を変えられる。"
      },
      {
        player_id: "eng_phil_foden",
        name_ja: "フィル・フォーデン",
        position: "MF / FW",
        club: "マンチェスター・シティ",
        image_url: "pics/フィル・フォーデン.jpg",
        description: "狭い場所でターンし、左足でラストパスとシュートを選べる。右でも中央でも、守備者の視野から消える動きが怖い。"
      },
      {
        player_id: "eng_harry_kane",
        name_ja: "ハリー・ケイン",
        position: "FW",
        club: "バイエルン",
        image_url: "pics/ハリー・ケイン.jpg",
        description: "下がって受けるパス能力と、ゴール前の決定力を両立するCF。2列目を走らせる起点としても機能する。"
      }
    ],
    POR: [
      {
        player_id: "por_bruno_fernandes",
        name_ja: "ブルーノ・フェルナンデス",
        position: "MF",
        club: "マンチェスター・ユナイテッド",
        image_url: "https://commons.wikimedia.org/wiki/Special:FilePath/Bruno%20Fernandes%202018.jpg?width=180",
        description: "縦パス、クロス、ミドルを早い判断で選べる。ポルトガルが詰まった時に、リスクを取って局面を動かす選手。"
      },
      {
        player_id: "por_bernardo_silva",
        name_ja: "ベルナルド・シウバ",
        position: "MF / WG",
        club: "マンチェスター・シティ",
        image_url: "pics/ベルナルド・シウバ.jfif",
        description: "右サイドや中央でボールを失わず、相手を引きつけて味方を空けられる。保持の安定と崩しを同時に担う。"
      },
      {
        player_id: "por_rafael_leao",
        name_ja: "ラファエル・レオン",
        position: "FW",
        club: "ミラン",
        image_url: "https://commons.wikimedia.org/wiki/Special:FilePath/Rafael%20Le%C3%A3o%202022.jpg?width=180",
        description: "左サイドで長いストライドから一気に加速する。守備が整う前に運ばれると、ファウル以外で止めにくい。"
      }
    ],
    GER: [
      {
        player_id: "ger_jamal_musiala",
        name_ja: "ジャマル・ムシアラ",
        position: "MF / FW",
        club: "バイエルン",
        image_url: "pics/ジャマル・ムシアラ.webp",
        description: "細かいタッチで密集を抜け、ゴール前で最後の一手を作れる。守備者が飛び込めない距離感で違いを出す。"
      },
      {
        player_id: "ger_florian_wirtz",
        name_ja: "フロリアン・ヴィルツ",
        position: "MF",
        club: "レバークーゼン",
        image_url: "https://commons.wikimedia.org/wiki/Special:FilePath/Florian%20Wirtz%202020.jpg?width=180",
        description: "ライン間で受け、ワンタッチの落としやスルーパスで守備の形を崩せる。ドイツの攻撃に流動性を足す存在。"
      },
      {
        player_id: "ger_joshua_kimmich",
        name_ja: "ヨシュア・キミッヒ",
        position: "MF / DF",
        club: "バイエルン",
        image_url: "https://commons.wikimedia.org/wiki/Special:FilePath/Joshua%20Kimmich%202018.jpg?width=180",
        description: "中盤でも右サイドでも試合の配置を整えられる。セットプレーのキックと、守備への戻り方も見どころ。"
      }
    ],
    BEL: [
      {
        player_id: "bel_kevin_de_bruyne",
        name_ja: "ケヴィン・デ・ブライネ",
        position: "MF",
        club: "ナポリ",
        image_url: "https://commons.wikimedia.org/wiki/Special:FilePath/Kevin%20De%20Bruyne%202018.jpg?width=180",
        description: "少し空いた瞬間に斜めのラストパスやクロスで決定機を作れる。ベルギーが押し込めない時間でも一発を持つ。"
      },
      {
        player_id: "bel_jeremy_doku",
        name_ja: "ジェレミー・ドク",
        position: "FW",
        club: "マンチェスター・シティ",
        image_url: "pics/ジェレミー・ドク.jpg",
        description: "タッチ数を増やしながら相手の重心を動かし、縦突破で深い位置を取れる。守備を横に広げる役割が大きい。"
      },
      {
        player_id: "bel_romelu_lukaku",
        name_ja: "ロメル・ルカク",
        position: "FW",
        club: "ナポリ",
        image_url: "https://commons.wikimedia.org/wiki/Special:FilePath/Romelu%20Lukaku%202018.jpg?width=180",
        description: "身体を預けてボールを収め、ゴール前では一気にフィニッシュへ持ち込む。クロスが増える展開で存在感が出る。"
      }
    ],
    MEX: [
      keyPlayer("mex_santiago_gimenez", "サンティアゴ・ヒメネス", "Santiago Gimenez", "FW", "ミラン", "https://commons.wikimedia.org/wiki/Special:FilePath/Santiago%20Gimenez%202023.jpg?width=320", "Wikimedia Commons", "左足のフィニッシュとゴール前の動き直しが武器のストライカー。メキシコが押し込む展開で、クロスやこぼれ球を得点に変えられるかに注目。")
    ],
    RSA: [
      keyPlayer("rsa_percy_tau", "パーシー・タウ", "Percy Tau", "FW / WG", "カタールSC", "https://commons.wikimedia.org/wiki/Special:FilePath/Percy%20Tau%202019.jpg?width=320", "Wikimedia Commons", "左利きのアタッカーで、狭い位置からでもターンして前を向ける。南アフリカがカウンターに出る時の最初の受け手になりやすい。")
    ],
    KOR: [
      keyPlayer("kor_son_heung_min", "ソン・フンミン", "Son Heung-min", "FW / WG", "トッテナム", "https://commons.wikimedia.org/wiki/Special:FilePath/Son%20Heung-min%202018.jpg?width=320", "Wikimedia Commons", "背後へのスプリントと左右両足の決定力で試合を変えられる。韓国が低い位置から一気に出る時、最も警戒される出口。"),
      keyPlayer("kor_kim_min_jae", "キム・ミンジェ", "Kim Min-jae", "DF", "バイエルン", "https://commons.wikimedia.org/wiki/Special:FilePath/Kim%20Min-jae%202019.jpg?width=320", "Wikimedia Commons", "対人守備と広いカバー範囲を持つCB。高いラインを保つ時も、低く守る時も韓国の守備基準になる。")
    ],
    CZE: [
      keyPlayer("cze_patrik_schick", "パトリック・シック", "Patrik Schick", "FW", "レバークーゼン", "https://commons.wikimedia.org/wiki/Special:FilePath/Patrik%20Schick%202018.jpg?width=320", "Wikimedia Commons", "長身ながら足元も柔らかく、ワンタッチでシュートへ持ち込めるCF。チェコのクロスとセットプレーの終着点になる。")
    ],
    CAN: [
      keyPlayer("can_alphonso_davies", "アルフォンソ・デイヴィス", "Alphonso Davies", "DF / WG", "バイエルン", "https://commons.wikimedia.org/wiki/Special:FilePath/Alphonso%20Davies%202018.jpg?width=320", "Wikimedia Commons", "左サイドを一気に運べる爆発的なスピードが最大の武器。守備から攻撃へ切り替わった瞬間に、相手の陣形を大きく押し下げる。"),
      keyPlayer("can_jonathan_david", "ジョナサン・デイヴィッド", "Jonathan David", "FW", "ユヴェントス", "https://commons.wikimedia.org/wiki/Special:FilePath/Jonathan%20David%202019.jpg?width=320", "Wikimedia Commons", "DFの間で受け直し、少ないタッチでシュートまで行けるFW。カナダが前進した後の仕上げ役として重要。")
    ],
    SUI: [
      keyPlayer("sui_granit_xhaka", "グラニト・ジャカ", "Granit Xhaka", "MF", "サンダーランド", "https://commons.wikimedia.org/wiki/Special:FilePath/Granit%20Xhaka%202018.jpg?width=320", "Wikimedia Commons", "中盤の底からテンポを作り、長短のパスで前進方向を決める。スイスが試合を落ち着かせる時の中心。")
    ],
    QAT: [
      keyPlayer("qat_akram_afif", "アクラム・アフィフ", "Akram Afif", "FW / WG", "アル・サッド", "https://commons.wikimedia.org/wiki/Special:FilePath/Akram%20Afif%202019.jpg?width=320", "Wikimedia Commons", "左サイドや中央で受け、ドリブルとラストパスで違いを作る。カタールが少ない好機を形にする時の最重要選手。")
    ],
    BIH: [
      keyPlayer("bih_edin_dzeko", "エディン・ジェコ", "Edin Dzeko", "FW", "フィオレンティーナ", "https://commons.wikimedia.org/wiki/Special:FilePath/Edin%20D%C5%BEeko%202018.jpg?width=320", "Wikimedia Commons", "ポストプレーとゴール前の駆け引きに優れるベテランCF。攻撃が詰まった時も、前線で時間を作れる存在。")
    ],
    USA: [
      keyPlayer("usa_christian_pulisic", "クリスチャン・プリシッチ", "Christian Pulisic", "FW / WG", "ミラン", "https://commons.wikimedia.org/wiki/Special:FilePath/Christian%20Pulisic%202019.jpg?width=320", "Wikimedia Commons", "左サイドから内側へ入り、ドリブルとシュートで局面を動かす開催国の攻撃の顔。相手のSBを押し下げる力がある。"),
      keyPlayer("usa_weston_mckennie", "ウェストン・マッケニー", "Weston McKennie", "MF", "ユヴェントス", "https://commons.wikimedia.org/wiki/Special:FilePath/Weston%20McKennie%202019.jpg?width=320", "Wikimedia Commons", "運動量とゴール前への飛び込みで中盤に厚みを出す。セカンドボールやクロス対応で流れを変えられる。")
    ],
    PAR: [
      keyPlayer("par_miguel_almiron", "ミゲル・アルミロン", "Miguel Almiron", "MF / WG", "アトランタ・ユナイテッド", "https://commons.wikimedia.org/wiki/Special:FilePath/Miguel%20Almir%C3%B3n%202018.jpg?width=320", "Wikimedia Commons", "左足で運びながらスピードを落とさず前進できる。パラグアイが守備から抜け出す時、カウンターの推進役になる。")
    ],
    AUS: [
      keyPlayer("aus_mitchell_duke", "ミッチェル・デューク", "Mitchell Duke", "FW", "町田ゼルビア", "https://commons.wikimedia.org/wiki/Special:FilePath/Mitchell%20Duke%202018.jpg?width=320", "Wikimedia Commons", "空中戦と前線での競り合いで攻撃の起点を作るFW。ロングボールを収め、2列目を押し上げる役割が大きい。")
    ],
    TUR: [
      keyPlayer("tur_hakan_calhanoglu", "ハカン・チャルハノール", "Hakan Calhanoglu", "MF", "インテル", "https://commons.wikimedia.org/wiki/Special:FilePath/Hakan%20%C3%87alhano%C4%9Flu%202018.jpg?width=320", "Wikimedia Commons", "中盤の底から縦パスとセットプレーで違いを作る。トルコが保持する展開では、攻撃のテンポを決める存在。"),
      keyPlayer("tur_arda_guler", "アルダ・ギュレル", "Arda Guler", "MF / WG", "レアル・マドリード", "https://commons.wikimedia.org/wiki/Special:FilePath/Arda%20G%C3%BCler%202023.jpg?width=320", "Wikimedia Commons", "左足のタッチとラストパスで狭い局面を開けられる若い創造役。途中出場でも試合のリズムを変えられる。")
    ],
    CUW: [
      keyPlayer("cuw_jurien_gaari", "ユリエン・ガーリ", "Jurien Gaari", "DF", "RKCワールワイク", "https://commons.wikimedia.org/wiki/Special:FilePath/Jurien%20Gaari%202018.jpg?width=320", "Wikimedia Commons", "最終ラインで身体を張り、空中戦やクロス対応で守備を支える。格上相手に耐える時間が長い時のキーマン。")
    ],
    CIV: [
      keyPlayer("civ_sebastien_haller", "セバスティアン・アレ", "Sebastien Haller", "FW", "ユトレヒト", "https://commons.wikimedia.org/wiki/Special:FilePath/S%C3%A9bastien%20Haller%202019.jpg?width=320", "Wikimedia Commons", "ペナルティエリア内で身体を使い、クロスやこぼれ球を得点に変えるCF。コートジボワールが押し込んだ時の仕上げ役。"),
      keyPlayer("civ_franck_kessie", "フランク・ケシエ", "Franck Kessie", "MF", "アル・アハリ", "https://commons.wikimedia.org/wiki/Special:FilePath/Franck%20Kessi%C3%A9%202018.jpg?width=320", "Wikimedia Commons", "中盤で球際を制し、前線への押し上げを作るパワフルなMF。PKやミドルでも試合を動かせる。")
    ],
    ECU: [
      keyPlayer("ecu_moises_caicedo", "モイセス・カイセド", "Moises Caicedo", "MF", "チェルシー", "https://commons.wikimedia.org/wiki/Special:FilePath/Mois%C3%A9s%20Caicedo%202023.jpg?width=320", "Wikimedia Commons", "広い範囲をカバーし、奪った後に前進のパスを入れられる中盤の要。エクアドルの強度を支える。"),
      keyPlayer("ecu_piero_hincapie", "ピエロ・インカピエ", "Piero Hincapie", "DF", "アーセナル", "https://commons.wikimedia.org/wiki/Special:FilePath/Piero%20Hincapi%C3%A9%202022.jpg?width=320", "Wikimedia Commons", "左利きのDFで、対人守備と持ち上がりを両立する。高いラインの背後を守る時にも重要。")
    ],
    EGY: [
      keyPlayer("egy_mohamed_salah", "モハメド・サラー", "Mohamed Salah", "FW / WG", "リバプール", "assets/players/egy_mohamed_salah.jpg", "既存ローカル画像", "右サイドから内側へ入り、左足のシュートとラストパスで試合を決められる。エジプトの攻撃は彼の受け方で大きく変わる。")
    ],
    IRN: [
      keyPlayer("irn_mehdi_taremi", "メフディ・タレミ", "Mehdi Taremi", "FW", "オリンピアコス", "https://commons.wikimedia.org/wiki/Special:FilePath/Mehdi%20Taremi%202018.jpg?width=320", "Wikimedia Commons", "DFの背後と足元の両方で受けられるFW。イランが押し込まれた展開でも、少ないチャンスをシュートへ持ち込める。")
    ],
    NZL: [
      keyPlayer("nzl_chris_wood", "クリス・ウッド", "Chris Wood", "FW", "ノッティンガム・フォレスト", "https://commons.wikimedia.org/wiki/Special:FilePath/Chris%20Wood%202018.jpg?width=320", "Wikimedia Commons", "空中戦とゴール前のポジション取りに優れるCF。ニュージーランドのクロスやセットプレーの最大のターゲット。")
    ],
    CPV: [
      keyPlayer("cpv_bebe", "ベベ", "Bebe", "FW / WG", "ラージョ・バジェカーノ", "https://commons.wikimedia.org/wiki/Special:FilePath/Beb%C3%A9%202018.jpg?width=320", "Wikimedia Commons", "強烈なキックと縦への推進力を持つアタッカー。カーボベルデが距離のある位置からでもゴールを狙う時の選択肢。")
    ],
    KSA: [
      keyPlayer("ksa_salem_al_dawsari", "サレム・アル・ドサリ", "Salem Al-Dawsari", "FW / WG", "アル・ヒラル", "https://commons.wikimedia.org/wiki/Special:FilePath/Salem%20Al-Dawsari%202018.jpg?width=320", "Wikimedia Commons", "左サイドからカットインし、ミドルやラストパスで局面を動かす。大舞台での得点経験もあり、流れを変える力がある。")
    ],
    URU: [
      keyPlayer("uru_federico_valverde", "フェデリコ・バルベルデ", "Federico Valverde", "MF", "レアル・マドリード", "assets/players/uru_federico_valverde.jpg", "既存ローカル画像", "中盤から長い距離を走り、守備の戻りとミドルシュートを両立する。ビエルサの強度をピッチ上で体現する選手。"),
      keyPlayer("uru_darwin_nunez", "ダーウィン・ヌニェス", "Darwin Nunez", "FW", "リバプール", "https://commons.wikimedia.org/wiki/Special:FilePath/Darwin%20N%C3%BA%C3%B1ez%202022.jpg?width=320", "Wikimedia Commons", "背後への飛び出しとゴール前の迫力で相手DFを下げる。ウルグアイが縦に速く出る時の主なターゲット。")
    ],
    SEN: [
      keyPlayer("sen_sadio_mane", "サディオ・マネ", "Sadio Mane", "FW / WG", "アル・ナスル", "https://commons.wikimedia.org/wiki/Special:FilePath/Sadio%20Man%C3%A9%202018.jpg?width=320", "Wikimedia Commons", "スピードとゴール前の嗅覚を備えるセネガルの象徴。左サイドから中央へ入る動きで守備の視線をずらす。")
    ],
    NOR: [
      keyPlayer("nor_erling_haaland", "アーリング・ハーランド", "Erling Haaland", "FW", "マンチェスター・シティ", "assets/players/nor_erling_haaland.jpg", "既存ローカル画像", "背後への加速とボックス内の決定力が突出するストライカー。ノルウェーは彼へ良い形で届けられるかが得点力を左右する。"),
      keyPlayer("nor_martin_odegaard", "マルティン・ウーデゴール", "Martin Odegaard", "MF", "アーセナル", "https://commons.wikimedia.org/wiki/Special:FilePath/Martin%20Odegaard%202018.jpg?width=320", "Wikimedia Commons", "右ハーフスペースで受け、左足のパスでテンポを作る司令塔。ハーランドへのラストパスの質にも注目。")
    ],
    IRQ: [
      keyPlayer("irq_ali_al_hamadi", "アリ・アル・ハマディ", "Ali Al-Hamadi", "FW", "イプスウィッチ", "https://commons.wikimedia.org/wiki/Special:FilePath/Ali%20Al-Hamadi%202024.jpg?width=320", "Wikimedia Commons", "前線で身体を張りながら背後も狙えるFW。イラクが押し込まれた時に、カウンターの出口になれる。")
    ],
    ALG: [
      keyPlayer("alg_riyad_mahrez", "リヤド・マフレズ", "Riyad Mahrez", "FW / WG", "アル・アハリ", "https://commons.wikimedia.org/wiki/Special:FilePath/Riyad%20Mahrez%202018.jpg?width=320", "Wikimedia Commons", "右サイドで間を作り、左足のクロスやシュートで守備を崩せる。アルジェリアの攻撃に落ち着きと創造性を与える。")
    ],
    AUT: [
      keyPlayer("aut_david_alaba", "ダヴィド・アラバ", "David Alaba", "DF / MF", "レアル・マドリード", "https://commons.wikimedia.org/wiki/Special:FilePath/David%20Alaba%202018.jpg?width=320", "Wikimedia Commons", "最終ラインと中盤の両方でプレーできるリーダー。コンディション次第だが、出場時はビルドアップと守備統率の質を上げる。"),
      keyPlayer("aut_marcel_sabitzer", "マルセル・ザビッツァー", "Marcel Sabitzer", "MF", "ドルトムント", "https://commons.wikimedia.org/wiki/Special:FilePath/Marcel%20Sabitzer%202018.jpg?width=320", "Wikimedia Commons", "中盤からゴール前へ入り、ミドルやラストパスで攻撃に厚みを出す。ラングニックの縦に速い攻撃で重要な役割を担う。")
    ],
    JOR: [
      keyPlayer("jor_mousa_al_tamari", "ムーサ・アル・ターマリ", "Mousa Al-Taamari", "FW / WG", "モンペリエ", "https://commons.wikimedia.org/wiki/Special:FilePath/Mousa%20Al-Taamari%202019.jpg?width=320", "Wikimedia Commons", "右サイドから縦にも内側にも仕掛けられるヨルダンの主力。守備から攻撃へ移る時に、単独で運べる貴重な存在。")
    ],
    UZB: [
      keyPlayer("uzb_eldor_shomurodov", "エルドル・ショムロドフ", "Eldor Shomurodov", "FW", "ローマ", "https://commons.wikimedia.org/wiki/Special:FilePath/Eldor%20Shomurodov%202018.jpg?width=320", "Wikimedia Commons", "前線で収めて味方を押し上げるウズベキスタンの柱。クロスやカウンターの場面でゴール前に入るタイミングが重要。")
    ],
    COL: [
      keyPlayer("col_luis_diaz", "ルイス・ディアス", "Luis Diaz", "FW / WG", "バイエルン", "assets/players/col_luis_diaz.jpg", "既存ローカル画像", "左サイドで加速して縦にも内側にも行ける。コロンビアが停滞した時でも、1対1から決定機を作れる選手。"),
      keyPlayer("col_james_rodriguez", "ハメス・ロドリゲス", "James Rodriguez", "MF", "レオン", "https://commons.wikimedia.org/wiki/Special:FilePath/James%20Rodr%C3%ADguez%202018.jpg?width=320", "Wikimedia Commons", "左足のラストパスとセットプレーで試合を動かす司令塔。テンポを落として相手を引きつける場面で効く。")
    ],
    COD: [
      keyPlayer("cod_yoane_wissa", "ヨアン・ウィサ", "Yoane Wissa", "FW", "ニューカッスル", "https://commons.wikimedia.org/wiki/Special:FilePath/Yoane%20Wissa%202021.jpg?width=320", "Wikimedia Commons", "前線で斜めに走り、少ないタッチでシュートまで行ける。DRコンゴが速く前進する時のフィニッシュ役。")
    ],
    CRO: [
      keyPlayer("cro_luka_modric", "ルカ・モドリッチ", "Luka Modric", "MF", "ミラン", "https://commons.wikimedia.org/wiki/Special:FilePath/Luka%20Modri%C4%87%202018.jpg?width=320", "Wikimedia Commons", "中盤で受け直しながら試合のテンポを整えるベテラン。短いパスと外への展開で相手の守備を動かす。"),
      keyPlayer("cro_josko_gvardiol", "ヨシュコ・グヴァルディオル", "Josko Gvardiol", "DF", "マンチェスター・シティ", "assets/players/cro_josko_gvardiol.jpg", "既存ローカル画像", "左サイドとCBをこなし、対人守備と持ち上がりを両立する。クロアチアが高い位置を取る時の支えになる。")
    ],
    GHA: [
      keyPlayer("gha_mohammed_kudus", "モハメド・クドゥス", "Mohammed Kudus", "MF / FW", "トッテナム", "https://commons.wikimedia.org/wiki/Special:FilePath/Mohammed%20Kudus%202022.jpg?width=320", "Wikimedia Commons", "中央でもサイドでも受けられ、強いドリブルで相手を剥がせる。ガーナが個で前進したい場面の中心。")
    ],
    PAN: [
      keyPlayer("pan_adalberto_carrasquilla", "アダルベルト・カラスキージャ", "Adalberto Carrasquilla", "MF", "UNAMプーマス", "https://commons.wikimedia.org/wiki/Special:FilePath/Adalberto%20Carrasquilla%202018.jpg?width=320", "Wikimedia Commons", "中盤で受けてターンし、前線への縦パスで攻撃の方向を作る。パナマが守備から抜ける時のリズムメーカー。")
    ]
  };

  function keyPlayer(player_id, name_ja, name_en, position, club, image_url, image_source_name, description) {
    const isLocal = image_url.startsWith("pics/") || image_url.startsWith("assets/");
    return {
      player_id,
      name_ja,
      name_en,
      position,
      club,
      image_url,
      image_source_url: isLocal ? image_url : image_url.replace(/\?width=\d+$/, ""),
      image_source_name,
      description
    };
  }

  const localKeyPlayerImages = {
    jpn_kubo_takefusa: "assets/players/jpn_kubo_takefusa.jpg",
    jpn_endo_wataru: "assets/players/jpn_endo_wataru.jpg",
    jpn_doan_ritsu: "assets/players/jpn_doan_ritsu.jpg",
    ned_van_dijk: "assets/players/ned_van_dijk.jpg",
    ned_frenkie_de_jong: "assets/players/ned_frenkie_de_jong.jpg",
    ned_xavi_simons: "assets/players/ned_xavi_simons.jpg",
    tun_ellyes_skhiri: "assets/players/tun_ellyes_skhiri.jpg",
    tun_hannibal_mejbri: "assets/players/tun_hannibal_mejbri.jpg",
    tun_hamza_rafia: "assets/players/tun_hamza_rafia.jpg",
    swe_alexander_isak: "assets/players/swe_alexander_isak.jpg",
    swe_dejan_kulusevski: "assets/players/swe_dejan_kulusevski.jpg",
    swe_viktor_gyokeres: "assets/players/swe_viktor_gyokeres.jpg",
    bra_vinicius_junior: "assets/players/bra_vinicius_junior.jpg",
    bra_rodrygo: "assets/players/bra_rodrygo.jpg",
    bra_bruno_guimaraes: "assets/players/bra_bruno_guimaraes.jpg",
    mar_achraf_hakimi: "assets/players/mar_achraf_hakimi.jpg",
    mar_yassine_bounou: "assets/players/mar_yassine_bounou.jpg",
    mar_sofyan_amrabat: "assets/players/mar_sofyan_amrabat.jpg",
    hai_duckens_nazon: "assets/players/hai_duckens_nazon.jpg",
    hai_frantzdy_pierrot: "assets/players/hai_frantzdy_pierrot.jpg",
    hai_jean_ricner_bellegarde: "assets/players/hai_jean_ricner_bellegarde.jpg",
    sco_scott_mctominay: "assets/players/sco_scott_mctominay.jpg",
    sco_andy_robertson: "assets/players/sco_andy_robertson.jpg",
    sco_john_mcginn: "assets/players/sco_john_mcginn.jpg",
    fra_kylian_mbappe: "assets/players/fra_kylian_mbappe.jpg",
    fra_antoine_griezmann: "assets/players/fra_antoine_griezmann.jpg",
    fra_william_saliba: "assets/players/fra_william_saliba.jpg",
    esp_rodri: "assets/players/esp_rodri.jpg",
    esp_pedri: "assets/players/esp_pedri.jpg",
    esp_lamine_yamal: "assets/players/esp_lamine_yamal.jpg",
    arg_lionel_messi: "assets/players/arg_lionel_messi.jpg",
    arg_lautaro_martinez: "assets/players/arg_lautaro_martinez.jpg",
    eng_phil_foden: "assets/players/eng_phil_foden.jpg",
    eng_harry_kane: "assets/players/eng_harry_kane.jpg",
    por_bruno_fernandes: "assets/players/por_bruno_fernandes.jpg",
    por_bernardo_silva: "assets/players/por_bernardo_silva.jfif",
    ger_jamal_musiala: "assets/players/ger_jamal_musiala.webp",
    bel_kevin_de_bruyne: "assets/players/bel_kevin_de_bruyne.jpg",
    bel_jeremy_doku: "assets/players/bel_jeremy_doku.jpg",
    bel_romelu_lukaku: "assets/players/bel_romelu_lukaku.jpg"
  };

  const keyPlayerExternalImages = {
    arg_alexis_mac_allister: "https://commons.wikimedia.org/wiki/Special:FilePath/Alexis%20Mac%20Allister%202022.jpg?width=320",
    eng_jude_bellingham: "https://commons.wikimedia.org/wiki/Special:FilePath/Jude%20Bellingham%20WC2022.jpg?width=320",
    por_rafael_leao: "https://commons.wikimedia.org/wiki/Special:FilePath/20231107%20110839%20Leao.jpg?width=320",
    ger_florian_wirtz: "https://commons.wikimedia.org/wiki/Special:FilePath/Florian%20Wirtz%2004012026%20%283%29.jpg?width=320",
    ger_joshua_kimmich: "https://commons.wikimedia.org/wiki/Special:FilePath/2015-05-01%20Joshua%20Kimmich.jpg?width=320"
  };

  const keyPlayerImageSources = {
    jpn_kubo_takefusa: ["pics/久保建英.jpg", "既存ローカル画像"],
    jpn_endo_wataru: ["pics/遠藤航.jpg", "既存ローカル画像"],
    jpn_doan_ritsu: ["pics/堂安律.jpg", "既存ローカル画像"],
    ned_van_dijk: ["pics/フィルジル・ファン・ダイク.jpg", "既存ローカル画像"],
    ned_frenkie_de_jong: ["https://en.wikipedia.org/wiki/Frenkie_de_Jong", "Wikipedia / Wikimedia Commons"],
    ned_xavi_simons: ["https://en.wikipedia.org/wiki/Xavi_Simons", "Wikipedia / Wikimedia Commons"],
    tun_ellyes_skhiri: ["https://en.wikipedia.org/wiki/Ellyes_Skhiri", "Wikipedia / Wikimedia Commons"],
    tun_hannibal_mejbri: ["https://en.wikipedia.org/wiki/Hannibal_Mejbri", "Wikipedia / Wikimedia Commons"],
    tun_hamza_rafia: ["https://commons.wikimedia.org/wiki/File:Hamza_Rafia_(cropped).jpg", "Wikimedia Commons"],
    swe_alexander_isak: ["https://commons.wikimedia.org/wiki/File:UEFA_EURO_qualifiers_Sweden_vs_Spain_20191015_Alexander_Isak_3.jpg", "Wikimedia Commons"],
    swe_dejan_kulusevski: ["https://en.wikipedia.org/wiki/Dejan_Kulusevski", "Wikipedia / Wikimedia Commons"],
    swe_viktor_gyokeres: ["https://commons.wikimedia.org/wiki/Category:Viktor_Gy%C3%B6keres", "Wikimedia Commons"],
    bra_vinicius_junior: ["pics/ヴィニシウス・ジュニオール.jpg", "既存ローカル画像"],
    bra_rodrygo: ["https://commons.wikimedia.org/wiki/File:RodrygoGoes.jpg", "Wikimedia Commons"],
    bra_bruno_guimaraes: ["https://commons.wikimedia.org/wiki/Category:Bruno_Guimar%C3%A3es", "Wikimedia Commons"],
    mar_achraf_hakimi: ["pics/アクラフ・ハキミ.jpg", "既存ローカル画像"],
    mar_yassine_bounou: ["https://commons.wikimedia.org/wiki/File:Yassine_Bounou.jpg", "Wikimedia Commons"],
    mar_sofyan_amrabat: ["https://commons.wikimedia.org/wiki/File:Sofyan_Amrabat_vs_Niger_(cropped).jpg", "Wikimedia Commons"],
    hai_duckens_nazon: ["https://commons.wikimedia.org/wiki/Category:Duckens_Nazon", "Wikimedia Commons"],
    hai_frantzdy_pierrot: ["https://www.frantzdypierrot.com/", "Frantzdy Pierrot official site"],
    hai_jean_ricner_bellegarde: ["https://en.wikipedia.org/wiki/Jean-Ricner_Bellegarde", "Wikipedia / Wikimedia Commons"],
    sco_scott_mctominay: ["https://commons.wikimedia.org/wiki/File:Scott_McTominay_2021.jpg", "Wikimedia Commons"],
    sco_andy_robertson: ["pics/アンドリュー・ロバートソン.jpg", "既存ローカル画像"],
    sco_john_mcginn: ["https://en.wikipedia.org/wiki/John_McGinn", "Wikipedia / Wikimedia Commons"],
    fra_kylian_mbappe: ["https://en.wikipedia.org/wiki/Kylian_Mbapp%C3%A9", "Wikipedia / Wikimedia Commons"],
    fra_antoine_griezmann: ["https://en.wikipedia.org/wiki/Antoine_Griezmann", "Wikipedia / Wikimedia Commons"],
    fra_william_saliba: ["pics/ウィリアン・サリバ.jpg", "既存ローカル画像"],
    esp_rodri: ["pics/ロドリ.jpg", "既存ローカル画像"],
    esp_pedri: ["https://commons.wikimedia.org/wiki/Category:Pedri", "Wikimedia Commons"],
    esp_lamine_yamal: ["pics/ラミン・ヤマル.jpg", "既存ローカル画像"],
    arg_lionel_messi: ["pics/リオネル・メッシ.jpg", "既存ローカル画像"],
    arg_lautaro_martinez: ["https://commons.wikimedia.org/wiki/File:Lautaro_Mart%C3%ADnez_2017.jpg", "Wikimedia Commons"],
    arg_alexis_mac_allister: ["https://commons.wikimedia.org/wiki/File:Alexis_Mac_Allister_2022.jpg", "Wikimedia Commons"],
    eng_jude_bellingham: ["https://commons.wikimedia.org/wiki/File:Jude_Bellingham_WC2022.jpg", "Wikimedia Commons"],
    eng_phil_foden: ["pics/フィル・フォーデン.jpg", "既存ローカル画像"],
    eng_harry_kane: ["pics/ハリー・ケイン.jpg", "既存ローカル画像"],
    por_bruno_fernandes: ["https://commons.wikimedia.org/wiki/File:Bruno_Fernandes_2018.jpg", "Wikimedia Commons"],
    por_bernardo_silva: ["pics/ベルナルド・シウバ.jfif", "既存ローカル画像"],
    por_rafael_leao: ["https://commons.wikimedia.org/wiki/Category:Rafael_Le%C3%A3o", "Wikimedia Commons"],
    ger_jamal_musiala: ["pics/ジャマル・ムシアラ.webp", "既存ローカル画像"],
    ger_florian_wirtz: ["https://commons.wikimedia.org/wiki/File:Florian_Wirtz_04012026_(3).jpg", "Wikimedia Commons"],
    ger_joshua_kimmich: ["https://commons.wikimedia.org/wiki/File:2015-05-01_Joshua_Kimmich.jpg", "Wikimedia Commons"],
    bel_kevin_de_bruyne: ["https://commons.wikimedia.org/wiki/File:Kevin_de_Bruyne_(36243870980).jpg", "Wikimedia Commons"],
    bel_jeremy_doku: ["pics/ジェレミー・ドク.jpg", "既存ローカル画像"],
    bel_romelu_lukaku: ["https://commons.wikimedia.org/wiki/File:Romelu_Lukaku_2021.jpg", "Wikimedia Commons"]
  };

  const localManagerImages = {
    arg_lionel_scaloni: "assets/managers/arg_lionel_scaloni.jpg",
    bra_carlo_ancelotti: "assets/managers/bra_carlo_ancelotti.jpg",
    cuw_dick_advocaat: "assets/managers/cuw_dick_advocaat.jpg",
    fra_didier_deschamps: "assets/managers/fra_didier_deschamps.jpg",
    jpn_hajime_moriyasu: "assets/managers/jpn_hajime_moriyasu.jpg",
    kor_hong_myung_bo: "assets/managers/kor_hong_myung_bo.jpg",
    qat_julen_lopetegui: "assets/managers/qat_julen_lopetegui.jpg",
    sui_murat_yakin: "assets/managers/sui_murat_yakin.jpg"
  };

  const countryManagers = {
    MEX: manager("mex_javier_aguirre", "ハビエル・アギーレ", "Javier Aguirre", "メキシコ", "2024", "自国開催大会へ向けて再登板した経験豊富な監督。守備の規律と試合中の現実的な修正を重視する。", "中盤の強度とサイドの推進力を使い、相手に合わせてテンポを調整する。", "https://en.wikipedia.org/wiki/Javier_Aguirre", "Wikipedia / Wikimedia Commons"),
    RSA: manager("rsa_hugo_broos", "ヒューゴ・ブロース", "Hugo Broos", "ベルギー", "2021", "経験豊富なベルギー人監督。南アフリカ代表では若い選手を使いながら粘り強いチームを作っている。", "守備ブロックを整え、奪った後は前線のスピードを生かして素早く出る。", "https://en.wikipedia.org/wiki/Hugo_Broos", "Wikipedia / Wikimedia Commons"),
    KOR: manager("kor_hong_myung_bo", "洪明甫", "Hong Myung-bo", "韓国", "2024", "韓国代表のレジェンドDFで、代表監督として再登板。チームの規律と国内外の主力融合が焦点。", "4バックを軸に強度の高い守備と縦に速い攻撃を組み合わせる。", "https://en.wikipedia.org/wiki/Hong_Myung-bo", "Wikipedia / Wikimedia Commons"),
    CZE: manager("cze_ivan_hasek", "イヴァン・ハシェック", "Ivan Hasek", "チェコ", "2024", "チェコ代表を率いる経験豊富な指導者。堅実な守備と欧州的な球際の強さを整理する。", "高さとセットプレー、縦への速さを生かしながら試合を壊さず進める。", "https://en.wikipedia.org/wiki/Ivan_Ha%C5%A1ek", "Wikipedia / Wikimedia Commons"),
    CAN: manager("can_jesse_marsch", "ジェシー・マーシュ", "Jesse Marsch", "アメリカ", "2024", "レッドブル系のプレッシング思想を持つ監督。開催国カナダに強度と前向きな守備を植え付ける。", "前から圧力をかけ、奪った直後に縦へ速く進むトランジション重視。", "https://en.wikipedia.org/wiki/Jesse_Marsch", "Wikipedia / Wikimedia Commons"),
    SUI: manager("sui_murat_yakin", "ムラト・ヤキン", "Murat Yakin", "スイス", "2021", "スイス代表を継続して率いる監督。大会での現実的な試合運びと守備の安定感が特徴。", "3バック/4バックを使い分け、相手の強みに合わせて中央を締める。", "https://en.wikipedia.org/wiki/Murat_Yakin", "Wikipedia / Wikimedia Commons"),
    QAT: manager("qat_julen_lopetegui", "フレン・ロペテギ", "Julen Lopetegui", "スペイン", "2025", "スペイン代表やクラブで経験を積んだ監督。カタール代表では保持と配置の整理がテーマ。", "後方から丁寧に前進し、サイドと中盤の距離感を整えて崩す。", "https://en.wikipedia.org/wiki/Julen_Lopetegui", "Wikipedia / Wikimedia Commons"),
    BIH: manager("bih_sergej_barbarez", "セルゲイ・バルバレス", "Sergej Barbarez", "ボスニア・ヘルツェゴビナ", "2024", "元代表FWで、代表の再建を担う監督。経験ある選手と若手の競争を促す。", "前線の個を生かしつつ、守備時の距離感と切り替えを整える。", "https://en.wikipedia.org/wiki/Sergej_Barbarez", "Wikipedia / Wikimedia Commons"),
    BRA: manager("bra_carlo_ancelotti", "カルロ・アンチェロッティ", "Carlo Ancelotti", "イタリア", "2025", "欧州トップクラブで実績を重ねた名将。ブラジルでは個の自由度と勝負所の管理が注目される。", "前線の個を生かしながら、中盤のバランスと試合終盤の管理を重視する。", "https://en.wikipedia.org/wiki/Carlo_Ancelotti", "Wikipedia / Wikimedia Commons"),
    MAR: manager("mar_walid_regragui", "ワリド・レグラギ", "Walid Regragui", "モロッコ", "2022", "2022年大会でモロッコを躍進させた監督。堅守と一体感を代表チームに落とし込んだ。", "中央を締める守備から、サイドの走力と速い切り替えで前へ出る。", "https://en.wikipedia.org/wiki/Walid_Regragui", "Wikipedia / Wikimedia Commons"),
    HAI: manager("hai_sebastien_migne", "セバスティアン・ミニェ", "Sebastien Migne", "フランス", "2024", "アフリカやカリブ海での代表指導経験を持つ監督。ハイチでは組織力の底上げが役割。", "低い位置で耐えながら、前線の走力を生かすシンプルな前進を狙う。", "https://en.wikipedia.org/wiki/S%C3%A9bastien_Mign%C3%A9", "Wikipedia / Wikimedia Commons"),
    SCO: manager("sco_steve_clarke", "スティーブ・クラーク", "Steve Clarke", "スコットランド", "2019", "長期政権でスコットランドをまとめる監督。守備組織と選手の役割整理に定評がある。", "3バック系を軸に、サイドの運動量とセットプレーで押し込む。", "https://en.wikipedia.org/wiki/Steve_Clarke", "Wikipedia / Wikimedia Commons"),
    USA: manager("usa_mauricio_pochettino", "マウリシオ・ポチェッティーノ", "Mauricio Pochettino", "アルゼンチン", "2024", "欧州クラブで実績を残した監督。開催国アメリカにプレッシングと攻撃的な姿勢を加える。", "前線からの圧力、縦に速い前進、若いタレントの走力を組み合わせる。", "https://en.wikipedia.org/wiki/Mauricio_Pochettino", "Wikipedia / Wikimedia Commons"),
    PAR: manager("par_gustavo_alfaro", "グスタボ・アルファロ", "Gustavo Alfaro", "アルゼンチン", "2024", "南米で経験豊富な監督。パラグアイでは守備の粘りと勝点を拾う現実性が重要。", "コンパクトな守備を作り、セットプレーとカウンターで勝負する。", "https://en.wikipedia.org/wiki/Gustavo_Alfaro", "Wikipedia / Wikimedia Commons"),
    AUS: manager("aus_tony_popovic", "トニー・ポポヴィッチ", "Tony Popovic", "オーストラリア", "2024", "元代表DFで、Aリーグで実績を積んだ監督。強度と守備の整理を重視する。", "フィジカルとクロス対応を土台に、縦への速い攻撃を混ぜる。", "https://en.wikipedia.org/wiki/Tony_Popovic", "Wikipedia / Wikimedia Commons"),
    TUR: manager("tur_vincenzo_montella", "ヴィンチェンツォ・モンテッラ", "Vincenzo Montella", "イタリア", "2023", "トルコ代表を率いるイタリア人監督。若い攻撃的タレントの配置とテンポ作りが見どころ。", "保持で前進しながら、2列目の技術とサイドの幅を生かす。", "https://en.wikipedia.org/wiki/Vincenzo_Montella", "Wikipedia / Wikimedia Commons"),
    GER: manager("ger_julian_nagelsmann", "ユリアン・ナーゲルスマン", "Julian Nagelsmann", "ドイツ", "2023", "若くして欧州トップレベルを経験した監督。ドイツ代表では配置の流動性と攻撃の再構築を進める。", "中盤の立ち位置を変えながら前進し、前線の創造性を引き出す。", "https://en.wikipedia.org/wiki/Julian_Nagelsmann", "Wikipedia / Wikimedia Commons"),
    CUW: manager("cuw_dick_advocaat", "ディック・アドフォカート", "Dick Advocaat", "オランダ", "2024", "多くの代表とクラブを率いたベテラン監督。キュラソーに試合運びの経験を持ち込む。", "守備の約束事を整理し、少ないチャンスを効率よく使う。", "https://en.wikipedia.org/wiki/Dick_Advocaat", "Wikipedia / Wikimedia Commons"),
    CIV: manager("civ_emerse_fae", "エメルス・ファエ", "Emerse Fae", "コートジボワール", "2024", "AFCON優勝で評価を高めた監督。チームの勢いと個の能力を整理して戦う。", "中盤の強度と前線の個を生かし、奪ってから素早くゴールへ向かう。", "https://en.wikipedia.org/wiki/Emerse_Fa%C3%A9", "Wikipedia / Wikimedia Commons"),
    ECU: manager("ecu_sebastian_beccacece", "セバスティアン・ベッカセセ", "Sebastian Beccacece", "アルゼンチン", "2024", "南米で経験を積んだ戦術家。エクアドルの走力と若さを組織に落とし込む。", "強度の高い守備と速い前進を軸に、相手のビルドアップへ圧をかける。", "https://en.wikipedia.org/wiki/Sebasti%C3%A1n_Beccacece", "Wikipedia / Wikimedia Commons"),
    NED: manager("ned_ronald_koeman", "ロナルド・クーマン", "Ronald Koeman", "オランダ", "2023", "オランダ代表を再び率いる名DF出身監督。後方の安定と攻撃的なタレントの共存を図る。", "3バック/4バックを使い分け、後方から丁寧に前進してサイドを使う。", "https://en.wikipedia.org/wiki/Ronald_Koeman", "Wikipedia / Wikimedia Commons"),
    JPN: manager("jpn_hajime_moriyasu", "森保一", "Hajime Moriyasu", "日本", "2018", "日本代表を長期的に率いる監督。守備の安定と状況に応じた可変システムを重視する。", "3バック系と4バック系を使い分け、相手や試合展開に合わせて現実的に戦う。", "https://commons.wikimedia.org/wiki/File:Hajime_Moriyasu_in_Columbus.jpg", "Wikimedia Commons"),
    TUN: manager("tun_sami_trabelsi", "サミ・トラベルシ", "Sami Trabelsi", "チュニジア", "2025", "チュニジア代表を再び率いる元代表DF。守備の粘りと接戦での勝負強さを重視する。", "低いブロックで中央を締め、奪った後は前線へ早くつける。", "https://en.wikipedia.org/wiki/Sami_Trabelsi", "Wikipedia / Wikimedia Commons"),
    SWE: manager("swe_jon_dahl_tomasson", "ヨン・ダール・トマソン", "Jon Dahl Tomasson", "デンマーク", "2024", "デンマーク出身の監督。スウェーデンでは前線のタレントを生かす攻撃再建がテーマ。", "保持と縦への速さを組み合わせ、イサクやクルゼフスキの受け方を整える。", "https://en.wikipedia.org/wiki/Jon_Dahl_Tomasson", "Wikipedia / Wikimedia Commons"),
    BEL: manager("bel_rudi_garcia", "ルディ・ガルシア", "Rudi Garcia", "フランス", "2025", "クラブで豊富な実績を持つ監督。世代交代期のベルギーで攻守のバランスを作る。", "攻撃的な配置を取りつつ、前線の個と中盤の配球を生かす。", "https://en.wikipedia.org/wiki/Rudi_Garcia", "Wikipedia / Wikimedia Commons"),
    EGY: manager("egy_hossam_hassan", "ホッサム・ハッサン", "Hossam Hassan", "エジプト", "2024", "エジプト代表の伝説的FW。代表の気迫と勝負強さを前面に出す。", "サラーら前線の決定力を生かし、守備から速く攻撃へ切り替える。", "https://en.wikipedia.org/wiki/Hossam_Hassan", "Wikipedia / Wikimedia Commons"),
    IRN: manager("irn_amir_ghalenoei", "アミル・ガレノエイ", "Amir Ghalenoei", "イラン", "2023", "イラン国内で実績を積んだ監督。フィジカルと経験値のある代表を堅実にまとめる。", "守備の強度とセットプレーを土台に、前線の個へ早く届ける。", "https://en.wikipedia.org/wiki/Amir_Ghalenoei", "Wikipedia / Wikimedia Commons"),
    NZL: manager("nzl_darren_bazeley", "ダレン・ベイズリー", "Darren Bazeley", "イングランド", "2023", "ニュージーランド代表を率いる監督。若手と海外組を組み合わせてチームを整える。", "守備の規律を保ち、前線の高さと走力でシンプルに前進する。", "https://en.wikipedia.org/wiki/Darren_Bazeley", "Wikipedia / Wikimedia Commons"),
    ESP: manager("esp_luis_de_la_fuente", "ルイス・デ・ラ・フエンテ", "Luis de la Fuente", "スペイン", "2022", "スペインの年代別代表を長く率いた監督。若手の特長を理解し、A代表でも結果を出している。", "保持の配置と即時奪回を重視し、サイドの若い突破力を生かす。", "https://en.wikipedia.org/wiki/Luis_de_la_Fuente", "Wikipedia / Wikimedia Commons"),
    CPV: manager("cpv_bubista", "ブビスタ", "Bubista", "カーボベルデ", "2020", "カーボベルデ代表を継続して率いる監督。限られた戦力を組織化し、粘り強く戦う。", "守備のまとまりを作り、前線のスピードとセットプレーで勝機を探る。", "https://en.wikipedia.org/wiki/Bubista", "Wikipedia / Wikimedia Commons"),
    KSA: manager("ksa_herve_renard", "エルヴェ・ルナール", "Herve Renard", "フランス", "2024", "サウジアラビア代表に復帰した監督。大舞台での経験と選手を鼓舞する力がある。", "コンパクトな守備と速い切り替えを軸に、相手の隙を突く。", "https://en.wikipedia.org/wiki/Herv%C3%A9_Renard", "Wikipedia / Wikimedia Commons"),
    URU: manager("uru_marcelo_bielsa", "マルセロ・ビエルサ", "Marcelo Bielsa", "アルゼンチン", "2023", "攻撃的なプレッシングで知られる名将。ウルグアイの強度に構造を与えている。", "前から激しく奪いに行き、奪った後は縦に速く人数をかける。", "https://en.wikipedia.org/wiki/Marcelo_Bielsa", "Wikipedia / Wikimedia Commons"),
    FRA: manager("fra_didier_deschamps", "ディディエ・デシャン", "Didier Deschamps", "フランス", "2012", "長期政権でフランスを世界トップ級に保つ監督。スター集団を現実的に勝たせる。", "守備の安定を優先しつつ、エムバペら前線の個で一気に仕留める。", "https://en.wikipedia.org/wiki/Didier_Deschamps", "Wikipedia / Wikimedia Commons"),
    SEN: manager("sen_pape_thiaw", "パプ・ティアウ", "Pape Thiaw", "セネガル", "2024", "セネガル代表を率いる元代表FW。身体能力と組織のバランスを整える。", "球際の強さとサイドの推進力を生かし、守備から速く前へ出る。", "https://en.wikipedia.org/wiki/Pape_Thiaw", "Wikipedia / Wikimedia Commons"),
    NOR: manager("nor_stale_solbakken", "ストーレ・ソルバッケン", "Stale Solbakken", "ノルウェー", "2020", "ノルウェー代表を継続して率いる監督。ハーランド、ウーデゴールらの生かし方が焦点。", "前線の決定力へ良い形で届けるため、中盤の前進と守備の距離感を整える。", "https://en.wikipedia.org/wiki/St%C3%A5le_Solbakken", "Wikipedia / Wikimedia Commons"),
    IRQ: manager("irq_graham_arnold", "グラハム・アーノルド", "Graham Arnold", "オーストラリア", "2025", "オーストラリア代表を率いた経験豊富な監督。イラクでは守備組織と勝点を拾う力が問われる。", "強度のある守備から、前線へ素早く届けてセカンドボールを拾う。", "https://en.wikipedia.org/wiki/Graham_Arnold", "Wikipedia / Wikimedia Commons"),
    ARG: manager("arg_lionel_scaloni", "リオネル・スカローニ", "Lionel Scaloni", "アルゼンチン", "2018", "アルゼンチンを世界王者へ導いた監督。スターを生かしながら組織のバランスを崩さない。", "中盤の距離感と前線の自由度を両立し、試合終盤の管理も巧い。", "https://en.wikipedia.org/wiki/Lionel_Scaloni", "Wikipedia / Wikimedia Commons"),
    ALG: manager("alg_vladimir_petkovic", "ウラジミール・ペトコヴィッチ", "Vladimir Petkovic", "スイス", "2024", "スイス代表で実績を残した監督。アルジェリアでは戦術整理と経験値の活用がテーマ。", "守備の配置を整え、前線の個とサイドの突破をバランスよく使う。", "https://en.wikipedia.org/wiki/Vladimir_Petkovi%C4%87", "Wikipedia / Wikimedia Commons"),
    AUT: manager("aut_ralf_rangnick", "ラルフ・ラングニック", "Ralf Rangnick", "ドイツ", "2022", "プレッシング思想で知られる監督。オーストリアに明確な強度と前向きな守備を植え付けた。", "前から奪いに行き、奪った瞬間に縦へ入れるテンポの速いサッカー。", "https://en.wikipedia.org/wiki/Ralf_Rangnick", "Wikipedia / Wikimedia Commons"),
    JOR: manager("jor_jamal_sellami", "ジャマル・セラミ", "Jamal Sellami", "モロッコ", "2024", "モロッコ出身の監督。ヨルダン代表では組織のまとまりと現実的な試合運びが重要。", "守備を整えて接戦に持ち込み、前線の走力とセットプレーで勝機を作る。", "https://en.wikipedia.org/wiki/Jamal_Sellami", "Wikipedia / Wikimedia Commons"),
    POR: manager("por_roberto_martinez", "ロベルト・マルティネス", "Roberto Martinez", "スペイン", "2023", "ベルギー代表でも実績を残した監督。ポルトガルでは豪華な攻撃陣の共存を進める。", "保持で押し込み、ライン間の受け手とサイドの突破を組み合わせる。", "https://en.wikipedia.org/wiki/Roberto_Mart%C3%ADnez", "Wikipedia / Wikimedia Commons"),
    UZB: manager("uzb_fabio_cannavaro", "ファビオ・カンナヴァーロ", "Fabio Cannavaro", "イタリア", "2025", "元イタリア代表DFの名選手。ウズベキスタンでは大会本番へ向けた守備整理が注目。", "守備の距離感を重視し、奪った後は縦に速く前線へ届ける。", "https://en.wikipedia.org/wiki/Fabio_Cannavaro", "Wikipedia / Wikimedia Commons"),
    COL: manager("col_nestor_lorenzo", "ネストル・ロレンソ", "Nestor Lorenzo", "アルゼンチン", "2022", "コロンビア代表を安定させている監督。攻撃の個とチームのバランスを整える。", "中盤の強度を保ち、ディアスらサイドの突破力を生かして前進する。", "https://en.wikipedia.org/wiki/N%C3%A9stor_Lorenzo", "Wikipedia / Wikimedia Commons"),
    COD: manager("cod_sebastien_desabre", "セバスティアン・デサーブル", "Sebastien Desabre", "フランス", "2022", "アフリカ各国で経験を積んだ監督。DRコンゴではフィジカルと組織力の両立を進める。", "守備の粘りと前線のパワーを生かし、セットプレーでも圧力をかける。", "https://en.wikipedia.org/wiki/S%C3%A9bastien_Desabre", "Wikipedia / Wikimedia Commons"),
    ENG: manager("eng_thomas_tuchel", "トーマス・トゥヘル", "Thomas Tuchel", "ドイツ", "2025", "欧州トップクラブで実績を残した監督。イングランドの豊富なタレントに戦術的な整理を加える。", "相手に応じて配置を変え、前線と2列目の個を生かす構造を作る。", "https://en.wikipedia.org/wiki/Thomas_Tuchel", "Wikipedia / Wikimedia Commons"),
    CRO: manager("cro_zlatko_dalic", "ズラトコ・ダリッチ", "Zlatko Dalic", "クロアチア", "2017", "クロアチアを長く率いる監督。大会での勝負強さと中盤の経験値を最大化する。", "中盤の保持と試合管理を重視し、接戦で粘り強く勝機を探る。", "https://en.wikipedia.org/wiki/Zlatko_Dali%C4%87", "Wikipedia / Wikimedia Commons"),
    GHA: manager("gha_otto_addo", "オットー・アッド", "Otto Addo", "ガーナ", "2024", "ガーナ代表に復帰した監督。欧州組と若手の能力を整理してチーム化する。", "前線のスピードと中盤の球際を生かし、縦に速い攻撃を狙う。", "https://en.wikipedia.org/wiki/Otto_Addo", "Wikipedia / Wikimedia Commons"),
    PAN: manager("pan_thomas_christiansen", "トーマス・クリスチャンセン", "Thomas Christiansen", "スペイン", "2020", "パナマ代表を継続して率いる監督。組織的な守備と粘り強い試合運びを作る。", "コンパクトに守り、サイドとセットプレーを使って少ない好機を生かす。", "https://en.wikipedia.org/wiki/Thomas_Christiansen", "Wikipedia / Wikimedia Commons")
  };

  function manager(id, nameJa, nameEn, nationality, appointedAt, description, tacticalNote, sourceUrl, sourceName) {
    return {
      manager_id: id,
      name_ja: nameJa,
      name_en: nameEn,
      nationality,
      appointed_at: appointedAt,
      image_url: localManagerImages[id] || "",
      image_source_url: sourceUrl,
      image_source_name: sourceName,
      manager_checked_at: "2026-05-22",
      manager_source_url: sourceUrl,
      manager_source_name: sourceName,
      description,
      tactical_note: tacticalNote
    };
  }

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
    ["miami", "Miami", "アメリカ", "南東部", "Miami Stadium", "America/New_York", "夏時間: 日本より13時間遅れ", "屋根あり", "暑熱と湿度", "南東端で移動距離は長め", "コンディション差に注目", 730, 455],
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

  const venueAtmosphereNotes = {
    toronto: "都市型の会場で、街のイベント感とスタジアムの近さがほどよく混ざりそう。",
    vancouver: "屋根付きで音がまとまりやすく、雨でも熱気が逃げにくそう。",
    seattle: "観客の声量が出やすい会場で、サッカー専用に近い圧がありそう。",
    "san-francisco": "開放感があり、晴れた日だと西海岸らしい軽さが出そう。",
    "los-angeles": "大規模イベント向きで、演出も含めてかなり盛り上がりそう。",
    guadalajara: "サッカー熱が濃く、観客席からの圧がじわっと来そうな感じ。",
    "mexico-city": "歴史ある大箱なので、試合前から特別感が強そう。",
    monterrey: "山の景色も込みで、会場全体の一体感が出やすそう。",
    houston: "屋根付きで音が響いて、暑さを避けながら熱気が出やすそう。",
    dallas: "巨大スタジアムらしいショー感があり、派手な雰囲気になりそう。",
    "kansas-city": "観客席が近く、圧が強そう。声援の迫力を感じやすそう。",
    atlanta: "屋根付きで音と光の演出が映え、イベント感が強そう。",
    miami: "南国らしい開放感があり、試合前後も明るい雰囲気になりそう。",
    philadelphia: "東海岸らしい熱さと近さがあり、応援の圧が出そう。",
    "new-york-new-jersey": "決勝会場らしい大規模感があり、特別な空気になりそう。",
    boston: "郊外型で広がりがありつつ、観客の熱量はしっかり出そう。"
  };

  const venuePhotoFiles = {
    toronto: "BMO Field exterior, Toronto.JPG",
    vancouver: "BC Place Stadium Vancouver (30853283068).jpg",
    seattle: "Lumen Field @ Seattle (6258750489).jpg",
    "san-francisco": "Levi's Stadium panorama (14659708347).jpg",
    "los-angeles": "SoFi Stadium 2023.jpg",
    guadalajara: "Estadio Akron 02-07-2022 cabecera sur lado derecho.jpg",
    "mexico-city": "Estadio azteca.jpg",
    monterrey: "Mexico Guadalupe Monterrey Estadio BBVA Bancomer fifa world cup 2026 1.JPG",
    houston: "Reliantstadium.jpg",
    dallas: "AT&T Stadium Aerial.jpeg",
    "kansas-city": "Arrowhead Stadium.jpg",
    atlanta: "Mercedes-Benz Stadium, December 2024.jpg",
    miami: "Hard Rock Stadium.jpg",
    philadelphia: "Lincoln Financial Field, Philadelphia.jpg",
    "new-york-new-jersey": "Metlife stadium (Aerial view).jpg",
    boston: "Gillette Stadium Foxboro MA.jpg"
  };

  const state = {
    initialized: false,
    loaded: false,
    loadError: "",
    view: "schedule",
    matches: [],
    teams: {},
    knockoutMapping: {},
    groupFilter: "all",
    countrySearch: "",
    countryGroupFilter: "all",
    countryConfederationFilter: "all",
    countrySort: "group",
    countryScheduleOpenTeamId: "",
    scheduleStatusFilter: "all",
    scheduleFavoriteFilter: "all",
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
      favoriteCalendarButton: document.getElementById("favoriteCalendarButton"),
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
        if (["groups", "thirds", "knockout"].includes(state.view) && state.loaded) {
          autoUpdateSnapshotsIfStale();
        } else {
          renderContent();
        }
      });
    });
    state.elements.favoriteCalendarButton?.addEventListener("click", downloadFavoriteMatchesCalendar);
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
    if (["country-notes", "venues"].includes(active)) renderAuxView(active);
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
      favoriteMatchIds: [],
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
        favoriteMatchIds: normalizeFavoriteMatchIds(parsed?.favoriteMatchIds),
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
    clearTimeout(firebasePersistTimer);
    firebasePersistTimer = setTimeout(() => {
      fetch(`${FIREBASE_TOURNAMENT_URL}.json`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scoreOverrides: state.saved.scoreOverrides || {},
          favoriteMatchIds: state.saved.favoriteMatchIds || [],
          venueNotes: state.saved.venueNotes || {},
          lastUpdatedAt: state.saved.lastUpdatedAt || new Date().toISOString()
        })
      }).catch(() => {});
    }, 500);
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
      const favoriteCount = favoriteMatchIdSet().size;
      summary.textContent = `スコア/日程 / 全${state.matches.length}試合 / お気に入り ${favoriteCount}試合 / スコア保存 ${scoreCount}試合${updated}${shared}`;
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

  function normalizeFavoriteMatchIds(value) {
    if (!Array.isArray(value)) return [];
    return Array.from(new Set(value.map((item) => String(item || "").trim()).filter(Boolean)));
  }

  function favoriteMatchIdSet() {
    state.saved.favoriteMatchIds = normalizeFavoriteMatchIds(state.saved.favoriteMatchIds);
    return new Set(state.saved.favoriteMatchIds);
  }

  function isFavoriteMatch(matchId) {
    return favoriteMatchIdSet().has(String(matchId));
  }

  function toggleFavoriteMatch(matchId) {
    const normalizedId = String(matchId || "").trim();
    if (!normalizedId) return;
    const ids = favoriteMatchIdSet();
    if (ids.has(normalizedId)) {
      ids.delete(normalizedId);
    } else {
      ids.add(normalizedId);
    }
    state.saved.favoriteMatchIds = Array.from(ids).sort((a, b) => matchSortIndex(a) - matchSortIndex(b) || a.localeCompare(b));
    state.saved.lastUpdatedAt = new Date().toISOString();
    persist();
    setSavedLabel(ids.has(normalizedId) ? "お気に入りに追加しました" : "お気に入りを解除しました");
    renderContent();
  }

  function matchSortIndex(matchId) {
    const index = state.matches.findIndex((match) => match.match_id === matchId);
    return index === -1 ? Number.MAX_SAFE_INTEGER : index;
  }

  function favoriteButton(matchId, compact = false) {
    const active = isFavoriteMatch(matchId);
    const button = document.createElement("button");
    button.type = "button";
    button.className = `favorite-button${active ? " active" : ""}${compact ? " compact" : ""}`;
    button.textContent = active ? "★" : "☆";
    button.setAttribute("aria-pressed", active ? "true" : "false");
    button.setAttribute("aria-label", active ? "お気に入りを解除" : "お気に入りに追加");
    button.title = active ? "お気に入りを解除" : "お気に入りに追加";
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      toggleFavoriteMatch(matchId);
    });
    return button;
  }

  function favoriteMatches() {
    const favoriteIds = favoriteMatchIdSet();
    return sortedMatches(computedSchedule().filter((match) => favoriteIds.has(match.match_id)));
  }

  function downloadFavoriteMatchesCalendar() {
    const matches = favoriteMatches().filter((match) => !Number.isNaN(jstDate(match.kickoff_jst).getTime()));
    if (matches.length === 0) {
      setSummary("お気に入り登録済みで日時が入っている試合がありません");
      return;
    }
    const calendarText = buildFavoriteMatchesIcs(matches);
    const blob = new Blob([calendarText], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "worldcup_favorite_matches.ics";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setSummary(`お気に入り${matches.length}試合のカレンダーファイルを出力しました`);
  }

  function buildFavoriteMatchesIcs(matches) {
    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//igrekplus//WorldCup Betting//JA",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "X-WR-CALNAME:W杯2026 お気に入り試合"
    ];
    const stamp = icsDateTime(new Date());
    matches.forEach((match) => {
      const start = jstDate(match.kickoff_jst);
      const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
      const title = `W杯2026: ${displayTeam(matchHomeId(match), match.home_name_ja, { showRank: false })} vs ${displayTeam(matchAwayId(match), match.away_name_ja, { showRank: false })}`;
      const description = [
        match.match_id,
        stageLabels[match.stage] || match.stage,
        match.group ? `Group ${match.group}` : "",
        `日本時間: ${formatJstDateTime(match.kickoff_jst)}`,
        `スコア: ${scoreText(match.match_id)}`,
        "お気に入り登録した試合"
      ].filter(Boolean).join("\n");
      lines.push(
        "BEGIN:VEVENT",
        `UID:${icsEscape(match.match_id)}@worldcup-betting.igrekplus.github.io`,
        `DTSTAMP:${stamp}`,
        `DTSTART:${icsDateTime(start)}`,
        `DTEND:${icsDateTime(end)}`,
        `SUMMARY:${icsEscape(title)}`,
        `DESCRIPTION:${icsEscape(description)}`,
        `LOCATION:${icsEscape(venueText(match))}`,
        "END:VEVENT"
      );
    });
    lines.push("END:VCALENDAR");
    return `${lines.join("\r\n")}\r\n`;
  }

  function icsDateTime(date) {
    return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  }

  function icsEscape(value) {
    return String(value || "")
      .replace(/\\/g, "\\\\")
      .replace(/\n/g, "\\n")
      .replace(/,/g, "\\,")
      .replace(/;/g, "\\;");
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
    }).filter((match) => {
      if (state.scheduleFavoriteFilter === "all") return true;
      return isFavoriteMatch(match.match_id);
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
      createSelectControl("お気に入り", state.scheduleFavoriteFilter, [
        ["all", "全て"],
        ["favorites", "お気に入りのみ"]
      ], (value) => {
        state.scheduleFavoriteFilter = value;
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
    if (isFavoriteMatch(match.match_id)) card.classList.add("favorite-match");

    const body = document.createElement("div");
    body.className = "match-card-body";

    const meta = document.createElement("div");
    meta.className = "match-meta";
    meta.append(
      favoriteButton(match.match_id),
      textDiv(match.match_id, "match-id"),
      textDiv(stageLabels[match.stage] || match.stage, "match-stage"),
      textDiv(match.group ? `Group ${match.group}` : "", "match-group"),
      textDiv(formatJstDateTime(match.kickoff_jst), "match-jst"),
      (() => {
        const wrap = document.createElement("div");
        wrap.className = "match-venue-wrap";
        wrap.append(textDiv(venueText(match), "match-venue"), mapButton(match));
        return wrap;
      })()
    );

    const teams = document.createElement("div");
    teams.className = "match-teams";
    teams.append(
      participantLabel(matchHomeId(match), match.home_name_ja, "match-team", { showRank: false }),
      textDiv(scoreText(match.match_id), "match-score-display"),
      participantLabel(matchAwayId(match), match.away_name_ja, "match-team away", { showRank: false })
    );

    const play = document.createElement("div");
    play.className = "match-play";
    play.append(teams, statusBadge(match.match_id), createScoreEditor(match.match_id, match.stage));

    body.append(meta, play);
    card.append(body);
    return card;
  }

  function mapButton(match) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "utility-button match-map-button";
    button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>';
    button.setAttribute("aria-label", "地図で見る");
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

  function createScoreEditor(matchId, stage = "") {
    const fields = stage === "group"
      ? [["score_home", "H"], ["score_away", "A"]]
      : [["score_home", "H"], ["score_away", "A"], ["penalty_home", "H PK"], ["penalty_away", "A PK"]];
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
    if (isFavoriteMatch(match.match_id)) row.classList.add("favorite-match");
    row.addEventListener("click", () => {
      state.calendarDate = jstDate(match.kickoff_jst);
      state.calendarMode = "day";
      renderContent();
    });
    row.append(
      favoriteButton(match.match_id, true),
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
    if (isFavoriteMatch(match.match_id)) card.classList.add("favorite-match");

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
        favoriteButton(match.match_id),
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
      favoriteButton(match.match_id, true),
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

  function autoUpdateSnapshotsIfStale() {
    const sig = scoreSignature();
    if (!state.saved.standings || state.saved.standings.scoreSignature !== sig) {
      updateTournamentSnapshots();
    } else {
      renderContent();
    }
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
    head.innerHTML = `<tr><th>順位</th>${includeGroup ? "<th>組</th>" : ""}<th data-col="team">チーム</th><th>勝点</th><th data-col="played">試</th><th>勝</th><th>分</th><th>敗</th><th data-col="gf">得</th><th data-col="ga">失</th><th data-col="gd">差</th><th data-col="status">状態</th></tr>`;
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
      teamCell.dataset.col = "team";
      teamCell.appendChild(teamLabel(team.teamId, team.name));
      appendCell(row, team.points);
      appendCell(row, team.played).dataset.col = "played";
      appendCell(row, team.wins);
      appendCell(row, team.draws);
      appendCell(row, team.losses);
      appendCell(row, team.gf).dataset.col = "gf";
      appendCell(row, team.ga).dataset.col = "ga";
      appendCell(row, team.gf - team.ga).dataset.col = "gd";
      appendCell(row, status).dataset.col = "status";
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
    if (view === "venues") renderVenues();
  }

  function renderCountryNotes() {
    const target = document.getElementById("countryNotesContent");
    if (!target) return;
    target.innerHTML = "";
    target.appendChild(infoHead("各国データ", "チームマスタをもとに、国旗・ランキング・グループ・地域・戦い方を読み取り専用で確認できます。"));
    target.appendChild(countryDataControls());
    const grid = document.createElement("div");
    grid.className = "info-grid";
    filteredCountryData().forEach((team) => grid.appendChild(countryDataCard(team)));
    if (!grid.children.length) grid.appendChild(message("条件に一致する国がありません"));
    target.appendChild(grid);
  }

  function countryDataControls() {
    const controls = document.createElement("div");
    controls.className = "country-data-controls";
    const searchLabel = document.createElement("label");
    searchLabel.className = "country-data-search";
    const search = document.createElement("input");
    search.type = "search";
    search.placeholder = "国名・FIFAコードで検索";
    search.value = state.countrySearch;
    search.addEventListener("input", () => {
      state.countrySearch = search.value;
      state.countryScheduleOpenTeamId = "";
      renderCountryNotes();
    });
    searchLabel.append(textSpan("国名検索"), search);
    controls.append(
      searchLabel,
      countrySelect("グループ", state.countryGroupFilter, [["all", "全グループ"], ...groupsForTeams().map((group) => [group, `Group ${group}`])], (value) => {
        state.countryGroupFilter = value;
        state.countryScheduleOpenTeamId = "";
        renderCountryNotes();
      }),
      countrySelect("地域", state.countryConfederationFilter, [["all", "全地域"], ...confederationsForTeams().map((confederation) => [confederation, confederation])], (value) => {
        state.countryConfederationFilter = value;
        state.countryScheduleOpenTeamId = "";
        renderCountryNotes();
      }),
      countrySelect("並び順", state.countrySort, [
        ["group", "グループ順"],
        ["rank", "FIFAランキング順"],
        ["name", "国名順"]
      ], (value) => {
        state.countrySort = value;
        state.countryScheduleOpenTeamId = "";
        renderCountryNotes();
      })
    );
    return controls;
  }

  function countrySelect(labelText, value, options, onChange) {
    const select = document.createElement("select");
    select.setAttribute("aria-label", labelText);
    options.forEach(([optionValue, text]) => {
      const option = document.createElement("option");
      option.value = optionValue;
      option.textContent = text;
      select.appendChild(option);
    });
    select.value = value;
    select.addEventListener("change", () => onChange(select.value));
    return select;
  }

  function filteredCountryData() {
    const query = state.countrySearch.trim().toLowerCase();
    const teams = Object.values(state.teams).filter((team) => {
      const data = countryData(team);
      const matchesSearch = !query || [data.name, data.nameEn, data.fifaCode].some((value) => String(value || "").toLowerCase().includes(query));
      const matchesGroup = state.countryGroupFilter === "all" || data.group === state.countryGroupFilter;
      const matchesConfederation = state.countryConfederationFilter === "all" || data.confederation === state.countryConfederationFilter;
      return matchesSearch && matchesGroup && matchesConfederation;
    });
    return teams.sort((a, b) => {
      const dataA = countryData(a);
      const dataB = countryData(b);
      if (state.countrySort === "rank") return (dataA.rank || 999) - (dataB.rank || 999);
      if (state.countrySort === "name") return dataA.name.localeCompare(dataB.name, "ja");
      const groupCompare = String(dataA.group || "").localeCompare(String(dataB.group || ""));
      if (groupCompare !== 0) return groupCompare;
      return (dataA.rank || 999) - (dataB.rank || 999);
    });
  }

  function countryDataCard(team) {
    const data = countryData(team);
    const card = document.createElement("article");
    card.className = "info-card country-data-card";
    const head = document.createElement("div");
    head.className = "country-data-head";
    head.appendChild(teamLabel(data.teamId, data.name, "", { showRank: false }));
    head.appendChild(textSpan(`（${data.fifaCode}）`, "country-code"));
    card.appendChild(head);
    const meta = document.createElement("div");
    meta.className = "country-data-meta";
    [
      ["FIFAランキング", data.rank ? `${data.rank}位` : "未設定"],
      ["グループ", data.group ? `Group ${data.group}` : "未設定"],
      ["ポット", data.pot],
      ["出場区分", data.qualification],
      ["地域 / 大陸連盟", data.confederation],
      ["FIFAコード", data.fifaCode]
    ].forEach(([label, value]) => meta.appendChild(countryChip(label, value)));
    card.appendChild(meta);
    [
      ["主な特徴", data.features],
      ["戦い方の傾向", data.style],
      ["強み", data.strengths],
      ["弱み", data.weaknesses],
      ["注目ポイント", data.watchPoint]
    ].forEach(([label, value]) => card.appendChild(countrySection(label, value)));
    card.appendChild(countryScheduleSection(data.teamId));
    card.appendChild(countryManagerSection(data.manager));
    card.appendChild(countryKeyPlayersSection(data.key_players));
    return card;
  }

  function countryChip(label, value) {
    const chip = document.createElement("div");
    chip.className = "country-data-chip";
    chip.append(textSpan(label), document.createTextNode(value || "未設定"));
    return chip;
  }

  function countrySection(label, value) {
    const section = document.createElement("section");
    section.className = "country-data-section";
    const heading = document.createElement("h4");
    heading.textContent = label;
    const body = document.createElement("p");
    body.textContent = value || "確認中";
    section.append(heading, body);
    return section;
  }

  function countryScheduleSection(teamId) {
    const section = document.createElement("section");
    section.className = "country-schedule";
    const button = document.createElement("button");
    button.type = "button";
    button.className = "country-schedule-toggle";
    const isOpen = state.countryScheduleOpenTeamId === teamId;
    button.textContent = isOpen ? "▲ 試合日程を閉じる" : "▼ 試合日程を見る";
    button.setAttribute("aria-expanded", String(isOpen));
    const list = document.createElement("div");
    list.className = "country-schedule-list";
    list.hidden = !isOpen;
    if (isOpen) renderCountrySchedule(teamId, list);
    button.addEventListener("click", () => {
      state.countryScheduleOpenTeamId = state.countryScheduleOpenTeamId === teamId ? "" : teamId;
      renderCountryNotes();
    });
    section.append(button, list);
    return section;
  }

  function renderCountrySchedule(teamId, target) {
    target.innerHTML = "";
    const matches = sortedMatches(computedSchedule().filter((match) => matchIncludesTeam(match, teamId)));
    if (!matches.length) {
      target.appendChild(message("この国の試合日程はまだありません"));
      return;
    }
    matches.forEach((match) => target.appendChild(countryScheduleMatch(match)));
  }

  function matchIncludesTeam(match, teamId) {
    return matchHomeId(match) === teamId || matchAwayId(match) === teamId;
  }

  function countryScheduleMatch(match) {
    const row = document.createElement("article");
    row.className = "country-schedule-match";
    const meta = document.createElement("div");
    meta.className = "country-schedule-meta";
    meta.append(
      textDiv(formatJstDateTime(match.kickoff_jst), "country-schedule-time"),
      textDiv(`${stageLabels[match.stage] || match.stage} / ${match.group ? `Group ${match.group}` : roundLabel(match)}`, "country-schedule-stage"),
      textDiv(`会場：${venueText(match)}`, "country-schedule-venue")
    );
    const play = document.createElement("div");
    play.className = "country-schedule-play";
    play.append(
      scheduleParticipantLabel(matchHomeId(match), match.home_name_ja, "country-schedule-team"),
      textDiv(countryScheduleScoreText(match.match_id), "country-schedule-score"),
      scheduleParticipantLabel(matchAwayId(match), match.away_name_ja, "country-schedule-team away")
    );
    const result = document.createElement("div");
    result.className = "country-schedule-result";
    result.append(textSpan(`ステータス：${matchStatus(match.match_id).label}`));
    row.append(meta, play, result);
    return row;
  }

  function scheduleParticipantLabel(teamId, fallback, className = "") {
    if (isResolvedTeam(teamId)) return teamLabel(teamId, "", className, { showRank: false });
    const label = fallback || "未確定";
    return textSpan(label, `team-label ${className} knockout-placeholder`.trim());
  }

  function countryScheduleScoreText(matchId) {
    const score = normalizedScore(matchId);
    if (!hasMainScore(score)) return "-";
    let text = `${score.score_home} - ${score.score_away}`;
    if (score.penalty_home !== "" && score.penalty_away !== "") {
      text += ` PK ${score.penalty_home} - ${score.penalty_away}`;
    }
    return text;
  }

  function roundLabel(match) {
    return stageLabels[match.stage] || match.round || "";
  }

  function countryManagerSection(managerData) {
    const section = document.createElement("section");
    section.className = "country-key-players";
    const heading = document.createElement("h4");
    heading.textContent = "監督";
    const card = document.createElement("article");
    card.className = "country-manager-card";
    const photo = document.createElement("div");
    photo.className = "country-manager-photo";
    const fallback = managerData?.name_ja ? managerData.name_ja.trim().slice(0, 1) : "No Image";
    if (managerData?.image_url) {
      const img = document.createElement("img");
      img.src = managerData.image_url;
      img.alt = `${managerData.name_ja || "監督"}の顔写真`;
      img.loading = "lazy";
      img.decoding = "async";
      img.onerror = () => {
        img.remove();
        photo.textContent = fallback || "No Image";
      };
      photo.appendChild(img);
    } else {
      photo.textContent = fallback || "No Image";
    }
    const body = document.createElement("div");
    const name = document.createElement("div");
    name.className = "country-manager-name";
    name.textContent = managerData?.name_ja || "確認中";
    const meta = document.createElement("div");
    meta.className = "country-manager-meta";
    meta.textContent = [
      managerData?.name_en,
      managerData?.nationality ? `国籍: ${managerData.nationality}` : "",
      managerData?.appointed_at ? `就任: ${managerData.appointed_at}` : ""
    ].filter(Boolean).join(" / ");
    const desc = document.createElement("div");
    desc.className = "country-manager-desc";
    desc.textContent = managerData?.description || "確認中";
    const tactics = document.createElement("div");
    tactics.className = "country-manager-tactics";
    tactics.textContent = managerData?.tactical_note ? `戦術 / チーム作り: ${managerData.tactical_note}` : "戦術 / チーム作り: 確認中";
    body.append(name, meta, desc, tactics);
    card.append(photo, body);
    section.append(heading, card);
    return section;
  }

  function countryKeyPlayersSection(players) {
    const section = document.createElement("section");
    section.className = "country-key-players";
    const heading = document.createElement("h4");
    heading.textContent = "注目選手";
    const list = document.createElement("div");
    list.className = "country-player-list";
    const items = Array.isArray(players) ? players : [];
    if (!items.length) {
      const empty = document.createElement("p");
      empty.className = "country-player-desc";
      empty.textContent = "確認中";
      list.appendChild(empty);
    } else {
      items.slice(0, 3).forEach((player) => list.appendChild(countryPlayerCard(player)));
    }
    section.append(heading, list);
    return section;
  }

  function countryPlayerCard(player) {
    const card = document.createElement("article");
    card.className = "country-player-card";
    const photo = document.createElement("div");
    photo.className = "country-player-photo";
    const fallback = player.name_ja ? player.name_ja.trim().slice(0, 1) : "No Image";
    if (player.image_url) {
      const img = document.createElement("img");
      img.src = player.image_url;
      img.alt = `${player.name_ja || "注目選手"}の顔写真`;
      img.loading = "lazy";
      img.decoding = "async";
      img.onerror = () => {
        img.remove();
        photo.textContent = fallback || "No Image";
        photo.classList.add("is-fallback");
      };
      photo.appendChild(img);
    } else {
      photo.textContent = fallback || "No Image";
      photo.classList.add("is-fallback");
    }

    const body = document.createElement("div");
    const name = document.createElement("div");
    name.className = "country-player-name";
    name.textContent = player.name_ja || "確認中";
    const meta = document.createElement("div");
    meta.className = "country-player-meta";
    meta.textContent = [player.position, player.club].filter(Boolean).join(" / ") || "所属確認中";
    const desc = document.createElement("div");
    desc.className = "country-player-desc";
    desc.textContent = player.description || "確認中";
    body.append(name, meta, desc);
    card.append(photo, body);
    return card;
  }

  function countryData(team) {
    const teamId = team.team_id;
    const override = countryDataOverrides[teamId] || {};
    const rank = Number(team.fifa_rank) || null;
    const group = team.group || "";
    const confederation = confederationByTeam[teamId] || inferConfederation(teamId);
    return {
      teamId,
      name: team.name_ja || team.name_en || teamId,
      nameEn: team.name_en || "",
      fifaCode: team.fifa_code || teamId,
      rank,
      group,
      pot: override.pot || potForRank(rank),
      qualification: override.qualification || qualificationByTeam[teamId] || qualificationForConfederation(confederation),
      confederation,
      features: override.features || defaultFeature(confederation, rank),
      style: override.style || defaultStyle(confederation, rank),
      strengths: override.strengths || defaultStrengths(confederation, rank),
      weaknesses: override.weaknesses || defaultWeaknesses(confederation, rank),
      watchPoint: override.watchPoint || defaultWatchPoint(team),
      japanChance: override.japanChance || japanChanceText(team),
      watchMemo: override.watchMemo || defaultWatchMemo(team),
      manager: override.manager || countryManagers[teamId] || defaultManager(team),
      key_players: enrichKeyPlayers(override.key_players || countryKeyPlayers[teamId] || [])
    };
  }

  function defaultManager(team) {
    return {
      manager_id: `${team.team_id || "team"}_manager_unconfirmed`,
      name_ja: "確認中",
      name_en: "",
      nationality: "",
      appointed_at: "",
      image_url: "",
      image_source_url: "",
      image_source_name: "",
      manager_checked_at: "2026-05-22",
      manager_source_url: "",
      manager_source_name: "",
      description: `${team.name_ja || team.name_en || team.team_id}の監督情報は確認中です。`,
      tactical_note: "最新の公式情報を確認して更新します。"
    };
  }

  function enrichKeyPlayers(players) {
    return players.map((player) => {
      const source = keyPlayerImageSources[player.player_id] || [];
      const localImage = localKeyPlayerImages[player.player_id] || "";
      return {
        ...player,
        image_url: localImage || keyPlayerExternalImages[player.player_id] || player.image_url || "",
        image_source_url: player.image_source_url || source[0] || "",
        image_source_name: player.image_source_name || source[1] || ""
      };
    });
  }

  function groupsForTeams() {
    return Array.from(new Set(Object.values(state.teams).map((team) => team.group).filter(Boolean))).sort();
  }

  function confederationsForTeams() {
    return Array.from(new Set(Object.values(state.teams).map((team) => countryData(team).confederation).filter(Boolean))).sort();
  }

  function potForRank(rank) {
    if (!rank) return "未設定";
    if (rank <= 12) return "Pot 1相当";
    if (rank <= 24) return "Pot 2相当";
    if (rank <= 36) return "Pot 3相当";
    return "Pot 4相当";
  }

  function qualificationForConfederation(confederation) {
    if (confederation.includes("欧州")) return "欧州予選突破";
    if (confederation.includes("アフリカ")) return "アフリカ予選突破";
    if (confederation.includes("北中米")) return "北中米カリブ海予選突破";
    if (confederation.includes("南米")) return "南米予選突破";
    if (confederation.includes("アジア")) return "アジア予選突破";
    if (confederation.includes("オセアニア")) return "オセアニア予選突破";
    return "予選突破";
  }

  function inferConfederation(teamId) {
    return ["CAN", "MEX", "USA", "PAN", "HAI", "CUW"].includes(teamId) ? "北中米カリブ海 / CONCACAF" : "確認中";
  }

  function defaultFeature(confederation, rank) {
    if (rank && rank <= 10) return "世界上位の個の質と試合運びを持つ優勝候補クラス。";
    if (confederation.includes("欧州")) return "戦術整理と球際の強度を備えた欧州型のチーム。";
    if (confederation.includes("南米")) return "技術と勝負強さを軸に、前線の個で流れを変えられるチーム。";
    if (confederation.includes("アフリカ")) return "身体能力と縦への推進力が出やすいチーム。";
    if (confederation.includes("北中米")) return "ホーム環境や勢いを生かしやすいチーム。";
    if (confederation.includes("アジア")) return "組織力と粘り強さをベースに戦うチーム。";
    return "大会での立ち上がりを見ながら特徴を確認したいチーム。";
  }

  function defaultStyle(confederation, rank) {
    if (rank && rank <= 10) return "ボール保持と速攻の両方を使い分け、主導権を握る時間を作る。";
    if (confederation.includes("欧州")) return "守備の配置を整えつつ、サイドとセットプレーを使う傾向。";
    if (confederation.includes("南米")) return "個の突破とテンポ変化で相手を崩す傾向。";
    if (confederation.includes("アフリカ")) return "縦に速く、フィジカルを生かした展開になりやすい。";
    return "相手との力関係に応じて、堅守と速攻を使い分ける。";
  }

  function defaultStrengths(confederation, rank) {
    if (rank && rank <= 10) return "選手層、決定力、大舞台での経験。";
    if (confederation.includes("欧州")) return "戦術理解、守備組織、セットプレー。";
    if (confederation.includes("南米")) return "個人技、勝負所の集中力、前線の質。";
    if (confederation.includes("アフリカ")) return "身体能力、スピード、球際の迫力。";
    return "チームの一体感、走力、試合ごとの勢い。";
  }

  function defaultWeaknesses(confederation, rank) {
    if (rank && rank <= 10) return "優勢時でもカウンター対応や主力依存が課題になり得る。";
    if (confederation.includes("欧州")) return "展開が重い時に攻撃が単調になる可能性。";
    if (confederation.includes("南米")) return "守備の距離感や試合中の波。";
    if (confederation.includes("アフリカ")) return "試合運びの安定感や守備の細部。";
    return "強豪相手に押し込まれた時間帯の耐久力。";
  }

  function defaultWatchPoint(team) {
    if (team.group === "F") return "日本と同組として、直接対決や得失点差に影響する試合運び。";
    if (Number(team.fifa_rank) <= 20) return "上位国らしい試合運びと、決勝トーナメントでの山への影響。";
    return "グループ内でどこまで勝点を伸ばせるか。";
  }

  function japanChanceText(team) {
    if (team.team_id === JAPAN_TEAM_ID) return "自国。";
    if (team.group === "F") return "日本と同じGroup F。グループステージで直接対戦する。";
    if (team.group === "C") return "Group C所属。日本がGroup Fを1位通過した場合はGroup C 2位、2位通過した場合はGroup C 1位とラウンド32で当たる可能性がある。";
    if (["A", "B", "D", "E", "I"].includes(team.group)) {
      return `Group ${team.group}所属。日本がGroup F 3位で上位通過した場合に、3位上位枠の割当次第で同じR32枠に入る可能性はあるが、現時点では要確認。`;
    }
    return `Group ${team.group || "未定"}所属。日本のGroup F 1位/2位通過時のR32固定枠では直接当たらない。3位上位枠や以降の山は組み合わせ次第のため要確認。`;
  }

  function defaultWatchMemo(team) {
    if (team.group === "F") return "日本の突破条件に直結するため優先して確認。";
    if (["CAN", "MEX", "USA"].includes(team.team_id)) return "開催国として会場の雰囲気も含めて見たい。";
    if (Number(team.fifa_rank) <= 10) return "優勝候補の基準値としてチェック。";
    return "結果だけでなく、戦い方の相性を見ておきたい。";
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
      <rect x="0" y="0" width="900" height="620" fill="#dff3ff"></rect>
      <path class="map-country-canada" d="M95 65 L505 48 L820 92 L825 185 L650 205 L510 184 L405 210 L280 196 L150 214 L82 160 Z"></path>
      <path class="map-country-usa" d="M150 214 L280 196 L405 210 L510 184 L650 205 L825 185 L800 365 L705 420 L735 468 L718 500 L675 430 L560 410 L455 428 L335 408 L245 430 L135 365 Z"></path>
      <path class="map-country-mexico" d="M245 430 L335 408 L455 428 L560 410 L616 515 L520 585 L378 575 L295 520 Z"></path>
      <path class="map-border-line" d="M150 214 L280 196 L405 210 L510 184 L650 205 L825 185"></path>
      <path class="map-border-line" d="M245 430 L335 408 L455 428 L560 410"></path>
      <text class="map-country-label" x="300" y="132">CANADA</text>
      <text class="map-country-label" x="385" y="318">UNITED STATES</text>
      <text class="map-country-label" x="350" y="520">MEXICO</text>
    `;
    defaultVenues.forEach((venue) => {
      const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
      group.setAttribute("class", [
        "venue-pin",
        venueCountryClass(venue.country),
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
    card.appendChild(venuePhoto(item));
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
    form.appendChild(textDiv(venueAtmosphereNotes[item.id] || "", "venue-atmosphere"));
    card.appendChild(form);
    return card;
  }

  function venuePhoto(venue) {
    const figure = document.createElement("figure");
    figure.className = "venue-photo";
    const button = document.createElement("button");
    button.type = "button";
    button.className = "venue-photo-button";
    const img = document.createElement("img");
    img.src = venuePhotoUrl(venue.id, 720);
    img.alt = `${venue.stadium}の写真`;
    img.loading = "lazy";
    img.decoding = "async";
    img.onerror = () => {
      button.textContent = "写真を読み込めませんでした";
      button.disabled = true;
    };
    button.appendChild(img);
    button.addEventListener("click", () => openVenuePhoto(venue));
    const caption = document.createElement("figcaption");
    caption.textContent = `${venue.stadium} / Wikimedia Commons`;
    figure.append(button, caption);
    return figure;
  }

  function openVenuePhoto(venue) {
    const modal = document.createElement("div");
    modal.className = "venue-photo-modal";
    const close = document.createElement("button");
    close.type = "button";
    close.textContent = "×";
    close.setAttribute("aria-label", "閉じる");
    const img = document.createElement("img");
    img.src = venuePhotoUrl(venue.id, 1280);
    img.alt = `${venue.stadium}の拡大写真`;
    const closeModal = () => modal.remove();
    close.addEventListener("click", closeModal);
    modal.addEventListener("click", (event) => {
      if (event.target === modal) closeModal();
    });
    document.addEventListener("keydown", function handleKey(event) {
      if (event.key !== "Escape") return;
      closeModal();
      document.removeEventListener("keydown", handleKey);
    });
    modal.append(close, img);
    document.body.appendChild(modal);
  }

  function venuePhotoUrl(venueId, width) {
    const file = venuePhotoFiles[venueId];
    return file ? `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${width}` : "";
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

  function venueCountryClass(country) {
    if (country === "カナダ") return "pin-canada";
    if (country === "メキシコ") return "pin-mexico";
    return "pin-usa";
  }

  function participantLabel(teamId, fallback = "", className = "", options = {}) {
    if (isResolvedTeam(teamId)) return teamLabel(teamId, fallback, className, options);
    const label = fallback || (teamId && teamId !== "TBD" ? teamId : "未確定");
    return textSpan(label, `team-label ${className} knockout-placeholder`.trim());
  }

  function exportState() {
    return {
      version: 1,
      type: "worldcup2026_score_and_notes_state",
      source: DATA_URL,
      scoreOverrides: effectiveScoreOverrides(),
      favoriteMatchIds: normalizeFavoriteMatchIds(state.saved.favoriteMatchIds),
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
    const source = payload?.tournament && typeof payload.tournament === "object" ? payload.tournament : payload;
    const scoreOverrides = source?.scoreOverrides && typeof source.scoreOverrides === "object"
      ? source.scoreOverrides
      : source?.scores && typeof source.scores === "object"
        ? source.scores
        : source;
    if (!scoreOverrides || typeof scoreOverrides !== "object") return false;
    importScoreOverrides(scoreOverrides, {
      lastUpdatedAt: source?.lastUpdatedAt || payload?.lastUpdated || new Date().toISOString(),
      favoriteMatchIds: source?.favoriteMatchIds || payload?.favoriteMatchIds,
      venueNotes: source?.venueNotes
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
      favoriteMatchIds: normalizeFavoriteMatchIds(options.favoriteMatchIds ?? state.saved.favoriteMatchIds),
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
    const source = payload?.tournament && typeof payload.tournament === "object" ? payload.tournament : payload;
    ["venueNotes"].forEach((key) => {
      if (source?.[key] && typeof source[key] === "object") state.saved[key] = source[key];
    });
    if (Array.isArray(source?.favoriteMatchIds)) {
      state.saved.favoriteMatchIds = normalizeFavoriteMatchIds(source.favoriteMatchIds);
    }
    persist();
    renderContent();
  }

  function extractScoreOverrides(payload) {
    const source = payload?.tournament && typeof payload.tournament === "object" ? payload.tournament : payload;
    if (source?.scoreOverrides && typeof source.scoreOverrides === "object") return source.scoreOverrides;
    if (source?.scores && typeof source.scores === "object") return source.scores;
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

  function championBetTeams() {
    return Object.values(state.teams)
      .filter((team) => team?.team_id && team.team_id !== "TBD")
      .sort((a, b) => {
        const rankA = Number(a.fifa_rank || 999);
        const rankB = Number(b.fifa_rank || 999);
        if (rankA !== rankB) return rankA - rankB;
        return String(a.name_ja || a.team_id).localeCompare(String(b.name_ja || b.team_id), "ja");
      })
      .map((team) => ({
        id: team.team_id,
        name: team.name_ja || team.team_id,
        group: team.group || "",
        rank: team.fifa_rank || ""
      }));
  }

  window.WorldCupTournament = {
    init,
    renderContent,
    updateTournamentSnapshots,
    renderAuxView,
    exportState,
    importState,
    championBetTeams
  };
})();
