self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  event.waitUntil(
    self.registration.showNotification(data.title || 'МастерОФФ', {
      body: data.body || '',
      icon: data.icon || '/icon-192.png',
      badge: data.icon || '/icon-192.png',
      vibrate: [200, 100, 200],
    })
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
    const { title, body, icon } = event.data;
    self.registration.showNotification(title, {
      body,
      icon: icon || '/icon-192.png',
      badge: icon || '/icon-192.png',
      vibrate: [200, 100, 200],
    });
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow('/'));
});
