const reasons = [
  ["01", "เธอยิ้มทีเดียว สมองผมกด save อัตโนมัติ"],
  ["02", "คุยกับเธอแล้วเน็ตในใจแรงขึ้นทันที"],
  ["03", "เธอน่ารักแบบไม่ต้องใช้ฟิลเตอร์"],
  ["04", "เห็นชื่อเธอเด้งมา ผมทำเป็นนิ่ง แต่ใจวิ่งแล้ว"],
  ["05", "ถ้าเธอเป็นเพลง คงเป็นเพลงที่ผมกด replay"],
  ["06", "อยากชวนไปกินของอร่อย แล้วแกล้งถามว่าอิ่มยัง"],
  ["07", "มุกผมอาจฝืด แต่ความชอบจริงนะ"],
  ["08", "สรุปง่าย ๆ คือแพ้เธอแบบไม่ต้องนับคะแนน"],
];

const reasonGrid = document.querySelector("#reasonGrid");
const toast = document.querySelector("#toast");
const game = document.querySelector("#heartGame");
const scoreText = document.querySelector("#scoreText");
const scoreBar = document.querySelector("#scoreBar");
const quizChoices = document.querySelector("#quizChoices");
const quizResult = document.querySelector("#quizResult");
const yesButton = document.querySelector("#yesButton");
const noButton = document.querySelector("#noButton");
const reply = document.querySelector("#reply");
const canvas = document.querySelector("#sparkleCanvas");
const ctx = canvas.getContext("2d");

let score = 0;
let noClicks = 0;
let particles = [];

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("is-visible"), 2600);
}

function renderReasons() {
  reasonGrid.innerHTML = reasons
    .map(([number, text]) => `<article class="reason-card"><strong>${number}</strong><span>${text}</span></article>`)
    .join("");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("is-visible");
      });
    },
    { threshold: 0.2 }
  );

  document.querySelectorAll(".reason-card").forEach((card, index) => {
    card.style.transitionDelay = `${index * 70}ms`;
    observer.observe(card);
  });
}

function resizeCanvas() {
  canvas.width = window.innerWidth * window.devicePixelRatio;
  canvas.height = window.innerHeight * window.devicePixelRatio;
  ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
}

function addParticles(x, y, amount = 24) {
  for (let i = 0; i < amount; i += 1) {
    particles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 8,
      vy: Math.random() * -6 - 1,
      life: 80 + Math.random() * 40,
      hue: 330 + Math.random() * 42,
      size: 2 + Math.random() * 4,
    });
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  particles = particles.filter((p) => p.life > 0);
  particles.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.09;
    p.life -= 1;
    ctx.globalAlpha = Math.max(p.life / 100, 0);
    ctx.fillStyle = `hsl(${p.hue} 92% 70%)`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;
  requestAnimationFrame(animateParticles);
}

function spawnHeart() {
  const heart = document.createElement("button");
  heart.type = "button";
  heart.className = "floating-heart";
  heart.textContent = "♥";
  heart.style.left = `${Math.random() * 86 + 4}%`;
  heart.style.animationDuration = `${3.6 + Math.random() * 2.2}s`;
  heart.addEventListener("click", () => {
    const rect = heart.getBoundingClientRect();
    addParticles(rect.left + rect.width / 2, rect.top + rect.height / 2, 18);
    heart.remove();
    score = Math.min(8, score + 1);
    scoreText.textContent = `${score} / 8`;
    scoreBar.style.width = `${(score / 8) * 100}%`;
    if (score === 8) {
      showToast("แต้มเขินเต็มแล้ว ไปเจอ final boss ได้เลย");
      document.querySelector("#proposal").scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });
  game.appendChild(heart);
  window.setTimeout(() => heart.remove(), 6200);
}

function startGame() {
  spawnHeart();
  window.setInterval(spawnHeart, 820);
}

function heartRain() {
  for (let i = 0; i < 34; i += 1) {
    const heart = document.createElement("span");
    heart.className = "burst-heart";
    heart.textContent = "♥";
    heart.style.left = `${Math.random() * 100}vw`;
    heart.style.top = `${Math.random() * 80}vh`;
    heart.style.color = i % 3 === 0 ? "#ffd37a" : i % 3 === 1 ? "#75eadb" : "#ff5f91";
    heart.style.setProperty("--x", `${(Math.random() - 0.5) * 260}px`);
    heart.style.setProperty("--y", `${(Math.random() - 0.5) * 260}px`);
    document.body.appendChild(heart);
    window.setTimeout(() => heart.remove(), 1100);
  }
}

quizChoices.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;
  quizChoices.querySelectorAll("button").forEach((item) => item.classList.remove("is-picked"));
  button.classList.add("is-picked");
  quizResult.textContent = `"${button.dataset.answer}" โอเค อันนี้น่าจะเด้งในใจผมทั้งวัน`;
  addParticles(window.innerWidth / 2, button.getBoundingClientRect().top, 28);
});

yesButton.addEventListener("click", () => {
  reply.textContent = "โอเค งั้นผมเริ่มซ้อมเขินแบบจริงจังละนะ";
  heartRain();
  addParticles(window.innerWidth / 2, window.innerHeight / 2, 120);
});

noButton.addEventListener("mouseenter", () => {
  noClicks += 1;
  const x = Math.random() * 180 - 90;
  const y = Math.random() * 100 - 50;
  noButton.style.transform = `translate(${x}px, ${y}px)`;
  if (noClicks > 2) showToast("ปุ่มนี้เขินจนยืนไม่ตรงแล้ว");
});

noButton.addEventListener("click", () => {
  showToast("โอเค ให้เขินก่อน แต่ผมยังรอแบบทำทรงเท่อยู่");
});

document.querySelector("#makeItRain").addEventListener("click", heartRain);
window.addEventListener("resize", resizeCanvas);

renderReasons();
resizeCanvas();
animateParticles();
startGame();
showToast("โหลดเสร็จแล้ว ระวังโดนจีบแบบงง ๆ");
