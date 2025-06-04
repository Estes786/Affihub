// Fungsi untuk melacak klik afiliasi
function trackAffiliateClick(platform, productName, productId) {
  // Pastikan gtag tersedia sebelum memanggilnya (jika menggunakan Google Analytics)
  if (typeof gtag === 'function') {
    gtag('event', 'affiliate_click', {
      'event_category': 'Affiliate',
      'event_label': platform, // Menggunakan platform sebagai label event
      'affiliate_platform': platform,
      'product_name': productName,
      'product_id': productId,
    });
  } else {
    console.warn('gtag function not found. Google Analytics might not be loaded.');
  }
  // Tetap log ke console untuk debugging
  console.log(`Affiliate click tracked: Platform=${platform}, Product=${productName} (ID: ${productId})`);
}

// Event Listener untuk klik link afiliasi
document.addEventListener('DOMContentLoaded', function() {
  const productDetailContainer = document.querySelector('.product-detail .container');

  if (productDetailContainer) {
    // Gunakan event delegation untuk menangani klik pada link yang mungkin ditambahkan secara dinamis
    productDetailContainer.addEventListener('click', function(event) {
      // Cari elemen link terdekat yang memiliki data-platform (baik statis maupun dinamis)
      const affiliateLink = event.target.closest('a[data-platform]');

      if (affiliateLink) {
        // Dapatkan data dari atribut data-*
        const platform = affiliateLink.dataset.platform;
        const productId = affiliateLink.dataset.productId;
        const productName = affiliateLink.dataset.productName;

        // Pastikan semua data ada sebelum tracking
        if (platform && productId && productName) {
          trackAffiliateClick(platform, productName, productId);
          
          // Optional: Tambahkan delay kecil sebelum navigasi jika diperlukan
          // (Biasanya tidak perlu jika target="_blank")
        } else {
          console.warn('Missing data attributes for affiliate tracking on clicked element:', affiliateLink);
        }
      }
    });
  }
});
