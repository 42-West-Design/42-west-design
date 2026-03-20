/* ============================================================
   42 West Design — main.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ----- Loading Screen ----- */
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    setTimeout(() => {
      loadingScreen.classList.add('hidden');
      document.body.style.overflow = '';
    }, 2000);
    document.body.style.overflow = 'hidden';
  }

  /* ----- Consultation Bar ----- */
  const consultBar = document.getElementById('consultation-bar');
  const consultBarClose = document.getElementById('consultation-bar-close');
  const mainNav = document.getElementById('main-nav');

  function updateNavTop() {
    if (!consultBar || !mainNav) return;
    if (consultBar.classList.contains('hidden')) {
      mainNav.classList.add('bar-hidden');
    } else {
      mainNav.classList.remove('bar-hidden');
    }
  }

  if (consultBarClose && consultBar) {
    consultBarClose.addEventListener('click', () => {
      consultBar.classList.add('hidden');
      updateNavTop();
    });
  }

  /* ----- Sticky Nav ----- */
  if (mainNav) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 60) {
        mainNav.classList.add('scrolled');
      } else {
        mainNav.classList.remove('scrolled');
      }
    });
  }

  /* ----- Hamburger Menu ----- */
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ----- Smooth Scroll ----- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = (mainNav ? mainNav.offsetHeight : 80) + 20;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ----- Active Nav Link ----- */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /* ----- Hero Animation ----- */
  const hero = document.querySelector('.hero');
  if (hero) {
    setTimeout(() => hero.classList.add('loaded'), 100);
  }

  /* ----- Scroll Reveal (IntersectionObserver) ----- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ----- Counter Animation ----- */
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'), 10);
        const suffix = el.getAttribute('data-suffix') || '';
        const prefix = el.getAttribute('data-prefix') || '';
        let start = 0;
        const duration = 2000;
        const step = (timestamp) => {
          if (!el._startTime) el._startTime = timestamp;
          const elapsed = timestamp - el._startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3); // ease out cubic
          const current = Math.floor(eased * target);
          el.textContent = prefix + current + suffix;
          if (progress < 1) requestAnimationFrame(step);
          else el.textContent = prefix + target + suffix;
        };
        requestAnimationFrame(step);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => counterObserver.observe(el));

  /* ----- Portfolio Filter ----- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');
        portfolioItems.forEach(item => {
          const cat = item.getAttribute('data-category');
          if (filter === 'all' || cat === filter) {
            item.style.display = '';
            item.style.opacity = '0';
            item.style.transform = 'scale(0.95)';
            setTimeout(() => {
              item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            }, 50);
          } else {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.9)';
            setTimeout(() => { item.style.display = 'none'; }, 400);
          }
        });
      });
    });
  }

  /* ----- Portfolio Modal ----- */
  const modal = document.getElementById('portfolio-modal');
  const modalClose = document.querySelector('.modal-close');

  if (modal) {
    portfolioItems.forEach(item => {
      item.addEventListener('click', () => {
        const imgSrc = item.querySelector('img').src;
        const title = item.getAttribute('data-title');
        const category = item.getAttribute('data-category');
        const description = item.getAttribute('data-description');
        const tags = item.getAttribute('data-tags') ? item.getAttribute('data-tags').split(',') : [];

        modal.querySelector('.modal-image').src = imgSrc;
        modal.querySelector('.modal-image').alt = title;
        modal.querySelector('.modal-category').textContent = category;
        modal.querySelector('.modal-content h2').textContent = title;
        modal.querySelector('.modal-content p').textContent = description;

        const tagsContainer = modal.querySelector('.modal-tags');
        tagsContainer.innerHTML = tags.map(t => `<span class="modal-tag">${t.trim()}</span>`).join('');

        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
      });
    });

    if (modalClose) {
      modalClose.addEventListener('click', closeModal);
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });
  }

  function closeModal() {
    if (modal) {
      modal.classList.remove('show');
      document.body.style.overflow = '';
    }
  }

  /* ----- FAQ Accordion ----- */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        faqItems.forEach(i => i.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
      });
    }
  });

  /* ----- Back to Top ----- */
  const backToTop = document.getElementById('back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    });

    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ----- Cookie Consent ----- */
  const cookieConsent = document.getElementById('cookie-consent');
  const cookieAccept = document.getElementById('cookie-accept');
  const cookieDecline = document.getElementById('cookie-decline');

  if (cookieConsent && !localStorage.getItem('cookie-consent')) {
    setTimeout(() => cookieConsent.classList.add('show'), 2500);
  }

  if (cookieAccept) {
    cookieAccept.addEventListener('click', () => {
      localStorage.setItem('cookie-consent', 'accepted');
      cookieConsent.classList.remove('show');
    });
  }

  if (cookieDecline) {
    cookieDecline.addEventListener('click', () => {
      localStorage.setItem('cookie-consent', 'declined');
      cookieConsent.classList.remove('show');
    });
  }

  /* ----- Social Proof Popup ----- */
  const socialProof = document.getElementById('social-proof');
  const inquiries = [
    { name: 'Sarah K.', city: 'New York', service: 'Brand Identity' },
    { name: 'Marcus L.', city: 'Miami', service: 'Website Design' },
    { name: 'Elena R.', city: 'San Diego', service: 'Packaging Design' },
    { name: 'David P.', city: 'Chicago', service: 'Social Media Design' },
    { name: 'Priya M.', city: 'Los Angeles', service: 'UI/UX Design' }
  ];
  let spIndex = 0;

  function showSocialProof() {
    if (!socialProof) return;
    const inquiry = inquiries[spIndex % inquiries.length];
    spIndex++;

    const avatar = socialProof.querySelector('.sp-avatar');
    const strong = socialProof.querySelector('.sp-text strong');
    const span = socialProof.querySelector('.sp-text span');

    if (avatar) avatar.textContent = inquiry.name.charAt(0);
    if (strong) strong.textContent = `${inquiry.name} from ${inquiry.city}`;
    if (span) span.textContent = `Just requested a ${inquiry.service} quote`;

    // Don't overlap with cookie consent
    if (cookieConsent && cookieConsent.classList.contains('show')) return;

    socialProof.classList.add('show');
    setTimeout(() => socialProof.classList.remove('show'), 5000);
  }

  // Only show after cookies are handled or after 8 seconds
  setTimeout(showSocialProof, 8000);
  setInterval(showSocialProof, 38000);

  /* ----- Exit Intent Popup ----- */
  const exitPopup = document.getElementById('exit-popup');
  const exitPopupClose = document.querySelector('.exit-popup-close');
  const exitPopupSkip = document.querySelector('.exit-popup-skip');
  let exitShown = false;

  if (exitPopup && !sessionStorage.getItem('exit-popup-shown')) {
    document.addEventListener('mouseleave', (e) => {
      if (e.clientY <= 0 && !exitShown) {
        exitShown = true;
        exitPopup.classList.add('show');
        document.body.style.overflow = 'hidden';
        sessionStorage.setItem('exit-popup-shown', 'true');
      }
    });
  }

  function closeExitPopup() {
    if (exitPopup) {
      exitPopup.classList.remove('show');
      document.body.style.overflow = '';
    }
  }

  if (exitPopupClose) exitPopupClose.addEventListener('click', closeExitPopup);
  if (exitPopupSkip) exitPopupSkip.addEventListener('click', closeExitPopup);

  if (exitPopup) {
    exitPopup.addEventListener('click', (e) => {
      if (e.target === exitPopup) closeExitPopup();
    });

    const exitForm = exitPopup.querySelector('.exit-form');
    if (exitForm) {
      exitForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = exitForm.querySelector('input');
        if (input && input.value) {
          exitForm.innerHTML = '<p style="color:var(--gold);font-family:Montserrat,sans-serif;font-weight:700;font-size:1rem;text-align:center;">Thank you! We\'ll send your free brand audit shortly.</p>';
          setTimeout(closeExitPopup, 2500);
        }
      });
    }
  }

  /* ----- Newsletter Form ----- */
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input');
      if (input && input.value) {
        newsletterForm.innerHTML = '<p style="color:var(--gold);font-family:Montserrat,sans-serif;font-weight:600;font-size:0.95rem;">Thanks for subscribing! Watch your inbox for design inspiration.</p>';
      }
    });
  }

  /* ----- Contact Form ----- */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
      }
    });
  }

});
