/* ==========================================================================
   PARENTS — 3 benefit + phone demo (nội dung từ CFG.PHONE).
   Hàng bắt đầu bằng "%" trong rows = thanh tiến độ (vd "%72" → bar 72%).
   ========================================================================== */
"use strict";

let benIdx = 0;
function renderBenefit(key){
  const d = CFG.PHONE[key] || CFG.PHONE.send;
  benIdx = Math.max(0, CFG.BEN_KEYS.indexOf(key));
  $("#paKicker").textContent = d.kicker;
  $("#paPill").textContent = d.pill;
  $("#paTitle").textContent = d.title;
  $("#paCapTitle").textContent = d.capT;
  $("#paCapText").innerHTML = d.capB;
  $("#phoneScreen").innerHTML = '<div class="phone-notch"></div>' + d.rows.map((r, i) =>
    r.startsWith("%")
      ? '<div class="mini-bar" style="animation-delay:' + (i * .07) + 's"><i style="width:' + r.slice(1) + '%"></i></div>'
      : '<div class="mini-row" style="animation-delay:' + (i * .07) + 's"><span class="em">' + r.slice(0, 2) + "</span>" + r.slice(2) + "</div>"
  ).join("");
  $$(".ben").forEach(b => b.classList.toggle("active", b.dataset.benefit === key));
  $$("#paDots i").forEach((d2, i) => d2.classList.toggle("on", i === benIdx));
}
renderBenefit("send");

$("#benRow").addEventListener("click", e => {
  const b = e.target.closest(".ben"); if (!b) return;
  sTap(); renderBenefit(b.dataset.benefit);
});
function stepBenefit(dir){
  const n = (benIdx + dir + CFG.BEN_KEYS.length) % CFG.BEN_KEYS.length;
  sTap(); renderBenefit(CFG.BEN_KEYS[n]);
}
$("#paPill").addEventListener("click", () => {
  sPop();
  if (CFG.BEN_KEYS[benIdx] === "send"){ goTo("learn"); say("Ba mẹ chọn một ốc đảo, rồi chạm vào bài để giao cho Pika nha!"); }
  else toast("Ba mẹ xem chi tiết trong app phụ huynh nhé");
});
