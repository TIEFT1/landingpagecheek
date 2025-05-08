// Configurações globais
const CONFIG = {
    beatsApi: 'https://api.example.com/beats', // Endpoint fictício
    artistsApi: 'https://api.example.com/artists', // Endpoint fictício
    animationOffset: 100,
    scrollDuration: 800
};

// Classe principal da aplicação
class CheekLanding {
    constructor() {
        this.init();
    }

    async init() {
        // Inicializa todos os módulos
        this.setupEventListeners();
        this.setupSmoothScroll();
        this.setupIntersectionObserver();
        this.setupAudioPlayer();
        await this.loadDynamicContent();
        this.setupModal();
    }

    // Configura listeners de eventos
    setupEventListeners() {
        // Menu mobile (para responsividade)
        this.setupMobileMenu();

        // Formulário de contato
        const contactForm = document.querySelector('.contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => this.handleContactSubmit(e));
        }

        // Links do YouTube
        document.querySelectorAll('.youtube-link').forEach(link => {
            link.addEventListener('click', (e) => this.trackYouTubeClick(e));
        });
    }

    // Menu mobile responsivo
    setupMobileMenu() {
        const menuToggle = document.createElement('div');
        menuToggle.className = 'mobile-menu-toggle';
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        document.querySelector('nav').appendChild(menuToggle);

        menuToggle.addEventListener('click', () => {
            document.querySelector('.nav-links').classList.toggle('active');
            menuToggle.querySelector('i').classList.toggle('fa-times');
        });
    }

    // Scroll suave para âncoras
    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Intersection Observer para animações
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: `0px 0px -${CONFIG.animationOffset}px 0px`
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Elementos a serem observados
        document.querySelectorAll('.artist-card, .track-item, .section-title, .about-content p').forEach(el => {
            observer.observe(el);
        });
    }

    // Player de áudio para beats
    setupAudioPlayer() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        let currentAudioBuffer = null;
        let currentSource = null;
        let isPlaying = false;

        // Elementos do player
        const playButtons = document.querySelectorAll('.play-beat');
        const audioPlayer = document.createElement('div');
        audioPlayer.className = 'audio-player';
        audioPlayer.innerHTML = `
            <div class="player-controls">
                <button class="play-pause-btn"><i class="fas fa-play"></i></button>
                <div class="progress-container">
                    <div class="progress-bar"></div>
                </div>
                <div class="time-display">0:00 / 0:00</div>
                <button class="close-player"><i class="fas fa-times"></i></button>
            </div>
        `;
        document.body.appendChild(audioPlayer);

        // Event listeners para o player
        const playPauseBtn = audioPlayer.querySelector('.play-pause-btn');
        const progressBar = audioPlayer.querySelector('.progress-bar');
        const timeDisplay = audioPlayer.querySelector('.time-display');
        const closeBtn = audioPlayer.querySelector('.close-player');

        playPauseBtn.addEventListener('click', () => {
            if (isPlaying) {
                this.pauseAudio();
            } else {
                this.playAudio();
            }
        });

        closeBtn.addEventListener('click', () => {
            this.stopAudio();
            audioPlayer.classList.remove('active');
        });

        // Progresso da música
        let progressInterval;
        function updateProgress() {
            if (currentSource) {
                const progress = (currentSource.context.currentTime / currentAudioBuffer.duration) * 100;
                progressBar.style.width = `${progress}%`;
                
                const currentTime = formatTime(currentSource.context.currentTime);
                const duration = formatTime(currentAudioBuffer.duration);
                timeDisplay.textContent = `${currentTime} / ${duration}`;
            }
        }

        function formatTime(seconds) {
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
        }

        // Métodos para controle de áudio
        this.playAudio = () => {
            if (currentAudioBuffer) {
                currentSource = audioContext.createBufferSource();
                currentSource.buffer = currentAudioBuffer;
                currentSource.connect(audioContext.destination);
                currentSource.start(0);
                isPlaying = true;
                playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
                
                progressInterval = setInterval(updateProgress, 100);
                
                currentSource.onended = () => {
                    this.stopAudio();
                };
            }
        };

        this.pauseAudio = () => {
            if (currentSource) {
                currentSource.stop();
                isPlaying = false;
                playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
                clearInterval(progressInterval);
            }
        };

        this.stopAudio = () => {
            if (currentSource) {
                currentSource.stop();
                isPlaying = false;
                playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
                clearInterval(progressInterval);
                progressBar.style.width = '0%';
                timeDisplay.textContent = '0:00 / 0:00';
            }
        };

        // Event listeners para os beats
        playButtons.forEach(button => {
            button.addEventListener('click', async (e) => {
                e.preventDefault();
                const beatId = button.dataset.beatId;
                
                // Simula carregamento do áudio (em produção real, seria um fetch)
                audioPlayer.classList.add('loading');
                playPauseBtn.disabled = true;
                
                try {
                    // Em um caso real, você faria fetch do áudio
                    // const response = await fetch(`${CONFIG.beatsApi}/${beatId}`);
                    // currentAudioBuffer = await audioContext.decodeAudioData(await response.arrayBuffer());
                    
                    // Simulação
                    await new Promise(resolve => setTimeout(resolve, 800));
                    currentAudioBuffer = await this.generateDemoAudio(audioContext);
                    
                    audioPlayer.classList.remove('loading');
                    audioPlayer.classList.add('active');
                    playPauseBtn.disabled = false;
                    this.playAudio();
                } catch (error) {
                    console.error('Error loading audio:', error);
                    audioPlayer.classList.remove('loading');
                    // Mostrar mensagem de erro
                }
            });
        });
    }

    // Gera áudio demo (simulação)
    generateDemoAudio(audioContext) {
        return new Promise((resolve) => {
            const duration = 30; // 30 segundos
            const sampleRate = audioContext.sampleRate;
            const frameCount = sampleRate * duration;
            const audioBuffer = audioContext.createBuffer(2, frameCount, sampleRate);
            
            // Gera ruído branco simples para demonstração
            for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
                const nowBuffering = audioBuffer.getChannelData(channel);
                for (let i = 0; i < frameCount; i++) {
                    nowBuffering[i] = Math.random() * 2 - 1;
                }
            }
            
            resolve(audioBuffer);
        });
    }

    // Modal para contato
    setupModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <div class="modal-body"></div>
            </div>
        `;
        document.body.appendChild(modal);

        const closeModal = modal.querySelector('.close-modal');
        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });

        this.modal = modal;
    }

    // Carrega conteúdo dinâmico
    async loadDynamicContent() {
        try {
            // Simula fetch de artistas e beats
            // const [artistsResponse, beatsResponse] = await Promise.all([
            //     fetch(CONFIG.artistsApi),
            //     fetch(CONFIG.beatsApi)
            // ]);
            // const [artists, beats] = await Promise.all([
            //     artistsResponse.json(),
            //     beatsResponse.json()
            // ]);
            
            // Dados mockados para demonstração
            const artists = [
                { name: 'Matuê', image: 'matue.jpg' },
                { name: 'Yunk Vino', image: 'yunk.jpg' },
                { name: 'Teto', image: 'teto.jpg' },
                { name: 'WIU', image: 'wiu.jpg' }
            ];
            
            const beats = [
                { id: 1, title: 'Melhor Dia 11: Ilusão com Aut...', duration: '3:14' },
                { id: 2, title: 'Maluai de Como A...', duration: '3:14' },
                { id: 3, title: 'Tava Bom', duration: '2:46' }
            ];
            
            this.updateArtistsGrid(artists);
            this.updateBeatsList(beats);
        } catch (error) {
            console.error('Error loading dynamic content:', error);
        }
    }

    // Atualiza grid de artistas
    updateArtistsGrid(artists) {
        const grid = document.querySelector('.artists-grid');
        if (!grid) return;
        
        grid.innerHTML = artists.map(artist => `
            <div class="artist-card">
                <div class="artist-image" style="background-image: url('images/${artist.image}')"></div>
                <div class="artist-name">${artist.name}</div>
            </div>
        `).join('');
    }

    // Atualiza lista de beats
    updateBeatsList(beats) {
        const list = document.querySelector('.tracks-list');
        if (!list) return;
        
        list.innerHTML = beats.map(beat => `
            <div class="track-item">
                <div class="track-info">
                    <div class="track-name">${beat.title}</div>
                    <div class="track-duration">${beat.duration}</div>
                </div>
                <button class="play-beat" data-beat-id="${beat.id}">
                    <i class="fas fa-play"></i>
                </button>
            </div>
        `).join('');
        
        // Reconfigura event listeners para os novos botões
        document.querySelectorAll('.play-beat').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const beatId = button.dataset.beatId;
                // Implementar lógica de reprodução
            });
        });
    }

    // Manipulador de envio de formulário
    async handleContactSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]');
        
        // Validação simples
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');
        
        if (!name || !email || !message) {
            this.showModal('Erro', 'Por favor, preencha todos os campos.');
            return;
        }
        
        // Simula envio
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';
        
        try {
            // Em produção real, seria um fetch para o endpoint do backend
            // const response = await fetch('/api/contact', {
            //     method: 'POST',
            //     body: JSON.stringify(Object.fromEntries(formData)),
            //     headers: { 'Content-Type': 'application/json' }
            // });
            
            // Simula atraso de rede
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            this.showModal('Sucesso', 'Sua mensagem foi enviada com sucesso!');
            form.reset();
        } catch (error) {
            console.error('Error submitting form:', error);
            this.showModal('Erro', 'Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente mais tarde.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Enviar Mensagem';
        }
    }

    // Mostra modal com mensagem
    showModal(title, message) {
        const modalBody = this.modal.querySelector('.modal-body');
        modalBody.innerHTML = `
            <h3>${title}</h3>
            <p>${message}</p>
        `;
        this.modal.style.display = 'block';
    }

    // Rastreia cliques no YouTube (analytics)
    trackYouTubeClick(e) {
        e.preventDefault();
        const url = e.currentTarget.href;
        
        // Simula tracking (em produção seria um fetch para seu analytics)
        console.log('YouTube link clicked:', url);
        
        // Redireciona após tracking
        setTimeout(() => {
            window.open(url, '_blank');
        }, 200);
    }
}

// Inicia a aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    new CheekLanding();
});

// Adiciona classe de carregamento ao body
document.body.classList.add('loading');

// Remove classe de carregamento quando tudo estiver carregado
window.addEventListener('load', () => {
    document.body.classList.remove('loading');
});
