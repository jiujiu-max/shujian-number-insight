import { DIMENSIONS, radarPoints, type TypeShareData } from "./eight-types";

// Generated on-device, after an explicit click. No report data in requests.
export async function renderTypeCard(data: TypeShareData): Promise<Blob> {
  await document.fonts.ready;
  const canvas = document.createElement("canvas");
  canvas.width = 1080; canvas.height = 2048;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("当前浏览器暂不支持生成图片");
  const ink = "#193c32", muted = "#53655b", accent = "#a44932";
  const sans = '"PingFang SC", "Microsoft YaHei", sans-serif';
  const serif = '"Songti SC", "STSong", serif';
  ctx.fillStyle = "#f6f3e9"; ctx.fillRect(0, 0, canvas.width, canvas.height);
  const text = (copy: string, x: number, y: number, size = 30, color = ink, font = sans) => {
    ctx.font = `${size}px ${font}`; ctx.fillStyle = color; ctx.textAlign = "left"; ctx.fillText(copy, x, y);
  };
  const wrap = (copy: string, x: number, y: number, width: number, size = 32, color = ink) => {
    ctx.font = `${size}px ${sans}`;
    let line = "", top = y;
    for (const character of copy) {
      if (ctx.measureText(line + character).width > width && line) {
        text(line, x, top, size, color); line = character; top += size * 1.6;
      } else line += character;
    }
    if (line) text(line, x, top, size, color);
    return top + size * 1.6;
  };
  text("数见八型", 84, 110, 36, ink, serif);
  text("我的性格卡", 810, 110, 26, muted);
  text("在这份传统数字画像里，我是", 84, 195, 29, muted);
  text(data.name, 78, 318, 112, ink, serif);
  ctx.strokeStyle = accent; ctx.lineWidth = 3; ctx.strokeRect(845, 205, 140, 140);
  text(data.word, 876, 306, 84, accent, serif);
  text(data.role, 84, 395, 39, accent, serif);
  wrap(data.tagline, 84, 453, 900, 30);

  const centerX = 540, centerY = 740, radius = 170;
  const path = (points: readonly (readonly [number, number])[]) => {
    ctx.beginPath(); points.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath();
  };
  for (const level of [.25, .5, .75, 1]) {
    path(radarPoints(Array(5).fill(level), centerX, centerY, radius));
    ctx.strokeStyle = "#bdc9bd"; ctx.lineWidth = 2; ctx.stroke();
  }
  radarPoints([1, 1, 1, 1, 1], centerX, centerY, radius).forEach(([x, y]) => {
    ctx.beginPath(); ctx.moveTo(centerX, centerY); ctx.lineTo(x, y); ctx.stroke();
  });
  path(radarPoints(data.values, centerX, centerY, radius));
  ctx.fillStyle = "rgba(40,93,73,.18)"; ctx.fill(); ctx.strokeStyle = ink; ctx.lineWidth = 4; ctx.stroke();
  radarPoints(data.values, centerX, centerY, radius).forEach(([x, y]) => {
    ctx.beginPath(); ctx.arc(x, y, 6, 0, Math.PI * 2); ctx.fillStyle = accent; ctx.fill();
  });
  radarPoints([1.3, 1.3, 1.3, 1.3, 1.3], centerX, centerY, radius).forEach(([x, y], i) => {
    ctx.font = `28px ${sans}`; ctx.fillStyle = ink; ctx.textAlign = "center"; ctx.fillText(DIMENSIONS[i], x, y + 10);
  });
  text("五维规则示意 · 越突出不代表越好", 280, 998, 25, muted);

  text("我的长处", 84, 1080, 27, accent);
  const strengthEnd = wrap(data.strength, 84, 1136, 900, 32);
  text("我的吃亏点", 84, strengthEnd + 38, 27, accent);
  const watchEnd = wrap(data.watchout, 84, strengthEnd + 92, 900, 32);
  const footerY = Math.max(1295, watchEnd + 35);
  ctx.strokeStyle = "#c9cdbb"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(84, footerY); ctx.lineTo(996, footerY); ctx.stroke();
  text("你是哪种人，容易在哪吃亏？", 84, footerY + 55, 35, ink, serif);
  text("扫码看看 · 你和朋友是不是同一型", 84, footerY + 105, 24, muted);
  text("传统数字文化体验 · 非心理测评", 84, footerY + 147, 23, muted);
  const qr = new Image();
  const qrReady = new Promise<void>((resolve, reject) => { qr.onload = () => resolve(); qr.onerror = () => reject(new Error("测试入口二维码加载失败，请重试")); });
  qr.src = "/type-entry-qr.png";
  await qrReady;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(qr, 816, footerY + 8, 164, 164);
  const output = document.createElement("canvas");
  output.width = 1080; output.height = footerY + 225;
  const outputCtx = output.getContext("2d");
  if (!outputCtx) throw new Error("生成图片失败，请重试");
  outputCtx.drawImage(canvas, 0, 0);
  outputCtx.strokeStyle = "#c9cdbb"; outputCtx.lineWidth = 2; outputCtx.strokeRect(32, 32, 1016, output.height - 64);
  return new Promise((resolve, reject) => output.toBlob(blob => blob ? resolve(blob) : reject(new Error("生成图片失败，请重试")), "image/png"));
}
