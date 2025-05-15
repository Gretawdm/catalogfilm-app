import HomePresenter from './home-presenter';
import * as ProjectAPI from '../../data/api';

export default class HomePage {
  #presenter = null;

  async render() {
    return `
      <div class="title-container">
        <div class="overlay-title"></div>
          <div class="title-content">    
            <h2>Unlimited movies, TV shows, and more</h2>
            <p>Starts at IDR 54,000. Cancel anytime.</p>
          </div>
        </div>
        <div class="content-container">
          <div id="stories-list" class="film-grid"></div>
        </div>
        <div id="map" style="height: 400px;"></div>
      </div>
    `;
  }

  async afterRender() {
    this.#presenter = new HomePresenter({
      view: this,
      model: ProjectAPI,
    });

    this.#presenter.loadStories();
  }

  async transitionToDetailPage(id) {
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

  showStories(stories) {
    const listContainer = document.getElementById('stories-list');
    listContainer.innerHTML = '';
    listContainer.className = 'film-grid';

    stories.forEach((story) => {
      const storyElement = document.createElement('div');
      storyElement.classList.add('film-card');
      storyElement.innerHTML = `
      <div class="card-container">
        <img class="film-poster" src="${story.photoUrl}" alt="${story.name}" style="view-transition-name: poster-${story.id};">
          <div class="overlay">
            <a href="#/stories/${story.id}" class="read-more-btn" data-id="${story.id}">Lihat Detail</a>
          </div>
        <div class="film-info">
          <h3 style="view-transition-name: title-${story.id};">${story.name}</h3>
          <p>${story.description.slice(0, 30)}...</p>
          <small>
          ${new Date(story.createdAt).toLocaleDateString()}</small>
        </div>
      </div>
    `;
      listContainer.appendChild(storyElement);

      storyElement.querySelector('.read-more-btn').addEventListener('click', (e) => {
        e.preventDefault();
        const id = e.target.dataset.id;
        this.transitionToDetailPage(id);
        if (document.startViewTransition) {
          document.startViewTransition(() => {
            window.location.hash = `#/stories/${id}`;
          });
        } else {
          window.location.hash = `#/stories/${id}`;
        }
      });
    });

    listContainer.querySelectorAll('.detail-button').forEach((btn) => {
      btn.addEventListener('click', async (e) => {
        const id = e.target.dataset.id;
        const detail = await ProjectAPI.getStoryDetail(id);
        alert(
          `Detail Cerita:\n\nJudul: ${detail.name}\nDeskripsi: ${detail.description}\nTanggal: ${new Date(detail.createdAt).toLocaleString()}`,
        );
      });
    });
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
