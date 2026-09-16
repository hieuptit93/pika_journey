/* ==========================================================================
   MISC — FAQ, âm thanh, reset lượt thử, idle 90s (có cảnh báo 10s cuối), init.
   Load CUỐI CÙNG.
   ========================================================================== */
"use strict";

/* ================= FAQ ================= */
$("#faqList").addEventListener("click", e => {
  const q = e.target.closest(".faq-q"); if (!q) return;
  q.closest(".faq").classList.toggle("open"); sTap();
});

/* ================= SOUND ================= */
function setSound(on){
  soundOn = on;
  $("#soundState").textContent = on ? "BẬT" : "TẮT";
  $("#soundBtn").classList.toggle("muted", !on);
}
$("#soundRow").addEventListener("click", e => {
  e.stopPropagation(); setSound(!soundOn);
  toast(soundOn ? "Đã bật âm thanh" : "Đã tắt âm thanh");
  if (soundOn) sPop();
});
$("#soundBtn").addEventListener("click", () => {
  setSound(!soundOn);
  toast(soundOn ? "Đã bật âm thanh" : "Đã tắt âm thanh");
  if (soundOn) sPop();
});

/* ================= RESET (không pre-select thẻ/ốc đảo nào) ================= */
function doReset(silent){
  stars = 0;
  $("#starCount").textContent = "0";
  $("#starBadge").textContent = "0";
  $("#kioskBtn").classList.remove("has");
  $$(".pcard").forEach(c => c.classList.remove("is-selected"));
  $$(".zone").forEach(z => z.classList.remove("is-selected"));
  renderBenefit("send");
  doneSteps.clear(); rewardOpened = false;
  jCards.forEach((c, i) => { c.classList.remove("done"); c.classList.toggle("current", i === 0); });
  jNodes.forEach((n, i) => { n.classList.remove("done"); n.classList.toggle("current", i === 0); });
  crystals.forEach(c => c.classList.remove("earned"));
  renderDemo("story", false);
  $$(".dchip").forEach((c, i) => c.classList.toggle("active", i === 0));
  $("#demoPop").classList.remove("show");
  $$(".faq").forEach((c, i) => c.classList.toggle("open", i === 0));
  closeLesson(); connecting = false; closeChallenge(); closeResult();
  $("#rewardOv").classList.remove("show"); $("#jOv").classList.remove("show");
  $("#kioskPanel").classList.remove("show");
  session = null; syncSession();
  $("#dock").classList.remove("show");
  $("#heroBubble").classList.remove("show");
  goTo("welcome");
  if (!silent) toast("Đã reset lượt thử");
}
$("#resetBtn").addEventListener("click", e => { e.stopPropagation(); doReset(false); });

/* ================= IDLE: cảnh báo 10s cuối rồi tự về màn chào ================= */
let idleT = null, idleWarnT = null;
function pokeIdle(){
  clearTimeout(idleT); clearTimeout(idleWarnT);
  idleWarnT = setTimeout(() => {
    if (cur !== "welcome" || stars > 0) toast(CFG.IDLE_WARN_TEXT);
  }, CFG.IDLE_MS - CFG.IDLE_WARN_MS);
  idleT = setTimeout(() => { if (cur !== "welcome" || stars > 0) doReset(true); }, CFG.IDLE_MS);
}
["pointerdown", "keydown"].forEach(ev => addEventListener(ev, pokeIdle, { passive:true }));
pokeIdle();

/* ================= INIT ================= */
syncChrome();
const initial = location.hash ? location.hash.slice(1) : "";
if (CFG.ORDER.includes(initial) && initial !== cur) setTimeout(() => goTo(initial), 90);
