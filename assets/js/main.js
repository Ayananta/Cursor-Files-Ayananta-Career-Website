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

  // Information Architecture Modal functionality
  const infoArchCard = document.getElementById('info-arch-card');
  const infoArchModal = document.getElementById('infoArchModal');
  const modalOverlay = infoArchModal?.querySelector('.modal-overlay');
  const modalClose = infoArchModal?.querySelector('.modal-close');

  function openModal() {
    if (infoArchModal) {
      infoArchModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
      // Focus the close button for accessibility
      if (modalClose) {
        setTimeout(() => modalClose.focus(), 100);
      }
    }
  }

  function closeModal() {
    if (infoArchModal) {
      infoArchModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = ''; // Restore scrolling
      // Return focus to the card
      if (infoArchCard) {
        infoArchCard.focus();
      }
    }
  }

  // Open modal when clicking the Information Architecture card
  if (infoArchCard) {
    infoArchCard.addEventListener('click', function(e) {
      e.preventDefault();
      openModal();
    });

    // Support keyboard navigation (Enter and Space)
    infoArchCard.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal();
      }
    });
  }

  // Close modal when clicking the close button
  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  // Close modal when clicking the overlay or modal background
  if (infoArchModal) {
    infoArchModal.addEventListener('click', function(e) {
      // Only close if clicking directly on the modal container (not on modal-content)
      if (e.target === infoArchModal || e.target === modalOverlay) {
        closeModal();
      }
    });
  }

  // Prevent modal content clicks from closing the modal
  if (infoArchModal) {
    const modalContent = infoArchModal.querySelector('.modal-content');
    if (modalContent) {
      modalContent.addEventListener('click', function(e) {
        e.stopPropagation();
      });
    }
  }

  // Content Strategy Modal functionality
  const contentStrategyCard = document.getElementById('content-strategy-card');
  const contentStrategyModal = document.getElementById('contentStrategyModal');
  const contentStrategyModalOverlay = contentStrategyModal?.querySelector('.modal-overlay');
  const contentStrategyModalClose = contentStrategyModal?.querySelector('.modal-close');

  function openContentStrategyModal() {
    if (contentStrategyModal) {
      contentStrategyModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
      // Focus the close button for accessibility
      if (contentStrategyModalClose) {
        setTimeout(() => contentStrategyModalClose.focus(), 100);
      }
    }
  }

  function closeContentStrategyModal() {
    if (contentStrategyModal) {
      contentStrategyModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = ''; // Restore scrolling
      // Return focus to the card
      if (contentStrategyCard) {
        contentStrategyCard.focus();
      }
    }
  }

  // Open modal when clicking the Content Strategy card
  if (contentStrategyCard) {
    contentStrategyCard.addEventListener('click', function(e) {
      e.preventDefault();
      openContentStrategyModal();
    });

    // Support keyboard navigation (Enter and Space)
    contentStrategyCard.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openContentStrategyModal();
      }
    });
  }

  // Close modal when clicking the close button
  if (contentStrategyModalClose) {
    contentStrategyModalClose.addEventListener('click', closeContentStrategyModal);
  }

  // Close modal when clicking the overlay or modal background
  if (contentStrategyModal) {
    contentStrategyModal.addEventListener('click', function(e) {
      // Only close if clicking directly on the modal container (not on modal-content)
      if (e.target === contentStrategyModal || e.target === contentStrategyModalOverlay) {
        closeContentStrategyModal();
      }
    });
  }

  // Prevent modal content clicks from closing the modal
  if (contentStrategyModal) {
    const contentStrategyModalContent = contentStrategyModal.querySelector('.modal-content');
    if (contentStrategyModalContent) {
      contentStrategyModalContent.addEventListener('click', function(e) {
        e.stopPropagation();
      });
    }
  }

  // AI-Powered Technical Writing Modal functionality
  const aiPoweredCard = document.getElementById('ai-powered-card');
  const aiPoweredModal = document.getElementById('aiPoweredModal');
  const aiPoweredModalOverlay = aiPoweredModal?.querySelector('.modal-overlay');
  const aiPoweredModalClose = aiPoweredModal?.querySelector('.modal-close');

  function openAiPoweredModal() {
    if (aiPoweredModal) {
      aiPoweredModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (aiPoweredModalClose) {
        setTimeout(() => aiPoweredModalClose.focus(), 100);
      }
    }
  }

  function closeAiPoweredModal() {
    if (aiPoweredModal) {
      aiPoweredModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (aiPoweredCard) {
        aiPoweredCard.focus();
      }
    }
  }

  if (aiPoweredCard) {
    aiPoweredCard.addEventListener('click', function(e) {
      e.preventDefault();
      openAiPoweredModal();
    });

    aiPoweredCard.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openAiPoweredModal();
      }
    });
  }

  if (aiPoweredModalClose) {
    aiPoweredModalClose.addEventListener('click', closeAiPoweredModal);
  }

  if (aiPoweredModal) {
    aiPoweredModal.addEventListener('click', function(e) {
      if (e.target === aiPoweredModal || e.target === aiPoweredModalOverlay) {
        closeAiPoweredModal();
      }
    });

    const aiPoweredModalContent = aiPoweredModal.querySelector('.modal-content');
    if (aiPoweredModalContent) {
      aiPoweredModalContent.addEventListener('click', function(e) {
        e.stopPropagation();
      });
    }
  }

  // Modern Technical Writing (UX Writing) Modal functionality
  const modernTechWritingCard = document.getElementById('modern-tech-writing-card');
  const modernTechWritingModal = document.getElementById('modernTechWritingModal');
  const modernTechWritingModalOverlay = modernTechWritingModal?.querySelector('.modal-overlay');
  const modernTechWritingModalClose = modernTechWritingModal?.querySelector('.modal-close');

  function openModernTechWritingModal() {
    if (modernTechWritingModal) {
      modernTechWritingModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (modernTechWritingModalClose) {
        setTimeout(() => modernTechWritingModalClose.focus(), 100);
      }
    }
  }

  function closeModernTechWritingModal() {
    if (modernTechWritingModal) {
      modernTechWritingModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (modernTechWritingCard) {
        modernTechWritingCard.focus();
      }
    }
  }

  if (modernTechWritingCard) {
    modernTechWritingCard.addEventListener('click', function(e) {
      e.preventDefault();
      openModernTechWritingModal();
    });

    modernTechWritingCard.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModernTechWritingModal();
      }
    });
  }

  if (modernTechWritingModalClose) {
    modernTechWritingModalClose.addEventListener('click', closeModernTechWritingModal);
  }

  if (modernTechWritingModal) {
    modernTechWritingModal.addEventListener('click', function(e) {
      if (e.target === modernTechWritingModal || e.target === modernTechWritingModalOverlay) {
        closeModernTechWritingModal();
      }
    });

    const modernTechWritingModalContent = modernTechWritingModal.querySelector('.modal-content');
    if (modernTechWritingModalContent) {
      modernTechWritingModalContent.addEventListener('click', function(e) {
        e.stopPropagation();
      });
    }
  }

  // Generic Skill Image Modal functionality (for all skill card images)
  const skillImageModal = document.getElementById('skillImageModal');
  const skillImageModalOverlay = skillImageModal?.querySelector('.modal-overlay');
  const skillImageModalClose = skillImageModal?.querySelector('.modal-close');
  const skillImageModalImg = document.getElementById('skillImageModalImg');

  function openSkillImageModal(img) {
    if (!skillImageModal || !skillImageModalImg) return;
    const src = img.getAttribute('src');
    const alt = img.getAttribute('alt') || 'Skill diagram';

    skillImageModalImg.src = src || '';
    skillImageModalImg.alt = alt;

    const titleEl = document.getElementById('skillImage-modal-title');
    if (titleEl) {
      titleEl.textContent = alt || 'Skill Diagram';
    }

    skillImageModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    if (skillImageModalClose) {
      setTimeout(() => skillImageModalClose.focus(), 100);
    }•	Optimized SAP Business ByDesign content to enable 11% reuse across the documentation set, implementing technical enforcement mechanisms to prevent structural irregularities
  }

  function closeSkillImageModal() {
    if (!skillImageModal) return;
    skillImageModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (skillImageModal) {
    const skillImages = document.querySelectorAll('.skill-card-image');

    skillImages.forEach(img => {
      if (!img.hasAttribute('tabindex')) {
        img.setAttribute('tabindex', '0');
      }
      img.setAttribute('role', 'button');
      img.setAttribute('aria-label', img.getAttribute('alt') || 'View larger diagram');

      img.addEventListener('click', function(e) {
        e.stopPropagation();
        openSkillImageModal(img);
      });

      img.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          e.stopPropagation();
          openSkillImageModal(img);
        }
      });
    });

    if (skillImageModalClose) {
      skillImageModalClose.addEventListener('click', closeSkillImageModal);
    }

    skillImageModal.addEventListener('click', function(e) {
      if (e.target === skillImageModal || e.target === skillImageModalOverlay) {
        closeSkillImageModal();
      }
    });

    const skillImageModalContent = skillImageModal.querySelector('.modal-content');
    if (skillImageModalContent) {
      skillImageModalContent.addEventListener('click', function(e) {
        e.stopPropagation();
      });
    }
  }

  // Service Offering Modals functionality - wait for DOM to be ready
  let infoArchService, technicalContent, apiDocService, aiNativeDoc;
  
  function initServiceOfferingModals() {
    const infoArchServiceCard = document.getElementById('info-arch-service-card');
    const infoArchServiceModal = document.getElementById('infoArchServiceModal');
    const technicalContentCard = document.getElementById('technical-content-card');
    const technicalContentModal = document.getElementById('technicalContentModal');
    const apiDocServiceCard = document.getElementById('api-doc-service-card');
    const apiDocServiceModal = document.getElementById('apiDocServiceModal');
    const aiNativeDocCard = document.getElementById('ai-native-doc-card');
    const aiNativeDocModal = document.getElementById('aiNativeDocModal');

    // Generic function to handle service offering modals
    function setupServiceOfferingModal(card, modal) {
      if (!card || !modal) {
        console.warn('Card or modal not found:', card ? 'card found' : 'card missing', modal ? 'modal found' : 'modal missing');
        return null;
      }
      
      const modalOverlay = modal.querySelector('.modal-overlay');
      const modalClose = modal.querySelector('.modal-close');
      
      function openModal() {
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        if (modalClose) {
          setTimeout(() => modalClose.focus(), 100);
        }
      }
      
      function closeModal() {
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (card) {
          card.focus();
        }
      }
      
      // Open modal on card click (handle clicks anywhere on the card including child elements)
      card.addEventListener('click', function(e) {
        // Allow clicks on links or buttons within the card to work normally
        const clickedLink = e.target.closest('a, button');
        if (clickedLink && clickedLink !== card) {
          return;
        }
        console.log('Card clicked:', card.id, 'Target:', e.target.tagName);
        e.preventDefault();
        e.stopPropagation();
        openModal();
      }, false);
      
      // Support keyboard navigation
      card.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          e.stopPropagation();
          openModal();
        }
      });
      
      // Close modal on close button click
      if (modalClose) {
        modalClose.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          closeModal();
        });
      }
      
      // Close modal on overlay click
      if (modal) {
        modal.addEventListener('click', function(e) {
          if (e.target === modal || e.target === modalOverlay) {
            closeModal();
          }
        });
      }
      
      // Prevent modal content clicks from closing
      const modalContent = modal.querySelector('.modal-content');
      if (modalContent) {
        modalContent.addEventListener('click', function(e) {
          e.stopPropagation();
        });
      }
      
      return { openModal: openModal, closeModal: closeModal };
    }
    
    // Setup all service offering modals
    infoArchService = setupServiceOfferingModal(infoArchServiceCard, infoArchServiceModal);
    technicalContent = setupServiceOfferingModal(technicalContentCard, technicalContentModal);
    apiDocService = setupServiceOfferingModal(apiDocServiceCard, apiDocServiceModal);
    aiNativeDoc = setupServiceOfferingModal(aiNativeDocCard, aiNativeDocModal);
    
    // Debug: Log if modals were set up
    console.log('Service offering modals initialized:', {
      infoArch: !!infoArchService,
      technicalContent: !!technicalContent,
      apiDoc: !!apiDocService,
      aiNative: !!aiNativeDoc
    });
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initServiceOfferingModals);
  } else {
    // DOM already ready, initialize immediately
    setTimeout(initServiceOfferingModals, 0);
  }

  // Close modal when pressing Escape key (handle all modals)
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      const aiNativeDocModal = document.getElementById('aiNativeDocModal');
      const apiDocServiceModal = document.getElementById('apiDocServiceModal');
      const technicalContentModal = document.getElementById('technicalContentModal');
      const infoArchServiceModal = document.getElementById('infoArchServiceModal');
      
      if (aiNativeDocModal && aiNativeDocModal.getAttribute('aria-hidden') === 'false' && aiNativeDoc) {
        aiNativeDoc.closeModal();
      } else if (apiDocServiceModal && apiDocServiceModal.getAttribute('aria-hidden') === 'false' && apiDocService) {
        apiDocService.closeModal();
      } else if (technicalContentModal && technicalContentModal.getAttribute('aria-hidden') === 'false' && technicalContent) {
        technicalContent.closeModal();
      } else if (infoArchServiceModal && infoArchServiceModal.getAttribute('aria-hidden') === 'false' && infoArchService) {
        infoArchService.closeModal();
      } else if (skillImageModal && skillImageModal.getAttribute('aria-hidden') === 'false') {
        closeSkillImageModal();
      } else if (modernTechWritingModal && modernTechWritingModal.getAttribute('aria-hidden') === 'false') {
        closeModernTechWritingModal();
      } else if (aiPoweredModal && aiPoweredModal.getAttribute('aria-hidden') === 'false') {
        closeAiPoweredModal();
      } else if (contentStrategyModal && contentStrategyModal.getAttribute('aria-hidden') === 'false') {
        closeContentStrategyModal();
      } else if (infoArchModal && infoArchModal.getAttribute('aria-hidden') === 'false') {
        closeModal();
      }
    }
  });
})();


