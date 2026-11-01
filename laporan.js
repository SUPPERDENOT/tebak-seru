const Lap={K:'tebakseru-lap',
semua(){try{return JSON.parse(localStorage.getItem(this.K))||[];}catch(e){return [];}},
tulis(a){try{localStorage.setItem(this.K,JSON.stringify(a));}catch(e){}},
simpan(r){const a=this.semua();a.unshift(r);this.tulis(a.slice(0,30));},
buka(){if(location.hash!=='#host')return;show('s-laporan');this.daftar();},
pct(b,n){return n?Math.round(b/n*100):0;},
daftar(){const a=this.semua();
$('#lapIsi').innerHTML=a.map((r,i)=>{const tb=r.p.reduce((s,x)=>s+x.b,0),rata=this.pct(tb,r.p.length*r.q.length);
return `<div class="kk lap" onclick="Lap.detail(${i})"><div class="kb"><b>${esc(r.j||'Kuis')}</b><small>${new Date(r.t).toLocaleString('id-ID')} · ${r.p.length} peserta · rata-rata benar ${rata}%</small></div></div>`;}).join('')||'<p>Belum ada laporan. Laporan dibuat otomatis setiap game selesai.</p>';},
detail(i){const r=this.semua()[i];if(!r)return;
const q=r.q.map(x=>({...x,c:this.pct(x.b,x.n)})).sort((a,b)=>a.c-b.c);
$('#lapIsi').innerHTML=`<button class="kecil" onclick="Lap.daftar()">← Semua laporan</button><h2>${esc(r.j||'Kuis')}</h2><p>${new Date(r.t).toLocaleString('id-ID')}</p>
<div class="aksi"><button class="main" onclick="Lap.csv(${i})">⬇ Ekspor ke Excel</button><button onclick="Lap.hapus(${i})">🗑 Hapus</button></div>
<h3>Nilai peserta</h3><table class="tbl"><tr><th>#</th><th>Nama</th><th>Skor</th><th>Benar</th></tr>${r.p.map((p,k)=>`<tr><td>${k+1}</td><td>${Avatar.html(p.a,26)} ${esc(p.n)}</td><td>${p.s}</td><td>${p.b} / ${r.q.length}</td></tr>`).join('')}</table>
<h3>Soal yang paling sering salah</h3>${q.map(x=>`<div class="sb"><span>${esc(x.t)}</span><div class="bt"><i style="width:${x.c}%"></i></div><small>${x.c}% benar (${x.b} dari ${x.n})</small></div>`).join('')}`;},
csv(i){const r=this.semua()[i];if(!r)return;
const q=s=>{s=String(s);if(/^[=+\-@\t\r]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';};
const L=['sep=;',[q('Kuis'),q(r.j),q(new Date(r.t).toLocaleString('id-ID'))].join(';'),'',['Peringkat','Nama','Skor','Benar','Dari'].map(q).join(';')];
r.p.forEach((p,k)=>L.push([k+1,q(p.n),p.s,p.b,r.q.length].join(';')));
L.push('',['Soal','Benar','Peserta','Persen'].map(q).join(';'));r.q.forEach(x=>L.push([q(x.t),x.b,x.n,this.pct(x.b,x.n)+'%'].join(';')));
const a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['\ufeff'+L.join('\r\n')],{type:'text/csv;charset=utf-8'}));
a.download='laporan-'+String(r.j||'kuis').replace(/[^\w-]+/g,'_')+'.csv';a.click();},
hapus(i){if(!confirm('Hapus laporan ini?'))return;const a=this.semua();a.splice(i,1);this.tulis(a);this.daftar();}};
