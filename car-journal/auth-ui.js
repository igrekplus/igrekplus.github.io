'use strict';

// 同期ログインの小さなダイアログUI。journal-store.jsの状態だけを操作し、
// DB名・APIキー・設定手順などの技術事情は画面に出さない。

import { openConfirmDialog } from './confirm-ui.js';

export function setupAuthUI(store, elements) {
  const {
    toggleButton,
    dialog,
    form,
    emailInput,
    formStatus,
    signedInBox,
    currentEmail,
    importAnonButton,
    signOutButton,
    closeButtons = [],
    confirm: confirmOption
  } = elements;

  let importingAnon = false;

  function requestAnonImportConfirm() {
    const plainMessage =
      'この端末のメモをアカウントへ追加します。既存の試乗メモには追記され、比較候補・チェックは追加、候補外・費用メモはアカウント側の既存値を優先して未入力項目を取り込みます。続けますか？';
    if (typeof confirmOption === 'function') {
      return Promise.resolve(confirmOption(plainMessage));
    }
    return openConfirmDialog({
      eyebrow: 'IMPORT LOCAL NOTES',
      title: 'この端末のメモをアカウントへ追加する',
      message: 'サインイン前にこの端末へ保存した内容を、現在のアカウントへ取り込みます。',
      points: [
        '試乗メモ：既存のメモに追記されます',
        '比較候補・試乗チェック：現在の内容を消さずに追加されます',
        '候補外設定・費用メモ：アカウント側の既存値を優先し、未入力の項目を取り込みます',
        'キャンセルすると、アカウントのデータは変更されません'
      ],
      confirmLabel: '取り込む',
      cancelLabel: 'キャンセル',
      returnFocusTo: signOutButton || dialog
    });
  }

  function setStatusMessage(text) {
    if (!formStatus) return;
    formStatus.hidden = false;
    formStatus.textContent = text;
  }

  if (!store.isCloudConfigured()) {
    if (toggleButton) toggleButton.hidden = true;
    return { destroy() {} };
  }

  if (toggleButton) {
    toggleButton.hidden = false;
    toggleButton.textContent = '同期を設定する';
    toggleButton.addEventListener('click', open);
  }
  closeButtons.forEach(button => button.addEventListener('click', () => dialog.close()));

  function open() {
    setStatusMessage('');
    render();
    if (!dialog.open) dialog.showModal();
  }

  function render() {
    const session = store.getSession();
    const signedIn = Boolean(session?.user);
    if (signedInBox) {
      signedInBox.hidden = !signedIn;
      signedInBox.style.display = signedIn ? '' : 'none';
    }
    if (form) {
      form.hidden = signedIn;
      form.style.display = signedIn ? 'none' : '';
    }
    if (signedIn && currentEmail) currentEmail.textContent = session.user.email || '';
    if (importAnonButton && typeof store.hasAnonymousData === 'function') {
      const hasAnon = Boolean(signedIn && store.hasAnonymousData());
      importAnonButton.hidden = !hasAnon;
      importAnonButton.disabled = !hasAnon;
    }
    if (toggleButton) toggleButton.textContent = signedIn ? '同期の設定を見る' : '同期を設定する';
  }

  function applyImportResult(result) {
    if (result?.ok) {
      const syncMode = typeof store.getSyncStatus === 'function' ? store.getSyncStatus()?.mode : '';
      if (syncMode === 'storage-error') {
        setStatusMessage('画面上に取り込みましたが、この端末へ保存できませんでした。必要に応じてメモやバックアップを書き出してください。');
      } else if (syncMode === 'auth-expired') {
        setStatusMessage('この端末のメモをアカウントへ追加しました。クラウドへ反映するには再ログインが必要です。');
      } else if (syncMode === 'offline') {
        setStatusMessage('この端末のメモをアカウントへ追加しました。現在オフラインのため、通信回復後に同期します。');
      } else {
        setStatusMessage('この端末のメモをアカウントへ追加しました。');
      }
      return;
    }
    if (result?.error === 'no-anon-data' || result?.error === 'empty') {
      setStatusMessage('取り込めるメモがこの端末に見つかりませんでした。');
      return;
    }
    if (result?.error === 'already-anonymous' || result?.error === 'not-signed-in') {
      setStatusMessage('サインイン後に取り込めます。');
      return;
    }
    setStatusMessage('この端末のメモを取り込めませんでした。しばらくしてからもう一度お試しください。');
  }

  if (form) {
    form.addEventListener('submit', async event => {
      event.preventDefault();
      const email = emailInput.value.trim();
      if (!email) return;
      setStatusMessage('送信しています…');
      const redirectTo = `${location.origin}${location.pathname}`;
      const result = await store.signInWithEmail(email, redirectTo);
      setStatusMessage(
        result?.ok
          ? 'このメール宛に認証リンクを送りました。リンクを開くと同期が始まります。'
          : '送信できませんでした。メールアドレスを確認して、しばらくしてからもう一度お試しください。'
      );
    });
  }

  if (importAnonButton) {
    importAnonButton.addEventListener('click', async () => {
      if (importingAnon) return;
      importingAnon = true;
      try {
        const confirmed = await requestAnonImportConfirm();
        if (!confirmed) {
          setStatusMessage('取り込みをキャンセルしました。');
          return;
        }
        const result = await Promise.resolve(store.importAnonymousData());
        applyImportResult(result);
      } catch {
        applyImportResult({ ok: false });
      } finally {
        importingAnon = false;
      }
    });
  }

  if (signOutButton) {
    signOutButton.addEventListener('click', async () => {
      await store.signOut();
      render();
      const syncMode = typeof store.getSyncStatus === 'function' ? store.getSyncStatus()?.mode : '';
      setStatusMessage(
        syncMode === 'storage-error'
          ? 'サインアウトしました。この端末へ保存できないため、必要に応じてメモやバックアップを書き出してください。'
          : 'サインアウトしました。この端末に保存する状態へ戻りました。'
      );
    });
  }

  render();
  const unsubscribe = store.subscribe(() => render());
  const unsubscribeStatus = store.onSyncStatusChange(() => render());

  return {
    open,
    destroy() {
      unsubscribe();
      unsubscribeStatus();
    }
  };
}
