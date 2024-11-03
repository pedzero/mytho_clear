function previewImage(event) {
    const fileInput = event.target;
    const previewImage = document.getElementById('previewImage');
    const placeholderText = document.getElementById('placeholderText');
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            previewImage.src = e.target.result;
            previewImage.classList.remove('hidden');
            placeholderText.classList.add('hidden');
        };
        reader.readAsDataURL(file);
    }
}

function toggleAdjustments() {
    const isChecked = document.getElementById('algorithmSwitch').checked;
    const adjustments = document.getElementById('adjustments');
    adjustments.querySelectorAll('input').forEach(input => {
        input.disabled = isChecked;
    });
}

function processImage() {
    const previewImage = document.getElementById('previewImage');
    const resultImage = document.getElementById('resultImage');
    const algorithm = !document.getElementById('algorithmSwitch').checked ? "custom" : "ai";

    if (!previewImage.src) {
        alert("Please upload an image first.");
        return;
    }

    const parameters = {
        lowerThreshold: document.getElementById('lowerThreshold').value,
        upperThreshold: document.getElementById('upperThreshold').value,
        kernelSize: document.getElementById('kernelSize').value,
        edgeDilate: document.getElementById('edgeDilate').value,
        minContour: document.getElementById('minContour').value,
        erosion: document.getElementById('erosion').value,
        blur: document.getElementById('blur').value
    };

    fetch('/process_image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            algorithm: algorithm,
            image: previewImage.src.split(',')[1],
            parameters: parameters
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.image) {
            resultImage.src = 'data:image/png;base64,' + data.image;
            resultImage.classList.remove('hidden');
        } else {
            alert("Error processing image.");
        }
    })
    .catch(error => console.error('Error:', error));
}

function downloadImage() {
    const resultImage = document.getElementById('resultImage');
    
    if (!resultImage.src || resultImage.classList.contains('hidden')) {
        alert("No processed image to download.");
        return;
    }

    const link = document.createElement('a');
    link.href = resultImage.src;
    link.download = 'processed_image.png';
    link.click();
}