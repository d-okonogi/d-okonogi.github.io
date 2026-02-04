// Japan Map Graph Coloring Demo
// Four Color Theorem Visualization

(function() {
  'use strict';

  // 4 colors for the four color theorem
  const COLORS = ['#e74c3c', '#3498db', '#2ecc71', '#f1c40f'];
  const UNCOLORED = '#ddd';

  // Prefecture data with simplified polygon paths and adjacency
  const prefectures = {
    hokkaido: { name: '北海道', path: 'M 350 15 L 400 5 L 450 20 L 465 60 L 455 100 L 420 115 L 380 110 L 345 85 L 335 50 Z', adjacent: [] },
    aomori: { name: '青森', path: 'M 390 115 L 415 110 L 425 125 L 415 145 L 385 145 L 375 130 Z', adjacent: ['iwate', 'akita'] },
    iwate: { name: '岩手', path: 'M 400 145 L 425 145 L 430 175 L 420 200 L 395 200 L 385 175 Z', adjacent: ['aomori', 'akita', 'miyagi'] },
    miyagi: { name: '宮城', path: 'M 395 200 L 420 200 L 425 225 L 405 235 L 385 225 Z', adjacent: ['iwate', 'akita', 'yamagata', 'fukushima'] },
    akita: { name: '秋田', path: 'M 365 140 L 385 145 L 385 175 L 395 200 L 380 210 L 355 195 L 350 165 Z', adjacent: ['aomori', 'iwate', 'miyagi', 'yamagata'] },
    yamagata: { name: '山形', path: 'M 355 195 L 380 210 L 385 225 L 375 250 L 350 245 L 340 220 Z', adjacent: ['akita', 'miyagi', 'fukushima', 'niigata'] },
    fukushima: { name: '福島', path: 'M 350 245 L 375 250 L 405 235 L 410 260 L 385 280 L 345 275 L 335 255 Z', adjacent: ['miyagi', 'yamagata', 'niigata', 'gunma', 'tochigi', 'ibaraki'] },
    ibaraki: { name: '茨城', path: 'M 385 280 L 405 275 L 415 300 L 405 325 L 380 320 L 375 295 Z', adjacent: ['fukushima', 'tochigi', 'saitama', 'chiba'] },
    tochigi: { name: '栃木', path: 'M 360 275 L 385 280 L 380 305 L 365 315 L 345 305 L 345 280 Z', adjacent: ['fukushima', 'ibaraki', 'gunma', 'saitama'] },
    gunma: { name: '群馬', path: 'M 315 270 L 345 275 L 345 305 L 330 320 L 305 310 L 300 285 Z', adjacent: ['fukushima', 'niigata', 'nagano', 'tochigi', 'saitama'] },
    saitama: { name: '埼玉', path: 'M 330 320 L 365 315 L 375 335 L 360 350 L 330 345 L 320 330 Z', adjacent: ['gunma', 'tochigi', 'ibaraki', 'chiba', 'tokyo', 'yamanashi', 'nagano'] },
    chiba: { name: '千葉', path: 'M 375 335 L 405 325 L 420 355 L 410 385 L 380 380 L 370 355 Z', adjacent: ['ibaraki', 'saitama', 'tokyo'] },
    tokyo: { name: '東京', path: 'M 350 350 L 375 345 L 380 365 L 365 380 L 345 375 L 340 360 Z', adjacent: ['saitama', 'chiba', 'kanagawa', 'yamanashi'] },
    kanagawa: { name: '神奈川', path: 'M 335 375 L 365 380 L 370 400 L 350 410 L 325 400 L 320 385 Z', adjacent: ['tokyo', 'yamanashi', 'shizuoka'] },
    niigata: { name: '新潟', path: 'M 285 220 L 335 255 L 345 275 L 315 270 L 285 280 L 270 260 L 265 235 Z', adjacent: ['yamagata', 'fukushima', 'gunma', 'nagano', 'toyama'] },
    toyama: { name: '富山', path: 'M 250 265 L 270 260 L 285 280 L 275 300 L 250 300 L 240 280 Z', adjacent: ['niigata', 'nagano', 'gifu', 'ishikawa'] },
    ishikawa: { name: '石川', path: 'M 225 250 L 250 265 L 250 300 L 235 315 L 215 305 L 210 275 Z', adjacent: ['toyama', 'gifu', 'fukui'] },
    fukui: { name: '福井', path: 'M 215 305 L 235 315 L 240 345 L 225 360 L 200 350 L 195 325 Z', adjacent: ['ishikawa', 'gifu', 'shiga', 'kyoto'] },
    yamanashi: { name: '山梨', path: 'M 305 350 L 330 345 L 340 370 L 325 390 L 300 385 L 295 365 Z', adjacent: ['saitama', 'tokyo', 'kanagawa', 'nagano', 'shizuoka'] },
    nagano: { name: '長野', path: 'M 270 295 L 305 310 L 320 330 L 305 350 L 295 365 L 265 355 L 250 325 L 255 300 Z', adjacent: ['niigata', 'gunma', 'saitama', 'yamanashi', 'shizuoka', 'aichi', 'gifu', 'toyama'] },
    gifu: { name: '岐阜', path: 'M 235 315 L 255 300 L 265 330 L 260 360 L 235 370 L 215 355 L 215 330 Z', adjacent: ['toyama', 'ishikawa', 'fukui', 'shiga', 'mie', 'aichi', 'nagano'] },
    shizuoka: { name: '静岡', path: 'M 280 385 L 325 390 L 340 410 L 320 430 L 280 425 L 265 405 Z', adjacent: ['kanagawa', 'yamanashi', 'nagano', 'aichi'] },
    aichi: { name: '愛知', path: 'M 245 375 L 280 385 L 280 415 L 260 430 L 235 420 L 230 395 Z', adjacent: ['shizuoka', 'nagano', 'gifu', 'mie'] },
    mie: { name: '三重', path: 'M 210 385 L 235 390 L 245 420 L 235 450 L 205 445 L 195 415 Z', adjacent: ['aichi', 'gifu', 'shiga', 'kyoto', 'nara', 'wakayama'] },
    shiga: { name: '滋賀', path: 'M 200 350 L 225 360 L 230 385 L 215 400 L 190 395 L 185 370 Z', adjacent: ['fukui', 'gifu', 'mie', 'kyoto'] },
    kyoto: { name: '京都', path: 'M 165 345 L 200 350 L 200 385 L 185 410 L 155 405 L 145 375 Z', adjacent: ['fukui', 'shiga', 'mie', 'nara', 'osaka', 'hyogo'] },
    osaka: { name: '大阪', path: 'M 170 410 L 190 405 L 200 425 L 190 445 L 165 440 L 160 420 Z', adjacent: ['kyoto', 'nara', 'wakayama', 'hyogo'] },
    hyogo: { name: '兵庫', path: 'M 130 365 L 165 375 L 170 410 L 165 440 L 135 445 L 115 420 L 115 385 Z', adjacent: ['kyoto', 'osaka', 'tottori', 'okayama'] },
    nara: { name: '奈良', path: 'M 185 420 L 205 415 L 215 445 L 200 465 L 175 460 L 170 435 Z', adjacent: ['mie', 'kyoto', 'osaka', 'wakayama'] },
    wakayama: { name: '和歌山', path: 'M 160 450 L 185 455 L 195 485 L 175 505 L 150 495 L 145 465 Z', adjacent: ['mie', 'nara', 'osaka'] },
    tottori: { name: '鳥取', path: 'M 100 375 L 130 365 L 130 390 L 115 405 L 85 400 L 80 380 Z', adjacent: ['hyogo', 'okayama', 'hiroshima', 'shimane'] },
    shimane: { name: '島根', path: 'M 45 370 L 80 365 L 85 400 L 70 420 L 35 415 L 25 390 Z', adjacent: ['tottori', 'hiroshima', 'yamaguchi'] },
    okayama: { name: '岡山', path: 'M 95 405 L 130 400 L 135 430 L 115 445 L 85 440 L 80 415 Z', adjacent: ['hyogo', 'tottori', 'hiroshima', 'kagawa'] },
    hiroshima: { name: '広島', path: 'M 50 410 L 85 400 L 95 430 L 80 455 L 45 450 L 35 425 Z', adjacent: ['tottori', 'shimane', 'okayama', 'yamaguchi', 'ehime'] },
    yamaguchi: { name: '山口', path: 'M 15 420 L 45 415 L 55 450 L 40 475 L 10 470 L 5 445 Z', adjacent: ['shimane', 'hiroshima'] },
    tokushima: { name: '徳島', path: 'M 130 470 L 160 465 L 170 490 L 155 510 L 125 505 L 115 480 Z', adjacent: ['kagawa', 'ehime', 'kochi'] },
    kagawa: { name: '香川', path: 'M 100 450 L 130 445 L 135 465 L 120 480 L 95 475 L 90 460 Z', adjacent: ['okayama', 'tokushima', 'ehime'] },
    ehime: { name: '愛媛', path: 'M 60 465 L 95 460 L 105 495 L 90 520 L 55 515 L 45 485 Z', adjacent: ['hiroshima', 'kagawa', 'tokushima', 'kochi'] },
    kochi: { name: '高知', path: 'M 75 520 L 115 510 L 140 540 L 120 565 L 80 560 L 60 535 Z', adjacent: ['tokushima', 'ehime'] },
    fukuoka: { name: '福岡', path: 'M 40 510 L 70 505 L 80 530 L 65 550 L 35 545 L 25 525 Z', adjacent: ['saga', 'oita', 'kumamoto'] },
    saga: { name: '佐賀', path: 'M 15 530 L 40 525 L 45 550 L 30 565 L 10 560 L 5 545 Z', adjacent: ['fukuoka', 'nagasaki'] },
    nagasaki: { name: '長崎', path: 'M -15 555 L 15 545 L 20 575 L 5 600 L -20 595 L -25 570 Z', adjacent: ['saga'] },
    kumamoto: { name: '熊本', path: 'M 35 560 L 65 555 L 75 585 L 60 610 L 30 605 L 20 580 Z', adjacent: ['fukuoka', 'oita', 'miyazaki', 'kagoshima'] },
    oita: { name: '大分', path: 'M 65 535 L 95 525 L 105 555 L 90 575 L 60 570 L 55 550 Z', adjacent: ['fukuoka', 'kumamoto', 'miyazaki'] },
    miyazaki: { name: '宮崎', path: 'M 70 580 L 100 570 L 115 605 L 100 635 L 70 630 L 60 600 Z', adjacent: ['oita', 'kumamoto', 'kagoshima'] },
    kagoshima: { name: '鹿児島', path: 'M 35 615 L 65 605 L 75 645 L 55 675 L 25 665 L 15 635 Z', adjacent: ['kumamoto', 'miyazaki'] },
    okinawa: { name: '沖縄', path: 'M -30 700 L 0 695 L 15 720 L 5 745 L -25 740 L -35 715 Z', adjacent: [] }
  };

  // Greedy graph coloring algorithm with animation
  function greedyColoring(prefectureIds, onColorAssigned, onComplete) {
    const colorAssignment = {};
    let index = 0;

    function colorNext() {
      if (index >= prefectureIds.length) {
        if (onComplete) onComplete(colorAssignment);
        return;
      }

      const prefId = prefectureIds[index];
      const pref = prefectures[prefId];

      // Find colors used by adjacent prefectures
      const usedColors = new Set();
      pref.adjacent.forEach(adjId => {
        if (colorAssignment[adjId] !== undefined) {
          usedColors.add(colorAssignment[adjId]);
        }
      });

      // Find the first available color
      let colorIndex = 0;
      while (usedColors.has(colorIndex)) {
        colorIndex++;
      }

      colorAssignment[prefId] = colorIndex;

      if (onColorAssigned) {
        onColorAssigned(prefId, colorIndex);
      }

      index++;
      setTimeout(colorNext, 80); // Animation delay
    }

    colorNext();
  }

  // Shuffle array (Fisher-Yates)
  function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // Initialize the map
  function initMap() {
    const container = document.getElementById('japan-map-container');
    if (!container) return;

    // Create SVG
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '-50 20 500 750');
    svg.setAttribute('class', 'japan-map-svg');
    svg.id = 'japan-map';

    // Create prefecture paths
    Object.keys(prefectures).forEach(id => {
      const pref = prefectures[id];
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', pref.path);
      path.setAttribute('id', `pref-${id}`);
      path.setAttribute('class', 'prefecture');
      path.setAttribute('fill', UNCOLORED);
      path.setAttribute('stroke', '#fff');
      path.setAttribute('stroke-width', '1.5');

      // Tooltip
      const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      title.textContent = pref.name;
      path.appendChild(title);

      svg.appendChild(path);
    });

    container.appendChild(svg);

    // Create control button
    const button = document.createElement('button');
    button.id = 'solve-btn';
    button.className = 'solve-button';
    button.textContent = 'Re-solve';
    button.addEventListener('click', () => solve(true));
    container.appendChild(button);

    // Create info text
    const info = document.createElement('div');
    info.className = 'map-info';
    info.innerHTML = '<span class="map-title">Four Color Theorem</span><span class="map-subtitle">Graph Coloring on Japan Map</span>';
    container.appendChild(info);

    // Start auto-looping animation
    setTimeout(() => solve(true), 500);
  }

  let isRunning = false;

  // Run the coloring algorithm
  function solve(autoLoop = false) {
    if (isRunning) return;
    isRunning = true;

    // Reset all colors with fade out
    Object.keys(prefectures).forEach(id => {
      const path = document.getElementById(`pref-${id}`);
      if (path) {
        path.style.transition = 'fill 0.5s ease';
        path.setAttribute('fill', UNCOLORED);
      }
    });

    // Wait for reset animation, then start coloring
    setTimeout(() => {
      // Shuffle order for variety
      const order = shuffle(Object.keys(prefectures));

      greedyColoring(order, (prefId, colorIndex) => {
        const path = document.getElementById(`pref-${prefId}`);
        if (path) {
          path.style.transition = 'fill 0.3s ease';
          path.setAttribute('fill', COLORS[colorIndex]);
        }
      }, () => {
        isRunning = false;
        // Auto loop: wait 3 seconds then restart
        if (autoLoop) {
          setTimeout(() => solve(true), 3000);
        }
      });
    }, 600);
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMap);
  } else {
    initMap();
  }
})();
