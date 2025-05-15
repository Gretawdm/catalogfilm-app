import DetailPresenter from './detail-presenter';
import { parseActivePathname } from '../../routes/url-parser';
import * as ProjectAPI from '../../data/api';
import * as FavoriteDB from '../../data/favorite-db';

export default class DetailPage {
  #presenter = null;

  async render() {
    return `
      <div class="title-container-detail">
        <div class="overlay-title"></div>
        <div class="title-content">    
          <h2>Detail Film</h2>
        </div>
      </div>
      <div class="content-container">
        <div id="story-detail" class="film-grid"></div>
      </div>
    `;
  }

  async afterRender() {
    const id = parseActivePathname().id;
    this.#presenter = new DetailPresenter({
      view: this,
      model: ProjectAPI,
    });

    this.#presenter.loadDetail(id);
  }

  showStoryDetail(story) {
    const storyElement = document.getElementById('story-detail');
    const photoUrl = story.photoUrl
      ? `<img src="${story.photoUrl}" alt="${story.name}" style="view-transition-name: poster-${story.id}; max-width: 100%; height: auto;" />`
      : '';

    storyElement.innerHTML = `
      <div class="card-wrapper">
        <div class="story-card">
          <div class="image-container">
            ${photoUrl}
          </div>
          <div class="details-container">
            <h2 style="view-transition-name: title-${story.id};">${story.name}</h2>
            <div class="details-desc">
              <h4>Informasi Film</h4>
              <p>${story.description}</p>
            </div>
            <div class="details-desc">
              <h4>Dirilis Pada</h4>
              <p>${new Date(story.createdAt).toLocaleString()}</p>
            </div>
            <div class="details-desc">
              <h4>Lokasi Film</h4>
              <p>Latitude: ${story.lat}</p>
              <p>Longitude: ${story.lon}</p>
            </div>
            <button id="favorite-btn" class="favorite-btn">Simpan ke Favorit</button>
          </div>
          <div class="map-container" id="map"></div>
        </div>
      </div>
    `;

    this.#initializeMap(story);
    this.#handleFavoriteButton(story);
  }

  async #handleFavoriteButton(story) {
    const favoriteBtn = document.getElementById('favorite-btn');

    const isFavorite = await FavoriteDB.get(story.id);

    if (isFavorite) {
      favoriteBtn.innerText = 'Hapus dari Favorit';
    } else {
      favoriteBtn.innerText = 'Simpan ke Favorit';
    }

    favoriteBtn.addEventListener('click', async () => {
      if (await FavoriteDB.get(story.id)) {
        await FavoriteDB.deleteFavorite(story.id);
        favoriteBtn.innerText = 'Simpan ke Favorit';
        alert('Film dihapus dari favorit');
      } else {
        await FavoriteDB.put(story);
        favoriteBtn.innerText = 'Hapus dari Favorit';
        alert('Film disimpan ke favorit');
      }
    });
  }

  #initializeMap(story) {
    if (story.lat && story.lon) {
      const map = L.map('map').setView([story.lat, story.lon], 16);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
      }).addTo(map);

      L.marker([story.lat, story.lon]).addTo(map).bindPopup(story.name).openPopup();
    }
  }
}
