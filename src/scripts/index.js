import '../styles/styles.css';
import App from './pages/app';
import { getAccessToken, getLogout } from './utils/auth';
import { registerServiceWorker } from './utils';
import {
  isCurrentPushSubscriptionAvailable,
  subscribe,
  unsubscribe,
} from './utils/notification-helper.js';

let isSubscribed = false;

function toggleNavigation() {
  const token = getAccessToken();
  const navDrawer = document.getElementById('navigation-drawer');
  const drawerButton = document.getElementById('drawer-button');

  if (token) {
    navDrawer.style.display = 'block';
    drawerButton.style.display = 'inline-block';
  } else {
    navDrawer.style.display = 'none';
    drawerButton.style.display = 'none';
  }
}

async function updateSubscriptionButton() {
  const btn = document.getElementById('subscribeBtn');
  if (!btn) return;

  isSubscribed = await isCurrentPushSubscriptionAvailable();
  btn.textContent = isSubscribed ? 'Unsubscribe Notifikasi' : 'Subscribe Notifikasi';
}

export async function toggleSubscription() {
  if (!isSubscribed) {
    await subscribe();
  } else {
    await unsubscribe();
  }
  await updateSubscriptionButton();
}

document.addEventListener('DOMContentLoaded', async () => {
  const app = new App({
    content: document.querySelector('#main-content'),
    drawerButton: document.querySelector('#drawer-button'),
    navigationDrawer: document.querySelector('#navigation-drawer'),
  });

  const mainContent = document.querySelector('#main-content');
  const skipLink = document.querySelector('.skip-to-content');
  const subscribeBtn = document.getElementById('subscribeBtn');
  const logoutBtn = document.querySelector('.logout-button');

  if (skipLink) {
    skipLink.addEventListener('click', (event) => {
      event.preventDefault();
      skipLink.blur();
      mainContent.focus();
      mainContent.scrollIntoView();
    });
  }

  if (subscribeBtn) {
    subscribeBtn.addEventListener('click', toggleSubscription);
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      getLogout(); // hapus token
      location.hash = '/login';
      setTimeout(() => {
        window.dispatchEvent(new HashChangeEvent('hashchange'));
      }, 10); // trigger ulang routing
    });
  }

  const token = getAccessToken();
  if (!token && location.hash === '') {
    location.hash = '/login';
  }

  toggleNavigation();
  await app.renderPage();
  await registerServiceWorker();
  await updateSubscriptionButton();

  window.addEventListener('hashchange', async () => {
    await app.renderPage();
    toggleNavigation();
  });
});

export function generateLoaderTemplate() {
  return `<div class="loader">Loading...</div>`;
}
