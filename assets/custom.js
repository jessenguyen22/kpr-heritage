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
// MORPHING TRANSITION SYSTEM FOR CONCEPT SECTIONS
// ===========================================

// Enhanced concept manager with morphing transitions
window.conceptManager = {
  currentSection: null,
  isFirstLoad: true,
  transitionInProgress: false,
  
  // Initialize the system
  init: function() {
    this.setupHeroClicks();
    this.setupNavigationClicks();
    this.createMorphingStyles();
    console.log('✅ Morphing Transition System initialized');
  },
  
  // Setup hero image click handlers (unchanged)
  setupHeroClicks: function() {
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
          this.showSection(sectionName, true); // true = from hero
        }
      });
    });
    
    // Handle direct link clicks from hero
    document.querySelectorAll('a[href="#traditional-section"], a[href="#hybrid-section"], a[href="#modern-section"]').forEach(link => {
      // Only handle links NOT in concept navigation
      if (!link.closest('.concept-navigation')) {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const href = link.getAttribute('href');
          const sectionName = href.replace('#', '').replace('-section', '');
          this.showSection(sectionName, true); // true = from hero
        });
      }
    });
  },
  
  // Setup navigation clicks (new)
  setupNavigationClicks: function() {
    // Target navigation links with data-concept-nav
    document.querySelectorAll('[data-concept-nav]').forEach(navLink => {
      navLink.addEventListener('click', (e) => {
        e.preventDefault();
        const sectionName = navLink.getAttribute('data-concept-nav');
        
        // Only proceed if we're switching to a different section
        if (sectionName !== this.currentSection && !this.transitionInProgress) {
          console.log('Navigation clicked:', sectionName);
          this.morphToSection(sectionName);
        }
      });
    });
  },
  
  // Create morphing styles
  createMorphingStyles: function() {
    const style = document.createElement('style');
    style.textContent = `
      /* Morphing transition styles */
      .concept-section-morphing {
        position: relative;
        overflow: hidden;
      }
      
      .concept-morph-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle at center, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.8) 100%);
        opacity: 0;
        pointer-events: none;
        z-index: 10;
        backdrop-filter: blur(10px);
      }
      
      .concept-morph-active .concept-morph-overlay {
        opacity: 1;
      }
      
      /* Enhanced reveal animation for switching */
      .concept-section-switching {
        animation: morphReveal 1.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
      }
      
      @keyframes morphReveal {
        0% {
          opacity: 0;
          transform: translateY(50px) scale(0.95);
          filter: blur(20px);
        }
        50% {
          opacity: 0.7;
          transform: translateY(20px) scale(0.98);
          filter: blur(5px);
        }
        100% {
          opacity: 1;
          transform: translateY(0) scale(1);
          filter: blur(0px);
        }
      }
      
      /* Image morphing effects */
      .concept-image-morphing {
        transition: all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        transform-origin: center center;
      }
      
      .concept-image-morphing.morph-out {
        transform: scale(0.8) translateY(-30px);
        opacity: 0;
        filter: blur(15px);
      }
      
      .concept-image-morphing.morph-in {
        transform: scale(1.1) translateY(20px);
        opacity: 0;
        filter: blur(10px);
      }
      
      .concept-image-morphing.morph-active {
        transform: scale(1) translateY(0);
        opacity: 1;
        filter: blur(0px);
      }
      
      /* Text morphing effects */
      .concept-text-morphing {
        transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      }
      
      .concept-text-morphing.morph-out {
        transform: translateX(-50px);
        opacity: 0;
      }
      
      .concept-text-morphing.morph-in {
        transform: translateX(50px);
        opacity: 0;
      }
      
      .concept-text-morphing.morph-active {
        transform: translateX(0);
        opacity: 1;
      }
    `;
    document.head.appendChild(style);
  },
  
  // Show section (original function for hero clicks)
  showSection: function(sectionName, fromHero = false) {
    console.log('Showing section:', sectionName, fromHero ? '(from hero)' : '(navigation)');
    
    // Hide all sections
    this.hideAllSections();
    
    // Show target section
    const targetSection = document.getElementById(`${sectionName}-section`);
    if (targetSection) {
      targetSection.classList.remove('concepts-hidden');
      targetSection.classList.add('concepts-visible');
      
      // Use different animation based on source
      if (fromHero) {
        targetSection.classList.add('concepts-revealing'); // Original hero animation
      }
      
      // Scroll to section with delay
      setTimeout(() => {
        this.scrollToSection(targetSection);
      }, 100);
      
      this.currentSection = sectionName;
      this.isFirstLoad = false;
    }
  },
  
  // Morph to section (new function for navigation)
  morphToSection: function(sectionName) {
    if (this.transitionInProgress) return;
    
    this.transitionInProgress = true;
    console.log('Morphing to section:', sectionName);
    
    const currentSectionEl = document.getElementById(`${this.currentSection}-section`);
    const targetSectionEl = document.getElementById(`${sectionName}-section`);
    
    if (!currentSectionEl || !targetSectionEl) {
      this.transitionInProgress = false;
      return;
    }
    
    // Phase 1: Prepare morphing elements
    this.prepareMorphingElements(currentSectionEl, targetSectionEl);
    
    // Phase 2: Morph out current section
    this.morphOutSection(currentSectionEl).then(() => {
      
      // Phase 3: Switch sections
      this.switchSections(currentSectionEl, targetSectionEl);
      
      // Phase 4: Morph in new section
      this.morphInSection(targetSectionEl).then(() => {
        
        // Phase 5: Cleanup
        this.cleanupMorphing(targetSectionEl);
        this.currentSection = sectionName;
        this.transitionInProgress = false;
        
        console.log('Morphing complete:', sectionName);
      });
    });
  },
  
  // Prepare morphing elements
  prepareMorphingElements: function(currentEl, targetEl) {
    // Add morphing classes
    currentEl.classList.add('concept-section-morphing');
    targetEl.classList.add('concept-section-morphing');
    
    // Create overlay for current section
    const overlay = document.createElement('div');
    overlay.className = 'concept-morph-overlay';
    currentEl.appendChild(overlay);
    
    // Prepare images for morphing
    const currentImages = currentEl.querySelectorAll('.xb-image__img');
    const targetImages = targetEl.querySelectorAll('.xb-image__img');
    
    currentImages.forEach(img => img.classList.add('concept-image-morphing'));
    targetImages.forEach(img => {
      img.classList.add('concept-image-morphing', 'morph-in');
    });
    
    // Prepare text elements
    const currentTexts = currentEl.querySelectorAll('h1, h2, h3, p, .xb-text');
    const targetTexts = targetEl.querySelectorAll('h1, h2, h3, p, .xb-text');
    
    currentTexts.forEach(text => text.classList.add('concept-text-morphing'));
    targetTexts.forEach(text => {
      text.classList.add('concept-text-morphing', 'morph-in');
    });
  },
  
  // Morph out current section
  morphOutSection: function(currentEl) {
    return new Promise((resolve) => {
      // Trigger overlay
      currentEl.classList.add('concept-morph-active');
      
      // Morph out images
      const images = currentEl.querySelectorAll('.concept-image-morphing');
      images.forEach(img => img.classList.add('morph-out'));
      
      // Morph out texts
      const texts = currentEl.querySelectorAll('.concept-text-morphing');
      texts.forEach(text => text.classList.add('morph-out'));
      
      // Wait for animation to complete
      setTimeout(resolve, 400);
    });
  },
  
  // Switch sections
  switchSections: function(currentEl, targetEl) {
    // Hide current section
    currentEl.classList.remove('concepts-visible');
    currentEl.classList.add('concepts-hidden');
    
    // Show target section
    targetEl.classList.remove('concepts-hidden');
    targetEl.classList.add('concepts-visible', 'concept-section-switching');
  },
  
  // Morph in new section
  morphInSection: function(targetEl) {
    return new Promise((resolve) => {
      // Trigger morph in for images
      const images = targetEl.querySelectorAll('.concept-image-morphing');
      images.forEach((img, index) => {
        setTimeout(() => {
          img.classList.remove('morph-in');
          img.classList.add('morph-active');
        }, index * 100);
      });
      
      // Trigger morph in for texts
      const texts = targetEl.querySelectorAll('.concept-text-morphing');
      texts.forEach((text, index) => {
        setTimeout(() => {
          text.classList.remove('morph-in');
          text.classList.add('morph-active');
        }, index * 150 + 200);
      });
      
      // Wait for all animations to complete
      setTimeout(resolve, 800);
    });
  },
  
  // Cleanup morphing
  cleanupMorphing: function(targetEl) {
    // Remove all morphing classes
    document.querySelectorAll('.concept-section-morphing').forEach(el => {
      el.classList.remove('concept-section-morphing', 'concept-morph-active', 'concept-section-switching');
    });
    
    document.querySelectorAll('.concept-image-morphing').forEach(el => {
      el.classList.remove('concept-image-morphing', 'morph-out', 'morph-in', 'morph-active');
    });
    
    document.querySelectorAll('.concept-text-morphing').forEach(el => {
      el.classList.remove('concept-text-morphing', 'morph-out', 'morph-in', 'morph-active');
    });
    
    // Remove overlays
    document.querySelectorAll('.concept-morph-overlay').forEach(overlay => {
      overlay.remove();
    });
  },
  
  // Hide all sections (unchanged)
  hideAllSections: function() {
    document.querySelectorAll('.concepts-hidden, .concepts-visible').forEach(section => {
      section.classList.remove('concepts-visible', 'concepts-revealing');
      section.classList.add('concepts-hidden');
    });
  },
  
  // Scroll to section (unchanged)
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
