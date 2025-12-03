const CACHE_NAME = "tuba-cache-v6"; // atualize o número a cada grande mudança
const URLS_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.json"
];

// Instala e faz cache dos arquivos
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(URLS_TO_CACHE);
    })
  );
  self.skipWaiting(); // força ativar o novo SW imediatamente
});

// Ativa o novo SW e apaga caches antigos
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    })
  );
  self.clients.claim(); // faz as abas usarem o novo SW
});

// Busca no cache ou na rede
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

// ==================== NOTIFICAÇÕES PUSH ====================

// Recebe mensagens push do servidor
self.addEventListener("push", event => {
  console.log("Push recebido:", event);
  
  let notificationData = {
    title: "TUBA",
    body: "Você tem uma nova notificação",
    icon: "https://i.imgur.com/Msjz5L5.png",
    badge: "https://i.imgur.com/Msjz5L5.png",
    tag: "tuba-notification",
    requireInteraction: false,
    vibrate: [200, 100, 200],
    data: {
      url: "./index.html"
    }
  };

  // Se a mensagem push contém dados, usa eles
  if (event.data) {
    try {
      const data = event.data.json();
      notificationData = {
        ...notificationData,
        ...data,
        icon: data.icon || notificationData.icon,
        badge: data.badge || notificationData.badge
      };
    } catch (e) {
      // Se não for JSON, tenta como texto
      notificationData.body = event.data.text() || notificationData.body;
    }
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, {
      body: notificationData.body,
      icon: notificationData.icon,
      badge: notificationData.badge,
      tag: notificationData.tag,
      requireInteraction: notificationData.requireInteraction,
      vibrate: notificationData.vibrate,
      data: notificationData.data,
      actions: notificationData.actions || [],
      silent: false
    })
  );
});

// Quando o usuário clica na notificação
self.addEventListener("notificationclick", event => {
  console.log("Notificação clicada:", event);
  
  event.notification.close();

  const urlToOpen = event.notification.data?.url || "./index.html";

  event.waitUntil(
    clients.matchAll({
      type: "window",
      includeUncontrolled: true
    }).then(clientList => {
      // Verifica se já existe uma janela/tab aberta
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === urlToOpen && "focus" in client) {
          return client.focus();
        }
      }
      // Se não existe, abre uma nova janela
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// Quando a notificação é fechada
self.addEventListener("notificationclose", event => {
  console.log("Notificação fechada:", event);
});

// ==================== BACKGROUND SYNC ====================

// Sincronização em background (quando o app volta online)
self.addEventListener("sync", event => {
  console.log("Background sync:", event.tag);
  
  if (event.tag === "sync-data") {
    event.waitUntil(
      // Aqui você pode adicionar lógica para sincronizar dados
      // Por exemplo, enviar dados que ficaram pendentes
      Promise.resolve()
    );
  }
});

// ==================== PERIODIC BACKGROUND SYNC ====================

// Sincronização periódica (requer permissão especial)
self.addEventListener("periodicsync", event => {
  console.log("Periodic sync:", event.tag);
  
  if (event.tag === "update-check") {
    event.waitUntil(
      // Verificar atualizações periodicamente
      Promise.resolve()
    );
  }
});
