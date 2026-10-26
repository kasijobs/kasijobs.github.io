/* KasiJobs service worker.
   Deliberately does NOT cache anything: listings must always be live and a
   stale copy of the page must never get stuck on someone's phone.
   It only lets the site count as an installable app, and shows a friendly
   message instead of a browser error when there is no data or Wi-Fi. */

var OFFLINE_HTML =
  '<!doctype html><html lang="en"><head><meta charset="utf-8">' +
  '<meta name="viewport" content="width=device-width, initial-scale=1">' +
  '<meta name="theme-color" content="#1C1A16"><title>KasiJobs</title>' +
  '<style>body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;' +
  'background:#1C1A16;color:#F5EFE0;font-family:system-ui,sans-serif;text-align:center;padding:24px}' +
  'h1{font-size:2rem;margin:0 0 12px}p{color:#C9C2B4;line-height:1.5;margin:0 0 20px}' +
  'button{background:#E8A93D;color:#1C1A16;border:0;border-radius:6px;padding:12px 20px;' +
  'font-weight:800;font-size:1rem;font-family:inherit}</style></head><body><div>' +
  '<h1>KasiJobs</h1><p>No connection right now.<br>Switch on data or Wi-Fi and try again.</p>' +
  '<button onclick="location.reload()">Try again</button></div></body></html>';

self.addEventListener('install', function () {
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', function (event) {
  var req = event.request;
  // Posting a listing and anything else that isn't a plain read goes straight through.
  if (req.method !== 'GET') return;
  if (req.cache === 'only-if-cached' && req.mode !== 'same-origin') return;

  event.respondWith(
    fetch(req).catch(function () {
      if (req.mode === 'navigate') {
        return new Response(OFFLINE_HTML, {
          status: 200,
          headers: { 'Content-Type': 'text/html; charset=utf-8' }
        });
      }
      return Response.error();
    })
  );
});
