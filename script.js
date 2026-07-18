/**
 * ELAINE TURNS ONE - PREMIUM INVITATION SCRIPT
 * Version: 1.0.0
 * Architecture: Vanilla JavaScript (ES6+)
 * Description: Handles UI interactions, animations, countdown, and media for a luxury web experience.
 */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // ==========================================================================
    // UTILITIES
    // ==========================================================================
    
    /**
     * Debounce function to limit the rate at which a function can fire.
     */
    const debounce = (func, wait = 20, immediate = true) => {
        let timeout;
        return function() {
            const context = this, args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };

    // ==========================================================================
    // 1. LOADING SCREEN
    // ==========================================================================
    
    const initLoader = () => {
        const loader = document.getElementById('loader');
        const progressLine = document.getElementById('loader-progress');
        if (!loader || !progressLine) return;

        let loadProgress = 0;
        const loadInterval = setInterval(() => {
            // Simulate variable loading speed for realistic feel
            loadProgress += Math.random() * 15;
            
            if (loadProgress >= 100) {
                loadProgress = 100;
                clearInterval(loadInterval);
                progressLine.style.transform = `scaleX(1)`;
                
                // Sequence the fade out
                setTimeout(() => {
                    loader.style.opacity = '0';
                    loader.style.visibility = 'hidden';
                    setTimeout(() => {
                        loader.remove();
                        document.body.classList.remove('loading');
                        initScrollAnimations(); // Trigger hero animations
                    }, 800);
                }, 600);
            } else {
                progressLine.style.transform = `scaleX(${loadProgress / 100})`;
            }
        }, 150);
    };

    // ==========================================================================
    // 2. SCROLL PROGRESS & NAVIGATION
    // ==========================================================================
    
    const navbar = document.getElementById('navbar');
    const scrollProgress = document.getElementById('scroll-progress');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const handleScroll = debounce(() => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        
        // Update Scroll Progress Bar
        if (scrollProgress) {
            const scrollPercent = scrollTop / docHeight;
            scrollProgress.style.transform = `scaleX(${scrollPercent})`;
        }

        // Sticky Navbar Glass Effect
        if (navbar) {
            if (scrollTop > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    }, 10);

    window.addEventListener('scroll', handleScroll);

    // Mobile Menu Toggle
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
            mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
            mobileMenuBtn.classList.toggle('active');
            
            if (!isExpanded) {
                mobileMenu.classList.add('active');
                mobileMenu.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden'; // Prevent background scroll
            } else {
                mobileMenu.classList.remove('active');
                mobileMenu.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
            }
        });
    }

    // Smooth Scrolling & Close Mobile Menu on Click
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    // Close mobile menu if open
                    if (mobileMenu && mobileMenu.classList.contains('active')) {
                        mobileMenuBtn.click();
                    }
                    
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // ==========================================================================
    // 3. REVEAL ANIMATIONS (INTERSECTION OBSERVER)
    // ==========================================================================
    
    const initScrollAnimations = () => {
        const revealElements = document.querySelectorAll('.reveal-element');
        
        const revealOptions = {
            root: null,
            rootMargin: '0px 0px -10% 0px',
            threshold: 0.1
        };

        const revealCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target); // Only animate once
                }
            });
        };

        const revealObserver = new IntersectionObserver(revealCallback, revealOptions);
        
        revealElements.forEach(el => revealObserver.observe(el));
    };

    // ==========================================================================
    // 4. COUNTDOWN TIMER & CONFETTI
    // ==========================================================================
    
    const targetDate = new Date('2026-07-25T13:00:00+02:00').getTime(); // 25 July 2026, 1:00 PM CEST
    let countdownInterval;
    let confettiActive = false;

    const updateFlipCard = (id, newValue) => {
        const topEl = document.getElementById(`${id}-top`);
        const bottomEl = document.getElementById(`${id}-bottom`);
        if (!topEl || !bottomEl) return;

        const currentValue = topEl.innerText;
        const formattedValue = newValue < 10 ? `0${newValue}` : newValue;

        if (currentValue !== formattedValue.toString()) {
            const card = topEl.parentElement;
            
            // Re-trigger CSS animation
            card.classList.remove('flip');
            void card.offsetWidth; // Force reflow
            card.classList.add('flip');
            
            topEl.innerText = formattedValue;
            bottomEl.innerText = formattedValue;
        }
    };

    const initCountdown = () => {
        const timerElement = document.getElementById('countdown-timer');
        const messageElement = document.getElementById('celebration-message');
        
        if (!timerElement) return;

        const calculateTime = () => {
            const now = new Date().getTime();
            const distance = targetDate - now;

            if (distance <= 0) {
                clearInterval(countdownInterval);
                timerElement.style.display = 'none';
                if (messageElement) {
                    messageElement.classList.remove('hidden');
                    messageElement.classList.add('fade-in');
                }
                triggerConfetti();
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            updateFlipCard('days', days);
            updateFlipCard('hours', hours);
            updateFlipCard('minutes', minutes);
            updateFlipCard('seconds', seconds);
        };

        calculateTime(); // Initial call
        countdownInterval = setInterval(calculateTime, 1000);
    };

    // Confetti Animation System
    const triggerConfetti = () => {
        if (confettiActive) return;
        confettiActive = true;

        const canvas = document.getElementById('confetti-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const pieces = [];
        const numberOfPieces = 150;
        const colors = ['#D4AF37', '#F3E5AB', '#AA8000', '#FFDF00', '#FFFFFF'];

        for (let i = 0; i < numberOfPieces; i++) {
            pieces.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height - canvas.height,
                w: Math.random() * 10 + 5,
                h: Math.random() * 5 + 2,
                color: colors[Math.floor(Math.random() * colors.length)],
                speed: Math.random() * 3 + 2,
                angle: Math.random() * 360,
                spin: Math.random() * 0.2 - 0.1
            });
        }

        let animationFrame;
        let startTime = Date.now();

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let active = false;

            pieces.forEach(p => {
                p.y += p.speed;
                p.angle += p.spin;

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.angle);
                ctx.fillStyle = p.color;
                ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
                ctx.restore();

                if (p.y < canvas.height) active = true;
            });

            // Stop generating new ones after 3 seconds, let existing fall off screen
            if (Date.now() - startTime < 3000 || active) {
                animationFrame = requestAnimationFrame(render);
            } else {
                cancelAnimationFrame(animationFrame);
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                canvas.style.display = 'none';
            }
        };

        render();

        window.addEventListener('resize', debounce(() => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }, 100));
    };

    // ==========================================================================
    // 5. BACKGROUND PARTICLES (HERO AESTHETIC)
    // ==========================================================================
    
    const initParticles = () => {
        const canvas = document.getElementById('particles-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        let width, height, particles;

        const resize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            createParticles();
        };

        const createParticles = () => {
            particles = [];
            const count = Math.floor(width / 30); // Responsive density
            for (let i = 0; i < count; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    radius: Math.random() * 1.5 + 0.5,
                    vx: (Math.random() - 0.5) * 0.3,
                    vy: (Math.random() - 0.5) * 0.3,
                    alpha: Math.random() * 0.5 + 0.1
                });
            }
        };

        const render = () => {
            ctx.clearRect(0, 0, width, height);
            
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;

                // Wrap around edges
                if (p.x < 0) p.x = width;
                if (p.x > width) p.x = 0;
                if (p.y < 0) p.y = height;
                if (p.y > height) p.y = 0;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(212, 175, 55, ${p.alpha})`; // Gold with varying opacity
                ctx.fill();
            });

            requestAnimationFrame(render);
        };

        window.addEventListener('resize', debounce(resize, 200));
        resize();
        render();
    };

    // ==========================================================================
    // 6. AMBIENT AUDIO
    // ==========================================================================
    
    const initAudio = () => {
        const bgMusic = document.getElementById('bg-music');
        const musicToggle = document.getElementById('music-toggle');
        
        if (!bgMusic || !musicToggle) return;

        const iconPlay = musicToggle.querySelector('.icon-play');
        const iconPause = musicToggle.querySelector('.icon-pause');
        
        // Browsers block autoplay, so default state must be paused until interaction
        let isPlaying = false;
        bgMusic.volume = 0.4;

        const updateAudioState = () => {
            if (isPlaying) {
                bgMusic.play().catch(() => {
                    // Handle autoplay policy rejection gracefully
                    isPlaying = false;
                    updateAudioIcon();
                });
            } else {
                bgMusic.pause();
            }
            updateAudioIcon();
            localStorage.setItem('musicPreference', isPlaying ? 'play' : 'pause');
        };

        const updateAudioIcon = () => {
            if (isPlaying) {
                iconPlay.classList.add('hidden');
                iconPause.classList.remove('hidden');
                musicToggle.classList.add('playing');
            } else {
                iconPlay.classList.remove('hidden');
                iconPause.classList.add('hidden');
                musicToggle.classList.remove('playing');
            }
        };

        musicToggle.addEventListener('click', () => {
            isPlaying = !isPlaying;
            updateAudioState();
        });

        // Optional: Check if previously allowed (still requires user interaction in most modern browsers)
        const storedPref = localStorage.getItem('musicPreference');
        if (storedPref === 'play') {
            // Wait for first user interaction on the document to start playing
            const startAudioInteraction = () => {
                isPlaying = true;
                updateAudioState();
                document.removeEventListener('click', startAudioInteraction);
                document.removeEventListener('scroll', startAudioInteraction);
            };
            document.addEventListener('click', startAudioInteraction, { once: true });
            document.addEventListener('scroll', startAudioInteraction, { once: true });
        }
    };

    // ==========================================================================
    // 7. LAZY LOADING IMAGES
    // ==========================================================================
    
    const initLazyLoading = () => {
        const lazyImages = document.querySelectorAll('.lazy-load');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        const src = img.getAttribute('data-src');
                        if (src) {
                            img.src = src;
                            img.onload = () => {
                                img.classList.add('loaded');
                            };
                            img.removeAttribute('data-src');
                        }
                        observer.unobserve(img);
                    }
                });
            }, { rootMargin: '50px 0px', threshold: 0.01 });

            lazyImages.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for older browsers
            lazyImages.forEach(img => {
                const src = img.getAttribute('data-src');
                if (src) {
                    img.src = src;
                    img.classList.add('loaded');
                }
            });
        }
    };

    // ==========================================================================
    // 8. PREMIUM LIGHTBOX GALLERY
    // ==========================================================================
    
    const initLightbox = () => {
        const lightbox = document.getElementById('lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        const closeBtn = document.getElementById('lightbox-close');
        const prevBtn = document.getElementById('lightbox-prev');
        const nextBtn = document.getElementById('lightbox-next');
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        if (!lightbox || galleryItems.length === 0) return;

        let currentIndex = 0;
        let images = [];

        // Gather all high-res image sources
        galleryItems.forEach((item, index) => {
            const img = item.querySelector('img');
            const src = img.getAttribute('data-src') || img.src; // Handle both lazy and loaded
            images.push(src);

            item.addEventListener('click', () => openLightbox(index));
            // Accessibility: Enter key on focused gallery item
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') openLightbox(index);
            });
        });

        const openLightbox = (index) => {
            currentIndex = index;
            updateLightboxImage();
            lightbox.classList.add('active');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden'; // Prevent background scroll
            
            // Focus trap
            closeBtn.focus();
        };

        const closeLightbox = () => {
            lightbox.classList.remove('active');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            
            // Return focus to gallery item
            if (galleryItems[currentIndex]) {
                galleryItems[currentIndex].focus();
            }
        };

        const updateLightboxImage = () => {
            lightboxImg.style.opacity = '0';
            
            setTimeout(() => {
                lightboxImg.src = images[currentIndex];
                lightboxImg.onload = () => {
                    lightboxImg.style.opacity = '1';
                };
                preloadImages();
            }, 300); // Wait for CSS transition
        };

        const showNext = () => {
            currentIndex = (currentIndex + 1) % images.length;
            updateLightboxImage();
        };

        const showPrev = () => {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            updateLightboxImage();
        };

        const preloadImages = () => {
            const nextIdx = (currentIn
