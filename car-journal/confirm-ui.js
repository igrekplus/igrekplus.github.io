'use strict';

// サイト内の非同期確認ダイアログ（native window.confirm / window.alert を使わず HTML <dialog> で確認する）。

const DIALOG_ID = 'confirm-dialog';
let activeSession = null;

function getDialogElements() {
  if (typeof document === 'undefined') return null;
  let dialog = document.getElementById(DIALOG_ID);
  if (!dialog) {
    dialog = document.createElement('dialog');
    dialog.id = DIALOG_ID;
    dialog.className = 'detail-dialog confirm-dialog';
    dialog.setAttribute('aria-labelledby', 'confirm-dialog-title');
    dialog.setAttribute('aria-describedby', 'confirm-dialog-message');
    dialog.innerHTML =
      '<button aria-label="閉じる" class="close-dialog" type="button">×</button>' +
      '<div class="detail-copy">' +
        '<p class="eyebrow" id="confirm-dialog-eyebrow">CONFIRMATION</p>' +
        '<h2 id="confirm-dialog-title">内容を確認してください</h2>' +
        '<p class="confirm-message" id="confirm-dialog-message"></p>' +
        '<ul class="confirm-points" hidden id="confirm-dialog-points"></ul>' +
        '<div class="confirm-actions">' +
          '<button class="button outline" id="confirm-dialog-cancel" type="button">キャンセル</button>' +
          '<button class="button accent" id="confirm-dialog-accept" type="button">実行する</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(dialog);
  }
  return {
    dialog,
    eyebrow: dialog.querySelector('#confirm-dialog-eyebrow'),
    title: dialog.querySelector('#confirm-dialog-title'),
    message: dialog.querySelector('#confirm-dialog-message'),
    points: dialog.querySelector('#confirm-dialog-points'),
    cancelButton: dialog.querySelector('#confirm-dialog-cancel'),
    acceptButton: dialog.querySelector('#confirm-dialog-accept'),
    closeButton: dialog.querySelector('.close-dialog')
  };
}

function restoreFocus(candidates) {
  for (const el of candidates) {
    if (!el || typeof el.focus !== 'function') continue;
    if (el.isConnected === false || el.hidden || el.disabled) continue;
    if (typeof document !== 'undefined' && el === document.body) continue;
    try {
      el.focus();
      return;
    } catch {
      // フォーカス復帰できない要素は次候補へ
    }
  }
}

export function openConfirmDialog(options = {}) {
  const els = getDialogElements();
  if (!els) return Promise.resolve(false);
  if (activeSession) return Promise.resolve(false);

  const {
    eyebrow = 'CONFIRMATION',
    title = '内容を確認してください',
    message = '',
    points = [],
    confirmLabel = '実行する',
    cancelLabel = 'キャンセル',
    noticeOnly = false,
    returnFocusTo = null
  } = options;

  const { dialog, eyebrow: eyebrowEl, title: titleEl, message: messageEl, points: pointsEl, cancelButton, acceptButton, closeButton } = els;

  const previousActive = typeof document !== 'undefined' ? document.activeElement : null;

  if (eyebrowEl) eyebrowEl.textContent = eyebrow;
  if (titleEl) titleEl.textContent = title;
  if (messageEl) messageEl.textContent = message;
  if (pointsEl) {
    pointsEl.textContent = '';
    const list = Array.isArray(points) ? points.filter(Boolean) : [];
    pointsEl.hidden = list.length === 0;
    for (const item of list) {
      const li = document.createElement('li');
      li.textContent = String(item);
      pointsEl.appendChild(li);
    }
  }
  if (cancelButton) {
    cancelButton.textContent = cancelLabel;
    cancelButton.hidden = noticeOnly;
    cancelButton.disabled = false;
  }
  if (acceptButton) {
    acceptButton.textContent = confirmLabel;
    acceptButton.disabled = false;
  }

  return new Promise(resolve => {
    let settled = false;

    const cleanup = () => {
      if (acceptButton) acceptButton.removeEventListener('click', onAccept);
      if (cancelButton) cancelButton.removeEventListener('click', onCancel);
      if (closeButton) closeButton.removeEventListener('click', onCancel);
      dialog.removeEventListener('cancel', onDialogCancel);
      dialog.removeEventListener('close', onDialogClose);
      dialog.removeEventListener('click', onBackdropClick);
      if (activeSession === finish) activeSession = null;
    };

    const finish = result => {
      if (settled) return;
      settled = true;
      if (acceptButton) acceptButton.disabled = true;
      if (cancelButton) cancelButton.disabled = true;
      cleanup();
      if (dialog.open) {
        try {
          dialog.close(result ? 'confirm' : 'cancel');
        } catch {
          // 既に閉じている場合は無視
        }
      }
      restoreFocus([previousActive, returnFocusTo]);
      resolve(Boolean(result));
    };

    const onAccept = () => finish(!noticeOnly);
    const onCancel = () => finish(false);
    const onDialogCancel = () => finish(false);
    const onDialogClose = () => finish(false);
    const onBackdropClick = event => {
      if (event.target !== dialog) return;
      if (typeof dialog.getBoundingClientRect !== 'function') {
        finish(false);
        return;
      }
      const rect = dialog.getBoundingClientRect();
      if (
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom
      ) {
        finish(false);
      }
    };

    activeSession = finish;
    if (acceptButton) acceptButton.addEventListener('click', onAccept);
    if (cancelButton) cancelButton.addEventListener('click', onCancel);
    if (closeButton) closeButton.addEventListener('click', onCancel);
    dialog.addEventListener('cancel', onDialogCancel);
    dialog.addEventListener('close', onDialogClose);
    dialog.addEventListener('click', onBackdropClick);

    try {
      if (!dialog.open) dialog.showModal();
    } catch {
      finish(false);
      return;
    }

    const initialFocus = noticeOnly ? acceptButton : (cancelButton || acceptButton);
    if (initialFocus && typeof initialFocus.focus === 'function') {
      try { initialFocus.focus(); } catch {}
    }
  });
}

export function openNoticeDialog(options = {}) {
  return openConfirmDialog({
    eyebrow: options.eyebrow || 'NOTICE',
    title: options.title || 'お知らせ',
    message: options.message || '',
    points: options.points || [],
    confirmLabel: options.confirmLabel || '閉じる',
    noticeOnly: true,
    returnFocusTo: options.returnFocusTo || null
  });
}
