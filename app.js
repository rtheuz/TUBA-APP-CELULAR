document.addEventListener('DOMContentLoaded', () => {
    const splash = document.getElementById('splash');
    const app = document.querySelector('.app');
    const loginScreen = document.getElementById('loginScreen');
    const loginIframe = document.getElementById('loginIframe');
    const iframeContainer = document.getElementById('iframeContainer');
    const iframeContent = document.getElementById('iframeContent');
    const iframeHeaderTitle = document.querySelector('#iframeHeader span');
    const closeIframeBtn = document.getElementById('closeIframeBtn');

    const LOGIN_URL = 'https://script.google.com/macros/s/AKfycbyqo2sqE_x5VhtQPInTBS4XO78vk-S0Ec2LbgDtbUYVyX98oOA_oh4VRMdrmk8DBWvx6g/exec';
    let userToken = null;

    // Função para verificar o token e iniciar o app
    function initializeApp() {
        userToken = localStorage.getItem('tuba_user_token');

        setTimeout(() => {
            splash.style.opacity = '0';
            splash.addEventListener('transitionend', () => {
                splash.style.display = 'none';

                if (userToken) {
                    showMainApp();
                } else {
                    showLogin();
                }
            });
        }, 2000); // Tempo do splash screen
    }

    // Mostra a tela de login
    function showLogin() {
        loginIframe.src = LOGIN_URL;
        loginScreen.classList.add('show');
    }

    // Mostra a aplicação principal
    function showMainApp() {
        loginScreen.classList.remove('show');
        app.style.display = 'block';
    }

    // Recebe a mensagem do iframe de login com o token
    window.addEventListener('message', (event) => {
        // Por segurança, verifique a origem do evento
        // if (event.origin !== "https://script-google-com") return;

        if (event.data && event.data.type === 'login_token' && event.data.token) {
            userToken = event.data.token;
            localStorage.setItem('tuba_user_token', userToken);
            showToast('Login realizado com sucesso!');
            setTimeout(showMainApp, 500);
        }
    });

    // Função global para abrir os links
    window.abrir = (baseUrl, title) => {
        if (!userToken) {
            showToast('Erro: Faça o login para continuar.');
            showLogin();
            return;
        }

        // Adiciona o token à URL
        const url = `${baseUrl}${baseUrl.includes('?') ? '&' : '?'}token=${userToken}`;
        
        iframeHeaderTitle.textContent = title;
        iframeContent.src = url;
        iframeContainer.style.display = 'flex';
    };
    
    // Fecha a tela do iframe
    closeIframeBtn.addEventListener('click', () => {
        iframeContainer.classList.add('closing');
        iframeContainer.addEventListener('animationend', () => {
            iframeContainer.classList.remove('closing');
            iframeContainer.style.display = 'none';
            iframeContent.src = 'about:blank'; // Limpa o iframe
        }, { once: true });
    });

    // Função para mostrar notificações (toast)
    function showToast(message) {
        const toast = document.querySelector('.toast');
        if (toast) {
            toast.textContent = message;
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }
    }

    initializeApp();
});