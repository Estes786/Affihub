// Fungsi untuk melacak klik afiliasi
function trackAffiliateClick(platform, productName, productId) {
  // Kirim event ke Google Analytics
  gtag('event', 'affiliate_click', {
    'event_category': 'Affiliate',
    'event_label': platform,
    'affiliate_platform': platform,
    'product_name': productName,
    'product_id': productId
  });
  console.log('Affiliate click tracked:', platform, productName, productId); // Added for debugging
}
