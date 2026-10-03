// ========================================================================
// IndexNow — tell Bing (and Yandex, Seznam, Naver…) about our pages
// ========================================================================
// Runs after every deploy (see .github/workflows/deploy.yml). Reads the
// live sitemap and submits every URL in one request, so new and changed
// pages get crawled within hours instead of weeks.
//
// The key below must match the file public/<key>.txt on the live site —
// that file is how search engines know these pings really come from us.
// Run by hand any time:  node scripts/indexnow.mjs
// ========================================================================

const SITE = 'https://www.apicare.co.in';
const KEY = '92d068f5e90be0b9f7e312551d1c3d2a';

async function sitemapUrls(url) {
  const xml = await (await fetch(url)).text();
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  // A sitemap index lists more sitemaps — follow them.
  if (xml.includes('<sitemapindex')) {
    return (await Promise.all(locs.map(sitemapUrls))).flat();
  }
  return locs;
}

const urlList = await sitemapUrls(`${SITE}/sitemap-index.xml`);
if (urlList.length === 0) throw new Error('No URLs found in the live sitemap');

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({
    host: new URL(SITE).host,
    key: KEY,
    keyLocation: `${SITE}/${KEY}.txt`,
    urlList,
  }),
});

// 200 = accepted, 202 = accepted and the key is still being verified
console.log(`IndexNow: submitted ${urlList.length} URLs → HTTP ${res.status}`);
if (res.status >= 400) {
  console.error(await res.text());
  process.exit(1);
}
