// Configurações globais
const CONFIG = {
    beatsApi: 'https://api.example.com/beats',
    artistsApi: 'https://api.example.com/artists',
    animationOffset: 100,
    scrollDuration: 800,
    mobileBreakpoint: 768
};

class CheekLanding {
    constructor() {
        this.mobileMenuOpen = false;
        this.init();
    }

    async init() {
        this.setupMobileMenu();
        this.setupSmoothScroll();
        this.setupIntersectionObserver();
        await this.loadDynamicContent();
        this.setupEventListeners();
        
        // Atualiza o estado do menu ao carregar
        this.handleResize();
        window.addEventListener('resize', () => this.handleResize());
    }

    // Menu mobile responsivo
    setupMobileMenu() {
        // Cria o botão do menu mobile se não existir
        if (!document.querySelector('.mobile-menu-toggle')) {
            const menuToggle = document.createElement('div');
            menuToggle.className = 'mobile-menu-toggle';
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            document.querySelector('nav').appendChild(menuToggle);
        }

        // Fecha o menu ao clicar em um link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= CONFIG.mobileBreakpoint) {
                    this.toggleMobileMenu(false);
                }
            });
        });
    }

    // Alternar menu mobile
    toggleMobileMenu(force) {
        const navLinks = document.querySelector('.nav-links');
        const menuToggle = document.querySelector('.mobile-menu-toggle');
        
        this.mobileMenuOpen = force !== undefined ? force : !this.mobileMenuOpen;
        
        if (this.mobileMenuOpen) {
            navLinks.classList.add('active');
            menuToggle.innerHTML = '<i class="fas fa-times"></i>';
            document.body.style.overflow = 'hidden';
        } else {
            navLinks.classList.remove('active');
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            document.body.style.overflow = '';
        }
    }

    // Atualiza o menu conforme o tamanho da tela
    handleResize() {
        const navLinks = document.querySelector('.nav-links');
        if (window.innerWidth > CONFIG.mobileBreakpoint) {
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // Configura listeners de eventos
    setupEventListeners() {
        // Menu mobile toggle
        document.querySelector('.mobile-menu-toggle').addEventListener('click', () => {
            this.toggleMobileMenu();
        });

        // Formulário de contato
        const contactForm = document.querySelector('.contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => this.handleContactSubmit(e));
        }

        // Links externos com tracking
        document.querySelectorAll('a[href*="youtube.com"], a[href*="spotify.com"]').forEach(link => {
            link.addEventListener('click', (e) => this.trackExternalLink(e));
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
                    const headerHeight = document.querySelector('header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Intersection Observer para animações
    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        });

        document.querySelectorAll('.section-title, .artist-card, .track-item').forEach(el => {
            observer.observe(el);
        });
    }

    // Carrega conteúdo dinâmico
    async loadDynamicContent() {
        try {
            // Simulação de carregamento de dados
            const [artists, beats] = await Promise.all([
                this.fetchMockData('artists'),
                this.fetchMockData('beats')
            ]);
            
            this.updateArtistsGrid(artists);
            this.updateBeatsList(beats);
        } catch (error) {
            console.error('Error loading content:', error);
        }
    }

    // Simula fetch de dados
    async fetchMockData(type) {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (type === 'artists') {
            return [
                { name: 'Matuê', image: 'matue.jpg' },
                { name: 'Teto', image: 'teto.jpg' },
                { name: 'WIU', image: 'wiu.jpg' },
                { name: 'Yunk Vino', image: 'yunk-vino.jpg' }
            ];
        } else {
            return [
                { id: 1, title: 'Melhor Dia 11', duration: '3:14' },
                { id: 2, title: 'Brinca Demais', duration: '2:46' },
                { id: 3, title: 'Fim de Semana no Rio', duration: '2:38' }
            ];
        }
    }

    // Atualiza a seção de artistas
    updateArtistsGrid(artists) {
        const grid = document.querySelector('.artists-grid');
        if (grid) {
            grid.innerHTML = artists.map(artist => `
                <div class="artist-card">
                    <div class="artist-image" style="background-image: url('images/${artist.image}')"></div>
                    <div class="artist-name">${artist.name}</div>
                </div>
            `).join('');
        }
    }

    // Atualiza a seção de beats
    updateBeatsList(beats) {
        const container = document.querySelector('.tracks-container');
        if (container) {
            beats.forEach(beat => {
                const trackItem = document.createElement('div');
                trackItem.className = 'track-item';
                trackItem.innerHTML = `
                    <div class="track-cover">
                        <img src="images/beat-cover.jpg" alt="${beat.title}">
                    </div>
                    <div class="track-info">
                        <div class="track-name">${beat.title}</div>
                        <div class="track-artist">Vários Artistas</div>
                    </div>
                    <div class="track-duration">${beat.duration}</div>
                `;
                container.appendChild(trackItem);
            });
        }
    }

    // Manipulador de formulário
    async handleContactSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        
        // Validação
        if (!formData.get('name') || !formData.get('email') || !formData.get('message')) {
            this.showToast('Por favor, preencha todos os campos');
            return;
        }

        // Simula envio
        form.querySelector('button').disabled = true;
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        this.showToast('Mensagem enviada com sucesso!');
        form.reset();
        form.querySelector('button').disabled = false;
    }

    // Mostra notificação
    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
            setTimeout(() => {
                toast.remove();
            }, 3000);
        }, 100);
    }

    // Rastreia links externos
    trackExternalLink(e) {
        e.preventDefault();
        const url = e.currentTarget.href;
        
        // Simula tracking
        console.log('Link externo clicado:', url);
        
        // Redireciona após breve delay
        setTimeout(() => {
            window.open(url, '_blank');
        }, 200);
    }
}

// Inicia quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    new CheekLanding();
    
    // Remove classe de loading
    setTimeout(() => {
        document.body.classList.remove('loading');
    }, 500);
});

// Adiciona estilos dinâmicos para o toast
const style = document.createElement('style');
style.textContent = `
.toast-notification {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0,0,0,0.8);
    color: white;
    padding: 12px 24px;
    border-radius: 4px;
    z-index: 1000;
    opacity: 0;
    transition: opacity 0.3s;
}
.toast-notification.show {
    opacity: 1;
}
`;
document.head.appendChild(style);
