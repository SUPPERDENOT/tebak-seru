const Maskot={E:['🦁','🐼'],
K:{benar:['Hebat sekali, {n}!','Kamu pintar sekali, {n}!','Yeay, tepat sekali!','Keren banget, {n}!'],salah:['Tidak apa-apa, {n}. Coba lagi ya!','Hampir bisa kok!','Semangat, {n}! Salah itu belajar.'],
habis:['Yah, waktunya habis. Lain kali lebih cepat ya, {n}!','Ayo semangat, soal berikutnya pasti bisa!'],juara:['Selamat, {n}, kamu juara!','Luar biasa, {n}!'],ikut:['Seru sekali, {n}! Main lagi yuk!']},
pasang(sel,s,nama){const e=this.E[Math.random()*2|0],a=this.K[s],k=a[Math.random()*a.length|0],n=String(nama||'').trim();
const t=n?k.replace('{n}',n):k.replace(/,?\s*\{n\}/,'');
$(sel).innerHTML=`<div class="mask"><span class="mk">${e}</span><span class="bubble">${esc(t)}</span></div>`;}};
