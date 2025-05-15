import FavoritePresenter from './favorite-presenter';
import * as FavoriteDB from '../../data/favorite-db';

export default class FavoritePage {
  #presenter = null;

  async render() {
    return `
     <section>
        <div class="header-title">
          <div class="overlay-title"></div>
          <div class="container">
            <h1>Film favorite</h1>
            <p>
              Ini merupakan film yang anda tambahkan dalam halaman favorite anda!
            </p>
          </div>
        </div>
      </section>

      <section>
      <div class="content-container">
        <div id="stories-list" class="film-grid"></div>
      </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new FavoritePresenter({
      view: this,
      model: FavoriteDB,
    });

    this.#presenter.loadFavorites();
  }

  showStories(stories) {
    const listContainer = document.getElementById('stories-list');
    listContainer.innerHTML = ''; 

    if (!stories || stories.length === 0) {
      listContainer.innerHTML = `
        <div class="empty-message">
          <p>Tidak ada film favorit yang disimpan.</p>
        </div>
      `;
      return;
    }

    stories.forEach((story) => {
      const storyElement = document.createElement('div');
      storyElement.classList.add('film-card');
      storyElement.innerHTML = `
        <div class="card-container">
          <img class="film-poster" src="${story.photoUrl}" alt="${story.name}">
          <div class="overlay">
            <a href="#/stories/${story.id}" class="read-more-btn" data-id="${story.id}">Lihat Detail</a>
          </div>
          <div class="film-info">
            <h3>${story.name}</h3>
            <p>${story.description.slice(0, 30)}...</p>
            <small>${new Date(story.createdAt).toLocaleDateString()}</small>
          </div>
        </div>
      `;

      storyElement.querySelector('.read-more-btn').addEventListener('click', (e) => {
        e.preventDefault();
        window.location.hash = `#/stories/${story.id}`;
      });

      listContainer.appendChild(storyElement);
    });
  }

  transitionToDetailPage(id) {
    const filmCard = document.querySelector('.film-card');
    const image = filmCard.querySelector('.film-poster');

    if (image.complete) {
      this.animateImageAndTransition(image, id);
    } else {
      image.onload = () => this.animateImageAndTransition(image, id);
    }
  }

  animateImageAndTransition(image, id) {
    const keyframes = [
      { transform: 'scale(1)', opacity: 1 },
      { transform: 'scale(1.2)', opacity: 1 },
    ];

    const options = {
      duration: 500,
      easing: 'ease-in-out',
    };

    const animation = new Animation(new KeyframeEffect(image, keyframes, options));
    animation.play();

    animation.onfinish = () => {
      window.location.hash = `#/stories/${id}`;
    };
  }

  showMap(stories) {
    const map = L.map('map').setView([-2.5, 118], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    stories.forEach((story) => {
      if (story.lat && story.lon) {
        const marker = L.marker([story.lat, story.lon]).addTo(map);
        marker.bindPopup(`<b>${story.name}</b><br>${story.description}`);
      }
    });
  }
}
