export default class RegisterPresenter {
  constructor({ view, model, authModel }) {
    this.view = view;
    this.model = model;
    this.authModel = authModel;
  }

  async submitRegistration(data) {
    try {
      const response = await this.model.getRegistered(data);

      if (!response || typeof response !== 'object') {
        throw new Error('Respon dari server tidak valid.');
      }

      if (response.error) {
        this.view.registrationFailed(response.message || 'Terjadi kesalahan, coba lagi.');
        return;
      }

      this.view.registrationSuccessful('Registrasi berhasil! Silakan login.');
    } catch (error) {
      this.view.registrationFailed(error.message || 'Terjadi kesalahan, coba lagi.');
    }
  }
}
