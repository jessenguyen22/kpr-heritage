// assets/kpr-traditional.js

class KPRTraditional {
    constructor(container) {
      this.container = container;
      this.sectionId = container.dataset.sectionId;
      this.swiper = null;
      this.sectionSettings = this.getSectionSettings();
      this.init();
    }
  
    init() {
      this.bindEvents();
      this.initSwiper();
      console.log('KPR Traditional initialized');
    }

    getSectionSettings() {
      // Try to get section settings from Shopify section data
      const sectionData = window.sectionSettings && window.sectionSettings[this.sectionId];
      if (sectionData) {
        return {
          enableAutoplay: sectionData.enable_autoplay !== false, // Default to true
          autoplayDelay: sectionData.autoplay_delay || 5
        };
      }
      
      // Try to get from section element data attributes
      const enableAutoplay = this.container.dataset.enableAutoplay !== 'false';
      const autoplayDelay = parseInt(this.container.dataset.autoplayDelay) || 5;
      
      return {
        enableAutoplay,
        autoplayDelay
      };
    }

    updateAutoplaySettings() {
      if (this.swiper) {
        const newSettings = this.getSectionSettings();
        
        if (newSettings.enableAutoplay) {
          // Enable autoplay
          this.swiper.autoplay.start();
          this.swiper.autoplay.params.delay = newSettings.autoplayDelay * 1000;
        } else {
          // Disable autoplay
          this.swiper.autoplay.stop();
        }
        
        console.log('Autoplay settings updated:', newSettings);
      }
    }
  
        initSwiper() {
      // Wait for Swiper library to load
      if (typeof Swiper === 'undefined') {
        setTimeout(() => this.initSwiper(), 100);
        return;
      }

      // Initialize Section 1 Swiper
      const swiperContainer = this.container.querySelector('.kpr-products-slider');
      if (swiperContainer) {
        // Configure autoplay based on section settings
        const autoplayConfig = this.sectionSettings.enableAutoplay ? {
          delay: this.sectionSettings.autoplayDelay * 1000, // Convert to milliseconds
          disableOnInteraction: false,
        } : false;

        this.swiper = new Swiper(swiperContainer, {
          slidesPerView: 1,
          spaceBetween: 20,
          loop: true,
          autoplay: autoplayConfig,
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

        console.log('Section 1 Swiper initialized');
      }

      // Initialize Section 2 Swiper
      const section2SwiperContainer = this.container.querySelector('.kpr-section2-slider');
      if (section2SwiperContainer) {
        this.section2Swiper = new Swiper(section2SwiperContainer, {
          slidesPerView: 1,
          spaceBetween: 0,
          loop: true,
          navigation: {
            nextEl: '.kpr-section2-next',
            prevEl: '.kpr-section2-prev',
          },
          pagination: {
            el: '.kpr-section2-pagination',
            clickable: true,
          },
          effect: 'slide',
          speed: 600,
        });

        console.log('Section 2 Swiper initialized');
      }
    }
  
        bindEvents() {
      // Handle resize for responsive behavior
      window.addEventListener('resize', () => {
        this.handleResize();
      });
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
      
      // Start autoplay if swiper exists and autoplay is enabled
      if (this.swiper && this.swiper.autoplay && this.sectionSettings.enableAutoplay) {
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
      if (this.section2Swiper) {
        this.section2Swiper.destroy(true, true);
      }
    }
  }
  
  // Initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', function() {
    const traditionalSections = document.querySelectorAll('[data-section-type="kpr-traditional"]');
    
    traditionalSections.forEach(section => {
      const instance = new KPRTraditional(section);
      section.kprTraditionalInstance = instance;
    });
  });
  
  // Handle section load in theme editor
  document.addEventListener('shopify:section:load', function(event) {
    if (event.detail.sectionId.includes('kpr_traditional')) {
      const section = event.target;
      const instance = new KPRTraditional(section);
      section.kprTraditionalInstance = instance;
    }
  });

  // Handle section updates in theme editor
  document.addEventListener('shopify:section:reorder', function(event) {
    if (event.detail.sectionId.includes('kpr_traditional')) {
      const section = event.target;
      const instance = section.kprTraditionalInstance;
      if (instance) {
        instance.updateAutoplaySettings();
      }
    }
  });

  // Handle section setting changes
  document.addEventListener('shopify:section:select', function(event) {
    if (event.detail.sectionId.includes('kpr_traditional')) {
      const section = event.target;
      const instance = section.kprTraditionalInstance;
      if (instance) {
        instance.updateAutoplaySettings();
      }
    }
  });