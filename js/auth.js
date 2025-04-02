
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
                // Get all registered users
                const usersData = localStorage.getItem('feedthefuture_users');
                let users = [];
                
                if (usersData) {
                    try {
                        users = JSON.parse(usersData);
                    } catch (error) {
                        console.error('Error parsing user data:', error);
                    }
                }
                
                // Check if user exists
                const user = users.find(u => u.email === email);
                
                if (user && user.password === password) { // In a real app, we'd properly hash and check passwords
                    // Save to localStorage (in a real app, you'd store a JWT token)
                    const mockToken = 'mock_token_' + Math.random().toString(36).substr(2, 16);
                    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, mockToken);
                    
                    // Don't store password in session data
                    const sessionUser = {...user};
                    delete sessionUser.password;
                    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(sessionUser));
                    
                    // Show success toast
                    showToast(`Bem-vindo(a) de volta, ${user.nome}!`, 'success');
                    
                    // Close the modal
                    closeModal(document.getElementById('loginModal'));
                    
                    // Update UI to logged in state
                    updateAuthUI();
                } else {
                    showToast('Email ou senha incorretos', 'error');
                }
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
            
            const nome = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const tipo = document.getElementById('registerType').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('registerConfirmPassword').value;
            
            // New fields based on the DER
            const cpf = document.getElementById('registerCPF').value;
            const telefone = document.getElementById('registerPhone').value;
            const endereco = document.getElementById('registerAddress').value;
            
            // For ONG, we'll need additional fields
            const cnpj = tipo === 'ngo' ? document.getElementById('registerCNPJ').value : '';
            
            // Simple validation
            if (!nome || !email || !tipo || !password || !telefone || !endereco) {
                showToast('Por favor, preencha todos os campos obrigatórios', 'error');
                return;
            }
            
            if (password !== confirmPassword) {
                showToast('As senhas não coincidem', 'error');
                return;
            }
            
            // CPF validation for individuals, CNPJ for NGOs
            if (tipo === 'business' && !cpf) {
                showToast('CPF é obrigatório para estabelecimentos', 'error');
                return;
            }
            
            if (tipo === 'ngo' && !cnpj) {
                showToast('CNPJ é obrigatório para ONGs', 'error');
                return;
            }
            
            // Get existing users to check for duplicates
            const usersData = localStorage.getItem('feedthefuture_users');
            let users = [];
            
            if (usersData) {
                try {
                    users = JSON.parse(usersData);
                } catch (error) {
                    console.error('Error parsing user data:', error);
                }
            }
            
            // Check if email already exists
            if (users.some(u => u.email === email)) {
                showToast('Este email já está cadastrado', 'error');
                return;
            }
            
            // Generate a new user ID
            const userId = 'user_' + Math.random().toString(36).substr(2, 9);
            
            // Create the user object according to the DER "pessoas" table
            const userData = {
                id: userId,
                nome: nome,
                email: email,
                tipo: tipo,
                cpf: cpf,
                cnpj: cnpj,
                telefone: telefone,
                endereco: endereco,
                password: password, // In a real app, this would be hashed
                createdAt: new Date().toISOString()
            };
            
            // Save to users collection
            users.push(userData);
            localStorage.setItem('feedthefuture_users', JSON.stringify(users));
            
            // Create an ONG entry if user type is NGO
            if (tipo === 'ngo') {
                const ongs = JSON.parse(localStorage.getItem('feedthefuture_ongs') || '[]');
                
                const ongData = {
                    id_ong: `ong_${Math.random().toString(36).substr(2, 9)}`,
                    id_pessoa: userId,
                    nome: nome,
                    cnpj: cnpj,
                    endereco: endereco,
                    telefone: telefone
                };
                
                ongs.push(ongData);
                localStorage.setItem('feedthefuture_ongs', JSON.stringify(ongs));
            }
            
            // Save user data to session (without password)
            const sessionUser = {...userData};
            delete sessionUser.password;
            
            const mockToken = 'mock_token_' + Math.random().toString(36).substr(2, 16);
            localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, mockToken);
            localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(sessionUser));
            
            // Show success toast
            showToast(`Cadastro realizado com sucesso! Bem-vindo(a), ${nome}!`, 'success');
            
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
                btnLogin.textContent = user.nome;
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
            
            if (user.tipo === 'business') {
                if (btnDoar) btnDoar.classList.remove('disabled');
                if (btnReceber) btnReceber.classList.add('disabled');
            } else if (user.tipo === 'ngo') {
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
        showToast(`Olá ${user.nome}! Você está logado como ${user.tipo === 'business' ? 'Estabelecimento' : 'ONG'}`, 'success');
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
