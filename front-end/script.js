// script.js

const imageInput = document.getElementById("imageInput");
const uploadedImage = document.getElementById("uploadedImage");
const resultImage = document.getElementById("resultImage");
const removeButton = document.getElementById("removeButton");
const keepButton = document.getElementById("keepButton");
const imageCanvas = document.getElementById("imageCanvas");
const ctx = imageCanvas.getContext("2d");
const sensitivityInput = document.getElementById("sensitivity");
const smoothnessInput = document.getElementById("smoothness");

let selectedPixel = null; 
let originalImageData = null; 

// Função para lidar com o carregamento da imagem
imageInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = new Image();
            img.src = e.target.result;
            img.onload = () => {
                imageCanvas.width = img.width;
                imageCanvas.height = img.height; 
                ctx.drawImage(img, 0, 0); 
                originalImageData = ctx.getImageData(0, 0, imageCanvas.width, imageCanvas.height); 
                imageCanvas.style.display = "block"; 
            };
        };
        reader.readAsDataURL(file);
    }
});

// Função para aplicar suavidade na visualização
function applySmoothness(smoothness) {
    
}

// Evento para alterar a suavidade
smoothnessInput.addEventListener("input", () => {
    const smoothnessValue = smoothnessInput.value / 10; 
    applySmoothness(smoothnessValue); 
});

// Função para selecionar um pixel ao clicar na imagem
imageCanvas.addEventListener("click", (event) => {
    const rect = imageCanvas.getBoundingClientRect();
    const scaleX = imageCanvas.width / rect.width; 
    const scaleY = imageCanvas.height / rect.height; 
    const x = Math.floor((event.clientX - rect.left) * scaleX); 
    const y = Math.floor((event.clientY - rect.top) * scaleY); 

    ctx.putImageData(originalImageData, 0, 0);
    applySmoothness(smoothnessInput.value / 10); 

    selectedPixel = { x, y }; 
    markSelectedPixel(x, y); 
});

// Função para marcar o pixel selecionado na imagem
function markSelectedPixel(x, y) {
    ctx.fillStyle = "rgba(255, 0, 0, 0.5)"; 
    ctx.fillRect(x - 5, y - 5, 10, 10); 
}

// Função para lidar com o botão "Remover"
removeButton.addEventListener("click", () => {
    if (selectedPixel) {
        const smoothnessValue = smoothnessInput.value / 10; 
        const sensitivityValue = sensitivityInput.value; 
        ctx.putImageData(originalImageData, 0, 0); 
        resultImage.src = imageCanvas.toDataURL(); 
        alert(`Você removeu a região no pixel: (${selectedPixel.x}, ${selectedPixel.y}) com suavidade: ${smoothnessValue} e intensidade: ${sensitivityValue}`);
        
        resultImage.scrollIntoView({ behavior: "smooth" });
    }
});

// Função para lidar com o botão "Manter"
keepButton.addEventListener("click", () => {
    if (selectedPixel) {
        const smoothnessValue = smoothnessInput.value / 10; 
        const sensitivityValue = sensitivityInput.value; 
        ctx.putImageData(originalImageData, 0, 0); 
        resultImage.src = imageCanvas.toDataURL(); 
        alert(`Você manteve a região no pixel: (${selectedPixel.x}, ${selectedPixel.y}) com suavidade: ${smoothnessValue} e intensidade: ${sensitivityValue}`);
        
        resultImage.scrollIntoView({ behavior: "smooth" });
    }
});

// Função para lidar com o botão "Download"
document.getElementById("downloadButton").addEventListener("click", () => {
    const imageSrc = resultImage.src; 
    if (imageSrc) {
        const link = document.createElement("a"); 
        link.href = imageSrc; 
        link.download = "processed_image.png"; 
        document.body.appendChild(link); 
        link.click(); 
        document.body.removeChild(link); 
    } else {
        alert("Nenhuma imagem disponível para download.");
    }
});


const dropArea = document.getElementById("dropArea");

// Previne o comportamento padrão ao arrastar e soltar
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false);   
    document.body.addEventListener(eventName, preventDefaults, false); 
});

// Adiciona classes ao entrar ou sair da área de drop
['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, unhighlight, false);
});

// Lida com o evento de soltar
dropArea.addEventListener('drop', handleDrop, false);

// Função para prevenir comportamento padrão
function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

// Função para destacar a área de drop
function highlight() {
    dropArea.classList.add('bg-gray-200');
}

// Função para remover o destaque da área de drop
function unhighlight() {
    dropArea.classList.remove('bg-gray-200');
}

// Função para lidar com o arquivo solto
function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;

    handleFiles(files);
}

// Função para lidar com os arquivos (para o upload)
function handleFiles(files) {
    const file = files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = new Image();
            img.src = e.target.result;
            img.onload = () => {
                imageCanvas.width = img.width;
                imageCanvas.height = img.height; 
                ctx.drawImage(img, 0, 0); 
                originalImageData = ctx.getImageData(0, 0, imageCanvas.width, imageCanvas.height); 
                imageCanvas.style.display = "block"; 
            };
        };
        reader.readAsDataURL(file);
    }
}

// Conectar o clique no rótulo ao input de arquivo
dropArea.addEventListener("click", () => {
    imageInput.click();
});
