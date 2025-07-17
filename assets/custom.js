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
// FIXED CONCEPT MANAGER WITH PROPER TRANSITION ROUTING
// ===========================================

// Enhanced concept manager - REPLACE existing window.conceptManager
window.conceptManager = {
  currentSection: null,
  isTransitioning: false,
  
  // Initialize the system
  init: function() {
    this.setupHeroClicks();
    this.setupNavigationClicks();
    console.log('✅ Fixed Concept Manager initialized');
  },
  
  // Setup hero image click handlers
  setupHeroClicks: function() {
    // Target images with classes: traditional-img, hybrid-img, modern-img
    document.querySelectorAll('.traditional-img, .hybrid-img, .modern-img').forEach(img => {
      img.addEventListener('click', (e) => {
        e.preventDefault();
        
        let sectionName = this.getSectionFromImage(img);
        if (sectionName) {
          console.log('🎯 Hero image clicked:', sectionName);
          this.showSection(sectionName, true); // true = from hero
        }
      });
    });
    
    // Handle direct hero links (NOT navigation links)
    document.querySelectorAll('a[href*="-section"]:not([data-concept-nav])').forEach(link => {
      // Only handle links that are NOT in concept navigation
      if (!link.closest('.concept-navigation') && !link.hasAttribute('data-concept-nav')) {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const sectionName = this.getSectionFromHref(link.getAttribute('href'));
          if (sectionName) {
            console.log('🎯 Hero direct link clicked:', sectionName);
            this.showSection(sectionName, true);
          }
        });
      }
    });
  },
  
  // Setup navigation clicks (NEW - for slide transitions)
  setupNavigationClicks: function() {
    // Target navigation links with data-concept-nav
    document.querySelectorAll('[data-concept-nav]').forEach(navLink => {
      navLink.addEventListener('click', (e) => {
        e.preventDefault();
        
        const sectionName = navLink.getAttribute('data-concept-nav');
        if (sectionName !== this.currentSection && !this.isTransitioning) {
          console.log('🔄 Navigation clicked:', sectionName);
          this.slideToSection(sectionName); // Use slide transition
        }
      });
      
      // Add magnetic hover effect
      navLink.classList.add('concept-nav-magnetic');
    });
  },
  
  // Helper functions
  getSectionFromImage: function(img) {
    if (img.classList.contains('traditional-img')) return 'traditional';
    if (img.classList.contains('hybrid-img')) return 'hybrid';
    if (img.classList.contains('modern-img')) return 'modern';
    return null;
  },
  
  getSectionFromHref: function(href) {
    return href.replace('#', '').replace('-section', '');
  },
  
  // Show section (for hero clicks - original animation)
  showSection: function(sectionName, fromHero = false) {
    console.log(`📍 Showing section: ${sectionName} ${fromHero ? '(from hero)' : ''}`);
    
    this.hideAllSections();
    
    const targetSection = document.getElementById(`${sectionName}-section`);
    if (targetSection) {
      targetSection.classList.remove('concepts-hidden');
      targetSection.classList.add('concepts-visible');
      
      if (fromHero) {
        targetSection.classList.add('concepts-revealing'); // Original hero animation
        console.log('✨ Using original hero animation');
      }
      
      // Scroll to section
      setTimeout(() => {
        this.scrollToSection(targetSection);
      }, 100);
      
      this.currentSection = sectionName;
    }
  },
  
  // Slide to section (for navigation clicks - CSS slide animations)
  slideToSection: function(sectionName) {
    if (this.isTransitioning) {
      console.log('⏳ Transition in progress, ignoring click');
      return;
    }
    
    this.isTransitioning = true;
    console.log(`🎬 Starting slide transition to: ${sectionName}`);
    
    const currentSection = document.getElementById(`${this.currentSection}-section`);
    const targetSection = document.getElementById(`${sectionName}-section`);
    
    if (!currentSection || !targetSection) {
      console.error('❌ Section not found:', { current: this.currentSection, target: sectionName });
      this.isTransitioning = false;
      return;
    }
    
    // Determine slide direction
    const sections = ['traditional', 'hybrid', 'modern'];
    const currentIndex = sections.indexOf(this.currentSection);
    const targetIndex = sections.indexOf(sectionName);
    const slideDirection = targetIndex > currentIndex ? 'right' : 'left';
    
    console.log(`📐 Slide direction: ${slideDirection} (${currentIndex} → ${targetIndex})`);
    
    // Execute slide transition
    this.executeSlideTransition(currentSection, targetSection, slideDirection)
      .then(() => {
        this.currentSection = sectionName;
        this.isTransitioning = false;
        console.log(`✅ Slide complete: ${sectionName}`);
      })
      .catch((error) => {
        console.error('❌ Slide transition failed:', error);
        this.isTransitioning = false;
      });
  },
  
  // Execute slide transition
  executeSlideTransition: function(currentSection, targetSection, direction) {
    return new Promise((resolve) => {
      console.log('🎭 Preparing slide transition...');
      
      // Phase 1: Prepare sections
      this.prepareSections(currentSection, targetSection, direction);
      
      // Phase 2: Start transition
      setTimeout(() => {
        console.log('🎬 Executing slide out...');
        this.slideOutCurrent(currentSection, direction);
        
        // Phase 3: Switch sections
        setTimeout(() => {
          console.log('🔄 Switching sections...');
          this.switchSections(currentSection, targetSection);
          
          // Phase 4: Slide in new section
          setTimeout(() => {
            console.log('🎭 Sliding in new section...');
            this.slideInTarget(targetSection, direction);
            
            // Phase 5: Cleanup
            setTimeout(() => {
              console.log('🧹 Cleaning up...');
              this.cleanupTransition(currentSection, targetSection);
              resolve();
            }, 1200);
            
          }, 100);
        }, 400);
      }, 50);
    });
  },
  
  // Prepare sections for transition
  prepareSections: function(currentSection, targetSection, direction) {
    // Add container styling
    currentSection.classList.add('concept-section-container');
    targetSection.classList.add('concept-section-container');
    
    // Prepare images
    const currentImages = currentSection.querySelectorAll('.xb-image');
    const targetImages = targetSection.querySelectorAll('.xb-image');
    
    currentImages.forEach(img => img.classList.add('concept-image-slide', 'slide-active'));
    targetImages.forEach(img => img.classList.add('concept-image-slide', 'slide-in'));
    
    // Prepare text elements
    const currentTexts = currentSection.querySelectorAll('h1, h2, h3, p, .xb-text');
    const targetTexts = targetSection.querySelectorAll('h1, h2, h3, p, .xb-text');
    
    currentTexts.forEach(text => text.classList.add('concept-text-slide', 'slide-active'));
    targetTexts.forEach(text => text.classList.add('concept-text-slide'));
    
    // Prepare target section position
    targetSection.classList.add('concept-slide');
    if (direction === 'right') {
      targetSection.classList.add('slide-in-right');
    } else {
      targetSection.classList.add('slide-in-left');
    }
    
    console.log(`🎯 Sections prepared for ${direction} slide`);
  },
  
  // Slide out current section
  slideOutCurrent: function(currentSection, direction) {
    currentSection.classList.add('concept-slide');
    
    if (direction === 'right') {
      currentSection.classList.add('slide-out-left');
    } else {
      currentSection.classList.add('slide-out-right');
    }
    
    // Animate elements out
    const images = currentSection.querySelectorAll('.concept-image-slide');
    const texts = currentSection.querySelectorAll('.concept-text-slide');
    
    images.forEach(img => img.classList.add('slide-out'));
    texts.forEach(text => text.classList.remove('slide-active'));
  },
  
  // Switch sections
  switchSections: function(currentSection, targetSection) {
    // Hide current
    currentSection.classList.remove('concepts-visible');
    currentSection.classList.add('concepts-hidden');
    
    // Show target
    targetSection.classList.remove('concepts-hidden');
    targetSection.classList.add('concepts-visible');
  },
  
  // Slide in target section
  slideInTarget: function(targetSection, direction) {
    targetSection.classList.remove('slide-in-left', 'slide-in-right');
    targetSection.classList.add('active', 'elastic-transition');
    
    // Animate elements in
    const images = targetSection.querySelectorAll('.concept-image-slide');
    const texts = targetSection.querySelectorAll('.concept-text-slide');
    
    images.forEach((img, index) => {
      setTimeout(() => {
        img.classList.remove('slide-in');
        img.classList.add('slide-active');
      }, index * 100);
    });
    
    texts.forEach((text, index) => {
      setTimeout(() => {
        text.classList.add('slide-active');
      }, index * 150 + 200);
    });
  },
  
  // Cleanup transition
  cleanupTransition: function(currentSection, targetSection) {
    // Remove transition classes
    [currentSection, targetSection].forEach(section => {
      section.classList.remove(
        'concept-slide', 'slide-out-left', 'slide-out-right',
        'slide-in-left', 'slide-in-right', 'active', 'elastic-transition'
      );
    });
    
    // Clean element classes
    document.querySelectorAll('.concept-image-slide').forEach(img => {
      img.classList.remove('concept-image-slide', 'slide-out', 'slide-in', 'slide-active');
    });
    
    document.querySelectorAll('.concept-text-slide').forEach(text => {
      text.classList.remove('concept-text-slide', 'slide-active');
    });
  },
  
  // Hide all sections
  hideAllSections: function() {
    document.querySelectorAll('.concepts-hidden, .concepts-visible').forEach(section => {
      section.classList.remove('concepts-visible', 'concepts-revealing');
      section.classList.add('concepts-hidden');
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

// REPLACE the existing initialization
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    window.conceptManager.init();
  }, 1000);
});


