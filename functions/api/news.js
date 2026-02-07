export async function onRequest() {
  const feeds = [
    'https://www.ntv.com.tr/gundem.rss',
    'https://www.hurriyet.com.tr/rss/gundem',
    'https://www.trthaber.com/sondakika_articles.rss'
  ];

  const parser = new DOMParser();
  let items = [];

  for (const url of feeds) {
    const res = await fetch(url);
    const text = await res.text();
    const xml = parser.parseFromString(text, "text/xml");
    const news = [...xml.querySelectorAll("item")].slice(0,5).map(i => ({
      title: i.querySelector("title")?.textContent,
      link: i.querySelector("link")?.textContent,
      source: url,
      time: i.querySelector("pubDate")?.textContent
    }));
    items.push(...news);
  }

  items.sort((a,b)=> new Date(b.time)-new Date(a.time));

  return new Response(JSON.stringify(items.slice(0,20)), {
    headers: { 'Content-Type': 'application/json' }
  });
}
