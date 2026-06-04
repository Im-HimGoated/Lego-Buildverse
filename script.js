const jumpButtons = document.querySelectorAll("[data-jump]");
const scanButton = document.querySelector(".scan-button");
const scannerPanel = document.querySelector(".scanner-panel");
const scanStatus = document.querySelector(".scan-status");
const paletteButtons = document.querySelectorAll("[data-palette]");
const board = document.querySelector("#builder-board");
const colorTools = document.querySelectorAll(".color-tool");
const sizeTools = document.querySelectorAll(".size-tool");
const undoButton = document.querySelector("#undo-build");
const clearButton = document.querySelector("#clear-build");
const exportButton = document.querySelector("#export-build");
const downloadLink = document.querySelector("#download-build");
const brickCount = document.querySelector("#brick-count");

const columns = 12;
const rows = 10;
let selectedColor = "#e52521";
let selectedSize = 2;
let bricks = [
  { x: 3, y: 8, size: 4, color: "#0055bf" },
  { x: 4, y: 7, size: 3, color: "#ffd500" },
  { x: 5, y: 6, size: 2, color: "#e52521" },
  { x: 8, y: 8, size: 2, color: "#237841" }
];

jumpButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = document.querySelector(button.dataset.jump);
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

paletteButtons.forEach((button) => {
  button.addEventListener("click", () => {
    document.body.dataset.theme = button.dataset.palette;

    paletteButtons.forEach((paletteButton) => {
      const isActive = paletteButton === button;
      paletteButton.classList.toggle("is-active", isActive);
      paletteButton.setAttribute("aria-pressed", String(isActive));
    });
  });
});

colorTools.forEach((button) => {
  button.addEventListener("click", () => {
    selectedColor = button.dataset.color;
    setActiveTool(colorTools, button);
  });
});

sizeTools.forEach((button) => {
  button.addEventListener("click", () => {
    selectedSize = Number(button.dataset.size);
    setActiveTool(sizeTools, button);
  });
});

clearButton.addEventListener("click", () => {
  bricks = [];
  downloadLink.classList.remove("is-ready");
  renderBoard();
});

undoButton.addEventListener("click", () => {
  bricks.pop();
  downloadLink.classList.remove("is-ready");
  renderBoard();
});

exportButton.addEventListener("click", () => {
  const pngUrl = exportBuild();
  downloadLink.href = pngUrl;
  downloadLink.classList.add("is-ready");
});

scanButton.addEventListener("click", () => {
  scannerPanel.classList.remove("scanned");
  scannerPanel.classList.add("scanning");
  scanButton.disabled = true;
  scanStatus.textContent = "Mapping submarine shape, windows, tail, and fins...";

  window.setTimeout(() => {
    scannerPanel.classList.add("scanned");
    scannerPanel.classList.remove("scanning");
    scanButton.textContent = "Scan again";
    scanButton.disabled = false;
    scanStatus.textContent = "World mapped: coral reef submarine quest";
  }, 1500);
});

function setActiveTool(group, activeButton) {
  group.forEach((button) => {
    const isActive = button === activeButton;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function renderBoard() {
  board.replaceChildren();

  for (let y = 1; y <= rows; y += 1) {
    for (let x = 1; x <= columns; x += 1) {
      const cell = document.createElement("button");
      cell.className = "builder-cell";
      cell.type = "button";
      cell.dataset.x = x;
      cell.dataset.y = y;
      cell.setAttribute("aria-label", `Place brick at column ${x}, row ${y}`);
      cell.addEventListener("click", placeBrick);
      board.append(cell);
    }
  }

  bricks.forEach((brick) => {
    const element = document.createElement("div");
    element.className = "placed-brick";
    element.style.gridColumn = `${brick.x} / span ${brick.size}`;
    element.style.gridRow = String(brick.y);
    element.style.setProperty("--brick-color", brick.color);
    element.style.setProperty("--studs", brick.size);

    for (let i = 0; i < brick.size; i += 1) {
      element.append(document.createElement("span"));
    }

    board.append(element);
  });

  brickCount.textContent = bricks.length;
  undoButton.disabled = bricks.length === 0;
  clearButton.disabled = bricks.length === 0;
}

function placeBrick(event) {
  const x = Number(event.currentTarget.dataset.x);
  const y = Number(event.currentTarget.dataset.y);
  const adjustedX = Math.min(x, columns - selectedSize + 1);
  bricks.push({ x: adjustedX, y, size: selectedSize, color: selectedColor });
  downloadLink.classList.remove("is-ready");
  renderBoard();
}

function exportBuild() {
  const scale = 64;
  const canvas = document.createElement("canvas");
  canvas.width = columns * scale;
  canvas.height = rows * scale;
  const context = canvas.getContext("2d");

  context.fillStyle = "#88b950";
  context.fillRect(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < rows; y += 1) {
    for (let x = 0; x < columns; x += 1) {
      drawStud(context, x * scale + scale / 2, y * scale + scale / 2, scale * 0.18, "rgba(255,255,255,0.28)");
    }
  }

  bricks.forEach((brick) => {
    const x = (brick.x - 1) * scale + 7;
    const y = (brick.y - 1) * scale + 8;
    const width = brick.size * scale - 14;
    const height = scale - 16;

    context.fillStyle = brick.color;
    context.strokeStyle = "#111111";
    context.lineWidth = 5;
    roundRect(context, x, y, width, height, 10);
    context.fill();
    context.stroke();

    context.fillStyle = "rgba(255,255,255,0.32)";
    context.fillRect(x + 6, y + 6, width - 12, 10);

    for (let i = 0; i < brick.size; i += 1) {
      drawStud(context, x + scale * i + scale / 2, y + height / 2, scale * 0.16, "rgba(255,255,255,0.34)");
    }
  });

  return canvas.toDataURL("image/png");
}

function drawStud(context, x, y, radius, color) {
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2);
  context.fillStyle = color;
  context.fill();
  context.strokeStyle = "rgba(17,17,17,0.22)";
  context.lineWidth = 2;
  context.stroke();
}

function roundRect(context, x, y, width, height, radius) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.lineTo(x + width - radius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + radius);
  context.lineTo(x + width, y + height - radius);
  context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  context.lineTo(x + radius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - radius);
  context.lineTo(x, y + radius);
  context.quadraticCurveTo(x, y, x + radius, y);
  context.closePath();
}

renderBoard();
