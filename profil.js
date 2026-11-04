const LENCANA={pertama:{e:'🎮',n:'Pemain Pertama',d:'Selesaikan 1 game atau latihan'},juara:{e:'🏆',n:'Juara!',d:'Jadi peringkat 1 di sebuah game'},
beruntun5:{e:'🔥',n:'Jago Beruntun',d:'Jawab benar 5 kali berturut-turut'},beruntun10:{e:'🚀',n:'Super Beruntun',d:'Jawab benar 10 kali berturut-turut'},
rajin3:{e:'📅',n:'Rajin 3 Hari',d:'Berlatih 3 hari berturut-turut'},sempurna:{e:'💯',n:'Nilai Sempurna',d:'Semua benar dalam satu game atau latihan (min. 3 soal)'},
tim:{e:'👥',n:'Pemain Tim',d:'Ikut game mode tim'},pr5:{e:'📚',n:'Rajin Berlatih',d:'Selesaikan 5 latihan (PR)'},mini:{e:'🦖',n:'Jago Mini Game',d:'Dino 50+, Hitung Cepat 10+, atau Memori 12 langkah'}};
const Profil={K:'tebakseru-profil',d:{},aktif:'',baru:[],
muat(){try{const s=JSON.parse(localStorage.getItem(this.K));if(s&&s.d){this.d=s.d;this.aktif=s.aktif||'';}}catch(e){}},
simpan(){try{localStorage.setItem(this.K,JSON.stringify({d:this.d,aktif:this.aktif}));}catch(e){}},
ymd(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');},
key(n){return String(n||'').trim().toLowerCase().slice(0,12);},
pakai(n){n=String(n||'').trim().slice(0,12);const k=this.key(n);if(!k)return;if(!this.d[k])this.d[k]={n,main:0,pr:0,juara:0,tim:0,benar:0,jml:0,run:0,maks:0,hari:[],lencana:{}};this.aktif=k;this.simpan();},
p(){return this.d[this.aktif];},
jawab(ok){const p=this.p();if(!p)return;p.jml++;if(ok){p.benar++;p.run++;p.maks=Math.max(p.maks,p.run);}else p.run=0;this.simpan();},
mini(){const m=Mini.dat();return (m.dino||0)>=50||(m.hitung||0)>=10||(!!m.memori&&m.memori<=12);},
hariBerturut(p){const s=new Set(p.hari);let n=0;const d=new Date();while(s.has(this.ymd(d))){n++;d.setDate(d.getDate()-1);}return n;},
selesai(jenis,x){const p=this.p();this.baru=[];if(!p)return [];if(jenis==='game'){p.main++;if(x.rank===1)p.juara++;if(x.tim)p.tim++;}else p.pr++;
const h=this.ymd(new Date());if(!p.hari.includes(h))p.hari.push(h);p.hari=p.hari.slice(-60);
const dapat=id=>{if(!p.lencana[id]){p.lencana[id]=h;this.baru.push(id);}};
dapat('pertama');if(jenis==='game'&&x.rank===1)dapat('juara');if(p.maks>=5)dapat('beruntun5');if(p.maks>=10)dapat('beruntun10');
if(x.jml>=3&&x.benar===x.jml)dapat('sempurna');if(x.tim)dapat('tim');if(p.pr>=5)dapat('pr5');if(this.hariBerturut(p)>=3)dapat('rajin3');if(this.mini())dapat('mini');
this.simpan();if(this.baru.length)Lobi.toast('🏅 Lencana baru: '+this.baru.map(i=>LENCANA[i].e+' '+LENCANA[i].n).join(', '));return this.baru;},
buka(){show('s-profil');this.gambar();},
pilih(k){if(this.d[k]){this.aktif=k;this.simpan();this.gambar();}},
hapus(){const p=this.p();if(!p||!confirm('Hapus profil '+p.n+' beserta lencananya?'))return;delete this.d[this.aktif];this.aktif=Object.keys(this.d)[0]||'';this.simpan();this.gambar();},
gambar(){const ks=Object.keys(this.d),p=this.p();
$('#pfPilih').innerHTML=ks.map(k=>`<button data-k="${esc(k)}" class="${k===this.aktif?'on':''}">${esc(this.d[k].n)}</button>`).join('')||'<p>Belum ada profil. Profil dibuat otomatis saat anak bergabung ke game atau berlatih lewat link PR.</p>';
if(!p){$('#pfIsi').innerHTML='';return;}
let pr={};try{pr=JSON.parse(localStorage.getItem('tebakseru-prbest'))||{};}catch(e){}const mi=Mini.dat();
$('#pfIsi').innerHTML=`<div class="stat pf">${[['Game dimainkan',p.main],['Juara 1',p.juara],['Latihan (PR)',p.pr],['Akurasi',(p.jml?Math.round(p.benar/p.jml*100):0)+'%'],['Rekor beruntun',p.maks],['Hari berturut-turut',this.hariBerturut(p)]].map(([l,v])=>`<div><b>${v}</b><span>${l}</span></div>`).join('')}</div>
<h3>Lencana (${Object.keys(p.lencana).length}/${Object.keys(LENCANA).length})</h3><div class="lcgrid">${Object.entries(LENCANA).map(([id,L])=>{const t=p.lencana[id];return `<div class="lc ${t?'':'kunci'}"><span>${L.e}</span><b>${L.n}</b><small>${t?'sejak '+t:L.d}</small></div>`;}).join('')}</div>
<h3>Rekor di perangkat ini</h3><p>🦖 Dino: ${mi.dino||0} · ➕ Hitung Cepat: ${mi.hitung||0} · 🧠 Memori: ${mi.memori?mi.memori+' langkah':'-'}</p>
${Object.keys(pr).length?'<p>📚 Skor terbaik latihan: '+Object.entries(pr).map(([j,s])=>esc(j)+' ('+s+')').join(' · ')+'</p>':''}
<button class="kecil" onclick="Profil.hapus()">🗑 Hapus profil ini</button>`;}};
Profil.muat();document.getElementById('pfPilih').onclick=e=>{const b=e.target.closest('button');if(b)Profil.pilih(b.dataset.k);};
(()=>{const pp=Profil.p();if(pp)document.getElementById('inNama').value=pp.n;})();
