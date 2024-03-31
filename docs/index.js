async function fetchExchangeRate() {
	const baseCurrency = 'EUR';
	const targetCurrency = 'GMD';
	
	try {
		// Using the Open Exchange Rates API for a simple exchange rate request.
		const response = await fetch(`https://open.er-api.com/v6/latest/${baseCurrency}`);
		if (!response.ok) throw new Error(`API call failed with status: ${response.status}`);
		
		const data = await response.json();
		return data.rates[targetCurrency];
	} catch (error) {
		console.error("Failed to fetch exchange rate:", error);
		document.getElementById('exchangeRate').textContent = 'Could not load exchange rate.';
	}
}

let EXCHANGE_RATE;
fetchExchangeRate().then(
	(rate) => EXCHANGE_RATE = rate
)

function calculateCost() {
	const distance = parseFloat(document.getElementById('distance').value) || 0;
	const isReturn = document.getElementById('return').checked;
	const hours = parseFloat(document.getElementById('hours').value) || 0;
	const totalDistance = isReturn ? distance * 2 : distance;
	const totalCost = 2 + totalDistance * 0.2 + hours;
	const totalCostGMD = totalCost * EXCHANGE_RATE
	document.getElementById('totalCost').innerText = 'Total Cost: ' + Math.round(totalCost) + '€ =' + Math.round(totalCostGMD / 100) * 100 + 'GMD';
}