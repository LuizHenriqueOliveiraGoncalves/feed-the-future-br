
document.addEventListener('DOMContentLoaded', function() {
    // Local storage keys
    const STORAGE_KEYS = {
        DONATIONS: 'feedthefuture_donations',
        REQUESTS: 'feedthefuture_requests',
        USER_DATA: 'feedthefuture_user_data'
    };
    
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
        donationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const user = getUser();
            if (!user) {
                showToast('Você precisa estar logado para cadastrar doações', 'error');
                closeModal(document.getElementById('donationModal'));
                openModal(document.getElementById('loginModal'));
                return;
            }
            
            if (user.type !== 'business') {
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
            
            // Validate
            if (!foodName || !foodCategory || !quantity || !expirationDate || !address || !pickupTimes) {
                showToast('Por favor, preencha todos os campos', 'error');
                return;
            }
            
            // Create donation object
            const donation = {
                id: 'donation_' + Math.random().toString(36).substr(2, 9),
                foodName,
                foodCategory,
                quantity: `${quantity} ${unit}`,
                expirationDate,
                address,
                pickupTimes,
                donorId: user.id,
                donorName: user.name,
                donorEmail: user.email,
                status: 'available', // available, requested, completed
                createdAt: new Date().toISOString()
            };
            
            // Save to local storage
            saveDonation(donation);
            
            // Show success toast
            showToast('Doação cadastrada com sucesso!', 'success');
            
            // Reset form and close modal
            donationForm.reset();
            closeModal(document.getElementById('donationModal'));
            
            // Update donation stats
            updateStatistics();
        });
    }
    
    // Save donation to local storage
    function saveDonation(donation) {
        let donations = [];
        const storedDonations = localStorage.getItem(STORAGE_KEYS.DONATIONS);
        
        if (storedDonations) {
            try {
                donations = JSON.parse(storedDonations);
            } catch (error) {
                donations = [];
            }
        }
        
        donations.push(donation);
        localStorage.setItem(STORAGE_KEYS.DONATIONS, JSON.stringify(donations));
    }
    
    // Get all donations
    function getDonations() {
        const storedDonations = localStorage.getItem(STORAGE_KEYS.DONATIONS);
        if (storedDonations) {
            try {
                return JSON.parse(storedDonations);
            } catch (error) {
                return [];
            }
        }
        return [];
    }
    
    // Save request to local storage
    function saveRequest(request) {
        let requests = [];
        const storedRequests = localStorage.getItem(STORAGE_KEYS.REQUESTS);
        
        if (storedRequests) {
            try {
                requests = JSON.parse(storedRequests);
            } catch (error) {
                requests = [];
            }
        }
        
        requests.push(request);
        localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));
    }
    
    // Update statistics on the page
    function updateStatistics() {
        const donations = getDonations();
        
        // Calculate total food donated
        let totalKg = 0;
        let totalUnits = 0;
        
        donations.forEach(donation => {
            const quantityStr = donation.quantity;
            if (quantityStr.includes('kg')) {
                const kg = parseFloat(quantityStr.replace('kg', '').trim());
                if (!isNaN(kg)) totalKg += kg;
            } else if (quantityStr.includes('units') || quantityStr.includes('unidades')) {
                const units = parseInt(quantityStr.replace('units', '').replace('unidades', '').trim());
                if (!isNaN(units)) totalUnits += units;
            }
        });
        
        // Update DOM if elements exist
        const donatedStat = document.querySelector('.stat-item:nth-child(1) h3');
        if (donatedStat) {
            donatedStat.textContent = `${totalKg.toFixed(0)} kg`;
        }
        
        // Calculate unique donors
        const uniqueDonors = new Set(donations.map(d => d.donorId)).size;
        const businessesStat = document.querySelector('.stat-item:nth-child(2) h3');
        if (businessesStat) {
            businessesStat.textContent = uniqueDonors.toString();
        }
        
        // Calculate unique NGOs
        const uniqueNgos = new Set(
            donations
                .filter(d => d.status === 'requested' || d.status === 'completed')
                .map(d => d.requesterId)
        ).size;
        
        const ngosStat = document.querySelector('.stat-item:nth-child(3) h3');
        if (ngosStat) {
            ngosStat.textContent = uniqueNgos.toString();
        }
        
        // Calculate CO2 savings (roughly estimated as 2.5kg CO2 per kg food waste avoided)
        const co2Saved = totalKg * 2.5;
        const co2Stat = document.querySelector('.stat-item:nth-child(4) h3');
        if (co2Stat) {
            co2Stat.textContent = `${co2Saved.toFixed(0)} kg`;
        }
    }
    
    // Sample data for demonstration
    function initializeSampleData() {
        const donations = getDonations();
        
        if (donations.length === 0) {
            // Only add sample data if none exists
            const sampleDonations = [
                {
                    id: 'donation_sample1',
                    foodName: 'Maçãs',
                    foodCategory: 'fruits',
                    quantity: '15 kg',
                    expirationDate: '2023-08-15',
                    address: 'Av. Paulista, 1000 - São Paulo',
                    pickupTimes: 'Segunda a Sexta, 10h às 18h',
                    donorId: 'user_sample1',
                    donorName: 'Supermercado Boa Compra',
                    donorEmail: 'contato@boacompra.com.br',
                    status: 'available',
                    createdAt: '2023-08-01T10:30:00Z'
                },
                {
                    id: 'donation_sample2',
                    foodName: 'Arroz',
                    foodCategory: 'grains',
                    quantity: '20 kg',
                    expirationDate: '2023-12-31',
                    address: 'Rua Augusta, 500 - São Paulo',
                    pickupTimes: 'Segunda a Sábado, 9h às 17h',
                    donorId: 'user_sample2',
                    donorName: 'Mercado Família',
                    donorEmail: 'doacao@mercadofamilia.com.br',
                    status: 'requested',
                    requesterId: 'user_ngo1',
                    requesterName: 'Ong Alimentare',
                    createdAt: '2023-08-02T14:45:00Z'
                },
                {
                    id: 'donation_sample3',
                    foodName: 'Pão Francês',
                    foodCategory: 'bakery',
                    quantity: '50 unidades',
                    expirationDate: '2023-08-08',
                    address: 'Rua da Consolação, 200 - São Paulo',
                    pickupTimes: 'Todos os dias, após 19h',
                    donorId: 'user_sample3',
                    donorName: 'Padaria Trigo Dourado',
                    donorEmail: 'padaria@trigodourado.com.br',
                    status: 'completed',
                    requesterId: 'user_ngo2',
                    requesterName: 'Casa de Apoio Esperança',
                    createdAt: '2023-08-03T18:20:00Z',
                    completedAt: '2023-08-03T20:15:00Z'
                }
            ];
            
            localStorage.setItem(STORAGE_KEYS.DONATIONS, JSON.stringify(sampleDonations));
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
