
// Sample data for map markers - in a real app this would come from an API
const locations = [
    {
        type: 'donor',
        name: 'Supermercado Boa Compra',
        position: { lat: -23.550520, lng: -46.633308 },
        address: 'Av. Paulista, 1000 - Bela Vista, São Paulo - SP',
        donations: [
            { name: 'Frutas', quantity: '15kg', expires: '2023-08-10' },
            { name: 'Pães', quantity: '20 unidades', expires: '2023-08-08' }
        ]
    },
    {
        type: 'donor',
        name: 'Restaurante Sabor Natural',
        position: { lat: -23.556520, lng: -46.639308 },
        address: 'Rua Augusta, 500 - Consolação, São Paulo - SP',
        donations: [
            { name: 'Refeições Prontas', quantity: '10 unidades', expires: '2023-08-07' }
        ]
    },
    {
        type: 'ngo',
        name: 'Abrigo Esperança',
        position: { lat: -23.552520, lng: -46.643308 },
        address: 'Rua Frei Caneca, 200 - Consolação, São Paulo - SP',
        needs: ['Alimentos não perecíveis', 'Frutas e Legumes']
    },
    {
        type: 'ngo',
        name: 'Lar das Crianças',
        position: { lat: -23.559520, lng: -46.645308 },
        address: 'Rua Oscar Freire, 800 - Jardins, São Paulo - SP',
        needs: ['Leite', 'Pães', 'Carnes']
    }
];

function initMap() {
    // Check if the map element exists
    const mapElement = document.getElementById('map');
    if (!mapElement) return;
    
    // Create map centered on São Paulo
    const map = new google.maps.Map(mapElement, {
        center: { lat: -23.55052, lng: -46.633308 },
        zoom: 13,
        styles: [
            {
                "featureType": "poi",
                "stylers": [{ "visibility": "off" }]
            }
        ]
    });
    
    // Create info window for markers
    const infoWindow = new google.maps.InfoWindow();
    
    // Add markers for each location
    locations.forEach(location => {
        // Create marker
        const marker = new google.maps.Marker({
            position: location.position,
            map: map,
            title: location.name,
            icon: {
                url: location.type === 'donor' 
                    ? 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
                    : 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                scaledSize: new google.maps.Size(40, 40)
            },
            animation: google.maps.Animation.DROP
        });
        
        // Create info window content
        let contentString = `<div class="info-window">
            <h3>${location.name}</h3>
            <p><strong>Endereço:</strong> ${location.address}</p>`;
        
        if (location.type === 'donor') {
            contentString += `<p><strong>Tipo:</strong> Doador</p>
                <div class="donations">
                    <p><strong>Doações disponíveis:</strong></p>
                    <ul>`;
            location.donations.forEach(donation => {
                contentString += `<li>${donation.name} - ${donation.quantity} (Validade: ${donation.expires})</li>`;
            });
            contentString += `</ul>
                </div>`;
        } else {
            contentString += `<p><strong>Tipo:</strong> ONG/Instituição</p>
                <div class="needs">
                    <p><strong>Necessidades:</strong></p>
                    <ul>`;
            location.needs.forEach(need => {
                contentString += `<li>${need}</li>`;
            });
            contentString += `</ul>
                </div>`;
        }
        
        contentString += `<button class="map-btn">${location.type === 'donor' ? 'Solicitar Doação' : 'Ver Detalhes'}</button>
            </div>`;
        
        // Add click listener to marker
        marker.addListener("click", () => {
            infoWindow.setContent(contentString);
            infoWindow.open(map, marker);
        });
    });
    
    // Try to get user's location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                
                // Create current location marker
                const userMarker = new google.maps.Marker({
                    position: pos,
                    map: map,
                    title: 'Sua localização',
                    icon: {
                        url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
                        scaledSize: new google.maps.Size(40, 40)
                    },
                    animation: google.maps.Animation.BOUNCE
                });
                
                // Center map on user location
                map.setCenter(pos);
                
                setTimeout(() => {
                    userMarker.setAnimation(null);
                }, 3000);
            },
            () => {
                console.log("Error: The Geolocation service failed.");
            }
        );
    } else {
        console.log("Error: Browser doesn't support Geolocation");
    }
    
    // Add map styles
    const styles = document.createElement('style');
    styles.innerHTML = `
        .info-window {
            padding: 5px;
            max-width: 300px;
        }
        .info-window h3 {
            margin-top: 0;
            color: #4CAF50;
        }
        .info-window ul {
            padding-left: 20px;
        }
        .map-btn {
            background-color: #4CAF50;
            color: white;
            border: none;
            padding: 8px 15px;
            border-radius: 4px;
            margin-top: 10px;
            cursor: pointer;
            font-weight: 600;
        }
        .map-btn:hover {
            background-color: #388E3C;
        }
    `;
    document.head.appendChild(styles);
}

// Fallback if Google Maps fails to load
window.initMapFallback = function() {
    console.error('Google Maps failed to load');
    const mapElement = document.getElementById('map');
    if (mapElement) {
        mapElement.innerHTML = `
            <div style="height:100%; display:flex; align-items:center; justify-content:center; flex-direction:column; background:#f1f1f1; padding:20px; border-radius:8px; text-align:center;">
                <i class="fas fa-map-marked-alt" style="font-size:3rem; color:#4CAF50; margin-bottom:15px;"></i>
                <h3>Mapa não disponível no momento</h3>
                <p>Não foi possível carregar o mapa. Por favor, tente novamente mais tarde.</p>
            </div>
        `;
    }
};

// Handle Google Maps API failure
window.gm_authFailure = function() {
    window.initMapFallback();
};

// In case the API script fails to load
setTimeout(() => {
    if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
        window.initMapFallback();
    }
}, 5000);
