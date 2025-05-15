export default class LoginPresenter {
  #view;
  #model;
  #authModel;

  constructor({ view, model, authModel }) {
    this.#view = view;
    this.#model = model;
    this.#authModel = authModel;
  }

  async getLogin({ email, password }) {
    this.#view.showSubmitLoadingButton();
    try {
      const response = await this.#model.getLogin({ email, password });

      if (!response.ok) {
        this.#view.loginFailed(response.message);
        return;
      }

      const accessToken = response.data?.loginResult?.token;

      if (!accessToken) {
        this.#view.loginFailed('Token tidak ditemukan, coba lagi.');
        return;
      }

      this.#authModel.putAccessToken(accessToken);

      this.#view.loginSuccessfully(response.message, response);
    } catch (error) {
      this.#view.loginFailed(error.message);
    } finally {
      this.#view.hideSubmitLoadingButton();
    }
  }
}
