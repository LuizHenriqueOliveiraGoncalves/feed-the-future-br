document.addEventListener('DOMContentLoaded', function() {
    // Menu toggle functionality for mobile
    const menuToggle = document.getElementById('menu-toggle');
    const nav = document.getElementById('nav');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            
            // Change icon based on menu state
            const icon = menuToggle.querySelector('i');
            if (nav.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideNav = nav.contains(event.target);
        const isClickOnToggle = menuToggle.contains(event.target);
        
        if (nav.classList.contains('active') && !isClickInsideNav && !isClickOnToggle) {
            nav.classList.remove('active');
            
            // Reset icon
            const icon = menuToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
    
    // Close menu when clicking on a link
    const menuLinks = document.querySelectorAll('#menu a');
    menuLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                nav.classList.remove('active');
                
                // Reset icon
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });
    
    // Modal functionality
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const registerBtnHero = document.getElementById('registerBtnHero');
    const closeLoginModal = document.getElementById('closeLoginModal');
    const closeRegisterModal = document.getElementById('closeRegisterModal');
    const showRegisterModal = document.getElementById('showRegisterModal');
    const showLoginModal = document.getElementById('showLoginModal');
    
    if (loginBtn && loginModal && closeLoginModal) {
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            loginModal.style.display = "block";
        });
    
        closeLoginModal.addEventListener('click', function() {
            loginModal.style.display = "none";
        });
    }
    
    if (registerBtn && registerModal && closeRegisterModal) {
        registerBtn.addEventListener('click', function(e) {
            e.preventDefault();
            registerModal.style.display = "block";
        });
    
        closeRegisterModal.addEventListener('click', function() {
            registerModal.style.display = "none";
        });
    }
    
    if (registerBtnHero && registerModal) {
        registerBtnHero.addEventListener('click', function(e) {
            e.preventDefault();
            registerModal.style.display = "block";
        });
    }
    
    if (showRegisterModal && loginModal && registerModal) {
        showRegisterModal.addEventListener('click', function(e) {
            e.preventDefault();
            loginModal.style.display = "none";
            registerModal.style.display = "block";
        });
    }
    
    if (showLoginModal && loginModal && registerModal) {
        showLoginModal.addEventListener('click', function(e) {
            e.preventDefault();
            registerModal.style.display = "none";
            loginModal.style.display = "block";
        });
    }
    
    // Close modal if clicked outside the modal-content
    window.addEventListener('click', function(event) {
        if (event.target == loginModal) {
            loginModal.style.display = "none";
        }
        if (event.target == registerModal) {
            registerModal.style.display = "none";
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
    
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
    
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 60, // Adjust for header height
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Form submission handlers
    const contactForm = document.getElementById('contactForm');
    const newsletterForm = document.getElementById('newsletterForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simulate form submission
            setTimeout(function() {
                alert('Mensagem enviada com sucesso!');
                contactForm.reset();
            }, 500);
        });
    }
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simulate newsletter signup
            setTimeout(function() {
                alert('Inscrição na newsletter realizada com sucesso!');
                newsletterForm.reset();
            }, 500);
        });
    }
});
