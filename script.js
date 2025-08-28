/* ===========================
   script.js — All site JS
   - Purpose: interactive behaviors (typing, mobile menu, back-to-top, contact form)
   - Simple, readable, and safe to modify.
   =========================== */

/* Wait for DOM ready */
document.addEventListener('DOMContentLoaded', function () {
  /* -------------------------
     Typing animation (hero)
     - This preserves original behavior and timings.
     ------------------------- */
  (function typingAnimation() {
    const roles = ['Developer', 'Designer', 'Data Analyst', 'Problem Solver'];
    const typingText = document.getElementById('typing-text');
    if (!typingText) return;

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 150;

    function typeRoles() {
      const currentRole = roles[roleIndex];

      if (isDeleting) {
        // remove one char
        typingText.textContent = currentRole.substring(0, Math.max(0, charIndex - 1));
        charIndex--;
        typingSpeed = 50;
      } else {
        // add one char
        typingText.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 150;
      }

      if (!isDeleting && charIndex === currentRole.length) {
        // pause at end of word
        typingSpeed = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        // move to next word
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingSpeed = 500;
      }

      setTimeout(typeRoles, typingSpeed);
    }

    // Start typing after 1 second (same as original file)
    setTimeout(typeRoles, 1000);
  })();

  /* -------------------------
     Mobile menu toggle
     - toggles `#mobile-menu.open`
     - also updates aria-expanded for accessibility
     ------------------------- */
  (function mobileMenuToggle() {
    const btn = document.getElementById('mobile-menu-button');
    const menu = document.getElementById('mobile-menu');

    if (!btn || !menu) return;

    btn.addEventListener('click', function () {
      const isOpen = menu.classList.toggle('open');
      // toggle hidden class for fallback + accessibility
      if (isOpen) {
        menu.classList.remove('hidden');
        btn.setAttribute('aria-expanded', 'true');
      } else {
        // keep 'hidden' so it stays out of layout for some browsers
        // we keep a small timeout to allow CSS transition if any
        menu.classList.add('hidden');
        btn.setAttribute('aria-expanded', 'false');
      }
    });

    // Close mobile menu when any link inside it is clicked
    menu.addEventListener('click', function (e) {
      const target = e.target.closest('a');
      if (target) {
        menu.classList.add('hidden');
        menu.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  })();

  /* -------------------------
     Back to top button
     - shows after scrolling down
     - smooth scroll to top on click
     ------------------------- */
  (function backToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;

    // simple throttle for scroll handler
    let lastKnownScrollY = 0;
    let ticking = false;

    function onScroll() {
      lastKnownScrollY = window.scrollY;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const showAfter = 400; // px
          if (lastKnownScrollY > showAfter) {
            btn.classList.add('show', 'is-visible');
            btn.classList.remove('invisible');
          } else {
            btn.classList.remove('show', 'is-visible');
            btn.classList.add('invisible');
          }
          ticking = false;
        });
        ticking = true;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });

    // click -> smooth scroll to top
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // initial check in case page is already scrolled (rare on load)
    onScroll();
  })();

  /* -------------------------
     Contact form handler (client-side)
     - Prevents default submit (since no backend included)
     - Shows a simple message and resets form
     - You can replace this with your own fetch/ajax to send to backend.
     ------------------------- */
  (function contactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    // Custom popup helpers
    function showPopup(msg) {
      const popup = document.getElementById('form-popup');
      const popupMsg = document.getElementById('form-popup-message');
      popupMsg.textContent = msg;
      popup.classList.remove('hidden');
    }
    function hidePopup() {
      document.getElementById('form-popup').classList.add('hidden');
    }
    document.getElementById('form-popup-close').addEventListener('click', hidePopup);

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = form.querySelector('#name')?.value?.trim() || '';
      const email = form.querySelector('#email')?.value?.trim() || '';
      const subject = form.querySelector('#subject')?.value?.trim() || '';
      const message = form.querySelector('#message')?.value?.trim() || '';

      if (!name || !email || !subject || !message) {
        showPopup('Please fill all required fields before sending.');
        return;
      }

      // Prepare data for Formspree
      const formData = new FormData(form);
      fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      })
      .then(response => {
        if (response.ok) {
          showPopup('Thank you, ' + name + ', for sending your message!');
          form.reset();
        } else {
          showPopup('Sorry, there was a problem sending your message. Please try again later.');
        }
      })
      .catch(() => {
        showPopup('Sorry, there was a problem sending your message. Please try again later.');
      });
    });
  })();

  /* -------------------------
     (Optional) Highlight nav links on scroll
     - This is a small helper: it adds `.active` to nav links when the section is in view.
     - It does not change layout or content — just a visual state.
     - If you don't want this, you can remove the block below.
     ------------------------- */
  (function navHighlightOnScroll() {
    const navLinks = Array.from(document.querySelectorAll('.nav-link'));
    if (!navLinks.length) return;

    const sections = navLinks
      .map(link => {
        const href = link.getAttribute('href');
        if (!href || !href.startsWith('#')) return null;
        const section = document.querySelector(href);
        return section ? { link, section } : null;
      })
      .filter(Boolean);

    if (!sections.length) return;

    function onScroll() {
      const scrollPos = window.scrollY + (window.innerHeight / 4); // offset to trigger earlier
      sections.forEach(({ link, section }) => {
        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;
        if (scrollPos >= top && scrollPos < bottom) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    // run once on load
    onScroll();
  })();
});
