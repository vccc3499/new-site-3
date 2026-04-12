/* Modernized script.js
   - Fixed encoding (Russian) issues
   - Added theme toggle with localStorage
   - Cleaner calculator functions and share to WhatsApp
   - IntersectionObserver for fade-up animations
*/
(function () {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  function formatCurrency(v) {
    return new Intl.NumberFormat('ru-RU').format(Math.round(v)) + ' ₽';
  }

  // Theme toggle
  const themeToggle = $('#themeToggle');
  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
  }
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
      applyTheme(next);
    });
  }
  // init theme
  const saved = localStorage.getItem('theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  applyTheme(saved);

  // Simple fade-up on scroll using IntersectionObserver
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('fade-up--visible');
        io.unobserve(e.target);
      }
    });
  }, {threshold: 0.08});
  $$('.fade-up').forEach(el => io.observe(el));

  // Lead form -> WhatsApp
  const leadForm = $('#leadForm');
  if (leadForm) {
    leadForm.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const name = $('#name')?.value.trim() || '';
      const phone = $('#phone')?.value.trim() || '';
      const service = $('#service')?.value.trim() || '';
      const message = $('#message')?.value.trim() || '';
      const text = `Здравствуйте! Хотел(а) бы обсудить работу.\n\nИмя: ${name}\nТелефон: ${phone}\nУслуга: ${service}\nКомментарий: ${message}`;
      window.open(`https://wa.me/79539305851?text=${encodeURIComponent(text)}`, '_blank');
    });
  }

  // Calculator
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

  const calcBtn = $('#calcBtn');
  const sendCalcBtn = $('#sendCalcBtn');
  const calcResultList = $('#calcResultList');
  const calcTotal = $('#calcTotal');

  const getVal = id => +$('#' + id)?.value || 0;
  const getText = id => $('#' + id)?.value.trim() || '';
  const getChecked = id => !!$('#' + id)?.checked;

  function calculateEstimate() {
    let total = 0;
    const lines = [];
    const complexity = +$('#complexity')?.value || 1;

    const L = getVal('bathLength');
    const W = getVal('bathWidth');
    const H = getVal('bathHeight');
    const tileMode = $('#tileMode')?.value || 'none';
    const tileSize = getText('tileSize');

    const floor = (L > 0 && W > 0) ? L * W : 0;
    const ceiling = floor;
    const walls = (L > 0 && W > 0 && H > 0) ? 2 * (L + W) * H : 0;

    if ((tileMode === 'floor' || tileMode === 'floorwalls') && floor > 0) {
      const s = floor * priceMap.tile; total += s;
      lines.push(`Плитка на пол${tileSize ? ` (${tileSize})` : ''}: ${floor.toFixed(2)} м² × ${priceMap.tile} = ${formatCurrency(s)}`);
    }
    if (tileMode === 'floorwalls' && walls > 0) {
      const s = walls * priceMap.tile; total += s;
      lines.push(`Плитка на стены${tileSize ? ` (${tileSize})` : ''}: ${walls.toFixed(2)} м² × ${priceMap.tile} = ${formatCurrency(s)}`);
    }

    if (getChecked('waterproofing') && floor > 0) { const s = floor * priceMap.waterproofing; total += s; lines.push(`Гидроизоляция пола: ${floor.toFixed(2)} м² × ${priceMap.waterproofing} = ${formatCurrency(s)}`); }
    if (getChecked('ceilingPaint') && ceiling > 0) { const s = ceiling * priceMap.ceilingPaint; total += s; lines.push(`Покраска потолка: ${ceiling.toFixed(2)} м² × ${priceMap.ceilingPaint} = ${formatCurrency(s)}`); }
    if (getChecked('wallPlaster') && walls > 0) { const s = walls * priceMap.plaster; total += s; lines.push(`Штукатурка стен: ${walls.toFixed(2)} м² × ${priceMap.plaster} = ${formatCurrency(s)}`); }
    if (getChecked('wallPuttyPaint') && walls > 0) { const s = walls * priceMap.puttyPaint; total += s; lines.push(`Шпатлёвка под покраску: ${walls.toFixed(2)} м² × ${priceMap.puttyPaint} = ${formatCurrency(s)}`); }

    const bathPlumbingPoints = getVal('bathPlumbingPoints'); if (bathPlumbingPoints > 0) { const s = bathPlumbingPoints * priceMap.plumbingPoint; total += s; lines.push(`Сантехнические точки (ванная): ${bathPlumbingPoints} × ${priceMap.plumbingPoint} = ${formatCurrency(s)}`); }
    const bathElectricPoints = getVal('bathElectricPoints'); if (bathElectricPoints > 0) { const s = bathElectricPoints * priceMap.electricPoint; total += s; lines.push(`Электр. точки (ванная): ${bathElectricPoints} × ${priceMap.electricPoint} = ${formatCurrency(s)}`); }
    const cableLength = getVal('cableLength'); if (cableLength > 0) { const s = cableLength * priceMap.cable; total += s; lines.push(`Разводка кабеля: ${cableLength} м × ${priceMap.cable} = ${formatCurrency(s)}`); }

    const plasterArea = getVal('plasterArea'); if (plasterArea > 0) { const s = plasterArea * priceMap.plaster; total += s; lines.push(`Штукатурка (прочее): ${plasterArea} м² × ${priceMap.plaster} = ${formatCurrency(s)}`); }
    const puttyWallpaperArea = getVal('puttyWallpaperArea'); if (puttyWallpaperArea > 0) { const s = puttyWallpaperArea * priceMap.puttyWallpaper; total += s; lines.push(`Шпатлёвка под обои: ${puttyWallpaperArea} м² × ${priceMap.puttyWallpaper} = ${formatCurrency(s)}`); }
    const puttyPaintArea = getVal('puttyPaintArea'); if (puttyPaintArea > 0) { const s = puttyPaintArea * priceMap.puttyPaint; total += s; lines.push(`Шпатлёвка под покраску: ${puttyPaintArea} м² × ${priceMap.puttyPaint} = ${formatCurrency(s)}`); }
    const paintArea = getVal('paintArea'); if (paintArea > 0) { const s = paintArea * priceMap.paint; total += s; lines.push(`Покраска: ${paintArea} м² × ${priceMap.paint} = ${formatCurrency(s)}`); }
    const tileArea = getVal('tileArea'); if (tileArea > 0) { const s = tileArea * priceMap.tile; total += s; lines.push(`Плиточные работы (прочее): ${tileArea} м² × ${priceMap.tile} = ${formatCurrency(s)}`); }
    const electricPoints = getVal('electricPoints'); if (electricPoints > 0) { const s = electricPoints * priceMap.electricPoint; total += s; lines.push(`Электр. точки: ${electricPoints} × ${priceMap.electricPoint} = ${formatCurrency(s)}`); }
    const plumbingPoints = getVal('plumbingPoints'); if (plumbingPoints > 0) { const s = plumbingPoints * priceMap.plumbingPoint; total += s; lines.push(`Сантех. точки: ${plumbingPoints} × ${priceMap.plumbingPoint} = ${formatCurrency(s)}`); }

    const totalWithComplexity = total * complexity;
    if (complexity > 1) lines.push(`Коэффициент сложности: × ${complexity}`);
    return { total: totalWithComplexity, lines };
  }

  if (calcBtn) {
    calcBtn.addEventListener('click', () => {
      const res = calculateEstimate();
      if (!calcResultList || !calcTotal) return;
      if (!res.lines.length) {
        calcResultList.innerHTML = `<div class="calc-result-item">Заполните параметры, чтобы увидеть предварительный расчёт.</div>`;
        calcTotal.textContent = formatCurrency(0);
        return;
      }
      calcResultList.innerHTML = res.lines.map(i => `<div class="calc-result-item">${i}</div>`).join('');
      calcTotal.textContent = formatCurrency(res.total);
    });
  }

  if (sendCalcBtn) {
    sendCalcBtn.addEventListener('click', () => {
      const res = calculateEstimate();
      if (!res.lines.length) { alert('Заполните параметры расчёта.'); return; }
      const text = `Здравствуйте! Прошу рассмотреть предварительный расчёт:\n\n${res.lines.join('\n')}\n\nИтого: ${formatCurrency(res.total)}`;
      window.open(`https://wa.me/79539305851?text=${encodeURIComponent(text)}`, '_blank');
    });
  }

  // Services videos: lazy insert
  const servicesGrid = document.querySelector('.services-grid');
  if (servicesGrid) {
    const mergedVideos = [
      'media/services/merged/apartment.mp4', 'media/services/merged/house.mp4', 'media/services/merged/bathroom.mp4',
      'media/services/merged/plaster.mp4', 'media/services/merged/putty.mp4', 'media/services/merged/paint.mp4',
      'media/services/merged/tile.mp4', 'media/services/merged/electric.mp4', 'media/services/merged/plumbing.mp4',
      'media/services/merged/floors.mp4', 'media/services/merged/welding.mp4', 'media/services/merged/general.mp4'
    ];
    const cards = servicesGrid.querySelectorAll('.card');
    cards.forEach((card, idx) => {
      const src = mergedVideos[idx % mergedVideos.length];
      const media = document.createElement('div'); media.className = 'service-media';
      const video = document.createElement('video');
      video.muted = true; video.loop = true; video.playsInline = true; video.preload = 'metadata';
      video.src = src; video.setAttribute('aria-hidden','true');
      media.appendChild(video); card.prepend(media);
      video.addEventListener('canplay', () => { video.play().catch(()=>{}); });
    });
  }

  // Mobile menu toggle (progressive enhancement)
  const headerWrap = document.querySelector('.header__wrap');
  const header = document.querySelector('.header');
  if (headerWrap && header) {
    const nav = headerWrap.querySelector('.nav');
    if (nav && !headerWrap.querySelector('.menu-toggle')) {
      const btn = document.createElement('button'); btn.type = 'button'; btn.className = 'menu-toggle'; btn.setAttribute('aria-expanded','false'); btn.innerHTML = '☰';
      headerWrap.insertBefore(btn, nav);
      btn.addEventListener('click', () => {
        const open = header.classList.toggle('menu-open'); btn.setAttribute('aria-expanded', String(open));
      });
    }
  }

})();

