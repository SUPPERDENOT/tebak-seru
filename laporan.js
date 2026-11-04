const Lap={K:'tebakseru-lap',tb:0,
semua(){try{return JSON.parse(localStorage.getItem(this.K))||[];}catch(e){return [];}},
tulis(a){try{localStorage.setItem(this.K,JSON.stringify(a));}catch(e){}},
simpan(r){const a=this.semua();a.unshift(r);this.tulis(a.slice(0,50));},
buka(){if(location.hash!=='#host')return;show('s-laporan');this.tab(0);},
pct(b,n){return n?Math.round(b/n*100):0;},
tab(n){this.tb=n;document.querySelectorAll('#lapTab button.t').forEach((e,i)=>e.classList.toggle('on',i===n));[()=>this.daftar(),()=>this.rekap(),()=>this.tersulit()][n]();},
menang(tm){return tm[0]===tm[1]?'Seri':TIM[tm[0]>tm[1]?0:1].e+' '+TIM[tm[0]>tm[1]?0:1].n+' menang';},
daftar(){const a=this.semua();
$('#lapIsi').innerHTML=a.map((r,i)=>{const tb=r.p.reduce((s,x)=>s+x.b,0),rata=this.pct(tb,r.p.length*r.q.length);
return `<div class="kk lap" onclick="Lap.detail(${i})"><div class="kb"><b>${esc(r.j||'Kuis')}</b><small>${new Date(r.t).toLocaleString('id-ID')} · ${r.p.length} peserta · rata-rata benar ${rata}%${r.tm?' · '+this.menang(r.tm):''}</small></div></div>`;}).join('')||'<p>Belum ada laporan. Laporan dibuat otomatis setiap game selesai.</p>';},
detail(i){const r=this.semua()[i];if(!r)return;const q=r.q.map(x=>({...x,c:this.pct(x.b,x.n)})).sort((a,b)=>a.c-b.c);
$('#lapIsi').innerHTML=`<button class="kecil" onclick="Lap.daftar()">← Semua laporan</button><h2>${esc(r.j||'Kuis')}</h2><p>${new Date(r.t).toLocaleString('id-ID')}</p>
<div class="aksi"><button class="main" onclick="Lap.csv(${i})">⬇ Ekspor ke Excel</button><button onclick="Lap.hapus(${i})">🗑 Hapus</button></div>
${r.tm?`<div class="timbar">${TIM.map((t,k)=>`<div style="background:${t.c}">${t.e} ${t.n}<b>${r.tm[k]}</b></div>`).join('')}</div><p><b>${this.menang(r.tm)}</b></p>`:''}
<h3>Nilai peserta</h3><table class="tbl"><tr><th>#</th><th>Nama</th><th>Skor</th><th>Benar</th></tr>${r.p.map((p,k)=>`<tr><td>${k+1}</td><td>${Avatar.html(p.a,26)} ${p.m!=null&&TIM[p.m]?TIM[p.m].e+' ':''}${esc(p.n)}</td><td>${p.s}</td><td>${p.b} / ${r.q.length}</td></tr>`).join('')}</table>
${q.length?`<h3>Soal yang paling sering salah</h3>${q.map(x=>`<div class="sb"><span>${esc(x.t)}</span><div class="bt"><i style="width:${x.c}%"></i></div><small>${x.c}% benar (${x.b} dari ${x.n})</small></div>`).join('')}`:''}
${(r.pl||[]).length?`<h3>Hasil survei</h3>${r.pl.map(s=>{const tot=s.h.reduce((m,n)=>m+n,0);return `<div class="sb"><span>${esc(s.t)}</span>${s.o.map((o,k)=>o?`<div>${esc(o)}: ${s.h[k]||0} (${this.pct(s.h[k]||0,tot)}%)<div class="bt"><i style="width:${this.pct(s.h[k]||0,tot)}%"></i></div></div>`:'').join('')}</div>`;}).join('')}`:''}`;},
rekap(){const M={};this.semua().slice().reverse().forEach(r=>{const tot=r.q.length;r.p.forEach(p=>{const k=String(p.n).toLowerCase(),m=M[k]||(M[k]={n:p.n,g:0,b:0,t:0,s:0,tr:[]});m.g++;m.b+=p.b;m.t+=tot;m.s+=p.s;if(tot)m.tr.push(this.pct(p.b,tot));});});
const L=Object.values(M).sort((x,y)=>y.g-x.g||y.s-x.s);
$('#lapIsi').innerHTML=L.length?`<p class="catatan">Digabung berdasarkan nama peserta di semua game. Kalau "Nama peserta acak" aktif, nama berubah tiap game sehingga tidak tergabung.</p><table class="tbl"><tr><th>Nama</th><th>Game</th><th>Rata-rata benar</th><th>Total skor</th><th>Tren</th></tr>${L.map(m=>`<tr><td>${esc(m.n)}</td><td>${m.g}</td><td>${this.pct(m.b,m.t)}%</td><td>${m.s}</td><td>${this.spark(m.tr)}</td></tr>`).join('')}</table>`:'<p>Belum ada data.</p>';},
spark(a){if(a.length<2)return '<small>-</small>';const w=80,h=24,st=w/(a.length-1);return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><polyline points="${a.map((v,i)=>(i*st).toFixed(1)+','+(h-2-(v/100)*(h-4)).toFixed(1)).join(' ')}" fill="none" stroke="#1fcf9f" stroke-width="2"/></svg>`;},
tersulit(){const M={};this.semua().forEach(r=>r.q.forEach(x=>{const m=M[x.t]||(M[x.t]={t:x.t,b:0,n:0,g:0});m.b+=x.b;m.n+=x.n;m.g++;}));
const L=Object.values(M).filter(m=>m.n>0).map(m=>({...m,c:this.pct(m.b,m.n)})).sort((x,y)=>x.c-y.c).slice(0,15);
$('#lapIsi').innerHTML=L.length?`<p class="catatan">Soal yang sama dari semua game digabung. Yang paling atas paling sulit bagi anak-anak, jadi layak diulang.</p>${L.map(m=>`<div class="sb"><span>${esc(m.t)}</span><div class="bt"><i style="width:${m.c}%"></i></div><small>${m.c}% benar (${m.b} dari ${m.n} jawaban, muncul ${m.g}x)</small></div>`).join('')}`:'<p>Belum ada data.</p>';},
unduh(L,nama){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['\ufeff'+L.join('\r\n')],{type:'text/csv;charset=utf-8'}));a.download=nama;a.click();},
q(s){s=String(s);if(/^[=+\-@\t\r]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';},
csv(i){const r=this.semua()[i];if(!r)return;const q=s=>this.q(s);
const L=['sep=;',[q('Kuis'),q(r.j),q(new Date(r.t).toLocaleString('id-ID'))].join(';')];if(r.tm)L.push([q('Skor tim'),q(TIM[0].n),r.tm[0],q(TIM[1].n),r.tm[1]].join(';'));
L.push('',['Peringkat','Nama','Tim','Skor','Benar','Dari'].map(q).join(';'));r.p.forEach((p,k)=>L.push([k+1,q(p.n),q(p.m!=null&&TIM[p.m]?TIM[p.m].n:''),p.s,p.b,r.q.length].join(';')));
L.push('',['Soal','Benar','Peserta','Persen'].map(q).join(';'));r.q.forEach(x=>L.push([q(x.t),x.b,x.n,this.pct(x.b,x.n)+'%'].join(';')));
(r.pl||[]).forEach(s=>{L.push('',[q('Survei'),q(s.t)].join(';'));s.o.forEach((o,k)=>{if(o)L.push([q(o),s.h[k]||0].join(';'));});});
this.unduh(L,'laporan-'+String(r.j||'kuis').replace(/[^\w-]+/g,'_')+'.csv');},
csvSemua(){const a=this.semua();if(!a.length)return alert('Belum ada laporan.');const q=s=>this.q(s);
const L=['sep=;',['Tanggal','Kuis','Nama','Tim','Skor','Benar','Dari soal','Persen'].map(q).join(';')];
a.slice().reverse().forEach(r=>r.p.forEach(p=>L.push([q(new Date(r.t).toLocaleDateString('id-ID')),q(r.j),q(p.n),q(p.m!=null&&TIM[p.m]?TIM[p.m].n:''),p.s,p.b,r.q.length,this.pct(p.b,r.q.length)+'%'].join(';'))));
this.unduh(L,'rekap-semua-game.csv');},
hapus(i){if(!confirm('Hapus laporan ini?'))return;const a=this.semua();a.splice(i,1);this.tulis(a);this.daftar();}};
