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

function loadVideo() {
    const yt = document.getElementById("ytLazy");
    if (!yt) return;

    // Remove a thumbnail e o botão de play
    const thumbnail = yt.querySelector(".yt-thumb");
    const playButton = yt.querySelector(".yt-play");
    if (thumbnail) thumbnail.style.opacity = '0';
    if (playButton) playButton.style.display = 'none';

    // Cria e insere o iframe
    yt.innerHTML = `
        <iframe
            src="https://www.youtube.com/embed/BWoW-6frVU4?autoplay=1&mute=${videoMuted ? 1 : 0}&controls=0&modestbranding=1&rel=0&loop=1&playlist=BWoW-6frVU4&enablejsapi=1"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowfullscreen
            loading="lazy">
        </iframe>
        <button id="videoSoundToggle" onclick="toggleVideoSound()" aria-label="Ativar som do vídeo">${videoMuted ? '🔇' : '🔊'}</button>
    `;
    
    // Exibe o botão de som
    const soundButton = document.getElementById("videoSoundToggle");
    if (soundButton) soundButton.style.display = 'flex';
}

function toggleVideoSound() {
    videoMuted = !videoMuted;
    
    const btn = document.getElementById("videoSoundToggle");
    if (btn) btn.textContent = videoMuted ? "🔇" : "🔊";
    
    // Recarrega o vídeo com o novo estado de mudo
    loadVideo();
}

function initVideoControl() {
    const yt = document.getElementById("ytLazy");
    const playButton = yt.querySelector(".yt-play");
    const thumbnail = yt.querySelector(".yt-thumb");

    // Lógica para carregar o vídeo ao clicar no botão de play
    playButton.onclick = () => {
        loadVideo();
    };
    
    // Inicia com o vídeo mudo e a thumbnail/botão de play visíveis
    // A função loadVideo é chamada no DOMContentLoaded para iniciar o vídeo em autoplay/loop (mudo), 
    // mas sem a thumbnail. Aqui reintroduzimos o clique no play.
    
    // Chamada inicial para garantir que o vídeo esteja no modo correto (com thumbnail) se não houver autoplay
    // Como o vídeo está em autoplay, removemos a lógica de clique no playButton do JS e deixamos o CSS ocultar
    // a imagem/botão.

    // A lógica de clique no play foi integrada ao loadVideo, mas a chamada loadVideo() no DOMContentLoaded
    // já inicia o vídeo. Para respeitar o clique, precisamos mudar a função de loadVideo para ser chamada
    // APENAS ao clicar no botão de play.
    
    // *Nova Lógica* - O vídeo só carrega/inicia quando o usuário clica no botão de Play.
    const container = document.getElementById("ytLazy");
    if (container) {
        container.querySelector(".yt-play").onclick = () => {
            loadVideo();
        };
    }
}


document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initScrollReveal();
    initCarousel();
    initImageModal();
    // O vídeo não será mais carregado automaticamente, esperando pelo clique no botão de play/thumbnail
    // Removendo loadVideo(); daqui
    
    // Inicialização do controle de vídeo
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