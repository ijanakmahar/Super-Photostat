// HTML elements ko select karein
const scannerSection = document.getElementById('scanner-section');
const formSection = document.getElementById('form-section');
const deliveryForm = document.getElementById('delivery-form');
const trackingNumberInput = document.getElementById('tracking-number');
const readerDiv = document.getElementById('reader');

// Barcode scanner ko initialize karein
const html5QrcodeScanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 });

// Scanner ko shuru karein aur success par yeh function chalega
html5QrcodeScanner.render(onScanSuccess);

function onScanSuccess(decodedText) {
  // Scanner ko rok dein
  html5QrcodeScanner.clear();
  
  // Tracking number ko form field mein bharein
  trackingNumberInput.value = decodedText;

  // Scanner section ko chhupayein aur form section ko dikhayein
  scannerSection.style.display = 'none';
  formSection.style.display = 'block';

  // Date field mein aaj ki date apne aap bharein
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('date').value = today;
}


// Form submit hone par yeh function chalega
deliveryForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Default form submission ko rok dein

    const data = {
    trackingNumber: trackingNumberInput.value,
    courierType: document.getElementById('courier-type').value,
    place: document.getElementById('place').value,
    zone: document.getElementById('zone').value, // Yeh nayi line hai
    weightCategory: document.getElementById('weight-category').value,
    date: document.getElementById('date').value,
};
    
    sendDataToGoogleSheets(data);
});

// Data ko Google Sheets par bhejne ka function
function sendDataToGoogleSheets(data) {
    const url = 'https://script.google.com/macros/s/AKfycbzP-ouwzlyHue65v1MD-xrKqA5ivOdVVBF0DH9oTN-c8KCPAyjTIsOvlEwFu0NOJ1Gl/exec'; 

    fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        },
        mode: 'no-cors'
    })
    .then(response => {
        alert('Data submitted successfully!');
        window.location.reload(); 
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error submitting data. Please try again.');
    });
}
