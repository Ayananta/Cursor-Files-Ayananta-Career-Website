(function(){
  document.documentElement.classList.remove('no-js');

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav with improved functionality
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  if (menuToggle && navLinks){
    menuToggle.addEventListener('click', function(){
      const isOpen = navLinks.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      
      // Close menu when clicking outside
      if (isOpen) {
        document.addEventListener('click', closeMenuOnOutsideClick);
      } else {
        document.removeEventListener('click', closeMenuOnOutsideClick);
      }
    });
    
    // Close menu when clicking on nav links
    const navLinkItems = navLinks.querySelectorAll('a');
    navLinkItems.forEach(link => {
      link.addEventListener('click', function() {
        navLinks.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.removeEventListener('click', closeMenuOnOutsideClick);
      });
    });
    
    // Close menu on outside click
    function closeMenuOnOutsideClick(event) {
      if (!navLinks.contains(event.target) && !menuToggle.contains(event.target)) {
        navLinks.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.removeEventListener('click', closeMenuOnOutsideClick);
      }
    }
    
    // Close menu on escape key
    document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape' && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.removeEventListener('click', closeMenuOnOutsideClick);
      }
    });
  }

  // Accordions
  function setupAccordions(){
    const accordions = document.querySelectorAll('.accordion');
    accordions.forEach(function(btn){
      btn.addEventListener('click', function(){
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!expanded));
        const panel = btn.nextElementSibling;
        if (panel){
          panel.classList.toggle('open', !expanded);
        }
      });
    });
  }
  setupAccordions();

  // Theme toggle with prefers-color-scheme respect
  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;
  const storedTheme = localStorage.getItem('theme');
  if (storedTheme){
    root.setAttribute('data-theme', storedTheme);
  } else {
    const isMobileViewport = window.matchMedia && window.matchMedia('(max-width: 768px)').matches;
    if (isMobileViewport){
      root.setAttribute('data-theme', 'dark');
    } else {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    }
  }
  if (themeToggle){
    themeToggle.addEventListener('click', function(){
      const current = root.getAttribute('data-theme') || 'light';
      const next = current === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });
  }

  // Contact form (client-only demo)
  const form = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  if (form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      if (!form.reportValidity()) return;
      formStatus.textContent = 'Thanks. Your message has been noted.';
      form.reset();
    });
  }

  // Lazy-load non-critical images (already using loading=lazy where applicable)
  const imgs = document.querySelectorAll('img[loading="lazy"]');
  if ('IntersectionObserver' in window){
    const io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting){
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          io.unobserve(img);
        }
      });
    });
    imgs.forEach(function(img){ io.observe(img); });
  }

  // Analytics opt-in example (disabled by default)
  if (window.__analyticsOptIn){
    // Example: Plausible
    var s = document.createElement('script');
    s.defer = true;
    s.setAttribute('data-domain','example.com');
    s.src = 'https://plausible.io/js/plausible.js';
    document.head.appendChild(s);
  }
  
  // Mobile-specific improvements
  function handleMobileOptimizations() {
    // Close mobile menu on orientation change
    if (window.innerWidth > 768 && navLinks && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      if (menuToggle) {
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    }
    
    // Adjust tooltip positioning on resize
    window.addEventListener('resize', function() {
      // Close any open tooltips on resize
      const tooltips = document.querySelectorAll('.tool-tooltip, .artifact-tooltip');
      tooltips.forEach(tooltip => {
        tooltip.style.display = 'none';
      });
    });
  }
  
  // Run on load and orientation change
  handleMobileOptimizations();
  window.addEventListener('orientationchange', function() {
    setTimeout(handleMobileOptimizations, 100);
  });
  window.addEventListener('resize', handleMobileOptimizations);

  // Scroll to top functionality
  const scrollToTopBtn = document.getElementById('scrollToTop');
  if (scrollToTopBtn) {
    // Show/hide button based on scroll position
    function toggleScrollToTop() {
      if (window.pageYOffset > 300) {
        scrollToTopBtn.classList.add('visible');
      } else {
        scrollToTopBtn.classList.remove('visible');
      }
    }

    // Scroll to top when button is clicked
    scrollToTopBtn.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    // Listen for scroll events
    window.addEventListener('scroll', toggleScrollToTop);
    
    // Initial check
    toggleScrollToTop();
  }
})();


