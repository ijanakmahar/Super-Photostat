// HTML elements ko select karein
const scannerSection = document.getElementById('scanner-section');
const formSection = document.getElementById('form-section');
const deliveryForm = document.getElementById('delivery-form');
const trackingNumberInput = document.getElementById('tracking-number');
const scannerMessage = document.getElementById('scanner-message');

// Barcode scanner ko initialize karein
function initQuagga() {
    Quagga.init({
        inputStream: {
            name: "Live",
            type: "LiveStream",
            target: document.getElementById('barcode-scanner-video'), // Video element ko target karein
            constraints: {
                width: 640,
                height: 480,
                facingMode: "environment" // Piche wala camera
            },
        },
        decoder: {
            readers: ["ean_reader", "code_128_reader"] // Barcode types
        }
    }, function(err) {
        if (err) {
            console.error(err);
            scannerMessage.textContent = "Error: Camera not found.";
            return;
        }
        Quagga.start();
        scannerMessage.textContent = "Scanning...";
        console.log("QuaggaJS started.");
    });

    // Barcode detect hone par yeh function chalega
    Quagga.onDetected(function(result) {
        Quagga.stop(); // Scanner ko rok dein
        console.log("Barcode detected:", result.codeResult.code);
        
        // Tracking number ko form field mein bharein
        trackingNumberInput.value = result.codeResult.code;

        // Scanner section ko chhupayein aur form section ko dikhayein
        scannerSection.style.display = 'none';
        formSection.style.display = 'block';

        // Date field mein aaj ki date bharein
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('date').value = today;
    });
}

// Jab form submit hoga tab yeh function chalega
deliveryForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Default form submission ko rok dein

    // Form se saara data collect karein
    const data = {
        trackingNumber: trackingNumberInput.value,
        courierType: document.getElementById('courier-type').value,
        place: document.getElementById('place').value,
        weightCategory: document.getElementById('weight-category').value,
        date: document.getElementById('date').value,
    };

    // Data ko Google Sheets par bhej do
    sendDataToGoogleSheets(data);
});

// Yeh function data ko Google Sheets par bhejne ka kaam karega
// IMPORTANT: Yeh sirf ek placeholder function hai.
// Asli logic ke liye, hum Google Apps Script ka use karenge.
function sendDataToGoogleSheets(data) {
    const url = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE'; // Google Apps Script ka URL yahan paste karein

    fetch(url, {
        method: 'POST',
        mode: 'no-cors', // CORS policy ko bypass karne ke liye
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        // Response ko handle karein
        alert('Data submitted successfully!');
        window.location.reload(); // Page ko refresh kar dein taaki naya scan ho sake
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error submitting data. Please try again.');
    });
}

// Page load hone par scanner ko shuru karein
window.onload = initQuagga;
