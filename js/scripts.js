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
    this.usernameInput = document.getElementById("username-input");
    this.commentInput = document.getElementById("comment-input");
    this.commentsContainer = document.querySelector(".comments-list");
    this.commentCount = document.querySelector(".comment-count");
    this.loadingIndicator = document.querySelector(".loading-indicator");
    this.noMoreComments = document.querySelector(".no-more-comments");
    this.submitBtn = document.querySelector(".submit-btn");
    this.btnText = document.querySelector(".btn-text");
    this.btnLoading = document.querySelector(".btn-loading");
    
    this.currentPage = 1;
    this.isLoading = false;
    this.hasMore = true;
    this.totalComments = 0;
    
    this.init();
  }
  
  init() {
    if (!this.commentForm) return;
    
    this.bindEvents();
    this.loadComments();
    this.setupInfiniteScroll();
  }
  
  bindEvents() {
    // Form submission
    this.commentForm.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleSubmit();
    });
    
    // Real-time validation
    if (this.usernameInput) {
      this.usernameInput.addEventListener("input", () => {
        this.validateUsername();
      });
      
      this.usernameInput.addEventListener("blur", () => {
        this.validateUsername();
      });
    }
    
    if (this.commentInput) {
      this.commentInput.addEventListener("input", () => {
        this.validateComment();
        this.updateCharCount();
        this.autoResizeTextarea();
      });
      
      this.commentInput.addEventListener("blur", () => {
        this.validateComment();
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
  
  validateUsername() {
    const username = this.usernameInput.value.trim();
    const errorElement = document.getElementById("username-error");
    
    let isValid = true;
    let errorMessage = "";
    
    if (!username) {
      isValid = false;
      errorMessage = "Name is required";
    } else if (username.length < 2) {
      isValid = false;
      errorMessage = "Name must be at least 2 characters";
    } else if (username.length > 50) {
      isValid = false;
      errorMessage = "Name must be less than 50 characters";
    } else if (!/^[a-zA-Z0-9\s]+$/.test(username)) {
      isValid = false;
      errorMessage = "Name can only contain letters, numbers, and spaces";
    }
    
    this.updateValidationState(this.usernameInput, errorElement, isValid, errorMessage);
    return isValid;
  }
  
  validateComment() {
    const comment = this.commentInput.value.trim();
    const errorElement = document.getElementById("comment-error");
    
    let isValid = true;
    let errorMessage = "";
    
    if (!comment) {
      isValid = false;
      errorMessage = "Comment is required";
    } else if (comment.length < 10) {
      isValid = false;
      errorMessage = "Comment must be at least 10 characters";
    } else if (comment.length > 500) {
      isValid = false;
      errorMessage = "Comment must be less than 500 characters";
    }
    
    this.updateValidationState(this.commentInput, errorElement, isValid, errorMessage);
    return isValid;
  }
  
  updateValidationState(input, errorElement, isValid, errorMessage) {
    if (isValid) {
      input.classList.remove("error");
      input.classList.add("success");
      errorElement.textContent = "";
      errorElement.classList.remove("show");
    } else {
      input.classList.remove("success");
      input.classList.add("error");
      errorElement.textContent = errorMessage;
      errorElement.classList.add("show");
    }
  }
  
  updateCharCount() {
    const charCount = document.querySelector(".char-count");
    if (charCount && this.commentInput) {
      const count = this.commentInput.value.length;
      charCount.textContent = `${count}/500 characters`;
      
      if (count > 450) {
        charCount.style.color = "var(--warning-500)";
      } else if (count > 500) {
        charCount.style.color = "var(--error-500)";
      } else {
        charCount.style.color = "var(--neutral-400)";
      }
    }
  }
  
  autoResizeTextarea() {
    if (!this.commentInput) return;
    
    this.commentInput.style.height = 'auto';
    this.commentInput.style.height = Math.min(this.commentInput.scrollHeight, 200) + 'px';
  }
  
  async handleSubmit() {
    // Validate form
    const isUsernameValid = this.validateUsername();
    const isCommentValid = this.validateComment();
    
    if (!isUsernameValid || !isCommentValid) {
      this.showToast("Please fix the errors above", "error");
      return;
    }
    
    const username = this.usernameInput.value.trim();
    const commentText = this.commentInput.value.trim();
    
    // Set loading state
    this.setSubmitLoading(true);
    
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          comment_text: commentText
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        this.showToast("Comment added successfully!", "success");
        this.resetForm();
        this.refreshComments();
      } else {
        throw new Error(data.error || 'Failed to submit comment');
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
      this.showToast(error.message || "Failed to submit comment. Please try again.", "error");
    } finally {
      this.setSubmitLoading(false);
    }
  }
  
  setSubmitLoading(loading) {
    if (loading) {
      this.submitBtn.disabled = true;
      this.btnText.style.display = 'none';
      this.btnLoading.style.display = 'flex';
    } else {
      this.submitBtn.disabled = false;
      this.btnText.style.display = 'inline';
      this.btnLoading.style.display = 'none';
    }
  }
  
  resetForm() {
    this.usernameInput.value = '';
    this.commentInput.value = '';
    this.usernameInput.classList.remove('success', 'error');
    this.commentInput.classList.remove('success', 'error');
    document.getElementById('username-error').classList.remove('show');
    document.getElementById('comment-error').classList.remove('show');
    this.updateCharCount();
    this.autoResizeTextarea();
  }
  
  async loadComments(page = 1, append = false) {
    if (this.isLoading) return;
    
    this.isLoading = true;
    this.showLoading(true);
    
    try {
      const response = await fetch(`/api/comments?page=${page}&limit=5`);
      const data = await response.json();
      
      if (response.ok) {
        this.totalComments = data.totalCount;
        this.hasMore = data.hasMore;
        this.updateCommentCount();
        
        if (append) {
          this.appendComments(data.comments);
        } else {
          this.renderComments(data.comments);
        }
        
        if (!this.hasMore) {
          this.showNoMoreComments();
        }
      } else {
        throw new Error(data.error || 'Failed to load comments');
      }
    } catch (error) {
      console.error('Error loading comments:', error);
      this.showToast("Failed to load comments", "error");
    } finally {
      this.isLoading = false;
      this.showLoading(false);
    }
  }
  
  async refreshComments() {
    this.currentPage = 1;
    this.hasMore = true;
    this.hideNoMoreComments();
    await this.loadComments(1, false);
  }
  
  renderComments(comments) {
    if (!this.commentsContainer) return;
    
    if (comments.length === 0) {
      this.commentsContainer.innerHTML = `
        <div class="no-comments">
          <p>No comments yet. Be the first to share your thoughts!</p>
        </div>
      `;
      return;
    }
    
    this.commentsContainer.innerHTML = comments
      .map(comment => this.createCommentHTML(comment))
      .join("");
  }
  
  appendComments(comments) {
    if (!this.commentsContainer || comments.length === 0) return;
    
    const commentsHTML = comments
      .map(comment => this.createCommentHTML(comment))
      .join("");
    
    this.commentsContainer.insertAdjacentHTML('beforeend', commentsHTML);
  }
  
  createCommentHTML(comment) {
    const timeAgo = this.getTimeAgo(comment.timestamp);
    const likes = comment.likes || 0;
    
    return `
      <div class="comment" data-id="${comment.id}">
        <div class="comment-header">
          <span class="comment-username">${this.escapeHtml(comment.username)}</span>
          <span class="comment-timestamp">${timeAgo}</span>
        </div>
        <div class="comment-text">
          ${this.escapeHtml(comment.comment_text)}
        </div>
        <div class="comment-actions">
          <button class="comment-action like-btn" data-id="${comment.id}">
            ❤️ <span class="like-count">${likes}</span>
          </button>
          <button class="comment-action report-btn" data-id="${comment.id}">
            🚩 Report
          </button>
        </div>
      </div>
    `;
  }
  
  setupInfiniteScroll() {
    if (!this.commentsContainer) return;
    
    const scrollContainer = this.commentsContainer;
    
    scrollContainer.addEventListener('scroll', () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      
      // Load more when user scrolls to within 100px of bottom
      if (scrollTop + clientHeight >= scrollHeight - 100 && this.hasMore && !this.isLoading) {
        this.currentPage++;
        this.loadComments(this.currentPage, true);
      }
    });
  }
  
  updateCommentCount() {
    if (this.commentCount) {
      this.commentCount.textContent = `(${this.totalComments})`;
    }
  }
  
  showLoading(show) {
    if (this.loadingIndicator) {
      this.loadingIndicator.style.display = show ? 'flex' : 'none';
    }
  }
  
  showNoMoreComments() {
    if (this.noMoreComments) {
      this.noMoreComments.style.display = 'block';
    }
  }
  
  hideNoMoreComments() {
    if (this.noMoreComments) {
      this.noMoreComments.style.display = 'none';
    }
  }
  
  showToast(message, type = "info") {
    const toastContainer = document.getElementById("toast-container");
    if (!toastContainer) return;
    
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    toastContainer.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      toast.style.animation = "slideOut 0.3s ease-in forwards";
      setTimeout(() => toast.remove(), 300);
    }, 5000);
  }
  
  getTimeAgo(timestamp) {
    const now = new Date();
    const commentTime = new Date(timestamp);
    const diffInSeconds = Math.floor((now - commentTime) / 1000);
    
    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return commentTime.toLocaleDateString();
  }
  
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
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
    
    // Observe timeline milestones and comments
    document.querySelectorAll('.milestone, .comment').forEach(element => {
      observer.observe(element);
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