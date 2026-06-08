/* ============================================
   THE WEBSITE MAKERS — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {

  // ============================================
  // MOBILE NAV TOGGLE
  // ============================================
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mainNav = document.querySelector('.main-nav');
  
  if (mobileToggle && mainNav) {
    mobileToggle.addEventListener('click', function() {
      mainNav.classList.toggle('active');
      this.classList.toggle('active');
    });
  }

  // ============================================
  // DROPDOWN TOGGLE (Mobile)
  // ============================================
  document.querySelectorAll('.main-nav > li > a').forEach(link => {
    link.addEventListener('click', function(e) {
      if (window.innerWidth <= 768) {
        const dropdown = this.nextElementSibling;
        if (dropdown && dropdown.classList.contains('dropdown-menu')) {
          e.preventDefault();
          dropdown.classList.toggle('active');
        }
      }
    });
  });

  // ============================================
  // STICKY HEADER SCROLL EFFECT
  // ============================================
  const header = document.querySelector('.site-header');
  if (header) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
        header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.12)';
      } else {
        header.classList.remove('scrolled');
        header.style.boxShadow = '0 2px 10px rgba(0,0,0,0.08)';
      }
    });
  }

  // ============================================
  // SCROLL ANIMATIONS (IntersectionObserver)
  // ============================================
  window.addEventListener('load', function() {
    // Force reflow to ensure CSS is parsed
    document.body.offsetHeight;

    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.animate-on-scroll, .animate-left, .animate-right, .animate-scale').forEach(function(el) {
      observer.observe(el);
    });
  });

  // ============================================
  // COUNTER ANIMATION
  // ============================================
  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'));
    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';
    const duration = 2000;
    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (target - start) * easeOut);
      el.textContent = prefix + current.toLocaleString() + suffix;
      
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    requestAnimationFrame(update);
  }

  // Observe counters
  const counterObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        const counters = entry.target.querySelectorAll('[data-target]');
        counters.forEach(function(counter) {
          animateCounter(counter);
        });
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.stats-grid, .counter-section').forEach(function(el) {
    counterObserver.observe(el);
  });

  // ============================================
  // IMAGE CAROUSEL (Horizontal scroll)
  // ============================================
  document.querySelectorAll('.portfolio-carousel-track').forEach(track => {
    const prevBtn = track.parentElement.querySelector('.carousel-prev');
    const nextBtn = track.parentElement.querySelector('.carousel-next');
    
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        track.scrollBy({ left: -300, behavior: 'smooth' });
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        track.scrollBy({ left: 300, behavior: 'smooth' });
      });
    }
  });

  // ============================================
  // BRANDS CAROUSEL AUTO-SCROLL
  // ============================================
  const brandsTrack = document.querySelector('.brands-track');
  if (brandsTrack) {
    // Clone items for infinite scroll
    const items = brandsTrack.innerHTML;
    brandsTrack.innerHTML = items + items;
  }

  // ============================================
  // ENQUIRY POPUP
  // ============================================
  const enquiryPopup = document.getElementById('enquiry-popup');
  const enquiryTriggers = document.querySelectorAll('[data-enquiry]');
  const enquiryClose = document.querySelector('.enquiry-popup-close');

  enquiryTriggers.forEach(trigger => {
    trigger.addEventListener('click', function(e) {
      e.preventDefault();
      if (enquiryPopup) enquiryPopup.classList.add('active');
    });
  });

  if (enquiryClose) {
    enquiryClose.addEventListener('click', function() {
      if (enquiryPopup) enquiryPopup.classList.remove('active');
    });
  }

  if (enquiryPopup) {
    enquiryPopup.addEventListener('click', function(e) {
      if (e.target === enquiryPopup) {
        enquiryPopup.classList.remove('active');
      }
    });
  }

  // ============================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '#!') return;
      
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerHeight = document.querySelector('.site-header')?.offsetHeight || 80;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        
        // Close mobile nav
        if (mainNav) mainNav.classList.remove('active');
      }
    });
  });

  // ============================================
  // BACK TO TOP
  // ============================================
  const backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 500) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    });
    backToTop.addEventListener('click', function() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ============================================
  // PORTFOLIO CAROUSEL SWIPE
  // ============================================
  document.querySelectorAll('.portfolio-card-carousel').forEach(carousel => {
    let startX, scrollLeft;
    let isDown = false;

    carousel.addEventListener('mousedown', (e) => {
      isDown = true;
      startX = e.pageX - carousel.offsetLeft;
      scrollLeft = carousel.scrollLeft;
    });
    carousel.addEventListener('mouseleave', () => isDown = false);
    carousel.addEventListener('mouseup', () => isDown = false);
    carousel.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - carousel.offsetLeft;
      const walk = (x - startX) * 2;
      carousel.scrollLeft = scrollLeft - walk;
    });
  });

  // ============================================
  // FORM VALIDATION
  // ============================================
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(e) {
      const requiredFields = form.querySelectorAll('[required]');
      let valid = true;
      
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          valid = false;
          field.style.borderColor = '#e91e8c';
          field.addEventListener('input', function() {
            this.style.borderColor = '';
          }, { once: true });
        }
      });

      if (!valid) {
        e.preventDefault();
        alert('Please fill in all required fields.');
      }
    });
  });

  // ============================================
  // PAGE LOAD ANIMATIONS
  // ============================================
  document.body.classList.add('loaded');

});
