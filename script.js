// Theme Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Preloader functionality
    const preloader = document.getElementById('preloader');
    const mainContent = document.getElementById('main-content');
    
    // Hide preloader and show content after resources are loaded
    window.addEventListener('load', function() {
        // Give a minimum time of 2 seconds for the preloader to display
        setTimeout(() => {
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
            mainContent.style.opacity = '1';
            
            // Remove preloader from DOM after transition completes
            setTimeout(() => {
                preloader.remove();
            }, 500);
        }, 2000);
    });
    
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
    
    // Animate timeline events when they come into view
    const events = document.querySelectorAll('.event');
    const animateEvents = function() {
        events.forEach((event, index) => {
            const eventPosition = event.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (eventPosition < screenPosition) {
                // Add staggered animation delay based on index
                setTimeout(() => {
                    event.classList.add('animate');
                }, index * 150); // 150ms delay between each card for faster animation
            }
        });
    };
    
    // Animate sections when they come into view
    const animateSections = function() {
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.1;
            
            if (sectionTop < screenPosition) {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Add initial styles to sections
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Run animation check on load and scroll
    window.addEventListener('scroll', () => {
        animateEvents();
        animateSections();
    });
    
    // Initial check on page load
    setTimeout(() => {
        animateEvents();
        animateSections();
    }, 100);
    
    // Photo gallery button functionality (for future implementation)
    const galleryBtn = document.getElementById('galleryBtn');
    
    // This function would be used when photos are available
    function enableGallery(driveLink) {
        galleryBtn.disabled = false;
        galleryBtn.addEventListener('click', function() {
            window.open(driveLink, '_blank');
        });
    }
    
    // Example of how to enable the gallery button in the future
    // Uncomment and add the actual Google Drive link when available
    // const googleDriveFolder = 'https://drive.google.com/file/d/1r85VY4d-HD5_6-_Vaxd1ZSKRvvqIbyyp/view?usp=sharing';
    // enableGallery(googleDriveFolder);
    
    // Initialize circular photo display
    const photoContainer = document.querySelector('.photo-container');
    
    // Helper function to generate various Google Drive image URLs to try
    function getGoogleDriveImageUrls(fileId) {
        return [
            `https://lh3.googleusercontent.com/d/${fileId}`, // Direct lh3 format
            `https://drive.google.com/uc?export=view&id=${fileId}`, // View export format
            `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`, // Thumbnail format
            `https://drive.google.com/uc?export=download&id=${fileId}`, // Download export format
        ];
    }
    
    // Primary and fallback photo URLs
    const googleDriveId = '1r85VY4d-HD5_6-_Vaxd1ZSKRvvqIbyyp';
    const googleDriveUrls = getGoogleDriveImageUrls(googleDriveId);
    const fallbackPhotos = [
        ...googleDriveUrls, // Try all Google Drive URL formats
        'images/couple-photo.jpg', // Local image fallback
        'https://images.unsplash.com/photo-1537633552985-df8429e048b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    ];
    
    // Set up circular photo with error handling
    function setupCircularPhoto() {
        const photo = document.querySelector('.photo');
        if (!photo) return;
        
        // Try to load the images in sequence
        tryLoadingImages(photo, 0, fallbackPhotos);
        
        // Create sparkle particles
        createSparkles();
    }
    
    // Function to try loading images sequentially
    function tryLoadingImages(photoElement, index, imageUrls) {
        if (index >= imageUrls.length) {
            console.log('All image URLs failed, using placeholder');
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
        
        const imageUrl = imageUrls[index];
        console.log(`Trying to load image (${index + 1}/${imageUrls.length}):`, imageUrl);
        
        const img = new Image();
        img.onload = function() {
            console.log('Successfully loaded image:', imageUrl);
            photoElement.style.backgroundImage = `url('${imageUrl}')`;
        };
        
        img.onerror = function() {
            console.log('Failed to load image:', imageUrl);
            // Try the next image
            tryLoadingImages(photoElement, index + 1, imageUrls);
        };
        
        // Set a timeout to move to the next image if this one takes too long
        const timeout = setTimeout(() => {
            console.log('Image load timed out:', imageUrl);
            if (!img.complete || !img.naturalWidth) {
                tryLoadingImages(photoElement, index + 1, imageUrls);
            }
        }, 5000); // 5 second timeout
        
        img.onload = function() {
            clearTimeout(timeout);
            console.log('Successfully loaded image:', imageUrl);
            photoElement.style.backgroundImage = `url('${imageUrl}')`;
        };
        
        img.onerror = function() {
            clearTimeout(timeout);
            console.log('Failed to load image:', imageUrl);
            // Try the next image
            tryLoadingImages(photoElement, index + 1, imageUrls);
        };
        
        img.src = imageUrl;
    }
    
    // Handle mousemove for interactive sparkle trail
    function setupSparkleTrail() {
        const circularPhoto = document.querySelector('.circular-photo');
        const container = document.querySelector('.circular-photo-container');
        
        if (circularPhoto && container) {
            let throttled = false;
            let lastX = 0;
            let lastY = 0;
            
            container.addEventListener('mousemove', (e) => {
                if (throttled) return;
                throttled = true;
                
                // Throttle to create fewer, more meaningful sparkles
                setTimeout(() => {
                    throttled = false;
                }, 50); // Increased throttle time for fewer sparkles
                
                const rect = container.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // Only create sparkle if mouse moved enough
                const distance = Math.sqrt(Math.pow(x - lastX, 2) + Math.pow(y - lastY, 2));
                if (distance < 8) return; // Increased minimum distance
                
                lastX = x;
                lastY = y;
                
                // Create sparkle with varied sizes for more natural effect
                const size = Math.random() * 4 + 1; // Smaller size
                const opacity = Math.random() * 0.2 + 0.3; // Lower opacity
                
                // Create a temporary sparkle at mouse position
                const tempSparkle = document.createElement('div');
                tempSparkle.className = 'sparkle';
                tempSparkle.style.width = size + 'px';
                tempSparkle.style.height = size + 'px';
                tempSparkle.style.top = y + 'px';
                tempSparkle.style.left = x + 'px';
                tempSparkle.style.opacity = opacity.toString();
                tempSparkle.style.animation = 'none';
                tempSparkle.style.backgroundColor = getSparkleColor();
                tempSparkle.style.transform = 'scale(1)';
                tempSparkle.style.boxShadow = `0 0 ${size * 2}px 1px rgba(255, 215, 0, 0.4)`;
                
                container.appendChild(tempSparkle);
                
                // Remove sparkle with natural fade
                setTimeout(() => {
                    tempSparkle.style.transition = 'all 0.6s ease';
                    tempSparkle.style.opacity = '0';
                    tempSparkle.style.transform = `scale(${Math.random() * 0.4 + 0.6})`;
                    
                    setTimeout(() => {
                        if (tempSparkle.parentNode) {
                            tempSparkle.remove();
                        }
                    }, 600);
                }, Math.random() * 80 + 40);
            });
        }
    }
    
    // Helper function to get varied sparkle colors
    function getSparkleColor() {
        const colors = [
            'rgba(255, 215, 0, 0.8)',  // Gold
            'rgba(255, 223, 0, 0.8)',  // Light gold
            'rgba(255, 193, 7, 0.7)',  // Amber
            'rgba(255, 235, 59, 0.7)'  // Yellow
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    // Create additional sparkles dynamically with improved distribution
    function createSparkles() {
        const sparklesContainer = document.querySelector('.sparkles-container');
        if (!sparklesContainer) return;
        
        // Add small dynamic sparkles with better distribution
        for (let i = 0; i < 15; i++) {
            const sparkle = document.createElement('div');
            sparkle.className = 'sparkle';
            
            // Create better distribution around the circle
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 80 + 30;
            const centerX = 50;
            const centerY = 50;
            
            const x = centerX + Math.cos(angle) * distance;
            const y = centerY + Math.sin(angle) * distance;
            
            // Randomize sparkle properties
            const size = Math.random() * 5 + 3;
            
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
    
   
    
    // Insert the developer section before the copyright text
   
    
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
    
    // Improve performance on mobile devices
    let resizeTimer;
    window.addEventListener('resize', () => {
        document.body.classList.add('resize-animation-stopper');
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            document.body.classList.remove('resize-animation-stopper');
        }, 400);
    });
    
    // Initialize photo display and sparkle effects
    console.log('Initializing photo display');
    setupCircularPhoto();
    setupSparkleTrail();
});