/* ==========================================================================
   LEARN — 5 ốc đảo + popup bài học (nội dung bài lấy từ CFG.LESSONS).
   ========================================================================== */
"use strict";

$("#zoneWrap").addEventListener("click", e => {
  const chip = e.target.closest(".chip"), zone = e.target.closest(".zone");
  if (zone){
    const fresh = !zone.classList.contains("is-selected");
    $$(".zone").forEach(z => z.classList.remove("is-selected"));
    zone.classList.add("is-selected");
    if (fresh && !chip){ sPop(); burstAt(zone); addStar(); say(zone.dataset.info); }
  }
  if (chip) openLesson(chip.dataset.lesson);
});

let curLesson = null;
function openLesson(id){
  const L = CFG.LESSONS[id]; if (!L) return;
  curLesson = L;
  $("#lessonZone").textContent = L.zone;
  $("#lessonTitle").textContent = L.title;
  $("#lessonDesc").textContent = L.desc;
  $("#lessonTime").textContent = L.time;
  $("#lessonTasks").innerHTML = L.tasks.map(t => '<div class="t-row"><span class="t-ic">' + t[0] + "</span>" + t[1] + "</div>").join("");
  $("#lessonOv").classList.add("show");
  sPop();
}
function closeLesson(){ $("#lessonOv").classList.remove("show"); }
$("#lessonX").addEventListener("click", () => { sTap(); closeLesson(); });
$("#lessonCancel").addEventListener("click", () => { sTap(); closeLesson(); });
$("#lessonOv").addEventListener("click", e => { if (e.target === $("#lessonOv")) closeLesson(); });
$("#lessonAssign").addEventListener("click", () => {
  closeLesson(); sWin(); addStar(); burst(476, 620, 44);
  startSession({ topic:curLesson ? curLesson.title : "Bài học", sentence:null,
    badge:{ e:"⭐", name:"Super Learner" }, turns:5 + Math.floor(Math.random() * 8) });
  toast("Đã giao “" + (curLesson ? curLesson.title : "bài học") + "” cho Pika");
  say("Pika nhận bài rồi! Con nói cùng Pika nhé!");
});
