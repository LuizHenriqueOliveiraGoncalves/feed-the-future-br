
document.addEventListener('DOMContentLoaded', function() {
    // Local storage keys
    const STORAGE_KEYS = {
        AUTH_TOKEN: 'feedthefuture_auth_token',
        USER_DATA: 'feedthefuture_user_data'
    };
    
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            // In a real app, you'd make an API call here
            // For demo purposes, we'll simulate authentication
            if (email && password) {
                // Simulate successful login
                const mockUserData = {
                    id: 'user_' + Math.random().toString(36).substr(2, 9),
                    name: email.split('@')[0],
                    email: email,
                    type: email.includes('ong') ? 'ngo' : 'business',
                    createdAt: new Date().toISOString()
                };
                
                // Save to localStorage (in a real app, you'd store a JWT token)
                const mockToken = 'mock_token_' + Math.random().toString(36).substr(2, 16);
                localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, mockToken);
                localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(mockUserData));
                
                // Show success toast
                showToast(`Bem-vindo(a) de volta, ${mockUserData.name}!`, 'success');
                
                // Close the modal
                closeModal(document.getElementById('loginModal'));
                
                // Update UI to logged in state
                updateAuthUI();
            } else {
                // Show error
                showToast('Por favor, preencha todos os campos', 'error');
            }
        });
    }
    
    // Registration form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const type = document.getElementById('registerType').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('registerConfirmPassword').value;
            
            // Simple validation
            if (!name || !email || !type || !password) {
                showToast('Por favor, preencha todos os campos', 'error');
                return;
            }
            
            if (password !== confirmPassword) {
                showToast('As senhas não coincidem', 'error');
                return;
            }
            
            // In a real app, you'd make an API call here
            // For demo purposes, we'll simulate registration
            const mockUserData = {
                id: 'user_' + Math.random().toString(36).substr(2, 9),
                name: name,
                email: email,
                type: type,
                createdAt: new Date().toISOString()
            };
            
            // Save to localStorage (in a real app, you'd store a JWT token)
            const mockToken = 'mock_token_' + Math.random().toString(36).substr(2, 16);
            localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, mockToken);
            localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(mockUserData));
            
            // Show success toast
            showToast(`Cadastro realizado com sucesso! Bem-vindo(a), ${name}!`, 'success');
            
            // Close the modal
            closeModal(document.getElementById('registerModal'));
            
            // Update UI to logged in state
            updateAuthUI();
        });
    }
    
    // Check if user is logged in on page load
    function checkAuth() {
        const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
        
        if (token && userData) {
            try {
                const user = JSON.parse(userData);
                return { isAuthenticated: true, user };
            } catch (error) {
                return { isAuthenticated: false };
            }
        } else {
            return { isAuthenticated: false };
        }
    }
    
    // Update UI based on authentication status
    function updateAuthUI() {
        const { isAuthenticated, user } = checkAuth();
        
        const btnLogin = document.getElementById('btn-login');
        const btnRegister = document.getElementById('btn-register');
        
        if (isAuthenticated && user) {
            // Change login button to profile
            if (btnLogin) {
                btnLogin.textContent = user.name;
                btnLogin.href = '#profile';
                btnLogin.classList.add('logged-in');
                
                // On click, show a dropdown or modal with user info
                btnLogin.onclick = function(e) {
                    e.preventDefault();
                    showUserMenu(user);
                };
            }
            
            // Change register button to logout
            if (btnRegister) {
                btnRegister.textContent = 'Sair';
                btnRegister.href = '#logout';
                btnRegister.onclick = function(e) {
                    e.preventDefault();
                    logout();
                };
            }
            
            // Enable donation or request buttons based on user type
            const btnDoar = document.getElementById('btn-doar');
            const btnReceber = document.getElementById('btn-receber');
            
            if (user.type === 'business') {
                if (btnDoar) btnDoar.classList.remove('disabled');
                if (btnReceber) btnReceber.classList.add('disabled');
            } else if (user.type === 'ngo') {
                if (btnDoar) btnDoar.classList.add('disabled');
                if (btnReceber) btnReceber.classList.remove('disabled');
            }
        } else {
            // Reset to default state
            if (btnLogin) {
                btnLogin.textContent = 'Entrar';
                btnLogin.href = '#';
                btnLogin.classList.remove('logged-in');
                btnLogin.onclick = function(e) {
                    e.preventDefault();
                    openModal(document.getElementById('loginModal'));
                };
            }
            
            if (btnRegister) {
                btnRegister.textContent = 'Cadastre-se';
                btnRegister.href = '#';
                btnRegister.onclick = function(e) {
                    e.preventDefault();
                    openModal(document.getElementById('registerModal'));
                };
            }
        }
    }
    
    // Show user menu/profile
    function showUserMenu(user) {
        // In a real app, you might have a dropdown or modal with user options
        // For demo purposes, we'll just show a toast
        showToast(`Olá ${user.name}! Você está logado como ${user.type === 'business' ? 'Estabelecimento' : 'ONG'}`, 'success');
    }
    
    // Logout function
    function logout() {
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER_DATA);
        
        showToast('Você saiu com sucesso!', 'success');
        
        // Update UI to logged out state
        updateAuthUI();
    }
    
    // Call updateAuthUI on page load
    updateAuthUI();
});
