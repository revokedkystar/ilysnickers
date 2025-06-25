// Enhanced JavaScript with improved functionality and performance
class VolumeController {
  constructor() {
    this.video = document.getElementById("bg-video");
    this.volumeSlider = document.getElementById("volume-slider");
    this.sliderFill = document.querySelector(".slider-fill");
    this.sliderThumb = document.querySelector(".slider-thumb");
    this.muteIcon = document.getElementById("mute-icon");
    this.maxVolumeIcon = document.getElementById("max-volume-icon");
    
    this.currentVolume = 0.5;
    this.previousVolume = 0.5;
    this.isInitialized = false;
    
    this.init();
  }
  
  init() {
    if (!this.video) return;
    
    // Set initial volume
    this.video.volume = this.currentVolume;
    this.updateVolumeDisplay(this.currentVolume);
    
    // Bind events
    this.bindEvents();
    
    // Enable audio on first user interaction
    this.enableAudioOnInteraction();
  }
  
  bindEvents() {
    // Volume slider control
    this.volumeSlider?.addEventListener("input", (e) => {
      this.setVolume(parseFloat(e.target.value));
    });
    
    // Mute button
    this.muteIcon?.addEventListener("click", () => {
      this.toggleMute();
    });
    
    // Max volume button
    this.maxVolumeIcon?.addEventListener("click", () => {
      this.setVolume(1);
    });
    
    // Keyboard controls
    document.addEventListener("keydown", (e) => {
      if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') return;
      
      switch(e.key) {
        case 'ArrowUp':
          e.preventDefault();
          this.adjustVolume(0.1);
          break;
        case 'ArrowDown':
          e.preventDefault();
          this.adjustVolume(-0.1);
          break;
        case 'm':
        case 'M':
          this.toggleMute();
          break;
      }
    });
  }
  
  enableAudioOnInteraction() {
    const enableAudio = () => {
      if (this.video.muted) {
        this.video.muted = false;
        this.video.volume = this.currentVolume;
        this.updateVolumeDisplay(this.currentVolume);
        this.isInitialized = true;
      }
      document.removeEventListener("click", enableAudio);
      document.removeEventListener("keydown", enableAudio);
    };
    
    document.addEventListener("click", enableAudio);
    document.addEventListener("keydown", enableAudio);
  }
  
  setVolume(value) {
    this.currentVolume = Math.max(0, Math.min(1, value));
    
    if (this.video) {
      this.video.volume = this.currentVolume;
      if (this.video.muted && this.currentVolume > 0) {
        this.video.muted = false;
      }
    }
    
    if (this.volumeSlider) {
      this.volumeSlider.value = this.currentVolume;
    }
    
    this.updateVolumeDisplay(this.currentVolume);
    this.updateVolumeIcons();
  }
  
  adjustVolume(delta) {
    this.setVolume(this.currentVolume + delta);
  }
  
  toggleMute() {
    if (this.currentVolume === 0) {
      this.setVolume(this.previousVolume || 0.5);
    } else {
      this.previousVolume = this.currentVolume;
      this.setVolume(0);
    }
  }
  
  updateVolumeDisplay(value) {
    const percentage = Math.round(value * 100);
    
    if (this.sliderFill) {
      this.sliderFill.style.width = `${percentage}%`;
    }
    
    if (this.sliderThumb) {
      this.sliderThumb.style.left = `calc(${percentage}% - 8px)`;
    }
  }
  
  updateVolumeIcons() {
    const volume = this.currentVolume;
    
    if (this.muteIcon) {
      this.muteIcon.style.opacity = volume === 0 ? '1' : '0.6';
    }
    
    if (this.maxVolumeIcon) {
      this.maxVolumeIcon.style.opacity = volume === 1 ? '1' : '0.6';
    }
  }
}

class CommentSystem {
  constructor() {
    this.commentForm = document.getElementById("comment-form");
    this.commentInput = document.getElementById("comment-input");
    this.commentsContainer = document.querySelector(".comments-container");
    this.comments = this.loadComments();
    
    this.init();
  }
  
  init() {
    if (!this.commentForm) return;
    
    this.bindEvents();
    this.renderComments();
  }
  
  bindEvents() {
    this.commentForm.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleSubmit();
    });
    
    // Auto-resize textarea
    if (this.commentInput) {
      this.commentInput.addEventListener("input", () => {
        this.autoResizeTextarea();
      });
    }
    
    // Keyboard shortcuts
    document.addEventListener("keydown", (e) => {
      if (e.ctrlKey && e.key === 'Enter' && document.activeElement === this.commentInput) {
        e.preventDefault();
        this.handleSubmit();
      }
    });
  }
  
  handleSubmit() {
    const commentText = this.commentInput.value.trim();
    
    if (!commentText) {
      this.showFeedback("Please enter a comment", "error");
      return;
    }
    
    if (commentText.length > 500) {
      this.showFeedback("Comment is too long (max 500 characters)", "error");
      return;
    }
    
    const comment = {
      id: Date.now(),
      text: commentText,
      timestamp: new Date().toISOString(),
      likes: 0
    };
    
    this.addComment(comment);
    this.commentInput.value = "";
    this.autoResizeTextarea();
    this.showFeedback("Comment added successfully!", "success");
  }
  
  addComment(comment) {
    this.comments.unshift(comment);
    this.saveComments();
    this.renderComments();
  }
  
  renderComments() {
    if (!this.commentsContainer) return;
    
    if (this.comments.length === 0) {
      this.commentsContainer.innerHTML = `
        <div class="no-comments">
          <p style="text-align: center; color: var(--neutral-400); font-style: italic;">
            No comments yet. Be the first to share your thoughts!
          </p>
        </div>
      `;
      return;
    }
    
    this.commentsContainer.innerHTML = this.comments
      .map(comment => this.createCommentHTML(comment))
      .join("");
  }
  
  createCommentHTML(comment) {
    const timeAgo = this.getTimeAgo(comment.timestamp);
    
    return `
      <div class="comment" data-id="${comment.id}">
        <div class="comment-content">
          <p>${this.escapeHtml(comment.text)}</p>
        </div>
        <div class="comment-meta">
          <span class="comment-time">${timeAgo}</span>
        </div>
      </div>
    `;
  }
  
  autoResizeTextarea() {
    if (!this.commentInput) return;
    
    this.commentInput.style.height = 'auto';
    this.commentInput.style.height = Math.min(this.commentInput.scrollHeight, 200) + 'px';
  }
  
  showFeedback(message, type = "info") {
    // Remove existing feedback
    const existingFeedback = document.querySelector(".feedback-message");
    if (existingFeedback) {
      existingFeedback.remove();
    }
    
    const feedback = document.createElement("div");
    feedback.className = `feedback-message feedback-${type}`;
    feedback.textContent = message;
    feedback.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 20px;
      border-radius: 8px;
      color: white;
      font-weight: 500;
      z-index: 1000;
      animation: slideIn 0.3s ease-out;
      background: ${type === 'error' ? 'var(--error-500)' : 'var(--success-500)'};
      box-shadow: var(--shadow-lg);
    `;
    
    document.body.appendChild(feedback);
    
    setTimeout(() => {
      feedback.style.animation = "slideOut 0.3s ease-in forwards";
      setTimeout(() => feedback.remove(), 300);
    }, 3000);
  }
  
  getTimeAgo(timestamp) {
    const now = new Date();
    const commentTime = new Date(timestamp);
    const diffInSeconds = Math.floor((now - commentTime) / 1000);
    
    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  }
  
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  loadComments() {
    try {
      const saved = localStorage.getItem('ks-comments');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.warn('Failed to load comments from localStorage:', error);
      return [];
    }
  }
  
  saveComments() {
    try {
      localStorage.setItem('ks-comments', JSON.stringify(this.comments));
    } catch (error) {
      console.warn('Failed to save comments to localStorage:', error);
    }
  }
}

class TypewriterEffect {
  constructor(element, options = {}) {
    this.element = element;
    this.options = {
      speed: 100,
      deleteSpeed: 50,
      pauseTime: 2000,
      loop: false,
      ...options
    };
    
    this.originalText = element.textContent;
    this.isComplete = false;
    
    this.init();
  }
  
  init() {
    if (!this.element) return;
    
    // Reset element
    this.element.textContent = '';
    this.element.style.width = '0';
    
    // Start typing animation
    this.typeText();
  }
  
  async typeText() {
    const text = this.originalText;
    
    for (let i = 0; i <= text.length; i++) {
      this.element.textContent = text.slice(0, i);
      this.element.style.width = 'auto';
      
      if (i < text.length) {
        await this.delay(this.options.speed);
      }
    }
    
    this.isComplete = true;
    
    // Remove cursor after completion
    setTimeout(() => {
      this.element.style.borderRight = 'none';
    }, 1000);
  }
  
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

class NavigationEnhancer {
  constructor() {
    this.init();
  }
  
  init() {
    this.enhanceButtons();
    this.addKeyboardNavigation();
    this.addPageTransitions();
  }
  
  enhanceButtons() {
    const buttons = document.querySelectorAll('button[onclick]');
    
    buttons.forEach(button => {
      // Add loading state
      button.addEventListener('click', (e) => {
        if (button.onclick) {
          button.style.opacity = '0.7';
          button.style.pointerEvents = 'none';
          
          setTimeout(() => {
            button.style.opacity = '';
            button.style.pointerEvents = '';
          }, 500);
        }
      });
      
      // Add ripple effect
      button.addEventListener('click', (e) => {
        this.createRipple(e, button);
      });
    });
  }
  
  createRipple(event, element) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple 0.6s ease-out;
      pointer-events: none;
    `;
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
  }
  
  addKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
      switch(e.key) {
        case '1':
          if (e.altKey) {
            e.preventDefault();
            window.location.href = 'index.html';
          }
          break;
        case '2':
          if (e.altKey) {
            e.preventDefault();
            window.location.href = 'timeline.html';
          }
          break;
        case '3':
          if (e.altKey) {
            e.preventDefault();
            window.location.href = 'comments.html';
          }
          break;
      }
    });
  }
  
  addPageTransitions() {
    // Add smooth page transitions
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes slideOut {
        from {
          opacity: 1;
          transform: translateY(0);
        }
        to {
          opacity: 0;
          transform: translateY(-20px);
        }
      }
      
      @keyframes ripple {
        to {
          transform: scale(2);
          opacity: 0;
        }
      }
      
      body {
        animation: slideIn 0.5s ease-out;
      }
    `;
    document.head.appendChild(style);
  }
}

// Performance optimization
class PerformanceOptimizer {
  constructor() {
    this.init();
  }
  
  init() {
    this.optimizeVideo();
    this.addIntersectionObserver();
    this.preloadCriticalResources();
  }
  
  optimizeVideo() {
    const video = document.getElementById('bg-video');
    if (!video) return;
    
    // Reduce video quality on mobile
    if (window.innerWidth < 768) {
      video.style.filter += ' blur(1px)';
    }
    
    // Pause video when page is not visible
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        video.pause();
      } else {
        video.play();
      }
    });
  }
  
  addIntersectionObserver() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '50px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animation = 'slideIn 0.6s ease-out forwards';
        }
      });
    }, observerOptions);
    
    // Observe timeline milestones
    document.querySelectorAll('.milestone').forEach(milestone => {
      observer.observe(milestone);
    });
  }
  
  preloadCriticalResources() {
    // Preload fonts
    const fontPreload = document.createElement('link');
    fontPreload.rel = 'preload';
    fontPreload.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap';
    fontPreload.as = 'style';
    document.head.appendChild(fontPreload);
  }
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Initialize core functionality
  new VolumeController();
  new CommentSystem();
  new NavigationEnhancer();
  new PerformanceOptimizer();
  
  // Initialize typewriter effect
  const typewriterElement = document.getElementById("typewriter");
  if (typewriterElement) {
    new TypewriterEffect(typewriterElement, {
      speed: 80,
      loop: false
    });
  }
  
  // Add accessibility improvements
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-navigation');
    }
  });
  
  document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
  });
});

// Error handling
window.addEventListener('error', (e) => {
  console.warn('JavaScript error caught:', e.error);
});

// Service worker registration for offline functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}