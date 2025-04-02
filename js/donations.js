
document.addEventListener('DOMContentLoaded', function() {
    // Local storage keys
    const STORAGE_KEYS = {
        DOACOES: 'feedthefuture_doacoes',
        AGENDAMENTOS: 'feedthefuture_agendamentos',
        ITENS: 'feedthefuture_itens',
        CATEGORIAS: 'feedthefuture_categorias',
        IMPACTOS: 'feedthefuture_impactos',
        USER_DATA: 'feedthefuture_user_data'
    };
    
    // Initialize categories if they don't exist
    initializeCategories();
    
    // Get user data
    function getUser() {
        const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
        if (userData) {
            try {
                return JSON.parse(userData);
            } catch (error) {
                return null;
            }
        }
        return null;
    }
    
    // Donation form
    const donationForm = document.getElementById('donationForm');
    if (donationForm) {
        // Populate categories dropdown in the form
        const foodCategorySelect = document.getElementById('foodCategory');
        if (foodCategorySelect) {
            const categorias = getCategorias();
            categorias.forEach(categoria => {
                const option = document.createElement('option');
                option.value = categoria.id;
                option.textContent = categoria.nome;
                foodCategorySelect.appendChild(option);
            });
        }
        
        donationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const user = getUser();
            if (!user) {
                showToast('Você precisa estar logado para cadastrar doações', 'error');
                closeModal(document.getElementById('donationModal'));
                openModal(document.getElementById('loginModal'));
                return;
            }
            
            if (user.tipo !== 'business') {
                showToast('Apenas estabelecimentos podem cadastrar doações', 'warning');
                closeModal(document.getElementById('donationModal'));
                return;
            }
            
            // Get form data
            const foodName = document.getElementById('foodName').value;
            const foodCategory = document.getElementById('foodCategory').value;
            const quantity = document.getElementById('quantity').value;
            const unit = document.getElementById('unit').value;
            const expirationDate = document.getElementById('expirationDate').value;
            const address = document.getElementById('address').value;
            const pickupTimes = document.getElementById('pickup-times').value;
            const tipoEntrega = document.getElementById('deliveryType').value; // Tipo_Entrega no DER
            
            // Validate
            if (!foodName || !foodCategory || !quantity || !expirationDate || !address || !pickupTimes || !tipoEntrega) {
                showToast('Por favor, preencha todos os campos', 'error');
                return;
            }
            
            // Create item entry
            const itemId = 'item_' + Math.random().toString(36).substr(2, 9);
            const item = {
                id: itemId,
                descricao: foodName,
                estado: 'Bom', // Default state
                id_doador: user.id,
                id_categoria: foodCategory
            };
            
            // Save item
            saveItem(item);
            
            // Create donation object (doacoes table)
            const doacaoId = 'doacao_' + Math.random().toString(36).substr(2, 9);
            const doacao = {
                id: doacaoId,
                id_item: itemId,
                id_ong: null, // Will be assigned when an ONG requests it
                data_doacao: new Date().toISOString(),
                tipo_entrega: tipoEntrega,
                quantidade: quantity,
                unidade: unit,
                endereco_coleta: address,
                horarios_coleta: pickupTimes,
                expirationDate: expirationDate,
                status: 'available' // available, requested, completed
            };
            
            // Save donation
            saveDoacao(doacao);
            
            // Calculate and save environmental impact
            const impacto = {
                id: 'impacto_' + Math.random().toString(36).substr(2, 9),
                id_doacao: doacaoId,
                quantidade_alimentos: parseFloat(quantity),
                reducao_co2: calculaReducaoCO2(quantity, unit),
                data_calculo: new Date().toISOString()
            };
            
            saveImpacto(impacto);
            
            // Show success toast
            showToast('Doação cadastrada com sucesso!', 'success');
            
            // Reset form and close modal
            donationForm.reset();
            closeModal(document.getElementById('donationModal'));
            
            // Update donation stats
            updateStatistics();
        });
    }
    
    // Calculate CO2 reduction based on food quantity
    function calculaReducaoCO2(quantidade, unidade) {
        // Approximate calculation: 2.5kg CO2 per kg food waste avoided
        let quantidadeEmKg = parseFloat(quantidade);
        
        if (unidade !== 'kg') {
            // Convert to kg if unit is different
            // This is a simplification; in a real app you'd have conversion factors for different food types
            quantidadeEmKg = quantidadeEmKg * 0.3; // Assuming average weight
        }
        
        return quantidadeEmKg * 2.5;
    }
    
    // Save item to local storage
    function saveItem(item) {
        let itens = [];
        const storedItens = localStorage.getItem(STORAGE_KEYS.ITENS);
        
        if (storedItens) {
            try {
                itens = JSON.parse(storedItens);
            } catch (error) {
                itens = [];
            }
        }
        
        itens.push(item);
        localStorage.setItem(STORAGE_KEYS.ITENS, JSON.stringify(itens));
    }
    
    // Save donation to local storage
    function saveDoacao(doacao) {
        let doacoes = [];
        const storedDoacoes = localStorage.getItem(STORAGE_KEYS.DOACOES);
        
        if (storedDoacoes) {
            try {
                doacoes = JSON.parse(storedDoacoes);
            } catch (error) {
                doacoes = [];
            }
        }
        
        doacoes.push(doacao);
        localStorage.setItem(STORAGE_KEYS.DOACOES, JSON.stringify(doacoes));
    }
    
    // Save environmental impact
    function saveImpacto(impacto) {
        let impactos = [];
        const storedImpactos = localStorage.getItem(STORAGE_KEYS.IMPACTOS);
        
        if (storedImpactos) {
            try {
                impactos = JSON.parse(storedImpactos);
            } catch (error) {
                impactos = [];
            }
        }
        
        impactos.push(impacto);
        localStorage.setItem(STORAGE_KEYS.IMPACTOS, JSON.stringify(impactos));
    }
    
    // Save agendamento to local storage
    function saveAgendamento(agendamento) {
        let agendamentos = [];
        const storedAgendamentos = localStorage.getItem(STORAGE_KEYS.AGENDAMENTOS);
        
        if (storedAgendamentos) {
            try {
                agendamentos = JSON.parse(storedAgendamentos);
            } catch (error) {
                agendamentos = [];
            }
        }
        
        agendamentos.push(agendamento);
        localStorage.setItem(STORAGE_KEYS.AGENDAMENTOS, JSON.stringify(agendamentos));
    }
    
    // Initialize categories
    function initializeCategories() {
        const storedCategorias = localStorage.getItem(STORAGE_KEYS.CATEGORIAS);
        
        if (!storedCategorias) {
            const categorias = [
                { id: 'cat_1', nome: 'Frutas e Vegetais', descricao: 'Alimentos frescos como frutas e vegetais' },
                { id: 'cat_2', nome: 'Grãos', descricao: 'Arroz, feijão, milho e outros grãos' },
                { id: 'cat_3', nome: 'Padaria', descricao: 'Pães, bolos e produtos de padaria' },
                { id: 'cat_4', nome: 'Laticínios', descricao: 'Leite, queijo e outros produtos lácteos' },
                { id: 'cat_5', nome: 'Carnes', descricao: 'Produtos de origem animal' },
                { id: 'cat_6', nome: 'Enlatados', descricao: 'Alimentos enlatados e conservas' },
                { id: 'cat_7', nome: 'Outros', descricao: 'Outros tipos de alimentos' }
            ];
            
            localStorage.setItem(STORAGE_KEYS.CATEGORIAS, JSON.stringify(categorias));
        }
    }
    
    // Get all categorias
    function getCategorias() {
        const storedCategorias = localStorage.getItem(STORAGE_KEYS.CATEGORIAS);
        if (storedCategorias) {
            try {
                return JSON.parse(storedCategorias);
            } catch (error) {
                return [];
            }
        }
        return [];
    }
    
    // Get all doacoes
    function getDoacoes() {
        const storedDoacoes = localStorage.getItem(STORAGE_KEYS.DOACOES);
        if (storedDoacoes) {
            try {
                return JSON.parse(storedDoacoes);
            } catch (error) {
                return [];
            }
        }
        return [];
    }
    
    // Get all itens
    function getItens() {
        const storedItens = localStorage.getItem(STORAGE_KEYS.ITENS);
        if (storedItens) {
            try {
                return JSON.parse(storedItens);
            } catch (error) {
                return [];
            }
        }
        return [];
    }
    
    // Get all impactos
    function getImpactos() {
        const storedImpactos = localStorage.getItem(STORAGE_KEYS.IMPACTOS);
        if (storedImpactos) {
            try {
                return JSON.parse(storedImpactos);
            } catch (error) {
                return [];
            }
        }
        return [];
    }
    
    // Update statistics on the page
    function updateStatistics() {
        const doacoes = getDoacoes();
        const impactos = getImpactos();
        
        // Calculate total food donated
        let totalKg = 0;
        
        impactos.forEach(impacto => {
            totalKg += parseFloat(impacto.quantidade_alimentos);
        });
        
        // Update DOM if elements exist
        const donatedStat = document.querySelector('.stat-item:nth-child(1) h3');
        if (donatedStat) {
            donatedStat.textContent = `${totalKg.toFixed(0)} kg`;
        }
        
        // Calculate unique donors
        const uniqueDonors = new Set(
            doacoes.map(d => {
                const item = getItens().find(i => i.id === d.id_item);
                return item ? item.id_doador : null;
            }).filter(id => id !== null)
        ).size;
        
        const businessesStat = document.querySelector('.stat-item:nth-child(2) h3');
        if (businessesStat) {
            businessesStat.textContent = uniqueDonors.toString();
        }
        
        // Calculate unique NGOs
        const uniqueNgos = new Set(
            doacoes
                .filter(d => d.id_ong !== null)
                .map(d => d.id_ong)
        ).size;
        
        const ngosStat = document.querySelector('.stat-item:nth-child(3) h3');
        if (ngosStat) {
            ngosStat.textContent = uniqueNgos.toString();
        }
        
        // Calculate CO2 savings
        let co2Saved = 0;
        impactos.forEach(impacto => {
            co2Saved += parseFloat(impacto.reducao_co2);
        });
        
        const co2Stat = document.querySelector('.stat-item:nth-child(4) h3');
        if (co2Stat) {
            co2Stat.textContent = `${co2Saved.toFixed(0)} kg`;
        }
    }
    
    // Sample data for demonstration
    function initializeSampleData() {
        // Check if data already exists
        const doacoes = getDoacoes();
        const itens = getItens();
        const impactos = getImpactos();
        
        if (doacoes.length === 0 && itens.length === 0) {
            // Create sample category if not exists
            initializeCategories();
            
            // Create sample items
            const sampleItems = [
                {
                    id: 'item_sample1',
                    descricao: 'Maçãs',
                    estado: 'Bom',
                    id_doador: 'user_sample1',
                    id_categoria: 'cat_1'
                },
                {
                    id: 'item_sample2',
                    descricao: 'Arroz',
                    estado: 'Bom',
                    id_doador: 'user_sample2',
                    id_categoria: 'cat_2'
                },
                {
                    id: 'item_sample3',
                    descricao: 'Pão Francês',
                    estado: 'Bom',
                    id_doador: 'user_sample3',
                    id_categoria: 'cat_3'
                }
            ];
            
            localStorage.setItem(STORAGE_KEYS.ITENS, JSON.stringify(sampleItems));
            
            // Create sample donations
            const sampleDoacoes = [
                {
                    id: 'doacao_sample1',
                    id_item: 'item_sample1',
                    id_ong: null,
                    data_doacao: '2023-08-01T10:30:00Z',
                    tipo_entrega: 'Retirada',
                    quantidade: '15',
                    unidade: 'kg',
                    endereco_coleta: 'Av. Paulista, 1000 - São Paulo',
                    horarios_coleta: 'Segunda a Sexta, 10h às 18h',
                    expirationDate: '2023-08-15',
                    status: 'available'
                },
                {
                    id: 'doacao_sample2',
                    id_item: 'item_sample2',
                    id_ong: 'user_ngo1',
                    data_doacao: '2023-08-02T14:45:00Z',
                    tipo_entrega: 'Entrega',
                    quantidade: '20',
                    unidade: 'kg',
                    endereco_coleta: 'Rua Augusta, 500 - São Paulo',
                    horarios_coleta: 'Segunda a Sábado, 9h às 17h',
                    expirationDate: '2023-12-31',
                    status: 'requested'
                },
                {
                    id: 'doacao_sample3',
                    id_item: 'item_sample3',
                    id_ong: 'user_ngo2',
                    data_doacao: '2023-08-03T18:20:00Z',
                    tipo_entrega: 'Retirada',
                    quantidade: '50',
                    unidade: 'unidades',
                    endereco_coleta: 'Rua da Consolação, 200 - São Paulo',
                    horarios_coleta: 'Todos os dias, após 19h',
                    expirationDate: '2023-08-08',
                    status: 'completed'
                }
            ];
            
            localStorage.setItem(STORAGE_KEYS.DOACOES, JSON.stringify(sampleDoacoes));
            
            // Create sample environmental impacts
            const sampleImpactos = [
                {
                    id: 'impacto_sample1',
                    id_doacao: 'doacao_sample1',
                    quantidade_alimentos: 15,
                    reducao_co2: 37.5, // 15kg * 2.5
                    data_calculo: '2023-08-01T10:35:00Z'
                },
                {
                    id: 'impacto_sample2',
                    id_doacao: 'doacao_sample2',
                    quantidade_alimentos: 20,
                    reducao_co2: 50, // 20kg * 2.5
                    data_calculo: '2023-08-02T14:50:00Z'
                },
                {
                    id: 'impacto_sample3',
                    id_doacao: 'doacao_sample3',
                    quantidade_alimentos: 15, // Assuming 50 units = 15kg
                    reducao_co2: 37.5, // 15kg * 2.5
                    data_calculo: '2023-08-03T18:25:00Z'
                }
            ];
            
            localStorage.setItem(STORAGE_KEYS.IMPACTOS, JSON.stringify(sampleImpactos));
        }
    }
    
    // Initialize sample data and update stats
    initializeSampleData();
    updateStatistics();
    
    // Set min date for expiration date input to today
    const expirationDateInput = document.getElementById('expirationDate');
    if (expirationDateInput) {
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const yyyy = today.getFullYear();
        expirationDateInput.min = yyyy + '-' + mm + '-' + dd;
    }
});
