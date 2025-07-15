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

  // 2. HERO SECTION MASK ANIMATION
  const heroTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".hero-section",
      start: "top top",
      end: "+=50%",
      scrub: 2.5,
      pin: true,
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

  heroTl.fromTo(
    ".mask-wrapper",
    {
      maskPosition: "49% center",
      maskSize: "4100% 4100%",
    },
    {
      maskPosition: "50% center",
      maskSize: "15% 15%",
      duration: 1,
    }
  );

  // 3. CUSTOM GIF CURSOR
  const gifCursor = document.createElement("div");
  gifCursor.innerHTML = `<img src="https://cdn.shopify.com/s/files/1/0580/6994/2352/files/button5_blue_1.gif?v=1752294330">`;
  gifCursor.style.cssText = `
    position: fixed;
    width: 250px;
    height: 70px;
    pointer-events: none;
    z-index: 9999;
    display: none;
  `;
  document.body.appendChild(gifCursor);

  // 4. HOVER FUNCTIONALITY
  const targetImages = document.querySelectorAll(
    ".traditional-img img, .hybrid-img img, .modern-img img"
  );
  let loadedCount = 0;

  function enableHover() {
    document
      .querySelectorAll(".traditional-img, .hybrid-img, .modern-img")
      .forEach((img) => {
        img.addEventListener("mouseenter", () => {
          if (!allowHover) return;
          gifCursor.style.display = "block";
          document.body.style.cursor = "none";
        });

        img.addEventListener("mouseleave", () => {
          gifCursor.style.display = "none";
          document.body.style.cursor = "default";
        });

        img.addEventListener("mousemove", (e) => {
          if (!allowHover) return;
          gifCursor.style.left = e.clientX - 125 + "px";
          gifCursor.style.top = e.clientY - 35 + "px";
        });
      });
  }

  targetImages.forEach((img) => {
    if (img.complete) {
      loadedCount++;
    } else {
      img.addEventListener("load", () => {
        loadedCount++;
        if (loadedCount === targetImages.length) {
          enableHover();
        }
      });
    }
  });

  if (loadedCount === targetImages.length) {
    enableHover();
  }

  // 5. SMOOTH SCROLL FUNCTIONALITY (UPDATED)
  // Thay thế function scrollToSection cũ bằng cái này
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
        .to({}, { duration: 0.3 })
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
// 9. STICKY PRODUCT SCROLL FOR TRADITIONAL SECTION
// Thêm vào cuối file GSAP hiện tại
// ===========================================

window.addEventListener("load", () => {
  // Đợi tất cả ScrollTrigger khác initialize xong
  setTimeout(() => {
    initTraditionalStickyScroll();
  }, 100);
});

function initTraditionalStickyScroll() {
  const traditionalSection = document.getElementById('traditional-section');
  const productWrapper = traditionalSection?.querySelector('.kpr-product-wrapper');
  const productCards = traditionalSection?.querySelectorAll('.kpr-product-card');
  
  // Validation
  if (!traditionalSection || !productWrapper || !productCards.length) {
    console.log('🔍 Traditional sticky scroll: Required elements not found');
    return;
  }
  
  console.log('✅ Traditional sticky scroll initialized with', productCards.length, 'products');
  
  // Calculate scroll distance based on content
  const calculateScrollDistance = () => {
    const viewportHeight = window.innerHeight;
    const totalCardsHeight = Array.from(productCards).reduce((total, card) => {
      return total + card.offsetHeight + 30; // 30px gap
    }, 0);
    
    // Ensure enough distance to scroll through all products
    return Math.max(totalCardsHeight - viewportHeight + 300, 500);
  };
  
  // Set initial styles cho performance
  gsap.set(productWrapper, {
    position: 'relative',
    overflow: 'hidden'
  });
  
  gsap.set(productCards, {
    willChange: 'transform'
  });
  
  // Create sticky timeline
  const traditionalTl = gsap.timeline({
    scrollTrigger: {
      id: 'traditional-sticky', // Unique ID để không conflict
      trigger: traditionalSection,
      start: 'top top',
      end: () => {
        const scrollDistance = calculateScrollDistance();
        return `+=${scrollDistance * 2}`; // 2x multiplier cho smooth scroll
      },
      pin: true,
      pinSpacing: true,
      scrub: 1.5, // Smooth scrub
      anticipatePin: 1,
      
      // Callbacks để debug
      onEnter: () => {
        console.log('🔒 Traditional section pinned');
        // Optional: Disable allowHover nếu muốn
        // window.allowHover = false;
      },
      
      onLeave: () => {
        console.log('🔓 Traditional section unpinned');
        // window.allowHover = true;
      },
      
      onUpdate: (self) => {
        // Optional: Update progress
        const progress = Math.round(self.progress * 100);
        updateTraditionalProgress(progress);
      },
      
      // Tránh conflict với animations khác
      refreshPriority: -1,
    }
  });
  
  // Animate products moving up
  traditionalTl.to(productCards, {
    y: () => -calculateScrollDistance(),
    duration: 1,
    ease: 'none',
    stagger: 0, // Move all together
  });
  
  // Optional: Add subtle parallax cho background elements
  const bgElements = traditionalSection.querySelectorAll('.xb-image img');
  if (bgElements.length > 0) {
    traditionalTl.to(bgElements, {
      y: -100,
      duration: 1,
      ease: 'none',
    }, 0); // Start at same time
  }
  
  // Handle resize without affecting other ScrollTriggers
  let traditionalResizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(traditionalResizeTimeout);
    traditionalResizeTimeout = setTimeout(() => {
      // Only refresh traditional sticky ScrollTrigger
      ScrollTrigger.getById('traditional-sticky')?.refresh();
      console.log('🔄 Traditional sticky refreshed');
    }, 150);
  });
}

// Optional: Progress indicator chỉ cho traditional section
function createTraditionalProgress() {
  if (document.querySelector('.traditional-progress')) return;
  
  const progressHTML = `
    <div class="traditional-progress" style="
      position: fixed;
      bottom: 30px;
      right: 30px;
      background: rgba(18, 185, 57, 0.9);
      backdrop-filter: blur(10px);
      padding: 8px 16px;
      border-radius: 20px;
      color: white;
      font-size: 11px;
      font-weight: 600;
      z-index: 9998;
      display: none;
      border: 1px solid rgba(255,255,255,0.1);
    ">
      <div style="margin-bottom: 3px;">TRADITIONAL PRODUCTS</div>
      <div style="width: 120px; height: 2px; background: rgba(255,255,255,0.3); border-radius: 1px; overflow: hidden;">
        <div class="traditional-progress-fill" style="
          height: 100%;
          background: white;
          border-radius: 1px;
          width: 0%;
          transition: width 0.1s ease;
        "></div>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', progressHTML);
}

function updateTraditionalProgress(progress) {
  const progressBar = document.querySelector('.traditional-progress');
  const progressFill = document.querySelector('.traditional-progress-fill');
  
  if (progressBar && progressFill) {
    if (progress > 5 && progress < 95) {
      progressBar.style.display = 'block';
      progressFill.style.width = `${progress}%`;
    } else {
      progressBar.style.display = 'none';
    }
  }
}

// Initialize progress bar
window.addEventListener("load", () => {
  setTimeout(() => {
    createTraditionalProgress();
  }, 200);
});


// ===========================================
// 9. ENHANCED STICKY PRODUCT SCROLL FOR TRADITIONAL SECTION
// With customizable start position and floating products effect
// ===========================================

let traditionalStickyInitialized = false;
let traditionalScrollTrigger = null;

// ⚙️ CONFIGURATION - Customize these values
const TRADITIONAL_CONFIG = {
  // Điều chỉnh vị trí bắt đầu sticky (0-1, 0 = top, 1 = bottom)
  stickyStartOffset: 0.2, // Section sẽ sticky khi 20% section visible
  
  // Điều chỉnh tốc độ scroll
  scrollMultiplier: 2.5,
  
  // Float effect settings
  enableFloatEffect: true,
  floatDistance: -200, // Negative = bay lên trên
  floatOpacity: 0.3,
  floatScale: 0.8,
  
  // Animation settings
  scrubSmoothness: 1.5,
  anticipatePin: 1,
};

window.addEventListener("load", () => {
  // Monitor scroll position để không conflict với hero scroll
  monitorHeroScrollCompletion();
});

function monitorHeroScrollCompletion() {
  const heroSection = document.querySelector(".hero-section.mask-wrapper") || 
                     document.querySelector(".hero-section");
  
  if (!heroSection) {
    setTimeout(() => initTraditionalStickyScroll(), 100);
    return;
  }
  
  const viewportHeight = window.innerHeight;
  const heroAnimationEnd = viewportHeight * 0.5;
  
  console.log('🎯 Monitoring hero completion at:', heroAnimationEnd);
  
  ScrollTrigger.create({
    trigger: "body",
    start: 0,
    end: "max",
    onUpdate: (self) => {
      const currentScroll = window.pageYOffset;
      
      if (currentScroll > heroAnimationEnd + 100 && !traditionalStickyInitialized) {
        console.log('✅ Hero scroll completed, initializing traditional sticky...');
        traditionalStickyInitialized = true;
        setTimeout(() => {
          initTraditionalStickyScroll();
        }, 200);
      }
      
      if (currentScroll < heroAnimationEnd && traditionalStickyInitialized && traditionalScrollTrigger) {
        console.log('🔄 User scrolled back to hero, disabling sticky temporarily');
        disableTraditionalSticky();
      }
    }
  });
}

function initTraditionalStickyScroll() {
  const viewportHeight = window.innerHeight;
  const heroAnimationEnd = viewportHeight * 0.5;
  const currentScroll = window.pageYOffset;
  
  if (currentScroll < heroAnimationEnd) {
    console.log('⏳ Still in hero area, postponing sticky init');
    traditionalStickyInitialized = false;
    return;
  }
  
  const traditionalSection = document.getElementById('traditional-section');
  const productWrapper = traditionalSection?.querySelector('.kpr-product-wrapper');
  const productCards = traditionalSection?.querySelectorAll('.kpr-product-card');
  
  if (!traditionalSection || !productWrapper || !productCards.length) {
    console.log('🔍 Traditional sticky: Required elements not found');
    return;
  }
  
  console.log('✅ Traditional sticky initialized with', productCards.length, 'products');
  
  // Calculate scroll distance
  const calculateScrollDistance = () => {
    const viewportHeight = window.innerHeight;
    const totalCardsHeight = Array.from(productCards).reduce((total, card) => {
      return total + card.offsetHeight + 30;
    }, 0);
    
    return Math.max(totalCardsHeight - viewportHeight + 400, 600);
  };
  
  // 🎨 Setup container for floating effect
  gsap.set(productWrapper, {
    position: 'relative',
    overflow: TRADITIONAL_CONFIG.enableFloatEffect ? 'visible' : 'hidden', // Allow overflow for float effect
  });
  
  gsap.set(productCards, {
    willChange: 'transform',
    transformOrigin: 'center center',
  });
  
  // 🚀 Create enhanced timeline with floating effect
  const traditionalTl = gsap.timeline();
  
  // Main scroll animation
  traditionalTl.to(productCards, {
    y: () => -calculateScrollDistance(),
    duration: 1,
    ease: 'none',
  });
  
  // 🌟 Float effect - products bay lên trên khi scroll qua
  if (TRADITIONAL_CONFIG.enableFloatEffect) {
    productCards.forEach((card, index) => {
      // Create individual float timeline for each card
      ScrollTrigger.create({
        trigger: card,
        start: 'bottom center', // Khi card scroll qua center
        end: 'bottom top-=100',
        scrub: 1,
        onUpdate: (self) => {
          // Calculate float progress (0 to 1)
          const progress = self.progress;
          
          // Apply floating effect
          gsap.to(card, {
            y: `+=${TRADITIONAL_CONFIG.floatDistance * progress}`,
            opacity: 1 - (progress * (1 - TRADITIONAL_CONFIG.floatOpacity)),
            scale: 1 - (progress * (1 - TRADITIONAL_CONFIG.floatScale)),
            duration: 0.1,
            ease: 'none',
          });
        },
        id: `traditional-float-${index}`,
      });
    });
  }
  
  // 📌 Create main sticky ScrollTrigger with custom start position
  traditionalScrollTrigger = ScrollTrigger.create({
    id: 'traditional-sticky',
    trigger: traditionalSection,
    start: `top+=${TRADITIONAL_CONFIG.stickyStartOffset * 100}% top`, // Customizable start
    end: () => {
      const scrollDistance = calculateScrollDistance();
      return `+=${scrollDistance * TRADITIONAL_CONFIG.scrollMultiplier}`;
    },
    pin: true,
    pinSpacing: true,
    scrub: TRADITIONAL_CONFIG.scrubSmoothness,
    anticipatePin: TRADITIONAL_CONFIG.anticipatePin,
    animation: traditionalTl,
    
    onEnter: () => {
      console.log('🔒 Traditional section pinned at custom offset:', TRADITIONAL_CONFIG.stickyStartOffset);
    },
    
    onLeave: () => {
      console.log('🔓 Traditional section unpinned');
    },
    
    onUpdate: (self) => {
      const progress = Math.round(self.progress * 100);
      updateTraditionalProgress(progress);
    },
    
    refreshPriority: -2,
  });
  
  // Handle resize
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (traditionalScrollTrigger) {
        traditionalScrollTrigger.refresh();
        // Refresh float triggers
        if (TRADITIONAL_CONFIG.enableFloatEffect) {
          productCards.forEach((card, index) => {
            ScrollTrigger.getById(`traditional-float-${index}`)?.refresh();
          });
        }
        console.log('🔄 Traditional sticky and float effects refreshed');
      }
    }, 150);
  });
}

function disableTraditionalSticky() {
  if (traditionalScrollTrigger) {
    traditionalScrollTrigger.kill();
    traditionalScrollTrigger = null;
    
    // Kill float effects
    const productCards = document.querySelectorAll('#traditional-section .kpr-product-card');
    productCards.forEach((card, index) => {
      ScrollTrigger.getById(`traditional-float-${index}`)?.kill();
    });
    
    console.log('❌ Traditional sticky and float effects disabled');
  }
  traditionalStickyInitialized = false;
}

// Override existing scrollToSection
const originalScrollToSection = window.scrollToSection;

window.scrollToSection = function(targetId) {
  console.log('📍 Scrolling to section:', targetId);
  
  if (traditionalScrollTrigger && targetId === 'traditional-section') {
    console.log('⏸️ Temporarily disabling sticky for smooth navigation');
    disableTraditionalSticky();
    
    setTimeout(() => {
      if (window.pageYOffset > window.innerHeight * 0.5) {
        traditionalStickyInitialized = false;
        setTimeout(() => initTraditionalStickyScroll(), 500);
      }
    }, 3000);
  }
  
  if (originalScrollToSection) {
    return originalScrollToSection(targetId);
  }
  
  // Fallback logic (same as before)
  const targetElement = document.getElementById(targetId);
  if (!targetElement) {
    console.warn("Target element not found:", targetId);
    return;
  }

  const currentScroll = window.pageYOffset;
  const targetScroll = targetElement.offsetTop;
  const heroSection = document.querySelector(".hero-section.mask-wrapper") || 
                     document.querySelector(".hero-section");
  const viewportHeight = window.innerHeight;
  const heroAnimationEnd = viewportHeight * 0.5;

  const targetElements = targetElement.querySelectorAll(
    "img, h1, h2, h3, p, .btn, .card, .xb-image, .xb-column"
  );
  gsap.set(targetElements, { opacity: 0, y: 30 });

  const scrollTl = gsap.timeline();

  if (currentScroll < heroAnimationEnd) {
    scrollTl
      .to(window, {
        scrollTo: { y: heroAnimationEnd + 50 },
        duration: 0.3,
        ease: "power3.out",
      })
      .to({}, { duration: 0.3 })
      .to(window, {
        scrollTo: { y: targetScroll },
        duration: 1.5,
        ease: "power2.out",
      })
      .to(targetElements, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
      }, "-=0.5");
  } else {
    scrollTl
      .to(window, {
        scrollTo: { y: targetScroll },
        duration: 2,
        ease: "power2.inOut",
      })
      .to(targetElements, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: "power2.out",
      }, "-=0.3");
  }
};

// Progress bar functions
function createTraditionalProgress() {
  if (document.querySelector('.traditional-progress')) return;
  
  const progressHTML = `
    <div class="traditional-progress" style="
      position: fixed;
      bottom: 30px;
      right: 30px;
      background: rgba(18, 185, 57, 0.9);
      backdrop-filter: blur(10px);
      padding: 8px 16px;
      border-radius: 20px;
      color: white;
      font-size: 11px;
      font-weight: 600;
      z-index: 9998;
      display: none;
      border: 1px solid rgba(255,255,255,0.1);
    ">
      <div style="margin-bottom: 3px;">TRADITIONAL PRODUCTS</div>
      <div style="width: 120px; height: 2px; background: rgba(255,255,255,0.3); border-radius: 1px; overflow: hidden;">
        <div class="traditional-progress-fill" style="
          height: 100%;
          background: white;
          border-radius: 1px;
          width: 0%;
          transition: width 0.1s ease;
        "></div>
      </div>
    </div>
  `;
  
  document.body.insertAdjacentHTML('beforeend', progressHTML);
}

function updateTraditionalProgress(progress) {
  const progressBar = document.querySelector('.traditional-progress');
  const progressFill = document.querySelector('.traditional-progress-fill');
  
  if (progressBar && progressFill) {
    if (progress > 5 && progress < 95) {
      progressBar.style.display = 'block';
      progressFill.style.width = `${progress}%`;
    } else {
      progressBar.style.display = 'none';
    }
  }
}

// Initialize progress bar
window.addEventListener("load", () => {
  setTimeout(() => {
    createTraditionalProgress();
  }, 200);
});

// ===========================================
// 10. CONFIGURATION & UTILITY FUNCTIONS
// ===========================================

// 🛠️ Update configuration at runtime
window.updateTraditionalConfig = function(newConfig) {
  Object.assign(TRADITIONAL_CONFIG, newConfig);
  console.log('📝 Traditional config updated:', TRADITIONAL_CONFIG);
  
  // Refresh if already initialized
  if (traditionalScrollTrigger) {
    window.resetTraditionalScroll();
  }
};

// Example usage:
// window.updateTraditionalConfig({
//   stickyStartOffset: 0.5, // Start sticky when 50% of section is visible
//   floatDistance: -300,    // Float further up
//   floatOpacity: 0.1       // More transparent when floating
// });

window.refreshTraditionalScroll = function() {
  if (traditionalScrollTrigger) {
    traditionalScrollTrigger.refresh();
    console.log('🔄 Traditional scroll refreshed');
  } else {
    console.log('❌ Traditional ScrollTrigger not active');
  }
};

window.resetTraditionalScroll = function() {
  disableTraditionalSticky();
  traditionalStickyInitialized = false;
  setTimeout(() => {
    if (window.pageYOffset > window.innerHeight * 0.5) {
      initTraditionalStickyScroll();
    }
  }, 100);
};

// 🎛️ Live configuration panel (for testing)
window.showTraditionalConfig = function() {
  console.log('🎛️ Traditional Scroll Configuration:');
  console.log('stickyStartOffset:', TRADITIONAL_CONFIG.stickyStartOffset, '(0-1, 0=top, 1=bottom)');
  console.log('scrollMultiplier:', TRADITIONAL_CONFIG.scrollMultiplier, '(higher = slower scroll)');
  console.log('enableFloatEffect:', TRADITIONAL_CONFIG.enableFloatEffect);
  console.log('floatDistance:', TRADITIONAL_CONFIG.floatDistance, '(negative = up, positive = down)');
  console.log('floatOpacity:', TRADITIONAL_CONFIG.floatOpacity, '(0-1)');
  console.log('floatScale:', TRADITIONAL_CONFIG.floatScale, '(0-1)');
};
