import RegisterPresenter from './register-presenter';
import * as ProjectAPI from '../../../data/api';
import * as AuthModel from '../../../utils/auth';

export default class RegisterPage {
  #presenter = null;

  async render() {
    return `
      <section class="auth-container">
        <div class="auth-box">
          <div class="auth-image">
            <img src="https://cdn.andro4all.com/andro4all/2021/05/amazon-prime-video-catalogo.jpg" alt="Auth Image">
          </div>
          <div class="auth-form">
            <h2>Register</h2>
            <form id="registerForm">
              <div class="form-control">
                <label for="name-input">Nama Lengkap</label>
                <input id="name-input" type="text" name="name" placeholder="Masukkan nama lengkap Anda" required>
              </div>
              <div class="form-control">
                <label for="email-input">Email</label>
                <input id="email-input" type="email" name="email" placeholder="Masukkan email Anda" required>
              </div>
              <div class="form-control">
                <label for="password-input">Password</label>
                <input id="password-input" type="password" name="password" placeholder="Buat password" required>
              </div>
              <button id="submit-button" class="btn" type="submit">Daftar</button>
              <div class="register-link">
                <p>Sudah punya akun? <a href="#/login" class="switch-page">Masuk</a></p>
              </div>
            </form>
          </div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new RegisterPresenter({
      view: this,
      model: ProjectAPI,
      authModel: AuthModel,
    });

    this.#setupForm();
    this.#setupTransition();
  }

  #setupForm() {
    const form = document.getElementById('registerForm');
    if (!form) return;

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const data = {
        name: document.getElementById('name-input').value,
        email: document.getElementById('email-input').value,
        password: document.getElementById('password-input').value,
      };

      this.#toggleSubmitButton(true);
      await this.#presenter.submitRegistration(data);
      this.#toggleSubmitButton(false);
    });
  }

  #toggleSubmitButton(disable) {
    const submitButton = document.getElementById('submit-button');
    if (submitButton) submitButton.disabled = disable;
  }

  #setupTransition() {
    const switchPageLink = document.querySelector('.switch-page');
    if (!switchPageLink) return;

    switchPageLink.addEventListener('click', (event) => {
      event.preventDefault();
      this.#animatePageTransition('/login');
    });
  }

  #animatePageTransition(targetPage) {
    const container = document.querySelector('.auth-container');
    if (!container) return;

    container.classList.add('fade-out');
    setTimeout(() => {
      location.hash = targetPage;
    }, 500);
  }

  registrationSuccessful(message) {
    alert(message);
    location.hash = '/login';
  }

  registrationFailed(message) {
    alert(message);
  }
}
