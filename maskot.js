const Maskot={C:[{n:'Kenzie',e:'🦁'},{n:'Shaqeel',e:'🐼'}],
K:{benar:['Hebat sekali!','Kamu pintar!','Yeay, tepat sekali!','Keren banget!'],salah:['Tidak apa-apa, coba lagi ya!','Hampir bisa kok!','Semangat! Salah itu belajar.'],
habis:['Yah, waktunya habis. Lain kali lebih cepat ya!','Ayo semangat, soal berikutnya pasti bisa!'],juara:['Selamat, kamu juara!','Luar biasa!'],ikut:['Seru sekali! Main lagi yuk!']},
pasang(sel,s){const c=this.C[Math.random()*2|0],a=this.K[s],k=a[Math.random()*a.length|0];
$(sel).innerHTML=`<div class="mask"><span class="mk">${c.e}</span><span class="bubble"><b>${c.n}</b>${k}</span></div>`;}};
