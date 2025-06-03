// Fungsi untuk memuat dan menampilkan link afiliasi dari data JSON
async function loadAffiliateLinks(productId) {
  try {
    // Dalam implementasi nyata, ini bisa diambil dari API atau file JSON
    const response = await fetch('/data/affiliate-links.json');
    const data = await response.json();
    
    // Cari produk berdasarkan ID
    const product = data.products.find(p => p.id === productId);
    
    if (!product) {
      console.error('Product not found');
      return;
    }
    
    // Dapatkan container untuk link afiliasi
    const container = document.querySelector('.multi-affiliate-block .affiliate-options');
    
    // Kosongkan container
    container.innerHTML = '';
    
    // Filter hanya link yang aktif
    const activeLinks = product.affiliate_links.filter(link => link.active);
    
    // Tampilkan setiap link afiliasi
    activeLinks.forEach(link => {
      // Buat URL lengkap dengan parameter UTM
      const fullUrl = link.url + (link.url.includes('?') ? '&' : '?') + link.utm_params;
      
      // Format harga
      const formattedPrice = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: link.currency,
        minimumFractionDigits: 0
      }).format(link.price);
      
      // ... kode sebelumnya ...

// Buat elemen link afiliasi
const affiliateCard = document.createElement('a');
affiliateCard.href = fullUrl;
affiliateCard.target = '_blank';
affiliateCard.rel = 'nofollow';

// --- PERUBAHAN DIMULAI DI SINI ---
// Tambahkan class yang dibutuhkan untuk tracking
affiliateCard.classList.add('affiliate-card', `affiliate-${link.platform.toLowerCase()}`, 'affiliate-link'); 

// Tambahkan atribut data untuk tracking
affiliateCard.dataset.platform = link.platform; // Ambil dari data JSON
affiliateCard.dataset.productId = productId; // Ambil dari data-product-id di HTML
// Untuk product name, kita bisa gunakan productId sementara, atau Anda bisa sesuaikan jika punya nama produk spesifik di JSON
affiliateCard.dataset.productName = productId; 
// --- PERUBAHAN SELESAI DI SINI ---

// Setel konten innerHTML (logo, nama platform, dll.)
affiliateCard.innerHTML = `
    <img src="${link.logo}" alt="${link.name}" class="affiliate-logo">
    <span class="affiliate-platform">${link.name}</span>
    <span class="affiliate-cta">Beli di ${link.name}</span>
`;

container.appendChild(affiliateCard);

// ... kode setelahnya ...

      `;
      
      container.appendChild(affiliateCard);
    });
    
  } catch (error) {
    console.error('Error loading affiliate links:', error);
  }
}

// Panggil fungsi saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
  // Dapatkan ID produk dari URL atau atribut data di halaman
  const productId = document.querySelector('[data-product-id]').dataset.productId;
  
  if (productId) {
    loadAffiliateLinks(productId);
  }
});
