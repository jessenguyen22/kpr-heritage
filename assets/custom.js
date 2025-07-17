document.addEventListener("DOMContentLoaded", function () {
  let allowHover = true;

  // 1. LOAD PAGE ANIMATIONS
  const loadTl = gsap.timeline({ paused: true });

  gsap.set(".traditional-img", { scale: 0, x: -100, opacity: 0 });
  gsap.set(".modern-img", { scale: 0, x: 100, opacity: 0 });
  gsap.set(".hybrid-img", { scale: 2, z: 500, opacity: 0 });
  gsap.set(".traditional-btn, .modern-btn, .hybrid-btn", {
    scale: 0,
    opacity: 0,
  });

  loadTl
    .to(
      ".traditional-img",
      {
        scale: 1,
        x: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
      },
      1.2
    )
    .to(
      ".modern-img",
      {
        scale: 1,
        x: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
      },
      1.2
    )
    .to(
      ".hybrid-img",
      {
        scale: 1,
        z: 0,
        opacity: 1,
        duration: 0.5,
        ease: "bounce.out",
      },
      1.6
    )
    .to(
      ".traditional-btn, .modern-btn, .hybrid-btn",
      {
        scale: 1,
        opacity: 1,
        duration: 0.1,
        ease: "power4.inOut",
      },
      2.8
    )
    .to(".traditional-btn, .modern-btn, .hybrid-btn", {
      skewX: 10,
      duration: 0.04,
      ease: "power4.inOut",
    })
    .to(".traditional-btn, .modern-btn, .hybrid-btn", {
      skewX: 0,
      x: -20,
      duration: 0.04,
      ease: "power4.inOut",
    })
    .to(".traditional-btn, .modern-btn, .hybrid-btn", {
      x: 20,
      scale: 1.1,
      duration: 0.04,
    })
    .to(".traditional-btn, .modern-btn, .hybrid-btn", {
      x: 0,
      scale: 1,
      skewX: 0,
      duration: 0.2,
      ease: "power4.inOut",
    });

  // Trigger từ video block
  const blockVideo = document.querySelector(".kpr-video-wrapper video");

  if (blockVideo) {
    blockVideo.addEventListener("play", function () {
      console.log("Block video started playing");
      loadTl.play();
    });

    if (!blockVideo.paused) {
      loadTl.play();
    }
  } else {
    setTimeout(() => loadTl.play(), 1000);
  }

// 2. ENHANCED HERO SECTION MASK ANIMATION
// Create overlay FIRST, then timeline

// Create white overlay if not exists
let whiteOverlay = document.querySelector('.hero-white-overlay');
if (!whiteOverlay) {
  whiteOverlay = document.createElement('div');
  whiteOverlay.className = 'hero-white-overlay';
  whiteOverlay.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
  `;
  
  // Insert overlay AFTER video wrapper (cùng cấp) to avoid z-index issues
  const videoWrapper = document.querySelector('.kpr-video-wrapper');
  
  if (videoWrapper) {
    videoWrapper.insertAdjacentElement('afterend', whiteOverlay);
    console.log('✅ White overlay created after video wrapper (same level)');
  }
}

// Set initial states with GSAP
gsap.set('.hero-white-overlay', {
  background: 'rgba(255, 255, 255, 0)', // Transparent initially
});

// NOW create timeline with overlay included
const heroTl = gsap.timeline({
  scrollTrigger: {
    trigger: ".hero-section",
    start: "top top",
    end: "+=50%",
    scrub: 2.5,
    pin: true,
    id: 'hero-mask',
    onUpdate: (self) => {
      if (self.progress > 0.1) {
        allowHover = false;
        if (typeof gifCursor !== "undefined") {
          gifCursor.style.display = "none";
          document.body.style.cursor = "default";
        }
      } else {
        allowHover = true;
      }
    },
  },
});

// Enhanced timeline with multiple effects
heroTl
  // Mask animation (original)
  .fromTo(".mask-wrapper", {
    maskPosition: "49% center",
    maskSize: "4100% 4100%",
  }, {
    maskPosition: "50% center",
    maskSize: "15% 15%",
    duration: 1,
  })
  
  // Scale down section and elements
  .fromTo(".hero-section", {
    scale: 1,
  }, {
    scale: 0.95,
    duration: 1,
    ease: "power2.out",
  }, 0)
  
  // Scale down internal elements
  .fromTo(".hero-section .traditional-img, .hero-section .modern-img, .hero-section .hybrid-img", {
    scale: 1,
  }, {
    scale: 0.9,
    duration: 1,
    ease: "power2.out",
  }, 0.2)
  
  // White overlay fade in with GSAP background animation
  .fromTo('.hero-white-overlay', {
    background: 'rgba(255, 255, 255, 0)', // From transparent
  }, {
    background: 'rgba(255, 255, 255, 1)', // To 30% white
    duration: 1,
    ease: "power2.inOut",
  }, 0.3);

  

  // 5. SMOOTH SCROLL FUNCTIONALITY (UPDATED)

  function scrollToSection(targetId) {
    const targetElement = document.getElementById(targetId);
    if (!targetElement) {
      console.warn("Target element not found:", targetId);
      return;
    }

    const currentScroll = window.pageYOffset;
    const targetScroll = targetElement.offsetTop;

    // Tìm hero section với selector chính xác cho HTML của bạn
    const heroSection =
      document.querySelector(".hero-section.mask-wrapper") ||
      document.querySelector(".hero-section");

    // Tính toán hero animation end point (50% viewport height)
    const viewportHeight = window.innerHeight;
    const heroAnimationEnd = viewportHeight * 0.5; // 50% như bạn đã set

    console.log("Scrolling from:", currentScroll, "to:", targetScroll);
    console.log("Hero animation ends at:", heroAnimationEnd);

    // Set initial fade state cho target section elements
    const targetElements = targetElement.querySelectorAll(
      "img, h1, h2, h3, p, .btn, .card, .xb-image, .xb-column"
    );
    gsap.set(targetElements, { opacity: 0, y: 30 });

    const scrollTl = gsap.timeline();

    if (currentScroll < heroAnimationEnd) {
      // Đang trong hero section - scroll chậm qua hero animation
      scrollTl
        // Stage 1: Scroll chậm qua hero animation (50% viewport)
        .to(window, {
          scrollTo: { y: heroAnimationEnd + 50 },
          duration: 0.3, // Chậm để thấy rõ mask animation
          ease: "power3.out",
        })
        // Stage 2: Pause để animation settle
        .to({}, { duration: 0.2 })
        // Stage 3: Scroll to target position
        .to(window, {
          scrollTo: { y: targetScroll },
          duration: 1.5,
          ease: "power2.out",
        })
        // Stage 4: Fade in target section elements
        .to(
          targetElements,
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out",
          },
          "-=0.5"
        );
    } else {
      // Đã qua hero section - scroll bình thường
      scrollTl
        .to(window, {
          scrollTo: { y: targetScroll },
          duration: 2,
          ease: "power2.inOut",
        })
        .to(
          targetElements,
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: "power2.out",
          },
          "-=0.3"
        );
    }
  }

  // 6. ANCHOR LINK OVERRIDE
  document.addEventListener("click", function (e) {
    const link = e.target.closest('a[href^="#"]');
    if (link && link.closest(".hero-section")) {
      e.preventDefault();
      const targetId = link.getAttribute("href").substring(1);
      console.log("Smooth scrolling to:", targetId);
      scrollToSection(targetId);
    }
  });
}); // End DOMContentLoaded

// 7. SCROLLTRIGGER REFRESH
window.addEventListener("load", () => {
  ScrollTrigger.refresh();
});

// 8. SECTION ENTRANCE ANIMATIONS (ADD THIS AFTER SCROLLTRIGGER REFRESH)
gsap.registerPlugin(ScrollTrigger);

// Traditional Section Animation
function createSectionAnimation(sectionId) {
  const section = document.getElementById(sectionId);
  if (!section) return;

  // Set initial states
  const elements = section.querySelectorAll("h1, h2, h3, p, img, .btn, .card");
  gsap.set(elements, { y: 50, opacity: 0 });

  // Create entrance animation
  const sectionTl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top 80%",
      end: "top 30%",
      toggleActions: "play none none reverse",
    },
  });

  sectionTl.to(elements, {
    y: 0,
    opacity: 1,
    duration: 0.8,
    stagger: 0.1,
    ease: "power2.out",
  });
}

// Initialize section animations
window.addEventListener("load", () => {
  ScrollTrigger.refresh();

  // Create animations for sections
  createSectionAnimation("traditional-section");
  createSectionAnimation("hybrid-section");
  createSectionAnimation("modern-section");
});

// ===========================================
// ENHANCED DYNAMIC CONCEPT SECTIONS SYSTEM
// ===========================================

window.conceptManager = {
  currentSection: null,
  isTransitioning: false,
  transitionType: 'slide', // 'slide', 'fade', 'flip', 'elastic'
  
  // Initialize hero image clicks
  init: function() {
    this.setupHeroClicks();
    this.setupSectionNavigation();
    console.log('✅ Enhanced Concept Manager initialized');
  },
  
  // Setup hero image click handlers
  setupHeroClicks: function() {
    // Target images with classes: traditional-img, hybrid-img, modern-img
    document.querySelectorAll('.traditional-img, .hybrid-img, .modern-img').forEach(img => {
      img.addEventListener('click', (e) => {
        e.preventDefault();
        
        let sectionName = '';
        if (img.classList.contains('traditional-img')) {
          sectionName = 'traditional';
        } else if (img.classList.contains('hybrid-img')) {
          sectionName = 'hybrid';
        } else if (img.classList.contains('modern-img')) {
          sectionName = 'modern';
        }
        
        if (sectionName) {
          console.log('Hero image clicked:', sectionName);
          this.showSectionFromHero(sectionName);
        }
      });
    });
    
    // Handle direct link clicks
    document.querySelectorAll('a[href="#traditional-section"], a[href="#hybrid-section"], a[href="#modern-section"]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        
        const href = link.getAttribute('href');
        const sectionName = href.replace('#', '').replace('-section', '');
        
        console.log('Direct link clicked:', sectionName);
        this.showSectionFromHero(sectionName);
      });
    });
  },
  
  // Setup navigation within concept sections
  setupSectionNavigation: function() {
    // Setup navigation for switching between concept sections
    // This will be used for sidebar/navigation links within sections
    document.addEventListener('click', (e) => {
      const navLink = e.target.closest('[data-concept-nav]');
      if (navLink) {
        e.preventDefault();
        const targetSection = navLink.dataset.conceptNav;
        
        if (targetSection && targetSection !== this.currentSection) {
          console.log('Section navigation clicked:', targetSection);
          this.switchSection(targetSection);
        }
      }
    });
  },
  
  // Show section from hero (original smooth reveal)
  showSectionFromHero: function(sectionName) {
    console.log('Showing section from hero:', sectionName);
    
    // Hide all concept sections
    this.hideAllSections();
    
    // Show target section with original animation
    const targetSection = document.getElementById(`${sectionName}-section`);
    if (targetSection) {
      targetSection.classList.remove('concepts-hidden');
      targetSection.classList.add('concepts-visible', 'concepts-revealing');
      
      // Scroll to section with delay
      setTimeout(() => {
        this.scrollToSection(targetSection);
      }, 100);
      
      this.currentSection = sectionName;
    }
  },
  
  // Switch between concept sections (enhanced transition)
  switchSection: function(newSectionName) {
    if (this.isTransitioning || newSectionName === this.currentSection) {
      return;
    }
    
    this.isTransitioning = true;
    console.log(`Switching from ${this.currentSection} to ${newSectionName}`);
    
    const currentElement = document.getElementById(`${this.currentSection}-section`);
    const newElement = document.getElementById(`${newSectionName}-section`);
    
    if (!currentElement || !newElement) {
      this.isTransitioning = false;
      return;
    }
    
    // Determine transition direction
    const direction = this.getTransitionDirection(this.currentSection, newSectionName);
    
    // Start transition based on selected type
    switch(this.transitionType) {
      case 'slide':
        this.slideTransition(currentElement, newElement, direction);
        break;
      case 'fade':
        this.fadeTransition(currentElement, newElement);
        break;
      case 'flip':
        this.flipTransition(currentElement, newElement);
        break;
      case 'elastic':
        this.elasticTransition(currentElement, newElement);
        break;
      default:
        this.slideTransition(currentElement, newElement, direction);
    }
    
    this.currentSection = newSectionName;
  },
  
  // Slide transition effect
  slideTransition: function(currentEl, newEl, direction) {
    const outClass = direction === 'left' ? 'concepts-slide-out-left' : 'concepts-slide-out-right';
    const inClass = direction === 'left' ? 'concepts-slide-in-right' : 'concepts-slide-in-left';
    
    // Slide out current
    currentEl.classList.add(outClass);
    
    setTimeout(() => {
      // Hide current and show new
      currentEl.classList.remove('concepts-visible', outClass);
      currentEl.classList.add('concepts-hidden');
      
      newEl.classList.remove('concepts-hidden');
      newEl.classList.add('concepts-visible', inClass);
      
      // Clean up classes after animation
      setTimeout(() => {
        newEl.classList.remove(inClass);
        this.isTransitioning = false;
      }, 400);
    }, 400);
  },
  
  // Fade transition effect
  fadeTransition: function(currentEl, newEl) {
    currentEl.classList.add('concepts-fade-out');
    
    setTimeout(() => {
      currentEl.classList.remove('concepts-visible', 'concepts-fade-out');
      currentEl.classList.add('concepts-hidden');
      
      newEl.classList.remove('concepts-hidden');
      newEl.classList.add('concepts-visible', 'concepts-fade-in');
      
      setTimeout(() => {
        newEl.classList.remove('concepts-fade-in');
        this.isTransitioning = false;
      }, 400);
    }, 300);
  },
  
  // Flip transition effect
  flipTransition: function(currentEl, newEl) {
    currentEl.classList.add('concepts-flip-out');
    
    setTimeout(() => {
      currentEl.classList.remove('concepts-visible', 'concepts-flip-out');
      currentEl.classList.add('concepts-hidden');
      
      newEl.classList.remove('concepts-hidden');
      newEl.classList.add('concepts-visible', 'concepts-flip-in');
      
      setTimeout(() => {
        newEl.classList.remove('concepts-flip-in');
        this.isTransitioning = false;
      }, 500);
    }, 400);
  },
  
  // Elastic transition effect
  elasticTransition: function(currentEl, newEl) {
    currentEl.classList.add('concepts-elastic-out');
    
    setTimeout(() => {
      currentEl.classList.remove('concepts-visible', 'concepts-elastic-out');
      currentEl.classList.add('concepts-hidden');
      
      newEl.classList.remove('concepts-hidden');
      newEl.classList.add('concepts-visible', 'concepts-elastic-in');
      
      setTimeout(() => {
        newEl.classList.remove('concepts-elastic-in');
        this.isTransitioning = false;
      }, 600);
    }, 500);
  },
  
  // Determine transition direction
  getTransitionDirection: function(fromSection, toSection) {
    const sectionOrder = ['traditional', 'hybrid', 'modern'];
    const fromIndex = sectionOrder.indexOf(fromSection);
    const toIndex = sectionOrder.indexOf(toSection);
    
    return toIndex > fromIndex ? 'right' : 'left';
  },
  
  // Change transition type
  setTransitionType: function(type) {
    this.transitionType = type;
    console.log('Transition type changed to:', type);
  },
  
  // Hide all concept sections
  hideAllSections: function() {
    document.querySelectorAll('.concepts-hidden, .concepts-visible').forEach(section => {
      section.classList.remove('concepts-visible', 'concepts-revealing');
      section.classList.add('concepts-hidden');
      
      // Clean up any transition classes
      section.classList.remove(
        'concepts-slide-out-left', 'concepts-slide-out-right',
        'concepts-slide-in-left', 'concepts-slide-in-right',
        'concepts-fade-out', 'concepts-fade-in',
        'concepts-flip-out', 'concepts-flip-in',
        'concepts-elastic-out', 'concepts-elastic-in'
      );
    });
  },
  
  // Scroll to section
  scrollToSection: function(element) {
    if (typeof scrollToSection === 'function') {
      scrollToSection(element.id);
    } else {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    window.conceptManager.init();
  }, 1000);
});

// Utility functions for easy access
window.switchConceptSection = function(sectionName) {
  window.conceptManager.switchSection(sectionName);
};

window.setConceptTransition = function(type) {
  window.conceptManager.setTransitionType(type);
};

