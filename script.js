// ==========================================
// HOTEL GUAYMARAL - main.js
// ==========================================

// Números de WhatsApp centralizados: el del hotel y los de los aliados turísticos.
// Si cambia un número, solo se edita aquí, nunca en el HTML.
const WHATSAPP_NUMBER = '573144813223'; // Hotel Guaymaral

const ALLY_WHATSAPP = {
    'cacique-travel': '573157587181',   // Cacique Travel & Aventure (Diego Barahona)
    'turismo-eco-florian': '573106252439' // Turismo ECO Florián
};

function waLink(message, number = WHATSAPP_NUMBER) {
    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

document.addEventListener('DOMContentLoaded', () => {
    setupMobileNav();
    setupGalleryThumbs();
    setupVideoModal();
    setupBookingForm();
    setupWhatsappLinks();
});

// --- MENÚ MÓVIL ---
function setupMobileNav() {
    const toggle = document.querySelector('.nav-toggle');
    const menu = document.querySelector('.nav-menu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
        const isOpen = menu.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', String(isOpen));
    });

    menu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            menu.classList.remove('is-open');
            toggle.setAttribute('aria-expanded', 'false');
        });
    });
}

// --- GALERÍAS DE ATRACTIVOS (miniaturas) ---
function setupGalleryThumbs() {
    document.querySelectorAll('.attraction-thumbs').forEach((thumbGroup) => {
        const targetId = thumbGroup.dataset.target;
        const mainImg = document.getElementById(targetId);
        if (!mainImg) return;

        thumbGroup.querySelectorAll('button[data-src]').forEach((thumbBtn) => {
            thumbBtn.addEventListener('click', () => {
                mainImg.src = thumbBtn.dataset.src;
                thumbGroup.querySelectorAll('button').forEach((b) => b.classList.remove('active'));
                thumbBtn.classList.add('active');
            });
        });
    });
}

// --- MODAL DE VIDEO ---
function setupVideoModal() {
    const modal = document.getElementById('videoModal');
    const iframe = document.getElementById('videoIframe');
    const openBtn = document.getElementById('openVideoBtn');
    const closeBtn = document.getElementById('closeVideoBtn');
    if (!modal || !iframe || !openBtn || !closeBtn) return;

    // PENDIENTE: reemplazar por el link real del video oficial de Florián.
    const VIDEO_EMBED_URL = openBtn.dataset.videoUrl || '';

    function openModal() {
        if (!VIDEO_EMBED_URL) {
            alert('El video oficial de Florián aún no está configurado. Pronto estará disponible.');
            return;
        }
        iframe.src = `${VIDEO_EMBED_URL}?autoplay=1`;
        modal.classList.add('is-open');
    }

    function closeModal() {
        iframe.src = '';
        modal.classList.remove('is-open');
    }

    openBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (event) => {
        if (event.target === modal) closeModal();
    });
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
    });
}

// --- FORMULARIO DE RESERVA -> WHATSAPP ---
function setupBookingForm() {
    const form = document.getElementById('bookingForm');
    if (!form) return;

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const feedback = form.querySelector('.form-feedback');
        const llegada = document.getElementById('fechaLlegada').value;
        const salida = document.getElementById('fechaSalida').value;
        const huespedes = document.getElementById('numHuespedes').value;

        if (!llegada || !salida) {
            if (feedback) feedback.textContent = 'Por favor selecciona fecha de llegada y salida.';
            return;
        }
        if (new Date(salida) <= new Date(llegada)) {
            if (feedback) feedback.textContent = 'La fecha de salida debe ser posterior a la de llegada.';
            return;
        }
        if (feedback) feedback.textContent = '';

        const mensaje = `Hola, deseo consultar disponibilidad en el Hotel Guaymaral:\n- Fecha de llegada: ${llegada}\n- Fecha de salida: ${salida}\n- Número de huéspedes: ${huespedes}`;
        window.open(waLink(mensaje), '_blank', 'noopener');
    });
}

// --- ENLACES DE WHATSAPP GENERADOS DINÁMICAMENTE ---
// Cualquier elemento con data-wa-message construye su propio link de WhatsApp.
// data-wa-ally="cacique-travel" (o "turismo-eco-florian") apunta el mensaje al
// número del aliado en vez del hotel. Sin data-wa-ally, usa el número del hotel.
function setupWhatsappLinks() {
    document.querySelectorAll('[data-wa-message]').forEach((el) => {
        const allyKey = el.dataset.waAlly;
        const number = allyKey && ALLY_WHATSAPP[allyKey] ? ALLY_WHATSAPP[allyKey] : WHATSAPP_NUMBER;
        el.href = waLink(el.dataset.waMessage, number);
    });
    document.querySelectorAll('[data-wa-plain]').forEach((el) => {
        const allyKey = el.dataset.waAlly;
        const number = allyKey && ALLY_WHATSAPP[allyKey] ? ALLY_WHATSAPP[allyKey] : WHATSAPP_NUMBER;
        el.href = `https://wa.me/${number}`;
    });
}