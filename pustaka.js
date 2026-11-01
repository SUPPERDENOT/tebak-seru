const WARNA=['#ff5c8a','#ffb020','#1fcf9f','#4aa3ff','#9b6bff','#ff8a3d'],IKON=['🧮','📖','🌍','🔬','🎨','🦁','🚀','🧩'];
const Pustaka={all:[],
async buka(){if(location.hash!=='#host')return;this.all=await Soal.semua();show('s-pustaka');this.gambar();},
gambar(){const q=($('#cari').value||'').toLowerCase(),a=this.all.filter(k=>k.judul.toLowerCase().includes(q));
const tot=this.all.reduce((s,k)=>s+k.soal.length,0),main=this.all.reduce((s,k)=>s+(k.main||0),0);
$('#stat').innerHTML=[['Kuis',this.all.length],['Total soal',tot],['Kali dimainkan',main]].map(([l,v])=>`<div><b>${v}</b><span>${l}</span></div>`).join('');
$('#dftKuis').innerHTML=a.map(k=>{const h=[...k.id].reduce((s,c)=>s+c.charCodeAt(0),0);
return `<div class="kk"><div class="cover" style="background:${WARNA[h%6]}">${IKON[h%8]}</div><div class="kb"><b>${esc(k.judul||'(tanpa judul)')}</b><small>${k.soal.length} soal · dimainkan ${k.main||0}x${k.terakhir?' · terakhir '+new Date(k.terakhir).toLocaleDateString('id-ID'):''}</small><div class="aksi"><button class="main" onclick="App.host('${k.id}')">▶ Main</button><button onclick="Edit.buka('${k.id}')">Edit</button><button title="Link latihan (PR)" onclick="Pustaka.pr('${k.id}')">🔗 PR</button><button title="Duplikat" onclick="Pustaka.dup('${k.id}')">⧉</button><button title="Hapus" onclick="Pustaka.hapus('${k.id}')">🗑</button></div></div></div>`;}).join('')||'<p>Belum ada kuis yang cocok.</p>';},
pr(id){const k=this.all.find(x=>x.id===id),d={j:k.judul,s:k.soal.filter(q=>q.tipe!=='slide').map(q=>({t:q.tipe,q:q.tanya,o:q.opsi,b:q.benar,w:q.waktu}))};
const b=btoa(unescape(encodeURIComponent(JSON.stringify(d)))).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
if(b.length>7000)return alert('Kuis ini terlalu panjang untuk dibagikan lewat link. Kurangi jumlah soal atau teksnya.');
const u=location.origin+location.pathname+'#pr='+b;
navigator.clipboard.writeText(u).then(()=>alert('Link latihan disalin! Kirim ke HP anak lewat WhatsApp. Soal bergambar dikirim tanpa gambar.'),()=>prompt('Salin link ini:',u));},
baru(){const k=Soal.kuisBaru();this.all.push(k);Soal.simpanSemua(this.all);Edit.buka(k.id);},
dup(id){const k=this.all.find(x=>x.id===id);this.all.push({...JSON.parse(JSON.stringify(k)),id:Soal.id(),judul:k.judul+' (salinan)',main:0,terakhir:0});Soal.simpanSemua(this.all);this.gambar();},
hapus(id){const k=this.all.find(x=>x.id===id);if(!confirm('Hapus kuis "'+k.judul+'"?'))return;this.all=this.all.filter(x=>x!==k);Soal.simpanSemua(this.all);this.gambar();},
impor(f){const r=new FileReader();r.onload=async()=>{try{let d=JSON.parse(r.result);if(Array.isArray(d))d={judul:f.name.replace(/\.json$/i,''),soal:d};
if(!Array.isArray(d.soal)||!d.soal.length)throw 0;this.all=await Soal.semua();
this.all.push({id:Soal.id(),judul:String(d.judul||'Kuis impor'),soal:d.soal.map(x=>Soal.norm(x))});Soal.simpanSemua(this.all);this.gambar();}
catch(e){alert('File kuis tidak valid');}};r.readAsText(f);}};
$('#fImpor').onchange=e=>{if(e.target.files[0])Pustaka.impor(e.target.files[0]);e.target.value='';};
