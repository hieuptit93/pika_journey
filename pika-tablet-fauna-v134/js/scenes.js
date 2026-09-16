/* ==========================================================================
   SCENES — máy chuyển màn: goTo/syncChrome, tabs, mũi tên, dots, vuốt,
   phím mũi tên, và màn Welcome (Pika chào + spark khi chạm).
   ========================================================================== */
"use strict";

const SCENES = Object.fromEntries($$(".scene").map(s => [s.dataset.scene, s]));
let cur = "welcome";

function goTo(name){
  if (!SCENES[name] || name === cur) return;
  const fromIdx = CFG.ORDER.indexOf(cur), toIdx = CFG.ORDER.indexOf(name);
  const oldS = SCENES[cur], newS = SCENES[name];
  oldS.classList.remove("active");
  oldS.classList.toggle("exit-left", toIdx > fromIdx);
  newS.classList.toggle("exit-left", toIdx < fromIdx);
  void newS.offsetWidth;
  newS.classList.add("active");
  cur = name;
  sWhoosh(); syncChrome();
  /* dock: 1 vị trí cố định cho từng màn */
  $("#dock").classList.toggle("slot-journey", name === "journey");
  $("#dock").classList.toggle("slot-low", name === "parents");
  if (CFG.DOCK_MSG[name]) say(CFG.DOCK_MSG[name]); else $("#dock").classList.remove("show");
  if (name === "welcome") setTimeout(() => heroSay(CFG.HERO_HINT), 500);
}

function syncChrome(){
  const idx = CFG.ORDER.indexOf(cur), isW = cur === "welcome";
  $$(".tab").forEach(t => t.classList.toggle("active", t.dataset.go === cur));
  $("#tabs").classList.toggle("hide", isW);
  $("#kiosk").classList.toggle("on-welcome", isW);
  $("#kioskPanel").classList.remove("show");
  const showArrows = cur === "play" || cur === "learn";
  $("#prevBtn").classList.toggle("hidden", idx === 0 || !showArrows);
  $("#nextBtn").classList.toggle("hidden", idx === CFG.ORDER.length - 1 || !showArrows);
  $("#sceneDots").classList.toggle("hide", isW);
  syncSession();
  $$("#sceneDots .d").forEach((d, i) => d.classList.toggle("active", i === idx));
  ["plateWelcome", "plateLand", "plateFlat"].forEach(id => $("#" + id).classList.toggle("on", CFG.PLATE[cur] === id));
  $("#moon").classList.toggle("on", CFG.PLATE[cur] === "plateLand");
}

/* dots */
CFG.ORDER.forEach((name, i) => {
  const b = document.createElement("button");
  b.className = "d" + (i === 0 ? " active" : "");
  b.setAttribute("aria-label", name);
  b.addEventListener("click", () => { sTap(); goTo(name); });
  $("#sceneDots").appendChild(b);
});

/* nav bindings */
$$("[data-go]").forEach(el => el.addEventListener("click", () => { sTap(); goTo(el.dataset.go); }));
$("#brandHome").addEventListener("click", () => { sTap(); goTo("welcome"); });
$("#startBtn").addEventListener("click", () => { sPop(); burstAt($("#startBtn"), 34); setTimeout(() => goTo("play"), 220); });
$("#prevBtn").addEventListener("click", () => goTo(CFG.ORDER[Math.max(0, CFG.ORDER.indexOf(cur) - 1)]));
$("#nextBtn").addEventListener("click", () => goTo(CFG.ORDER[Math.min(CFG.ORDER.length - 1, CFG.ORDER.indexOf(cur) + 1)]));
addEventListener("keydown", e => {
  if (e.key === "ArrowRight") $("#nextBtn").click();
  if (e.key === "ArrowLeft")  $("#prevBtn").click();
});

/* vuốt ngang để chuyển màn (trong panel Ba mẹ thì chuyển benefit) */
let swX = 0, swY = 0, swOK = false, swParents = false;
stage.addEventListener("pointerdown", e => {
  swOK = !e.target.closest(".tabs, .ov, #kiosk, button, .chip");
  swParents = !!e.target.closest(".pa-panel");
  swX = e.clientX; swY = e.clientY;
}, { passive:true });
stage.addEventListener("pointerup", e => {
  if (!swOK) return;
  const dx = e.clientX - swX, dy = e.clientY - swY;
  if (Math.abs(dx) > 70 && Math.abs(dy) < 62){
    if (swParents && cur === "parents") stepBenefit(dx < 0 ? 1 : -1);
    else (dx < 0 ? $("#nextBtn") : $("#prevBtn")).click();
  }
}, { passive:true });

/* ================= WELCOME ================= */
let bubbleT = null;
function heroSay(msg){
  const bub = $("#heroBubble");
  bub.classList.add("show");
  typeText($("#heroBubbleText"), msg);
  clearTimeout(bubbleT);
  bubbleT = setTimeout(() => bub.classList.remove("show"), 5600);
}

$("#heroPika").addEventListener("click", () => {
  const h = $("#heroPika");
  h.classList.remove("jump"); void h.offsetWidth; h.classList.add("jump");
  setTimeout(() => h.classList.remove("jump"), 780);
  /* spark ✦ chỉ lóe khi được chạm (không loop nền) */
  $$(".hero-spark").forEach(sp => { sp.classList.remove("live"); void sp.offsetWidth; sp.classList.add("live"); });
  setTimeout(() => $$(".hero-spark").forEach(sp => sp.classList.remove("live")), 4200);
  sPop(); burst(476, 560, 20);
  heroSay(CFG.HERO_LINES[(Math.random() * CFG.HERO_LINES.length) | 0]);
});
