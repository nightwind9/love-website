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
  var hint = document.getElementById('pushHint');
  if (!btn) return;

  function showHint(text) {
    if (hint) hint.textContent = text || '';
  }

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
      showHint('订阅成功，网站更新时你会收到通知');
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
    showHint('正在订阅...');
    register()
      .then(function (reg) {
        showHint('正在获取推送凭证...');
        return reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(PUSH_PUBLIC_KEY)
        });
      })
      .then(function (sub) {
        var data = sub.toJSON ? sub.toJSON() : sub;
        showHint('正在上报服务器...');
        return fetch(PUSH_WORKER_URL + '/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        }).then(function (r) {
          if (!r.ok) throw new Error('服务器返回 ' + r.status);
          return sub;
        });
      })
      .then(function () {
        localStorage.setItem(PUSH_SUB_KEY, '1');
        setState(true);
      })
      .catch(function (e) {
        setState(false);
        var msg = (e && e.message) ? e.message : '未知错误';
        if (msg === 'Failed to fetch') {
          showHint('❌ 无法连接推送服务器，请检查网络后重试（' + msg + '）');
        } else {
          showHint('❌ 订阅失败：' + msg + '。请截图发给他看看');
        }
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
        showHint('❌ 通知权限被拒绝：请到浏览器设置 → 通知管理，允许本站通知后重试');
      } else {
        setState(false);
        showHint('未获得通知权限，请重试并选择"允许"');
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
          if (!r.ok) showHint('⚠️ 浏览器有订阅但服务器登记失败，请点击按钮重试');
        }).catch(function () {
          setState(Notification.permission === 'granted');
          showHint('⚠️ 网络异常，未完成服务器登记，请刷新重试');
        });
      } else {
        setState(false);
        if (Notification.permission === 'granted') {
          showHint('上次订阅未完成，点击按钮重新订阅');
        }
      }
    })
    .catch(function () {
      setState(localStorage.getItem(PUSH_SUB_KEY) === '1');
    });
})();
