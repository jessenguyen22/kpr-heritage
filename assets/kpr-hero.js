// assets/kpr-hero.js

class KPRHero {
  constructor(container) {
    this.container = container;
    this.video = container.querySelector('.kpr-hero__video');
    this.sectionId = container.dataset.sectionId;
    this.lottieAnimations = {};
    this.init();
  }

  init() {
    this.handleVideoLoad();
    this.handleResize();
    this.initLottieAnimations();
    
    console.log('KPR Hero initialized');
  }

  handleVideoLoad() {
    if (this.video) {
      this.video.addEventListener('loadeddata', () => {
        console.log('Hero video loaded');
      });

      this.video.addEventListener('error', () => {
        console.log('Hero video failed to load');
      });
    }
  }

  handleResize() {
    window.addEventListener('resize', () => {
      // Handle any resize logic here
    });
  }

  initLottieAnimations() {
    // Wait for Lottie library to load
    if (typeof lottie === 'undefined') {
      setTimeout(() => this.initLottieAnimations(), 100);
      return;
    }

    const concepts = this.container.querySelectorAll('.kpr-concept[data-lottie-url]');
    
    concepts.forEach(concept => {
      this.setupLottieAnimation(concept);
    });
  }

  setupLottieAnimation(conceptElement) {
    const conceptType = conceptElement.dataset.concept;
    const lottieUrl = conceptElement.dataset.lottieUrl;
    const lottieContainer = conceptElement.querySelector('.kpr-concept__lottie');
    
    if (!lottieUrl || !lottieContainer) return;

    // Load Lottie animation
    const animation = lottie.loadAnimation({
      container: lottieContainer,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      path: lottieUrl
    });

    // Store animation reference
    this.lottieAnimations[conceptType] = animation;

    // Setup animation events
    animation.addEventListener('DOMLoaded', () => {
      animation.goToAndStop(0, true);
      console.log(`${conceptType} animation loaded - staying idle`);
    });

    // Setup hover events
    conceptElement.addEventListener('mouseenter', () => {
      animation.goToAndStop(0, true);
      animation.play();
      console.log(`Hover started - playing ${conceptType} animation`);
    });

    conceptElement.addEventListener('mouseleave', () => {
      animation.stop();
      animation.goToAndStop(0, true);
      console.log(`Hover ended - ${conceptType} back to static`);
    });

    // Setup click events
    conceptElement.addEventListener('click', () => {
      this.handleConceptClick(conceptType);
    });
  }

  handleConceptClick(conceptType) {
    console.log(`Concept clicked: ${conceptType}`);
    
    // Dispatch custom event for concept switching
    document.dispatchEvent(new CustomEvent('kprConceptChanged', {
      detail: { 
        concept: conceptType,
        section: this.container 
      }
    }));

    // Hide hero section after click
    this.hideHeroSection();

    // Show target concept section
    this.showConceptSection(conceptType);
  }

  hideHeroSection() {
    this.container.style.transition = 'opacity 0.8s ease-out';
    this.container.style.opacity = '0';
    
    setTimeout(() => {
      this.container.style.display = 'none';
    }, 800);
  }

  showConceptSection(conceptType) {
    const targetSection = document.querySelector(`[data-concept-section="${conceptType}"]`);
    
    if (targetSection) {
      // Show concept section with fade in
      targetSection.style.display = 'block';
      targetSection.style.opacity = '0';
      
      setTimeout(() => {
        targetSection.style.transition = 'opacity 0.8s ease-in';
        targetSection.style.opacity = '1';
      }, 100);

      // Scroll to top of concept section
      setTimeout(() => {
        targetSection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }, 400);
    } else {
      console.warn(`Concept section "${conceptType}" not found`);
    }
  }

  // Cleanup method
  destroy() {
    Object.values(this.lottieAnimations).forEach(animation => {
      if (animation) animation.destroy();
    });
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  const heroSections = document.querySelectorAll('[data-section-type="kpr-hero"]');
  
  heroSections.forEach(section => {
    new KPRHero(section);
  });
});

// Handle section load in theme editor
document.addEventListener('shopify:section:load', function(event) {
  if (event.detail.sectionId.includes('kpr_hero')) {
    const section = event.target;
    new KPRHero(section);
  }
});

// Cleanup on page unload
window.addEventListener('beforeunload', function() {
  // Lottie animations will be cleaned up automatically
});