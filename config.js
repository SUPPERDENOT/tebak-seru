// ===== konfigurasi =====
// Isi dengan OAuth Client ID dari Google Cloud Console (lihat README). Kosong = login Google nonaktif.
const CLOUD_CONFIG = {
    googleClientId: '594405685143-glj7289usnjh93fcpa0i87vojginavuu.apps.googleusercontent.com'
};

// Mabar Online: isi dengan URL aplikasi web Google Apps Script (lihat README). Kosong = Mabar nonaktif.
const MABAR_CONFIG = {
    gasUrl: 'https://script.google.com/macros/s/AKfycbwV6oTAkj4ToCLftGxHsICsSYODo7WtvG0n-QFwTN-vFbm5yrehxcaFCTiFGWJEas5t/exec'
};

// Daftar mode game. Ubah nama/deskripsi di sini. racers = jumlah pembalap di lintasan (pemain + bot).
const GAME_MODES = [
    { id: 'latihan', title: 'Latihan', desc: 'Santai tanpa tekanan. Soal yang salah diulang sampai benar semua.', mode: 'santai', racers: 4, icon: '🎯', grad: 'from-emerald-400 to-teal-500', tag: 'Santai' },
    { id: 'lomba4', title: 'Lomba Klasik', desc: 'Kamu melawan 3 bot. Siapa cepat, dia juara!', mode: 'lomba', racers: 4, icon: '🏁', grad: 'from-amber-400 to-orange-500', tag: 'Klasik' },
    { id: 'duel', title: 'Duel x2', desc: 'Adu cepat satu lawan satu.', mode: 'lomba', racers: 2, icon: '⚔️', grad: 'from-sky-400 to-blue-600', tag: 'x2' },
    { id: 'balap5', title: 'Balap x5', desc: '5 pembalap berebut garis finish.', mode: 'lomba', racers: 5, icon: '🏆', grad: 'from-fuchsia-400 to-purple-600', tag: 'x5' },
    { id: 'gp10', title: 'Grand Prix x10', desc: '10 pembalap di lintasan lebar. Rebutan juara!', mode: 'lomba', racers: 10, icon: '🔥', grad: 'from-rose-500 to-red-600', tag: 'x10' }
];
