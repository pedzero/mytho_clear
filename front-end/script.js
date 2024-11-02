const imageInput = document.getElementById("imageInput");
const dropArea = document.getElementById("dropArea");
const imageCanvas = document.getElementById("imageCanvas");
const ctx = imageCanvas.getContext("2d");
const realizeButton = document.getElementById("realizeButton");
const toggleAI = document.getElementById("toggleAI");
const processedImage = document.getElementById("resultImage");
const loadingElement = document.getElementById("loading");

let selectedPixel = null;

// Clique no dropArea para abrir o seletor de arquivos
dropArea.addEventListener("click", () => {
    imageInput.click();
});

// Função para carregar a imagem
function loadImage(file) {
    const reader = new FileReader();
    reader.onload = function (e) {
        const img = new Image();
        img.src = e.target.result;
        img.onload = () => {
            imageCanvas.width = img.width;
            imageCanvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            imageCanvas.style.display = "block"; // Mostra o canvas
        };
    };
    reader.readAsDataURL(file); // Lê a imagem como URL de dados
}

// Manipulação do evento de mudança para input de arquivo
imageInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
        loadImage(file);
    }
});

// Manipulação de arraste e solte
dropArea.addEventListener("dragover", (event) => {
    event.preventDefault(); // Impede o comportamento padrão
    dropArea.classList.add("hover"); // Adiciona classe de hover para estilo visual
});

dropArea.addEventListener("dragleave", () => {
    dropArea.classList.remove("hover"); // Remove a classe de hover
});

dropArea.addEventListener("drop", (event) => {
    event.preventDefault(); // Impede o comportamento padrão
    dropArea.classList.remove("hover"); // Remove a classe de hover

    const files = event.dataTransfer.files; // Obtém os arquivos arrastados
    if (files.length > 0) {
        loadImage(files[0]); // Carrega a primeira imagem arrastada
    }
});

// Seleção de pixel
imageCanvas.addEventListener("click", (event) => {
    const rect = imageCanvas.getBoundingClientRect();
    const scaleX = imageCanvas.width / rect.width;
    const scaleY = imageCanvas.height / rect.height;
    const x = Math.floor((event.clientX - rect.left) * scaleX);
    const y = Math.floor((event.clientY - rect.top) * scaleY);
    
    selectedPixel = { x, y }; // Armazena as coordenadas do pixel selecionado
    markSelectedPixel(x, y); // Marca o pixel selecionado
});

function markSelectedPixel(x, y) {
    ctx.fillStyle = "rgba(255, 0, 0, 0.5)"; // Cor de marcação
    ctx.fillRect(x - 5, y - 5, 10, 10); // Desenha um quadrado no pixel
}

// Função para redimensionar a imagem antes de enviar
async function getResizedImageBlob(maxWidth, maxHeight) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    const img = ctx.getImageData(0, 0, imageCanvas.width, imageCanvas.height);
    
    // Calcular nova largura e altura mantendo a proporção
    let width = img.width;
    let height = img.height;
    if (width > maxWidth) {
        height *= maxWidth / width;
        width = maxWidth;
    }
    if (height > maxHeight) {
        width *= maxHeight / height;
        height = maxHeight;
    }

    // Configurar canvas com novas dimensões
    canvas.width = width;
    canvas.height = height;
    
    // Desenhar a imagem redimensionada
    ctx.drawImage(imageCanvas, 0, 0, width, height);
    
    // Retornar a imagem como Blob
    return new Promise((resolve) => {
        canvas.toBlob((blob) => {
            resolve(blob);
        }, "image/png");
    });
}

realizeButton.addEventListener("click", async () => {
    if (!selectedPixel) {
        alert("Por favor, selecione um pixel na imagem."); 
        return;
    }

    const isAIModeEnabled = toggleAI.checked; 

    // Mostra o efeito de loading
    loadingElement.classList.remove("hidden");

    const imageBase64 = imageCanvas.toDataURL("image/png").split(",")[1]; 

    const requestData = {
        x: selectedPixel.x,
        y: selectedPixel.y,
        use_removal: isAIModeEnabled,
        image: imageBase64
    };

    try {
        const response = await fetch("http://127.0.0.1:5000/process_image", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData)
        });

        if (!response.ok) {
            throw new Error("Erro na requisição para a API.");
        }

        const responseData = await response.json();
        const processedImageBase64 = responseData.result_image;

        processedImage.src = "data:image/png;base64," + processedImageBase64;
        processedImage.style.display = "block";

        // Rolagem automática para a seção da imagem processada
        processedImage.scrollIntoView({ behavior: "smooth" });

    } catch (error) {
        console.error("Erro ao realizar a requisição:", error);
    } finally {
        loadingElement.classList.add("hidden");
    }
});

// Adicione esta parte no seu script.js após a lógica de 'realizeButton'
const downloadButton = document.getElementById("downloadButton");

downloadButton.addEventListener("click", () => {
    if (!processedImage.src) {
        alert("Por favor, processe uma imagem antes de baixar."); // Verifica se há uma imagem processada
        return;
    }

    const link = document.createElement('a'); // Cria um elemento de link
    link.href = processedImage.src; // Define o href como a imagem processada
    link.download = 'processed_image.png'; // Define o nome do arquivo para download
    document.body.appendChild(link); // Adiciona o link ao corpo do documento
    link.click(); // Simula um clique no link para iniciar o download
    document.body.removeChild(link); // Remove o link do documento
});

document.getElementById('toggleAI').addEventListener('change', function () {
    const toggle = document.getElementById('toggleAI');
    const toggleBg = document.querySelector('.toggle-bg');
    const dot = document.querySelector('.dot');

    if (toggle.checked) {
        toggleBg.classList.add('bg-blue-500');
        toggleBg.classList.remove('bg-gray-300');
        dot.classList.add('translate-x-6');
    } else {
        toggleBg.classList.remove('bg-blue-500');
        toggleBg.classList.add('bg-gray-300');
        dot.classList.remove('translate-x-6');
    }
});

document.addEventListener('DOMContentLoaded', function () {
    const toggle = document.getElementById('toggleAI');
    const toggleBg = document.querySelector('.toggle-bg');
    const dot = document.querySelector('.dot');

    // Set as active by default
    toggleBg.classList.add('active');
    dot.classList.add('active');

    toggle.addEventListener('change', function () {
        if (toggle.checked) {
            toggleBg.classList.add('active');
            dot.classList.add('active');
        } else {
            toggleBg.classList.remove('active');
            dot.classList.remove('active');
        }
    });
});