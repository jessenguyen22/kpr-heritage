// assets/kpr-concept-navigation.js

class KPRConceptNavigation {
  constructor() {
    this.currentConcept = null;
    this.conceptSections = {};
    this.sidebar = null;
    this.init();
  }

  init() {
    this.findConceptSections();
    this.createSidebar();
    this.bindEvents();
    console.log('KPR Concept Navigation initialized');
  }

  findConceptSections() {
    // Find all concept sections
    const sections = document.querySelectorAll('[data-concept-section]');
    sections.forEach(section => {
      const conceptName = section.dataset.conceptSection;
      this.conceptSections[conceptName] = section;
      
      // Hide all concept sections initially
      section.style.display = 'none';
    });
    
    console.log('Found concept sections:', Object.keys(this.conceptSections));
  }

  createSidebar() {
    // Create floating sidebar for concept navigation
    this.sidebar = document.createElement('div');
    this.sidebar.className = 'kpr-concept-sidebar';
    this.sidebar.innerHTML = `
      <div class="kpr-sidebar__content">
        <button class="kpr-sidebar__btn" data-concept="traditional">
          <span>Traditional</span>
        </button>
        <button class="kpr-sidebar__btn" data-concept="hybrid">
          <span>Hybrid</span>
        </button>
        <button class="kpr-sidebar__btn" data-concept="modern">
          <span>Modern</span>
        </button>
        <button class="kpr-sidebar__close">
          <span>✕</span>
        </button>
      </div>
    `;

    // Add sidebar styles
    this.addSidebarStyles();
    
    // Initially hidden
    this.sidebar.style.display = 'none';
    document.body.appendChild(this.sidebar);
  }

  addSidebarStyles() {
    if (document.getElementById('kpr-sidebar-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'kpr-sidebar-styles';
    styles.textContent = `
      .kpr-concept-sidebar {
        position: fixed;
        top: 50%;
        left: 30px;
        transform: translateY(-50%);
        z-index: 1000;
        background: rgba(0, 0, 0, 0.9);
        backdrop-filter: blur(10px);
        border-radius: 15px;
        padding: 20px 15px;
        transition: all 0.3s ease;
      }

      .kpr-sidebar__content {
        display: flex;
        flex-direction: column;
        gap: 15px;
        align-items: center;
      }

      .kpr-sidebar__btn {
        background: transparent;
        border: 2px solid rgba(255, 255, 255, 0.3);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 14px;
        white-space: nowrap;
        min-width: 100px;
      }

      .kpr-sidebar__btn:hover,
      .kpr-sidebar__btn.active {
        background: rgba(255, 255, 255, 0.2);
        border-color: rgba(255, 255, 255, 0.6);
        transform: scale(1.05);
      }

      .kpr-sidebar__close {
        background: transparent;
        border: 1px solid rgba(255, 255, 255, 0.3);
        color: white;
        width: 35px;
        height: 35px;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 10px;
        transition: all 0.3s ease;
      }

      .kpr-sidebar__close:hover {
        background: rgba(255, 0, 0, 0.3);
        border-color: rgba(255, 0, 0, 0.6);
      }

      @media (max-width: 768px) {
        .kpr-concept-sidebar {
          left: 15px;
          padding: 15px 10px;
        }
        
        .kpr-sidebar__btn {
          padding: 10px 15px;
          font-size: 12px;
          min-width: 80px;
        }
      }
    `;
    
    document.head.appendChild(styles);
  }

  bindEvents() {
    // Listen for concept change events from hero
    document.addEventListener('kprConceptChanged', (e) => {
      this.switchToConcept(e.detail.concept);
    });

    // Sidebar navigation events
    this.sidebar.addEventListener('click', (e) => {
      if (e.target.matches('.kpr-sidebar__btn')) {
        const concept = e.target.dataset.concept;
        this.switchToConcept(concept);
      }
      
      if (e.target.matches('.kpr-sidebar__close') || e.target.closest('.kpr-sidebar__close')) {
        this.closeConcepts();
      }
    });

    // ESC key to close concepts
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.currentConcept) {
        this.closeConcepts();
      }
    });
  }

  switchToConcept(conceptName) {
    console.log(`Switching to concept: ${conceptName}`);

    // Hide current concept
    if (this.currentConcept && this.conceptSections[this.currentConcept]) {
      this.hideSection(this.conceptSections[this.currentConcept]);
    }

    // Show new concept
    if (this.conceptSections[conceptName]) {
      this.showSection(this.conceptSections[conceptName]);
      this.currentConcept = conceptName;
      
      // Show sidebar
      this.showSidebar();
      
      // Update active button
      this.updateSidebarActive(conceptName);
    } else {
      console.warn(`Concept section "${conceptName}" not found`);
    }
  }

  showSection(section) {
    section.style.display = 'block';
    section.style.opacity = '0';
    
    setTimeout(() => {
      section.style.transition = 'opacity 0.8s ease-in';
      section.style.opacity = '1';
    }, 100);
  }

  hideSection(section) {
    section.style.transition = 'opacity 0.5s ease-out';
    section.style.opacity = '0';
    
    setTimeout(() => {
      section.style.display = 'none';
    }, 500);
  }

  showSidebar() {
    this.sidebar.style.display = 'block';
    setTimeout(() => {
      this.sidebar.style.opacity = '1';
    }, 100);
  }

  hideSidebar() {
    this.sidebar.style.opacity = '0';
    setTimeout(() => {
      this.sidebar.style.display = 'none';
    }, 300);
  }

  updateSidebarActive(conceptName) {
    // Remove active from all buttons
    this.sidebar.querySelectorAll('.kpr-sidebar__btn').forEach(btn => {
      btn.classList.remove('active');
    });
    
    // Add active to current concept
    const activeBtn = this.sidebar.querySelector(`[data-concept="${conceptName}"]`);
    if (activeBtn) {
      activeBtn.classList.add('active');
    }
  }

  closeConcepts() {
    console.log('Closing concepts, returning to hero');

    // Hide current concept
    if (this.currentConcept && this.conceptSections[this.currentConcept]) {
      this.hideSection(this.conceptSections[this.currentConcept]);
    }

    // Hide sidebar
    this.hideSidebar();

    // Show hero section
    const heroSection = document.querySelector('[data-section-type="kpr-hero"]');
    if (heroSection) {
      heroSection.style.display = 'flex';
      setTimeout(() => {
        heroSection.style.transition = 'opacity 0.8s ease-in';
        heroSection.style.opacity = '1';
      }, 100);
    }

    // Reset current concept
    this.currentConcept = null;
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  new KPRConceptNavigation();
});

// Handle section load in theme editor
document.addEventListener('shopify:section:load', function() {
  // Re-initialize if needed
  if (!window.kprNavigation) {
    window.kprNavigation = new KPRConceptNavigation();
  }
});