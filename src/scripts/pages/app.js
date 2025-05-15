import routes from '../routes/routes';
import { getActiveRoute } from '../routes/url-parser';
import { generateLoaderTemplate } from '../index';

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;

    this._setupDrawer();
  }

  _setupDrawer() {
    this.#drawerButton.addEventListener('click', () => {
      this.#navigationDrawer.classList.toggle('open');
    });

    document.body.addEventListener('click', (event) => {
      if (
        !this.#navigationDrawer.contains(event.target) &&
        !this.#drawerButton.contains(event.target)
      ) {
        this.#navigationDrawer.classList.remove('open');
      }

      this.#navigationDrawer.querySelectorAll('a').forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove('open');
        }
      });
    });
  }

  async renderPage() {
    const url = getActiveRoute();
    let page = routes[url];

    if (typeof page === 'function') {
      page = page();
    }

    if (!page || typeof page.render !== 'function') {
      this.#content.innerHTML = '<h2>Halaman tidak ditemukan</h2>';
      return;
    }

    const loadContent = async () => {
      this.#content.classList.remove('fade-in');
      this.#content.innerHTML = generateLoaderTemplate();

      await new Promise((resolve) => setTimeout(resolve, 200));

      this.#content.innerHTML = await page.render();

      void this.#content.offsetWidth;
      this.#content.classList.add('fade-in');

      if (typeof page.afterRender === 'function') {
        await page.afterRender();
      }

      const navActions = document.getElementById('nav-actions');
      const userLoggedIn = localStorage.getItem('token');

      if (userLoggedIn && navActions) {
        navActions.innerHTML = `
        <button id="btn-add-catalog" class="btn-add">+ Tambah Katalog</button>
      `;

        const addBtn = document.getElementById('btn-add-catalog');
        addBtn.addEventListener('click', () => {
          window.location.hash = '/add';
        });
      }
    };

    if (document.startViewTransition) {
      document.startViewTransition(loadContent);
    } else {
      await loadContent();
    }
  }
}


export default App;
