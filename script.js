let map;
let score = 0;
let round = 1;
let actualLocation;
let marker;

const locations = [
    {
        lat: 48.8584,
        lng: 2.2945,
        name: "Paris",
        image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a",
        hints: [
            "This city is known as the City of Light",
            "You can see many cafes and bakeries selling croissants",
            "There's a famous iron tower here"
        ]
    },
    {
        lat: 40.7128,
        lng: -74.0060,
        name: "New York",
        image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9",
        hints: [
            "This city never sleeps",
            "Yellow taxis are everywhere",
            "There's a huge park in the middle of the city"
        ]
    },
    {
        lat: -33.8688,
        lng: 151.2093,
        name: "Sydney",
        image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9",
        hints: [
            "Famous opera house in this city",
            "Located in the largest country in Oceania",
            "Known for its beautiful harbors"
        ]
    },
    {
        lat: 35.6762,
        lng: 139.6503,
        name: "Tokyo",
        image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf",
        hints: [
            "World's largest metropolitan area",
            "Famous for sushi and ramen",
            "Home to the Shibuya crossing"
        ]
    },
    {
        lat: 51.5074,
        lng: -0.1278,
        name: "London",
        image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad",
        hints: [
            "Big Ben is located here",
            "Home of the royal family",
            "Famous for double-decker buses"
        ]
    }
];

function initGame() {
    map = L.map('map').setView([0, 0], 2);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    map.on('click', function(e) {
        if (marker) {
            map.removeLayer(marker);
        }
        marker = L.marker(e.latlng).addTo(map);
    });

    startRound();
}

function startRound() {
    actualLocation = locations[round - 1];
    document.getElementById('round').textContent = round;
    
    const imageElement = document.getElementById('location-image');
    imageElement.style.backgroundImage = `url('${actualLocation.image}')`;
    imageElement.style.display = 'block'; // Make sure the image container is visible
    
    const hintElement = document.getElementById('hint-text');
    if (hintElement && actualLocation.hints) {
        hintElement.textContent = actualLocation.hints[0];
    }
    
    map.setView([0, 0], 2);
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

document.getElementById('guess-btn').addEventListener('click', () => {
    if (!marker) {
        alert('Please make a guess by clicking on the map!');
        return;
    }

    const distance = calculateDistance(
        marker.getLatLng().lat,
        marker.getLatLng().lng,
        actualLocation.lat,
        actualLocation.lng
    );

    const roundScore = Math.max(5000 - Math.floor(distance * 2), 0);
    score += roundScore;
    
    document.getElementById('score').textContent = score;
    
    L.marker([actualLocation.lat, actualLocation.lng])
        .addTo(map)
        .bindPopup(`This was ${actualLocation.name}!`)
        .openPopup();

    document.getElementById('guess-btn').style.display = 'none';
    document.getElementById('next-round').style.display = 'block';
});

document.getElementById('next-round').addEventListener('click', () => {
    round++;
    if (round > 5) {
        alert(`Game Over! Final Score: ${score}`);
        round = 1;
        score = 0;
    }
    
    if (marker) {
        map.removeLayer(marker);
    }
    map.setView([0, 0], 2);
    
    document.getElementById('guess-btn').style.display = 'block';
    document.getElementById('next-round').style.display = 'none';
    
    startRound();
});

window.onload = initGame;