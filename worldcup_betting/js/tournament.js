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
    view: "japan",
    matches: [],
    teams: {},
    knockoutMapping: {},
    groupFilter: "all",
    countrySearch: "",
    countryGroupFilter: "all",
    countryConfederationFilter: "all",
    countrySort: "group",
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
      textDiv(venueText(match), "match-venue"),
      mapButton(match)
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
    card.append(body);
    return card;
  }

  function mapButton(match) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "utility-button match-map-button";
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
      renderCountryNotes();
    });
    searchLabel.append(textSpan("国名検索"), search);
    controls.append(
      searchLabel,
      countrySelect("グループ", state.countryGroupFilter, [["all", "全グループ"], ...groupsForTeams().map((group) => [group, `Group ${group}`])], (value) => {
        state.countryGroupFilter = value;
        renderCountryNotes();
      }),
      countrySelect("地域", state.countryConfederationFilter, [["all", "全地域"], ...confederationsForTeams().map((confederation) => [confederation, confederation])], (value) => {
        state.countryConfederationFilter = value;
        renderCountryNotes();
      }),
      countrySelect("並び順", state.countrySort, [
        ["group", "グループ順"],
        ["rank", "FIFAランキング順"],
        ["name", "国名順"]
      ], (value) => {
        state.countrySort = value;
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
      ["注目ポイント", data.watchPoint],
      ["日本と当たる可能性", data.japanChance],
      ["観戦メモ", data.watchMemo]
    ].forEach(([label, value]) => card.appendChild(countrySection(label, value)));
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
      watchMemo: override.watchMemo || defaultWatchMemo(team)
    };
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
    const source = payload?.tournament && typeof payload.tournament === "object" ? payload.tournament : payload;
    const scoreOverrides = source?.scoreOverrides && typeof source.scoreOverrides === "object"
      ? source.scoreOverrides
      : source?.scores && typeof source.scores === "object"
        ? source.scores
        : source;
    if (!scoreOverrides || typeof scoreOverrides !== "object") return false;
    importScoreOverrides(scoreOverrides, {
      lastUpdatedAt: source?.lastUpdatedAt || payload?.lastUpdated || new Date().toISOString(),
      starPlayers: source?.starPlayers,
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
    const source = payload?.tournament && typeof payload.tournament === "object" ? payload.tournament : payload;
    ["starPlayers", "venueNotes"].forEach((key) => {
      if (source?.[key] && typeof source[key] === "object") state.saved[key] = source[key];
    });
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

  window.WorldCupTournament = {
    init,
    renderContent,
    updateTournamentSnapshots,
    renderAuxView,
    exportState,
    importState
  };
})();
