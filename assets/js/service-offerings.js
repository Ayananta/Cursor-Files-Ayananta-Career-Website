// Service Offering Modals functionality
(function() {
  'use strict';
  
  function initServiceOfferingModals() {
    // Map card IDs to modal IDs
    const modalMap = {
      'info-arch-service-card': 'infoArchServiceModal',
      'technical-content-card': 'technicalContentModal',
      'api-doc-service-card': 'apiDocServiceModal',
      'ai-native-doc-card': 'aiNativeDocModal'
    };
    
    // Use event delegation on the cards container
    const cardsContainer = document.querySelector('#projects .cards');
    if (!cardsContainer) {
      console.warn('Cards container not found');
      return;
    }
    
    // Handle clicks on service offering cards
    cardsContainer.addEventListener('click', function(e) {
      // Find the clicked card
      const card = e.target.closest('.service-offering-card');
      if (!card) return;
      
      // Don't open modal if clicking on a link or button
      if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.closest('a, button')) {
        return;
      }
      
      const cardId = card.id;
      const modalId = modalMap[cardId];
      
      if (!modalId) return;
      
      const modal = document.getElementById(modalId);
      if (!modal) {
        console.warn('Modal not found:', modalId);
        return;
      }
      
      e.preventDefault();
      e.stopPropagation();
      
      // Open the modal
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      
      const modalClose = modal.querySelector('.modal-close');
      if (modalClose) {
        setTimeout(() => modalClose.focus(), 100);
      }
    });
    
    // Handle keyboard navigation
    cardsContainer.addEventListener('keydown', function(e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      
      const card = e.target.closest('.service-offering-card');
      if (!card) return;
      
      const cardId = card.id;
      const modalId = modalMap[cardId];
      
      if (!modalId) return;
      
      const modal = document.getElementById(modalId);
      if (!modal) return;
      
      e.preventDefault();
      e.stopPropagation();
      
      // Open the modal
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      
      const modalClose = modal.querySelector('.modal-close');
      if (modalClose) {
        setTimeout(() => modalClose.focus(), 100);
      }
    });
    
    // Setup close handlers for all modals
    Object.values(modalMap).forEach(function(modalId) {
      const modal = document.getElementById(modalId);
      if (!modal) return;
      
      const modalOverlay = modal.querySelector('.modal-overlay');
      const modalClose = modal.querySelector('.modal-close');
      const modalContent = modal.querySelector('.modal-content');
      
      function closeModal() {
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
      
      // Close button
      if (modalClose) {
        modalClose.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          closeModal();
        });
      }
      
      // Overlay click
      if (modal) {
        modal.addEventListener('click', function(e) {
          if (e.target === modal || e.target === modalOverlay) {
            closeModal();
          }
        });
      }
      
      // Prevent content clicks from closing
      if (modalContent) {
        modalContent.addEventListener('click', function(e) {
          e.stopPropagation();
        });
      }
    });
    
    // Handle Escape key to close any open modal
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        Object.values(modalMap).forEach(function(modalId) {
          const modal = document.getElementById(modalId);
          if (modal && modal.getAttribute('aria-hidden') === 'false') {
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
          }
        });
      }
    });
    
    console.log('Service offering modals initialized');
  }
  
  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initServiceOfferingModals);
  } else {
    initServiceOfferingModals();
  }
})();
