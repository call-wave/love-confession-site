const catLines = [
  "เหมียวแปลว่า: เขาชอบเธอจริง ไม่ได้ซ้อม",
  "เหมียววว = เห็นเธอแล้วใจทำเสียงแจ้งเตือน",
  "เมี๊ยว? = ขออนุญาตน่ารักใส่ได้ไหม",
  "มร้าว = คนเขียนเว็บกำลังเขิน แต่ฝากแมวพูดแทน",
];

const missionButtons = document.querySelectorAll(".mission-tile");
const meterFill = document.querySelector("#meterFill");
const meterText = document.querySelector("#meterText");
const messages = document.querySelector("#messages");
const catCaption = document.querySelector("#catCaption");
const stampOptions = document.querySelector("#stampOptions");
const stampResult = document.querySelector("#stampResult");
const toast = document.querySelector("#toast");
const reply = document.querySelector("#reply");
let courage = 0;
let lineIndex = 0;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("is-visible"), 2300);
}

function addBubble(text, type = "cat") {
  const bubble = document.createElement("p");
  bubble.className = `bubble bubble--${type}`;
  bubble.textContent = text;
  messages.appendChild(bubble);
  messages.scrollTop = messages.scrollHeight;
}

function popCute(x = window.innerWidth / 2, y = window.innerHeight / 2, amount = 18) {
  const icons = ["♡", "✦", "แมว", "จุ๊บ", "เมี๊ยว"];
  for (let i = 0; i < amount; i += 1) {
    const item = document.createElement("span");
    item.className = "floaty";
    item.textContent = icons[i % icons.length];
    item.style.left = `${x}px`;
    item.style.top = `${y}px`;
    item.style.color = i % 2 ? "#ff74a8" : "#241a22";
    item.style.setProperty("--x", `${(Math.random() - 0.5) * 280}px`);
    item.style.setProperty("--y", `${(Math.random() - 0.5) * 220}px`);
    document.body.appendChild(item);
    window.setTimeout(() => item.remove(), 950);
  }
}

document.querySelector("#startMission").addEventListener("click", () => {
  document.querySelector("#mission").scrollIntoView({ behavior: "smooth" });
  showToast("แมวใส่หมวกพนักงานส่งของแล้ว");
});

document.querySelector("#meowButton").addEventListener("click", () => {
  lineIndex = (lineIndex + 1) % catLines.length;
  catCaption.textContent = catLines[lineIndex];
  addBubble(catLines[lineIndex], "cat");
});

missionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (button.classList.contains("is-done")) {
      showToast("อันนี้แมวทำแล้ว ขอขนมเพิ่มแทนได้ไหม");
      return;
    }
    button.classList.add("is-done");
    courage = Math.min(100, courage + Number(button.dataset.points));
    meterFill.style.width = `${courage}%`;
    meterText.textContent = `${courage}%`;
    addBubble(button.dataset.message, "cat");
    showToast(button.dataset.message);
    const rect = button.getBoundingClientRect();
    popCute(rect.left + rect.width / 2, rect.top + rect.height / 2, 12);
    if (courage === 100) {
      addBubble("ภารกิจครบแล้ว เปิดซองได้เลย!", "cat");
      document.querySelector("#letter").scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });
});

stampOptions.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  stampOptions.querySelectorAll("button").forEach((item) => item.classList.remove("is-picked"));
  button.classList.add("is-picked");
  stampResult.textContent = `ประทับตรา "${button.dataset.stamp}" แล้ว แมวพยักหน้าแบบจริงจัง`;
  addBubble(`เลือกตรา "${button.dataset.stamp}" เรียบร้อย ซองนี้ดูมีพิรุธมาก`, "cat");
});

document.querySelector("#yesButton").addEventListener("click", () => {
  reply.textContent = "แมวกระโดดดีใจ ส่วนคนเขียนเว็บน่าจะยิ้มค้างแล้ว";
  addBubble("ภารกิจสำเร็จ! ขอปลาทูโบนัส 2 ชิ้น", "cat");
  popCute(window.innerWidth / 2, window.innerHeight / 2, 44);
});

document.querySelector("#shyButton").addEventListener("click", () => {
  reply.textContent = "ได้เลย เขินก่อนก็ได้ แมวจะนั่งเฝ้าซองให้";
  addBubble("โอเค แมวนั่งรอแบบไม่กดดัน แต่มองอยู่นะ", "cat");
});

showToast("แมวพร้อมส่งสารแล้ว");
