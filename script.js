/**
 * ONE ENGLISH — Premium Landing Page Core Logic
 * School of English in Shymkent, Kazakhstan
 * Pure Vanilla JavaScript (No frameworks, no libraries)
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* --------------------------------------------------------------------------
     1. GLOBAL HELPERS & PREFERS-REDUCED-MOTION
     -------------------------------------------------------------------------- */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --------------------------------------------------------------------------
     2. READING PROGRESS BAR & STICKY HEADER
     -------------------------------------------------------------------------- */
  const progressBar = document.getElementById('scrollProgressBar');
  const siteHeader = document.getElementById('siteHeader');
  const scrollTopBtn = document.getElementById('scrollTopBtn');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id], footer[id]');

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    
    // Progress bar width
    if (progressBar && docHeight > 0) {
      const scrollPercent = (scrollTop / docHeight) * 100;
      progressBar.style.width = `${Math.min(scrollPercent, 100)}%`;
    }

    // Header glass effect
    if (siteHeader) {
      if (scrollTop > 40) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }

    // Scroll to Top visibility
    if (scrollTopBtn) {
      if (scrollTop > 450) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    }

    // Highlight active nav link on scroll
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (currentSectionId && link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });
    });
  }

  /* --------------------------------------------------------------------------
     3. MOBILE DRAWER NAVIGATION
     -------------------------------------------------------------------------- */
  const burgerBtn = document.getElementById('burgerBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-cta-btn');

  function toggleMobileMenu(forceClose = false) {
    if (!burgerBtn || !mobileDrawer) return;
    const isOpen = forceClose ? false : !mobileDrawer.classList.contains('open');

    if (isOpen) {
      burgerBtn.classList.add('active');
      burgerBtn.setAttribute('aria-expanded', 'true');
      mobileDrawer.classList.add('open');
      mobileDrawer.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    } else {
      burgerBtn.classList.remove('active');
      burgerBtn.setAttribute('aria-expanded', 'false');
      mobileDrawer.classList.remove('open');
      mobileDrawer.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  if (burgerBtn) {
    burgerBtn.addEventListener('click', () => toggleMobileMenu());
  }

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => toggleMobileMenu(true));
  });

  // Close drawer when clicking outside
  document.addEventListener('click', (e) => {
    if (mobileDrawer && mobileDrawer.classList.contains('open')) {
      if (!mobileDrawer.contains(e.target) && !burgerBtn.contains(e.target)) {
        toggleMobileMenu(true);
      }
    }
  });

  /* --------------------------------------------------------------------------
     4. HERO TYPEWRITER ANIMATION
     -------------------------------------------------------------------------- */
  const typewriterElement = document.getElementById('typewriterText');
  const typewriterPhrases = [
    'Говори. Учись. Побеждай.',
    'Английский с нуля до Advanced',
    'Твой путь к IELTS 7.5+',
    'Уверенность в каждом слове'
  ];

  if (typewriterElement && !prefersReducedMotion) {
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeDelay = 100;

    function typeLoop() {
      const currentPhrase = typewriterPhrases[phraseIndex];

      if (isDeleting) {
        typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typeDelay = 50;
      } else {
        typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typeDelay = 90;
      }

      if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        typeDelay = 2200; // Pause at end of phrase
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % typewriterPhrases.length;
        typeDelay = 400; // Pause before typing new word
      }

      setTimeout(typeLoop, typeDelay);
    }

    typeLoop();
  } else if (typewriterElement) {
    typewriterElement.textContent = typewriterPhrases[0];
  }

  /* --------------------------------------------------------------------------
     5. HERO MOUSE PARALLAX EFFECT
     -------------------------------------------------------------------------- */
  const heroSection = document.getElementById('hero');
  const floatingElements = document.querySelectorAll('[data-speed]');

  if (heroSection && floatingElements.length > 0 && !prefersReducedMotion) {
    heroSection.addEventListener('mousemove', (e) => {
      const { clientX, clientY } = e;
      const xPercent = (clientX / window.innerWidth) - 0.5;
      const yPercent = (clientY / window.innerHeight) - 0.5;

      floatingElements.forEach(el => {
        const speed = parseFloat(el.getAttribute('data-speed')) || 1;
        const xOffset = xPercent * 30 * speed;
        const yOffset = yPercent * 30 * speed;
        el.style.transform = `translate3d(${xOffset}px, ${yOffset}px, 0)`;
      });
    });

    heroSection.addEventListener('mouseleave', () => {
      floatingElements.forEach(el => {
        el.style.transform = '';
      });
    });
  }

  /* --------------------------------------------------------------------------
     6. SCROLL REVEAL ANIMATIONS (IntersectionObserver)
     -------------------------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal-fade-up, .reveal-scale');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = el.getAttribute('data-delay') || 0;

          setTimeout(() => {
            el.classList.add('is-revealed');
          }, delay);

          observer.unobserve(el);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }

  /* --------------------------------------------------------------------------
     7. ANIMATED NUMBER COUNTERS
     -------------------------------------------------------------------------- */
  const counterCards = document.querySelectorAll('.stat-card[data-counter-target]');
  const aboutCounters = document.querySelectorAll('.box-stat-number[data-count]');

  function animateCounter(element, target, prefix = '', suffix = '') {
    let startTimestamp = null;
    const duration = 2000;
    const startVal = 0;

    function step(timestamp) {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease out cubic
      const easeOutProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.floor(easeOutProgress * (target - startVal) + startVal);

      element.textContent = `${prefix}${currentVal}${suffix}`;

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        element.textContent = `${prefix}${target}${suffix}`;
      }
    }

    window.requestAnimationFrame(step);
  }

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const statsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const card = entry.target;
          const target = parseInt(card.getAttribute('data-counter-target'), 10);
          const prefix = card.getAttribute('data-counter-prefix') || '';
          const suffix = card.getAttribute('data-counter-suffix') || '';
          const valueSpan = card.querySelector('.counter-value');

          if (valueSpan && !isNaN(target)) {
            animateCounter(valueSpan, target, prefix, suffix);
          }

          observer.unobserve(card);
        }
      });
    }, { threshold: 0.3 });

    counterCards.forEach(card => statsObserver.observe(card));

    const aboutStatsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-count'), 10);
          if (!isNaN(target)) {
            animateCounter(el, target, '', target === 15 ? '+' : '');
          }
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.3 });

    aboutCounters.forEach(counter => aboutStatsObserver.observe(counter));
  } else {
    counterCards.forEach(card => {
      const target = card.getAttribute('data-counter-target');
      const val = card.querySelector('.counter-value');
      if (val) val.textContent = target;
    });
  }

  /* --------------------------------------------------------------------------
     8. INTERACTIVE CEFR LEVELS LADDER (7 LEVELS)
     -------------------------------------------------------------------------- */
  const levelData = {
    1: {
      tag: 'Уровень 1',
      cefr: 'Pre-A1',
      title: 'Starter',
      desc: 'Идеальный старт для тех, кто никогда ранее не учил английский язык. Изучение алфавита, правил чтения, базовых звуков и построения первых простых фраз для повседневных диалогов.',
      goal: 'Поставить правильное произношение и преодолеть страх первого слова',
      speaking: 'Знакомство, простые ответы о себе, семье и увлечениях',
      vocab: 'До 500 базовых слов и устойчивых выражений'
    },
    2: {
      tag: 'Уровень 2',
      cefr: 'A1',
      title: 'Beginner',
      desc: 'Закрепление базовой грамматики и первых речевых шаблонов. Ученики начинают свободно рассказывать о своем распорядке дня, любимых занятиях и понимать короткие аудиозаписи.',
      goal: 'Построение прочного грамматического фундамента (Present Simple, to be)',
      speaking: 'Короткие диалоги в магазине, кафе, описание своего дома и дня',
      vocab: 'Около 1 000 активных слов и базовых фраз'
    },
    3: {
      tag: 'Уровень 3',
      cefr: 'A2',
      title: 'Elementary',
      desc: 'Уверенный переход к свободной разговорной речи в типичных жизненных ситуациях. Разбор прошедших и будущих времен, участие в обсуждении поездок и планов.',
      goal: 'Уверенно поддерживать разговор и ориентироваться в путешествиях',
      speaking: 'Рассказы о прошедших событиях, ориентирование в городе, покупки',
      vocab: '1 500 – 2 000 слов и популярных идиом'
    },
    4: {
      tag: 'Уровень 4',
      cefr: 'B1',
      title: 'Pre-Intermediate',
      desc: 'Качественный скачок в беглости речи. Умение выражать личное мнение, соглашаться и спорить, понимать общий смысл телешоу, статей и песен на английском.',
      goal: 'Преодоление языкового барьера и начало подготовки к серьезным тестам',
      speaking: 'Обсуждение фильмов, новостей, выражение эмоций и аргументов',
      vocab: '2 500 – 3 000 активных слов и фразовых глаголов'
    },
    5: {
      tag: 'Уровень 5',
      cefr: 'B1+',
      title: 'Intermediate',
      desc: '«Золотой стандарт» практического владения. Свободная речь без долгих пауз, понимание сложных временных конструкций, умение вести деловую переписку.',
      goal: 'Беглое общение с носителями языка и сдача промежуточных тестов',
      speaking: 'Спонтанные дискуссии на любые жизненные и профессиональные темы',
      vocab: '3 500 – 4 500 слов, идиом и деловой лексики'
    },
    6: {
      tag: 'Уровень 6',
      cefr: 'B2',
      title: 'Upper-Intermediate',
      desc: 'Высокий уровень владения для учебы за рубежом и работы в международных компаниях. Свободное понимание неадаптированной литературы и лекций.',
      goal: 'Готовность к сдаче IELTS на 6.5–7.5 и поступлению в вузы мира',
      speaking: 'Участие в дебатах, проведение презентаций, аргументированная критика',
      vocab: '5 000 – 6 500 академических и специализированных слов'
    },
    7: {
      tag: 'Уровень 7',
      cefr: 'C1',
      title: 'Advanced',
      desc: 'Профессиональный уровень владения языком. Гибкое и свободное использование английского для академических, научных и карьерных целей любой сложности.',
      goal: 'Сдача IELTS на 7.5–8.5+, преподавание и ведение бизнеса за рубежом',
      speaking: 'Безупречное владение стилистикой, иронией, сложными оборотами речи',
      vocab: '7 000+ слов, устойчивых выражений и нюансов значений'
    }
  };

  const ladderSteps = document.querySelectorAll('.ladder-step');
  const progressFill = document.getElementById('ladderProgressFill');
  const levelTag = document.getElementById('levelTag');
  const levelCefr = document.getElementById('levelCefr');
  const levelTitle = document.getElementById('levelTitle');
  const levelDesc = document.getElementById('levelDesc');
  const levelGoal = document.getElementById('levelGoal');
  const levelSpeaking = document.getElementById('levelSpeaking');
  const levelVocab = document.getElementById('levelVocab');

  function updateActiveLevel(levelNumber) {
    const data = levelData[levelNumber];
    if (!data) return;

    ladderSteps.forEach(step => {
      const stepNum = parseInt(step.getAttribute('data-level'), 10);
      if (stepNum === levelNumber) {
        step.classList.add('active');
        step.setAttribute('aria-selected', 'true');
      } else {
        step.classList.remove('active');
        step.setAttribute('aria-selected', 'false');
      }
    });

    // Update progress fill bar
    if (progressFill) {
      const percent = (levelNumber / 7) * 100;
      progressFill.style.width = `${percent}%`;
    }

    // Update Detail Card Content
    if (levelTag) levelTag.textContent = data.tag;
    if (levelCefr) levelCefr.textContent = data.cefr;
    if (levelTitle) levelTitle.textContent = data.title;
    if (levelDesc) levelDesc.textContent = data.desc;
    if (levelGoal) levelGoal.textContent = data.goal;
    if (levelSpeaking) levelSpeaking.textContent = data.speaking;
    if (levelVocab) levelVocab.textContent = data.vocab;
  }

  ladderSteps.forEach(step => {
    step.addEventListener('click', () => {
      const lvl = parseInt(step.getAttribute('data-level'), 10);
      updateActiveLevel(lvl);
    });
  });

  /* --------------------------------------------------------------------------
     9. IELTS BAND SCORE FILL ANIMATION
     -------------------------------------------------------------------------- */
  const ieltsSection = document.getElementById('ielts');
  const ieltsScaleFill = document.getElementById('ieltsScaleFill');

  if (ieltsSection && ieltsScaleFill && 'IntersectionObserver' in window && !prefersReducedMotion) {
    ieltsScaleFill.style.width = '0%';
    const ieltsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            ieltsScaleFill.style.width = '88%'; // Corresponds to Band 8.0 out of 9.0
          }, 300);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });

    ieltsObserver.observe(ieltsSection);
  }

  /* --------------------------------------------------------------------------
     10. ONE ENGLISH COINS 🪙 INTERACTIVE SHOWCASE & BURST EFFECT
     -------------------------------------------------------------------------- */
  const userDemoCoins = document.getElementById('userDemoCoins');
  const earnCoinBtn = document.getElementById('earnCoinBtn');
  const giftTierCards = document.querySelectorAll('.gift-tier-card');
  const coin3dScene = document.getElementById('coin3dScene');
  const coin3dObject = document.getElementById('coin3dObject');
  const coinsCanvas = document.getElementById('coinsCanvas');

  let currentCoinCount = 50;

  function updateGiftTiers(coins) {
    giftTierCards.forEach(card => {
      const cost = parseInt(card.getAttribute('data-tier-cost'), 10);
      const statusSpan = card.querySelector('.gift-status');

      if (coins >= cost) {
        card.classList.add('unlocked-highlight');
        if (statusSpan) {
          statusSpan.className = 'gift-status status-unlocked';
          statusSpan.textContent = 'Доступно!';
        }
      } else {
        card.classList.remove('unlocked-highlight');
        if (statusSpan) {
          statusSpan.className = 'gift-status status-locked';
          statusSpan.textContent = `Нужно ещё ${cost - coins}`;
        }
      }
    });
  }

  // Init gift tiers with current balance
  updateGiftTiers(currentCoinCount);

  // 3D Coin Interactive Spin on Click
  if (coin3dScene && coin3dObject) {
    coin3dScene.addEventListener('click', () => {
      coin3dObject.style.animation = 'spinCoin3D 1s cubic-bezier(0.16, 1, 0.3, 1)';
      setTimeout(() => {
        coin3dObject.style.animation = 'spinCoin3D 10s linear infinite';
      }, 1000);
    });
  }

  // Canvas Falling Coins Physics Particle Effect
  let coinsParticles = [];
  let animFrameId = null;

  function initCoinsCanvas() {
    if (!coinsCanvas) return;
    coinsCanvas.width = window.innerWidth;
    coinsCanvas.height = window.innerHeight;
  }
  window.addEventListener('resize', initCoinsCanvas);
  initCoinsCanvas();

  function spawnCoinsBurst(originX, originY) {
    if (!coinsCanvas || prefersReducedMotion) return;
    const ctx = coinsCanvas.getContext('2d');
    const coinColors = ['#FFB703', '#ffc42e', '#ffe07a', '#e5a400'];

    const count = 35;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 4;
      coinsParticles.push({
        x: originX || window.innerWidth / 2,
        y: originY || window.innerHeight / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 6,
        radius: Math.random() * 8 + 8,
        color: coinColors[Math.floor(Math.random() * coinColors.length)],
        rotation: Math.random() * Math.PI,
        rotationSpeed: (Math.random() - 0.5) * 0.2,
        gravity: 0.35,
        alpha: 1,
        decay: Math.random() * 0.015 + 0.01
      });
    }

    if (!animFrameId) {
      renderCoins();
    }
  }

  function renderCoins() {
    if (!coinsCanvas) return;
    const ctx = coinsCanvas.getContext('2d');
    ctx.clearRect(0, 0, coinsCanvas.width, coinsCanvas.height);

    for (let i = coinsParticles.length - 1; i >= 0; i--) {
      const p = coinsParticles[i];
      p.vy += p.gravity;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotationSpeed;
      p.alpha -= p.decay;

      if (p.alpha <= 0 || p.y > coinsCanvas.height + 50) {
        coinsParticles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = Math.max(p.alpha, 0);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);

      // Draw shiny coin particle
      ctx.beginPath();
      ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.shadowColor = '#FFB703';
      ctx.shadowBlur = 10;
      ctx.fill();

      // Inner ring
      ctx.beginPath();
      ctx.arc(0, 0, p.radius * 0.7, 0, Math.PI * 2);
      ctx.strokeStyle = '#0F2A6B';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.restore();
    }

    if (coinsParticles.length > 0) {
      animFrameId = requestAnimationFrame(renderCoins);
    } else {
      animFrameId = null;
      ctx.clearRect(0, 0, coinsCanvas.width, coinsCanvas.height);
    }
  }

  if (earnCoinBtn) {
    earnCoinBtn.addEventListener('click', (e) => {
      currentCoinCount += 15;
      if (userDemoCoins) userDemoCoins.textContent = currentCoinCount;
      updateGiftTiers(currentCoinCount);

      const rect = earnCoinBtn.getBoundingClientRect();
      const clickX = rect.left + rect.width / 2;
      const clickY = rect.top + rect.height / 2;
      spawnCoinsBurst(clickX, clickY);
    });
  }

  /* --------------------------------------------------------------------------
     11. FAQ ACCORDION
     -------------------------------------------------------------------------- */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (questionBtn && answer) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close all others for a neat accordion feel
        faqItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
            const otherBtn = otherItem.querySelector('.faq-question');
            const otherAns = otherItem.querySelector('.faq-answer');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
            if (otherAns) otherAns.style.maxHeight = null;
          }
        });

        if (isActive) {
          item.classList.remove('active');
          questionBtn.setAttribute('aria-expanded', 'false');
          answer.style.maxHeight = null;
        } else {
          item.classList.add('active');
          questionBtn.setAttribute('aria-expanded', 'true');
          answer.style.maxHeight = `${answer.scrollHeight}px`;
        }
      });
    }
  });

  /* --------------------------------------------------------------------------
     12. APPLICATION LEAD FORM (Validation & Phone Mask)
     -------------------------------------------------------------------------- */
  const leadForm = document.getElementById('leadForm');
  const userPhone = document.getElementById('userPhone');
  const userName = document.getElementById('userName');
  const nameError = document.getElementById('nameError');
  const phoneError = document.getElementById('phoneError');
  const formSuccessMessage = document.getElementById('formSuccessMessage');
  const resetSuccessBtn = document.getElementById('resetSuccessBtn');

  // Phone Mask for Kazakhstan: +7 (XXX) XXX-XX-XX
  if (userPhone) {
    userPhone.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      if (value.startsWith('8')) {
        value = '7' + value.substring(1);
      }
      if (!value.startsWith('7')) {
        value = '7' + value;
      }

      let formatted = '+7';
      if (value.length > 1) {
        formatted += ' (' + value.substring(1, 4);
      }
      if (value.length >= 4) {
        formatted += ') ' + value.substring(4, 7);
      }
      if (value.length >= 7) {
        formatted += '-' + value.substring(7, 9);
      }
      if (value.length >= 9) {
        formatted += '-' + value.substring(9, 11);
      }

      e.target.value = formatted;
      if (phoneError) phoneError.classList.remove('visible');
      userPhone.classList.remove('input-error');
    });

    userPhone.addEventListener('focus', () => {
      if (!userPhone.value) {
        userPhone.value = '+7 (';
      }
    });
  }

  if (userName) {
    userName.addEventListener('input', () => {
      if (nameError) nameError.classList.remove('visible');
      userName.classList.remove('input-error');
    });
  }

  if (leadForm) {
    leadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Validate Name
      if (!userName || userName.value.trim().length < 2) {
        isValid = false;
        if (nameError) nameError.classList.add('visible');
        if (userName) userName.classList.add('input-error');
      }

      // Validate Phone
      const digitsOnly = userPhone ? userPhone.value.replace(/\D/g, '') : '';
      if (!userPhone || digitsOnly.length < 11) {
        isValid = false;
        if (phoneError) phoneError.classList.add('visible');
        if (userPhone) userPhone.classList.add('input-error');
      }

      if (isValid) {
        // Trigger celebratory coin burst & show success modal
        spawnCoinsBurst(window.innerWidth / 2, window.innerHeight / 2);

        if (formSuccessMessage) {
          formSuccessMessage.classList.add('active');
          formSuccessMessage.setAttribute('aria-hidden', 'false');
        }

        leadForm.reset();
      }
    });
  }

  if (resetSuccessBtn && formSuccessMessage) {
    resetSuccessBtn.addEventListener('click', () => {
      formSuccessMessage.classList.remove('active');
      formSuccessMessage.setAttribute('aria-hidden', 'true');
    });
  }

  /* --------------------------------------------------------------------------
     13. AMBIENT BACKGROUND CANVAS (Soft floating golden motes)
     -------------------------------------------------------------------------- */
  const ambientCanvas = document.getElementById('ambientCanvas');
  if (ambientCanvas && !prefersReducedMotion) {
    const actx = ambientCanvas.getContext('2d');
    let width = (ambientCanvas.width = window.innerWidth);
    let height = (ambientCanvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = ambientCanvas.width = window.innerWidth;
      height = ambientCanvas.height = window.innerHeight;
    });

    const particles = [];
    const pCount = Math.floor(Math.min(width, 1440) / 45);

    for (let i = 0; i < pCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.8 + 0.8,
        speedY: Math.random() * 0.4 + 0.15,
        speedX: (Math.random() - 0.5) * 0.2,
        opacity: Math.random() * 0.4 + 0.1
      });
    }

    function renderAmbient() {
      actx.clearRect(0, 0, width, height);

      actx.fillStyle = '#FFB703';
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y -= p.speedY;
        p.x += p.speedX;

        if (p.y < -10) p.y = height + 10;
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        actx.globalAlpha = p.opacity;
        actx.beginPath();
        actx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        actx.fill();
      }

      requestAnimationFrame(renderAmbient);
    }

    renderAmbient();
  }
});
