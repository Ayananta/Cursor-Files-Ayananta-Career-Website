const CACHE_NAME = 'ayananta-site-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/assets/css/style.css',
  '/assets/js/main.js',
  '/assets/images/profile.jpg'
];

self.addEventListener('install', function(event){
  event.waitUntil(caches.open(CACHE_NAME).then(function(cache){
    return cache.addAll(ASSETS);
  }));
});

self.addEventListener('activate', function(event){
  event.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.map(function(k){
      if (k !== CACHE_NAME) return caches.delete(k);
    }));
  }));
});

self.addEventListener('fetch', function(event){
  event.respondWith(
    caches.match(event.request).then(function(resp){
      return resp || fetch(event.request).then(function(response){
        const clone = response.clone();
        caches.open(CACHE_NAME).then(function(cache){
          cache.put(event.request, clone);
        });
        return response;
      }).catch(function(){
        return resp;
      })
    })
  );
});


