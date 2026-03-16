/* ============================================================
   VisualSkill - Main JavaScript
   ============================================================ */

(function () {
  'use strict';

  /* ── Utility ─────────────────────────────────────────────── */
  function $(selector, context) {
    return (context || document).querySelector(selector);
  }

  function $$(selector, context) {
    return Array.from((context || document).querySelectorAll(selector));
  }

  /* ============================================================
     1. ACTIVE NAV LINK
     ============================================================ */
  function initActiveNav() {
    var currentPath = window.location.pathname;
    var filename = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'index.html';

    $$('.nav-link').forEach(function (link) {
      var href = link.getAttribute('href');
      if (!href) return;
      var linkFile = href.substring(href.lastIndexOf('/') + 1);
      if (
        linkFile === filename ||
        (filename === '' && linkFile === 'index.html') ||
        (filename === 'index.html' && linkFile === 'index.html')
      ) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  /* ============================================================
     2. MOBILE MENU TOGGLE
     ============================================================ */
  function initMobileMenu() {
    var btn = $('.hamburger-btn');
    var nav = $('#main-nav');
    if (!btn || !nav) return;

    btn.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('open');
      btn.classList.toggle('open', isOpen);
      btn.setAttribute('aria-expanded', String(isOpen));
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!btn.contains(e.target) && !nav.contains(e.target)) {
        nav.classList.remove('open');
        btn.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on nav link click
    $$('.nav-link').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        btn.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ============================================================
     3. FAQ ACCORDION
     ============================================================ */
  function initFaqAccordion() {
    $$('.faq-item').forEach(function (item) {
      var question = item.querySelector('.faq-question');
      if (!question) return;

      question.addEventListener('click', function () {
        var isOpen = item.classList.contains('open');

        // Close all
        $$('.faq-item').forEach(function (other) {
          other.classList.remove('open');
          var q = other.querySelector('.faq-question');
          if (q) q.setAttribute('aria-expanded', 'false');
        });

        // Toggle current
        if (!isOpen) {
          item.classList.add('open');
          question.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /* ============================================================
     4. COURSE SEARCH & FILTER
     ============================================================ */
  function initCourseFilter() {
    var searchInput = $('#course-search');
    var filterBtns = $$('.filter-btn');
    var courseCards = $$('.course-card');
    var countEl = $('#courses-visible-count');
    var noResults = $('#no-results');

    if (!searchInput && filterBtns.length === 0) return;

    var activeCategory = 'all';

    function normalizeStr(str) {
      var result = '';
      for (var i = 0; i < str.length; i++) {
        result += str[i].toLowerCase();
      }
      return result;
    }

    function filterCourses() {
      var query = searchInput ? normalizeStr(searchInput.value.trim()) : '';
      var visible = 0;

      courseCards.forEach(function (card) {
        var titleEl = card.querySelector('.course-title');
        var title = titleEl ? normalizeStr(titleEl.textContent.trim()) : '';
        var category = card.getAttribute('data-category') || 'all';

        var matchesSearch = query === '' || title.indexOf(query) !== -1;
        var matchesCategory = activeCategory === 'all' || category === activeCategory;

        if (matchesSearch && matchesCategory) {
          card.classList.remove('hidden');
          visible++;
        } else {
          card.classList.add('hidden');
        }
      });

      if (countEl) countEl.textContent = visible;

      if (noResults) {
        if (visible === 0) {
          noResults.classList.remove('no-results-hidden');
        } else {
          noResults.classList.add('no-results-hidden');
        }
      }
    }

    if (searchInput) {
      searchInput.addEventListener('input', filterCourses);
    }

    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        activeCategory = btn.getAttribute('data-filter') || 'all';
        filterCourses();
      });
    });

    // Init count
    filterCourses();
  }

  /* ============================================================
     5. FORM VALIDATION (NO REGEX)
     ============================================================ */
  function initFormValidation() {
    var form = $('#register-form');
    if (!form) return;

    /* ── Helpers ── */
    function showError(fieldId, msg) {
      var input = $('#' + fieldId);
      var errEl = $('#' + fieldId + '-error');
      if (input) {
        input.classList.add('input-error');
        input.classList.remove('input-success');
      }
      if (errEl) {
        errEl.textContent = msg;
        errEl.classList.add('show');
      }
      return false;
    }

    function showSuccess(fieldId) {
      var input = $('#' + fieldId);
      var errEl = $('#' + fieldId + '-error');
      if (input) {
        input.classList.remove('input-error');
        input.classList.add('input-success');
      }
      if (errEl) {
        errEl.classList.remove('show');
      }
      return true;
    }

    function clearField(fieldId) {
      var input = $('#' + fieldId);
      var errEl = $('#' + fieldId + '-error');
      if (input) {
        input.classList.remove('input-error', 'input-success');
      }
      if (errEl) {
        errEl.classList.remove('show');
      }
    }

    /* ── Validation 1: Email ── */
    function validateEmail() {
      var val = $('#reg-email') ? $('#reg-email').value.trim() : '';
      if (val === '') return showError('reg-email', 'Email address is required.');

      var hasAt = false;
      var hasDotAfterAt = false;
      var atIndex = -1;

      for (var i = 0; i < val.length; i++) {
        if (val[i] === '@') {
          if (hasAt) return showError('reg-email', 'Email address is invalid.');
          hasAt = true;
          atIndex = i;
        }
      }

      if (!hasAt) return showError('reg-email', 'Email must contain "@".');
      if (atIndex === 0) return showError('reg-email', 'Email must have characters before "@".');
      if (atIndex === val.length - 1) return showError('reg-email', 'Email must have a domain after "@".');

      var domain = val.substring(atIndex + 1);
      for (var j = 0; j < domain.length; j++) {
        if (domain[j] === '.') {
          hasDotAfterAt = true;
          break;
        }
      }

      if (!hasDotAfterAt) return showError('reg-email', 'Email domain must contain a ".".');

      var lastDotPos = domain.lastIndexOf('.');
      if (lastDotPos === 0 || lastDotPos === domain.length - 1) {
        return showError('reg-email', 'Email address is invalid.');
      }

      return showSuccess('reg-email');
    }

    /* ── Validation 2: Username ── */
    function validateUsername() {
      var val = $('#reg-username') ? $('#reg-username').value.trim() : '';
      if (val === '') return showError('reg-username', 'Username is required.');
      if (val.length < 3) return showError('reg-username', 'Username must be at least 3 characters.');
      if (val.length > 30) return showError('reg-username', 'Username must be at most 30 characters.');

      var allowed = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_';
      for (var i = 0; i < val.length; i++) {
        if (allowed.indexOf(val[i]) === -1) {
          return showError('reg-username', 'Username may only contain letters, numbers, and underscores.');
        }
      }
      return showSuccess('reg-username');
    }

    /* ── Validation 3: Date of Birth (18+) ── */
    function validateDob() {
      var val = $('#reg-dob') ? $('#reg-dob').value : '';
      if (val === '') return showError('reg-dob', 'Date of birth is required.');

      var dob = new Date(val);
      var today = new Date();
      var eighteenYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());

      if (dob > today) return showError('reg-dob', 'Date of birth cannot be in the future.');
      if (dob > eighteenYearsAgo) return showError('reg-dob', 'You must be at least 18 years old to register.');

      return showSuccess('reg-dob');
    }

    /* ── Validation 4: Gender ── */
    function validateGender() {
      var radios = $$('input[name="gender"]');
      var selected = false;
      radios.forEach(function (r) { if (r.checked) selected = true; });
      var errEl = $('#gender-error');
      if (!selected) {
        if (errEl) { errEl.textContent = 'Please select a gender option.'; errEl.classList.add('show'); }
        return false;
      }
      if (errEl) errEl.classList.remove('show');
      return true;
    }

    /* ── Validation 5a: Password ── */
    function validatePassword() {
      var val = $('#reg-password') ? $('#reg-password').value : '';
      if (val === '') return showError('reg-password', 'Password is required.');
      if (val.length < 8) return showError('reg-password', 'Password must be at least 8 characters.');

      var hasUpper = false;
      var hasNumber = false;
      var upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      var numberChars = '0123456789';

      for (var i = 0; i < val.length; i++) {
        if (upperChars.indexOf(val[i]) !== -1) hasUpper = true;
        if (numberChars.indexOf(val[i]) !== -1) hasNumber = true;
      }

      if (!hasUpper) return showError('reg-password', 'Password must contain at least one uppercase letter.');
      if (!hasNumber) return showError('reg-password', 'Password must contain at least one number.');

      return showSuccess('reg-password');
    }

    /* ── Validation 5b: Confirm Password ── */
    function validateConfirmPassword() {
      var pass = $('#reg-password') ? $('#reg-password').value : '';
      var confirm = $('#reg-confirm-password') ? $('#reg-confirm-password').value : '';
      if (confirm === '') return showError('reg-confirm-password', 'Please confirm your password.');
      if (pass !== confirm) return showError('reg-confirm-password', 'Passwords do not match.');
      return showSuccess('reg-confirm-password');
    }

    /* ── Validation 6: Terms ── */
    function validateTerms() {
      var checkbox = $('#reg-terms');
      var errEl = $('#terms-error');
      if (!checkbox || !checkbox.checked) {
        if (errEl) { errEl.textContent = 'You must accept the Terms & Conditions to register.'; errEl.classList.add('show'); }
        return false;
      }
      if (errEl) errEl.classList.remove('show');
      return true;
    }

    /* ── Password Strength ── */
    function updatePasswordStrength(val) {
      var container = $('#password-strength');
      if (!container) return;

      if (val === '') {
        container.className = 'password-strength';
        var fill = container.querySelector('.strength-fill');
        var text = container.querySelector('.strength-text');
        if (fill) fill.style.cssText = '';
        if (text) text.textContent = '';
        return;
      }

      var upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      var numberChars = '0123456789';
      var specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

      var hasUpper = false;
      var hasNumber = false;
      var hasSpecial = false;

      for (var i = 0; i < val.length; i++) {
        if (upperChars.indexOf(val[i]) !== -1) hasUpper = true;
        if (numberChars.indexOf(val[i]) !== -1) hasNumber = true;
        if (specialChars.indexOf(val[i]) !== -1) hasSpecial = true;
      }

      var score = 0;
      if (val.length >= 8) score++;
      if (hasUpper) score++;
      if (hasNumber) score++;
      if (hasSpecial) score++;
      if (val.length >= 12) score++;

      var textEl = container.querySelector('.strength-text');
      if (score <= 2) {
        container.className = 'password-strength strength-weak';
        if (textEl) textEl.textContent = 'Weak';
      } else if (score <= 3) {
        container.className = 'password-strength strength-medium';
        if (textEl) textEl.textContent = 'Medium';
      } else {
        container.className = 'password-strength strength-strong';
        if (textEl) textEl.textContent = 'Strong';
      }
    }

    /* ── Live Validation on Blur ── */
    var emailInput = $('#reg-email');
    var usernameInput = $('#reg-username');
    var dobInput = $('#reg-dob');
    var passwordInput = $('#reg-password');
    var confirmInput = $('#reg-confirm-password');

    if (emailInput) {
      emailInput.addEventListener('blur', validateEmail);
      emailInput.addEventListener('input', function () { if (this.classList.contains('input-error')) validateEmail(); });
    }
    if (usernameInput) {
      usernameInput.addEventListener('blur', validateUsername);
      usernameInput.addEventListener('input', function () { if (this.classList.contains('input-error')) validateUsername(); });
    }
    if (dobInput) {
      dobInput.addEventListener('blur', validateDob);
      dobInput.addEventListener('change', validateDob);
    }
    if (passwordInput) {
      passwordInput.addEventListener('input', function () {
        updatePasswordStrength(this.value);
        if (this.classList.contains('input-error')) validatePassword();
        if (confirmInput && confirmInput.value !== '') validateConfirmPassword();
      });
      passwordInput.addEventListener('blur', validatePassword);
    }
    if (confirmInput) {
      confirmInput.addEventListener('blur', validateConfirmPassword);
      confirmInput.addEventListener('input', function () { if (this.classList.contains('input-error')) validateConfirmPassword(); });
    }

    /* ── Form Submit ── */
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var v1 = validateEmail();
      var v2 = validateUsername();
      var v3 = validateDob();
      var v4 = validateGender();
      var v5 = validatePassword();
      var v6 = validateConfirmPassword();
      var v7 = validateTerms();

      if (v1 && v2 && v3 && v4 && v5 && v6 && v7) {
        var formEl = $('#register-form');
        var successEl = $('#form-success');
        if (formEl) formEl.classList.add('visually-hidden');
        if (successEl) successEl.classList.add('show');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  /* ============================================================
     6. SCROLL ANIMATIONS
     ============================================================ */
  function initScrollAnimations() {
    var elements = $$('.animate-on-scroll');
    if (elements.length === 0) return;

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
      );

      elements.forEach(function (el) { observer.observe(el); });
    } else {
      // Fallback: show all
      elements.forEach(function (el) { el.classList.add('visible'); });
    }
  }

  /* ============================================================
     INIT
     ============================================================ */
  document.addEventListener('DOMContentLoaded', function () {
    initActiveNav();
    initMobileMenu();
    initFaqAccordion();
    initCourseFilter();
    initFormValidation();
    initScrollAnimations();
  });
})();
