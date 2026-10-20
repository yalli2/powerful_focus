/* Chart.js 설정 헬퍼 (교재의 도표 스타일: 레이더 · 막대 · 파레토 · 도넛 · 4분면) */
(function () {
  const COLORS = {
    me: '#FF6B2C', grp: '#2F3A4A', teal: '#1F8A8A', sand: '#F2B84B',
    soft: '#FFD9C5', grey: '#C3C9D1', red: '#D2504A', green: '#3E9B6A', ink: '#222'
  };
  const PALETTE = [COLORS.me, COLORS.grp, COLORS.teal, COLORS.sand, COLORS.grey, COLORS.red, '#8A6FD0'];

  if (window.Chart) {
    Chart.defaults.font.family = '"Pretendard","Noto Sans KR","Apple SD Gothic Neo","Malgun Gothic",system-ui,sans-serif';
    Chart.defaults.font.size = 12;
    Chart.defaults.color = '#4a5260';
    Chart.defaults.plugins.legend.labels.boxWidth = 12;
    Chart.defaults.plugins.legend.labels.usePointStyle = true;
    Chart.defaults.maintainAspectRatio = false;
  }

  const alpha = (hex, a) => {
    const n = parseInt(hex.slice(1), 16);
    return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`;
  };

  window.CH = {
    COLORS, PALETTE, alpha,

    radar(labels, series, max) {
      return {
        type: 'radar',
        data: {
          labels,
          datasets: series.map(s => ({
            label: s.label, data: s.data,
            borderColor: s.color, backgroundColor: alpha(s.color, 0.18),
            pointBackgroundColor: s.color, borderWidth: 2, pointRadius: 3
          }))
        },
        options: {
          scales: { r: { min: 0, max: max || 10, ticks: { stepSize: (max || 10) / 5, backdropColor: 'transparent' }, grid: { color: '#e6e9ee' }, angleLines: { color: '#e6e9ee' }, pointLabels: { font: { size: 12 } } } },
          plugins: { legend: { position: 'bottom' } }
        }
      };
    },

    bar(labels, series, o) {
      o = o || {};
      return {
        type: 'bar',
        data: {
          labels,
          datasets: series.map(s => ({
            label: s.label, data: s.data,
            backgroundColor: s.colors || s.color, borderRadius: 6, maxBarThickness: 34
          }))
        },
        options: {
          indexAxis: o.horizontal ? 'y' : 'x',
          scales: {
            [o.horizontal ? 'x' : 'y']: { beginAtZero: true, max: o.max, stacked: !!o.stacked, grid: { color: '#eef0f3' }, title: o.title ? { display: true, text: o.title } : undefined },
            [o.horizontal ? 'y' : 'x']: { stacked: !!o.stacked, grid: { display: false } }
          },
          plugins: { legend: { display: series.length > 1 || !!o.legend, position: 'bottom' } }
        }
      };
    },

    doughnut(labels, data, colors) {
      return {
        type: 'doughnut',
        data: { labels, datasets: [{ data, backgroundColor: colors || PALETTE, borderColor: '#fff', borderWidth: 3 }] },
        options: { cutout: '62%', plugins: { legend: { position: 'bottom' } } }
      };
    },

    /* 파레토: 막대(개별 기여도) + 선(누적 %) */
    pareto(labels, shares, cumulative) {
      return {
        data: {
          labels,
          datasets: [
            { type: 'bar', label: '결과 기여도(%)', data: shares, backgroundColor: COLORS.me, borderRadius: 6, yAxisID: 'y', maxBarThickness: 40, order: 2 },
            { type: 'line', label: '누적(%)', data: cumulative, borderColor: COLORS.grp, backgroundColor: COLORS.grp, tension: 0.2, yAxisID: 'y1', pointRadius: 4, order: 1 },
            { type: 'line', label: '80% 기준선', data: labels.map(() => 80), borderColor: COLORS.teal, borderDash: [6, 6], pointRadius: 0, yAxisID: 'y1', order: 0 }
          ]
        },
        options: {
          scales: {
            y: { beginAtZero: true, max: 100, title: { display: true, text: '기여도 %' }, grid: { color: '#eef0f3' } },
            y1: { beginAtZero: true, max: 100, position: 'right', grid: { display: false }, title: { display: true, text: '누적 %' } },
            x: { grid: { display: false } }
          },
          plugins: { legend: { position: 'bottom' } }
        }
      };
    },

    /* 4분면 산점도 (x: 투입 시간, y: 영향력) */
    quadrant(points, xmax, ymax, xl, yl) {
      const midX = xmax / 2, midY = ymax / 2;
      const groups = {};
      points.forEach(p => { (groups[p.kind] = groups[p.kind] || []).push(p); });
      const kindColor = { hard: COLORS.me, feel: COLORS.sand, other: COLORS.grey };
      const kindLabel = { hard: '핵심 어려운 일', feel: '느낌만 좋은 활동', other: '기타' };
      return {
        type: 'scatter',
        data: {
          datasets: Object.keys(groups).map(k => ({
            label: kindLabel[k] || k,
            data: groups[k].map(p => ({ x: p.x, y: p.y, name: p.name })),
            backgroundColor: kindColor[k] || COLORS.grey, pointRadius: 8, pointHoverRadius: 10
          }))
        },
        options: {
          scales: {
            x: { min: 0, max: xmax, title: { display: true, text: xl }, grid: { color: ctx => ctx.tick.value === midX ? '#8a93a0' : '#eef0f3' } },
            y: { min: 0, max: ymax, title: { display: true, text: yl }, grid: { color: ctx => ctx.tick.value === midY ? '#8a93a0' : '#eef0f3' } }
          },
          plugins: {
            legend: { position: 'bottom' },
            tooltip: { callbacks: { label: c => `${c.raw.name || ''} (${c.raw.x}h, 영향력 ${c.raw.y})` } }
          }
        }
      };
    }
  };
})();
