const C='ts-1',F=['./','index.html','style.css','app.js','soal.js','skor.js','koneksi.js','suara.js','editor-soal.js','pustaka.js','avatar.js','pr.js','profil.js','laporan.js','nama.js','lobi.js','impor.js','mini.js','memori.js','hitung.js','dino.js','tema.js','baca.js','maskot.js','reaksi.js','soal-contoh.json'];
self.addEventListener('install',e=>e.waitUntil(caches.open(C).then(c=>c.addAll(F))));
self.addEventListener('fetch',e=>e.respondWith(fetch(e.request).catch(()=>caches.match(e.request))));
