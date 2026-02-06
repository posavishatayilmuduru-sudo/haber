/* ==============================================
   GÜNDEM RADAR - JAVASCRIPT
   Cloudflare Pages için optimize edilmiş
   ============================================== */

// API Configuration
const CONFIG = {
    NEWS_API_KEY: 'b56562cfcedb405e93435b3bbfade5de',
    NEWS_API_URL: 'https://newsapi.org/v2/everything',
    UPDATE_INTERVAL: 600000, // 10 dakika
    RETRY_DELAY: 5000, // 5 saniye
    MAX_RETRIES: 3
};

// Categories Configuration
const CATEGORIES = [
    { 
        id: 'trending-news', 
        query: 'Turkey OR Türkiye OR trending OR viral',
        label: 'Trend Haberler'
    },
    { 
        id: 'world-news', 
        query: 'world news OR international OR global',
        label: 'Dünya Haberleri'
    },
    { 
        id: 'business-news', 
        query: 'business OR economy OR finance OR borsa',
        label: 'Ekonomi'
    },
    { 
        id: 'sports-news', 
        query: 'sports OR football OR basketball OR spor',
        label: 'Spor'
    },
    { 
        id: 'tech-news', 
        query: 'technology OR AI OR innovation OR teknoloji',
        label: 'Teknoloji'
    }
];

// State Management
let state = {
    loading: {},
    cache: {},
    lastUpdate: null,
    retryCount: {}
};

/* ==============================================
   CORE FUNCTIONS
   ============================================== */

/**
 * Ana haber yükleme fonksiyonu
 */
async function loadNews() {
    console.log('📰 Haberler yükleniyor...');
    updateTimestamp();
    
    // Tüm kategorileri paralel olarak yükle
    const promises = CATEGORIES.map(category => loadCategoryNews(category));
    
    try {
        await Promise.all(promises);
        console.log('✅ Tüm haberler yüklendi');
        state.lastUpdate = new Date();
        updateTimestamp();
    } catch (error) {
        console.error('❌ Haber yükleme hatası:', error);
    }
}

/**
 * Tek bir kategori için haberleri yükle
 */
async function loadCategoryNews(category, retryCount = 0) {
    const container = document.getElementById(category.id);
    if (!container) return;
    
    // Loading state
    state.loading[category.id] = true;
    
    // Cache kontrolü (5 dakikadan yeni ise cache'ten dön)
    const cached = state.cache[category.id];
    if (cached && (Date.now() - cached.timestamp < 300000)) {
        displayNews(container, cached.data, category);
        state.loading[category.id] = false;
        return;
    }
    
    try {
        const news = await fetchNews(category.query);
        
        if (news && news.length > 0) {
            // Cache'e kaydet
            state.cache[category.id] = {
                data: news,
                timestamp: Date.now()
            };
            
            displayNews(container, news, category);
            state.retryCount[category.id] = 0;
        } else {
            throw new Error('Haber bulunamadı');
        }
    } catch (error) {
        console.error(`❌ ${category.label} yüklenemedi:`, error);
        
        // Retry logic
        if (retryCount < CONFIG.MAX_RETRIES) {
            console.log(`🔄 Tekrar deneniyor (${retryCount + 1}/${CONFIG.MAX_RETRIES})...`);
            setTimeout(() => {
                loadCategoryNews(category, retryCount + 1);
            }, CONFIG.RETRY_DELAY);
        } else {
            displayError(container, category.label);
        }
    } finally {
        state.loading[category.id] = false;
    }
}

/**
 * API'den haber çek - Cloudflare Worker Proxy kullanarak
 */
async function fetchNews(query) {
    // Cloudflare Pages Function endpoint
    const url = `/api/news?q=${encodeURIComponent(query)}`;
    
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.status === 'error') {
            throw new Error(data.message || 'API hatası');
        }
        
        return data.articles || [];
    } catch (error) {
        console.error('API Fetch hatası:', error);
        throw error;
    }
}

/**
 * Haberleri ekranda göster
 */
function displayNews(container, articles, category) {
    if (!articles || articles.length === 0) {
        displayError(container, category.label);
        return;
    }
    
    const html = articles.map((article, index) => {
        const imageUrl = article.urlToImage || getPlaceholderImage(index);
        const title = sanitizeHTML(article.title || 'Başlık yok');
        const description = sanitizeHTML(article.description || 'Açıklama yok');
        const source = sanitizeHTML(article.source?.name || 'Kaynak belirtilmemiş');
        const time = formatTime(article.publishedAt);
        const url = article.url || '#';
        
        return `
            <article class="news-card" 
                     onclick="openArticle('${escapeHTML(url)}')"
                     role="listitem"
                     data-index="${index}"
                     style="animation-delay: ${index * 0.1}s">
                <img src="${imageUrl}" 
                     alt="${title}"
                     loading="lazy"
                     onerror="this.src='${getPlaceholderImage(index)}'">
                <div class="news-card-content">
                    <h3>${truncate(title, 100)}</h3>
                    <p>${truncate(description, 150)}</p>
                    <div class="news-meta">
                        <span class="news-source">${source}</span>
                        <span class="news-time">${time}</span>
                    </div>
                </div>
            </article>
        `;
    }).join('');
    
    container.innerHTML = html;
    updateBreakingNews(articles);
}

/**
 * Hata mesajı göster
 */
function displayError(container, categoryLabel) {
    container.innerHTML = `
        <div class="error" role="alert">
            <p>⚠️ ${categoryLabel} kategorisi için haberler yüklenemedi.</p>
            <button onclick="refreshCategory('${container.id}')" class="retry-btn">
                🔄 Tekrar Dene
            </button>
        </div>
    `;
}

/**
 * Breaking news ticker'ı güncelle
 */
function updateBreakingNews(articles) {
    const breakingContent = document.getElementById('breakingContent');
    if (!breakingContent || !articles || articles.length === 0) return;
    
    const headlines = articles
        .slice(0, 3)
        .map(article => sanitizeHTML(article.title))
        .join(' • ');
    
    breakingContent.textContent = headlines;
}

/* ==============================================
   UTILITY FUNCTIONS
   ============================================== */

/**
 * Metni güvenli hale getir (XSS koruması)
 */
function sanitizeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

/**
 * HTML karakterlerini escape et
 */
function escapeHTML(str) {
    return str.replace(/[&<>"']/g, char => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    })[char]);
}

/**
 * Metni belirli uzunlukta kırp
 */
function truncate(str, length) {
    if (!str) return '';
    if (str.length <= length) return str;
    return str.substring(0, length).trim() + '...';
}

/**
 * Zamanı okunabilir formata çevir
 */
function formatTime(dateString) {
    if (!dateString) return 'Bilinmiyor';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) return 'Az önce';
    if (diffMins < 60) return `${diffMins} dakika önce`;
    if (diffHours < 24) return `${diffHours} saat önce`;
    if (diffDays < 7) return `${diffDays} gün önce`;
    
    return date.toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
}

/**
 * Placeholder görsel URL'i oluştur
 */
function getPlaceholderImage(index) {
    const colors = ['667eea', '764ba2', 'f093fb', 'f5576c', 'fbc2eb', '89f7fe'];
    const color = colors[index % colors.length];
    return `https://via.placeholder.com/400x250/${color}/ffffff?text=Haber+Görseli`;
}

/**
 * Son güncelleme zamanını göster
 */
function updateTimestamp() {
    const element = document.getElementById('lastUpdate');
    if (!element) return;
    
    if (state.lastUpdate) {
        const time = state.lastUpdate.toLocaleTimeString('tr-TR', {
            hour: '2-digit',
            minute: '2-digit'
        });
        element.textContent = `Son güncelleme: ${time}`;
    } else {
        element.textContent = 'Güncelleniyor...';
    }
}

/**
 * Makaleyi yeni sekmede aç
 */
function openArticle(url) {
    if (url && url !== '#') {
        window.open(url, '_blank', 'noopener,noreferrer');
    }
}

/**
 * Tek bir kategoriyi yenile
 */
window.refreshCategory = function(categoryId) {
    const category = CATEGORIES.find(cat => cat.id === categoryId);
    if (category) {
        console.log(`🔄 ${category.label} yenileniyor...`);
        loadCategoryNews(category);
    }
};

/* ==============================================
   BACK TO TOP BUTTON
   ============================================== */

function initBackToTop() {
    const button = document.getElementById('backToTop');
    if (!button) return;
    
    // Scroll event listener
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            if (window.scrollY > 300) {
                button.classList.add('visible');
            } else {
                button.classList.remove('visible');
            }
        }, 100);
    }, { passive: true });
    
    // Click event
    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* ==============================================
   PERFORMANCE MONITORING
   ============================================== */

function logPerformance() {
    if ('performance' in window) {
        const perfData = performance.getEntriesByType('navigation')[0];
        if (perfData) {
            console.log('📊 Sayfa Performansı:', {
                'DNS Lookup': `${perfData.domainLookupEnd - perfData.domainLookupStart}ms`,
                'TCP': `${perfData.connectEnd - perfData.connectStart}ms`,
                'DOM Ready': `${perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart}ms`,
                'Load Time': `${perfData.loadEventEnd - perfData.loadEventStart}ms`
            });
        }
    }
}

/* ==============================================
   SERVICE WORKER (PWA SUPPORT)
   ============================================== */

function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('✅ Service Worker kayıtlı:', reg.scope))
            .catch(err => console.log('❌ Service Worker hatası:', err));
    }
}

/* ==============================================
   INITIALIZATION
   ============================================== */

// DOM ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Gündem Radar başlatılıyor...');
    
    // İlk yükleme
    loadNews();
    
    // Back to top button
    initBackToTop();
    
    // Otomatik güncelleme (10 dakikada bir)
    setInterval(loadNews, CONFIG.UPDATE_INTERVAL);
    
    // Performance log
    window.addEventListener('load', logPerformance);
    
    // Service Worker (PWA)
    // registerServiceWorker(); // İsterseniz aktif edin
    
    console.log('✅ Site hazır!');
});

// Page visibility change (sayfa tekrar görünür olduğunda güncelle)
document.addEventListener('visibilitychange', () => {
    if (!document.hidden && state.lastUpdate) {
        const timeSinceUpdate = Date.now() - state.lastUpdate.getTime();
        // 5 dakikadan fazla geçmişse güncelle
        if (timeSinceUpdate > 300000) {
            console.log('🔄 Sayfa aktif, haberler güncelleniyor...');
            loadNews();
        }
    }
});

// Error handling
window.addEventListener('error', (event) => {
    console.error('❌ Global hata:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('❌ Promise hatası:', event.reason);
});

// Export for debugging
if (typeof window !== 'undefined') {
    window.GundemRadar = {
        state,
        CONFIG,
        CATEGORIES,
        loadNews,
        refreshCategory: window.refreshCategory
    };
}
