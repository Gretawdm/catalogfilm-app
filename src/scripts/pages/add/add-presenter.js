import { postNewStory } from '../../data/api';
import SimpleCamera from '../../utils/camera';

export default class AddPresenter {
  #view = null;
  #lat = null;
  #lon = null;
  #imageBlob = null;
  #camera = null;

  constructor({ view }) {
    this.#view = view;
    this.#camera = new SimpleCamera(view.getVideo(), view.getCanvas());
    this.lottieLoaded = false;
  }

  async init() {
    const cameraSelect = document.getElementById('cameraOptions');
    const toggleBtn = document.getElementById('toggleCamera');
    const captureBtn = document.getElementById('capturePhoto');
    const cameraArea = document.getElementById('camera-area');
    const closeBtn = document.getElementById('closeCamera');
    const customUploadBtn = document.getElementById('customUploadButton');
    const uploadInput = document.getElementById('uploadImage');
    let isCameraOn = false;

    const devices = await this.#camera.init();
    devices.forEach((device) => {
      const option = document.createElement('option');
      option.value = device.deviceId;
      option.textContent = device.label || `Kamera ${cameraSelect.length + 1}`;
      cameraSelect.appendChild(option);
    });

    toggleBtn.addEventListener('click', async () => {
      const selectedId = cameraSelect.value;

      if (!isCameraOn) {
        await this.#camera.start(selectedId);
        cameraArea.style.display = 'block';
        toggleBtn.style.display = 'none';
        isCameraOn = true;
      }
    });

    captureBtn.addEventListener('click', async () => {
      const blob = await this.#camera.capture();
      this.#imageBlob = blob;
      this.#view.showPreview(URL.createObjectURL(blob));
    });

    closeBtn.addEventListener('click', () => {
      this.#camera.stop();
      cameraArea.style.display = 'none';
      toggleBtn.style.display = 'inline-block';
      isCameraOn = false;
    });

    customUploadBtn.addEventListener('click', () => {
      document.getElementById('uploadImage').click();
    });

    uploadInput.addEventListener('change', (event) => {
      const file = event.target.files[0];
      if (file) {
        this.#imageBlob = file;
        this.#view.showPreview(URL.createObjectURL(file));
      }
    });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.#lat = position.coords.latitude;
        this.#lon = position.coords.longitude;

        document.getElementById('latitude').value = this.#lat.toFixed(6);
        document.getElementById('longitude').value = this.#lon.toFixed(6);

        const map = L.map('map').setView([this.#lat, this.#lon], 15);

        const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
        }).addTo(map);

        const mapTilerLayer = L.tileLayer(
          'https://api.maptiler.com/maps/basic/{z}/{x}/{y}.png?key=eRUXFp7FMvqpNnh7Gbgb',
          {
            attribution:
              'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          },
        );

        const baseLayers = {
          OpenStreetMap: osmLayer,
          MapTiler: mapTilerLayer,
        };

        L.control.layers(baseLayers).addTo(map);

        const marker = L.marker([this.#lat, this.#lon], { draggable: true }).addTo(map);
        marker.bindPopup('Lokasi Sekarang').openPopup();

        marker.on('dragend', (e) => {
          const position = marker.getLatLng();
          this.#lat = position.lat;
          this.#lon = position.lng;
          document.getElementById('latitude').value = this.#lat.toFixed(6);
          document.getElementById('longitude').value = this.#lon.toFixed(6);
        });
        map.on('click', (e) => {
          const { lat, lng } = e.latlng;
          this.#lat = lat;
          this.#lon = lng;
          marker.setLatLng([lat, lng]);
          document.getElementById('latitude').value = lat.toFixed(6);
          document.getElementById('longitude').value = lng.toFixed(6);
        });
      },
      (err) => {
        console.error('Gagal ambil lokasi:', err);
      },
    );

    document.getElementById('add-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.submitForm();
    });
    
    window.addEventListener('hashchange', () => {
      this.#camera.stop();
    });
  }

  async submitForm() {
    const { description } = this.#view.getFormData();

    if (!this.#imageBlob) {
      this.#view.showMessage('Foto belum diambil!');
      return;
    }

    if (!this.lottieLoaded) {
      lottie.loadAnimation({
        container: document.getElementById('lottie-loader'),
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: 'https://assets10.lottiefiles.com/packages/lf20_usmfx6bp.json',
      });
      this.lottieLoaded = true;
    }

    this.#view.showLoading();

    try {
      const result = await postNewStory({
        description: `${description}`,
        photoFile: this.#imageBlob,
        lat: this.#lat,
        lon: this.#lon,
      });

      if (result.ok && !result.error) {
        this.#view.showMessage('Laporan berhasil dikirim!');
        setTimeout(() => {
          window.location.href = '#/';
        }, 1000);
      } else {
        throw new Error(result.message || 'Gagal kirim laporan');
      }
    } catch (error) {
      console.error('Gagal submit:', error.message);
      this.#view.showMessage('Gagal kirim laporan!');
    } finally {
      this.#view.hideLoading();
    }
  }
}
