export default class DetailPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async loadDetail(id) {
    try {
      const response = await this.#model.getStoryDetail(id);

      if (!response || !response.story) {
        throw new Error('Detail cerita tidak ditemukan');
      }

      this.#view.showStoryDetail(response.story);
    } catch (error) {
      alert('Gagal memuat detail cerita. Silakan coba lagi.');
    }
  }
}
