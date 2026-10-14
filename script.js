/* =========================================================
   Karan Verma | Portfolio  (Module 3: JavaScript Features)

   1. Dark / Light mode toggle
   2. Mobile navigation menu
   3. Smooth scrolling + active menu link
   4. Back to top button
   5. Scroll animations
   6. Contact form validation
   ========================================================= */

(function () {
  'use strict';

  // Agar user ne phone me "reduce motion" on rakha hai, to animations kam karo
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


  /* ---------------------------------------------------------
     1. DARK / LIGHT MODE TOGGLE
     - <html data-theme="dark"> se CSS ke colors badalte hain
     - Choice localStorage me save hoti hai, to dobara kholne par yaad rehti hai
     --------------------------------------------------------- */
  const root = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    themeToggle.setAttribute(
      'aria-label',
      theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
    );
    if (themeColorMeta) {
      themeColorMeta.setAttribute('content', theme === 'dark' ? '#0b1220' : '#eef2f8');
    }
  }

  function getSavedTheme() {
    try {
      return localStorage.getItem('theme');
    } catch (error) {
      return null;
    }
  }

  // Page load par jo theme <head> ke script ne lagayi thi, wahi sync karo
  applyTheme(root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');

  themeToggle.addEventListener('click', function () {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try {
      localStorage.setItem('theme', next);
    } catch (error) {
      /* private mode me save nahi hoga, koi baat nahi */
    }
  });

  // Agar user ne kabhi choose nahi kiya, to phone/laptop ki setting follow karo
  const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
  if (darkQuery.addEventListener) {
    darkQuery.addEventListener('change', function (event) {
      if (!getSavedTheme()) {
        applyTheme(event.matches ? 'dark' : 'light');
      }
    });
  }


  /* ---------------------------------------------------------
     2. MOBILE NAVIGATION MENU
     - Hamburger button par menu khulta/band hota hai
     - Link dabane, bahar tap karne ya Esc dabane par band ho jata hai
     --------------------------------------------------------- */
  const menuToggle = document.getElementById('menu-toggle');
  const siteNav = document.getElementById('site-nav');

  function setMenu(open) {
    siteNav.classList.toggle('is-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }

  menuToggle.addEventListener('click', function () {
    setMenu(!siteNav.classList.contains('is-open'));
  });

  siteNav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      setMenu(false);
    });
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      setMenu(false);
    }
  });

  document.addEventListener('click', function (event) {
    if (!siteNav.classList.contains('is-open')) return;
    const clickedInside = siteNav.contains(event.target) || menuToggle.contains(event.target);
    if (!clickedInside) {
      setMenu(false);
    }
  });

  // Screen bada ho jaye (laptop/tablet landscape) to menu band kar do
  const desktopQuery = window.matchMedia('(min-width: 901px)');
  if (desktopQuery.addEventListener) {
    desktopQuery.addEventListener('change', function (event) {
      if (event.matches) setMenu(false);
    });
  }


  /* ---------------------------------------------------------
     3. SMOOTH SCROLLING + ACTIVE MENU LINK
     --------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (event) {
      const id = link.getAttribute('href');
      if (id.length < 2) return;

      const target = document.querySelector(id);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({
        behavior: reduceMotion ? 'auto' : 'smooth',
        block: 'start'
      });
      history.pushState(null, '', id);
    });
  });

  // Jo section screen ke beech me hai, uska menu link highlight hota hai
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;

          navLinks.forEach(function (link) {
            const isActive = link.getAttribute('href') === '#' + entry.target.id;
            link.classList.toggle('is-active', isActive);
            if (isActive) {
              link.setAttribute('aria-current', 'true');
            } else {
              link.removeAttribute('aria-current');
            }
          });
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );

    sections.forEach(function (section) {
      spy.observe(section);
    });
  }


  /* ---------------------------------------------------------
     4. BACK TO TOP BUTTON
     --------------------------------------------------------- */
  const toTop = document.getElementById('to-top');
  let ticking = false;

  function updateToTop() {
    toTop.classList.toggle('is-visible', window.scrollY > 500);
    ticking = false;
  }

  window.addEventListener(
    'scroll',
    function () {
      if (!ticking) {
        window.requestAnimationFrame(updateToTop);
        ticking = true;
      }
    },
    { passive: true }
  );

  toTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  });

  updateToTop();


  /* ---------------------------------------------------------
     5. SCROLL ANIMATIONS
     - .reveal wale elements scroll karke screen par aate hi fade-in hote hain
     --------------------------------------------------------- */
  const revealItems = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target); // ek hi baar animate karo
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    revealItems.forEach(function (item) {
      revealObserver.observe(item);
    });
  } else {
    // Purane browser: seedha sab dikha do
    revealItems.forEach(function (item) {
      item.classList.add('is-visible');
    });
  }


  /* ---------------------------------------------------------
     6. CONTACT FORM VALIDATION
     - Name: kam se kam 2 letters
     - Email: sahi format (name@example.com)
     - Message: kam se kam 10 letters
     - Sab sahi ho to success message + email app me message khulta hai
     --------------------------------------------------------- */
  const form = document.getElementById('contact-form');
  const statusBox = document.getElementById('form-status');
  const MY_EMAIL = 'hellokxran44@gmail.com';

  const rules = {
    name: {
      input: document.getElementById('contact-name'),
      error: document.getElementById('contact-name-error'),
      check: function (value) {
        if (value.trim().length < 2) {
          return 'Please enter your name (at least 2 letters).';
        }
        return '';
      }
    },
    email: {
      input: document.getElementById('contact-email'),
      error: document.getElementById('contact-email-error'),
      check: function (value) {
        const email = value.trim();
        if (!email) {
          return 'Please enter your email address.';
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
          return 'Please enter a valid email, like name@example.com.';
        }
        return '';
      }
    },
    message: {
      input: document.getElementById('contact-message'),
      error: document.getElementById('contact-message-error'),
      check: function (value) {
        if (value.trim().length < 10) {
          return 'Your message should be at least 10 characters.';
        }
        return '';
      }
    }
  };

  function showFieldError(rule, message) {
    const field = rule.input.closest('.field');
    rule.error.textContent = message;
    field.classList.toggle('has-error', Boolean(message));
    if (message) {
      rule.input.setAttribute('aria-invalid', 'true');
    } else {
      rule.input.removeAttribute('aria-invalid');
    }
  }

  // Ek field check karo, error ho to dikhao. true = field sahi hai
  function validateField(rule) {
    const message = rule.check(rule.input.value);
    showFieldError(rule, message);
    return message === '';
  }

  function setStatus(text, isSuccess) {
    statusBox.textContent = text;
    statusBox.classList.toggle('is-success', Boolean(text) && isSuccess);
  }

  Object.keys(rules).forEach(function (key) {
    const rule = rules[key];

    // Field se bahar nikalte hi check karo
    rule.input.addEventListener('blur', function () {
      if (rule.input.value !== '') validateField(rule);
    });

    // Jis field me error dikh raha hai, typing ke saath turant update karo
    rule.input.addEventListener('input', function () {
      if (rule.input.closest('.field').classList.contains('has-error')) {
        validateField(rule);
      }
      setStatus('', false);
    });
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    setStatus('', false);

    let firstInvalid = null;
    Object.keys(rules).forEach(function (key) {
      const isValid = validateField(rules[key]);
      if (!isValid && !firstInvalid) {
        firstInvalid = rules[key].input;
      }
    });

    if (firstInvalid) {
      firstInvalid.focus(); // pehli galat field par cursor le jao
      return;
    }

    const name = rules.name.input.value.trim();
    const email = rules.email.input.value.trim();
    const message = rules.message.input.value.trim();

    const subject = encodeURIComponent('Portfolio message from ' + name);
    const body = encodeURIComponent(message + '\n\nFrom: ' + name + ' (' + email + ')');

    form.reset();
    Object.keys(rules).forEach(function (key) {
      showFieldError(rules[key], '');
    });

    setStatus(
      'Thank you, ' + name + '! Your email app is opening with the message ready. ' +
      'If nothing opens, write to ' + MY_EMAIL + '.',
      true
    );

    window.location.href = 'mailto:' + MY_EMAIL + '?subject=' + subject + '&body=' + body;
  });


  /* ---------------------------------------------------------
     FOOTER YEAR (apne aap current saal)
     --------------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();