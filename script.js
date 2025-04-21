// Theme Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Detect mobile devices for performance optimizations
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Preloader functionality - Fixed version
    const preloader = document.getElementById('preloader');
    const mainContent = document.getElementById('main-content');
    
    if (preloader && mainContent) {
        // Show main content right away
        mainContent.style.opacity = '1';
        
        // Hide preloader after a small delay
        setTimeout(() => {
            if (preloader && preloader.style) {
                preloader.style.opacity = '0';
                preloader.style.visibility = 'hidden';
                
                // Remove preloader after transition
                setTimeout(() => {
                    if (preloader && preloader.parentNode) {
                        preloader.parentNode.removeChild(preloader);
                    }
                }, 500);
            }
        }, 1000); // Reduced from 1500ms for faster loading
    }
    
    const themeToggle = document.querySelector('.theme-toggle');
    const moonIcon = document.querySelector('.fa-moon');
    const sunIcon = document.querySelector('.fa-sun');
    const body = document.body;
    
    // Check for saved theme preference or use default light theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
        body.classList.remove('light-theme');
        moonIcon.classList.add('active');
        sunIcon.classList.remove('active');
    } else {
        body.classList.add('light-theme');
    }
    
    // Toggle theme when clicked
    themeToggle.addEventListener('click', function() {
        if (body.classList.contains('dark-theme')) {
            // Switch to light theme
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
            moonIcon.classList.remove('active');
            sunIcon.classList.add('active');
            localStorage.setItem('theme', 'light');
        } else {
            // Switch to dark theme
            body.classList.add('dark-theme');
            body.classList.remove('light-theme');
            moonIcon.classList.add('active');
            sunIcon.classList.remove('active');
            localStorage.setItem('theme', 'dark');
        }
    });
    
    // Intersection Observer for animations - more efficient than scroll events
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    // Observer for timeline events
    const eventObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add animate class with staggered delay
                setTimeout(() => {
                    entry.target.classList.add('animate');
                }, index * (isMobile ? 100 : 150)); // Reduced delay on mobile
                
                // Unobserve after animating to save resources
                eventObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observer for sections
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Unobserve after animating
                sectionObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all events
    const events = document.querySelectorAll('.event');
    events.forEach(event => {
        eventObserver.observe(event);
    });
    
    // Add initial styles to sections and observe them
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        sectionObserver.observe(section);
    });
    
    // Photo gallery button functionality (for future implementation)
    const galleryBtn = document.getElementById('galleryBtn');
    
    // This function would be used when photos are available
    function enableGallery(driveLink) {
        if (galleryBtn) {
            galleryBtn.disabled = false;
            galleryBtn.addEventListener('click', function() {
                window.open(driveLink, '_blank');
            });
        }
    }
    
    // Set up circular photo with error handling - more efficient version
    function setupCircularPhoto() {
        const photo = document.querySelector('.photo');
        if (!photo) return;
        
        // Simplified image loading for better performance
        // Primary and backup images
        const imageUrls = [
            'images/couple-photo.jpg', // Try local image first
            'https://lh3.googleusercontent.com/d/1r85VY4d-HD5_6-_Vaxd1ZSKRvvqIbyyp'
        ];
        
        loadImageSequentially(photo, imageUrls);
        
        // Create sparkles only if not on mobile or reduce them significantly
        if (!isMobile) {
            createSparkles();
        } else {
            createSparkles(5); // Create fewer sparkles on mobile
        }
    }
    
    // Simplified image loader
    function loadImageSequentially(photoElement, imageUrls) {
        let loadAttempt = 0;
        
        function tryNextImage() {
            if (loadAttempt >= imageUrls.length) {
                // If all images fail, use a placeholder
                photoElement.style.backgroundImage = 'none';
                photoElement.style.backgroundColor = 'var(--primary-color)';
                
                // Add a heart icon
                const placeholder = document.createElement('div');
                placeholder.className = 'photo-placeholder';
                placeholder.innerHTML = '<i class="fas fa-heart"></i>';
                photoElement.appendChild(placeholder);
                return;
            }
            
            const img = new Image();
            const imageUrl = imageUrls[loadAttempt];
            
            img.onload = function() {
                photoElement.style.backgroundImage = `url('${imageUrl}')`;
            };
            
            img.onerror = function() {
                loadAttempt++;
                tryNextImage();
            };
            
            // Set timeout
            const timer = setTimeout(() => {
                if (!img.complete) {
                    loadAttempt++;
                    tryNextImage();
                }
            }, 3000); // 3 second timeout (reduced from 5s)
            
            img.onload = function() {
                clearTimeout(timer);
                photoElement.style.backgroundImage = `url('${imageUrl}')`;
            };
            
            img.src = imageUrl;
        }
        
        tryNextImage();
    }
    
    // Optimized sparkle trail for mobile
    function setupSparkleTrail() {
        // Skip on mobile devices
        if (isMobile) return;
        
        const circularPhoto = document.querySelector('.circular-photo');
        const container = document.querySelector('.circular-photo-container');
        
        if (circularPhoto && container) {
            let throttled = false;
            let lastX = 0;
            let lastY = 0;
            
            container.addEventListener('mousemove', (e) => {
                if (throttled) return;
                throttled = true;
                
                // Increased throttle time for better performance
                setTimeout(() => {
                    throttled = false;
                }, 80);
                
                const rect = container.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // Only create sparkle if mouse moved enough
                const distance = Math.sqrt(Math.pow(x - lastX, 2) + Math.pow(y - lastY, 2));
                if (distance < 15) return; // Increased minimum distance for fewer effects
                
                lastX = x;
                lastY = y;
                
                // Create sparkle (smaller and fewer)
                const size = Math.random() * 3 + 1; // Smaller size
                const opacity = Math.random() * 0.2 + 0.2; // Lower opacity
                
                // Create a temporary sparkle at mouse position
                const tempSparkle = document.createElement('div');
                tempSparkle.className = 'sparkle';
                tempSparkle.style.width = size + 'px';
                tempSparkle.style.height = size + 'px';
                tempSparkle.style.top = y + 'px';
                tempSparkle.style.left = x + 'px';
                tempSparkle.style.opacity = opacity.toString();
                tempSparkle.style.backgroundColor = getSparkleColor();
                tempSparkle.style.transform = 'scale(1)';
                
                container.appendChild(tempSparkle);
                
                // Remove sparkle with natural fade
                setTimeout(() => {
                    tempSparkle.style.transition = 'all 0.5s ease';
                    tempSparkle.style.opacity = '0';
                    
                    setTimeout(() => {
                        if (tempSparkle.parentNode) {
                            tempSparkle.remove();
                        }
                    }, 500);
                }, 40);
            });
        }
    }
    
    // Helper function to get varied sparkle colors
    function getSparkleColor() {
        const colors = [
            'rgba(255, 215, 0, 0.7)',  // Gold
            'rgba(255, 193, 7, 0.6)'   // Amber
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    // Create fewer sparkles, especially on mobile
    function createSparkles(count = 15) {
        const sparklesContainer = document.querySelector('.sparkles-container');
        if (!sparklesContainer) return;
        
        // Add small dynamic sparkles with better distribution
        for (let i = 0; i < count; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            
            // Create better distribution around the circle
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 80 + 30;
            const centerX = 50;
            const centerY = 50;
            
            const x = centerX + Math.cos(angle) * distance;
            const y = centerY + Math.sin(angle) * distance;
            
            // Smaller size for better performance
            const size = Math.random() * 4 + 2;
            
            sparkle.style.width = size + 'px';
            sparkle.style.height = size + 'px';
            sparkle.style.top = y + '%';
            sparkle.style.left = x + '%';
            sparkle.style.animationDelay = Math.random() * 3 + 's';
            sparkle.style.animationDuration = Math.random() * 2 + 2 + 's';
            sparkle.style.backgroundColor = getSparkleColor();
            
            sparklesContainer.appendChild(sparkle);
        }
    }
    
    // Add smooth scrolling for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Improve performance by stopping animations during resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        document.body.classList.add('resize-animation-stopper');
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            document.body.classList.remove('resize-animation-stopper');
        }, 400);
    });
    
    // Initialize photo display and sparkle effects
    setupCircularPhoto();
    
    // Only setup sparkle trail for non-mobile devices
    if (!isMobile) {
        setupSparkleTrail();
    }
});