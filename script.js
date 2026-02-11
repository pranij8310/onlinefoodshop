// ============================================
// GLOBAL STATE MANAGEMENT
// ============================================

const AppState = {
    cart: {
        count: 0,
        items: []
    },
    filters: {
        active: 'all'
    }
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

const debounce = (func, delay) => {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
};

const throttle = (func, limit) => {
    let lastFunc, lastRan;
    return function (...args) {
        if (!lastRan) {
            func(...args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(() => {
                if (Date.now() - lastRan >= limit) {
                    func(...args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    };
};

const showNotification = (message, type = 'success', duration = 3000) => {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: ${type === 'success' ? '#27ae60' : '#e74c3c'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-weight: 600;
        animation: slideInUp 0.4s ease forwards;
        z-index: 999;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideInUp 0.4s ease reverse';
        setTimeout(() => notification.remove(), 400);
    }, duration);
};

// ============================================
// NAVIGATION FUNCTIONALITY
// ============================================

const initializeNavigation = () => {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (!hamburger || !navMenu) return;

    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close menu when link is clicked
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-container')) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
};

// ============================================
// SMOOTH SCROLLING
// ============================================

const initializeSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
};

const scrollToMenu = () => {
    const menu = document.getElementById('menu');
    if (menu) {
        window.scrollTo({
            top: menu.offsetTop - 80,
            behavior: 'smooth'
        });
    }
};

// ============================================
// MENU FILTERING
// ============================================

const initializeMenuFilters = () => {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const menuItems = document.querySelectorAll('.menu-item');

    if (filterBtns.length === 0) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');
            AppState.filters.active = filterValue;

            // Filter and animate items
            menuItems.forEach((item, index) => {
                const itemCategory = item.getAttribute('data-category');
                const isVisible = filterValue === 'all' || itemCategory === filterValue;

                if (isVisible) {
                    item.style.display = 'block';
                    item.style.animation = `slideUp 0.6s ease ${index * 0.05}s forwards`;
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
};

// ============================================
// CART FUNCTIONALITY
// ============================================

const initializeCart = () => {
    const cartBadge = document.querySelector('.cart-badge');
    if (!cartBadge) return;

    updateCartBadge();
};

const addItemToCart = (button) => {
    const menuItem = button.closest('.menu-item');
    const itemName = menuItem.querySelector('h3').textContent;
    const itemPrice = menuItem.querySelector('.badge').textContent;

    AppState.cart.count++;
    AppState.cart.items.push({ name: itemName, price: itemPrice });

    updateCartBadge();
    showNotification(`${itemName} added to cart!`, 'success');

    // Animate button
    const originalHTML = button.innerHTML;
    button.innerHTML = '<i class="fas fa-check"></i> Added';
    button.style.background = '#27ae60';
    
    setTimeout(() => {
        button.innerHTML = originalHTML;
        button.style.background = '';
    }, 1500);
};

const updateCartBadge = () => {
    const cartBadge = document.querySelector('.cart-badge');
    if (cartBadge) {
        cartBadge.textContent = AppState.cart.count;
        cartBadge.style.animation = 'bounce 0.4s ease';
        setTimeout(() => {
            cartBadge.style.animation = '';
        }, 400);
    }
};

// ============================================
// NEWSLETTER FUNCTIONALITY
// ============================================

const initializeNewsletter = () => {
    const newsletterForm = document.getElementById('newsletterForm');

    if (!newsletterForm) return;

    newsletterForm.addEventListener('submit', handleNewsletter);
};

const handleNewsletter = (event) => {
    event.preventDefault();
    const email = event.target.querySelector('input[type="email"]').value;
    const btn = event.target.querySelector('button');
    const originalText = btn.innerHTML;

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email', 'error');
        return;
    }

    // Simulate subscription
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subscribing...';
    btn.disabled = true;

    setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-check"></i> Subscribed!';
        event.target.reset();
        showNotification('Successfully subscribed to newsletter!', 'success');

        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }, 2000);
    }, 1500);
};

// ============================================
// FORM VALIDATION (CONTACT PAGE)
// ============================================

const initializeContactForm = () => {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    const textarea = document.getElementById('message');
    const charCount = document.getElementById('charCount');

    // Character counter
    if (textarea && charCount) {
        textarea.addEventListener('input', () => {
            const length = textarea.value.length;
            charCount.textContent = length;

            if (length > 500) {
                textarea.value = textarea.value.substring(0, 500);
                charCount.textContent = '500';
            }
        });
    }

    // Form submission
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (validateContactForm()) {
            submitContactForm(contactForm);
        }
    });

    // Reset button
    const resetBtn = contactForm.querySelector('.btn-reset');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            clearContactFormErrors();
        });
    }
};

const validateContactForm = () => {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('pho').value.trim();
    const message = document.getElementById('message').value.trim();
    const query = document.getElementById('query').value;
    const eligible = document.querySelector('input[name="eligible"]:checked');

    let isValid = true;

    // Clear previous errors
    clearContactFormErrors();

    // Validate name
    if (name.length < 3) {
        showFieldError('nameError', 'Name must be at least 3 characters');
        isValid = false;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showFieldError('emailError', 'Please enter a valid email address');
        isValid = false;
    }

    // Validate phone
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    if (!phoneRegex.test(phone)) {
        showFieldError('phoneError', 'Please enter a valid phone number');
        isValid = false;
    }

    // Validate message
    if (message.length < 10) {
        showFieldError('messageError', 'Message must be at least 10 characters');
        isValid = false;
    }

    // Validate query selection
    if (!query) {
        showNotification('Please select a query type', 'error');
        isValid = false;
    }

    // Validate membership selection
    if (!eligible) {
        showNotification('Please select whether you are a member', 'error');
        isValid = false;
    }

    return isValid;
};

const showFieldError = (elementId, message) => {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
};

const clearContactFormErrors = () => {
    document.querySelectorAll('.error-message').forEach(error => {
        error.textContent = '';
        error.classList.remove('show');
    });
};

const submitContactForm = (form) => {
    const submitBtn = form.querySelector('.btn-submit');
    const successMessage = document.getElementById('successMessage');
    const originalText = submitBtn.innerHTML;

    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    // Simulate form submission
    setTimeout(() => {
        // Display success message
        if (successMessage) {
            successMessage.classList.add('show');

            // Auto-hide success message and reset form after 3 seconds
            setTimeout(() => {
                successMessage.classList.remove('show');
                form.reset();
                document.getElementById('charCount').textContent = '0';
                
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 3000);
        } else {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }

        showNotification('Your message has been sent successfully!', 'success');
    }, 1500);
};

// ============================================
// FAQ FUNCTIONALITY
// ============================================

const initializeFAQ = () => {
    const faqItems = document.querySelectorAll('.faq-item');

    if (faqItems.length === 0) return;

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        if (question) {
            question.addEventListener('click', () => {
                // Close other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });

                // Toggle current item
                item.classList.toggle('active');
            });
        }
    });
};

// ============================================
// DOCUMENT READY - INITIALIZE ALL
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();
    initializeSmoothScroll();
    initializeMenuFilters();
    initializeCart();
    initializeNewsletter();
    initializeContactForm();
    initializeFAQ();

    console.log('OnlineFoodShop - All modules initialized successfully! ✅');
});

// ============================================
// ADDITIONAL UTILITY: Prevent multiple submissions
// ============================================

let isSubmitting = false;

const preventMultipleSubmit = (form) => {
    if (isSubmitting) return false;
    isSubmitting = true;
    
    setTimeout(() => {
        isSubmitting = false;
    }, 2000);
    
    return true;
};
// ============================================
// HERO SECTION ENHANCEMENTS
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Interactive hero icons
    const heroIcons = document.querySelectorAll('.icon-float');
    
    if (heroIcons.length > 0) {
        heroIcons.forEach((icon, index) => {
            icon.addEventListener('mouseenter', () => {
                // Animate other icons
                heroIcons.forEach((otherIcon, otherIndex) => {
                    if (otherIndex !== index) {
                        otherIcon.style.opacity = '0.5';
                        otherIcon.style.transform = 'scale(0.9)';
                    }
                });
                icon.style.opacity = '1';
            });

            icon.addEventListener('mouseleave', () => {
                // Reset all icons
                heroIcons.forEach((otherIcon) => {
                    otherIcon.style.opacity = '1';
                    otherIcon.style.transform = 'scale(1)';
                });
            });

            // Click animation
            icon.addEventListener('click', () => {
                icon.style.animation = 'none';
                setTimeout(() => {
                    icon.style.animation = '';
                }, 10);
            });
        });
    }

    // Text reveal animation on scroll
    const heroHeading = document.querySelector('.hero-heading');
    if (heroHeading) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                }
            });
        }, { threshold: 0.1 });

        observer.observe(heroHeading);
    }
});
// ============================================
// INTERACTIVE HERO ICONS WITH ANALYTICS
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    const heroIcons = document.querySelectorAll('.icon-float');
    
    if (heroIcons.length > 0) {
        heroIcons.forEach((icon, index) => {
            const link = icon.querySelector('.icon-link');
            const tooltip = icon.querySelector('.tooltip');

            // Click tracking
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                const text = tooltip.textContent;

                // Log interaction (optional - for analytics)
                console.log(`User clicked: ${text}`);
                
                // Add click animation
                icon.style.animation = 'pulse 0.6s ease';
                
                // Show success feedback for email/phone
                if (href.startsWith('mailto:') || href.startsWith('tel:')) {
                    showNotification(`Opening ${text}...`, 'success', 2000);
                }
            });

            // Hover state management
            icon.addEventListener('mouseenter', () => {
                // Add a slight delay before showing tooltip for better UX
                icon.tooltipTimer = setTimeout(() => {
                    tooltip.style.opacity = '1';
                }, 200);

                // Dim other icons
                heroIcons.forEach((otherIcon, otherIndex) => {
                    if (otherIndex !== index) {
                        otherIcon.style.opacity = '0.6';
                        otherIcon.style.pointerEvents = 'none';
                    }
                });
            });

            icon.addEventListener('mouseleave', () => {
                // Clear tooltip timer
                clearTimeout(icon.tooltipTimer);
                tooltip.style.opacity = '0';

                // Reset all icons
                heroIcons.forEach((otherIcon) => {
                    otherIcon.style.opacity = '1';
                    otherIcon.style.pointerEvents = 'auto';
                });
            });

            // Keyboard accessibility
            link.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    link.click();
                }
            });

            // Accessibility: Add ARIA labels
            const text = tooltip.textContent;
            link.setAttribute('aria-label', text);
        });

        // Add keyboard navigation between icons
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                const focusedElement = document.activeElement;
                
                if (focusedElement.classList.contains('icon-link')) {
                    let nextIndex;
                    const currentIndex = Array.from(heroIcons).findIndex(
                        icon => icon.querySelector('.icon-link') === focusedElement
                    );

                    if (e.key === 'ArrowRight') {
                        nextIndex = (currentIndex + 1) % heroIcons.length;
                    } else {
                        nextIndex = (currentIndex - 1 + heroIcons.length) % heroIcons.length;
                    }

                    heroIcons[nextIndex].querySelector('.icon-link').focus();
                    e.preventDefault();
                }
            }
        });
    }
});

// Notification function (if not already defined)
function showNotification(message, type = 'success', duration = 3000) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: ${type === 'success' ? 'var(--success-color)' : 'var(--primary-color)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-weight: 600;
        animation: slideInUp 0.4s ease forwards;
        z-index: 999;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, duration);
}
// ============================================
// ENHANCED FOOTER SOCIAL LINKS
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    const socialIcons = document.querySelectorAll('.social-icon');

    if (socialIcons.length > 0) {
        socialIcons.forEach((icon, index) => {
            const tooltip = icon.querySelector('.social-tooltip');
            const platform = tooltip.textContent;

            // Hover Animation
            icon.addEventListener('mouseenter', () => {
                // Stagger effect on other icons
                socialIcons.forEach((otherIcon, otherIndex) => {
                    if (otherIndex !== index) {
                        otherIcon.style.transform = 'scale(0.85) opacity(0.7)';
                        otherIcon.style.opacity = '0.7';
                    }
                });

                // Highlight current icon
                icon.style.transform = 'translateY(-12px) scale(1.2) rotateZ(10deg)';
                icon.style.zIndex = '10';
            });

            icon.addEventListener('mouseleave', () => {
                // Reset all icons
                socialIcons.forEach((otherIcon) => {
                    otherIcon.style.transform = '';
                    otherIcon.style.opacity = '1';
                });
                icon.style.zIndex = '1';
            });

            // Click Event with Feedback
            icon.addEventListener('click', (e) => {
                // Create ripple effect
                const ripple = document.createElement('span');
                ripple.className = 'ripple';
                ripple.style.cssText = `
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.5);
                    width: 10px;
                    height: 10px;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    animation: ripple-animation 0.6s ease-out;
                    pointer-events: none;
                `;
                icon.appendChild(ripple);

                // Remove ripple after animation
                setTimeout(() => ripple.remove(), 600);

                // Log social media click
                console.log(`Opened: ${platform}`);
            });

            // Keyboard Accessibility
            icon.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    icon.click();
                }
            });

            // Add smooth scroll to icon when it comes into view
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.animation = `slideUp 0.6s ease ${index * 0.1}s both`;
                    }
                });
            }, { threshold: 0.1 });

            observer.observe(icon);
        });

        // Keyboard Navigation between social icons
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                const focusedElement = document.activeElement;

                if (focusedElement.classList.contains('social-icon')) {
                    let nextIndex;
                    const currentIndex = Array.from(socialIcons).indexOf(focusedElement);

                    if (e.key === 'ArrowRight') {
                        nextIndex = (currentIndex + 1) % socialIcons.length;
                    } else {
                        nextIndex = (currentIndex - 1 + socialIcons.length) % socialIcons.length;
                    }

                    socialIcons[nextIndex].focus();
                    e.preventDefault();
                }
            }
        });
    }
});

// Add CSS animation for ripple effect
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple-animation {
        0% {
            width: 10px;
            height: 10px;
            opacity: 1;
        }
        100% {
            width: 60px;
            height: 60px;
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
// ============================================
// ENHANCED HERO BUTTONS FUNCTIONALITY
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    const heroButtons = document.querySelectorAll('.hero-buttons .btn');

    if (heroButtons.length > 0) {
        heroButtons.forEach((button, index) => {
            // Add button interaction tracking
            button.addEventListener('click', (e) => {
                handleButtonClick(button, e);
            });

            // Hover effects
            button.addEventListener('mouseenter', () => {
                // Add subtle scale to other buttons
                heroButtons.forEach((otherBtn, otherIndex) => {
                    if (otherIndex !== index) {
                        otherBtn.style.opacity = '0.8';
                        otherBtn.style.transform = 'scale(0.95)';
                    }
                });
            });

            button.addEventListener('mouseleave', () => {
                // Reset all buttons
                heroButtons.forEach((otherBtn) => {
                    otherBtn.style.opacity = '1';
                    otherBtn.style.transform = '';
                });
            });

            // Keyboard accessibility
            button.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    button.click();
                }
            });

            // Add animation on load
            button.style.animation = `slideInDown 0.8s ease ${0.6 + index * 0.1}s both`;
        });

        // Keyboard navigation between buttons
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                const focusedElement = document.activeElement;

                if (focusedElement.classList.contains('btn')) {
                    let nextIndex;
                    const currentIndex = Array.from(heroButtons).indexOf(focusedElement);

                    if (e.key === 'ArrowRight') {
                        nextIndex = (currentIndex + 1) % heroButtons.length;
                    } else {
                        nextIndex = (currentIndex - 1 + heroButtons.length) % heroButtons.length;
                    }

                    heroButtons[nextIndex].focus();
                    e.preventDefault();
                }
            }
        });
    }
});

// ============================================
// BUTTON CLICK HANDLER
// ============================================

function handleButtonClick(button, event) {
    const buttonText = button.querySelector('.btn-text').textContent;

    // Add loading state
    const originalContent = button.innerHTML;
    button.classList.add('loading');
    button.innerHTML = '<i class="fas fa-spinner"></i> <span class="btn-text">LOADING</span>';

    // Log button click
    console.log(`Button clicked: ${buttonText}`);

    // Show feedback notification
    showButtonFeedback(buttonText);

    // Restore button after a short delay
    setTimeout(() => {
        button.classList.remove('loading');
        button.innerHTML = originalContent;
    }, 500);
}

// ============================================
// SCROLL TO MENU FUNCTION (ENHANCED)
// ============================================

function scrollToMenu() {
    const menu = document.getElementById('menu');
    if (menu) {
        const offsetTop = menu.offsetTop - 100;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth',
            duration: 1000
        });

        // Add visual feedback
        menu.style.background = 'rgba(255, 107, 53, 0.1)';
        setTimeout(() => {
            menu.style.background = '';
        }, 2000);
    }
}

// ============================================
// BUTTON FEEDBACK FUNCTION
// ============================================

function showButtonFeedback(buttonName) {
    // Create a temporary notification
    const notification = document.createElement('div');
    notification.className = 'button-feedback';
    notification.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${buttonName}</span>
    `;

    notification.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 8px 25px rgba(255, 107, 53, 0.3);
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-weight: 600;
        font-size: 0.95rem;
        animation: slideInUp 0.4s ease forwards;
        z-index: 999;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideInUp 0.4s ease reverse';
        setTimeout(() => notification.remove(), 400);
    }, 2000);
}

// ============================================
// ENHANCED SCROLL INTO VIEW
// ============================================

// Override the scroll behavior for LEARN MORE button
document.addEventListener('DOMContentLoaded', () => {
    const learnMoreBtn = document.querySelector('.btn-secondary');
    
    if (learnMoreBtn) {
        learnMoreBtn.addEventListener('click', () => {
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                aboutSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });

                // Highlight the section
                aboutSection.style.animation = 'highlightSection 1s ease';
            }
        });
    }
});

// Add highlight animation
const style = document.createElement('style');
style.textContent = `
    @keyframes highlightSection {
        0% {
            background-color: rgba(255, 107, 53, 0.2);
        }
        100% {
            background-color: transparent;
        }
    }

    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);