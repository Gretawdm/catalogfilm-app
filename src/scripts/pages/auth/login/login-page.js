import LoginPresenter from './login-presenter';
import * as ProjectAPI from '../../../data/api';
import * as AuthModel from '../../../utils/auth';

export default class LoginPage {
  #presenter = null;

  async render() {
    return `
    <section class="auth-container">
      <div class="auth-box">
        <div class="auth-image">
          <img src="https://cdn.andro4all.com/andro4all/2021/05/amazon-prime-video-catalogo.jpg" alt="Auth Image">
        </div>
        <div class="auth-form">
          <h2>Login</h2>
          <form id="loginForm">
            <div class="form-control">
              <label for="email-input">Email</label>
              <input id="email-input" type="email" name="email" placeholder="Contoh: nama@email.com" autofocus>
            </div>
            <div class="form-control">
              <label for="password-input">Password</label>
              <input id="password-input" type="password" name="password" placeholder="Masukkan password Anda">
            </div>
            <div id="submit-button-container">
             <button class="btn" type="submit">Masuk</button>
            </div>
            <div class="register-link">
             <p>Belum punya akun? <a href="#/register" class="switch-page">Daftar</a></p>
            </div>
          </form>
        </div>
      </div>
    </section>
  `;
  }

  async afterRender() {
    this.#presenter = new LoginPresenter({
      view: this,
      model: ProjectAPI,
      authModel: AuthModel,
    });

    this.#setupForm();
    this.#setupTransition();
  }

  #setupForm() {
    document.getElementById('loginForm').addEventListener('submit', async (event) => {
      event.preventDefault();

      const data = {
        email: document.getElementById('email-input').value,
        password: document.getElementById('password-input').value,
      };
      await this.#presenter.getLogin(data);
    });
  }

  #setupTransition() {
    document.querySelector('.switch-page').addEventListener('click', (event) => {
      event.preventDefault();
      this.#animatePageTransition('/register');
    });
  }

  #animatePageTransition(targetPage) {
    const container = document.querySelector('.auth-container');
    container.classList.add('fade-out');
    setTimeout(() => {
      location.hash = targetPage;
    }, 500);
  }

  loginSuccessfully(message) {
    location.hash = '/';
  }

  loginFailed(message) {
    alert(message);
  }

  showSubmitLoadingButton() {
    const buttonContainer = document.getElementById('submit-button-container');
    buttonContainer.innerHTML = `
    <button class="btn" type="submit" disabled>
      <i class="fas fa-spinner loader-button"></i> Masuk
    </button>
  `;
  }

  hideSubmitLoadingButton() {
    const buttonContainer = document.getElementById('submit-button-container');
    buttonContainer.innerHTML = `
    <button class="btn" type="submit">Masuk</button>
  `;
  }
}
