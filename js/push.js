/* ============================================
   更新推送订阅逻辑
   部署 Worker 后把 WORKER_URL 改成你的地址
   （npx wrangler deploy 输出的 https://love-push.xxx.workers.dev）
   ============================================ */

var PUSH_WORKER_URL = 'https://love-push.tujiwei-0504.workers.dev';
var PUSH_PUBLIC_KEY = 'BPCpRjkYMNrVtwbhn0q8nyoWfKgfy3UXAGuuAJu6t-qWZHPLkDcIJADE3B9RCMhDojd7ANf6P17m3gsarzfo974';
var PUSH_SUB_KEY = 'love_push_subscribed';

(function () {
  var btn = document.getElementById('pushSubscribeBtn');
  if (!btn) return;

  var supported = 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
  if (!supported) {
    btn.textContent = '🔕 当前浏览器不支持通知（请用华为浏览器打开）';
    btn.classList.add('push-btn--disabled');
    return;
  }

  function setState(subscribed) {
    if (subscribed) {
      btn.textContent = '🔔 已订阅更新提醒';
      btn.classList.add('push-btn--active');
      btn.title = '点击取消订阅';
    } else {
      btn.textContent = '🔔 订阅更新提醒';
      btn.classList.remove('push-btn--active');
      btn.title = '网站有新内容时通知你';
    }
  }

  function urlBase64ToUint8Array(base64String) {
    var padding = '='.repeat((4 - base64String.length % 4) % 4);
    var base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    var raw = atob(base64);
    var arr = new Uint8Array(raw.length);
    for (var i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
    return arr;
  }

  function register() {
    return navigator.serviceWorker.register('sw.js');
  }

  function subscribe() {
    register()
      .then(function (reg) {
        return reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(PUSH_PUBLIC_KEY)
        });
      })
      .then(function (sub) {
        var data = sub.toJSON ? sub.toJSON() : sub;
        return fetch(PUSH_WORKER_URL + '/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        }).then(function () { return sub; });
      })
      .then(function () {
        localStorage.setItem(PUSH_SUB_KEY, '1');
        setState(true);
      })
      .catch(function (e) {
        setState(false);
        alert('订阅失败：' + (e && e.message ? e.message : '请确认浏览器通知权限已开启'));
      });
  }

  function unsubscribe() {
    register()
      .then(function (reg) { return reg.pushManager.getSubscription(); })
      .then(function (sub) {
        if (sub) {
          var data = sub.toJSON ? sub.toJSON() : sub;
          fetch(PUSH_WORKER_URL + '/unsubscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
          });
          return sub.unsubscribe();
        }
      })
      .then(function () {
        localStorage.removeItem(PUSH_SUB_KEY);
        setState(false);
      })
      .catch(function () {});
  }

  btn.addEventListener('click', function () {
    var subscribed = localStorage.getItem(PUSH_SUB_KEY) === '1';
    if (subscribed) {
      unsubscribe();
      return;
    }
    Notification.requestPermission().then(function (perm) {
      if (perm === 'granted') {
        subscribe();
      } else if (perm === 'denied') {
        setState(false);
        alert('通知权限被拒绝，请在浏览器设置里允许本站通知后重试');
      }
    });
  });

  // 页面加载时同步真实订阅状态：
  // 如果浏览器里已有订阅但 Worker 没记录（如上次网络失败），自动重新上报
  register()
    .then(function (reg) { return reg.pushManager.getSubscription(); })
    .then(function (sub) {
      if (sub) {
        var data = sub.toJSON ? sub.toJSON() : sub;
        fetch(PUSH_WORKER_URL + '/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        }).then(function (r) {
          if (r.ok) localStorage.setItem(PUSH_SUB_KEY, '1');
          setState(r.ok && Notification.permission === 'granted');
        }).catch(function () {
          setState(Notification.permission === 'granted');
        });
      } else {
        setState(false);
      }
    })
    .catch(function () {
      setState(localStorage.getItem(PUSH_SUB_KEY) === '1');
    });
})();
