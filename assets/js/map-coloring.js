// Japan Map Graph Coloring Demo
// Four Color Theorem Visualization with accurate prefecture boundaries

(function() {
  'use strict';

  const COLORS = ['#e63946', '#457b9d', '#2a9d8f', '#e9c46a', '#9d4edd'];
  const UNCOLORED = '#ddd';

  // Adjacency data for all 47 prefectures
  const adjacency = {
    hokkaido: [],
    aomori: ['iwate', 'akita'],
    iwate: ['aomori', 'akita', 'miyagi'],
    miyagi: ['iwate', 'akita', 'yamagata', 'fukushima'],
    akita: ['aomori', 'iwate', 'miyagi', 'yamagata'],
    yamagata: ['akita', 'miyagi', 'fukushima', 'niigata'],
    fukushima: ['miyagi', 'yamagata', 'niigata', 'gunma', 'tochigi', 'ibaraki'],
    ibaraki: ['fukushima', 'tochigi', 'saitama', 'chiba'],
    tochigi: ['fukushima', 'ibaraki', 'gunma', 'saitama'],
    gunma: ['fukushima', 'niigata', 'nagano', 'tochigi', 'saitama'],
    saitama: ['gunma', 'tochigi', 'ibaraki', 'chiba', 'tokyo', 'yamanashi', 'nagano'],
    chiba: ['ibaraki', 'saitama', 'tokyo'],
    tokyo: ['saitama', 'chiba', 'kanagawa', 'yamanashi'],
    kanagawa: ['tokyo', 'yamanashi', 'shizuoka'],
    niigata: ['yamagata', 'fukushima', 'gunma', 'nagano', 'toyama'],
    toyama: ['niigata', 'nagano', 'gifu', 'ishikawa'],
    ishikawa: ['toyama', 'gifu', 'fukui'],
    fukui: ['ishikawa', 'gifu', 'shiga', 'kyoto'],
    yamanashi: ['saitama', 'tokyo', 'kanagawa', 'nagano', 'shizuoka'],
    nagano: ['niigata', 'gunma', 'saitama', 'yamanashi', 'shizuoka', 'aichi', 'gifu', 'toyama'],
    gifu: ['toyama', 'ishikawa', 'fukui', 'shiga', 'mie', 'aichi', 'nagano'],
    shizuoka: ['kanagawa', 'yamanashi', 'nagano', 'aichi'],
    aichi: ['shizuoka', 'nagano', 'gifu', 'mie'],
    mie: ['aichi', 'gifu', 'shiga', 'kyoto', 'nara', 'wakayama'],
    shiga: ['fukui', 'gifu', 'mie', 'kyoto'],
    kyoto: ['fukui', 'shiga', 'mie', 'nara', 'osaka', 'hyogo'],
    osaka: ['kyoto', 'nara', 'wakayama', 'hyogo'],
    hyogo: ['kyoto', 'osaka', 'tottori', 'okayama'],
    nara: ['mie', 'kyoto', 'osaka', 'wakayama'],
    wakayama: ['mie', 'nara', 'osaka'],
    tottori: ['hyogo', 'okayama', 'hiroshima', 'shimane'],
    shimane: ['tottori', 'hiroshima', 'yamaguchi'],
    okayama: ['hyogo', 'tottori', 'hiroshima', 'kagawa'],
    hiroshima: ['tottori', 'shimane', 'okayama', 'yamaguchi', 'ehime'],
    yamaguchi: ['shimane', 'hiroshima'],
    tokushima: ['kagawa', 'ehime', 'kochi'],
    kagawa: ['okayama', 'tokushima', 'ehime'],
    ehime: ['hiroshima', 'kagawa', 'tokushima', 'kochi'],
    kochi: ['tokushima', 'ehime'],
    fukuoka: ['saga', 'oita', 'kumamoto'],
    saga: ['fukuoka', 'nagasaki'],
    nagasaki: ['saga'],
    kumamoto: ['fukuoka', 'oita', 'miyazaki', 'kagoshima'],
    oita: ['fukuoka', 'kumamoto', 'miyazaki'],
    miyazaki: ['oita', 'kumamoto', 'kagoshima'],
    kagoshima: ['kumamoto', 'miyazaki'],
    okinawa: []
  };

  const prefectureNames = {
    hokkaido: '北海道', aomori: '青森県', iwate: '岩手県', miyagi: '宮城県',
    akita: '秋田県', yamagata: '山形県', fukushima: '福島県', ibaraki: '茨城県',
    tochigi: '栃木県', gunma: '群馬県', saitama: '埼玉県', chiba: '千葉県',
    tokyo: '東京都', kanagawa: '神奈川県', niigata: '新潟県', toyama: '富山県',
    ishikawa: '石川県', fukui: '福井県', yamanashi: '山梨県', nagano: '長野県',
    gifu: '岐阜県', shizuoka: '静岡県', aichi: '愛知県', mie: '三重県',
    shiga: '滋賀県', kyoto: '京都府', osaka: '大阪府', hyogo: '兵庫県',
    nara: '奈良県', wakayama: '和歌山県', tottori: '鳥取県', shimane: '島根県',
    okayama: '岡山県', hiroshima: '広島県', yamaguchi: '山口県', tokushima: '徳島県',
    kagawa: '香川県', ehime: '愛媛県', kochi: '高知県', fukuoka: '福岡県',
    saga: '佐賀県', nagasaki: '長崎県', kumamoto: '熊本県', oita: '大分県',
    miyazaki: '宮崎県', kagoshima: '鹿児島県', okinawa: '沖縄県'
  };

  // GeoJSON URL (using a reliable CDN source)
  const GEOJSON_URL = 'https://raw.githubusercontent.com/dataofjapan/land/master/japan.geojson';

  let prefecturePaths = {};
  let svg = null;
  let isRunning = false;

  // Greedy graph coloring algorithm
  function greedyColoring(prefectureIds, onColorAssigned, onComplete) {
    const colorAssignment = {};
    let index = 0;

    function colorNext() {
      if (index >= prefectureIds.length) {
        if (onComplete) onComplete(colorAssignment);
        return;
      }

      const prefId = prefectureIds[index];
      const adj = adjacency[prefId] || [];

      const usedColors = new Set();
      adj.forEach(adjId => {
        if (colorAssignment[adjId] !== undefined) {
          usedColors.add(colorAssignment[adjId]);
        }
      });

      let colorIndex = 0;
      while (usedColors.has(colorIndex)) {
        colorIndex++;
      }

      colorAssignment[prefId] = colorIndex;

      if (onColorAssigned) {
        onColorAssigned(prefId, colorIndex);
      }

      index++;
      setTimeout(colorNext, 80);
    }

    colorNext();
  }

  function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // Convert GeoJSON coordinates to SVG path
  function coordsToPath(coords, projection) {
    if (!coords || coords.length === 0) return '';

    let path = '';
    coords.forEach((ring, ringIndex) => {
      ring.forEach((point, i) => {
        const [x, y] = projection(point);
        if (i === 0) {
          path += `M ${x} ${y} `;
        } else {
          path += `L ${x} ${y} `;
        }
      });
      path += 'Z ';
    });
    return path;
  }

  // Simple Mercator-like projection for Japan
  function createProjection(width, height) {
    // Japan bounds approximately: 122-154°E, 24-46°N
    const minLon = 122, maxLon = 154;
    const minLat = 24, maxLat = 46;

    const padding = 20;
    const mapWidth = width - padding * 2;
    const mapHeight = height - padding * 2;

    return function(coord) {
      const [lon, lat] = coord;
      const x = padding + ((lon - minLon) / (maxLon - minLon)) * mapWidth;
      // Flip Y axis and apply simple lat scaling
      const latRad = lat * Math.PI / 180;
      const mercY = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
      const minLatRad = minLat * Math.PI / 180;
      const maxLatRad = maxLat * Math.PI / 180;
      const minMercY = Math.log(Math.tan(Math.PI / 4 + minLatRad / 2));
      const maxMercY = Math.log(Math.tan(Math.PI / 4 + maxLatRad / 2));
      const y = padding + (1 - (mercY - minMercY) / (maxMercY - minMercY)) * mapHeight;
      return [x, y];
    };
  }

  // Prefecture name to ID mapping
  function nameToPrefId(name) {
    const nameMap = {
      '北海道': 'hokkaido', '青森県': 'aomori', '岩手県': 'iwate', '宮城県': 'miyagi',
      '秋田県': 'akita', '山形県': 'yamagata', '福島県': 'fukushima', '茨城県': 'ibaraki',
      '栃木県': 'tochigi', '群馬県': 'gunma', '埼玉県': 'saitama', '千葉県': 'chiba',
      '東京都': 'tokyo', '神奈川県': 'kanagawa', '新潟県': 'niigata', '富山県': 'toyama',
      '石川県': 'ishikawa', '福井県': 'fukui', '山梨県': 'yamanashi', '長野県': 'nagano',
      '岐阜県': 'gifu', '静岡県': 'shizuoka', '愛知県': 'aichi', '三重県': 'mie',
      '滋賀県': 'shiga', '京都府': 'kyoto', '大阪府': 'osaka', '兵庫県': 'hyogo',
      '奈良県': 'nara', '和歌山県': 'wakayama', '鳥取県': 'tottori', '島根県': 'shimane',
      '岡山県': 'okayama', '広島県': 'hiroshima', '山口県': 'yamaguchi', '徳島県': 'tokushima',
      '香川県': 'kagawa', '愛媛県': 'ehime', '高知県': 'kochi', '福岡県': 'fukuoka',
      '佐賀県': 'saga', '長崎県': 'nagasaki', '熊本県': 'kumamoto', '大分県': 'oita',
      '宮崎県': 'miyazaki', '鹿児島県': 'kagoshima', '沖縄県': 'okinawa'
    };
    return nameMap[name] || null;
  }

  async function initMap() {
    const container = document.getElementById('japan-map-container');
    if (!container) return;

    const width = 700;
    const height = 700;

    svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.setAttribute('class', 'japan-map-svg');
    svg.id = 'japan-map';
    container.appendChild(svg);

    try {
      const response = await fetch(GEOJSON_URL);
      const geojson = await response.json();

      const projection = createProjection(width, height);

      geojson.features.forEach(feature => {
        const name = feature.properties.nam_ja || feature.properties.name;
        const prefId = nameToPrefId(name);
        if (!prefId) return;

        const geometry = feature.geometry;
        let pathData = '';

        if (geometry.type === 'Polygon') {
          pathData = coordsToPath(geometry.coordinates, projection);
        } else if (geometry.type === 'MultiPolygon') {
          geometry.coordinates.forEach(polygon => {
            pathData += coordsToPath(polygon, projection);
          });
        }

        if (pathData) {
          const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          path.setAttribute('d', pathData);
          path.setAttribute('id', `pref-${prefId}`);
          path.setAttribute('class', 'prefecture');
          path.setAttribute('fill', UNCOLORED);
          path.setAttribute('stroke', '#fff');
          path.setAttribute('stroke-width', '0.5');

          const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
          title.textContent = prefectureNames[prefId];
          path.appendChild(title);

          svg.appendChild(path);
          prefecturePaths[prefId] = path;
        }
      });

      // Start animation
      setTimeout(() => solve(true), 500);

    } catch (error) {
      console.error('Failed to load GeoJSON:', error);
      // Fallback message
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', '250');
      text.setAttribute('y', '300');
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('fill', '#999');
      text.textContent = 'Map loading...';
      svg.appendChild(text);
    }
  }

  function solve(autoLoop = false) {
    if (isRunning) return;
    isRunning = true;

    // Reset colors
    Object.keys(prefecturePaths).forEach(id => {
      const path = prefecturePaths[id];
      if (path) {
        path.style.transition = 'fill 0.5s ease';
        path.setAttribute('fill', UNCOLORED);
      }
    });

    setTimeout(() => {
      const order = shuffle(Object.keys(prefecturePaths));

      greedyColoring(order, (prefId, colorIndex) => {
        const path = prefecturePaths[prefId];
        if (path) {
          path.style.transition = 'fill 0.3s ease';
          path.setAttribute('fill', COLORS[colorIndex]);
        }
      }, () => {
        isRunning = false;
        if (autoLoop) {
          setTimeout(() => solve(true), 3000);
        }
      });
    }, 600);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMap);
  } else {
    initMap();
  }
})();
