self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("push", (event) => {
  let data = { title: "त्रिवेणी पत्रिका", body: "एक नई खबर आई है", url: "/" };
  try {
    if (event.data) {
      data = event.data.json();
    }
  } catch (e) {
    // malformed payload, use default
  }

  const options = {
    body: data.body,
    icon: "/api/pwa-icon?size=192",
    badge: "/api/pwa-icon?size=96",
    data: { url: data.url || "/" },
    tag: data.tag || undefined,
    requireInteraction: !!data.requireInteraction,
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data && event.notification.data.url ? event.notification.data.url : "/";
  event.waitUntil(
    self.clients.matchAll({ type: "window" }).then((clientList) => {
      for (const c of clientList) {
        if (c.url === url && "focus" in c) return c.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(url);
    })
  );
});
