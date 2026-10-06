/* ==========================================================
   KommunikationsTrainer · propuesta · interacciones
   ========================================================== */
(() => {
  /* ---------- Textos por idioma (la página define <html lang>) ---------- */
  const EN = document.documentElement.lang === 'en';
  const T = EN ? {
    menuOpen: 'Open menu', menuClose: 'Close menu', you: 'You', typing: 'Answering in a moment …',
    script: [
      ['ai', 'Hello, I am Anna Richter. I am looking forward to our annual review and curious how my performance this year will be assessed.'],
      ['me', 'Hello Anna, I am glad we are talking today too. Would you like to start by telling me how you experienced the year?'],
      ['ai', 'Sure. For me the year was intense, but also very productive. Project Delta was especially important to me, and from my point of view it went very well.'],
    ],
    generic: (sc) => [['ai', 'Hello, I am Anna Richter. Nice that we are taking the time today. What is our conversation about?'], ['me', `It is about "${sc}".`], ['ai', 'All right, then let us begin. I am curious.']],
  } : {
    menuOpen: 'Menü öffnen', menuClose: 'Menü schließen', you: 'Du', typing: 'Wird gleich antworten …',
    script: null,
    generic: (sc) => [['ai', 'Hallo, ich bin Anna Richter. Schön, dass wir uns heute Zeit nehmen. Worum geht es in unserem Gespräch?'], ['me', `Es geht um das Thema „${sc}“.`], ['ai', 'Alles klar, dann lass uns beginnen. Ich bin gespannt.']],
  };

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const small = () => window.matchMedia('(max-width: 900px)').matches;

  /* ---------- Navbar con cristal al hacer scroll ---------- */
  const nav = document.querySelector('[data-nav]');
  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 20);
  onScroll(); window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Menú móvil ---------- */
  const toggle = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-menu]');
  const setMenu = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? T.menuClose : T.menuOpen);
    menu.hidden = !open;
    document.body.classList.toggle('menu-open', open);
    nav.classList.toggle('is-scrolled', open || window.scrollY > 20);
  };
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
  window.addEventListener('resize', () => { if (window.innerWidth > 960) setMenu(false); });

  /* ---------- Reveals + contadores + informe ---------- */
  const countUp = (el) => {
    const to = Number(el.dataset.count); if (reduce) return;
    const t0 = performance.now(), dur = 1400;
    const tick = (now) => {
      const t = Math.min((now - t0) / dur, 1);
      el.textContent = Math.round(to * (1 - Math.pow(1 - t, 4)));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add('is-in');
    e.target.querySelectorAll('[data-count]').forEach(countUp);
    io.unobserve(e.target);
  }), { threshold: .15, rootMargin: '0px 0px -6% 0px' });
  document.querySelectorAll('.reveal, .report').forEach((el) => io.observe(el));

  /* ---------- Hero: logo animado (resolución según pantalla) ---------- */
  const hero = document.querySelector('.hero__video');
  if (hero) {
    if (reduce || (navigator.connection || {}).saveData) { hero.removeAttribute('autoplay'); }
    else {
      hero.muted = true;
      hero.src = small() ? hero.dataset.srcSm : hero.dataset.srcLg;
      hero.play().catch(() => {});
      new IntersectionObserver(([e]) => (e.isIntersecting ? hero.play().catch(() => {}) : hero.pause())).observe(hero);
    }
  }

  /* ---------- Vídeos de sección: cargan al acercarse, suenan solo en pantalla ---------- */
  if (!reduce && !(navigator.connection || {}).saveData) {
    document.querySelectorAll('[data-section-video]').forEach((v) => {
      v.muted = true;
      new IntersectionObserver(([e]) => {
        if (e.isIntersecting) {
          if (!v.src) v.src = small() ? v.dataset.srcSm : v.dataset.srcLg;
          v.play().catch(() => {});
        } else v.pause();
      }, { rootMargin: '200px 0px' }).observe(v);
    });
  }

  /* ---------- Trailer: carga y reproduce con sonido al pulsar ---------- */
  const trailer = document.querySelector('[data-trailer]');
  const poster = document.querySelector('.screen__poster');
  const playTrailer = (e) => {
    if (!trailer) return;
    e.preventDefault();
    // encuadrar el reproductor completo: centrado si cabe, si no pegado bajo la barra
    const screen = document.querySelector('.screen');
    const r = screen.getBoundingClientRect(), navH = nav.offsetHeight, room = window.innerHeight - navH;
    const top = window.scrollY + r.top - navH - Math.max(12, (room - r.height) / 2);
    window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });
    if (!trailer.src) trailer.src = small() ? trailer.dataset.srcSm : trailer.dataset.srcLg;
    trailer.hidden = false; poster.hidden = true;
    trailer.play().catch(() => {});
  };
  document.querySelectorAll('[data-play-trailer]').forEach((b) => b.addEventListener('click', playTrailer));

  /* ---------- Demo: Szenario → Persönlichkeit → Gespräch ---------- */
  const demo = document.querySelector('[data-demo]');
  if (demo) {
    const state = { scenario: '', persona: '', annual: true };
    const panes = demo.querySelectorAll('[data-pane]');
    const labels = demo.querySelectorAll('[data-step-label]');
    const chat = demo.querySelector('[data-chat]');
    const call = demo.querySelector('.call');
    let timers = [];

    const go = (n) => {
      panes.forEach((p) => { const on = p.dataset.pane === String(n); p.hidden = !on; p.classList.toggle('is-active', on); });
      labels.forEach((l) => {
        const i = Number(l.dataset.stepLabel);
        l.classList.toggle('is-active', i === n); l.classList.toggle('is-done', i < n);
      });
      if (n === 3) startCall();
      else { timers.forEach(clearTimeout); timers = []; }
      // llevar la vista al inicio del asistente (sobre todo en móvil, tras elegir una opción de abajo)
      const top = demo.getBoundingClientRect().top + window.scrollY - nav.offsetHeight - 12;
      if (Math.abs(window.scrollY - top) > 8) window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });
    };

    // filtros de categoría
    demo.querySelectorAll('[data-filter]').forEach((chip) => chip.addEventListener('click', () => {
      demo.querySelectorAll('[data-filter]').forEach((c) => { c.classList.toggle('is-on', c === chip); c.setAttribute('aria-pressed', String(c === chip)); });
      const f = chip.dataset.filter;
      demo.querySelectorAll('[data-pane="1"] .option').forEach((o) => { o.hidden = f !== 'all' && o.dataset.cat !== f; });
    }));
    const mark = (pane, el) => demo.querySelectorAll(`[data-pane="${pane}"] .option`).forEach((o) => { o.classList.toggle('is-selected', o === el); o.setAttribute('aria-pressed', String(o === el)); });
    demo.querySelectorAll('[data-pane="1"] .option').forEach((o) => o.addEventListener('click', () => { state.scenario = o.dataset.value; state.annual = o.dataset.script === 'annual'; mark(1, o); go(2); }));
    demo.querySelectorAll('[data-pane="2"] .option').forEach((o) => o.addEventListener('click', () => {
      const pool = [...demo.querySelectorAll('[data-pane="2"] .option:not([data-random])')].map((x) => x.dataset.value);
      state.persona = o.hasAttribute('data-random') ? pool[Math.floor(Math.random() * pool.length)] : o.dataset.value;
      mark(2, o);
      go(3);
    }));
    demo.querySelectorAll('[data-back]').forEach((b) => b.addEventListener('click', () => go(Number(b.dataset.back))));

    // conversación real del tráiler (Jahresgespräch); para el resto, invitación a la app
    const SCRIPT = [
      ['ai', 'Hallo, ich bin Anna Richter. Ich freue mich auf unser Jahresgespräch und bin gespannt, wie meine Leistung dieses Jahr bewertet wird.'],
      ['me', 'Hallo Anna, ich freu mich auch, dass wir heute sprechen. Magst du vielleicht zuerst erzählen, wie du das Jahr erlebt hast?'],
      ['ai', 'Gerne. Für mich war das Jahr intensiv, aber auch sehr produktiv. Besonders Projekt Delta war mir wichtig, das lief aus meiner Sicht sehr gut.'],
    ];
    const add = (who, text) => {
      const m = document.createElement('div');
      m.className = `msg msg--${who}`;
      m.innerHTML = `<small>${who === 'ai' ? 'Anna Richter' : T.you}</small>`;
      m.append(text);
      chat.append(m);
    };
    function startCall() {
      timers.forEach(clearTimeout); timers = [];
      demo.querySelector('[data-call-scenario]').textContent = state.scenario;
      demo.querySelector('[data-call-persona]').textContent = state.persona;
      chat.textContent = '';
      call.classList.add('is-idle');
      const typing = document.createElement('div'); typing.className = 'msg msg--typing'; typing.textContent = T.typing;
      chat.append(typing);
      const lines = state.annual ? (T.script || SCRIPT) : T.generic(state.scenario);
      let t = reduce ? 0 : 1100;
      lines.forEach(([who, text], i) => {
        timers.push(setTimeout(() => {
          if (i === 0) typing.remove();
          call.classList.toggle('is-idle', who !== 'ai');
          add(who, text);
        }, t));
        t += reduce ? 0 : 1600 + text.length * 18;
      });
      timers.push(setTimeout(() => call.classList.add('is-idle'), t));
    }
  }

  /* ---------- Brillo del cristal que sigue al puntero ---------- */
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && !reduce) {
    document.addEventListener('pointermove', (e) => {
      const el = e.target.closest('.glass, .option');
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - r.left}px`);
      el.style.setProperty('--my', `${e.clientY - r.top}px`);
    }, { passive: true });
  }

  document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
})();
