/**
 * Mind Odyssey - Curated Mental Models Database
 * Structured specifically for 3-minute, zero-jargon, dilemma-first micro learning.
 */

const MIND_DATABASE = [
  // 1. 博弈論 - 智豬博弈
  {
    id: "boxed_pigs",
    domain: "博弈論",
    domainId: "game_theory",
    title: "智豬博弈：弱者如何坐享其成？",
    modelEn: "Boxed Pigs Game",
    subtitle: "當行動需要付出成本，弱小者反而能逼強者替自己打工。",
    icon: "🐷",
    readingTime: "2.5 分鐘",
    status: "active", // 'lit' | 'active' | 'fogged'
    relicReward: { id: "relic_pig", name: "搭便車指南針", domain: "博弈論", icon: "🧭", svg: "assets/icons/relics/relic_pig.svg" },
    
    // 階段一：情境二選一 (Dilemma First)
    dilemma: {
      prompt: "豬圈一頭有個控制桿，按一下另一頭會掉下 10 份食物，但跑過去按要消耗 2 份體力。\n如果小豬去按，大豬會先搶吃 9 份，小豬只吃到 1 份（小豬淨虧 1 份）；\n如果大豬去按，小豬能先吃 4 份，大豬吃 6 份（大豬淨賺 4 份）。\n\n此時槽裡沒食物了，如果你是小豬，你會去按開關嗎？",
      options: [
        {
          id: "A",
          text: "去按！主動爭取，總比原地餓死好",
          stats: 28,
          verdict: "❌ 去了反而倒虧！大豬會把食物全搶光，你消耗了體力卻只拿到渣。"
        },
        {
          id: "B",
          text: "躺平！在食槽旁等大豬去按",
          stats: 72,
          verdict: "✅ 正解！大豬只要想吃飽就不得不去按；小豬什麼都不做反而穩賺 4 份！"
        }
      ],
      reveal: "這就是著名的『智豬博弈』。在特定規則下，弱者的最優解不是盲動，而是等待強者承擔拓荒成本。"
    },

    // 階段二：費曼核心白話 (Core & Jargon Defense)
    core: {
      essence: "當一件事情的啟動成本極高，但成果無法被獨佔時，強者為求生存必須去做，弱者則能採取『佔優策略』坐享其成。",
      analogy: "就像大科技龍頭（大豬）花幾十億砸錢研發新技術、踩遍所有的坑；中小創業公司（小豬）的最優選擇則是採取『佔優策略』——在旁邊躺平等技術成熟，享受『搭便車效應』直接跟進抄作業，利潤反而更划算。",
      jargons: [
        {
          term: "佔優策略",
          en: "Dominant Strategy",
          explanation: "不管對手選什麼，你選這招的結果都是最好的，不需要去猜對方的心思。"
        },
        {
          term: "搭便車效應",
          en: "Free-rider Effect",
          explanation: "別人出錢出力鋪好了路，你一毛不拔走在上面享受成果的現象。"
        }
      ]
    },

    // 階段三：現實世界的防身術 (Takeaway)
    takeaway: {
      action: "如果你在團隊或市場中處於資源匱乏的『弱者』位置，千萬別搶著去開闢無人區。讓大機構或競爭對手去驗證市場、承擔試錯成本，你在終點準備好快速跟進，才是勝率最高的心智策略。"
    },

    // 課後三扇門 (Branching Doors)
    doors: [
      {
        type: "deep",
        badge: "深入同域",
        targetId: "prisoners_dilemma",
        title: "既然弱者能躺平，那如果兩個人勢均力敵呢？",
        hook: "兩人明明只要合作就能發財，為什麼最後卻一定會被逼著互相背叛？",
        icon: "⚖️"
      },
      {
        type: "cross",
        badge: "跨界跳躍",
        targetId: "lemons_market",
        title: "經濟學上的『資訊盲盒』：為什麼二手車市場最後全剩垃圾車？",
        hook: "買家與賣家互不信任時，好東西是怎麼被劣質品硬生生逼死的？",
        icon: "🍋"
      },
      {
        type: "twist",
        badge: "反常識",
        targetId: "broken_windows",
        title: "社會學迷思：牆上一塊沒人修的破玻璃，如何毀掉整個治安良好的社區？",
        hook: "細微的縱容，如何演變成所有人集體放爛的連鎖骨牌效應？",
        icon: "🔨"
      }
    ]
  },

  // 2. 博弈論 - 囚徒困境
  {
    id: "prisoners_dilemma",
    domain: "博弈論",
    domainId: "game_theory",
    title: "囚徒困境：為什麼大家明明想合作，最後卻集體捲死？",
    modelEn: "Prisoner's Dilemma",
    subtitle: "個人最理性的自保選擇，往往會導向集體最悲慘的下場。",
    icon: "⚖️",
    readingTime: "3.0 分鐘",
    status: "fogged",
    relicReward: { id: "relic_prisoner", name: "博弈天平", domain: "博弈論", icon: "⚖️", svg: "assets/icons/relics/relic_prisoner.svg" },
    dilemma: {
      prompt: "你與同夥被捕，警方將你們隔開審問：\n- 兩人都沉默：各判 1 年；\n- 一人揭發、一人沉默：揭發者立即無罪釋放，沉默者重判 10 年；\n- 兩人都揭發：各判 5 年。\n\n你無法與對方通訊，你想爭取早點回家，你會選擇？",
      options: [
        {
          id: "A",
          text: "坦白揭發對方！保證自己不被判 10 年",
          stats: 76,
          verdict: "這正是多數人的理性選擇！但因為對方也這麼想，你們雙雙落入重判 5 年。"
        },
        {
          id: "B",
          text: "咬牙保持沉默！相信同夥的默契",
          stats: 24,
          verdict: "極度冒險！只要對方稍有私心揭發你，你就得替他扛下整整 10 年牢獄。"
        }
      ],
      reveal: "即使兩人都知道『都沉默（各1年）』才是最好結局，但出於對背叛的恐懼，最後都會被迫選擇『背叛』。"
    },
    core: {
      essence: "當缺乏信任與強制契約時，每個人追求自身利益最大化的結果，反而是大家一起掉進地獄。",
      analogy: "就像看電影時前排有人站了起來，後面的人為了看見也不得不站起來，大家陷入『內捲』；最後全場觀眾腿酸得要命，卻沒人比原本坐著看得更清楚，雙方都被困死在糟糕的『納許均衡』中。",
      jargons: [
        {
          term: "納許均衡",
          en: "Nash Equilibrium",
          explanation: "各方都選了自己的最優對策後，誰也沒有動力單方面改變主意的一種僵局。"
        },
        {
          term: "內捲",
          en: "Involution",
          explanation: "大家付出越來越多的額外成本，但整體產出和收益完全沒有增加的無效競爭。"
        }
      ]
    },
    takeaway: {
      action: "要破解身邊的『囚徒困境』（如職場無意義加班、惡性價格戰），不能寄託於個人良心，必須建立『公開且會被重罰的監督機制』或進行『多次重複的長期互動』。"
    },
    doors: [
      {
        type: "deep",
        badge: "深入同域",
        targetId: "tit_for_tat",
        title: "如果這局遊戲要玩 100 次？破解囚徒困境的終極法則",
        hook: "電腦模擬數百萬次博弈後，發現勝率最高、活得最滋潤的竟然只有 4 行代碼？",
        icon: "🔁"
      },
      {
        type: "cross",
        badge: "跨界跳躍",
        targetId: "tragedy_of_commons",
        title: "公地悲劇：為什麼公共冰箱裡的牛奶永遠過期？",
        hook: "『所有人的東西就是沒有人的東西』，經濟學如何拯救被糟蹋的公共資源？",
        icon: "🐄"
      },
      {
        type: "twist",
        badge: "反常識",
        targetId: "sunk_cost",
        title: "沉沒成本：為什麼難看的電影你反而更有可能堅持看完？",
        hook: "大腦如何利用你過去花掉的錢，繼續勒索你未來的寶貴時間？",
        icon: "⏳"
      }
    ]
  },

  // 3. 行為經濟學 - 沉沒成本
  {
    id: "sunk_cost",
    domain: "行為經濟學",
    domainId: "economics",
    title: "沉沒成本謬誤：如何阻止過去的損失勒索你的未來？",
    modelEn: "Sunk Cost Fallacy",
    subtitle: "已經打翻的牛奶不會回來，但大腦卻想再打翻一片麵包去配它。",
    icon: "⏳",
    readingTime: "2.0 分鐘",
    status: "fogged",
    relicReward: { id: "relic_hourglass", name: "無悔沙漏", domain: "行為經濟學", icon: "⌛", svg: "assets/icons/relics/relic_hourglass.svg" },
    dilemma: {
      prompt: "你花了 400 元買了一張熱門電影票，進場 15 分鐘後發現劇情爛到讓人想吐，如坐針氈。\n此時如果離場，你可以去喝杯舒服的咖啡或散步，但門票不能退。\n\n你會怎麼做？",
      options: [
        {
          id: "A",
          text: "硬著頭皮看完！畢竟花了 400 元不能浪費",
          stats: 64,
          verdict: "常見陷阱！你不僅損失了 400 元，還把接下來寶貴的 2 小時人生也賠進去了。"
        },
        {
          id: "B",
          text: "果斷起身走人！離開這個爛片現場",
          stats: 36,
          verdict: "精明決策！錢已經花掉了，繼續坐著只會讓損失從『金錢』擴大到『時間＋情緒』。"
        }
      ],
      reveal: "那 400 元就是已經沉入海底的成本。不管你看不看，它都不會回來，未來的決策應該只看未來的收益。"
    },
    core: {
      essence: "人在做決策時，容易念念不忘那些『已經付出且無法收回的代價』，從而做出更糟糕的選擇。",
      analogy: "就像去吃到飽餐廳，因為強烈的『損失厭惡』害怕吃虧，明明飽到快吐了還硬塞三盤冰淇淋，結果換來急性腸胃炎看醫生，還白白浪費了本可以散步喝咖啡的『機會成本』。",
      jargons: [
        {
          term: "機會成本",
          en: "Opportunity Cost",
          explanation: "為了做當前這件事，你所必須放棄的其他所有選擇中，價值最高的那一個。"
        },
        {
          term: "損失厭惡",
          en: "Loss Aversion",
          explanation: "人們丟失 100 元的痛苦感受，遠大於撿到 100 元的快樂感受。"
        }
      ]
    },
    takeaway: {
      action: "在評估一項投資、專案或一段糟糕的關係時，永遠問自己：『如果我今天才剛接手、以前沒有任何投入，我現在還願意開始嗎？』如果答案是不願意，立刻止損。"
    },
    doors: [
      {
        type: "deep",
        badge: "深入同域",
        targetId: "anchoring_effect",
        title: "標價 3 萬的包包特價 1 萬？錨定效應的心理搶劫",
        hook: "商人是怎麼用第一個數字，神不知鬼不覺控制你對『便宜』的判斷？",
        icon: "⚓"
      },
      {
        type: "cross",
        badge: "跨界跳躍",
        targetId: "bystander_effect",
        title: "旁觀者效應：為什麼圍觀人群越多，反而沒人敢伸出援手？",
        hook: "集體沉默不是因為冷血，而是一場可怕的責任蒸發心理機制。",
        icon: "👥"
      },
      {
        type: "twist",
        badge: "反常識",
        targetId: "boxed_pigs",
        title: "回到智豬博弈：為什麼當個弱者有時反而比當強者更舒服？",
        hook: "回顧賽局世界裡最聰明的弱者搭便車生存法。",
        icon: "🐷"
      }
    ]
  },

  // 4. 社會心理學 - 旁觀者效應
  {
    id: "bystander_effect",
    domain: "社會心理學",
    domainId: "sociology",
    title: "旁觀者效應：為什麼在人群中呼救，往往得不到回應？",
    modelEn: "Bystander Effect",
    subtitle: "現場的人越多，每個人心中的那份道德責任感就被稀釋得越薄。",
    icon: "👥",
    readingTime: "2.5 分鐘",
    status: "fogged",
    relicReward: { id: "relic_whistle", name: "喚醒銀哨", domain: "社會心理學", icon: "📢", svg: "assets/icons/relics/relic_whistle.svg" },
    dilemma: {
      prompt: "在人來人往的熱鬧十字路口，有人突然心臟病發倒地不起。\n此時圍觀群眾高達數十人，都在交頭接耳，但還沒有人上前急救。\n\n如果你是路過的一員，你的第一直覺通常是？",
      options: [
        {
          id: "A",
          text: "停下來看看，大家都在看，應該有人已經報警了吧？",
          stats: 71,
          verdict: "這正是致命的『多元無知』！每個人都以為別人在行動，結果誰都沒動。"
        },
        {
          id: "B",
          text: "主動站出來大聲呼救並指名專人打 119",
          stats: 29,
          verdict: "拯救生命的關鍵！打破群體責任分散，主動指定個體才能啟動救援。"
        }
      ],
      reveal: "旁觀者不幫忙通常不是因為冷血，而是因為『責任分散』——每個人都覺得自己的責任只有 1/50。"
    },
    core: {
      essence: "當有許多目擊者時，任何人主動施救的機率都會大幅下降，因為大家都把判斷標準轉移到他人臉上。",
      analogy: "就像在 200 人的工作大群裡發一句『誰可以幫忙？』，大家因為『責任分散』覺得別人會動，又因為『多元無知』看全場沒人回話就誤以為不緊急；但如果直接私訊指名特定一人，他會立刻處理。",
      jargons: [
        {
          term: "責任分散",
          en: "Diffusion of Responsibility",
          explanation: "一個任務由越多的人共同承擔時，每個人感受到的個人壓力就越小。"
        },
        {
          term: "多元無知",
          en: "Pluralistic Ignorance",
          explanation: "大家心裡都很慌，但看到周圍人都一臉淡定，就誤以為事情其實不嚴重。"
        }
      ]
    },
    takeaway: {
      action: "如果哪天你在公共場所遇到危險需要求助，千萬別喊『救命啊、快來人』；一定要盯住特定的某一個人，指著他說：『穿藍色外套戴眼鏡的先生，請你幫我打 119！』只有鎖定個人，旁觀者效應才會被瞬間瓦解。"
    },
    doors: [
      {
        type: "deep",
        badge: "深入同域",
        targetId: "broken_windows",
        title: "從一顆丟在路邊的垃圾，到整個街區淪陷：破窗效應",
        hook: "人類對環境失序的容忍度是如何在不知不覺中被拉低的？",
        icon: "🔨"
      },
      {
        type: "cross",
        badge: "跨界跳躍",
        targetId: "prisoners_dilemma",
        title: "囚徒困境的社會版：為什麼人人都討厭加班，卻沒人敢準時下班？",
        hook: "猜疑與囚徒困境如何在現代職場裡演變成慢性毒藥？",
        icon: "⚖️"
      },
      {
        type: "twist",
        badge: "反常識",
        targetId: "sunk_cost",
        title: "沉沒成本：為什麼你對一個專案投入越多，就越難發現它已經爛透了？",
        hook: "如何用理性沙漏清除自己的心智障礙？",
        icon: "⏳"
      }
    ]
  },

  // 5. 社會心理學 - 破窗效應
  {
    id: "broken_windows",
    domain: "社會心理學",
    domainId: "sociology",
    title: "破窗效應：一扇沒修好的窗，如何毀掉整個社區？",
    modelEn: "Broken Windows Theory",
    subtitle: "秩序的崩塌從來不是轟然一聲，而是從無人理會的小污點開始蔓延。",
    icon: "🔨",
    readingTime: "2.0 分鐘",
    status: "fogged",
    relicReward: { id: "relic_glass", name: "無瑕之鏡", domain: "社會心理學", icon: "🪞", svg: "assets/icons/relics/relic_glass.svg" },
    dilemma: {
      prompt: "你走在一條乾淨整潔的模範街道上，手裡有一張喝完的飲料吸管套。\n街上沒有垃圾桶，你的直覺是？",
      options: [
        {
          id: "A",
          text: "塞進口袋或包包，等回家再丟（整潔的環境讓你不好意思亂丟）",
          stats: 82,
          verdict: "社會規範運作良好！一塵不染的環境會主動抑制個人的不良行為。"
        },
        {
          id: "B",
          text: "如果角落已經堆了一堆垃圾袋，順手把它丟在垃圾堆上",
          stats: 18,
          verdict: "這就是破窗信號！只要有一扇窗破了沒修，人們就會覺得『再砸一塊也無所謂』。"
        }
      ],
      reveal: "第一塊破損若未被及時制止，就等於向大眾傳遞了『這裡沒人管』的無聲許可。"
    },
    core: {
      essence: "任何細微的混亂如果不及時修復，都會發出容忍放任的訊號，迅速誘發更嚴重的破壞行為。",
      analogy: "就像程式碼庫裡如果允許寫了一段醜陋的暫時補丁，接下來的工程師就會毫無心理負擔地堆出更多垃圾程式碼，形成惡劣的『負向反饋循環』，最後整個專案報廢。",
      jargons: [
        {
          term: "負向反饋循環",
          en: "Negative Feedback Loop",
          explanation: "一個小問題引發新問題，新問題又讓原問題變得更糟的惡性滾雪球過程。"
        }
      ]
    },
    takeaway: {
      action: "無論是個人習慣、居家環境還是專案維護，關鍵在於『零容忍第一扇破窗』。桌面上的第一張廢紙、程式碼裡的第一個爛命名、團隊裡的第一句惡意推託，都要在第一時間清理乾淨。"
    },
    doors: [
      {
        type: "deep",
        badge: "深入同域",
        targetId: "bystander_effect",
        title: "當整個街區都冷眼旁觀時？旁觀者效應的集體麻木",
        hook: "為什麼群體越大，大家越傾向於把頭低下來裝作沒看見？",
        icon: "👥"
      },
      {
        type: "cross",
        badge: "跨界跳躍",
        targetId: "boxed_pigs",
        title: "博弈論：面對滿地破窗，為什麼誰都不願意當第一個修補匠？",
        hook: "大豬與小豬的算盤，如何解釋公共設施的失修慘狀？",
        icon: "🐷"
      },
      {
        type: "twist",
        badge: "反常識",
        targetId: "prisoners_dilemma",
        title: "囚徒困境的深層思考：互信破壞後，如何重新簽訂合作公約？",
        hook: "信任瓦解只需要一天，重建卻需要一千次博弈。",
        icon: "⚖️"
      }
    ]
  },

  // 6. 行為經濟學 - 檸檬市場
  {
    id: "lemons_market",
    domain: "行為經濟學",
    domainId: "economics",
    title: "檸檬市場：資訊不對稱如何讓劣幣逐良幣？",
    modelEn: "The Market for Lemons",
    subtitle: "在買家看不清真相的世界裡，最好的商品往往最先被餓死。",
    icon: "🍋",
    readingTime: "2.5 分鐘",
    status: "fogged",
    relicReward: { id: "relic_lemon", name: "真偽之秤", domain: "行為經濟學", icon: "🍋", svg: "assets/icons/relics/relic_lemon.svg" },
    dilemma: {
      prompt: "你想買一台二手車。市場上有兩種車：好車（價值 30 萬）與爛車『檸檬』（價值 10 萬），比例各佔一半。\n但只有車商自己心裡知道哪台是爛車，你身為外行完全分不出來。\n\n你最高願意出多少錢買一台二手車？",
      options: [
        {
          id: "A",
          text: "願意出 30 萬，賭一把能買到好車！",
          stats: 14,
          verdict: "血虧！車商一定會把價值 10 萬的爛車包裝好以 30 萬賣給你，大賺差價。"
        },
        {
          id: "B",
          text: "只願意出 20 萬（平均價：(30+10)/2 = 20萬）",
          stats: 86,
          verdict: "看似聰明，但好車車主看你只出 20 萬，氣得退出市場；結果市場只剩下爛車，20 萬依然買到爛車！"
        }
      ],
      reveal: "買家的防禦性砍價，會把真正的好車逼出市場，最後整個市場只剩下一堆劣質的『檸檬』。"
    },
    core: {
      essence: "當買賣雙方的資訊嚴重不對稱時，價格機制會失靈，劣等品會逐步淘汰優質品。",
      analogy: "就像在存在嚴重『資訊不對稱』的相親或面試中，如果企業無法辨識真才實學只能開平庸固定薪水，高手全跑了，市場便發生『逆向選擇』，最後留下來的全是平庸者。",
      jargons: [
        {
          term: "資訊不對稱",
          en: "Information Asymmetry",
          explanation: "交易的一方掌握了另一方所不知道的關鍵情報（例如車子的真實車況）。"
        },
        {
          term: "逆向選擇",
          en: "Adverse Selection",
          explanation: "由於資訊不公開，買賣最後撮合出的反而是對自己最不利的糟糕交易。"
        }
      ]
    },
    takeaway: {
      action: "如果你在賣優質產品（或自己是優秀人才），切忌只打價格戰。你必須主動出具『第三方難以偽造的認證』（如保固承諾、原廠檢測、名校背書、實戰作品集），用高昂的信號成本自證清白。"
    },
    doors: [
      {
        type: "deep",
        badge: "深入同域",
        targetId: "sunk_cost",
        title: "既然買到檸檬爛車，為什麼大家還拼命花錢修？",
        hook: "沉沒成本如何讓受騙買家在修車無底洞裡越陷越深？",
        icon: "⏳"
      },
      {
        type: "cross",
        badge: "跨界跳躍",
        targetId: "boxed_pigs",
        title: "博弈論：誠實的商家如何透過『信號傳遞』反殺檸檬騙子？",
        hook: "強者如何透過自我約束打破囚徒僵局？",
        icon: "🐷"
      },
      {
        type: "twist",
        badge: "反常識",
        targetId: "broken_windows",
        title: "社會學：二手市場的誠信崩塌，本質上也是一種破窗效應？",
        hook: "探討制度信任如何像破窗一樣迅速蒸發。",
        icon: "🔨"
      }
    ]
  },

  // 7. 物理學思維 - 熵增定律 (Physics)
  {
    id: "entropy_law",
    domain: "物理學思維",
    domainId: "physics",
    title: "熵增定律：為什麼萬物終將走向混亂與內捲？",
    modelEn: "Entropy Law (Second Law of Thermodynamics)",
    subtitle: "宇宙最殘酷的法則：不主動注入能量，系統必然自發崩潰。",
    icon: "⏳",
    readingTime: "2.5 分鐘",
    status: "fogged",
    relicReward: { id: "relic_entropy", name: "耗散逆熵儀", domain: "物理學思維", icon: "⏳", svg: "assets/icons/relics/relic_entropy.svg" },
    dilemma: {
      prompt: "你買了一套全新的夢幻公寓，裝潢得一塵不染。\n如果接下來整整一個月，你完全不打掃、不整理，只是像平常一樣在裡面生活、吃外賣、換衣服。\n\n一個月後，這間屋子最可能變成什麼樣子？",
      options: [
        {
          id: "A",
          text: "維持原樣或只有微小灰塵，畢竟我沒有故意去搞破壞",
          stats: 11,
          verdict: "❌ 天真了！混亂的可能狀態有數億種，而整齊的狀態只有一種，混亂是自發必然發生的。"
        },
        {
          id: "B",
          text: "垃圾堆積、衣服散落、徹底變成災難級狗窩",
          stats: 89,
          verdict: "✅ 正解！這就是熱力學第二定律：封閉系統的『熵』（混亂度）永遠只增不減。"
        }
      ],
      reveal: "任何組織或個人，只要不主動做功、不持續從外界輸入秩序，混亂與衰亡就是唯一的終點。"
    },
    core: {
      essence: "『熵增』是宇宙萬物的底層引力：孤立系統在沒有外部能量輸入時，混亂度必然不可逆地增加。",
      analogy: "就像一家原本高效敏捷的創業公司（整齊的房間），如果不主動引入外界新知與嚴格管理，就會自然演化出臃腫流程、推諉扯皮與官僚主義，最後甚至變成『封閉系統』走向瓦解；只有像生物呼吸一樣建立『耗散結構』，持續從外部吸收高質量能量並排出混亂垃圾，才能逆向維持生機。",
      jargons: [
        {
          term: "熵增",
          en: "Entropy Increase",
          explanation: "一個封閉系統自發從有序走向混亂、無序與衰敗的不可逆趨勢。"
        },
        {
          term: "耗散結構",
          en: "Dissipative Structure",
          explanation: "一個開放系統透過持續從外界輸入能量、排出廢棄物，維持自身高度有序的狀態。"
        }
      ]
    },
    takeaway: {
      action: "永遠警惕生活與事業的『孤立封閉』。對抗內捲與平庸的唯一解藥，是主動打開系統邊界，每天注入新認知（高質量輸入）並果斷斬斷無效社交與積壓雜物（排出高熵垃圾）。"
    },
    doors: [
      {
        type: "deep",
        badge: "演化跨越",
        targetId: "hawk_dove",
        title: "演化生物學：生命是如何在殘酷的熵增宇宙中，奇蹟般偷走『負熵』活下來的？",
        hook: "生命本身就是一場對抗宇宙混亂的壯麗反叛。",
        icon: "🦅"
      },
      {
        type: "cross",
        badge: "複雜湧現",
        targetId: "emergence_system",
        title: "複雜自適應系統：既然萬物都在熵增混亂，為什麼螞蟻和人類卻能聚合成智慧生命？",
        hook: "微觀個體如何違反直覺地湧現出宏觀秩序？",
        icon: "🌐"
      },
      {
        type: "twist",
        badge: "統計反思",
        targetId: "survivorship_bias",
        title: "統計學：那些看似戰勝熵增的百年老店，究竟是真有本事還是倖存者偏差？",
        hook: "沉入海底的龐大失敗殘骸，藏著什麼被忽略的真理？",
        icon: "🎯"
      }
    ]
  },

  // 8. 演化生物學 - 鷹鴿博弈 (Evolutionary Biology)
  {
    id: "hawk_dove",
    domain: "演化生物學",
    domainId: "evolutionary_bio",
    title: "鷹鴿博弈：大自然為什麼沒有演化出純粹的好人？",
    modelEn: "Hawk-Dove Game",
    subtitle: "純好人的天堂極其脆弱，壞人的入侵會重塑整個世界的規則。",
    icon: "🦅",
    readingTime: "3.0 分鐘",
    status: "fogged",
    relicReward: { id: "relic_hawk", name: "進化平衡羽", domain: "演化生物學", icon: "🦅", svg: "assets/icons/relics/relic_hawk.svg" },
    dilemma: {
      prompt: "假設一個島上的動物全都是『溫和的鴿子』，大家見面禮貌平分食物、從不爭吵流血，生活如天堂。\n某天突變出一隻『兇殘的鷹』，見人就打、搶光所有食物。\n\n在自然選擇下，這隻鷹的後代會怎麼樣？",
      options: [
        {
          id: "A",
          text: "被所有鴿子集體排擠討伐，迅速絕種",
          stats: 22,
          verdict: "❌ 鴿子根本不會打架！鷹每次遭遇鴿子都大獲全勝吃得飽飽，鷹的後代反而瘋狂暴增！"
        },
        {
          id: "B",
          text: "因為佔盡好處、繁衍迅速，鷹的基因快速席捲全島",
          stats: 78,
          verdict: "✅ 正確！在全善的綿羊群中，一隻狼能享有極致的掠奪紅利，打破原本的天堂。"
        }
      ],
      reveal: "但當島上全是鷹時，鷹互打傷亡慘重，鴿子又會重新迎來轉機，最終雙方比例鎖定在『進化穩定策略』。"
    },
    core: {
      essence: "生物演化不是追求大同社會，而是在衝突與妥協中尋找無法被任何突變策略擊垮的『動態平衡』。",
      analogy: "就像在職場或社群中，如果全員都是任勞任怨的爛好人（純鴿派），只要來一個極端自私的算計者（鷹派），他就能瘋狂收割全場；但若全員都勾心鬥角（純鷹派），團隊全員血虧內耗；最終自然會形成某種特定比例的『進化穩定策略』，讓好人必須長出利齒以威嚇侵略。",
      jargons: [
        {
          term: "進化穩定策略",
          en: "Evolutionarily Stable Strategy (ESS)",
          explanation: "一種一旦被群體中大多數成員採納，任何小撮突變策略都無法入侵奪權的穩定狀態。"
        },
        {
          term: "鷹鴿策略",
          en: "Hawk-Dove Strategy",
          explanation: "激進掠奪者（鷹）與和平妥協者（鴿）在爭奪生存資源時的博弈模型。"
        }
      ]
    },
    takeaway: {
      action: "永遠不要做『無原則的純鴿子』。善良如果沒有獠牙，就是對邪惡的邀請。最高明的策略是『以牙還牙（Tit-for-Tat）』：初次見面心懷善意，一旦遭遇背叛立即果斷反擊，直到對方重回合作軌道。"
    },
    doors: [
      {
        type: "deep",
        badge: "博弈重連",
        targetId: "prisoners_dilemma",
        title: "囚徒困境：電腦程式大賽中，最簡單的『以牙還牙』策略如何橫掃所有複雜算計？",
        hook: "善意與原則如何擊潰純粹的背叛者？",
        icon: "⚖️"
      },
      {
        type: "cross",
        badge: "群體湧現",
        targetId: "emergence_system",
        title: "複雜自適應系統：成千上萬的動物個體，如何在沒有中央大腦的情況下自發協同？",
        hook: "極簡規則如何孕育出宏觀的蟻群智慧？",
        icon: "🌐"
      },
      {
        type: "twist",
        badge: "逆向反思",
        targetId: "boxed_pigs",
        title: "智豬博弈：當小豬遇到純鷹派的大豬，還能靠躺平獲勝嗎？",
        hook: "強弱博弈與生物鷹鴿演化的驚人交匯點。",
        icon: "🐷"
      }
    ]
  },

  // 9. 統計與機率 - 倖存者偏差 (Statistics)
  {
    id: "survivorship_bias",
    domain: "統計與機率",
    domainId: "statistics",
    title: "倖存者偏差：為什麼聽成功者的演講反而死得最慘？",
    modelEn: "Survivorship Bias",
    subtitle: "死人不會說話，那些沉入海底的殘骸才是成功的真正地圖。",
    icon: "🎯",
    readingTime: "2.5 分鐘",
    status: "fogged",
    relicReward: { id: "relic_survivorship", name: "洞察真理目鏡", domain: "統計與機率", icon: "🎯", svg: "assets/icons/relics/relic_survivorship.svg" },
    dilemma: {
      prompt: "二戰期間，盟軍戰機返航受損嚴重。軍方統計發現，倖存戰機的『機翼』彈孔密密麻麻，而『發動機與座艙』幾乎完好無損。\n軍方長官決定：『立即調集資源，加固彈孔最多的機翼！』\n\n統計學家亞伯拉罕·沃德（Abraham Wald）卻拍桌反對。如果你是他，你會建議加固哪裡？",
      options: [
        {
          id: "A",
          text: "聽軍方的，哪裡彈孔多就補哪裡，機翼防禦最薄弱",
          stats: 18,
          verdict: "❌ 致命錯誤！機翼被打成蜂窩還能飛回來，說明機翼中彈根本不致命！"
        },
        {
          id: "B",
          text: "加固毫無彈孔的發動機與座艙！",
          stats: 82,
          verdict: "✅ 天才決策！發動機中彈的飛機全掉進海裡根本沒能飛回來，所以你看不到它們的彈孔！"
        }
      ],
      reveal: "你所看到的所有數據，都是經過『生還篩選』的偏誤結果。看不見的沉默死者，才是致命關鍵。"
    },
    core: {
      essence: "當我們只關注篩選後『倖存下來』的樣本，而忽視了那些在過程中淘汰消失的樣本時，會得出完全相反的荒謬結論。",
      analogy: "就像書店暢銷榜上堆滿了『大學輟學創業成首富』的成功傳記，讓人誤以為輟學是成功的捷徑；但現實是發生了嚴重的『倖存者偏差』，因為數以百萬計因輟學而破產失業的普通人，永遠沒有機會出書分享經驗，形成了『沉默的墓地』。",
      jargons: [
        {
          term: "倖存者偏差",
          en: "Survivorship Bias",
          explanation: "只看到歷經層層淘汰後的生還者，誤把運氣或特例當成普遍規律的認知陷阱。"
        },
        {
          term: "沉默的墓地",
          en: "Silent Evidence / Silent Graves",
          explanation: "那些在殘酷競爭中失敗、退出但無法被統計數據捕捉到的龐大失敗樣本群。"
        }
      ]
    },
    takeaway: {
      action: "研究某個領域時，不要只看冠軍做了什麼，更要去深挖那些『跟冠軍做了一模一樣的事卻死掉的人』死在哪個坑裡。避開致命陷阱，遠比複製表面成功更具決定性。"
    },
    doors: [
      {
        type: "deep",
        badge: "經濟連結",
        targetId: "lemons_market",
        title: "檸檬市場：在買賣雙方的盲盒中，好車如何成為無法倖存的死者？",
        hook: "劣幣驅逐良幣的逆向選擇機制。",
        icon: "🍋"
      },
      {
        type: "cross",
        badge: "物理對照",
        targetId: "entropy_law",
        title: "物理學：萬物在熵增的狂流中，究竟什麼樣的結構能真正倖存下來？",
        hook: "耗散結構與生命秩序的終極對抗。",
        icon: "⏳"
      },
      {
        type: "twist",
        badge: "心理陷阱",
        targetId: "sunk_cost",
        title: "沉沒成本：當我們落入倖存者幻想時，如何阻止自己越陷越深？",
        hook: "不甘心如何成為人生最大的財務絞肉機？",
        icon: "⏳"
      }
    ]
  },

  // 10. 複雜自適應系統 - 湧現理論 (Complex Adaptive Systems)
  {
    id: "emergence_system",
    domain: "複雜自適應系統",
    domainId: "complex_systems",
    title: "湧現理論：單隻螞蟻智商為零，為何蟻群卻能建造帝國？",
    modelEn: "Emergence Theory",
    subtitle: "整體大於部分的總和：極簡的微觀規則，能孕育出震撼的宏觀智慧。",
    icon: "🌐",
    readingTime: "2.5 分鐘",
    status: "fogged",
    relicReward: { id: "relic_emergence", name: "湧現幾何晶核", domain: "複雜自適應系統", icon: "🌐", svg: "assets/icons/relics/relic_emergence.svg" },
    dilemma: {
      prompt: "百萬隻候鳥在黃昏天空形成遮天蔽日的幾何風暴，極速變換隊形卻從不互相碰撞。\n如果你是造物主，要讓一萬台微型無人機在空中完美模仿這種隊形，最好的設計方式是什麼？",
      options: [
        {
          id: "A",
          text: "造一台超級電腦中央主控台，即時計算每隻鳥每秒的精確座標發送指令",
          stats: 16,
          verdict: "❌ 算力瞬間爆炸！任何微小網絡延遲都會引發骨牌式撞機慘劇。"
        },
        {
          id: "B",
          text: "給每隻鳥只寫入 3 條極簡規則：跟隨鄰居、保持距離、朝同向飛",
          stats: 84,
          verdict: "✅ 奇蹟般優雅！大自然從不搞中央集權，群體智慧完全是在個體互動中『湧現』出來的。"
        }
      ],
      reveal: "大自然最具威力的架構不是由上而下的命令控制，而是由下而上的自主湧現。"
    },
    core: {
      essence: "大量簡單個體依據簡單的局部規則互動時，在宏觀層面會自發產生任何個體都不具備的高階複雜特性。",
      analogy: "就像城市的夜市、維基百科或是股市，沒有任何單一首腦在指揮全場，但透過成千上萬人的去中心化買賣與反饋，宏觀上自然誕生了繁榮的市場秩序；這種『湧現現象』證明了：在『複雜自適應系統』中，設計優雅的微觀規則遠勝於僵硬的巨型藍圖。",
      jargons: [
        {
          term: "湧現現象",
          en: "Emergence Phenomenon",
          explanation: "低層次簡單組件聚集時，突然自發產生高層次全新屬性的奇妙過程（如水分子變成水流的濕潤感）。"
        },
        {
          term: "複雜自適應系統",
          en: "Complex Adaptive System (CAS)",
          explanation: "由眾多能感知環境並自主學習調整的個體組成的網絡，具有高度自我組織能力。"
        }
      ]
    },
    takeaway: {
      action: "在管理團隊或自我成長時，別試圖微觀管理每一個動作細節。為系統設定 2~3 條不可逾越的『極簡底線原則』，然後給予充分的去中心化自由，讓協同效應自發湧現。"
    },
    doors: [
      {
        type: "deep",
        badge: "演化連結",
        targetId: "hawk_dove",
        title: "演化生物學：基因是如何透過微小變異，湧現出人類大腦這種極致器官的？",
        hook: "演化穩定策略與自私基因的宏觀湧現。",
        icon: "🦅"
      },
      {
        type: "cross",
        badge: "社會心理",
        targetId: "bystander_effect",
        title: "社會心理學：人群中的責任分散與旁觀冷漠，是不是也是一種負面湧現？",
        hook: "每個好人的無作為，如何合力釀成致命悲劇？",
        icon: "👥"
      },
      {
        type: "twist",
        badge: "統計反思",
        targetId: "survivorship_bias",
        title: "統計與機率：當我們在湧現現象中尋找因果時，是否容易陷入倖存者偏差？",
        hook: "看清自組織系統背後的隨機與篩選機制。",
        icon: "🎯"
      }
    ]
  }
,

  // Auto-Expanded: 哲學認識論 - 奧卡姆剃刀：如無必要，勿增實體
  {
    "id": "occams_razor",
    "domain": "哲學認識論",
    "domainId": "philosophy",
    "title": "奧卡姆剃刀：如無必要，勿增實體",
    "modelEn": "Occam's Razor",
    "subtitle": "簡單的解釋，往往就是真相",
    "icon": "🪒",
    "readingTime": "2.5 分鐘",
    "status": "fogged",
    "relicReward": {
      "id": "relic_razor",
      "name": "簡約剃刀",
      "domain": "哲學認識論",
      "icon": "✨"
    },
    "dilemma": {
      "prompt": "辦公室的冰箱裡，你冰的一盒蛋糕昨晚不翼而飛。同事小美說：「可能是昨晚大樓管線漏水，水壓震動導致紙盒融化掉落，然後剛好被一隻迷路的流浪貓叼走。」同事大偉說：「就是被某個嘴饞的同事偷吃了吧。」你傾向相信誰？",
      "options": [
        {
          "id": "A",
          "text": "相信小美充滿想像力的複雜故事",
          "stats": 12,
          "verdict": "你喜歡科幻小說，但這在現實中會讓你累死。"
        },
        {
          "id": "B",
          "text": "相信大偉簡單直接的偷吃推論",
          "stats": 88,
          "verdict": "恭喜，你本能地使用了奧卡姆剃刀。"
        }
      ],
      "reveal": "當有多種解釋時，不需要引入過多假設的那個最簡單解釋，通常最接近真相。"
    },
    "core": {
      "essence": "切除所有不必要的假設，保留最簡單的解釋。",
      "analogy": "這就像你在路上聽到馬蹄聲，正常人都會想到是「馬」，而不是「斑馬」或「獨角獸」。奧卡姆剃刀就是一把幫你削掉那些天馬行空、不必要假設的利器，讓你在面對複雜狀況時，能瞬間看清問題的本質與「本體論」假設。",
      "jargons": [
        {
          "term": "本體論",
          "en": "Ontology",
          "explanation": "探討世界上到底存在著什麼東西的哲學學問。"
        }
      ]
    },
    "takeaway": {
      "action": "今天遇到問題時，先列出所有可能的解釋，把需要最多前提假設、想得最複雜的選項全部刪掉，從最單純直觀的那一個開始檢查。"
    },
    "doors": [
      {
        "type": "deep",
        "badge": "深入同域",
        "targetId": "epistemology_bayes",
        "title": "貝氏定理：如何用數學量化你的直覺？",
        "hook": "當新證據出現時，你的大腦該如何像電腦一樣修正機率？",
        "icon": "📊"
      },
      {
        "type": "cross",
        "badge": "跨界跳躍",
        "targetId": "physics_least_action",
        "title": "物理學：大自然也是個懶惰鬼？",
        "hook": "光線與星球為什麼總是選擇走「最省力」的路線前進？",
        "icon": "🌌"
      },
      {
        "type": "twist",
        "badge": "反常識",
        "targetId": "twist_over_simplification",
        "title": "別把簡單當真理：愛因斯坦的警告",
        "hook": "當萬物都被簡化到不能再簡化時，我們是否反而錯失了真實世界？",
        "icon": "🔄"
      }
    ]
  }
];

window.MIND_DATABASE = MIND_DATABASE;

