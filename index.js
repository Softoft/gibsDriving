let map;
let directionsService;
let directionsRenderer;
const SEREKUNDA_COORDS = {lat: 13.426121, lng: -16.680796}

async function initMap() {
	map = new google.maps.Map(document.getElementById("map"), {
		center: SEREKUNDA_COORDS,
		zoom: 6,
	});
	
	directionsService = new google.maps.DirectionsService();
	directionsRenderer = new google.maps.DirectionsRenderer();
	directionsRenderer.setMap(map);
	
	const originInput = document.getElementById("origin-input");
	const destinationInput = document.getElementById("destination-input");
	
	const originAutocomplete = new google.maps.places.Autocomplete(originInput);
	const destinationAutocomplete = new google.maps.places.Autocomplete(destinationInput);
	
	originAutocomplete.bindTo("bounds", map);
	destinationAutocomplete.bindTo("bounds", map);
	
	originInput.addEventListener("change", () => calculateAndDisplayRoute());
	destinationInput.addEventListener("change", () => calculateAndDisplayRoute());
}

async function calculateAndDisplayRoute() {
	const origin = document.getElementById("origin-input").value;
	const destination = document.getElementById("destination-input").value;
	if (!origin || !destination) return;
	
	try {
		const response = await directionsService.route({
			origin: origin,
			destination: destination,
			travelMode: google.maps.TravelMode.DRIVING,
		});
		
		directionsRenderer.setDirections(response);
	} catch (error) {
		alert("Could not display directions due to: " + error);
	}
}

function calculateCost(distance, isReturn, hours) {
	const totalDistance = isReturn ? distance * 2 : distance;
	const totalCost = 2 + totalDistance * 0.2 + hours;
	const totalCostGMD = totalCost * EXCHANGE_RATE
	document.getElementById('totalCost').innerText = 'Total Cost: ' + Math.round(totalCost) + '€ = ' + Math.round(totalCostGMD / 100) * 100 + 'GMD';
}