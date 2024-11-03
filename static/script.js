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
    const fileInput = document.getElementById('fileInput');
    const resultImage = document.getElementById('resultImage');
    const algorithm = document.getElementById('algorithmSwitch').checked ? "ai" : "custom";
    
    if (!fileInput.files[0]) {
        alert("Please upload an image first.");
        return;
    }
    
    const formData = new FormData();
    formData.append('algorithm', algorithm);
    formData.append('image', fileInput.files[0]);

    if (algorithm === "custom") {
        formData.append('parameters', JSON.stringify({
            lowerThreshold: document.getElementById('lowerThreshold').value,
            upperThreshold: document.getElementById('upperThreshold').value,
            kernelSize: document.getElementById('kernelSize').value,
            edgeDilate: document.getElementById('edgeDilate').value,
            minContour: document.getElementById('minContour').value,
            erosion: document.getElementById('erosion').value,
            blur: document.getElementById('blur').value
        }));
    }

    fetch('/process_image', {
        method: 'POST',
        body: formData
    })
    .then(response => response.blob())
    .then(blob => {
        const imageUrl = URL.createObjectURL(blob);
        resultImage.src = imageUrl;
        resultImage.classList.remove('hidden');
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