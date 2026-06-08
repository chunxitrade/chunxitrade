/**
 * Beijing Chunqian Trading Co., Ltd.
 * Main JavaScript - Enterprise Website
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initLoadingScreen();
    initNavigation();
    initScrollAnimations();
    initBackToTop();
    initCounters();
    initSmoothScroll();
    initFormValidation();
    initPageTransitions();
});

/**
 * Loading Screen
 */
function initLoadingScreen() {
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen) {
        window.addEventListener('load', function() {
            setTimeout(function() {
                loadingScreen.classList.add('hidden');
                document.body.style.overflow = 'auto';
            }, 800);
        });
    }
}

/**
 * Navigation
 */
function initNavigation() {
    const header = document.querySelector('.header');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
        });
    }

    // Close mobile menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu && navMenu.classList.contains('active')) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    });

    // Header scroll effect
    window.addEventListener('scroll', function() {
        if (header) {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    });

    // Set active nav link based on current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

/**
 * Scroll Animations
 */
function initScrollAnimations() {
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animateElements.forEach(element => {
        observer.observe(element);
    });

    // Parallax effect for hero shapes
    const shapes = document.querySelectorAll('.shape');
    if (shapes.length > 0) {
        window.addEventListener('scroll', function() {
            const scrolled = window.scrollY;
            shapes.forEach((shape, index) => {
                const speed = 0.1 + (index * 0.05);
                shape.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    }
}

/**
 * Back to Top Button
 */
function initBackToTop() {
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });

        backToTop.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

/**
 * Counter Animation
 */
function initCounters() {
    const counters = document.querySelectorAll('[data-counter]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-counter'));
                const duration = 2000;
                const step = target / (duration / 16);
                let current = 0;

                const updateCounter = () => {
                    current += step;
                    if (current < target) {
                        counter.textContent = Math.floor(current) + '+';
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target + '+';
                    }
                };

                updateCounter();
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
        observer.observe(counter);
    });
}

/**
 * Smooth Scroll
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const headerHeight = document.querySelector('.header')?.offsetHeight || 80;
                    const targetPosition = target.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

/**
 * Form Validation
 */
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
            
            inputs.forEach(input => {
                if (!validateInput(input)) {
                    isValid = false;
                }
            });

            if (isValid) {
                // Show success message
                showNotification('Thank you for your message! We will get back to you soon.', 'success');
                form.reset();
            }
        });

        // Real-time validation
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateInput(this);
            });

            input.addEventListener('input', function() {
                if (this.classList.contains('error')) {
                    validateInput(this);
                }
            });
        });
    });
}

function validateInput(input) {
    const value = input.value.trim();
    const type = input.type;
    let isValid = true;
    let errorMessage = '';

    // Remove existing error
    input.classList.remove('error');
    const existingError = input.parentElement.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    // Check required
    if (input.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required';
    }

    // Check email
    if (type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }

    // Check phone
    if (type === 'tel' && value) {
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        if (!phoneRegex.test(value) || value.length < 10) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
        }
    }

    if (!isValid) {
        input.classList.add('error');
        const errorEl = document.createElement('span');
        errorEl.className = 'error-message';
        errorEl.textContent = errorMessage;
        errorEl.style.cssText = 'color: #e53e3e; font-size: 0.875rem; margin-top: 5px; display: block;';
        input.parentElement.appendChild(errorEl);
    }

    return isValid;
}

/**
 * Notification System
 */
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 20px 30px;
        background: ${type === 'success' ? '#48bb78' : type === 'error' ? '#e53e3e' : '#4299e1'};
        color: white;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        z-index: 9999;
        display: flex;
        align-items: center;
        gap: 15px;
        animation: slideIn 0.3s ease-out;
        max-width: 400px;
    `;
    notification.querySelector('button').style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
    `;

    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'fadeOut 0.3s ease-out forwards';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Add fadeOut animation
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes fadeOut {
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
`;
document.head.appendChild(styleSheet);

/**
 * Page Transitions
 */
function initPageTransitions() {
    const links = document.querySelectorAll('a[href$=".html"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && !href.startsWith('http') && !href.startsWith('mailto') && !href.startsWith('tel')) {
                e.preventDefault();
                
                const pageTransition = document.querySelector('.page-transition');
                if (pageTransition) {
                    pageTransition.classList.add('active');
                    
                    setTimeout(function() {
                        window.location.href = href;
                    }, 500);
                } else {
                    window.location.href = href;
                }
            }
        });
    });
}

/**
 * Newsletter Form
 */
function initNewsletter() {
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            if (emailInput && emailInput.value) {
                showNotification('Thank you for subscribing to our newsletter!', 'success');
                emailInput.value = '';
            }
        });
    }
}

/**
 * Image Lazy Loading
 */
function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => {
        imageObserver.observe(img);
    });
}

/**
 * Video Play on Scroll
 */
function initVideoScroll() {
    const videos = document.querySelectorAll('video[data-auto-play]');
    
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const video = entry.target;
            if (entry.isIntersecting) {
                video.play();
            } else {
                video.pause();
            }
        });
    }, { threshold: 0.5 });

    videos.forEach(video => {
        videoObserver.observe(video);
    });
}

/**
 * Tabs Functionality
 */
function initTabs() {
    const tabContainers = document.querySelectorAll('.tabs-container');
    
    tabContainers.forEach(container => {
        const tabs = container.querySelectorAll('.tab-btn');
        const panels = container.querySelectorAll('.tab-panel');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const target = this.dataset.tab;
                
                // Remove active from all
                tabs.forEach(t => t.classList.remove('active'));
                panels.forEach(p => p.classList.remove('active'));
                
                // Add active to current
                this.classList.add('active');
                const targetPanel = container.querySelector(`#${target}`);
                if (targetPanel) {
                    targetPanel.classList.add('active');
                }
            });
        });
    });
}

/**
 * Accordion Functionality
 */
function initAccordion() {
    const accordions = document.querySelectorAll('.accordion');
    
    accordions.forEach(accordion => {
        const items = accordion.querySelectorAll('.accordion-item');
        
        items.forEach(item => {
            const header = item.querySelector('.accordion-header');
            const content = item.querySelector('.accordion-content');
            
            if (header && content) {
                header.addEventListener('click', function() {
                    const isOpen = item.classList.contains('active');
                    
                    // Close all items
                    items.forEach(i => {
                        i.classList.remove('active');
                        const c = i.querySelector('.accordion-content');
                        if (c) c.style.maxHeight = null;
                    });
                    
                    // Open clicked item if it was closed
                    if (!isOpen) {
                        item.classList.add('active');
                        content.style.maxHeight = content.scrollHeight + 'px';
                    }
                });
            }
        });
    });
}

/**
 * Mouse Move Parallax
 */
function initParallax() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    document.addEventListener('mousemove', function(e) {
        const mouseX = e.clientX / window.innerWidth - 0.5;
        const mouseY = e.clientY / window.innerHeight - 0.5;
        
        parallaxElements.forEach(element => {
            const speed = parseFloat(element.dataset.parallax) || 0.05;
            const rect = element.getBoundingClientRect();
            const elementX = (rect.left + rect.width / 2 - e.clientX) * speed;
            const elementY = (rect.top + rect.height / 2 - e.clientY) * speed;
            
            element.style.transform = `translate(${elementX}px, ${elementY}px)`;
        });
    });
}

/**
 * Typing Effect
 */
function initTypingEffect() {
    const typingElements = document.querySelectorAll('[data-typing]');
    
    typingElements.forEach(element => {
        const text = element.textContent;
        const speed = parseInt(element.dataset.typingSpeed) || 50;
        element.textContent = '';
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    let i = 0;
                    const typeWriter = () => {
                        if (i < text.length) {
                            element.textContent += text.charAt(i);
                            i++;
                            setTimeout(typeWriter, speed);
                        }
                    };
                    typeWriter();
                    observer.unobserve(element);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(element);
    });
}

/**
 * Utility: Debounce
 */
function debounce(func, wait = 100) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Utility: Throttle
 */
function throttle(func, limit = 100) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Initialize additional features
document.addEventListener('DOMContentLoaded', function() {
    initNewsletter();
    initLazyLoading();
    initTabs();
    initAccordion();
    initTypingEffect();
    
    // Add loaded class to body for CSS animations
    document.body.classList.add('loaded');
});
