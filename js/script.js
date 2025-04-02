
document.addEventListener('DOMContentLoaded', function() {
    // Mobile navigation toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
        });
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (nav && nav.classList.contains('active') && !e.target.closest('nav') && !e.target.closest('.menu-toggle')) {
            nav.classList.remove('active');
        }
    });

    // Modal functionality
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    const donationModal = document.getElementById('donationModal');
    const btnLogin = document.getElementById('btn-login');
    const btnRegister = document.getElementById('btn-register');
    const btnDoar = document.getElementById('btn-doar');
    const switchToRegister = document.getElementById('switchToRegister');
    const switchToLogin = document.getElementById('switchToLogin');
    const closeBtns = document.querySelectorAll('.close');
    
    // Open modals
    if (btnLogin) btnLogin.addEventListener('click', () => openModal(loginModal));
    if (btnRegister) btnRegister.addEventListener('click', () => openModal(registerModal));
    if (btnDoar) btnDoar.addEventListener('click', () => openModal(donationModal));
    
    // Switch between login and register
    if (switchToRegister) {
        switchToRegister.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal(loginModal);
            openModal(registerModal);
        });
    }
    
    if (switchToLogin) {
        switchToLogin.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal(registerModal);
            openModal(loginModal);
        });
    }
    
    // Close modals with X button
    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            closeModal(loginModal);
            closeModal(registerModal);
            closeModal(donationModal);
        });
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) closeModal(loginModal);
        if (e.target === registerModal) closeModal(registerModal);
        if (e.target === donationModal) closeModal(donationModal);
    });
    
    // Contact form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // Here you'd normally send this data to a server
            console.log({name, email, message});
            
            // Show success message
            showToast('Mensagem enviada com sucesso! Entraremos em contato em breve.', 'success');
            
            // Reset form
            contactForm.reset();
        });
    }
    
    // Newsletter form
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            // Here you'd normally send this to a server
            console.log({email});
            
            // Show success message
            showToast('Inscrição realizada com sucesso!', 'success');
            
            // Reset form
            this.reset();
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        if (anchor.getAttribute('href').length > 1) {
            anchor.addEventListener('click', function(e) {
                if (this.getAttribute('href') === '#') return;
                
                e.preventDefault();
                const targetId = this.getAttribute('href');
                if (targetId === '#switchToRegister' || targetId === '#switchToLogin') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    // Close mobile menu if open
                    if (nav && nav.classList.contains('active')) {
                        nav.classList.remove('active');
                    }
                    
                    window.scrollTo({
                        top: targetElement.offsetTop - 90,
                        behavior: 'smooth'
                    });
                }
            });
        }
    });
});

// Helper functions for modals
function openModal(modal) {
    if (modal) modal.style.display = 'block';
}

function closeModal(modal) {
    if (modal) modal.style.display = 'none';
}

// Toast notification function
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = toast.querySelector('.toast-message');
    const icon = toast.querySelector('i');
    
    // Set message
    toastMessage.textContent = message;
    
    // Set icon based on type
    if (type === 'success') {
        icon.className = 'fas fa-check-circle';
        icon.style.color = 'var(--success-color)';
    } else if (type === 'error') {
        icon.className = 'fas fa-exclamation-circle';
        icon.style.color = 'var(--error-color)';
    } else if (type === 'warning') {
        icon.className = 'fas fa-exclamation-triangle';
        icon.style.color = 'var(--warning-color)';
    }
    
    // Show toast
    toast.classList.add('show');
    
    // Hide after 3 seconds (matching animation duration)
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
