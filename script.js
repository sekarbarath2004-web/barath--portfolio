// Add js-enabled class to HTML element to trigger scroll reveals only if JavaScript loads successfully
document.documentElement.classList.add('js-enabled');

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       MOBILE MENU TOGGLE
       ========================================================================== */
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a nav link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    /* ==========================================================================
       DARK/LIGHT THEME CONTROLLER
       ========================================================================== */
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // Check for saved theme preference, otherwise check system settings
    const getPreferredTheme = () => {
        try {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme) {
                return savedTheme;
            }
        } catch (e) {
            console.warn('LocalStorage access is restricted in this environment:', e);
        }
        return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    };

    const setTheme = (theme) => {
        htmlElement.setAttribute('data-theme', theme);
        try {
            localStorage.setItem('theme', theme);
        } catch (e) {
            console.warn('LocalStorage write is restricted in this environment:', e);
        }
    };

    // Initialize theme
    const activeTheme = getPreferredTheme();
    setTheme(activeTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            setTheme(newTheme);
        });
    }

    /* ==========================================================================
       SCROLL REVEAL ANIMATIONS (Intersection Observer)
       ========================================================================== */
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Unobserve once revealed to keep page performance high
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    /* ==========================================================================
       SCROLLSPY ACTIVE NAV HIGHLIGHT
       ========================================================================== */
    const sections = document.querySelectorAll('section[id]');
    
    const scrollSpy = () => {
        const scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute('id');
            const navLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);

            if (navLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLinks.forEach(link => link.classList.remove('active'));
                    navLink.classList.add('active');
                }
            }
        });
    };

    window.addEventListener('scroll', scrollSpy);

    /* ==========================================================================
       SKILL PROGRESS BARS & NUMERICAL COUNT-UP
       ========================================================================== */
    const skillsSection = document.getElementById('skills');
    const skillBars = document.querySelectorAll('.skill-bar-fill');
    const skillPercents = document.querySelectorAll('.skill-percent');
    let skillsAnimated = false;

    const animateSkills = () => {
        // Animate width
        skillBars.forEach(bar => {
            const targetWidth = bar.parentElement.previousElementSibling.querySelector('.skill-percent').getAttribute('data-target');
            bar.style.width = `${targetWidth}%`;
        });

        // Count up numbers
        skillPercents.forEach(percent => {
            const target = parseInt(percent.getAttribute('data-target'), 10);
            let count = 0;
            const duration = 1500; // ms
            const interval = 20; // ms
            const step = target / (duration / interval);

            const timer = setInterval(() => {
                count += step;
                if (count >= target) {
                    percent.textContent = `${target}%`;
                    clearInterval(timer);
                } else {
                    percent.textContent = `${Math.floor(count)}%`;
                }
            }, interval);
        });
    };

    if (skillsSection) {
        const skillsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !skillsAnimated) {
                    animateSkills();
                    skillsAnimated = true; // Run only once
                }
            });
        }, {
            threshold: 0.2
        });

        skillsObserver.observe(skillsSection);
    }

    /* ==========================================================================
       BACK TO TOP BUTTON
       ========================================================================== */
    const backToTopBtn = document.getElementById('back-to-top');

    const toggleBackToTop = () => {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    };

    window.addEventListener('scroll', toggleBackToTop);

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    /* ==========================================================================
       CONTACT FORM VALIDATION & SUBMISSION
       ========================================================================== */
    const contactForm = document.getElementById('contact-form');
    const successBox = document.getElementById('form-success');
    const resetFormBtn = document.getElementById('btn-reset-form');

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const clearError = (inputElement) => {
        const parent = inputElement.parentElement;
        parent.classList.remove('error');
    };

    const showError = (inputElement) => {
        const parent = inputElement.parentElement;
        parent.classList.add('error');
    };

    if (contactForm && successBox) {
        // Clear errors on input
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                clearError(input);
            });
        });

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;

            const nameInput = document.getElementById('form-name');
            const emailInput = document.getElementById('form-email');
            const messageInput = document.getElementById('form-message');

            // Name validation
            if (!nameInput.value.trim()) {
                showError(nameInput);
                isValid = false;
            } else {
                clearError(nameInput);
            }

            // Email validation
            if (!emailInput.value.trim() || !validateEmail(emailInput.value.trim())) {
                showError(emailInput);
                isValid = false;
            } else {
                clearError(emailInput);
            }

            // Message validation
            if (messageInput.value.trim().length < 10) {
                showError(messageInput);
                isValid = false;
            } else {
                clearError(messageInput);
            }

            if (isValid) {
                // Perform visual simulation of form submission
                contactForm.style.display = 'none';
                successBox.style.display = 'flex';
                
                // Print simulation details to Console
                console.log('--- Form Submission Simulation ---');
                console.log(`Name: ${nameInput.value}`);
                console.log(`Email: ${emailInput.value}`);
                console.log(`Message: ${messageInput.value}`);
                console.log('---------------------------------');
            }
        });

        if (resetFormBtn) {
            resetFormBtn.addEventListener('click', () => {
                contactForm.reset();
                successBox.style.display = 'none';
                contactForm.style.display = 'flex';
            });
        }
    }
});
