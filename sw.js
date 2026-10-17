/* ============================================
   我们的回忆录 - Service Worker
   接收推送通知 / 点击跳转
   ============================================ */

var SITE_URL = 'https://breeze-love-mq.pages.dev';
var ICON_URL = SITE_URL + '/assets/images/flowers-sm/IMG_20241117_180432.jpg';

self.addEventListener('push', function (event) {
  var data = {
    title: '我们的回忆录更新啦',
    body: '快来发现新的惊喜吧',
    url: SITE_URL + '/'
  };
  try {
    if (event.data) {
      var parsed = event.data.json();
      if (parsed && parsed.title) {
        data.title = parsed.title;
        data.body = parsed.body || '';
        data.url = parsed.url || data.url;
      }
    }
  } catch (e) {}

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: ICON_URL,
      badge: ICON_URL,
      tag: 'love-update',
      data: { url: data.url },
      vibrate: [200, 100, 200],
      renotify: true,
      requireInteraction: false
    })
  );
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  var target = (event.notification.data && event.notification.data.url) || SITE_URL + '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (list) {
      for (var i = 0; i < list.length; i++) {
        var c = list[i];
        if ('focus' in c && 'navigate' in c) {
          c.navigate(target);
          return c.focus();
        }
      }
      return clients.openWindow(target);
    })
  );
});
