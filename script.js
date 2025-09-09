// HTML ke elements ko select karein
const scannerSection = document.getElementById('scanner-section');
const formSection = document.getElementById('form-section');
const deliveryForm = document.getElementById('delivery-form');
const trackingNumberInput = document.getElementById('tracking-number');
const scannerMessage = document.getElementById('scanner-message');

// Barcode scanner ko shuru karne ka function
function initQuagga() {
    // Quagga library ko setup karein
    Quagga.init({
        inputStream: {
            name: "Live",
            type: "LiveStream",
            target: document.getElementById('barcode-scanner-video'),
            constraints: {
                width: 640,
                height: 480,
                facingMode: "environment" // Piche wala camera
            },
        },
        decoder: {
            readers: ["ean_reader", "code_128_reader"]
        }
    }, function(err) {
        if (err) {
            console.error(err);
            scannerMessage.textContent = "Error: Camera not found.";
            return;
        }
        Quagga.start(); // Scanner shuru karein
        scannerMessage.textContent = "Scanning...";
        console.log("QuaggaJS started.");
    });

    // Jab barcode mil jaye tab yeh function chalega
    Quagga.onDetected(function(result) {
        Quagga.stop(); // Scanner ko rok dein
        console.log("Barcode detected:", result.codeResult.code);
        
        // Scanned number ko form mein bharein
        trackingNumberInput.value = result.codeResult.code;

        // Scanner ko chhupayein aur form ko dikhayein
        scannerSection.style.display = 'none';
        formSection.style.display = 'block';

        // Date field mein aaj ki date apne aap bharein
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('date').value = today;
    });
}

// Form submit hone par yeh function chalega
deliveryForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Default form submission ko rok dein
    
    // Form se saare data ko ek object mein rakhein
    const data = {
        trackingNumber: trackingNumberInput.value,
        courierType: document.getElementById('courier-type').value,
        place: document.getElementById('place').value,
        weightCategory: document.getElementById('weight-category').value,
        date: document.getElementById('date').value,
    };
    
    // Ab is data ko Google Apps Script URL par bhej dein
    sendDataToGoogleSheets(data);
});

// Data ko Google Sheets par bhejne ka function
function sendDataToGoogleSheets(data) {
    // IMPORTANT: Apne Google Apps Script ke deployed URL ko yahan paste karein
    const url = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE'; 

    fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        },
        mode: 'no-cors' // Yeh zaroori hai
    })
    .then(response => {
        // Data bhejne ke baad user ko batayein aur page reload karein
        alert('Data submitted successfully!');
        window.location.reload(); 
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error submitting data. Please try again.');
    });
}

// Page load hone par scanner shuru karein
window.onload = initQuagga;
