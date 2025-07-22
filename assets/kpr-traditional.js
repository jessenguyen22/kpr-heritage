// assets/kpr-traditional.js

class KPRTraditional {
    constructor(container) {
      this.container = container;
      this.sectionId = container.dataset.sectionId;
      this.swiper = null;
      this.init();
    }
  
    init() {
      this.bindEvents();
      this.initSwiper();
      console.log('KPR Traditional initialized');
    }
  
    initSwiper() {
      // Wait for Swiper library to load
      if (typeof Swiper === 'undefined') {
        setTimeout(() => this.initSwiper(), 100);
        return;
      }
  
      const swiperContainer = this.container.querySelector('.kpr-products-slider');
      if (swiperContainer) {
        this.swiper = new Swiper(swiperContainer, {
          slidesPerView: 1,
          spaceBetween: 20,
          loop: true,
          autoplay: {
            delay: 5000,
            disableOnInteraction: false,
          },
          navigation: {
            nextEl: '.kpr-slider-next',
            prevEl: '.kpr-slider-prev',
          },
          pagination: {
            el: '.kpr-slider-pagination',
            clickable: true,
          },
          effect: 'slide',
          speed: 600,
        });
  
        console.log('Traditional Swiper initialized');
      }
    }
  
    bindEvents() {
      // Add to cart button events
      const addToCartButtons = this.container.querySelectorAll('.kpr-product__btn');
      addToCartButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
          this.handleAddToCart(e);
        });
      });
  
      // Handle resize for responsive behavior
      window.addEventListener('resize', () => {
        this.handleResize();
      });
    }
  
    handleAddToCart(event) {
      const button = event.target;
      const productId = button.dataset.productId;
      
      console.log('Add to cart clicked for product:', productId);
      
      // Add loading state
      button.textContent = 'ADDING...';
      button.disabled = true;
      
      // TODO: Implement actual add to cart functionality
      setTimeout(() => {
        button.textContent = 'ADD TO CART';
        button.disabled = false;
      }, 1000);
    }
  
    handleResize() {
      // Handle any resize-specific logic
      const isMobile = window.innerWidth <= 768;
      console.log('Traditional resize:', isMobile ? 'Mobile' : 'Desktop');
      
      // Update swiper if needed
      if (this.swiper) {
        this.swiper.update();
      }
    }
  
    // Method to be called when section becomes visible
    activate() {
      console.log('Traditional concept activated');
      
      // Start autoplay if swiper exists
      if (this.swiper && this.swiper.autoplay) {
        this.swiper.autoplay.start();
      }
    }
  
    // Method to be called when section becomes hidden  
    deactivate() {
      console.log('Traditional concept deactivated');
      
      // Stop autoplay if swiper exists
      if (this.swiper && this.swiper.autoplay) {
        this.swiper.autoplay.stop();
      }
    }
  
    // Cleanup method
    destroy() {
      if (this.swiper) {
        this.swiper.destroy(true, true);
      }
    }
  }
  
  // Initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', function() {
    const traditionalSections = document.querySelectorAll('[data-section-type="kpr-traditional"]');
    
    traditionalSections.forEach(section => {
      new KPRTraditional(section);
    });
  });
  
  // Handle section load in theme editor
  document.addEventListener('shopify:section:load', function(event) {
    if (event.detail.sectionId.includes('kpr_traditional')) {
      const section = event.target;
      new KPRTraditional(section);
    }
  });