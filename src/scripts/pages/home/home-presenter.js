export default class HomePresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async loadStories() {
    try {
      const response = await this.#model.getAllStories();

      if (!response.ok) {
        console.error('Gagal mengambil data:', response.message);
        return;
      }

      this.#view.showStories(response.listStory);
      this.#view.showMap(response.listStory);
    } catch (error) {
      console.error('Error saat memuat cerita:', error);
    }
  }
}
