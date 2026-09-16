/* ==========================================================================
   JOURNEY — timeline 5 chặng (node BẤM ĐƯỢC), modal chặng, quà đích đến,
   demo hội thoại (bottom-sheet, nội dung từ CFG.DEMOS).
   ========================================================================== */
"use strict";

const jCards = $$(".jcard"), jNodes = $$(".j-node"), crystals = $$("#crysRow .crys");
const doneSteps = new Set();
let rewardOpened = false;

function markJourneyDone(step, card){
  jCards.forEach(c => c.classList.remove("current"));
  jNodes.forEach(n => n.classList.remove("current"));
  card.classList.add("current");
  jNodes[step].classList.add("current");
  if (!doneSteps.has(step)){
    doneSteps.add(step);
    card.classList.add("done");
    jNodes[step].classList.add("done");
    crystals[step] && crystals[step].classList.add("earned");
    addStar();
    if (doneSteps.size === jCards.length){
      say("WOW! Xem hết lộ trình rồi! Bấm “Xem đích đến” để nhận quà nha!");
    }
  }
}

function openReward(){
  if (rewardOpened){ rain(70); sWin(); $("#rewardOv").classList.add("show"); return; }
  rewardOpened = true;
  sWin(); rain(150); addStar(3);
  setTimeout(() => $("#rewardOv").classList.add("show"), 250);
}

function openJourney(card){
  const step = +card.dataset.step;
  $("#jmImg").src = card.querySelector(".jc-art img").src;
  $("#jmKicker").textContent = card.querySelector(".jc-kicker").textContent;
  $("#jmTitle").textContent = card.querySelector(".jc-name").textContent;
  $("#jmLong").textContent = card.dataset.jlong || "";
  $("#jmQuote").textContent = card.querySelector(".jc-quote").textContent;
  $("#jmStep").textContent = "Chặng " + (step + 1) + " / " + jCards.length;
  $("#jmNext").textContent = step < jCards.length - 1 ? "Chặng tiếp theo →" : "Xem đích đến 🎁";
  $("#jOv").classList.add("show");
  sWhoosh();
  markJourneyDone(step, card);
}
jCards.forEach(card => card.addEventListener("click", () => openJourney(card)));
/* node tròn trên timeline cũng mở đúng chặng (trước đây nhìn như nút mà không bấm được) */
jNodes.forEach((n, i) => n.addEventListener("click", () => { sTap(); openJourney(jCards[i]); }));

$("#jX").addEventListener("click", () => { sTap(); $("#jOv").classList.remove("show"); });
$("#jOv").addEventListener("click", e => { if (e.target === $("#jOv")) $("#jOv").classList.remove("show"); });
$("#jmNext").addEventListener("click", () => {
  const c = +($(".jcard.current") || jCards[0]).dataset.step;
  if (c < jCards.length - 1){ sPop(); openJourney(jCards[c + 1]); }
  else { $("#jOv").classList.remove("show"); sPop(); openReward(); }
});
$("#rewardClose").addEventListener("click", () => {
  $("#rewardOv").classList.remove("show"); sPop(); burst(476, 600, 40);
});
$("#rewardOv").addEventListener("click", e => { if (e.target === $("#rewardOv")) $("#rewardOv").classList.remove("show"); });

/* ---------------- demo hội thoại (bottom-sheet) ---------------- */
let demoT = null;
function renderDemo(key, open){
  const d = CFG.DEMOS[key] || CFG.DEMOS.story;
  $("#dpLabel").textContent = "Thử một nhiệm vụ · " + d.label;
  $("#demoChat").innerHTML = d.lines.map((l, i) =>
    '<div class="chat-line ' + (i === 1 ? "kid" : "pika") + '" style="animation-delay:' + (i * .28) + 's">' + l + "</div>").join("");
  if (open){
    $("#demoPop").classList.add("show");
    clearTimeout(demoT); demoT = setTimeout(() => $("#demoPop").classList.remove("show"), 11000);
  }
}
renderDemo("story", false);
$("#demoChips").addEventListener("click", e => {
  const chip = e.target.closest(".dchip"); if (!chip) return;
  $$(".dchip").forEach(c => c.classList.remove("active"));
  chip.classList.add("active");
  sTap(); renderDemo(chip.dataset.demo, true);
});
$("#dpClose").addEventListener("click", () => { sTap(); $("#demoPop").classList.remove("show"); });
