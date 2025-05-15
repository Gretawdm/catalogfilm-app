class NotFoundPage {
  async render() {
    return `
      <section class="not-found">
        <h2>404 - Halaman Tidak Ditemukan</h2>
        <p>Oops! Halaman yang kamu cari tidak tersedia.</p>
      </section>
    `;
  }

  async afterRender() {
   
  }
}

export default NotFoundPage;
