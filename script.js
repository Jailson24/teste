/* ============================================================
   SCRIPT.JS — GitHub Pages SAFE (VÍDEO COM SOM)
============================================================ */

function initTheme() {
    const toggle = document.getElementById("themeToggle");
    if (!toggle) return;
    const theme = localStorage.getItem("theme") || "dark";
    document.documentElement.setAttribute("data-theme", theme);
    toggle.textContent = theme === "light" ? "☀️" : "🌙";
    toggle.onclick = () => {
        const newTheme = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
        toggle.textContent = newTheme === "light" ? "☀️" : "🌙";
    };
}

function initScrollReveal() {
    const els = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add("visible");
                obs.unobserve(e.target);
            }
        });
    }, { threshold: 0.1 });
    els.forEach(el => obs.observe(el));
}

function initCarousel() {
    const track = document.querySelector(".carousel-track");
    const container = document.querySelector(".carousel");
    if (!track || !container) return;
    const slides = [...track.children];
    let index = 0;
    function update() {
        container.scrollTo({ left: slides[index].offsetLeft, behavior: "smooth" });
    }
    setInterval(() => {
        index = (index + 1) % slides.length;
        update();
    }, 4500);
    window.addEventListener("resize", update);
}

function initImageModal() {
    const modal = document.getElementById("imageModal");
    const imgModal = document.getElementById("imageModalImg");
    const close = document.querySelector(".image-modal-close");
    const images = document.querySelectorAll(".carousel-track img");
    if (!modal || !imgModal || !close) return;
    images.forEach(img => {
        img.onclick = () => {
            imgModal.src = img.src;
            modal.classList.add("open");
            document.body.style.overflow = "hidden";
        };
    });
    const closeModal = () => {
        modal.classList.remove("open");
        imgModal.src = "";
        document.body.style.overflow = "";
    };
    close.onclick = closeModal;
    modal.onclick = e => e.target === modal && closeModal();
    document.addEventListener("keydown", e => e.key === "Escape" && closeModal());
}

let videoMuted = true;

/**
 * Carrega o iframe do YouTube substituindo o conteúdo do container.
 * @param {boolean} unmute - Se deve ser carregado com som.
 */
function loadVideo(unmute = false) {
    const yt = document.getElementById("ytLazy");
    if (!yt) return;

    // 1. Define o estado de mudo e o ícone
    videoMuted = !unmute;
    const muteParam = videoMuted ? 1 : 0;
    const soundIcon = videoMuted ? '🔇' : '🔊';

    // 2. Remove o conteúdo anterior (incluindo thumbnail e play button)
    yt.innerHTML = ''; 

    // 3. Cria o iframe e o botão de som
    const iframeHTML = `
        <iframe
            src="https://www.youtube.com/embed/BWoW-6frVU4?autoplay=1&mute=${muteParam}&controls=0&modestbranding=1&rel=0&loop=1&playlist=BWoW-6frVU4&enablejsapi=1"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowfullscreen
            loading="lazy">
        </iframe>
        <button id="videoSoundToggle" onclick="toggleVideoSound()" aria-label="Alternar som do vídeo">${soundIcon}</button>
    `;

    // 4. Insere o novo conteúdo (iframe e botão de som)
    yt.insertAdjacentHTML('beforeend', iframeHTML);
    
    // 5. Exibe o botão de som (definido no CSS como display: none inicial)
    const soundButton = document.getElementById("videoSoundToggle");
    if (soundButton) soundButton.style.display = 'flex';
}

function toggleVideoSound() {
    // Recarrega o vídeo com o estado de som oposto
    loadVideo(!videoMuted);
}

function initVideoControl() {
    const container = document.getElementById("ytLazy");
    if (!container) return;

    // Seleciona os elementos iniciais (antes do iframe ser carregado)
    const playButton = container.querySelector(".yt-play");
    const thumbnail = container.querySelector(".yt-thumb");

    // Lógica para carregar o vídeo APENAS ao clicar no botão de Play/Thumbnail
    if (playButton) {
        playButton.onclick = () => {
            loadVideo(false); // Inicia o vídeo MUDO por padrão
        };
    }
}


document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initScrollReveal();
    initCarousel();
    initImageModal();
    initVideoControl();

    // Funções modais e de formulário
    const openRegisterModal = document.getElementById('openRegisterModal');
    const registerModal = document.getElementById('registerModal');
    const closeModalBtn = registerModal ? registerModal.querySelector('.modal-close-btn') : null;

    if (openRegisterModal && registerModal) {
        openRegisterModal.onclick = () => registerModal.classList.add('is-open');
        
        if (closeModalBtn) {
            closeModalBtn.onclick = () => registerModal.classList.remove('is-open');
        }

        registerModal.onclick = e => {
            if (e.target === registerModal) {
                registerModal.classList.remove('is-open');
            }
        };
    }
});

// A função toggleVideoSound deve ser globalmente acessível
window.toggleVideoSound = toggleVideoSound;