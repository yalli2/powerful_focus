/* 7일 커리큘럼 정의: 실습 필드 · 실시간 차트 · 공유 월(wall) · 데모용 샘플 */
(function () {
  const C = () => window.CH;
  const num = v => { const n = parseFloat(v); return isFinite(n) ? n : null; };
  const txt = v => (typeof v === 'string' ? v.trim() : '');
  const avg = a => { a = a.filter(x => x !== null && x !== undefined && isFinite(x)); return a.length ? a.reduce((s, x) => s + x, 0) / a.length : null; };
  const r1 = x => x === null ? 0 : Math.round(x * 10) / 10;
  const rowsOf = (d, id) => ((d && d[id]) || []).filter(r => r && Object.values(r).some(v => String(v).trim() !== ''));
  const count = (list, keys) => keys.map(k => list.filter(x => x === k).length);
  const meColors = (all, base) => all.map(p => p.isMe ? C().COLORS.me : (base || C().COLORS.grey));

  /* ---------- 공통 선택지 ---------- */
  const OPT_TYPE = [{ v: 'hard', l: '핵심 어려운 일' }, { v: 'feel', l: '느낌만 좋은 활동' }, { v: 'other', l: '기타' }];
  const OPT_DEC = [{ v: 'keep', l: '유지' }, { v: 'reduce', l: '줄이기' }, { v: 'stop', l: '중단' }];
  const OPT_LD = [{ v: 'learn', l: '배우기(입력)' }, { v: 'do', l: '실행(출력)' }];
  const OPT_YPN = [{ v: 'yes', l: '그렇다' }, { v: 'part', l: '부분적으로' }, { v: 'no', l: '아니다' }];
  const YPN_SCORE = { yes: 2, part: 1, no: 0 };
  const DISTRACT = [
    { v: 'phone', l: '스마트폰·SNS' }, { v: 'video', l: '유튜브·영상' }, { v: 'mail', l: '이메일·메신저' },
    { v: 'people', l: '동료·가족의 방해' }, { v: 'noise', l: '소음·어수선한 공간' }, { v: 'mind', l: '잡념·미루는 생각' }
  ];

  /* ---------- 영역(Day 2) ---------- */
  const AREAS = [
    { k: 'career', l: '커리어' }, { k: 'money', l: '재정' }, { k: 'rel', l: '관계' }, { k: 'health', l: '건강' }, { k: 'self', l: '자기 성장' }
  ];

  /* ---------- 15개 질문 (Day 1) ---------- */
  const Q = [
    ['A', '진짜로 원하는 것은 무엇인가요?', '엉뚱한 꿈까지 전부 적은 뒤, 그중 가장 원하는 2~3가지를 골라 보세요.'],
    ['A', '내일 아침 가족·친구·동료의 영향이 전혀 없는 곳에서 눈을 뜬다면, 무엇을 다르게 하겠습니까?', '남의 시선 없이 고를 수 있다면 달라질 선택은?'],
    ['A', '스스로에게 완전히 솔직하다면, 지금 무엇을 시작하고 무엇을 멈추겠습니까?', '지금 하는 일을 5~10년 이어 가면 원하는 곳에 닿을까요?'],
    ['A', '무엇을 해도 성공이 보장된다면, 3년 뒤 어디에 있고 싶나요?', '정신·신체·영적·재정 영역 모두 포함해서 적어 보세요.'],
    ['A', '하루를 내 뜻대로 보낸다면 아침부터 밤까지 어떤 하루인가요?', '기상 시간, 식사, 활동, 함께하는 사람, 사는 곳까지 구체적으로.'],
    ['A', '평생 한 가지에만 집중해야 한다면 무엇을 고르겠습니까?', '딱 하나만, 가장 중요한 것으로.'],
    ['A', '오래 붙들면 무엇이든 이룰 수 있다고 믿는다면, 향후 3~5년간 무엇을 추구하겠습니까?', '지금 가장 설레는 목표는 무엇인가요?'],
    ['B', '일하면서 가장 행복한 순간, 나는 무엇을 하고 있나요?', '이번 주에 그런 순간을 관찰해 보세요.'],
    ['B', '나는 쉬운데 남들은 왜 어려워하는지 궁금했던 일은 무엇인가요?', '너무 쉬워서 강점이라고 생각하지 못한 것일 수 있어요.'],
    ['B', '주변 사람들은 내가 무엇을 잘한다고 말하나요?', '가족·친구·동료에게 직접 물어보면 가장 정확합니다.'],
    ['C', '어릴 때 무엇을 즐겨 했나요?', '어린 시절의 몰입은 지금의 열정을 알려 줍니다.'],
    ['C', '누구를 부러워하나요? 그 이유는 무엇인가요?', '부러움은 내가 원하는 것의 힌트입니다.'],
    ['C', '시간과 돈이 무한하다면 무엇을 하겠습니까?', '쉬는 것 외에, 결국 무엇에 시간을 쓰게 될까요?'],
    ['C', '완전한 자신감을 가진 최고의 나라면 무엇을 하고 있을까요?', '두려움이 사라진 나의 모습을 그려 보세요.'],
    ['C', '세상에 나를 어떻게 표현하고 싶나요?', '즐거움·교육·영감·치유·창조 중 어떤 방식으로, 어떤 감정을 전하고 싶나요?']
  ];
  const Q_CAT = { A: [0, 7], B: [7, 10], C: [10, 15] };

  /* ---------- 데모 샘플 생성 ---------- */
  function rng(seed) { let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function sample(day, i) {
    const R = rng(day * 131 + i * 17 + 7);
    const ri = (a, b) => Math.floor(R() * (b - a + 1)) + a;
    const pick = a => a[Math.floor(R() * a.length)];
    const d = {};
    if (day === 1) {
      const s = ['가족과 시간을 더 쓰고 싶다', '내 이름으로 된 작은 사업을 하고 싶다', '글을 쓰며 사람들을 돕고 싶다', '몸과 마음이 건강한 상태를 오래 유지하고 싶다', '배운 것을 가르치는 일을 하고 싶다', '경제적으로 자유로워지고 싶다'];
      Q.forEach((q, k) => { if (R() > 0.2) d['q' + (k + 1)] = '(샘플) ' + pick(s); });
      d.top1 = pick(['가족과의 시간', '건강한 몸', '나만의 사업', '글쓰기', '경제적 자립', '가르치는 일']);
      d.clarityA = ri(3, 9); d.clarityB = ri(3, 9); d.clarityC = ri(2, 9);
    }
    if (day === 2) {
      AREAS.forEach(a => {
        d['goal_' + a.k] = '(샘플) ' + pick(['꾸준히 성장하기', '안정적인 기반 만들기', '진짜 하고 싶은 일 시작하기', '주변을 돕는 일 하기']);
        d['love_' + a.k] = ri(20, 95);
        d['own_' + a.k] = pick(['mine', 'mine', 'mixed', 'others']);
      });
      d.secret = '(샘플) ' + pick(['누구에게도 알리지 않아도 매일 글을 쓰는 사람이 되는 것', '조용히 내 일에 몰입하는 하루를 만드는 것', '가족과 저녁을 함께 먹는 삶']);
      d.proud = '(샘플) ' + pick(['스스로 정한 기준을 지켜 낸 나', '끝까지 해낸 한 가지']);
    }
    if (day === 3) {
      d.goal = '(샘플) ' + pick(['6개월 안에 첫 결과물 완성', '새 프로젝트 런칭', '핵심 역량 자격 취득']);
      d.current = ri(2, 7);
      d.keep = pick(['yes', 'part', 'part', 'no']);
      d.c1 = pick(['yes', 'part', 'no']); d.c2 = pick(['yes', 'part', 'no']); d.c3 = pick(['yes', 'part', 'part', 'no']);
      d.change = '(샘플) 가장 어려운 일을 오전 첫 시간에 하기';
      d.who = '(샘플) 같은 길을 먼저 간 선배';
      d.resource = '(샘플) 관련 책 한 권과 온라인 강의';
      d.vital1 = '(샘플) 매일 90분 핵심 업무'; d.vital2 = '(샘플) 주 1회 피드백'; d.vital3 = '(샘플) 월 1회 점검';
    }
    if (day === 4) {
      const names = ['핵심 프로젝트', '이메일 확인', '회의', 'SNS 관리', '자료 정리', '고객 상담', '로고 다듬기'];
      d.acts = [];
      const n = ri(4, 6);
      for (let k = 0; k < n; k++) {
        const nm = names[(k + i) % names.length];
        const hard = ['핵심 프로젝트', '고객 상담'].includes(nm);
        d.acts.push({ name: nm, hours: ri(2, 12), impact: hard ? ri(7, 10) : ri(1, 5), kind: hard ? 'hard' : (['SNS 관리', '로고 다듬기', '자료 정리'].includes(nm) ? 'feel' : 'other') });
      }
      d.strategy = '(샘플) 한 가지 모델에 집중해 꾸준히 만든다';
      d.t1 = '(샘플) 매일 창작'; d.t2 = '(샘플) 주 1회 공개'; d.t3 = '(샘플) 월 1회 점검';
      d.model = pick(['sales', 'lead', 'brand']);
      d.tree = '(샘플) 가장 효과가 컸던 단 하나의 활동';
      d.interview = '(샘플) 가장 효과가 컸던 단 하나의 활동은 무엇이었나요?';
    }
    if (day === 5) {
      const names = ['정기 모임', '뉴스·SNS 보기', '불필요한 회의', '핵심 업무', '운동', '자료 수집'];
      d.acts = [];
      const n = ri(4, 6);
      for (let k = 0; k < n; k++) {
        const nm = names[(k + i) % names.length];
        const hours = ri(1, 9);
        const dec = nm === '핵심 업무' || nm === '운동' ? 'keep' : pick(['reduce', 'stop', 'stop']);
        d.acts.push({ name: nm, hours, dec, freed: dec === 'stop' ? hours : dec === 'reduce' ? Math.round(hours / 2) : 0 });
      }
      d.blank = '(샘플) 오전 핵심 업무 · 점심 후 산책 · 저녁 정리';
      d.noSituation = '(샘플) 마감 직전에 들어온 추가 요청';
      d.noScript = '(샘플) 고마워요, 이번에는 어렵겠어요.';
      d.top = pick(DISTRACT).v;
      d.int1 = '(샘플) 아침에 폰 보지 않기'; d.int2 = '(샘플) 명상 5분'; d.ext1 = '(샘플) 알림 끄기'; d.ext2 = '(샘플) 헤드폰 착용';
    }
    if (day === 6) {
      const names = ['강의·영상 시청', '책 읽기', '리서치', '실제 작업', '글 쓰기', '고객 대응'];
      d.acts = [];
      const n = ri(4, 6);
      for (let k = 0; k < n; k++) {
        const nm = names[(k + i) % names.length];
        const learn = ['강의·영상 시청', '책 읽기', '리서치'].includes(nm);
        d.acts.push({ name: nm, hours: ri(2, 10), kind: learn ? 'learn' : 'do' });
      }
      for (let k = 1; k <= 5; k++) d['o' + k] = ri(1, 5);
      d.purpose = '(샘플) 지금 필요한 만큼만 배우고 바로 적용하기';
      d.cut = '(샘플) 새 강의 결제 멈추고 배운 것을 실행하기';
      d.pledge = pick(['yes', 'part', 'no']);
    }
    if (day === 7) {
      d.task = '(샘플) 가장 중요한 한 가지 작업';
      d.before = ri(5, 9); d.after = ri(2, 6);
      d.ease1 = '(샘플) 파일을 열어 둔 채로 퇴근'; d.ease2 = '(샘플) 아침에 가장 먼저 시작';
      d.hard1 = '(샘플) 폰은 다른 방에'; d.hard2 = '(샘플) 와이파이 끄기';
      d.ritual = '(샘플) 물 한 잔 → 음악 → 타이머 25분';
      d.t1 = '(샘플) 핵심 작업 90분'; d.t2 = '(샘플) 중요한 연락 1건'; d.t3 = '(샘플) 내일 계획 작성';
      d.done1 = pick(['yes', 'part']); d.done2 = pick(['yes', 'part', 'no']); d.done3 = pick(['yes', 'part']);
      d.declare = '(샘플) 나는 중요한 한 가지에 먼저 집중하는 사람이다.';
    }
    return d;
  }

  /* ---------- 폼 헬퍼 ---------- */
  const ta = (id, label, hint, extra) => Object.assign({ id, type: 'area', label, hint }, extra || {});
  const tx = (id, label, hint, extra) => Object.assign({ id, type: 'text', label, hint }, extra || {});
  const rg = (id, label, o) => Object.assign({ id, type: 'range', label, min: 1, max: 10, lo: '낮음', hi: '높음' }, o || {});
  const ch = (id, label, options, extra) => Object.assign({ id, type: 'choice', label, options }, extra || {});
  const rows = (id, label, cols, o) => Object.assign({ id, type: 'rows', label, cols, min: 4, max: 10 }, o || {});

  /* ---------- 7일 정의 ---------- */
  const list = [];

  /* Day 1 */
  list.push({
    n: 1, icon: '🧭', title: '무엇을 원하는가', en: '15 Questions to Identify What You Want',
    sub: '15가지 질문으로 나의 욕망·강점·열정을 또렷하게 만드는 날',
    concept: [
      '명료함이 곧 힘입니다. 막연한 목표는 막연한 결과를 낳습니다.',
      '15개 질문은 ① 욕망 끌어내기 ② 강점·고유한 능력 찾기 ③ 열정 발견하기 세 갈래입니다.',
      '완벽한 답은 없습니다. 솔직하게 쓰고, 시간이 지나며 다듬으세요.'
    ],
    sections: [
      { title: 'A. 욕망 끌어내기', desc: 'Q1–Q7 · 내가 정말 원하는 것', fields: Q.slice(0, 7).map((q, k) => ta('q' + (k + 1), `${k + 1}. ${q[1]}`, q[2])).concat([
        tx('top1', '내가 가장 원하는 것 한 가지 (키워드로)', '예: 가족과의 시간, 나만의 사업, 건강한 몸', { share: true }),
        rg('clarityA', 'A 영역의 명료함: 지금 내가 원하는 것이 얼마나 또렷한가요?', { lo: '흐릿함', hi: '아주 또렷함' })
      ]) },
      { title: 'B. 강점과 고유한 능력', desc: 'Q8–Q10 · 내가 잘하는 것', fields: Q.slice(7, 10).map((q, k) => ta('q' + (k + 8), `${k + 8}. ${q[1]}`, q[2])).concat([
        rg('clarityB', 'B 영역의 명료함: 내 강점을 얼마나 알고 있나요?', { lo: '잘 모름', hi: '확실히 앎' })
      ]) },
      { title: 'C. 열정 발견하기', desc: 'Q11–Q15 · 나를 움직이는 것', fields: Q.slice(10, 15).map((q, k) => ta('q' + (k + 11), `${k + 11}. ${q[1]}`, q[2])).concat([
        rg('clarityC', 'C 영역의 명료함: 내 열정을 얼마나 알고 있나요?', { lo: '잘 모름', hi: '확실히 앎' })
      ]) }
    ],
    charts: [
      { title: '나의 명료함 레이더', note: '세 영역의 명료함 자가진단 (1~10) · 나 vs 참가자 평균', build: x => C().radar(['A 욕망', 'B 강점', 'C 열정'], [
        { label: '나', data: ['clarityA', 'clarityB', 'clarityC'].map(k => num(x.me[k]) || 0), color: C().COLORS.me },
        { label: '참가자 평균', data: ['clarityA', 'clarityB', 'clarityC'].map(k => r1(x.avg(d => num(d[k])))), color: C().COLORS.grp }
      ], 10), min: 1 },
      { title: '질문 응답 완성도 (%)', note: '영역별로 몇 개의 질문에 답했는지', build: x => {
        const comp = d => Object.keys(Q_CAT).map(c => { const [a, b] = Q_CAT[c]; let n = 0; for (let k = a; k < b; k++) if (txt(d['q' + (k + 1)])) n++; return Math.round(n / (b - a) * 100); });
        const mine = comp(x.me);
        const all = x.all.map(p => comp(p.data));
        const mean = [0, 1, 2].map(j => Math.round(avg(all.map(a => a[j])) || 0));
        return C().bar(['A 욕망', 'B 강점', 'C 열정'], [{ label: '나', data: mine, color: C().COLORS.me }, { label: '참가자 평균', data: mean, color: C().COLORS.grp }], { max: 100 });
      }, min: 1 },
      { title: '우리가 가장 원하는 것', note: 'Q1 키워드 · 함께 쓴 단어의 빈도', build: x => {
        const m = {}; x.all.forEach(p => { const k = txt(p.data.top1); if (k) m[k] = (m[k] || 0) + 1; });
        const e = Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, 8);
        if (!e.length) return null;
        return C().bar(e.map(a => a[0]), [{ label: '명', data: e.map(a => a[1]), color: C().COLORS.teal }], { horizontal: true });
      }, min: 1 }
    ],
    wall: [
      { id: 'q15', title: '세상에 나를 표현하고 싶은 방식' },
      { id: 'q10', title: '주변 사람들이 말하는 나의 강점' },
      { id: 'q6', title: '평생 한 가지만 한다면' }
    ],
    sample: i => sample(1, i)
  });

  /* Day 2 */
  const d2fields = [];
  AREAS.forEach(a => {
    d2fields.push({ type: 'group', label: a.l });
    d2fields.push(tx('goal_' + a.k, `${a.l} 목표`, '지금 품고 있는 목표를 한 줄로'));
    d2fields.push(rg('love_' + a.k, `이 목표의 에너지는 어느 쪽에 가깝나요?`, { min: 0, max: 100, step: 5, lo: '두려움 기반(얻고·증명하려는)', hi: '사랑 기반(주고·표현하려는)' }));
    d2fields.push(ch('own_' + a.k, '이 목표는 누구의 것인가요?', [{ v: 'mine', l: '온전히 내 것' }, { v: 'mixed', l: '반반' }, { v: 'others', l: '남의 기대' }]));
  });
  list.push({
    n: 2, icon: '💗', title: '내 목표는 진짜 내 것인가', en: 'Gaining Clarity Regarding What You Want',
    sub: '지금의 목표를 점검하고 사랑 기반 목표와 두려움 기반 목표를 구분하는 날',
    concept: [
      '많은 사람이 부모·친구·사회가 심어 준 목표를 내 것처럼 좇습니다.',
      '사랑 기반 목표는 “주는 것”, 두려움 기반 목표는 “얻고 증명하는 것”에 초점이 있습니다.',
      '둘은 오가는 것이 자연스럽습니다. 두려움을 알아차리고 사랑 쪽으로 다시 초점을 맞추면 됩니다.'
    ],
    sections: [
      { title: '다섯 영역의 현재 목표 점검', desc: '목표 · 에너지 방향 · 소유감', fields: d2fields },
      { title: '진짜 내가 원하는 것', desc: '남을 기쁘게 할 필요가 없다면?', fields: [
        ta('secret', '아무도 기쁘게 할 필요가 없고 유명해질 필요도 없다면, 어떤 목표를 좇겠습니까?', ''),
        ta('proud', '성과를 아무에게도 알릴 수 없더라도 스스로 자랑스러울 목표는 무엇인가요?', '', { share: true })
      ] }
    ],
    charts: [
      { title: '영역별 사랑 기반 지수', note: '0 = 두려움 기반, 100 = 사랑 기반 · 나 vs 참가자 평균', build: x => C().bar(AREAS.map(a => a.l), [
        { label: '나', data: AREAS.map(a => num(x.me['love_' + a.k]) || 0), color: C().COLORS.me },
        { label: '참가자 평균', data: AREAS.map(a => Math.round(x.avg(d => num(d['love_' + a.k])) || 0)), color: C().COLORS.grp }
      ], { max: 100 }), min: 1 },
      { title: '사랑·두려움 균형', note: '나의 전체 평균 지수', build: x => {
        const v = avg(AREAS.map(a => num(x.me['love_' + a.k])));
        if (v === null) return null;
        return C().doughnut(['사랑 기반', '두려움 기반'], [Math.round(v), 100 - Math.round(v)], [C().COLORS.me, C().COLORS.grey]);
      }, min: 1 },
      { title: '목표의 주인은 누구인가', note: '모든 참가자의 5개 영역 응답 합계', build: x => {
        const all = []; x.all.forEach(p => AREAS.forEach(a => all.push(p.data['own_' + a.k])));
        const c = count(all, ['mine', 'mixed', 'others']);
        if (!c.some(Boolean)) return null;
        return C().doughnut(['온전히 내 것', '반반', '남의 기대'], c, [C().COLORS.me, C().COLORS.sand, C().COLORS.grey]);
      }, min: 1 }
    ],
    wall: [{ id: 'proud', title: '아무에게도 알리지 않아도 자랑스러울 목표' }, { id: 'secret', title: '남의 시선이 없다면 좇을 목표' }],
    sample: i => sample(2, i)
  });

  /* Day 3 */
  list.push({
    n: 3, icon: '🧩', title: '무엇을 해야 하는가', en: 'Gaining Clarity Regarding What Needs to Be Done',
    sub: '현재 위치와 목표 사이의 간극을 보고, 핵심 행동 전략을 세우는 날',
    concept: [
      '목표 달성은 “지금 있는 곳”과 “가려는 곳” 사이의 간극을 좁히는 일입니다.',
      '“오늘·이번 주·이번 달의 행동을 계속하면 목표에 닿는가?”를 정기적으로 물으세요.',
      '핵심 과제는 대개 가장 어려운 일입니다. 그래서 사람들은 가장 먼저 피합니다.'
    ],
    sections: [
      { title: '목표와 현재 위치', fields: [
        tx('goal', '집중하고 싶은 핵심 목표 하나', '', { share: true }),
        rg('current', '목표 달성도: 지금 나는 어디에 있나요? (10 = 도착)', { lo: '출발점', hi: '거의 도착' }),
        ch('keep', '지금 하는 대로 계속하면 이 목표를 이룰 수 있을까요?', OPT_YPN)
      ] },
      { title: '세 가지 점검 질문', fields: [
        ch('c1', '나는 해야 한다고 아는 어려운 과제를 실제로 하고 있나요?', OPT_YPN),
        ch('c2', '그것을 꾸준히 하고 있나요?', OPT_YPN),
        ch('c3', '목표에 이르기 위해 무엇을 해야 하는지 정확히 알고 있나요?', OPT_YPN)
      ] },
      { title: '전략 세우기', fields: [
        ta('change', '목표에 닿으려면 무엇을 바꿔야 하나요?', ''),
        tx('who', '비슷한 목표를 이미 이룬 사람은 누구인가요?', ''),
        tx('resource', '도움이 될 책·강의·멘토는 무엇인가요?', ''),
        tx('vital1', '핵심에 집중할 “소수의 것” ①', '', { share: true }),
        tx('vital2', '핵심에 집중할 “소수의 것” ②', '', { share: true }),
        tx('vital3', '핵심에 집중할 “소수의 것” ③', '', { share: true })
      ] }
    ],
    charts: [
      { title: '세 가지 점검 결과', note: '그렇다 2점 · 부분적으로 1점 · 아니다 0점 · 나 vs 참가자 평균', build: x => {
        const ks = ['c1', 'c2', 'c3'];
        return C().bar(['어려운 과제를 하는가', '꾸준한가', '방법을 아는가'], [
          { label: '나', data: ks.map(k => YPN_SCORE[x.me[k]] ?? 0), color: C().COLORS.me },
          { label: '참가자 평균', data: ks.map(k => r1(x.avg(d => YPN_SCORE[d[k]] ?? null))), color: C().COLORS.grp }
        ], { max: 2 });
      }, min: 1 },
      { title: '지금처럼 하면 이룰 수 있을까?', note: '참가자 전체 응답 분포', build: x => {
        const c = count(x.all.map(p => p.data.keep), ['yes', 'part', 'no']);
        if (!c.some(Boolean)) return null;
        return C().doughnut(['그렇다', '부분적으로', '아니다'], c, [C().COLORS.teal, C().COLORS.sand, C().COLORS.red]);
      }, min: 1 },
      { title: '목표 달성도 분포', note: '현재 위치(1~10)에 몇 명이 있는가 · 내 위치는 주황색', build: x => {
        const mine = num(x.me.current);
        const lab = [...Array(10)].map((_, i) => String(i + 1));
        const cnt = lab.map((_, i) => x.all.filter(p => num(p.data.current) === i + 1).length);
        return C().bar(lab, [{ label: '명', data: cnt, colors: lab.map((_, i) => mine === i + 1 ? C().COLORS.me : C().COLORS.grey) }], { title: '달성도' });
      }, min: 1 }
    ],
    wall: [{ id: 'vital1', title: '핵심 집중 ①' }, { id: 'vital2', title: '핵심 집중 ②' }, { id: 'vital3', title: '핵심 집중 ③' }],
    sample: i => sample(3, i)
  });

  /* Day 4 */
  list.push({
    n: 4, icon: '🎯', title: '어떻게 해야 하는가', en: 'Gaining Clarity Regarding How It Needs to Be Done',
    sub: '80/20 법칙 · 전략과 전술 · 하나의 모델 · 느낌만 좋은 활동을 걷어내는 날',
    concept: [
      '20%의 행동이 80%의 결과를 만듭니다. 핵심은 영향력 큰 일을 가려내는 것입니다.',
      '전략은 하나의 목표를 위한 전술들의 조합입니다. 전술만 줍는 것은 산탄총식 시도입니다.',
      '“열심히 일하기”와 “어려운 핵심 일 하기”는 다릅니다. 로고만 만지작거리는 것이 대표적인 느낌만 좋은 활동입니다.',
      '이미 해낸 사람의 지도를 빌리면 학습 곡선이 짧아집니다.'
    ],
    sections: [
      { title: '① 80/20 — 나의 주간 활동 목록', desc: '활동별 주당 시간, 목표에 미치는 영향력(1~10), 성격을 적어 주세요 (최소 3개).', fields: [
        rows('acts', '주간 활동', [
          { id: 'name', label: '활동', type: 'text', ph: '예: 고객 상담' },
          { id: 'hours', label: '시간/주', type: 'number', ph: '5' },
          { id: 'impact', label: '영향력(1~10)', type: 'number', ph: '8' },
          { id: 'kind', label: '성격', type: 'select', options: OPT_TYPE }
        ], { min: 5, max: 12 })
      ] },
      { title: '② 전략 vs 전술', fields: [
        tx('strategy', '내 목표를 위한 전략(한 문장)', ''),
        tx('t1', '전략에 맞는 핵심 전술 ①', ''), tx('t2', '핵심 전술 ②', ''), tx('t3', '핵심 전술 ③', '')
      ] },
      { title: '③ 하나의 모델 · 한 그루의 나무', fields: [
        ch('model', '지금은 어떤 모델 하나에 집중하겠습니까?', [{ v: 'sales', l: '직접 매출' }, { v: 'lead', l: '서비스·강의 유입' }, { v: 'brand', l: '신뢰·브랜드' }, { v: 'speak', l: '강연·기회 확보' }]),
        ta('tree', '내가 스무 번 두드릴 “한 그루의 나무”는 무엇인가요?', '여러 나무를 스무 번씩 두드리지 말고 한 그루에 스무 번.', { share: true })
      ] },
      { title: '④ 학습 곡선 줄이기', fields: [
        ta('interview', '이미 목표를 이룬 사람에게 물어볼 질문 한 가지를 적어 보세요', '예: 가장 효과가 컸던 단 하나의 활동은 무엇이었나요?', { share: true })
      ] }
    ],
    charts: [
      { title: '파레토 차트 — 결과는 어디서 나오는가', note: '영향력이 큰 활동 순으로 정렬 · 누적선이 80%에 닿는 지점까지가 핵심', build: x => {
        const rs = rowsOf(x.me, 'acts').map(r => ({ n: txt(r.name) || '(이름 없음)', v: num(r.impact) || 0 })).sort((a, b) => b.v - a.v);
        const tot = rs.reduce((s, r) => s + r.v, 0);
        if (!tot) return null;
        let c = 0;
        return C().pareto(rs.map(r => r.n), rs.map(r => Math.round(r.v / tot * 100)), rs.map(r => { c += r.v; return Math.round(c / tot * 100); }));
      }, min: 1, tall: true },
      { title: '활동 4분면', note: '오른쪽 아래(시간은 많은데 영향력이 낮음)가 줄일 후보', build: x => {
        const pts = rowsOf(x.me, 'acts').map(r => ({ name: txt(r.name), x: num(r.hours) || 0, y: num(r.impact) || 0, kind: r.kind || 'other' }));
        if (!pts.length) return null;
        const xm = Math.max(12, ...pts.map(p => p.x)) + 2;
        return C().quadrant(pts, xm, 10, '투입 시간 (시간/주)', '영향력 (1~10)');
      }, min: 1 },
      { title: '내 시간의 성격', note: '핵심 어려운 일 vs 느낌만 좋은 활동 (시간 기준)', build: x => {
        const h = { hard: 0, feel: 0, other: 0 };
        rowsOf(x.me, 'acts').forEach(r => { h[r.kind || 'other'] += num(r.hours) || 0; });
        if (!h.hard && !h.feel && !h.other) return null;
        return C().doughnut(['핵심 어려운 일', '느낌만 좋은 활동', '기타'], [h.hard, h.feel, h.other], [C().COLORS.me, C().COLORS.sand, C().COLORS.grey]);
      }, min: 1 },
      { title: '핵심 어려운 일에 쓰는 시간 비율', note: '참가자별 (%) · 내 막대는 주황색', build: x => {
        const rows = x.all.map(p => { let t = 0, h = 0; rowsOf(p.data, 'acts').forEach(r => { const v = num(r.hours) || 0; t += v; if (r.kind === 'hard') h += v; }); return { p, pct: t ? Math.round(h / t * 100) : null }; }).filter(r => r.pct !== null);
        if (!rows.length) return null;
        return C().bar(rows.map(r => r.p.name), [{ label: '%', data: rows.map(r => r.pct), colors: meColors(rows.map(r => r.p)) }], { horizontal: true, max: 100 });
      }, min: 1 }
    ],
    wall: [{ id: 'tree', title: '내가 두드릴 한 그루의 나무' }, { id: 'interview', title: '선배에게 던질 질문' }],
    sample: i => sample(4, i)
  });

  /* Day 5 */
  list.push({
    n: 5, icon: '✂️', title: '단순화하기', en: 'Simplifying',
    sub: '가차 없이 덜어내고, 거절하고, 방해를 줄이는 날',
    concept: [
      '제로베이스 사고: “지금 알고 있는 것을 안다면, 이 활동을 오늘 다시 시작하겠는가?”',
      '백지 기법: 일정을 비워 놓고 꼭 필요한 것만 다시 채웁니다. 최소 실행 가능 일정을 만드세요.',
      '거절은 자기 존중입니다. “아니오”를 기본값으로 두고, 변명 없이 정중하게 말하세요.',
      '방해는 내부(잡념)와 외부(알림·소음·방문)로 나뉩니다. 아침 루틴과 환경 설계로 줄입니다.'
    ],
    sections: [
      { title: 'A. 제로베이스 사고', desc: '“알고 있는 지금, 다시 시작하겠는가?”에 답하고 유지/줄이기/중단을 정하세요.', fields: [
        rows('acts', '이번 주 나의 활동', [
          { id: 'name', label: '활동', type: 'text', ph: '예: 정기 모임' },
          { id: 'hours', label: '시간/주', type: 'number', ph: '4' },
          { id: 'dec', label: '결정', type: 'select', options: OPT_DEC },
          { id: 'freed', label: '확보할 시간', type: 'number', ph: '2' }
        ], { min: 5, max: 12 })
      ] },
      { title: 'B. 백지 기법', fields: [
        ta('blank', '일정이 완전히 비어 있다면, 꼭 넣을 것만 적어 보세요 (나의 최소 일정)', '')
      ] },
      { title: 'C. 거절 연습', fields: [
        tx('noSituation', '다음에 거절하고 싶은 상황', ''),
        ta('noScript', '변명 없이 정중하게 거절하는 나의 한 문장', '예: 초대해 줘서 고마워요. 이번에는 어렵겠어요.', { share: true })
      ] },
      { title: 'D. 방해 줄이기', fields: [
        ch('top', '나를 가장 크게 흔드는 방해 요인은?', DISTRACT),
        tx('int1', '내부 방해를 줄일 행동 ①', ''), tx('int2', '내부 방해를 줄일 행동 ②', ''),
        tx('ext1', '외부 방해를 줄일 행동 ①', '', { share: true }), tx('ext2', '외부 방해를 줄일 행동 ②', '', { share: true })
      ] }
    ],
    charts: [
      { title: '나의 결정 비율', note: '활동 개수 기준', build: x => {
        const c = count(rowsOf(x.me, 'acts').map(r => r.dec || 'keep'), ['keep', 'reduce', 'stop']);
        if (!c.some(Boolean)) return null;
        return C().doughnut(['유지', '줄이기', '중단'], c, [C().COLORS.teal, C().COLORS.sand, C().COLORS.red]);
      }, min: 1 },
      { title: '주당 확보한 시간', note: '참가자별 · 내 막대는 주황색', build: x => {
        const rows = x.all.map(p => ({ p, v: rowsOf(p.data, 'acts').reduce((s, r) => s + (num(r.freed) || 0), 0) })).filter(r => r.v > 0);
        if (!rows.length) return null;
        return C().bar(rows.map(r => r.p.name), [{ label: '시간/주', data: rows.map(r => r.v), colors: meColors(rows.map(r => r.p)) }], { horizontal: true });
      }, min: 1 },
      { title: '우리를 가장 흔드는 방해 요인', note: '참가자 전체 분포', build: x => {
        const c = count(x.all.map(p => p.data.top), DISTRACT.map(d => d.v));
        if (!c.some(Boolean)) return null;
        return C().bar(DISTRACT.map(d => d.l), [{ label: '명', data: c, color: C().COLORS.teal }], { horizontal: true });
      }, min: 1 }
    ],
    wall: [{ id: 'noScript', title: '나의 거절 한 문장' }, { id: 'ext1', title: '외부 방해 줄이기 ①' }, { id: 'ext2', title: '외부 방해 줄이기 ②' }],
    sample: i => sample(5, i)
  });

  /* Day 6 */
  const OVERLOAD = ['자료를 더 찾아야 마음이 놓인다', '배울수록 내가 부족하다고 느낀다', '상반된 정보 때문에 결정이 어렵다', '디테일에 빠져 큰 그림을 놓친다', '시작을 미루고 공부만 더 한다'];
  list.push({
    n: 6, icon: '🧹', title: '쓸모없는 입력 줄이기', en: 'Reducing Useless Input',
    sub: '정보 과부하와 분석 마비를 끊고 학습 대 실행 비율을 뒤집는 날',
    concept: [
      '너무 많이 배우면 큰 그림을 잃고 자신감이 떨어지며 결정이 어려워집니다.',
      '배우는 이유를 먼저 정하세요: 무엇을, 왜, 어느 정도까지.',
      '배우는 느낌은 “유능하다는 착각”을 줍니다. 실행해야 지식이 지혜가 됩니다.',
      '학습 대 실행 비율을 뒤집으세요. 필요하면 30일간 새 학습을 멈추고 실행하세요.'
    ],
    sections: [
      { title: '① 학습 vs 실행 — 나의 주간 활동', fields: [
        rows('acts', '주간 활동', [
          { id: 'name', label: '활동', type: 'text', ph: '예: 강의 시청' },
          { id: 'hours', label: '시간/주', type: 'number', ph: '3' },
          { id: 'kind', label: '구분', type: 'select', options: OPT_LD }
        ], { min: 5, max: 12 })
      ] },
      { title: '② 정보 과부하 자가진단', desc: '1 = 전혀 아니다 · 5 = 매우 그렇다', fields: OVERLOAD.map((t, k) => rg('o' + (k + 1), t, { min: 1, max: 5, lo: '전혀 아니다', hi: '매우 그렇다' })) },
      { title: '③ 입력을 줄이는 계획', fields: [
        tx('purpose', '지금 배우는 것의 목적(무엇을·왜·어느 정도까지)', ''),
        ta('cut', '입력을 줄이고 출력을 늘리기 위해 하거나 멈출 한 가지', '', { share: true }),
        ch('pledge', '30일간 새로운 학습을 멈추고 이미 배운 것을 실행해 볼까요?', [{ v: 'yes', l: '해 보겠다' }, { v: 'part', l: '일부만' }, { v: 'no', l: '아직은 아니다' }])
      ] }
    ],
    charts: [
      { title: '학습 vs 실행 시간', note: '나의 주간 시간 비율', build: x => {
        let l = 0, d = 0;
        rowsOf(x.me, 'acts').forEach(r => { const h = num(r.hours) || 0; if (r.kind === 'learn') l += h; else d += h; });
        if (!l && !d) return null;
        return C().doughnut(['배우기(입력)', '실행(출력)'], [l, d], [C().COLORS.sand, C().COLORS.me]);
      }, min: 1 },
      { title: '실행(출력) 비율 (%)', note: '참가자별 · 내 막대는 주황색', build: x => {
        const rows = x.all.map(p => { let l = 0, d = 0; rowsOf(p.data, 'acts').forEach(r => { const h = num(r.hours) || 0; if (r.kind === 'learn') l += h; else d += h; }); return { p, pct: (l + d) ? Math.round(d / (l + d) * 100) : null }; }).filter(r => r.pct !== null);
        if (!rows.length) return null;
        return C().bar(rows.map(r => r.p.name), [{ label: '%', data: rows.map(r => r.pct), colors: meColors(rows.map(r => r.p)) }], { horizontal: true, max: 100 });
      }, min: 1 },
      { title: '정보 과부하 레이더', note: '높을수록 과부하 신호 · 나 vs 참가자 평균', build: x => C().radar(['더 찾아야 안심', '부족하다는 느낌', '결정이 어려움', '큰 그림 놓침', '시작 미루기'], [
        { label: '나', data: OVERLOAD.map((_, k) => num(x.me['o' + (k + 1)]) || 0), color: C().COLORS.me },
        { label: '참가자 평균', data: OVERLOAD.map((_, k) => r1(x.avg(d => num(d['o' + (k + 1)])))), color: C().COLORS.grp }
      ], 5), min: 1 }
    ],
    wall: [{ id: 'cut', title: '입력을 줄이고 출력을 늘리는 한 가지' }, { id: 'purpose', title: '지금 배우는 것의 목적' }],
    sample: i => sample(6, i)
  });

  /* Day 7 */
  list.push({
    n: 7, icon: '🚀', title: '마찰과 에너지 낭비 없애기', en: 'Eliminating Friction and Energy Waste',
    sub: '중요한 일은 쉽게, 방해되는 일은 어렵게 만들고 오늘의 3가지를 정하는 날',
    concept: [
      '마찰 제거: 중요한 일은 시작하기 쉽게, 방해되는 일은 시작하기 어렵게 만드세요.',
      '에너지 낭비 제거: 과제 전환 비용을 줄이려면 전날·아침에 핵심 과제를 종이에 적어 두세요.',
      '의식(루틴)이 마음을 작업 모드로 바꿔 줍니다. 오늘 할 일 3가지를 손으로 적고 하나씩 진행하세요.'
    ],
    sections: [
      { title: '① 마찰 점검', fields: [
        tx('task', '오늘·내일 집중할 핵심 과제 하나', '', { share: true }),
        rg('before', '지금 이 과제를 시작하는 데 필요한 의지력(마찰)은?', { lo: '아주 쉽다', hi: '아주 어렵다' }),
        rg('after', '마찰을 줄인 뒤 예상되는 의지력은?', { lo: '아주 쉽다', hi: '아주 어렵다' })
      ] },
      { title: '② 마찰 설계', fields: [
        tx('ease1', '시작을 쉽게 만들 방법 ①', '', { share: true }), tx('ease2', '시작을 쉽게 만들 방법 ②', ''),
        tx('hard1', '방해 요인을 어렵게 만들 방법 ①', '', { share: true }), tx('hard2', '방해 요인을 어렵게 만들 방법 ②', ''),
        tx('ritual', '나만의 시작 루틴 (간단한 순서)', '예: 물 한 잔 → 음악 → 타이머 25분', { share: true })
      ] },
      { title: '③ 오늘의 3가지', desc: '종이에 직접 적은 뒤 여기에도 기록하세요. 하루가 끝나면 완료 여부를 체크합니다.', fields: [
        tx('t1', '오늘의 과제 1', ''), ch('done1', '진행 결과', [{ v: 'yes', l: '완료' }, { v: 'part', l: '일부' }, { v: 'no', l: '못 함' }]),
        tx('t2', '오늘의 과제 2', ''), ch('done2', '진행 결과', [{ v: 'yes', l: '완료' }, { v: 'part', l: '일부' }, { v: 'no', l: '못 함' }]),
        tx('t3', '오늘의 과제 3', ''), ch('done3', '진행 결과', [{ v: 'yes', l: '완료' }, { v: 'part', l: '일부' }, { v: 'no', l: '못 함' }])
      ] },
      { title: '④ 나의 집중 선언', fields: [
        ta('declare', '7일을 마치며, 나의 집중 선언문 한 문장', '', { share: true })
      ] }
    ],
    charts: [
      { title: '마찰 전·후', note: '시작에 필요한 의지력 (낮을수록 좋음) · 나 vs 참가자 평균', build: x => C().bar(['현재', '마찰 제거 후'], [
        { label: '나', data: [num(x.me.before) || 0, num(x.me.after) || 0], color: C().COLORS.me },
        { label: '참가자 평균', data: [r1(x.avg(d => num(d.before))), r1(x.avg(d => num(d.after)))], color: C().COLORS.grp }
      ], { max: 10 }), min: 1 },
      { title: '오늘의 3가지 진행 결과', note: '참가자 전체 (과제 3개 합산)', build: x => {
        const all = []; x.all.forEach(p => ['done1', 'done2', 'done3'].forEach(k => { if (txt(p.data[k.replace('done', 't')])) all.push(p.data[k]); }));
        const c = count(all, ['yes', 'part', 'no']);
        if (!c.some(Boolean)) return null;
        return C().doughnut(['완료', '일부', '못 함'], c, [C().COLORS.teal, C().COLORS.sand, C().COLORS.grey]);
      }, min: 1 }
    ],
    wall: [{ id: 'declare', title: '집중 선언문' }, { id: 'ritual', title: '나의 시작 루틴' }, { id: 'hard1', title: '방해를 어렵게 만드는 방법' }, { id: 'ease1', title: '시작을 쉽게 만드는 방법' }],
    sample: i => sample(7, i)
  });

  /* ---------- 진행도 · 지표 ---------- */
  function completion(day, data) {
    if (!data) return 0;
    const def = list[day - 1];
    let total = 0, done = 0;
    def.sections.forEach(s => s.fields.forEach(f => {
      if (f.type === 'group') return;
      total++;
      const v = data[f.id];
      if (f.type === 'rows') { if (rowsOf(data, f.id).length >= 3) done++; else if (rowsOf(data, f.id).length) done += 0.5; }
      else if (v !== undefined && v !== null && String(v).trim() !== '') done++;
    }));
    return total ? done / total : 0;
  }

  const METRICS = [
    { key: 'clarity', label: '명료함', tip: 'Day 1 · 욕망·강점·열정의 또렷함' },
    { key: 'love', label: '사랑 기반', tip: 'Day 2 · 목표 에너지가 사랑 쪽에 가까운 정도' },
    { key: 'strategy', label: '전략 정렬', tip: 'Day 3 · 어려운 과제 수행·꾸준함·방법 인지' },
    { key: 'hard', label: '핵심 집중', tip: 'Day 4 · 핵심 어려운 일에 쓰는 시간 비율' },
    { key: 'simple', label: '단순화', tip: 'Day 5 · 비워낸 시간 비율' },
    { key: 'action', label: '실행 비율', tip: 'Day 6 · 입력 대비 출력 시간 비율' },
    { key: 'flow', label: '마찰 제거', tip: 'Day 7 · 마찰 제거 후 예상되는 시작 용이성' }
  ];
  function metrics(dd) {
    const out = {};
    const d1 = dd[1], d2 = dd[2], d3 = dd[3], d4 = dd[4], d5 = dd[5], d6 = dd[6], d7 = dd[7];
    if (d1) { const v = avg(['clarityA', 'clarityB', 'clarityC'].map(k => num(d1[k]))); out.clarity = v === null ? null : v * 10; }
    if (d2) { const v = avg(AREAS.map(a => num(d2['love_' + a.k]))); out.love = v; }
    if (d3) { const v = avg(['c1', 'c2', 'c3'].map(k => YPN_SCORE[d3[k]] ?? null)); out.strategy = v === null ? null : v / 2 * 100; }
    if (d4) { let t = 0, h = 0; rowsOf(d4, 'acts').forEach(r => { const v = num(r.hours) || 0; t += v; if (r.kind === 'hard') h += v; }); out.hard = t ? h / t * 100 : null; }
    if (d5) { let t = 0, f = 0; rowsOf(d5, 'acts').forEach(r => { t += num(r.hours) || 0; f += num(r.freed) || 0; }); out.simple = t ? Math.min(100, f / t * 100) : null; }
    if (d6) { let l = 0, d = 0; rowsOf(d6, 'acts').forEach(r => { const h = num(r.hours) || 0; if (r.kind === 'learn') l += h; else d += h; }); out.action = (l + d) ? d / (l + d) * 100 : null; }
    if (d7) { const a = num(d7.after); out.flow = a === null ? null : (10 - a) * 10; }
    METRICS.forEach(m => { if (out[m.key] === undefined) out[m.key] = null; });
    return out;
  }

  window.Days = { list, sample, completion, metrics, METRICS, rowsOf, num, txt, avg, AREAS };
})();
