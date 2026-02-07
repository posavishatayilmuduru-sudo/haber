export async function onRequest() {
  const feeds = [
    'https://www.ntv.com.tr/gundem.rss',
    'https://www.hurriyet.com.tr/rss/gundem',
    'https://www.trthaber.com/sondakika_articles.rss'
  ];

  let items = [];

  for (const url of feeds) {
    const res = await fetch(url);
    const text = await res.text();

    const entries = text.split('<item>').slice(1, 6);

    for (const entry of entries) {
      const get = (tag) => {
        const match = entry.match(new RegExp(`<${tag}>(.*?)</${tag}>`, 's'));
        return match ? match[1].trim() : '';
      };

      items.push({
        title: get('title'),
        link: get('link'),
        source: url.includes('ntv') ? 'NTV' :
                url.includes('hurriyet') ? 'Hürriyet' : 'TRT Haber',
        time: get('pubDate')
      });
    }
  }

  return new Response(JSON.stringify(items.slice(0, 20)), {
    headers: { 'Content-Type': 'application/json' }
  });
}
