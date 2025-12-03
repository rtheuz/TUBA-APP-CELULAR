# Sistema de Notificações Push - TUBA App

## 📱 Funcionalidades Implementadas

### ✅ Aparência Nativa
- **Manifest.json melhorado**: Configurações completas para PWA com ícones em múltiplos tamanhos
- **Meta tags otimizadas**: Suporte completo para iOS e Android
- **Display standalone**: O app abre sem barra de endereço, como app nativo
- **Splash screen**: Tela de inicialização personalizada

### ✅ Notificações Push
- **Notificações locais**: Funcionam mesmo com o app fechado ou tela bloqueada
- **Service Worker**: Registrado automaticamente para processar notificações em background
- **Permissões**: Solicitação automática de permissão de notificação
- **Background sync**: Preparado para sincronização em background

## 🚀 Como Usar

### 1. Ativar Notificações
1. Abra o app
2. Vá em **Configurações** (ícone de engrenagem)
3. Ative o toggle **"Notificações"**
4. Permita as notificações quando solicitado

### 2. Testar Notificações
1. Vá em **Configurações**
2. Clique em **"Testar Notificação"**
3. Uma notificação será enviada imediatamente
4. Feche o app completamente e teste novamente - a notificação ainda funcionará!

### 3. Enviar Notificações Programaticamente

No código JavaScript, você pode enviar notificações usando:

```javascript
// Exemplo básico
sendNotification('Título', 'Mensagem da notificação');

// Exemplo com dados personalizados
sendNotification('Novo Pedido', 'Pedido #123 foi atualizado', {
  url: './index.html?page=pedidos&id=123'
});
```

## 🔧 Configuração Avançada

### Notificações Push do Servidor (Opcional)

Para receber notificações push de um servidor (não apenas locais), você precisará:

1. **VAPID Keys**: Gerar chaves VAPID no seu servidor
2. **Backend**: Servidor que envia notificações push usando Web Push Protocol
3. **Subscription**: O código já está preparado para isso (veja a função `subscribeToPush()`)

### Exemplo de Integração com Backend

```javascript
// No seu backend (Node.js exemplo)
const webpush = require('web-push');

// Configurar VAPID
webpush.setVapidDetails(
  'mailto:seu@email.com',
  'VAPID_PUBLIC_KEY',
  'VAPID_PRIVATE_KEY'
);

// Enviar notificação
webpush.sendNotification(subscription, JSON.stringify({
  title: 'TUBA',
  body: 'Você tem uma nova notificação',
  icon: 'https://i.imgur.com/Msjz5L5.png',
  data: { url: './index.html' }
}));
```

## 📋 Eventos de Notificação

O Service Worker processa os seguintes eventos:

- **push**: Quando uma notificação push é recebida
- **notificationclick**: Quando o usuário clica na notificação
- **notificationclose**: Quando o usuário fecha a notificação
- **sync**: Para sincronização em background
- **periodicsync**: Para sincronização periódica (requer permissão especial)

## 🎨 Personalização

### Modificar Notificações

Edite o arquivo `service-worker.js` na função do evento `push`:

```javascript
self.addEventListener("push", event => {
  // Personalize aqui o formato das notificações
  const notificationData = {
    title: "Seu Título",
    body: "Sua mensagem",
    icon: "URL_DO_ICONE",
    // ... outras opções
  };
});
```

## ⚠️ Limitações

1. **HTTPS obrigatório**: Notificações push só funcionam em HTTPS (ou localhost)
2. **Permissão do usuário**: O usuário deve permitir notificações
3. **Navegador suportado**: Chrome, Firefox, Edge, Safari (iOS 16.4+)
4. **iOS**: Notificações push de servidor requerem iOS 16.4+ e Safari

## 🔍 Troubleshooting

### Notificações não aparecem?
1. Verifique se as notificações estão ativadas nas configurações
2. Verifique se a permissão foi concedida no navegador
3. Verifique o console do navegador para erros
4. Certifique-se de que está usando HTTPS (ou localhost)

### Service Worker não registra?
1. Limpe o cache do navegador
2. Verifique se o arquivo `service-worker.js` está acessível
3. Verifique o console para erros

### App não parece nativo?
1. Instale o app na tela inicial (menu do navegador > "Adicionar à tela inicial")
2. Abra o app pela tela inicial, não pelo navegador
3. Verifique se o `manifest.json` está sendo carregado corretamente

## 📱 Instalação como App Nativo

### Android (Chrome)
1. Abra o app no Chrome
2. Menu (3 pontos) > "Adicionar à tela inicial"
3. O app aparecerá como um app nativo

### iOS (Safari)
1. Abra o app no Safari
2. Compartilhar > "Adicionar à Tela de Início"
3. O app aparecerá como um app nativo

## 🎯 Próximos Passos

Para notificações push completas do servidor:
1. Configure um servidor backend
2. Gere chaves VAPID
3. Descomente e configure o código em `subscribeToPush()`
4. Implemente o endpoint no servidor para receber subscriptions

