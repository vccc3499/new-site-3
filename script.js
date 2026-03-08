const leadForm = document.getElementById("leadForm");

if (leadForm) {
  leadForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name")?.value.trim() || "";
    const phone = document.getElementById("phone")?.value.trim() || "";
    const service = document.getElementById("service")?.value.trim() || "";
    const message = document.getElementById("message")?.value.trim() || "";

    const text = `Здравствуйте!
Хочу обсудить работы.

Имя: ${name}
Телефон: ${phone}
Интересуют работы: ${service}
Комментарий: ${message}`;

    window.open(`https://wa.me/79539305851?text=${encodeURIComponent(text)}`, "_blank");
  });
}

const calcBtn = document.getElementById("calcBtn");
const sendCalcBtn = document.getElementById("sendCalcBtn");
const calcResultList = document.getElementById("calcResultList");
const calcTotal = document.getElementById("calcTotal");

const priceMap = {
  plaster: 450,
  puttyWallpaper: 250,
  puttyPaint: 350,
  paint: 220,
  tile: 1500,
  cable: 150,
  electricPoint: 1200,
  plumbingPoint: 1800,
  waterproofing: 450,
  ceilingPaint: 300
};

function money(value) {
  return new Intl.NumberFormat("ru-RU").format(Math.round(value)) + " ₽";
}

function getVal(id) {
  return +document.getElementById(id)?.value || 0;
}

function getText(id) {
  return document.getElementById(id)?.value.trim() || "";
}

function getChecked(id) {
  return document.getElementById(id)?.checked || false;
}

function calculateEstimate() {
  let total = 0;
  let lines = [];

  const complexity = +document.getElementById("complexity")?.value || 1;

  const bathLength = getVal("bathLength");
  const bathWidth = getVal("bathWidth");
  const bathHeight = getVal("bathHeight");
  const tileMode = document.getElementById("tileMode")?.value || "none";
  const tileSize = getText("tileSize");

  let floorArea = 0;
  let wallArea = 0;
  let ceilingArea = 0;

  if (bathLength > 0 && bathWidth > 0) {
    floorArea = bathLength * bathWidth;
    ceilingArea = floorArea;
  }

  if (bathLength > 0 && bathWidth > 0 && bathHeight > 0) {
    wallArea = 2 * (bathLength + bathWidth) * bathHeight;
  }

  if (tileMode === "floor" && floorArea > 0) {
    const sum = floorArea * priceMap.tile;
    total += sum;
    lines.push(`Плитка на пол${tileSize ? ` (${tileSize})` : ""}: ${floorArea.toFixed(2)} м² × ${priceMap.tile} ₽ = ${money(sum)}`);
  }

  if (tileMode === "floorwalls") {
    if (floorArea > 0) {
      const sumFloor = floorArea * priceMap.tile;
      total += sumFloor;
      lines.push(`Плитка на пол${tileSize ? ` (${tileSize})` : ""}: ${floorArea.toFixed(2)} м² × ${priceMap.tile} ₽ = ${money(sumFloor)}`);
    }

    if (wallArea > 0) {
      const sumWalls = wallArea * priceMap.tile;
      total += sumWalls;
      lines.push(`Плитка на стены${tileSize ? ` (${tileSize})` : ""}: ${wallArea.toFixed(2)} м² × ${priceMap.tile} ₽ = ${money(sumWalls)}`);
    }
  }

  if (getChecked("waterproofing") && floorArea > 0) {
    const sum = floorArea * priceMap.waterproofing;
    total += sum;
    lines.push(`Гидроизоляция пола: ${floorArea.toFixed(2)} м² × ${priceMap.waterproofing} ₽ = ${money(sum)}`);
  }

  if (getChecked("ceilingPaint") && ceilingArea > 0) {
    const sum = ceilingArea * priceMap.ceilingPaint;
    total += sum;
    lines.push(`Покраска потолка: ${ceilingArea.toFixed(2)} м² × ${priceMap.ceilingPaint} ₽ = ${money(sum)}`);
  }

  if (getChecked("wallPlaster") && wallArea > 0) {
    const sum = wallArea * priceMap.plaster;
    total += sum;
    lines.push(`Штукатурка стен ванной: ${wallArea.toFixed(2)} м² × ${priceMap.plaster} ₽ = ${money(sum)}`);
  }

  if (getChecked("wallPuttyPaint") && wallArea > 0) {
    const sum = wallArea * priceMap.puttyPaint;
    total += sum;
    lines.push(`Шпатлёвка стен ванной под покраску: ${wallArea.toFixed(2)} м² × ${priceMap.puttyPaint} ₽ = ${money(sum)}`);
  }

  const bathPlumbingPoints = getVal("bathPlumbingPoints");
  if (bathPlumbingPoints > 0) {
    const sum = bathPlumbingPoints * priceMap.plumbingPoint;
    total += sum;
    lines.push(`Сантехнические точки в ванной: ${bathPlumbingPoints} × ${priceMap.plumbingPoint} ₽ = ${money(sum)}`);
  }

  const bathElectricPoints = getVal("bathElectricPoints");
  if (bathElectricPoints > 0) {
    const sum = bathElectricPoints * priceMap.electricPoint;
    total += sum;
    lines.push(`Электроточки в ванной: ${bathElectricPoints} × ${priceMap.electricPoint} ₽ = ${money(sum)}`);
  }

  const cableLength = getVal("cableLength");
  if (cableLength > 0) {
    const sum = cableLength * priceMap.cable;
    total += sum;
    lines.push(`Разводка кабеля: ${cableLength} м × ${priceMap.cable} ₽ = ${money(sum)}`);
  }

  const plasterArea = getVal("plasterArea");
  if (plasterArea > 0) {
    const sum = plasterArea * priceMap.plaster;
    total += sum;
    lines.push(`Штукатурка: ${plasterArea} м² × ${priceMap.plaster} ₽ = ${money(sum)}`);
  }

  const puttyWallpaperArea = getVal("puttyWallpaperArea");
  if (puttyWallpaperArea > 0) {
    const sum = puttyWallpaperArea * priceMap.puttyWallpaper;
    total += sum;
    lines.push(`Шпатлёвка под обои: ${puttyWallpaperArea} м² × ${priceMap.puttyWallpaper} ₽ = ${money(sum)}`);
  }

  const puttyPaintArea = getVal("puttyPaintArea");
  if (puttyPaintArea > 0) {
    const sum = puttyPaintArea * priceMap.puttyPaint;
    total += sum;
    lines.push(`Шпатлёвка под покраску: ${puttyPaintArea} м² × ${priceMap.puttyPaint} ₽ = ${money(sum)}`);
  }

  const paintArea = getVal("paintArea");
  if (paintArea > 0) {
    const sum = paintArea * priceMap.paint;
    total += sum;
    lines.push(`Покраска: ${paintArea} м² × ${priceMap.paint} ₽ = ${money(sum)}`);
  }

  const tileArea = getVal("tileArea");
  if (tileArea > 0) {
    const sum = tileArea * priceMap.tile;
    total += sum;
    lines.push(`Дополнительные плиточные работы: ${tileArea} м² × ${priceMap.tile} ₽ = ${money(sum)}`);
  }

  const electricPoints = getVal("electricPoints");
  if (electricPoints > 0) {
    const sum = electricPoints * priceMap.electricPoint;
    total += sum;
    lines.push(`Дополнительные электроточки: ${electricPoints} × ${priceMap.electricPoint} ₽ = ${money(sum)}`);
  }

  const plumbingPoints = getVal("plumbingPoints");
  if (plumbingPoints > 0) {
    const sum = plumbingPoints * priceMap.plumbingPoint;
    total += sum;
    lines.push(`Дополнительные сантехточки: ${plumbingPoints} × ${priceMap.plumbingPoint} ₽ = ${money(sum)}`);
  }

  const totalWithComplexity = total * complexity;

  if (complexity > 1) {
    lines.push(`Коэффициент сложности: × ${complexity}`);
  }

  return {
    total: totalWithComplexity,
    lines
  };
}

if (calcBtn) {
  calcBtn.addEventListener("click", () => {
    const result = calculateEstimate();

    if (!calcResultList || !calcTotal) return;

    if (!result.lines.length) {
      calcResultList.innerHTML = `<div class="calc-result-item">Укажите параметры, чтобы получить предварительный расчёт.</div>`;
      calcTotal.textContent = "0 ₽";
      return;
    }

    calcResultList.innerHTML = result.lines
      .map(item => `<div class="calc-result-item">${item}</div>`)
      .join("");

    calcTotal.textContent = money(result.total);
  });
}

if (sendCalcBtn) {
  sendCalcBtn.addEventListener("click", () => {
    const result = calculateEstimate();

    if (!result.lines.length) {
      alert("Сначала заполните параметры расчёта.");
      return;
    }

    const text = `Здравствуйте!
Хочу обсудить предварительный расчёт.

${result.lines.join("\n")}

Итого: ${money(result.total)}`;

    window.open(`https://wa.me/79539305851?text=${encodeURIComponent(text)}`, "_blank");
  });
}

const servicesGrid = document.querySelector(".services-grid");

if (servicesGrid) {
  const videoSets = [
    [
      "https://cdn.coverr.co/videos/coverr-construction-worker-masonry-1574/1080p.mp4",
      "https://cdn.coverr.co/videos/coverr-workers-build-a-wooden-house-1578/1080p.mp4",
      "https://cdn.coverr.co/videos/coverr-engineer-at-construction-site-1575/1080p.mp4"
    ],
    [
      "https://cdn.coverr.co/videos/coverr-construction-workers-working-at-a-building-site-1579/1080p.mp4",
      "https://cdn.coverr.co/videos/coverr-working-on-a-construction-site-1577/1080p.mp4",
      "https://cdn.coverr.co/videos/coverr-pouring-concrete-1576/1080p.mp4"
    ],
    [
      "https://cdn.coverr.co/videos/coverr-renovating-an-apartment-1604/1080p.mp4",
      "https://cdn.coverr.co/videos/coverr-painting-a-wall-1606/1080p.mp4",
      "https://cdn.coverr.co/videos/coverr-tiling-a-wall-1605/1080p.mp4"
    ]
  ];

  const cards = servicesGrid.querySelectorAll(".card");

  cards.forEach((card, index) => {
    const set = videoSets[index % videoSets.length];
    if (!set?.length) return;

    const media = document.createElement("div");
    media.className = "service-media";

    const video = document.createElement("video");
    video.muted = true;
    video.loop = true;
    video.autoplay = true;
    video.playsInline = true;
    video.setAttribute("preload", "metadata");
    video.setAttribute("aria-label", "Пример выполненных работ");

    let clipIndex = 0;
    video.src = set[clipIndex];
    media.appendChild(video);
    card.prepend(media);

    video.play().catch(() => {});

    setInterval(() => {
      clipIndex = (clipIndex + 1) % set.length;
      video.classList.add("is-switching");

      setTimeout(() => {
        video.src = set[clipIndex];
        video.play().catch(() => {});
        video.classList.remove("is-switching");
      }, 260);
    }, 6500);
  });
}

