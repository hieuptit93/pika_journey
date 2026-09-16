/* ==========================================================================
   CORE — tiện ích dùng chung: scale sân khấu, âm thanh synth, confetti,
   sao thưởng, kiosk (GIỮ 1.2s mới mở cài đặt), toast, dock, typewriter.
   Load SAU config.js, TRƯỚC các file scene.
   ========================================================================== */
"use strict";
const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const stage = $("#stage");

/* ================= STAGE SCALING ================= */
function fit(){
  const s = Math.min(innerWidth / 952, innerHeight / 1269);
  stage.style.setProperty("--s", s);
  stage._s = s;
}
fit(); addEventListener("resize", fit); addEventListener("orientationchange", () => setTimeout(fit, 120));
function localRect(el){
  const r = el.getBoundingClientRect(), sr = stage.getBoundingClientRect(), s = stage._s || 1;
  return { x:(r.left - sr.left)/s, y:(r.top - sr.top)/s, w:r.width/s, h:r.height/s };
}

/* ================= AUDIO (WebAudio synth, không cần file) ================= */
let audioCtx = null, soundOn = true;
function ac(){
  if (!audioCtx){ try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e){} }
  if (audioCtx && audioCtx.state === "suspended") audioCtx.resume();
  return audioCtx;
}
function tone(freq, dur = .12, type = "sine", vol = .16, delay = 0, slide = 0){
  if (!soundOn) return;
  const ctx = ac(); if (!ctx) return;
  const t0 = ctx.currentTime + delay;
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = type; o.frequency.setValueAtTime(freq, t0);
  if (slide) o.frequency.exponentialRampToValueAtTime(slide, t0 + dur);
  g.gain.setValueAtTime(.0001, t0);
  g.gain.exponentialRampToValueAtTime(vol, t0 + .015);
  g.gain.exponentialRampToValueAtTime(.0001, t0 + dur);
  o.connect(g).connect(ctx.destination);
  o.start(t0); o.stop(t0 + dur + .05);
}
const sPop    = () => tone(420, .10, "sine", .20, 0, 880);
const sTap    = () => tone(300, .07, "triangle", .13);
const sWhoosh = () => tone(200, .18, "sine", .09, 0, 540);
const sStar   = () => { tone(880, .09, "triangle", .15); tone(1318, .12, "triangle", .13, .07); };
const sWin    = () => [523, 659, 784, 1046].forEach((f, i) => tone(f, .16, "triangle", .17, i * .09));
document.addEventListener("pointerdown", () => ac(), { once:true });

/* ================= CONFETTI ================= */
const cvs = $("#confetti"), cx = cvs.getContext("2d");
function sizeCanvas(){
  const dpr = Math.min(devicePixelRatio || 1, 2);
  cvs.width = 952 * dpr; cvs.height = 1269 * dpr;
  cvs.style.width = "952px"; cvs.style.height = "1269px";
  cx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
sizeCanvas(); addEventListener("resize", sizeCanvas);
const COLORS = ["#F5B94E", "#FFD98A", "#66C6E6", "#A7C4E5", "#F8EFD9", "#E09B21"];
let parts = [], rafId = null;
function burst(x, y, n = 26, spread = 7){
  for (let i = 0; i < n; i++){
    const a = Math.random() * Math.PI * 2, v = 2 + Math.random() * spread;
    parts.push({ x, y, vx:Math.cos(a)*v, vy:Math.sin(a)*v - 4.5, g:.22 + Math.random()*.12,
      rot:Math.random()*Math.PI, vr:(Math.random()-.5)*.3, s:5 + Math.random()*7,
      c:COLORS[(Math.random()*COLORS.length)|0], shape:Math.random() < .5 ? "r" : "c", life:90 + Math.random()*50 });
  }
  if (!rafId) rafId = requestAnimationFrame(tick);
}
function rain(n = 120){
  for (let i = 0; i < n; i++){
    parts.push({ x:Math.random()*952, y:-20 - Math.random()*220, vx:(Math.random()-.5)*2.4,
      vy:2.5 + Math.random()*3.5, g:.05, rot:Math.random()*Math.PI, vr:(Math.random()-.5)*.25,
      s:6 + Math.random()*8, c:COLORS[(Math.random()*COLORS.length)|0],
      shape:Math.random() < .5 ? "r" : "c", life:220 + Math.random()*90 });
  }
  if (!rafId) rafId = requestAnimationFrame(tick);
}
function tick(){
  cx.clearRect(0, 0, 952, 1269);
  parts = parts.filter(p => p.life-- > 0 && p.y < 1300);
  for (const p of parts){
    p.x += p.vx; p.y += p.vy; p.vy += p.g; p.rot += p.vr;
    cx.save(); cx.translate(p.x, p.y); cx.rotate(p.rot);
    cx.fillStyle = p.c; cx.globalAlpha = Math.min(1, p.life / 40);
    if (p.shape === "r") cx.fillRect(-p.s/2, -p.s/2, p.s, p.s*.62);
    else { cx.beginPath(); cx.arc(0, 0, p.s/2.2, 0, 7); cx.fill(); }
    cx.restore();
  }
  rafId = parts.length ? requestAnimationFrame(tick) : (cx.clearRect(0, 0, 952, 1269), null);
}
function burstAt(el, n = 26){ const r = localRect(el); burst(r.x + r.w/2, r.y + r.h/2, n); }

/* ================= TWINKLES (điểm lấy từ CFG.TWINKLES) ================= */
(function starsBg(){
  const wrap = $("#twinkles");
  CFG.TWINKLES.forEach(([x, y], i) => {
    const s = document.createElement("span");
    s.className = "twinkle";
    s.style.left = x + "px"; s.style.top = y + "px";
    s.style.animationDelay = (i * .7) + "s";
    wrap.appendChild(s);
  });
})();

/* ================= TYPEWRITER ================= */
function typeText(el, text){
  if (!el) return;
  clearInterval(el._tw);
  el.textContent = ""; let i = 0;
  el._tw = setInterval(() => {
    el.textContent = text.slice(0, ++i);
    if (i >= text.length) clearInterval(el._tw);
  }, 17);
}

/* ================= STARS ================= */
let stars = 0;
function addStar(n = 1){
  stars += n;
  $("#starCount").textContent = stars;
  const b = $("#starBadge"), k = $("#kioskBtn");
  b.textContent = stars; k.classList.add("has");
  k.classList.remove("bump"); void k.offsetWidth; k.classList.add("bump");
  const kr = localRect(k);
  for (let i = 0; i < n; i++){
    const f = document.createElement("span");
    f.className = "fly-star"; f.textContent = "⭐";
    f.style.left = (kr.x + 8) + "px"; f.style.top = (kr.y + 6) + "px";
    f.style.setProperty("--dx", (-6 + Math.random()*24) + "px");
    f.style.setProperty("--dy", (-46 - Math.random()*26) + "px");
    stage.appendChild(f); setTimeout(() => f.remove(), 1100);
  }
  sStar();
}

/* ================= KIOSK: giữ 1.2s mới mở panel cài đặt =================
   Chống trẻ bấm nhầm vào reset. Chạm nhanh chỉ nảy nhẹ (bump).           */
(function kioskLongPress(){
  const HOLD_MS = 1200;
  const btn = $("#kioskBtn");
  let holdT = null, opened = false;
  btn.addEventListener("pointerdown", e => {
    e.stopPropagation(); opened = false;
    btn.classList.add("holding");
    holdT = setTimeout(() => {
      opened = true;
      btn.classList.remove("holding");
      sTap(); $("#kioskPanel").classList.add("show");
    }, HOLD_MS);
  });
  ["pointerup", "pointercancel", "pointerleave"].forEach(ev => btn.addEventListener(ev, () => {
    clearTimeout(holdT);
    btn.classList.remove("holding");
  }));
  btn.addEventListener("click", e => {
    e.stopPropagation();
    if (!opened){ // chạm nhanh: chỉ phản hồi vui, không mở panel
      btn.classList.remove("bump"); void btn.offsetWidth; btn.classList.add("bump");
    }
  });
  stage.addEventListener("click", e => { if (!e.target.closest("#kiosk")) $("#kioskPanel").classList.remove("show"); });
})();

/* ================= TOAST ================= */
let toastT = null;
function toast(msg){
  const t = $("#toast");
  t.textContent = msg; t.classList.add("show");
  clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("show"), 2100);
}

/* ================= DOCK (thoại Pika) ================= */
let dockT = null;
function say(msg){
  const d = $("#dock");
  d.classList.add("show");
  typeText($("#dockText"), msg);
  clearTimeout(dockT);
  dockT = setTimeout(() => d.classList.remove("show"), 8200);
}
