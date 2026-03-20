const canvas = document.getElementById("artCanvas");
const ctx = canvas.getContext("2d");

const clearBtn = document.getElementById("clearBtn");
const saveBtn = document.getElementById("saveBtn");
const paletteSelect = document.getElementById("paletteSelect");
const shapeSelect = document.getElementById("shapeSelect");
const sizeRange = document.getElementById("sizeRange");
const densityRange = document.getElementById("densityRange");

const palettes = {
  warm: ["#e63946", "#f4a261", "#e9c46a", "#ff6b6b", "#c1121f"],
  cold: ["#118ab2", "#06d6a0", "#457b9d", "#90e0ef", "#023e8a"],
  mono: ["#111111", "#444444", "#777777", "#aaaaaa", "#dddddd"],
  neon: ["#ff00c8", "#00f5ff", "#39ff14", "#ffe600", "#9d4edd"]
};

let currentPalette = palettes.warm;
let currentShape = "circle";
let isDrawing = false;
let lastX = 0;
let lastY = 0;

let baseSize = 18;
let splashDensity = 6;

function randomFromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function drawCircle(x, y, size, color, alpha) {
  ctx.beginPath();
  ctx.arc(x, y, size / 2, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.globalAlpha = alpha;
  ctx.fill();
  ctx.globalAlpha = 1;
}

function drawSquare(x, y, size, color, alpha) {
  ctx.fillStyle = color;
  ctx.globalAlpha = alpha;
  ctx.fillRect(x - size / 2, y - size / 2, size, size);
  ctx.globalAlpha = 1;
}

function drawLine(x1, y1, x2, y2, color, alpha) {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = color;
  ctx.globalAlpha = alpha;
  ctx.lineWidth = Math.random() * (baseSize / 2) + 2;
  ctx.lineCap = "round";
  ctx.stroke();
  ctx.globalAlpha = 1;
}

function drawSpray(x, y) {
  const particles = Math.floor(Math.random() * splashDensity) + splashDensity + 4;

  for (let i = 0; i < particles; i++) {
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * (baseSize + 4);
    const size = Math.random() * (baseSize / 2) + 2;
    const px = x + Math.cos(angle) * distance;
    const py = y + Math.sin(angle) * distance;
    const color = randomFromArray(currentPalette);
    const alpha = Math.random() * 0.4 + 0.25;

    drawCircle(px, py, size, color, alpha);
  }
}

function drawShape(x, y) {
  const color = randomFromArray(currentPalette);
  const size = Math.random() * baseSize + 4;
  const alpha = Math.random() * 0.45 + 0.35;

  if (currentShape === "circle") {
    drawCircle(x, y, size, color, alpha);
  } else if (currentShape === "square") {
    drawSquare(x, y, size, color, alpha);
  } else if (currentShape === "line") {
    drawLine(lastX, lastY, x, y, color, alpha);
  } else if (currentShape === "spray") {
    drawSpray(x, y);
  }
}

function drawSplash(x, y) {
  const particles = Math.floor(Math.random() * splashDensity) + splashDensity;

  for (let i = 0; i < particles; i++) {
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * baseSize;
    const px = x + Math.cos(angle) * distance;
    const py = y + Math.sin(angle) * distance;

    drawShape(px, py);
  }
}

function drawTrail(x, y) {
  if (currentShape === "spray") {
    drawSpray(x, y);
  } else {
    drawSplash(x, y);
    drawShape(x, y);
  }
}

function getMousePos(event) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  return {
    x: (event.clientX - rect.left) * scaleX,
    y: (event.clientY - rect.top) * scaleY
  };
}

canvas.addEventListener("mousedown", (event) => {
  isDrawing = true;
  const { x, y } = getMousePos(event);
  lastX = x;
  lastY = y;
  drawTrail(x, y);
});

canvas.addEventListener("mouseup", () => {
  isDrawing = false;
});

canvas.addEventListener("mouseleave", () => {
  isDrawing = false;
});

canvas.addEventListener("mousemove", (event) => {
  const { x, y } = getMousePos(event);

  drawTrail(x, y);

  if (isDrawing) {
    drawSplash(x, y);
  }

  lastX = x;
  lastY = y;
});

clearBtn.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#f7f4ee";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
});

saveBtn.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = "rasto-vivo.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
});

paletteSelect.addEventListener("change", (event) => {
  currentPalette = palettes[event.target.value];
});

shapeSelect.addEventListener("change", (event) => {
  currentShape = event.target.value;
});

sizeRange.addEventListener("input", (event) => {
  baseSize = Number(event.target.value);
});

densityRange.addEventListener("input", (event) => {
  splashDensity = Number(event.target.value);
});

function initCanvas() {
  ctx.fillStyle = "#f7f4ee";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

initCanvas();