// Cloudflare Worker - API Proxy
// Bu dosya Cloudflare Pages Functions olarak çalışacak

export async function onRequest(context) {
    const { request } = context;
    const url = new URL(request.url);
    const query = url.searchParams.get('q') || 'news';
    
    // NewsAPI key
    const API_KEY = 'b56562cfcedb405e93435b3bbfade5de';
    
    // NewsAPI URL
    const apiUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=6&apiKey=${API_KEY}`;
    
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        return new Response(JSON.stringify(data), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Cache-Control': 'public, max-age=300' // 5 dakika cache
            }
        });
    } catch (error) {
        return new Response(JSON.stringify({ 
            status: 'error',
            message: 'API isteği başarısız',
            error: error.message 
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        });
    }
}
