/* =============================================
   SCRIPT.JS — Dietitian Portfolio
   Handles: nav scroll, mobile menu, 
            scroll reveal animations, 
            smooth interactions
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ──────────────────────────────────────────
     1. NAVIGATION — scroll class + mobile menu
     ────────────────────────────────────────── */
  const nav        = document.querySelector('.nav');
  const navToggle  = document.querySelector('.nav__toggle');
  const navMobile  = document.querySelector('.nav__mobile');

  // Add "scrolled" class when page is scrolled
  const handleScroll = () => {
    if (window.scrollY > 60) {
      nav?.classList.add('scrolled');
    } else {
      nav?.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Run on load

  // Mobile menu toggle
  navToggle?.addEventListener('click', () => {
    navToggle.classList.toggle('open');
    nav.classList.toggle('mobile-open');
  });

  // Close mobile menu when a link is clicked
  document.querySelectorAll('.nav__mobile a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle?.classList.remove('open');
      nav?.classList.remove('mobile-open');
    });
  });

  // Close mobile menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!nav?.contains(e.target)) {
      navToggle?.classList.remove('open');
      nav?.classList.remove('mobile-open');
    }
  });


  /* ──────────────────────────────────────────
     2. SCROLL REVEAL — elements animate in
        as they enter the viewport
     ────────────────────────────────────────── */
  const revealElements = document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right'
  );

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Optional: stop observing after animation runs
          // revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,    // Trigger when 12% of element is visible
      rootMargin: '0px 0px -40px 0px' // Slight offset from bottom
    }
  );

  revealElements.forEach(el => revealObserver.observe(el));


  /* ──────────────────────────────────────────
     3. MARQUEE — duplicate content for 
        seamless infinite scroll effect
     ────────────────────────────────────────── */
  const marqueeTrack = document.querySelector('.marquee__track');
  if (marqueeTrack) {
    // Clone the track content so it loops seamlessly
    const clone = marqueeTrack.cloneNode(true);
    marqueeTrack.parentElement.appendChild(clone);
  }


  /* ──────────────────────────────────────────
     4. ACTIVE NAV LINK — highlight current page
     ────────────────────────────────────────── */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a, .nav__mobile a').forEach(link => {
    if (link.classList.contains('nav__cta')) return; // skip the CTA button
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage ||
        (currentPage === '' && linkPage === 'index.html')) {
      link.style.color = 'var(--sage)';
    }
  });


  /* ──────────────────────────────────────────
     5. SMOOTH SCROLL — for anchor links
     ────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80; // nav height offset
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  /* ──────────────────────────────────────────
     6. COUNTER ANIMATION — for stat numbers
        (e.g. "70+ clients")
     ────────────────────────────────────────── */
  const animateCounter = (el, target, duration = 1800) => {
    let start = 0;
    const startTime = performance.now();
    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      el.textContent = current + (el.dataset.suffix || '');
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  };

  // Observe counter elements
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.count);
          if (!isNaN(target) && !el.dataset.animated) {
            el.dataset.animated = 'true';
            animateCounter(el, target);
          }
          counterObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll('[data-count]').forEach(el => {
    counterObserver.observe(el);
  });


  /* ──────────────────────────────────────────
     7. TESTIMONIAL SLIDER — simple auto-scroll
        (only activates on mobile where grid 
         becomes single column)
     ────────────────────────────────────────── */
  // This is a progressive enhancement — the grid works without JS.
  // On small screens you could add swipe support here.


  /* ──────────────────────────────────────────
     8. FORM VALIDATION (Contact page)
     ────────────────────────────────────────── */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const name    = document.getElementById('name');
      const email   = document.getElementById('email');
      const message = document.getElementById('message');
      let isValid   = true;

      // Clear previous errors
      document.querySelectorAll('.form-error').forEach(el => el.remove());

      // Validate name
      if (!name?.value.trim()) {
        showError(name, 'Please enter your name.');
        isValid = false;
      }

      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email?.value.trim() || !emailRegex.test(email.value)) {
        showError(email, 'Please enter a valid email address.');
        isValid = false;
      }

      // Validate message
      if (!message?.value.trim() || message.value.length < 10) {
        showError(message, 'Please enter a message (at least 10 characters).');
        isValid = false;
      }

      if (isValid) {
        // Show success state
        const btn = contactForm.querySelector('[type="submit"]');
        if (btn) {
          btn.textContent = '✓ Message Sent!';
          btn.style.background = 'var(--sage)';
          btn.disabled = true;
        }
        // Here you would normally send to a backend / Formspree / EmailJS
        console.log('Form submitted:', {
          name: name.value,
          email: email.value,
          message: message.value
        });
      }
    });

    function showError(input, msg) {
      const error = document.createElement('span');
      error.className = 'form-error';
      error.style.cssText = 'display:block;color:var(--terra);font-size:0.8rem;margin-top:6px;';
      error.textContent = msg;
      input?.parentElement?.appendChild(error);
      input?.classList.add('error');
    }
  }


  /* ──────────────────────────────────────────
     9. PARALLAX — subtle parallax on hero image
     ────────────────────────────────────────── */
  const heroImage = document.querySelector('.hero__image-wrap img');
  if (heroImage && window.innerWidth > 768) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      heroImage.style.transform = `translateY(${scrolled * 0.2}px)`;
    }, { passive: true });
  }


  /* ──────────────────────────────────────────
     10. PAGE LOAD ANIMATION
     ────────────────────────────────────────── */
document.body.classList.add('loaded');


  /* WHATSAPP FLOATING BUTTON */
  const WA_PHONE   = '919704168146'; // ← Replace with Niharika's number (91 + 10 digits)
  const WA_MESSAGE = encodeURIComponent(
    'Hi Niharika! I found your website and would like to know more about your nutrition programs.'
  );
  const WA_URL = `https://wa.me/${WA_PHONE}?text=${WA_MESSAGE}`;

  const waBtn = document.createElement('a');
  waBtn.href      = WA_URL;
  waBtn.target    = '_blank';
  waBtn.rel       = 'noopener noreferrer';
  waBtn.className = 'wa-float';
  waBtn.setAttribute('aria-label', 'Contact us on WhatsApp');
  waBtn.innerHTML = `
    <span class="wa-float__tooltip">Contact us</span>
    <span class="wa-float__icon">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="28" height="28" fill="none">
        <path fill="#fff" d="M24 4C13 4 4 13 4 24c0 3.6 1 7 2.7 10L4 44l10.3-2.7C17.1 43 20.5 44 24 44c11 0 20-9 20-20S35 4 24 4z"/>
        <path fill="#25D366" d="M24 6.4C14.3 6.4 6.4 14.3 6.4 24c0 3.4.96 6.6 2.6 9.3L6.7 41.3l8.2-2.3c2.6 1.5 5.6 2.4 8.8 2.4C33.7 41.4 41.6 33.5 41.6 24c0-9.6-7.9-17.6-17.6-17.6z"/>
        <path fill="#fff" fill-rule="evenodd" d="M32.8 27.8c-.5-.2-2.8-1.4-3.2-1.5-.4-.2-.7-.2-1 .2-.3.5-1.2 1.5-1.4 1.8-.3.3-.5.4-1 .1-.5-.2-2-.7-3.8-2.3-1.4-1.2-2.3-2.7-2.6-3.2-.3-.5 0-.7.2-1l.7-.8c.2-.3.3-.5.4-.8.1-.3 0-.6-.1-.8-.1-.3-1-2.5-1.4-3.4-.4-.9-.8-.8-1-.8h-.9c-.3 0-.8.1-1.2.6-.4.5-1.6 1.5-1.6 3.7 0 2.2 1.6 4.3 1.8 4.6.2.3 3.1 4.9 7.7 6.7 4.6 1.8 4.6 1.2 5.4 1.1.8-.1 2.6-1.1 3-2.1.4-1 .4-1.9.3-2.1-.2-.2-.5-.3-1-.5z" clip-rule="evenodd"/>
      </svg>
    </span>
    <span class="wa-float__pulse"></span>
  `;

  document.body.appendChild(waBtn);
  setTimeout(() => waBtn.classList.add('wa-float--visible'), 1200);
  setTimeout(() => waBtn.classList.add('wa-float--tip-hidden'), 5000);

}); // END DOMContentLoaded
