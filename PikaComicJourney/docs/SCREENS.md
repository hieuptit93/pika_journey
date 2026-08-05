# Pika Comic Journey - Screens Documentation

## Overview

14 màn onboarding + 1 màn trải nghiệm (Home) + 1 màn kết thúc (Final)

**Navigation Flow:**
```
Screen0Hero → Screen1NameAge → Screen2Assessment → Screen3Diagnostic → Screen5Milestones
  ↓                                                                            ↓
  → ScreenHome (Trải nghiệm ngay)                                    Screen6SchoolGap
                                                                              ↓
                                                                     Screen7Regression
                                                                              ↓
                                                                     Screen4Proof → Screen8PikaBrain
                                                                                          ↓
                                                                                  Screen9FeatureChat
                                                                                          ↓
                                                                                  Screen10FeatureLessons
                                                                                          ↓
                                                                                  Screen11SchoolCompanion
                                                                                          ↓
                                                                                  Screen12Safety
                                                                                          ↓
                                                                                  Screen13FitCheck
                                                                                          ↓
                                                                                  ScreenFinal → ScreenHome
```

---

## Screen 0: Hero (Landing)

**File:** `src/screens/Screen0Hero.tsx`  
**Image:** `onboard_0.jpeg`  
**Purpose:** Welcome screen, introduce Pika

### Bubble Text
```
Chào cô chú! Pika đây!
Pika muốn kể một câu chuyện nhỏ về việc học tiếng Anh của bạn nhỏ nhà mình
```

### UI Elements
- Tag: "COMIC JOURNEY" (gradient sunset)
- Title: "Hành trình cùng Pika"
- Subtitle: "14 panel ngắn — Pika kiểm tra tiếng Anh của bạn nhỏ, vẽ bản đồ cột mốc, và chỉ ra khoa học đằng sau việc nói mỗi ngày."

### Actions
- "Bắt đầu khám phá" → Screen 1
- "Trải nghiệm ngay" → ScreenHome

---

## Screen 1: Name & Age

**File:** `src/screens/Screen1NameAge.tsx`  
**Image:** `onboard_1.jpeg`  
**Purpose:** Thu thập thông tin bạn nhỏ

### Bubble Text
```
Trước tiên, cho Pika biết tên bạn nhỏ và bạn nhỏ bao nhiêu tuổi nhé!
```

### Data Collected
| Field | Type | Options |
|-------|------|---------|
| `kid.name` | string | Max 20 chars |
| `kid.age` | string | "4-5", "6-7", "8-9", "10+" |

### Validation
- Name: >= 1 character
- Age: Required

### Actions
- "Tiếp tục" → Screen 2

---

## Screen 2: Assessment

**File:** `src/screens/Screen2Assessment.tsx`  
**Image:** `onboard_2.jpeg`  
**Purpose:** Đánh giá trình độ hiện tại

### Phase 1 - Bubble Text
```
Trải nghiệm học tiếng Anh hiện tại của {kid.name}
```

### Phase 1 - Data Collected
| Field | Type | Options |
|-------|------|---------|
| `kid.duration` | string | "<6m", "6-12m", "1-2y", "2y+" |
| `kid.extra` | string | "center", "online", "none" |

### Phase 2 - Bubble Text
```
Cô chú tự đánh giá kỹ năng của {kid.name} nhé
```

### Phase 2 - Data Collected (Star Rating 1-5)
| Field | Type |
|-------|------|
| `kid.speaking` | number |
| `kid.vocab` | number |
| `kid.grammar` | number |

### Actions
- Phase 1: "Tiếp tục" → Phase 2
- Phase 2: "Xem kết quả khám" → Screen 3

---

## Screen 3: Diagnostic

**File:** `src/screens/Screen3Diagnostic.tsx`  
**Image:** `onboard_3.jpeg`  
**Purpose:** Hiển thị kết quả đánh giá

### Bubble Text
```
Cùng overview lại trình độ của {kid.name} nhé ạ
```

### UI Elements
- Patient Card: "Bé {name} — {age} tuổi"
- Animated stat bars:
  - Từ vựng (gradient primary)
  - Ngữ pháp (gradient forest)
  - Kỹ năng Nói (gradient warm) - highlighted with "⚠️ Rất thiếu"

### Verdict (delayed)
```
🩺 Đánh giá: {kid.name} có nền tảng từ vựng và ngữ pháp {level}, nhưng kỹ năng nói đang thiếu thời lượng luyện tập đáng kể. Cần tăng cường luyện nói mỗi ngày!
```

### Actions
- "Cột mốc cần đạt" → Screen 5

---

## Screen 4: Proof (Results)

**File:** `src/screens/Screen4Proof.tsx`  
**Image:** `onboard_4.jpeg`  
**Purpose:** Chứng minh kết quả thực tế

### Bubble Text
```
Đây là kết quả thật của 1 bạn nhỏ sau 1 tháng với Pika — nếu {kid.name} bắt đầu hôm nay cũng được như vậy!
```

### UI Elements
- Big Number Card: "3,195" (animated count)
- Label: "lượt mở miệng nói tiếng Anh / 1 tháng"
- Mini Stats:
  - 20 ngày học
  - 13.441 từ đã nói
  - 115 từ mới học
  - 23' TB/buổi

### Actions
- "Pika làm gì để được vậy?" → Screen 8

---

## Screen 5: Milestones

**File:** `src/screens/Screen5Milestones.tsx`  
**Image:** `onboard_5.jpeg`  
**Purpose:** Giới thiệu các cột mốc 100h và 400h

### Bubble Text
```
{kid.name} nói 30 phút mỗi ngày — đây là 2 cột mốc kỳ diệu sẽ xảy ra!
```

### UI Elements - Timeline
| Node | Label | Time |
|------|-------|------|
| 0 | Bắt đầu | hôm nay |
| 100h | Bật phản xạ | ~6.5 tháng |
| 400h | Nói lưu loát | ~2 năm |

### Callouts
- **100h:** "Phản xạ tiếng Anh bật lên — bạn nhỏ bắt đầu trả lời thẳng không cần dịch trong đầu nữa"
- **400h:** "Nói lưu loát tự nhiên — bạn nhỏ tự kể chuyện, đặt câu hỏi, tự tin trò chuyện không nghĩ ngợi"

### Actions
- "Ở trường thì sao?" → Screen 6

---

## Screen 6: School Gap

**File:** `src/screens/Screen6SchoolGap.tsx`  
**Image:** `onboard_6.jpeg`  
**Purpose:** So sánh thời gian nói ở trường vs có Pika

### Bubble Text
```
Đi học thêm 2-3 buổi/tuần, Pika lấp đầy khoảng trống 5/7 ngày còn lại — để ngày nào cũng nói!
```

### UI Elements
- Week Calendar: 7 days grid
  - School days: T2, T4, T6 (✓)
  - Empty days: T3, T5, T7, CN (×)
  - Pika days: All 7 (★)
- Comparison Bars:
  - Chỉ trường: ~15p/tuần
  - + Pika: 3h 30p/tuần

### Actions
- "Nếu ngắt quãng?" → Screen 7

---

## Screen 7: Regression

**File:** `src/screens/Screen7Regression.tsx`  
**Image:** `onboard_7.jpeg`  
**Purpose:** Giải thích về việc regression khi ngừng luyện

### Bubble Text
```
Còn một bí mật quan trọng về {kid.name} mà cô chú cần biết trước cột mốc 400 giờ
```

### UI Elements
- SVG Chart: "Kỹ năng nói theo thời gian"
  - Green line: Có Pika hàng ngày (goes up)
  - Red dashed line: Ngắt quãng (goes down after break)

### Warning Card
```
⚠️ Trước cột mốc 400 giờ, nếu ngừng nói vài tuần thì phản xạ tụt nhanh. Đây là lý do luyện hàng ngày quan trọng hơn nhiều việc học dồn cuối tuần.
```

### Actions
- "Cùng xem giải pháp của Pika" → Screen 4

---

## Screen 8: Pika Brain

**File:** `src/screens/Screen8PikaBrain.tsx`  
**Image:** `onboard_8.jpeg`  
**Purpose:** Giới thiệu AI của Pika

### Bubble Text
```
Pika không phải 1 chatbot — phía sau là một bộ não có kế hoạch. Mỗi sáng Pika tự "lập trình" hôm nay nên làm gì với {kid.name}
```

### UI Elements
- Plan Card: "Hôm nay Pika quyết định:"
  - 7:30 - Khởi động bằng chủ đề siêu anh hùng
  - 7:35 - Ôn 3 từ fly, save, hero
  - 7:42 - Nhập vai bảo vệ thành phố

- 3 Feature Cards:
  - Trò chuyện (gradient primary)
  - Bài học (gradient forest)
  - Đồng hành trường (gradient warm)

- Adaptive Progress Bar:
  - Ngày 1: Học tên & sở thích
  - Tuần 2: Nhớ điểm yếu
  - Tháng 3+: Tự chọn bài tối ưu

### Actions
- "Xem từng tính năng" → Screen 9

---

## Screen 9: Feature Chat

**File:** `src/screens/Screen9FeatureChat.tsx`  
**Image:** `onboard_9.jpeg`  
**Purpose:** Demo tính năng trò chuyện

### Bubble Text
```
Tính năng 1: Pika trò chuyện với {kid.name} như 2 người bạn — về phim, game, sở thích. Càng nói càng hiểu bạn nhỏ hơn
```

### UI Elements
- Chat Demo:
  ```
  Pika: Hey {kid.name}! Hôm qua xem Spider-Man chưa? 🕷️
  Kid: Yes! Spider-Man saved a cat from a tree!
  Pika: Cool! "Saved" là quá khứ của save đó. Kể tiếp đi!
  Kid: He climbed the building and... umm...
  Pika: "Climbed the building" hay quá! Rồi sao nữa? 🤩
  ```

- Memory Card:
  ```
  Pika nhớ: {kid.name} mê siêu anh hùng, hơi nhút nhát lúc đầu, thích kể chuyện trước khi đi ngủ. Tuần sau Pika sẽ hỏi về Iron Man!
  ```

- Topic Chips: 🎬 Phim, 🎮 Game, 🏫 Trường, 👨‍👩‍👧 Gia đình, ⚽ Thể thao, 🍕 Đồ ăn, 🐶 Thú cưng

### Actions
- "Bài học có cấu trúc" → Screen 10

---

## Screen 10: Feature Lessons

**File:** `src/screens/Screen10FeatureLessons.tsx`  
**Image:** `onboard_10.jpeg`  
**Purpose:** Giới thiệu 4 kiểu bài luyện

### Bubble Text
```
Tính năng 2: Khi cần học có cấu trúc, Pika có sẵn 4 kiểu bài luyện — tap để xem nhé!
```

### Lesson Types (Expandable)
| Type | Title | Subtitle | Gradient |
|------|-------|----------|----------|
| pronunciation | Luyện phát âm | Nghe mẫu → nói lại → sửa từng âm | Ocean |
| phrases | Học cụm từ thông dụng | Cụm dùng hàng ngày, không học rời | Forest |
| roleplay | Nhập vai xử lý tình huống | Tình huống thật, xử bằng tiếng Anh | Warm |
| presentation | Luyện thuyết trình | Nói liền 30s–1p về 1 chủ đề | Sunset |

### Actions
- "Đồng hành trường" → Screen 11

---

## Screen 11: School Companion

**File:** `src/screens/Screen11SchoolCompanion.tsx`  
**Image:** `onboard_11.jpeg`  
**Purpose:** Tính năng đồng hành với chương trình trường

### Bubble Text
```
Pika theo dõi chương trình trên trường của {kid.name} — tối là ôn lại + luyện nói đúng chủ đề hôm đó
```

### Schedule Grid
| Day | School Topic | Pika Review |
|-----|--------------|-------------|
| T2 | 🐘 | +15 từ |
| T3 | 🍎 | Story |
| T4 | ⛅ | Roleplay |
| T5 | 👨‍👩‍👧 | Quiz |
| T6 | 🎨 | Show & Tell |

### Pairing Benefits
- Ôn tập, củng cố cấu trúc, từ vựng
- Luyện nói, nghe và giao tiếp cho các chủ đề đó

### Actions
- "An toàn cho bạn nhỏ?" → Screen 12

---

## Screen 12: Safety

**File:** `src/screens/Screen12Safety.tsx`  
**Image:** `onboard_12.jpeg`  
**Purpose:** Giải thích về an toàn AI

### Bubble Text
```
"AI có an toàn cho {kid.name} không?" Pika được thiết kế như lan can cầu thang — giữ bạn nhỏ đi an toàn hơn rất nhiều
```

### 4 Safety Layers
| Layer | Title | Description |
|-------|-------|-------------|
| 1 | Lọc nội dung trước phản hồi | Mọi câu trả lời được kiểm tra |
| 2 | Luôn bám mục tiêu học | Biết kéo bạn nhỏ về học khi đi lạc chủ đề |
| 3 | Sửa nhẹ nhàng theo tuổi | Không phủ nhận toàn câu |
| 4 | Dashboard cho cô chú | Cô chú xem được bạn nhỏ tương tác |

### Parent Tips
- Đồng hành 2–3 ngày đầu để bạn nhỏ quen Pika
- Nhắc nhẹ mỗi tối: "Hôm nay nói với Pika chưa?"
- Khen khi thấy bạn nhỏ tự chủ động — dù chỉ 5 phút
- Cô chú không cần giỏi tiếng Anh — Pika lo phần đó

### Actions
- "Pika hợp với bạn nhỏ?" → Screen 13

---

## Screen 13: Fit Check

**File:** `src/screens/Screen13FitCheck.tsx`  
**Image:** `onboard_13.jpeg`  
**Purpose:** Câu hỏi cuối về cam kết

### Bubble Text
```
Câu hỏi cuối! Cô chú có dành được 10–20 phút/ngày đồng hành cùng {kid.name} trong tuần đầu tiên không ạ?
```

### Choices
| Choice | Text | Value |
|--------|------|-------|
| A | Được! Mình sẵn sàng đồng hành | "yes" |
| B | Có thể — mình bận nhưng sẽ cố | "maybe" |
| C | Muốn Pika tự lo được cho bạn nhỏ | "auto" |

### Data Collected
- `interaction.fitChoice`: "yes" | "maybe" | "auto"

### Actions
- Any choice → ScreenFinal

---

## Screen Final: Completion

**File:** `src/screens/ScreenFinal.tsx`  
**Image:** `onboard_14.jpeg`  
**Purpose:** Kết thúc onboarding, CTA

### Bubble Text
```
Cùng trải nghiệm các tính năng của Pika nhé!
```

### Success Card
```
Cùng Pika bắt đầu hành trình của {kid.name}!
```

### Description
```
Mỗi ngày 30 phút — không bỏ ngày nào — Pika đồng hành cùng bạn nhỏ tới cột mốc 100 giờ rồi 400 giờ nói tiếng Anh tự nhiên.
```

### Actions
- "Đăng ký tư vấn" → External
- "Trải nghiệm các tính năng" → ScreenHome
- "Đọc lại từ đầu" → Screen 0

---

## Screen Home: Learning Map

**File:** `src/screens/ScreenHome.tsx`  
**Image:** `map.jpeg` (full screen background)  
**Purpose:** Trải nghiệm tính năng học - gamified roadmap

### Features
- Full-screen map background
- 6 Units positioned on map with different positions for iPhone/Tablet
- Direct tap on lessons (no modal)
- Responsive design with `isTablet` detection

### Units Data
See `screens.json` for complete unit and lesson data.

### Responsive Sizing
| Element | iPhone | Tablet |
|---------|--------|--------|
| Lesson Card Width | 38px | 64px |
| Lesson Font Size | 6px | 11px |
| Lesson Icon Size | 14px | 28px |
| Header Number | 16px | 26px |
| Header Font | 7px | 12px |
