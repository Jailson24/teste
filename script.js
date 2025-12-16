/* ============================================================
   SCRIPT.JS — GitHub Pages SAFE (VÍDEO COM SOM E PAUSE/PLAY)
============================================================ */

let player; // Variável global para o objeto do player do YouTube
const VIDEO_ID = 'BWoW-6frVU4';

// A função onYouTubeIframeAPIReady é chamada automaticamente pela API do YouTube
// assim que ela estiver carregada. Ela é o ponto de entrada para a inicialização do player.
window.onYouTubeIframeAPIReady = function() {
    initPlayer();
};

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

// ===========================================
// CONTROLE DO PLAYER DE VÍDEO (VIA API)
// ===========================================

function updateSoundIcon(isMuted) {
    const btn = document.getElementById("videoSoundToggle");
    if (btn) {
        // Ícone reflete o estado ATUAL do vídeo
        btn.textContent = isMuted ? '🔇' : '🔊';
        btn.setAttribute('aria-label', isMuted ? 'Ligar som' : 'Desligar som');
    }
}

function updatePlayPauseIcon(isPlaying) {
    const btn = document.getElementById("videoPlayPause");
    if (btn) {
        // Ícone reflete o estado ATUAL do vídeo
        btn.textContent = isPlaying ? '❚❚' : '▶';
        btn.setAttribute('aria-label', isPlaying ? 'Pausar vídeo' : 'Reproduzir vídeo');
    }
}

function onPlayerReady(event) {
    // 1. Garante que o vídeo inicie mudo (autoplay)
    event.target.mute();
    event.target.playVideo();

    // 2. Atualiza o ícone de som para o estado inicial (Mudo)
    updateSoundIcon(true);
    // 3. Atualiza o ícone de Play/Pause para o estado inicial (Play/Reproduzindo)
    updatePlayPauseIcon(true);
}

function onPlayerStateChange(event) {
    // YT.PlayerState.ENDED = 0
    if (event.data === YT.PlayerState.ENDED) {
        // Reinicia o loop
        player.seekTo(0);
        player.playVideo();
    }
    
    // 4. Atualiza o ícone de Play/Pause quando o estado mudar
    const isPlaying = event.data === YT.PlayerState.PLAYING;
    // Se o player estiver em um estado relevante (Playing=1 ou Paused=2), atualiza o ícone
    if (event.data === YT.PlayerState.PLAYING || event.data === YT.PlayerState.PAUSED) {
        updatePlayPauseIcon(isPlaying);
    }
}

function initPlayer() {
    const playerContainer = document.getElementById('youtube-player-container');
    if (!playerContainer) return;
    
    // Verifica se a API está carregada (necessário se o DOMContentLoaded for mais rápido que a API)
    if (typeof YT === 'undefined' || typeof YT.Player === 'undefined') {
        setTimeout(initPlayer, 100);
        return;
    }

    player = new YT.Player('youtube-player-container', {
        height: '100%',
        width: '100%',
        videoId: VIDEO_ID,
        playerVars: {
            'autoplay': 1,
            'controls': 0, // Sem controles nativos do YouTube
            'modestbranding': 1,
            'rel': 0,
            'loop': 1,
            'playlist': VIDEO_ID, // Necessário para o loop funcionar com controls=0
            'enablejsapi': 1,
            'iv_load_policy': 3, // Oculta anotações (texto flutuante)
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function toggleVideoSound() {
    if (!player || typeof player.isMuted !== 'function') return;

    if (player.isMuted()) {
        player.unMute();
        updateSoundIcon(false); // Agora está com som
    } else {
        player.mute();
        updateSoundIcon(true); // Agora está mudo
    }
}

function togglePlayPause() {
    if (!player || typeof player.getPlayerState !== 'function') return;

    const playerState = player.getPlayerState();
    
    // Se estiver pausado (2), parado (0), ou não reproduzindo
    if (playerState !== YT.PlayerState.PLAYING) {
        player.playVideo();
        // O ícone será atualizado via onPlayerStateChange
    } else {
        // Se estiver reproduzindo (1)
        player.pauseVideo();
        // O ícone será atualizado via onPlayerStateChange
    }
}

// Torna as funções de controle acessíveis globalmente
window.toggleVideoSound = toggleVideoSound;
window.togglePlayPause = togglePlayPause;


document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initScrollReveal();
    initCarousel();
    initImageModal();
    // initPlayer() será chamada automaticamente pela API do YouTube (onYouTubeIframeAPIReady)

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