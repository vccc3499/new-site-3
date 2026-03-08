const leadForm = document.getElementById("leadForm");

if (leadForm) {
  leadForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name")?.value.trim() || "";
    const phone = document.getElementById("phone")?.value.trim() || "";
    const service = document.getElementById("service")?.value.trim() || "";
    const message = document.getElementById("message")?.value.trim() || "";

    const text = `Р—РґСЂР°РІСЃС‚РІСѓР№С‚Рµ!
РҐРѕС‡Сѓ РѕР±СЃСѓРґРёС‚СЊ СЂР°Р±РѕС‚С‹.

РРјСЏ: ${name}
РўРµР»РµС„РѕРЅ: ${phone}
РРЅС‚РµСЂРµСЃСѓСЋС‚ СЂР°Р±РѕС‚С‹: ${service}
РљРѕРјРјРµРЅС‚Р°СЂРёР№: ${message}`;

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
  return new Intl.NumberFormat("ru-RU").format(Math.round(value)) + " в‚Ѕ";
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
    lines.push(`РџР»РёС‚РєР° РЅР° РїРѕР»${tileSize ? ` (${tileSize})` : ""}: ${floorArea.toFixed(2)} РјВІ Г— ${priceMap.tile} в‚Ѕ = ${money(sum)}`);
  }

  if (tileMode === "floorwalls") {
    if (floorArea > 0) {
      const sumFloor = floorArea * priceMap.tile;
      total += sumFloor;
      lines.push(`РџР»РёС‚РєР° РЅР° РїРѕР»${tileSize ? ` (${tileSize})` : ""}: ${floorArea.toFixed(2)} РјВІ Г— ${priceMap.tile} в‚Ѕ = ${money(sumFloor)}`);
    }

    if (wallArea > 0) {
      const sumWalls = wallArea * priceMap.tile;
      total += sumWalls;
      lines.push(`РџР»РёС‚РєР° РЅР° СЃС‚РµРЅС‹${tileSize ? ` (${tileSize})` : ""}: ${wallArea.toFixed(2)} РјВІ Г— ${priceMap.tile} в‚Ѕ = ${money(sumWalls)}`);
    }
  }

  if (getChecked("waterproofing") && floorArea > 0) {
    const sum = floorArea * priceMap.waterproofing;
    total += sum;
    lines.push(`Р“РёРґСЂРѕРёР·РѕР»СЏС†РёСЏ РїРѕР»Р°: ${floorArea.toFixed(2)} РјВІ Г— ${priceMap.waterproofing} в‚Ѕ = ${money(sum)}`);
  }

  if (getChecked("ceilingPaint") && ceilingArea > 0) {
    const sum = ceilingArea * priceMap.ceilingPaint;
    total += sum;
    lines.push(`РџРѕРєСЂР°СЃРєР° РїРѕС‚РѕР»РєР°: ${ceilingArea.toFixed(2)} РјВІ Г— ${priceMap.ceilingPaint} в‚Ѕ = ${money(sum)}`);
  }

  if (getChecked("wallPlaster") && wallArea > 0) {
    const sum = wallArea * priceMap.plaster;
    total += sum;
    lines.push(`РЁС‚СѓРєР°С‚СѓСЂРєР° СЃС‚РµРЅ РІР°РЅРЅРѕР№: ${wallArea.toFixed(2)} РјВІ Г— ${priceMap.plaster} в‚Ѕ = ${money(sum)}`);
  }

  if (getChecked("wallPuttyPaint") && wallArea > 0) {
    const sum = wallArea * priceMap.puttyPaint;
    total += sum;
    lines.push(`РЁРїР°С‚Р»С‘РІРєР° СЃС‚РµРЅ РІР°РЅРЅРѕР№ РїРѕРґ РїРѕРєСЂР°СЃРєСѓ: ${wallArea.toFixed(2)} РјВІ Г— ${priceMap.puttyPaint} в‚Ѕ = ${money(sum)}`);
  }

  const bathPlumbingPoints = getVal("bathPlumbingPoints");
  if (bathPlumbingPoints > 0) {
    const sum = bathPlumbingPoints * priceMap.plumbingPoint;
    total += sum;
    lines.push(`РЎР°РЅС‚РµС…РЅРёС‡РµСЃРєРёРµ С‚РѕС‡РєРё РІ РІР°РЅРЅРѕР№: ${bathPlumbingPoints} Г— ${priceMap.plumbingPoint} в‚Ѕ = ${money(sum)}`);
  }

  const bathElectricPoints = getVal("bathElectricPoints");
  if (bathElectricPoints > 0) {
    const sum = bathElectricPoints * priceMap.electricPoint;
    total += sum;
    lines.push(`Р­Р»РµРєС‚СЂРѕС‚РѕС‡РєРё РІ РІР°РЅРЅРѕР№: ${bathElectricPoints} Г— ${priceMap.electricPoint} в‚Ѕ = ${money(sum)}`);
  }

  const cableLength = getVal("cableLength");
  if (cableLength > 0) {
    const sum = cableLength * priceMap.cable;
    total += sum;
    lines.push(`Р Р°Р·РІРѕРґРєР° РєР°Р±РµР»СЏ: ${cableLength} Рј Г— ${priceMap.cable} в‚Ѕ = ${money(sum)}`);
  }

  const plasterArea = getVal("plasterArea");
  if (plasterArea > 0) {
    const sum = plasterArea * priceMap.plaster;
    total += sum;
    lines.push(`РЁС‚СѓРєР°С‚СѓСЂРєР°: ${plasterArea} РјВІ Г— ${priceMap.plaster} в‚Ѕ = ${money(sum)}`);
  }

  const puttyWallpaperArea = getVal("puttyWallpaperArea");
  if (puttyWallpaperArea > 0) {
    const sum = puttyWallpaperArea * priceMap.puttyWallpaper;
    total += sum;
    lines.push(`РЁРїР°С‚Р»С‘РІРєР° РїРѕРґ РѕР±РѕРё: ${puttyWallpaperArea} РјВІ Г— ${priceMap.puttyWallpaper} в‚Ѕ = ${money(sum)}`);
  }

  const puttyPaintArea = getVal("puttyPaintArea");
  if (puttyPaintArea > 0) {
    const sum = puttyPaintArea * priceMap.puttyPaint;
    total += sum;
    lines.push(`РЁРїР°С‚Р»С‘РІРєР° РїРѕРґ РїРѕРєСЂР°СЃРєСѓ: ${puttyPaintArea} РјВІ Г— ${priceMap.puttyPaint} в‚Ѕ = ${money(sum)}`);
  }

  const paintArea = getVal("paintArea");
  if (paintArea > 0) {
    const sum = paintArea * priceMap.paint;
    total += sum;
    lines.push(`РџРѕРєСЂР°СЃРєР°: ${paintArea} РјВІ Г— ${priceMap.paint} в‚Ѕ = ${money(sum)}`);
  }

  const tileArea = getVal("tileArea");
  if (tileArea > 0) {
    const sum = tileArea * priceMap.tile;
    total += sum;
    lines.push(`Р”РѕРїРѕР»РЅРёС‚РµР»СЊРЅС‹Рµ РїР»РёС‚РѕС‡РЅС‹Рµ СЂР°Р±РѕС‚С‹: ${tileArea} РјВІ Г— ${priceMap.tile} в‚Ѕ = ${money(sum)}`);
  }

  const electricPoints = getVal("electricPoints");
  if (electricPoints > 0) {
    const sum = electricPoints * priceMap.electricPoint;
    total += sum;
    lines.push(`Р”РѕРїРѕР»РЅРёС‚РµР»СЊРЅС‹Рµ СЌР»РµРєС‚СЂРѕС‚РѕС‡РєРё: ${electricPoints} Г— ${priceMap.electricPoint} в‚Ѕ = ${money(sum)}`);
  }

  const plumbingPoints = getVal("plumbingPoints");
  if (plumbingPoints > 0) {
    const sum = plumbingPoints * priceMap.plumbingPoint;
    total += sum;
    lines.push(`Р”РѕРїРѕР»РЅРёС‚РµР»СЊРЅС‹Рµ СЃР°РЅС‚РµС…С‚РѕС‡РєРё: ${plumbingPoints} Г— ${priceMap.plumbingPoint} в‚Ѕ = ${money(sum)}`);
  }

  const totalWithComplexity = total * complexity;

  if (complexity > 1) {
    lines.push(`РљРѕСЌС„С„РёС†РёРµРЅС‚ СЃР»РѕР¶РЅРѕСЃС‚Рё: Г— ${complexity}`);
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
      calcResultList.innerHTML = `<div class="calc-result-item">РЈРєР°Р¶РёС‚Рµ РїР°СЂР°РјРµС‚СЂС‹, С‡С‚РѕР±С‹ РїРѕР»СѓС‡РёС‚СЊ РїСЂРµРґРІР°СЂРёС‚РµР»СЊРЅС‹Р№ СЂР°СЃС‡С‘С‚.</div>`;
      calcTotal.textContent = "0 в‚Ѕ";
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
      alert("РЎРЅР°С‡Р°Р»Р° Р·Р°РїРѕР»РЅРёС‚Рµ РїР°СЂР°РјРµС‚СЂС‹ СЂР°СЃС‡С‘С‚Р°.");
      return;
    }

    const text = `Р—РґСЂР°РІСЃС‚РІСѓР№С‚Рµ!
РҐРѕС‡Сѓ РѕР±СЃСѓРґРёС‚СЊ РїСЂРµРґРІР°СЂРёС‚РµР»СЊРЅС‹Р№ СЂР°СЃС‡С‘С‚.

${result.lines.join("\n")}

РС‚РѕРіРѕ: ${money(result.total)}`;

    window.open(`https://wa.me/79539305851?text=${encodeURIComponent(text)}`, "_blank");
  });
}

const servicesGrid = document.querySelector(".services-grid");

if (servicesGrid) {
  const mergedVideos = [
    "media/services/merged/apartment.mp4",
    "media/services/merged/house.mp4",
    "media/services/merged/bathroom.mp4",
    "media/services/merged/plaster.mp4",
    "media/services/merged/putty.mp4",
    "media/services/merged/paint.mp4",
    "media/services/merged/tile.mp4",
    "media/services/merged/electric.mp4",
    "media/services/merged/plumbing.mp4",
    "media/services/merged/floors.mp4",
    "media/services/merged/welding.mp4",
    "media/services/merged/general.mp4"
  ];

  const cards = servicesGrid.querySelectorAll(".card");

  cards.forEach((card, index) => {
    const media = document.createElement("div");
    media.className = "service-media";

    const video = document.createElement("video");
    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    video.autoplay = true;
    video.playsInline = true;
    video.setAttribute("autoplay", "");
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    video.setAttribute("webkit-playsinline", "");
    video.setAttribute("preload", "auto");
    video.setAttribute("aria-label", "Пример выполненных работ");
    video.classList.add("is-visible");
    video.src = mergedVideos[index % mergedVideos.length];

    media.appendChild(video);
    card.prepend(media);
    card.classList.add("is-active");
    video.play().catch(() => {});
  });
}

const headerWrap = document.querySelector(".header__wrap");
const header = document.querySelector(".header");

if (headerWrap && header) {
  const nav = headerWrap.querySelector(".nav");
  if (nav && !headerWrap.querySelector(".menu-toggle")) {
    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "menu-toggle";
    toggle.textContent = "Меню";
    headerWrap.insertBefore(toggle, nav);

    toggle.addEventListener("click", () => {
      header.classList.toggle("menu-open");
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        header.classList.remove("menu-open");
      });
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 760) {
        header.classList.remove("menu-open");
      }
    });
  }
}

