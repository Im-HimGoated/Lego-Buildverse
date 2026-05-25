const jumpButtons = document.querySelectorAll("[data-jump]");
const scanButton = document.querySelector(".scan-button");
const scannerPanel = document.querySelector(".scanner-panel");
const scanStatus = document.querySelector(".scan-status");
const heroStage = document.querySelector(".hero-stage");

jumpButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = document.querySelector(button.dataset.jump);
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

scanButton.addEventListener("click", () => {
  scannerPanel.classList.add("scanning");
  scanButton.disabled = true;
  scanStatus.textContent = "Scanning studs, colors, and impossible ideas...";

  window.setTimeout(() => {
    scanStatus.textContent = "World created: Pizza Wizard Submarine";
    scanButton.textContent = "Scan another build";
    scanButton.disabled = false;
    scannerPanel.classList.remove("scanning");
  }, 1600);
});

heroStage.addEventListener("pointermove", (event) => {
  const bounds = heroStage.getBoundingClientRect();
  const x = (event.clientX - bounds.left) / bounds.width - 0.5;
  const y = (event.clientY - bounds.top) / bounds.height - 0.5;
  heroStage.style.setProperty("--tilt-x", `${y * -8}deg`);
  heroStage.style.setProperty("--tilt-y", `${x * 8}deg`);
  heroStage.style.transform = `rotateX(var(--tilt-x)) rotateY(var(--tilt-y))`;
});

heroStage.addEventListener("pointerleave", () => {
  heroStage.style.transform = "rotateX(0deg) rotateY(0deg)";
});
