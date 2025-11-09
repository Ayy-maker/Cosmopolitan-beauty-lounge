document.addEventListener('DOMContentLoaded', function() {
    
    const navbar = document.getElementById('navbar');
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const scrollToTopBtn = document.getElementById('scrollToTop');
    const testimonialsContainer = document.getElementById('testimonialsContainer');
    const testimonialsDots = document.getElementById('testimonialsDots');
    const bookingForm = document.getElementById('bookingForm');
    
    let currentTestimonial = 0;
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const totalTestimonials = testimonialCards.length;
    
    // Throttle scroll events for better performance
    let scrollTimeout;
    let ticking = false;
    
    function throttledScroll() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                if (window.pageYOffset > 100) {
                    navbar.classList.add('scrolled');
                    scrollToTopBtn.classList.add('show');
                } else {
                    navbar.classList.remove('scrolled');
                    scrollToTopBtn.classList.remove('show');
                }
                
                animateOnScroll();
                updateActiveNavLink();
                ticking = false;
            });
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', throttledScroll, { passive: true });
    
    mobileMenuToggle.addEventListener('click', function() {
        mobileMenuToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
                
                if (navMenu.classList.contains('active')) {
                    mobileMenuToggle.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            }
        });
    });
    
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.pageYOffset + 200;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    const statNumbers = document.querySelectorAll('.stat-number');
    let hasAnimated = false;
    
    function animateStats() {
        if (hasAnimated) return;
        
        const statsSection = document.querySelector('.about-stats');
        if (!statsSection) return;
        
        const rect = statsSection.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
        
        if (isVisible) {
            hasAnimated = true;
            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-count'));
                const duration = 2000;
                const steps = 60;
                const increment = target / steps;
                let current = 0;
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        stat.textContent = target;
                        clearInterval(timer);
                    } else {
                        stat.textContent = Math.floor(current);
                    }
                }, duration / steps);
            });
        }
    }
    
    window.addEventListener('scroll', animateStats, { passive: true });
    animateStats();
    
    function createTestimonialDots() {
        if (!testimonialsDots) return;
        testimonialsDots.innerHTML = '';
        for (let i = 0; i < totalTestimonials; i++) {
            const dot = document.createElement('span');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => showTestimonial(i));
            testimonialsDots.appendChild(dot);
        }
    }
    
    function showTestimonial(index) {
        testimonialCards.forEach((card, i) => {
            card.classList.remove('active');
            if (i === index) {
                card.classList.add('active');
            }
        });
        
        const dots = testimonialsDots.querySelectorAll('span');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        
        currentTestimonial = index;
    }
    
    function nextTestimonial() {
        currentTestimonial = (currentTestimonial + 1) % totalTestimonials;
        showTestimonial(currentTestimonial);
    }
    
    function prevTestimonial() {
        currentTestimonial = (currentTestimonial - 1 + totalTestimonials) % totalTestimonials;
        showTestimonial(currentTestimonial);
    }
    
    if (testimonialCards.length > 0) {
        createTestimonialDots();
        showTestimonial(0);
        
        const nextBtn = document.querySelector('.next-testimonial');
        const prevBtn = document.querySelector('.prev-testimonial');
        
        if (nextBtn) nextBtn.addEventListener('click', nextTestimonial);
        if (prevBtn) prevBtn.addEventListener('click', prevTestimonial);
        
        // Defer auto-rotation to save initial load performance
        setTimeout(() => setInterval(nextTestimonial, 5000), 3000);
    }
    
    let touchStartX = 0;
    let touchEndX = 0;
    
    if (testimonialsContainer) {
        testimonialsContainer.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        testimonialsContainer.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
    }
    
    function handleSwipe() {
        if (touchEndX < touchStartX - 50) nextTestimonial();
        if (touchEndX > touchStartX + 50) prevTestimonial();
    }
    
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(bookingForm);
            const data = Object.fromEntries(formData);
            
            const phoneNumber = '61450771777';
            const message = `Hi! I'd like to book an appointment.
            
Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone}
Service: ${data.service}
Preferred Date: ${data.date}
Message: ${data.message}`;
            
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
            
            alert('Thank you! Redirecting you to WhatsApp to confirm your booking.');
            window.open(whatsappUrl, '_blank');
            
            bookingForm.reset();
        });
    }
    
    const formInputs = document.querySelectorAll('.form-group input, .form-group select, .form-group textarea');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
    });
    
    function animateOnScroll() {
        const elements = document.querySelectorAll('.about-card, .service-card, .gallery-item, .contact-card');
        
        elements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight - 100;
            
            if (isVisible && !element.classList.contains('animated')) {
                element.classList.add('animate-on-scroll', 'animated');
            }
        });
    }
    
    const dateInput = document.getElementById('date');
    if (dateInput) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        dateInput.min = tomorrow.toISOString().split('T')[0];
        
        const maxDate = new Date(today);
        maxDate.setMonth(maxDate.getMonth() + 3);
        dateInput.max = maxDate.toISOString().split('T')[0];
    }
    
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 0) {
                if (value.length <= 4) {
                    value = value;
                } else if (value.length <= 7) {
                    value = value.slice(0, 4) + ' ' + value.slice(4);
                } else {
                    value = value.slice(0, 4) + ' ' + value.slice(4, 7) + ' ' + value.slice(7, 10);
                }
            }
            e.target.value = value;
        });
    }
    
    // Navbar hide on scroll (throttled)
    let lastScrollTop = 0;
    let navbarTicking = false;
    
    window.addEventListener('scroll', function() {
        if (!navbarTicking) {
            window.requestAnimationFrame(function() {
                let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                
                if (scrollTop > lastScrollTop && scrollTop > 300) {
                    navbar.style.transform = 'translateY(-100%)';
                } else {
                    navbar.style.transform = 'translateY(0)';
                }
                
                lastScrollTop = scrollTop;
                navbarTicking = false;
            });
            navbarTicking = true;
        }
    }, { passive: true });
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    });
    
    document.querySelectorAll('.service-card, .about-card, .testimonial-card').forEach(el => {
        observer.observe(el);
    });
    
    const gallery = document.querySelectorAll('.gallery-item');
    gallery.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
    });
    
    animateOnScroll();
});

// Lazy load images with data-src attribute
if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    }, {
        rootMargin: '50px'
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
}
