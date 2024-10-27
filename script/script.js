const container = document.getElementById('numbersContainer');
const soldNumbers = new Set();  // Conjunto para almacenar números vendidos
const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRitwKNTE15_0ZOnz7tvwzxP03g1nuj1qODACmxBXYyCYc7Cq0_EZqmnUwSDeYqn69Y65ZxDJStdINs/pub?output=csv';

// Cambia esto por tu número de teléfono en formato internacional
const YOUR_PHONE_NUMBER = '56920506901'; // Reemplaza con tu número real

// Función para obtener números vendidos desde el CSV de Google Sheets
async function fetchSoldNumbers() {
    try {
        const response = await fetch(CSV_URL);
        const data = await response.text();
        const rows = data.split('\n');
        rows.forEach(row => {
            const [num, status] = row.trim().split(','); // Separar número y estado
            const number = parseInt(num);
            if (!isNaN(number) && status && status.toLowerCase() === 'vendido') {
                soldNumbers.add(number); // Agregar solo si está vendido
            }
        });
        markSoldNumbers();
    } catch (error) {
        console.error('Error al cargar los números vendidos:', error);
    }
}

// Función para generar los números del 1 al 1000
function generateNumbers() {
    for (let i = 1; i <= 1000; i++) {
        const numberDiv = document.createElement('div');
        numberDiv.textContent = i;
        numberDiv.classList.add('number');

        // Añade el evento de clic para seleccionar/deseleccionar el número
        numberDiv.addEventListener('click', () => {
            if (!soldNumbers.has(i)) {
                numberDiv.classList.toggle('selected');
            }
        });

        container.appendChild(numberDiv);
    }
}

// Marca los números vendidos en la interfaz
function markSoldNumbers() {
    const numberDivs = container.getElementsByClassName('number');
    for (let div of numberDivs) {
        const number = parseInt(div.textContent);
        if (soldNumbers.has(number)) {
            div.classList.add('sold'); // Añadir clase para vendido
        }
    }
}

// Función para enviar mensaje por WhatsApp
function sendWhatsAppMessage() {
    const selectedNumbers = Array.from(container.getElementsByClassName('selected'))
        .map(div => div.textContent); // Obtener los números seleccionados

    if (selectedNumbers.length > 0) {
        const total = selectedNumbers.length * 1000; // Calcular el total
        const message = `Hola, quiero tener estos números ${selectedNumbers.join(', ')} valor total = ${total} CLP, antes de cancelar debes esperar la confirmacion de que los numeros aun siguen disponibles. Muchas Gracias!`;
        const encodedMessage = encodeURIComponent(message);
        const whatsappURL = `https://wa.me/${YOUR_PHONE_NUMBER}?text=${encodedMessage}`; // Usamos tu número aquí
        window.open(whatsappURL, '_blank'); // Abrir en una nueva pestaña
    } else {
        alert('Por favor, selecciona al menos un número.'); // Mensaje si no hay selección
    }
}

// Asigna el evento al botón
document.getElementById('whatsappButton').addEventListener('click', (e) => {
    e.preventDefault(); // Prevenir el comportamiento por defecto del botón
    sendWhatsAppMessage();
});

// Llama a las funciones al cargar la página
generateNumbers();
fetchSoldNumbers();
