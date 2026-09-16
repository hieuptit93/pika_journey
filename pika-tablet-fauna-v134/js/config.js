/* ==========================================================================
   CONFIG — TOÀN BỘ nội dung chữ + dữ liệu cấu hình nằm ở đây.
   Team marketing sửa copy/bài học/kịch bản demo CHỈ cần đụng file này.
   ========================================================================== */
"use strict";

const CFG = {

  /* thứ tự màn + nền tương ứng */
  ORDER: ["welcome", "play", "learn", "journey", "parents", "faq"],
  PLATE: { welcome:"plateWelcome", play:"plateLand", learn:"plateLand",
           journey:"plateFlat", parents:"plateFlat", faq:"plateFlat" },

  /* các màn hiển thị sessionBar "Xem kết quả" khi đang có lượt chơi */
  BAR_SCENES: ["welcome", "play", "learn", "faq"],

  /* idle: tự về màn chào sau 90s — cảnh báo trước 10s */
  IDLE_MS: 90000,
  IDLE_WARN_MS: 10000,
  IDLE_WARN_TEXT: "Pika sắp về màn chào nếu không ai chạm nữa nha…",

  /* vị trí sao lấp lánh trên nền (giảm còn 6 điểm cho đỡ nhiễu) */
  TWINKLES: [[86,196],[318,1024],[560,132],[880,470],[300,640],[120,1060]],

  /* thoại Pika ở dock khi vào màn (faq không cần — đã ở ngay màn hỏi đáp) */
  DOCK_MSG: {
    learn:   "Con chọn ốc đảo con thích để bắt đầu nha!",
    journey: "Ba mẹ chạm từng chặng — Pika kể con sẽ nói được gì nha!",
    parents: "Phần này dành cho ba mẹ đó! Pika chờ con ở đây nha."
  },

  /* thoại Pika ở màn chào (bấm vào Pika sẽ random 1 câu) */
  HERO_LINES: [
    "Hi hi! Tớ là Pika — chạm “Chơi Ngay” đi!",
    "Cậu sẵn sàng nói tiếng Anh với tớ chưa?",
    "Tớ biết kể chuyện, hát và cả đóng vai nữa!",
    "Nhột quá! Mình cùng chơi 15 phút nhé?"
  ],
  HERO_HINT: "Chạm “Chơi Ngay” để bắt đầu nha!",

  /* thử thách tiếng Anh theo trò chơi */
  CHALLENGES: {
    story:   { ico:"📖", sentence:"Tell me a story, please.", badge:{ e:"📖", name:"Story Starter" } },
    song:    { ico:"🎵", sentence:"Let's sing together!",     badge:{ e:"🎵", name:"Music Star" } },
    english: { ico:"💬", sentence:"I can speak English!",     badge:{ e:"✨", name:"Magic Speaker" } },
    guess:   { ico:"🦸", sentence:"I am ready.",              badge:{ e:"🦸", name:"Brave Hero" } }
  },
  CHAR_SPELLS: {
    elsa:     { sentence:"Elsa is brave.",     badge:{ e:"❄️", name:"Ice Magic Speaker" } },
    doraemon: { sentence:"Doraemon is funny.", badge:{ e:"🔵", name:"Magic Pocket" } },
    hero:     { sentence:"I am ready.",        badge:{ e:"🦸", name:"Brave Hero" } }
  },
  CONNECT_STEPS: [
    "📡 Đang kết nối với Pika…",
    "📦 Gửi thử thách sang Pika…",
    "🤖 Pika sẵn sàng! Bé quay sang chơi với Pika nha!"
  ],

  /* bài học của 5 ốc đảo (id khớp data-lesson trong index.html) */
  LESSONS: {
    z1a:{ico:"🔍",zone:"Ốc đảo 1 · Làm quen",title:"Khám phá cùng Pika",desc:"Pika tự giới thiệu, con làm quen bạn robot mới.",time:"3–5 phút",tasks:[["👋","Pika chào: “Hello! I am Pika!”"],["🤖","Con hỏi Pika 1 điều con tò mò"],["🌟","Nói lại 1 từ mới cùng Pika"]]},
    z1b:{ico:"💬",zone:"Ốc đảo 1 · Làm quen",title:"Trò chuyện cùng Pika",desc:"Cuộc nói chuyện đầu tiên, ngắn và thật dễ.",time:"3–5 phút",tasks:[["🗣️","Con nói tên và tuổi của con"],["❓","Pika hỏi: “What do you like?”"],["✅","Trả lời bằng 1 câu ngắn"]]},
    z1c:{ico:"🔊",zone:"Ốc đảo 1 · Làm quen",title:"Làm quen âm thanh",desc:"Nghe và bắt chước âm tiếng Anh đầu tiên.",time:"2–3 phút",tasks:[["👂","Nghe Pika đọc 3 âm vui tai"],["🎤","Bắt chước lại từng âm"],["🎉","Pika khen và sửa thật nhẹ"]]},
    z2a:{ico:"🔍",zone:"Ốc đảo 2 · Pre-A1",title:"Khám phá cùng Pika",desc:"Pika dẫn con khám phá từ mới bằng hình ảnh và câu hỏi dễ.",time:"4–6 phút",tasks:[["👀","Nhìn 3 hình và đoán từ"],["🗣️","Nói 1 từ con vừa học"],["🌟","Pika hỏi thêm 1 câu thật ngắn"]]},
    z2b:{ico:"🧩",zone:"Ốc đảo 2 · Pre-A1",title:"Nạp cụm từ",desc:"Học 3 cụm từ mới qua trò chơi nhanh.",time:"4–6 phút",tasks:[["🃏","Đoán nghĩa qua hình ảnh"],["🗣️","Nói cụm: “a red apple”"],["🎯","Dùng cụm trong 1 câu"]]},
    z2c:{ico:"🎵",zone:"Ốc đảo 2 · Pre-A1",title:"Hát cùng Pika",desc:"Bài hát quen thuộc, con hát theo từng câu.",time:"3–4 phút",tasks:[["🎶","Pika mở bài hát con thích"],["🎤","Hát theo 1 đoạn ngắn"],["⭐","Lặp lại 1 từ trong bài"]]},
    z2d:{ico:"✏️",zone:"Ốc đảo 2 · Pre-A1",title:"Luyện tập",desc:"Ôn lại từ đã học bằng câu hỏi nhanh.",time:"4–5 phút",tasks:[["❓","Pika đố 3 câu về từ đã học"],["🗣️","Con trả lời bằng câu ngắn"],["💎","Đúng là có thưởng liền"]]},
    z3a:{ico:"🧩",zone:"Ốc đảo 3 · A1–A2",title:"Nạp cụm nâng cao",desc:"Con học cụm dài hơn và dùng ngay trong tình huống nhỏ.",time:"5–6 phút",tasks:[["🃏","Ghép cụm với hình đúng"],["🗣️","Nói cụm: “I would like…”"],["🎯","Tạo 1 câu dài hơn cùng Pika"]]},
    z3b:{ico:"🎭",zone:"Ốc đảo 3 · A1–A2",title:"Role-play",desc:"Con và Pika đóng vai trong một câu chuyện.",time:"5–7 phút",tasks:[["🏪","Mở cửa hàng: con là người bán"],["💬","Nói: “Welcome to my store!”"],["🎬","Diễn tiếp 2 lượt thoại"]]},
    z3c:{ico:"🎤",zone:"Ốc đảo 3 · A1–A2",title:"Luyện tập nói",desc:"Nói câu dài hơn, Pika nghe và sửa nhẹ.",time:"5–6 phút",tasks:[["🗣️","Kể 30 giây về đồ chơi con thích"],["👂","Pika nghe và khen ý hay"],["🔁","Nói lại 1 câu cho mượt"]]},
    z3d:{ico:"🔊",zone:"Ốc đảo 3 · A1–A2",title:"Sửa phát âm",desc:"Tập âm khó qua cặp từ gần giống nhau.",time:"3–5 phút",tasks:[["👂","Nghe: “ship” và “sheep”"],["🎤","Con nói lại từng từ"],["✨","Pika chỉ chỗ đặt miệng đúng"]]},
    z4a:{ico:"🌍",zone:"Ốc đảo 4 · Mở rộng",title:"Khám phá kiến thức",desc:"Hỏi Pika về thế giới — bằng tiếng Anh dễ.",time:"5–7 phút",tasks:[["🦖","Hỏi: “How big is a dinosaur?”"],["💡","Pika kể 1 điều bất ngờ"],["🗣️","Con nói lại 1 fact yêu thích"]]},
    z4b:{ico:"📖",zone:"Ốc đảo 4 · Mở rộng",title:"Đọc hiểu & trả lời",desc:"Đọc đoạn ngắn rồi trả lời câu hỏi của Pika.",time:"5–7 phút",tasks:[["📖","Đọc 3 câu chuyện mini"],["❓","Pika hỏi 2 câu về chuyện"],["✅","Trả lời bằng câu ngắn"]]},
    z4c:{ico:"💬",zone:"Ốc đảo 4 · Mở rộng",title:"Thảo luận",desc:"Nói ý kiến của con về một chủ đề vui.",time:"5–7 phút",tasks:[["🤔","Chủ đề: “Mèo hay chó dễ thương hơn?”"],["🗣️","Con nói ý kiến + 1 lý do"],["🤝","Pika phản hồi và hỏi tiếp"]]},
    z4d:{ico:"🔤",zone:"Ốc đảo 4 · Mở rộng",title:"Từ vựng nâng cao",desc:"Mở rộng vốn từ theo chủ đề con đang tò mò.",time:"5–7 phút",tasks:[["📚","Chọn 1 chủ đề con thích"],["🗣️","Học 4 từ mới qua ví dụ"],["🎯","Dùng 2 từ trong câu của con"]]},
    z5a:{ico:"🎁",zone:"Ốc đảo 5 · Dịp đặc biệt",title:"Lễ hội & sự kiện",desc:"Học từ vựng theo mùa lễ hội đang diễn ra.",time:"4–6 phút",tasks:[["🎄","Từ vựng: Christmas, gift, star"],["🎶","Hát 1 đoạn nhạc lễ hội"],["🗣️","Chúc bằng tiếng Anh"]]},
    z5b:{ico:"⭐",zone:"Ốc đảo 5 · Dịp đặc biệt",title:"Từ vựng theo chủ đề",desc:"Gói từ vựng theo dịp con đang hào hứng.",time:"4–5 phút",tasks:[["🎂","Chủ đề sinh nhật: cake, candle"],["🃏","Đoán từ qua mô tả của Pika"],["🗣️","Đặt 1 câu với từ mới"]]},
    z5c:{ico:"💬",zone:"Ốc đảo 5 · Dịp đặc biệt",title:"Trò chuyện chủ đề",desc:"Pika mở cuộc trò chuyện ngắn theo dịp hoặc sở thích của con.",time:"5–6 phút",tasks:[["🎈","Chọn chủ đề: sinh nhật, Noel, Halloween"],["🗣️","Trả lời 3 câu hỏi vui"],["✨","Nói 1 lời chúc bằng tiếng Anh"]]},
    z5d:{ico:"📋",zone:"Ốc đảo 5 · Dịp đặc biệt",title:"Dự án nhỏ",desc:"Làm 1 sản phẩm mini rồi kể bằng tiếng Anh.",time:"7–10 phút",tasks:[["✂️","Làm thiệp chúc đơn giản"],["🖍️","Pika gợi ý câu để viết"],["🎤","Con giới thiệu thiệp của mình"]]}
  },

  /* demo hội thoại ở màn Lộ trình */
  DEMOS: {
    story:      { label:"Kể chuyện", lines:["Pika: Con muốn nghe chuyện gì?", "Con: Công chúa và robot!", "Pika: Once upon a time, a brave princess met a tiny robot ✨"] },
    structured: { label:"Học từ",    lines:["Pika: Hôm nay mình có nhiệm vụ 3 phút.", "Con: Nhiệm vụ gì?", "Pika: Learn 3 words, then save the city in English! 🦸"] },
    roleplay:   { label:"Đóng vai",  lines:["Pika: Hôm nay mình mở cửa hàng sách nhé.", "Con: Con là người bán hàng!", "Pika: Perfect! Say: “Welcome to my bookstore.” 📚"] },
    song:       { label:"Hát",       lines:["Pika: Mình hát một bài tiếng Anh nhé.", "Con: Baby Shark!", "Pika: Great! Sing with me: Baby shark, doo doo doo 🎵"] }
  },

  /* nội dung 3 benefit ở màn Ba mẹ (hàng bắt đầu bằng % = thanh tiến độ) */
  PHONE: {
    send: { kicker:"01 · Giao bài", pill:"Giao bài thử", title:"Một chạm là Pika sẽ nhận bài ngay",
      capT:"Ba mẹ chọn bài, Pika nhận ngay", capB:"Không cần cài đặt lại trên robot,<br/>không làm gián đoạn cuộc chơi.",
      rows:["🧒 Bé 7 tuổi", "🦸 Chủ đề: siêu anh hùng", "🔊 Bài: luyện phát âm", "▶️ Gửi sang Pika"] },
    report: { kicker:"02 · Tiến độ", pill:"Tuần này +18%", title:"Mỗi ngày, ba mẹ đều thấy con tiến bộ",
      capT:"Báo cáo ngắn sau mỗi buổi học", capB:"Biết con đã nói bao lâu, nhớ từ nào<br/>và nên học gì tiếp theo.",
      rows:["⏱️ Hôm nay: nói 12 phút", "🆕 7 từ mới", "%72", "🎯 Kế tiếp: âm “sh”"] },
    safety: { kicker:"03 · An toàn", pill:"Đang bảo vệ", title:"Mọi thiết lập đều trong tay ba mẹ",
      capT:"Ba mẹ kiểm soát mọi thiết lập", capB:"Chọn chủ đề phù hợp, kiểm tra memory<br/>và đặt lại bất cứ lúc nào.",
      rows:["✅ Chủ đề an toàn: BẬT", "🖼️ Lọc hình ảnh: BẬT", "🧠 Xem trí nhớ của Pika", "↺ Xoá trí nhớ lượt chơi"] }
  },
  BEN_KEYS: ["send", "report", "safety"]
};
