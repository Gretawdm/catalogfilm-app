export default class FavoritePresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async loadFavorites() {
    try {
      const stories = await this.#model.getAll(); 

      this.#view.showStories(stories);
      this.#view.showMap(stories);
    } catch (error) {
      console.error('Gagal memuat film favorit:', error);
    }
  }
}
