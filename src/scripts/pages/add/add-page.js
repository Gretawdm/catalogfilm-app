import AddPresenter from './add-presenter';
import * as ProjectAPI from '../../data/api';


export default class AddPage {
  #presenter = null;

  async render() {
    return `
      <section>
        <div class="header-title">
          <div class="overlay-title"></div>
          <div class="container">
            <h1>Tambahkan Film Baru</h1>
            <p>
              Silahkan tambahkan beberapa film baru disini yah. Jangan lupa selalu update terus!
            </p>
          </div>
        </div>
      </section>

      <section class="content-container-form">
        <div class="new-form">
          <form id="add-form" class="form-page">
            <div class="form-control">
              <label for="description">Deskripsi Film</label>
              <textarea
                id="description"
                placeholder="Deskripsikan Film Ini Secara Singkat."
                required
              ></textarea>
            </div>

            <div class="form-control-camera">
              <label>Ambil atau Pilih Gambar</label>
              <p>
                Gunakan kamera untuk menangkap momen terbaik, atau pilih gambar favorit dari galeri Anda.
              </p>
              <div class="button-camera">
                <button type="button" class="btn-red" id="customUploadButton">Ambil Gambar dari Galeri</button>
                <input type="file" accept="image/*" id="uploadImage" style="display: none;" />
                <button type="button" class="btn-outline-black" id="toggleCamera">Buka Kamera</button>
              </div>
              <div class="area-camera" id="camera-area">
                <video id="video" autoplay playsinline></video>
                <select id="cameraOptions" class="camera-select"></select>
                <div class="button-area-camera">
                  <button type="button" class="btn-red" id="capturePhoto">Ambil Gambar</button>
                  <button type="button" class="btn-outline-black" id="closeCamera">Tutup Kamera</button>
                </div>
              </div>
              <canvas id="canvas" style="display: none;"></canvas>
              <img id="preview" alt="Pratinjau gambar film" />
            </div>

            <div class="form-control-map">
                <h3>Lokasi Anda</h3>
                <div id="map" style="height: 250px; margin-top: 10px;"></div>
                <div style="margin-top: 10px; display: flex; gap: 10px;">
                    <input type="text" id="latitude" readonly placeholder="Latitude" />
                    
                    <input type="text" id="longitude" readonly placeholder="Longitude" />
                </div>
            </div>

            <div class="form-button">
              <a class="btn-grey" href="">Batal</a>
              <button class="btn-green" type="submit">Kirim</button>
            </div>
          </form>
        </div>
      </section>

      <div id="loading" class="loading-overlay" style="display: none;">   
          <div id="lottie-loader" class="lottie-box"></div>
      </div>
    `;
  }

  async afterRender() {
    this.#presenter = new AddPresenter({
      view: this,
      model: ProjectAPI,
    });

    this.#presenter.init();
  }

  getFormData() {
    return {
      description: document.getElementById('description').value,
    };
  }

  getCanvas() {
    return document.getElementById('canvas');
  }

  getPreview() {
    return document.getElementById('preview');
  }

  getVideo() {
    return document.getElementById('video');
  }

  showPreview(imageURL) {
    const preview = this.getPreview();
    preview.src = imageURL;
    preview.style.display = 'block';
  }

  showMessage(msg) {
    alert(msg);
  }

  showLoading() {
    document.getElementById('loading').style.display = 'flex';
  }

  hideLoading() {
    document.getElementById('loading').style.display = 'none';
  }

  getToken() {
    return getToken();
  }
}
