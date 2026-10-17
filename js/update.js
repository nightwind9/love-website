/* ============================================
   站内更新提示
   加载 version.json（带时间戳防缓存），与 localStorage
   记录的上次版本对比，有新版本则弹出更新提示框
   ============================================ */

(function () {
  var SEEN_KEY = 'love_seen_version';

  var overlay = document.getElementById('updateOverlay');
  if (!overlay) return;

  var dateEl = document.getElementById('updateDate');
  var listEl = document.getElementById('updateList');
  var closeBtn = document.getElementById('updateClose');
  var okBtn = document.getElementById('updateBtn');

  var currentVersion = '';

  function markSeen() {
    if (currentVersion) localStorage.setItem(SEEN_KEY, currentVersion);
    overlay.classList.remove('update-overlay--show');
  }

  function showModal(info) {
    currentVersion = info.version;
    if (dateEl) dateEl.textContent = info.date || '';
    if (listEl) {
      listEl.innerHTML = '';
      var changes = info.changes || [];
      for (var i = 0; i < changes.length; i++) {
        var li = document.createElement('li');
        li.textContent = changes[i];
        listEl.appendChild(li);
      }
    }
    overlay.classList.add('update-overlay--show');
  }

  if (closeBtn) closeBtn.addEventListener('click', markSeen);
  if (okBtn) okBtn.addEventListener('click', markSeen);

  fetch('version.json?t=' + Date.now(), { cache: 'no-store' })
    .then(function (r) { return r.json(); })
    .then(function (info) {
      if (!info || !info.version) return;
      var seen = localStorage.getItem(SEEN_KEY) || '';
      if (!seen) {
        localStorage.setItem(SEEN_KEY, info.version);
        return;
      }
      if (seen !== info.version) {
        showModal(info);
      }
    })
    .catch(function () {});
})();
