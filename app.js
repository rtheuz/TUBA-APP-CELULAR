// Aguarda o carregamento completo do HTML antes de executar o script
document.addEventListener('DOMContentLoaded', () => {

    // =========================================================================
    // CONSTANTES E VARIÁVEIS GLOBAIS
    // =========================================================================

    const WEBAPP_URL = "https://script.google.com/macros/s/AKfycbyqo2sqE_x5VhtQPInTBS4XO78vk-S0Ec2LbgDtbUYVyX98oOA_oh4VRMdrmk8DBWvx6g/exec";

    // Seleciona os principais elementos da tela
    const splashScreen = document.getElementById('splash');
    const loginScreen = document.getElementById('loginScreen');
    const loginIframe = document.getElementById('loginIframe');
    const mainApp = document.querySelector('.app');

    const iframeContainer = document.getElementById('iframeContainer');
    const iframeContent = document.getElementById('iframeContent');
    const iframeHeaderTitle = document.querySelector('#iframeHeader span');
    const closeIframeBtn = document.getElementById('closeIframeBtn');

    // =========================================================================
    // CORREÇÃO FINAL: OUVINTE DE MENSAGEM AJUSTADO
    // =========================================================================

    window.addEventListener("message", (event) => {
        const data = event.data;

        // Verifica se a mensagem recebida é a de login com o token
        if (data && data.type === 'login_token' && data.token) {

            console.log("SUCESSO: Token de login recebido pela página principal!", data.token);

            try {
                // 1. Salva o token no armazenamento local
                localStorage.setItem('token', data.token);

                // 2. MOSTRA um overlay de "carregando" para o usuário
                document.querySelector('.loading-overlay').classList.add('show');

                // 3. RECARREGA a página após um breve momento.
                // Ao recarregar, a lógica `init()` encontrará o token e iniciará o app corretamente.
                setTimeout(() => {
                    window.location.reload();
                }, 500); // Meio segundo de delay

            } catch (e) {
                console.error("Erro ao processar o token e redirecionar:", e);
                alert("Login bem-sucedido, mas houve um erro ao iniciar sua sessão.");
            }
        }
    });

    // =========================================================================
    // LÓGICA DE INICIALIZAÇÃO DO APLICATIVO
    // =========================================================================

    function init() {
        // Tenta pegar o token do armazenamento local
        const token = localStorage.getItem('token');

        if (token) {
            console.log("Token encontrado no localStorage. Verificando validade...");
            // Se temos um token, precisamos verificar se ele ainda é válido.
            // (Esta parte pode ser implementada depois, por enquanto vamos confiar no token)
            initializeApp(token);
        } else {
            console.log("Nenhum token encontrado. Mostrando tela de login.");
            // Se não há token, mostra a tela de login
            showLogin();
        }
    }

    // Função para exibir a tela de login
    function showLogin() {
        splashScreen.style.opacity = '0'; // Esconde a splash screen
        setTimeout(() => { splashScreen.style.display = 'none'; }, 400);

        // Carrega a página de login do Google Apps Script no iframe
        loginIframe.src = WEBAPP_URL;
        loginScreen.classList.add('show');
    }

    // Função para iniciar o aplicativo principal após o login
    function initializeApp(token) {
        console.log("Iniciando o aplicativo principal...");

        splashScreen.style.opacity = '0'; // Esconde a splash screen
        loginScreen.classList.remove('show'); // Garante que a tela de login esteja escondida

        setTimeout(() => {
            splashScreen.style.display = 'none';
            mainApp.style.display = 'block'; // Mostra o conteúdo principal do app
        }, 400);

        // Adiciona o token a todos os links que serão abertos
        // (Isso é uma melhoria importante para o futuro)
        // Por exemplo, você pode atualizar os `onclick` dos botões aqui.
    }

    // =========================================================================
    // FUNCIONALIDADES DOS BOTÕES E IFRAMES (do seu HTML)
    // =========================================================================

    // Função global para ser chamada pelo `onclick` dos botões
    window.abrir = function (url, titulo) {
        const token = localStorage.getItem('token');
        if (!token) {
            showLogin();
            return;
        }

        console.log(`Abrindo a página: ${titulo}`);

        // Adiciona o token à URL que será aberta no iframe
        const urlComToken = url + (url.includes('?') ? '&' : '?') + 'token=' + encodeURIComponent(token);

        iframeHeaderTitle.textContent = titulo;
        iframeContent.src = urlComToken;
        iframeContainer.style.display = 'flex';
    }

    // Event listener para o botão de fechar o iframe de conteúdo
    closeIframeBtn.addEventListener('click', () => {
        iframeContainer.classList.add('closing');
        setTimeout(() => {
            iframeContainer.style.display = 'none';
            iframeContainer.classList.remove('closing');
            iframeContent.src = 'about:blank'; // Limpa o iframe para liberar memória
        }, 300);
    });

    // =========================================================================
    // INICIA O PROCESSO
    // =========================================================================
    setTimeout(init, 1500); // Dá um tempo para a splash screen ser exibida antes de decidir o que fazer

});