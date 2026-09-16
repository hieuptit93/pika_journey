# Pika Tablet Fauna — v1.3.4

Kiosk tablet dọc 952×1269 cho góc trải nghiệm Robot Pika. Bản này tách file `pikatabletfaunav133.html` (1 file 860KB) thành folder module nhỏ, dễ sửa, **đồng thời áp toàn bộ đề xuất tối ưu UI/UX** (xem changelog cuối file).

Mở `index.html` bằng Chrome là chạy — không cần build, không cần server.

---

## Cấu trúc folder — sửa gì thì mở file nào

```
pika-tablet-fauna-v134/
├── index.html            ← khung HTML 6 màn + 5 modal (chỉ sửa khi thêm/bớt phần tử)
├── css/
│   ├── tokens.css        ← ⭐ MÀU / CỠ CHỮ / SPACING / BO GÓC / TOUCH TARGET toàn cục
│   ├── base.css          ← reset, sân khấu scale, nền trời, hệ tiêu đề màn, scene engine
│   ├── chrome.css        ← tabs, nút cài đặt, mũi tên, dots, dock thoại, toast, sessionBar
│   ├── scene-welcome.css ← màn Chào (vùng chạm + hiệu ứng trên ảnh nền)
│   ├── scene-play.css    ← màn Chơi (4 thẻ trò + hệ pill CTA)
│   ├── scene-learn.css   ← màn Học tập (5 ốc đảo + chip bài học)
│   ├── scene-journey.css ← màn Lộ trình (timeline + panel tổng kết + bottom-sheet demo)
│   ├── scene-parents.css ← màn Ba mẹ (3 benefit + phone mock)
│   ├── scene-faq.css     ← màn Hỏi đáp (accordion + khối QR + CTA)
│   └── modals.css        ← 5 modal (bài học / thử thách / kết quả / chặng / quà)
├── js/
│   ├── config.js         ← ⭐ TOÀN BỘ COPY & DATA: thoại Pika, bài học, thử thách,
│   │                        demo hội thoại, nội dung màn Ba mẹ, thời gian idle…
│   ├── core.js           ← tiện ích: scale, âm thanh synth, confetti, sao, toast, dock,
│   │                        long-press nút cài đặt
│   ├── scenes.js         ← chuyển màn, tabs/mũi tên/dots/vuốt, màn Chào
│   ├── play.js           ← chọn trò → thử thách → session → mini-result
│   ├── learn.js          ← ốc đảo + popup bài học
│   ├── journey.js        ← timeline, modal chặng, quà, demo bottom-sheet
│   ├── parents.js        ← 3 benefit + phone demo
│   └── misc.js           ← FAQ, âm thanh, reset, idle 90s, init (LUÔN load cuối)
└── assets/img/           ← 15 ảnh đã tách khỏi data-URI, tên ngữ nghĩa
```

**80% nhu cầu sửa hằng ngày nằm ở 2 file có dấu ⭐:**

- Đổi câu thoại, tên bài học, kịch bản demo, số liệu → `js/config.js` (thuần data, không có logic).
- Đổi màu accent, cỡ chữ, khoảng cách, độ bo góc → `css/tokens.css` (đổi 1 biến là ăn toàn cục).
- Thay ảnh → bỏ file mới vào `assets/img/` trùng tên (hoặc đổi đường dẫn trong `index.html`).
- Sửa câu hỏi FAQ → sửa trực tiếp HTML trong `index.html` (mục scene faq).

Thứ tự load bắt buộc: CSS `tokens → base → chrome → scene-* → modals`; JS `config → core → scenes → play → learn → journey → parents → misc`. Thêm file mới thì chèn đúng tầng.

---

## Nguyên tắc thiết kế đang áp dụng (giữ khi sửa tiếp)

1. **"1 đèn amber mỗi màn"** — mỗi màn chỉ có đúng 1 nút amber đang pulse (CTA chính). Nút phụ dùng style ghost (navy nhạt + viền). Đừng thêm nút amber pulse thứ hai.
2. **Hệ nút 3 cấp** — cấp 1: amber gradient + glow (`.btn-a`, pill của thẻ được chọn); cấp 2: ghost có viền (`.btn-g`, `.chip`, pill mặc định); cấp 3: nav mờ (`.arrow`, `.m-x`, `.round-btn.ghost`).
3. **Motion có chủ đích** — minh họa chỉ bay ở thẻ đang chọn/chặng current; hiệu ứng lặp vô hạn chỉ dành cho nhân vật Pika ở màn Chào. Hover chỉ tồn tại trong `@media (hover:hover)`.
4. **Touch target cho trẻ** — chip trẻ bấm ≥ 44px (`--tap-chip`), CTA 54px (`--tap-cta`), nút đóng ≥ 44px (`--tap-min`). Đừng hạ thấp hơn.
5. **Font theo vai** — Baloo 2 = nội dung hướng về trẻ; Cormorant (serif) = storytelling cho ba mẹ; Be Vietnam = body/UI. Không trộn 2 font heading trong cùng 1 lưới thẻ.
6. **Chữ ≥ 12px, chữ nhỏ không dùng màu `--t-4`** (tương phản thấp).

---

## Changelog v1.3.3 → v1.3.4

**Sửa bug**

- Chip nhân vật (Elsa/Doraemon) hiện sai trong modal Kể chuyện/Hát: `display:flex` đè thuộc tính `hidden` → thêm `.char-chips[hidden]{display:none!important}`.
- Node tròn trên timeline Lộ trình nhìn như bấm được nhưng không có handler → giờ bấm node mở đúng chặng.
- Xoá CSS chết của "rương quà" (`.chest`) không còn phần tử nào dùng.

**Visual hierarchy**

- Pill "Chơi ngay": mặc định ghost, chỉ thẻ được chọn mới amber + pulse (trước đây cả 4 cùng nhấp nháy).
- Bỏ pre-select thẻ/ốc đảo đầu tiên — khách tự chọn thì thẻ sáng lên mới có nghĩa.
- Mũi tên prev/next đổi từ amber đặc → ghost (điều hướng phụ không cạnh tranh với CTA).
- FAQ: nút "Cho con chơi lại" tách khỏi khối QR Zalo, đứng riêng canh giữa.
- sessionBar pulse 3 nhịp rồi dừng (trước: vô hạn).

**Motion diet**

- Cắt loop vô hạn: artFloat 4 thẻ, islandDrift 5 ốc đảo + 5 chặng (chỉ chạy khi selected/current), ctaPulse 4 nút → 1 nút, icoWiggle trong modal (giờ lóe 1 lần khi mở), heroSpark (chỉ lóe khi chạm Pika), twinkle giảm 14 → 6 điểm.
- Toàn bộ `:hover` bọc trong `@media (hover:hover)` — hết trạng thái "dính" trên màn cảm ứng.
- Demo hội thoại ở Lộ trình đổi thành bottom-sheet trượt từ đáy (trước: đè lên khối thống kê).

**Kiosk & touch**

- Nút cài đặt (reset lượt thử): phải **giữ 1.2 giây** mới mở — trẻ bấm nhanh chỉ thấy nút nảy, không vào được reset. FAQ và ghi chú trong panel đã cập nhật hướng dẫn.
- Idle 90s: hiện cảnh báo "Pika sắp về màn chào…" 10 giây trước khi tự reset.
- Chip bài học 32–36px → 44px; dchip 40 → 48px; nút đóng modal/sheet 26–36px → 44px; pill CTA 46 → 54px; toggle FAQ 26 → 40px.

**Token hoá & layout**

- Toàn bộ màu/cỡ chữ/spacing/bo góc gom về `css/tokens.css`; sàn cỡ chữ 12px (trước có 9.5px, 11px).
- Màn Lộ trình: heading + 4 stat + panel demo + note gộp thành 1 panel duy nhất, hết chen chúc đáy màn.
- Thống nhất nhịp tiêu đề mọi màn (eyebrow 96 → title 118 → sub 184); title các màn cùng cỡ `--fs-5xl`.
- Thẻ "Đoán nhân vật" dùng chung font Baloo với 3 thẻ còn lại (trước lệch serif).
- Chữ phụ nhỏ đổi từ `--t-4` sang `--t-3` cho đủ tương phản.

**Kỹ thuật**

- 1 file 860KB → HTML 30KB + 10 CSS + 8 JS + 15 ảnh rời (tổng ~500KB, ảnh được cache riêng).
- Thẻ bấm được đổi `<button>` lồng `<h3>` (HTML không hợp lệ) → `<article role="button">` + nút thật bên trong.
- Toàn bộ copy/data tách khỏi logic vào `js/config.js`.

---

## Ghi chú vận hành

- Thiết kế cho tablet **dựng dọc**; stage tự scale theo màn hình, dư viền sẽ là nền đen.
- Cần mạng lần đầu để tải Google Fonts (Baloo 2, Be Vietnam Pro, Cormorant Garamond); không có mạng thì fallback font hệ thống, layout không vỡ.
- Reset cho khách tiếp theo: giữ nút bánh răng 1 giây → "Reset lượt thử". Máy cũng tự về màn chào sau 90 giây không ai chạm.
