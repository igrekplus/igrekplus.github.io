'use strict';
(function () {
  var STORAGE_KEY = 'car-journal-theme';
  var THEME_COLORS = { light: '#172725', dark: '#0f1615' };

  function readStoredTheme() {
    try {
      var value = window.localStorage.getItem(STORAGE_KEY);
      return value === 'dark' || value === 'light' ? value : null;
    } catch (_err) {
      return null;
    }
  }

  function writeStoredTheme(theme) {
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
      return true;
    } catch (_err) {
      return false;
    }
  }

  function getSystemTheme() {
    try {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    } catch (_err) {
      // ignore matchMedia errors
    }
    return 'light';
  }

  function getInitialTheme() {
    return readStoredTheme() || getSystemTheme();
  }

  function syncToggleButtons(theme) {
    var isDark = theme === 'dark';
    var buttons = document.querySelectorAll('[data-theme-toggle]');
    for (var i = 0; i < buttons.length; i++) {
      var btn = buttons[i];
      btn.setAttribute('aria-pressed', isDark ? 'true' : 'false');
      btn.setAttribute(
        'aria-label',
        isDark
          ? '表示モード：ダーク（ライトモードへ切替）'
          : '表示モード：ライト（ダークモードへ切替）'
      );
      btn.setAttribute('title', isDark ? 'ライトモードに切り替える' : 'ダークモードに切り替える');
      var label = btn.querySelector('[data-theme-label]');
      if (label) {
        label.textContent = isDark ? 'ライト' : 'ダーク';
      }
    }
  }

  function applyTheme(theme) {
    var normalized = theme === 'dark' ? 'dark' : 'light';
    var root = document.documentElement;
    root.dataset.theme = normalized;
    root.style.colorScheme = normalized;
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', THEME_COLORS[normalized]);
    }
    syncToggleButtons(normalized);
    return normalized;
  }

  function toggleTheme() {
    var current = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
    var next = current === 'dark' ? 'light' : 'dark';
    writeStoredTheme(next);
    return applyTheme(next);
  }

  function bindEvents() {
    var buttons = document.querySelectorAll('[data-theme-toggle]');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener('click', toggleTheme);
    }

    try {
      if (window.matchMedia) {
        var mq = window.matchMedia('(prefers-color-scheme: dark)');
        var onSystemChange = function (event) {
          if (!readStoredTheme()) {
            applyTheme(event.matches ? 'dark' : 'light');
          }
        };
        if (typeof mq.addEventListener === 'function') {
          mq.addEventListener('change', onSystemChange);
        } else if (typeof mq.addListener === 'function') {
          mq.addListener(onSystemChange);
        }
      }
    } catch (_err) {
      // ignore matchMedia listener errors
    }

    window.addEventListener('storage', function (event) {
      if (event && event.key === STORAGE_KEY) {
        applyTheme(readStoredTheme() || getSystemTheme());
      }
    });
  }

  function init() {
    applyTheme(getInitialTheme());
    bindEvents();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }

  window.__carJournalTheme = {
    STORAGE_KEY: STORAGE_KEY,
    readStoredTheme: readStoredTheme,
    writeStoredTheme: writeStoredTheme,
    getSystemTheme: getSystemTheme,
    getInitialTheme: getInitialTheme,
    applyTheme: applyTheme,
    toggleTheme: toggleTheme
  };
})();
