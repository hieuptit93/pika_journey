/* ==========================================================================
   PLAY — chọn trò → thử thách tiếng Anh → lượt chơi (session) → mini-result.
   Không pre-select thẻ nào: khách tự chọn thì "thẻ sáng lên" mới có nghĩa.
   ========================================================================== */
"use strict";

let session = null, connecting = false;

$("#playGrid").addEventListener("click", e => {
  const card = e.target.closest(".pcard"); if (!card) return;
  const fresh = !card.classList.contains("is-selected");
  $$(".pcard").forEach(c => c.classList.remove("is-selected"));
  card.classList.add("is-selected");
  if (fresh){ sPop(); burstAt(card); addStar(); say(card.dataset.title + " — " + card.dataset.text); }
  if (e.target.closest("[data-start]")) { sPop(); openChallenge(); }
});

function selectedCard(){ return $(".pcard.is-selected") || $(".pcard"); }

function openChallenge(){
  const card = selectedCard(), key = card.dataset.play;
  const ch = CFG.CHALLENGES[key] || CFG.CHALLENGES.story, isGuess = key === "guess";
  $("#charChips").hidden = !isGuess; /* CSS .char-chips[hidden] đã fix để hidden thắng */
  $$("#charChips .char-chip").forEach((c, i) => c.classList.toggle("active", i === 0));
  const spell = isGuess ? CFG.CHAR_SPELLS.elsa : ch;
  $("#chIco").textContent = ch.ico;
  $("#chTitle").textContent = card.querySelector(".pc-name").textContent;
  $("#chSpell").textContent = "“" + spell.sentence + "”";
  $("#connectSteps").innerHTML = "";
  $("#chAssign").disabled = false;
  $("#chOv").classList.add("show");
  sPop();
}

$("#charChips").addEventListener("click", e => {
  const chip = e.target.closest(".char-chip"); if (!chip) return;
  $$("#charChips .char-chip").forEach(c => c.classList.remove("active"));
  chip.classList.add("active");
  $("#chSpell").textContent = "“" + CFG.CHAR_SPELLS[chip.dataset.char].sentence + "”";
  sTap();
});

function closeChallenge(){ if (!connecting) $("#chOv").classList.remove("show"); }
$("#chX").addEventListener("click", () => { sTap(); closeChallenge(); });
$("#chCancel").addEventListener("click", () => { sTap(); closeChallenge(); });
$("#chOv").addEventListener("click", e => { if (e.target === $("#chOv")) closeChallenge(); });

/* ---------------- session ---------------- */
function syncSession(){
  const has = !!session, onBar = has && CFG.BAR_SCENES.includes(cur);
  $("#sessionBar").classList.toggle("hidden", !onBar);
  $("#kpResult").classList.toggle("show", has);
  $("#kioskBtn").classList.toggle("pending", has);
  $("#sceneDots").classList.toggle("hide", cur === "welcome" || onBar);
}
function startSession(data){ session = data; syncSession(); }

$("#chAssign").addEventListener("click", () => {
  if (connecting) return;
  connecting = true; $("#chAssign").disabled = true;
  const card = selectedCard(), key = card.dataset.play;
  const activeChar = $("#charChips .char-chip.active");
  const spell = key === "guess" ? CFG.CHAR_SPELLS[activeChar.dataset.char] : (CFG.CHALLENGES[key] || CFG.CHALLENGES.story);
  $("#connectSteps").innerHTML = "";
  CFG.CONNECT_STEPS.forEach((s, i) => setTimeout(() => {
    $("#connectSteps").insertAdjacentHTML("beforeend", '<div class="c-step">' + s + "</div>");
    sTap();
    if (i === CFG.CONNECT_STEPS.length - 1) setTimeout(() => {
      connecting = false; closeChallenge(); sWin(); addStar();
      startSession({ topic:card.querySelector(".pc-name").textContent, sentence:spell.sentence,
        badge:spell.badge, turns:5 + Math.floor(Math.random() * 8) });
      toast("Pika bắt đầu chơi với bé 1–3 phút");
    }, 700);
  }, 500 * (i + 1)));
});

/* ---------------- mini-result ---------------- */
function showResult(){
  if (!session) return;
  $("#rsTopic").textContent = session.topic;
  $("#rsTurns").textContent = session.turns;
  $("#rsSentenceRow").style.display = session.sentence ? "" : "none";
  $("#rsSentence").textContent = session.sentence ? "“" + session.sentence + "”" : "";
  $("#rsBadgeEmoji").textContent = session.badge.e;
  $("#rsBadgeName").textContent = session.badge.name;
  $("#rsVoucher").style.display = session.turns >= 5 ? "" : "none";
  session = null; syncSession();
  $("#rsOv").classList.add("show");
  sWin(); rain(110); addStar(2);
}
$("#sessionBar").addEventListener("click", showResult);
$("#kpResult").addEventListener("click", e => { e.stopPropagation(); $("#kioskPanel").classList.remove("show"); showResult(); });
function closeResult(){ $("#rsOv").classList.remove("show"); }
$("#rsX").addEventListener("click", () => { sTap(); closeResult(); });
$("#rsOv").addEventListener("click", e => { if (e.target === $("#rsOv")) closeResult(); });
$("#rsParents").addEventListener("click", () => { closeResult(); sPop(); goTo("parents"); });
$("#rsAgain").addEventListener("click", () => { closeResult(); sPop(); goTo("play"); });
