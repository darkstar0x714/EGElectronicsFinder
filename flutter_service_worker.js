'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"assets/AssetManifest.bin": "0b0a3415aad49b6e9bf965ff578614f9",
"assets/AssetManifest.json": "99914b932bd37a50b983c5e7c90ae93b",
"assets/FontManifest.json": "7b2a36307916a9721811788013e65289",
"assets/fonts/MaterialIcons-Regular.otf": "32fce58e2acb9c420eab0fe7b828b761",
"assets/NOTICES": "1c629b05e5e4d0fb9a536bb02a835255",
"assets/shaders/ink_sparkle.frag": "f8b80e740d33eb157090be4e995febdf",
"canvaskit/canvaskit.js": "bbf39143dfd758d8d847453b120c8ebb",
"canvaskit/canvaskit.wasm": "42df12e09ecc0d5a4a34a69d7ee44314",
"canvaskit/chromium/canvaskit.js": "96ae916cd2d1b7320fff853ee22aebb0",
"canvaskit/chromium/canvaskit.wasm": "be0e3b33510f5b7b0cc76cc4d3e50048",
"canvaskit/skwasm.js": "95f16c6690f955a45b2317496983dbe9",
"canvaskit/skwasm.wasm": "1a074e8452fe5e0d02b112e22cdcf455",
"canvaskit/skwasm.worker.js": "51253d3321b11ddb8d73fa8aa87d3b15",
"favicon.png": "7bb06072d09ef8c813f1706ef0f0a019",
"flutter.js": "6b515e434cea20006b3ef1726d2c8894",
"icons/android-icon-144x144.png": "8b56202763ff3cd739b4b2357c085a70",
"icons/android-icon-192x192.png": "fbc623a0d03dca0c3e6ad4278ff5c4bf",
"icons/android-icon-36x36.png": "7bb06072d09ef8c813f1706ef0f0a019",
"icons/android-icon-48x48.png": "a982e0e36e9b687431cab98db25a100d",
"icons/android-icon-72x72.png": "cfc73e77ea90c1c153edad7d505eca6e",
"icons/android-icon-96x96.png": "5b30d93564c42634eab67f26733d1dfd",
"icons/apple-icon-114x114.png": "47a8d8a300dd071053daec139ce48eba",
"icons/apple-icon-120x120.png": "10f844c89095d38a062d0a438bf11d95",
"icons/apple-icon-144x144.png": "8b56202763ff3cd739b4b2357c085a70",
"icons/apple-icon-152x152.png": "1717f5883b227d7efe8ea2aabe333a6a",
"icons/apple-icon-180x180.png": "bd8e67dcdcb88dc874cb4f14b9fa256b",
"icons/apple-icon-57x57.png": "cdb288fc4ba09a8f7efa6ecd735c873e",
"icons/apple-icon-60x60.png": "9c13e7a650438e9502cacaf055fad19d",
"icons/apple-icon-72x72.png": "cfc73e77ea90c1c153edad7d505eca6e",
"icons/apple-icon-76x76.png": "bdb91b6d0d2a07435ea99b76c4404b94",
"icons/apple-icon-precomposed.png": "83ddaff1023ff27f9f64c137c8ecb7e1",
"icons/apple-icon.png": "83ddaff1023ff27f9f64c137c8ecb7e1",
"icons/browserconfig.xml": "653d077300a12f09a69caeea7a8947f8",
"icons/favicon-16x16.png": "5cb1cf8607bdce4d66683e40acbecba4",
"icons/favicon-32x32.png": "03fb1cabd3e40f23b57e8a452122a837",
"icons/favicon-96x96.png": "5b30d93564c42634eab67f26733d1dfd",
"icons/favicon.ico": "e0ac7a5ddf6e5550b0202375a7954041",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"icons/manifest.json": "b58fcfa7628c9205cb11a1b2c3e8f99a",
"icons/ms-icon-144x144.png": "8b56202763ff3cd739b4b2357c085a70",
"icons/ms-icon-150x150.png": "2f6a63b49f2a215aa75d4f8bad3c2ac9",
"icons/ms-icon-310x310.png": "e27cd2b2ab6c6ceb1d60ca80463630c9",
"icons/ms-icon-70x70.png": "829480dfdd609126b9ef8da418307edd",
"index.html": "1cc6e66b2637c11413da1296c1fccf02",
"/": "1cc6e66b2637c11413da1296c1fccf02",
"main.dart.js": "ae773a7dd7382ad59912af04dceef0a3",
"manifest.json": "4f1854ca9c85f01241aa7c70da8885fc",
"version.json": "ff25d3a4b260084a745961f4af5997c4"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
