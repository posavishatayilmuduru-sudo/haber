# 📰 Gündem Radar - Cloudflare Pages Edition

## 🚀 Cloudflare Pages'e Deploy Etme

### Yöntem 1: GitHub üzerinden (ÖNERİLEN)

1. **GitHub Repo Oluştur**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/KULLANICI_ADIN/gundem-radar.git
   git push -u origin main
   ```

2. **Cloudflare Pages'e Bağla**
   - https://dash.cloudflare.com/ giriş yap
   - Workers & Pages → Create Application → Pages → Connect to Git
   - GitHub repo'nu seç
   - Build ayarları:
     - Build command: (boş bırak)
     - Build output directory: /
     - Deploy et

3. **Domain Ayarları (İsteğe Bağlı)**
   - Custom domains → Add domain
   - DNS ayarlarını yap

### Yöntem 2: Wrangler CLI ile (Hızlı Test)

```bash
npm install -g wrangler
wrangler pages deploy . --project-name=gundem-radar
```

### Yöntem 3: Drag & Drop (En Kolay)

1. Bu klasörü ZIP'le
2. https://dash.cloudflare.com/pages → Upload assets
3. ZIP'i sürükle bırak

## ✅ Özellikler

- ✅ **API Key Entegrasyonu**: NewsAPI.org API key otomatik entegre
- ✅ **SEO Optimize**: Meta tags, Open Graph, Twitter Cards
- ✅ **Modern Tasarım**: Glassmorphism, gradients, animasyonlar
- ✅ **Responsive**: Mobil, tablet, desktop uyumlu
- ✅ **Performance**: Lazy loading, caching, optimizasyon
- ✅ **Accessibility**: ARIA labels, semantic HTML
- ✅ **Security Headers**: XSS, clickjacking koruması
- ✅ **5 Kategori**: Trend, Dünya, Ekonomi, Spor, Teknoloji
- ✅ **Otomatik Güncelleme**: Her 10 dakikada bir
- ✅ **Breaking News Ticker**: Canlı haber akışı
- ✅ **Cache System**: API isteklerini azaltır
- ✅ **Dark Mode**: Sistem tercihine göre otomatik

## 📊 Dosya Yapısı

```
gundem-radar/
├── index.html          # Ana sayfa (SEO optimize)
├── style.css           # Modern CSS (Glassmorphism)
├── app.js              # JavaScript (API entegrasyonu)
├── _headers            # Cloudflare security headers
├── _redirects          # Cloudflare redirect kuralları
├── robots.txt          # SEO crawler ayarları
├── sitemap.xml         # Google sitemap
└── README.md           # Bu dosya
```

## 🔧 Özelleştirmeler

### API Key Değiştirme

`app.js` dosyasında:

```javascript
const CONFIG = {
    NEWS_API_KEY: 'SENIN_API_KEYIN', // Buraya yeni key
    // ...
};
```

### Kategori Ekleme/Çıkarma

`app.js` dosyasında `CATEGORIES` dizisine ekle:

```javascript
{
    id: 'health-news',
    query: 'health OR medical OR sağlık',
    label: 'Sağlık'
}
```

`index.html` dosyasına da ilgili section'ı ekle.

### Renk Teması Değiştirme

`style.css` dosyasında `:root` değişkenlerini düzenle:

```css
:root {
    --primary-gradient: linear-gradient(135deg, #SENIN_RENGIN 0%, #DIGER_RENGIN 100%);
}
```

### Güncelleme Süresini Değiştirme

`app.js` dosyasında:

```javascript
const CONFIG = {
    UPDATE_INTERVAL: 300000, // 5 dakika (milisaniye cinsinden)
};
```

## 💰 Gelir Optimizasyonu

### Google AdSense Ekleme

1. https://www.google.com/adsense/ başvur
2. Onay sonrası reklam kodunu al
3. `index.html` dosyasındaki `<div class="ad-placeholder">` alanlarına yapıştır

### Örnek AdSense Kodu:

```html
<aside class="ad-space ad-top">
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXX"
     crossorigin="anonymous"></script>
    <ins class="adsbygoogle"
         style="display:block"
         data-ad-client="ca-pub-XXXXXXXX"
         data-ad-slot="XXXXXXXXXX"
         data-ad-format="auto"></ins>
    <script>
         (adsbygoogle = window.adsbygoogle || []).push({});
    </script>
</aside>
```

## 📈 Google Analytics Ekleme

`index.html` dosyasının sonundaki yorum satırını aç:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
</script>
```

## 🔍 SEO İpuçları

1. **Google Search Console'a Ekle**
   - https://search.google.com/search-console
   - Site ekle, sitemap.xml'i gönder

2. **Backlink Oluştur**
   - Sosyal medyada paylaş
   - Forum ve bloglara yorum yap
   - Guest post yaz

3. **İçerik Optimizasyonu**
   - Başlıkları keyword odaklı yap
   - Meta description düzenle
   - Alt text ekle

## ⚡ Performance İpuçları

1. **Cloudflare CDN**: Otomatik aktif
2. **Caching**: `_headers` dosyasında yapılandırılmış
3. **Image Lazy Loading**: Zaten aktif
4. **Minification**: Cloudflare otomatik yapıyor

## 🛡️ Güvenlik

- ✅ HTTPS zorunlu
- ✅ XSS koruması
- ✅ Clickjacking koruması
- ✅ Content Security Policy
- ✅ CORS ayarları

## 📱 PWA Yapma (İsteğe Bağlı)

1. `manifest.json` oluştur
2. Service Worker ekle
3. `index.html` head'e link ekle

## 🐛 Sorun Giderme

**Haberler gelmiyor:**
- API key'i kontrol et
- Browser console'u aç (F12)
- Network tab'inde API isteklerini kontrol et
- NewsAPI limitini kontrol et (günde 100 istek)

**Site yavaş:**
- Cloudflare cache ayarlarını kontrol et
- Image optimization aç
- Minification aktif mi kontrol et

**Reklam gösterilmiyor:**
- AdSense onayı bekle (1-2 hafta)
- ads.txt dosyası ekle
- Trafik yeterli mi kontrol et

## 📞 Destek

Sorun yaşarsan:
1. GitHub Issues'a yaz
2. Cloudflare Community Forum'a sor
3. NewsAPI dokümantasyonunu oku

## 🎯 Gelecek Özellikler (TO-DO)

- [ ] PWA desteği
- [ ] Dark/Light mode toggle
- [ ] Favori haberler
- [ ] Paylaşım butonları
- [ ] Email newsletter
- [ ] RSS feed
- [ ] Arama özelliği
- [ ] Kategori filtreleme

---

**Başarılar! 🚀**

Site: https://gundemradar.pages.dev (deploy sonrası)
