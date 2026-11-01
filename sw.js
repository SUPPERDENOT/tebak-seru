const C='ts-1',F=['./','index.html','css/style.css','js/app.js','js/soal.js','js/skor.js','js/koneksi.js','js/suara.js','js/editor-soal.js','js/pustaka.js','js/avatar.js','js/pr.js','js/laporan.js','js/minigame/mini.js','js/minigame/memori.js','js/minigame/hitung.js','js/tema.js','js/baca.js','js/maskot.js','js/reaksi.js','data/soal-contoh.json'];
self.addEventListener('install',e=>e.waitUntil(caches.open(C).then(c=>c.addAll(F))));
self.addEventListener('fetch',e=>e.respondWith(fetch(e.request).catch(()=>caches.match(e.request))));
