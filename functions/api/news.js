export async function onRequest() {
  return new Response(
    JSON.stringify([
      {
        title: "API ÇALIŞIYOR ✅",
        link: "https://haber-1dl.pages.dev",
        source: "Cloudflare Pages",
        time: new Date().toISOString()
      },
      {
        title: "Haber sistemi aktif",
        link: "https://pages.cloudflare.com",
        source: "Test",
        time: new Date().toISOString()
      }
    ]),
    {
      headers: {
        "Content-Type": "application/json"
      }
    }
  );
}
