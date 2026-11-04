const $=s=>document.querySelector(s),S=['★','♥','●','▲'],W=['var(--pink)','var(--kuning)','var(--mint)','var(--biru)'];
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const HOST=['s-lobi','s-hitung','s-soal','s-hasil','s-podium','s-slide'];
const show=id=>{document.body.dataset.hasil='';Baca.stop();if(id!=='s-game'&&typeof Mini!=='undefined')Mini.henti();if(id!=='p-tunggu'&&id!=='s-lobi')$('#modal').hidden=true;if(id==='s-lobi'&&$('#cMusikLobi').checked)Suara.lobi();else Suara.stopLobi();if(id!=='p-soal'&&typeof App!=='undefined')clearInterval(App.ptm);document.querySelectorAll('.v').forEach(e=>e.hidden=e.id!==id);$('#kontrol').hidden=!HOST.includes(id);document.body.classList.toggle('host',HOST.includes(id));document.body.classList.toggle('edit',id==='s-edit');document.body.classList.toggle('dash',id==='s-pustaka');$('#pMute').hidden=!id.startsWith('p-');$('#reaksi').hidden=!['p-tunggu','p-kirim','p-hasil','p-akhir','p-slide'].includes(id);};
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const TIM=[{n:'Tim Singa',e:'🦁',c:'#e0457b'},{n:'Tim Panda',e:'🐼',c:'#1368ce'}],DUA=q=>q.tipe==='ketik'||q.tipe==='urut';
const App={ps:{},soal:[],asli:[],i:-1,buka:false,auto:false,kunci:false,sedang:false,batal:false,
async host(id){if(location.hash!=='#host')return;const k=(await Soal.semua()).find(x=>x.id===id);if(!k)return;
try{Konek.p&&Konek.p.destroy();}catch(e){}
this.kid=id;this.asli=k.soal;this.ps={};this.i=-1;this.buka=false;this.kunci=false;this.sedang=false;this.batal=false;$('#cKunci').checked=false;$('#suaraInfo').textContent=Baca.info();
$('#lJudul').textContent=k.judul;$('#alamat').textContent=location.host;$('#kode').textContent='....';this.daftar();show('s-lobi');
Konek.host((c,d)=>this.terima(c,d),kd=>$('#kode').textContent=kd);},
daftar(){$('#daftar').innerHTML=Object.entries(this.ps).map(([id,p])=>`<li>${Avatar.html(p.av,34)} ${esc(p.nama)}${p.siap?' ✓':''} <button onclick="App.keluarkan('${id}')">✕</button></li>`).join('');Lobi.segar();Lobi.bagi();},
keluarkan(id){const p=this.ps[id];if(!p)return;try{p.c.send({t:'keluar'});setTimeout(()=>p.c.close(),300);}catch(e){}delete this.ps[id];this.daftar();},
terima(c,d){if(d.t==='join'){const tok=String(d.tok||c.peer).slice(0,40);c.tok=tok;if(this.ps[tok]){this.ps[tok].c=c;this.pulihkan(this.ps[tok]);return;}if(this.kunci||this.i>=0){c.send({t:'tolak',m:this.kunci?'Ruang tunggu dikunci host':'Game sudah berjalan'});setTimeout(()=>c.close(),300);return;}
this.ps[tok]={c,nama:this.namaBaru(String(d.nama)),av:Avatar.ok(d.av),skor:0,j:null};this.daftar();c.send({t:'tema',i:Tema.i});c.send({t:'nama',n:this.ps[tok].nama});}
else if(d.t==='siap'||d.t==='avatar'||d.t==='pilihtim'){Lobi.host(c,d);}
else if(d.t==='reaksi'){const p=this.ps[c.tok],n=Date.now();if(!p||!Number.isInteger(d.e)||d.e<0||d.e>=Reaksi.E.length||n-(p.rt||0)<700)return;p.rt=n;Reaksi.muncul(d.e,p.av,p.nama);this.kirim({t:'reaksi',e:d.e,av:p.av,nama:p.nama});}
else if(d.t==='jawab'){const p=this.ps[c.tok],q=this.soal[this.i],n=q?q.opsi.length:0,a=q&&q.tipe==='urut'?(Array.isArray(d.i)&&d.i.length===n&&new Set(d.i).size===n&&d.i.every(x=>Number.isInteger(x)&&x>=0&&x<n)?d.i.slice():[]):q&&q.tipe==='ketik'?(String(d.k||'').trim()?[0]:[]):Array.isArray(d.i)?[...new Set(d.i)].filter(x=>Number.isInteger(x)&&x>=0&&x<n).sort((x,y)=>x-y):[];
if(p&&a.length&&this.buka&&p.j===null){p.j=a;p.w=Date.now();if(q&&q.tipe==='ketik')p.kt=String(d.k).trim().slice(0,60);const ps=Object.values(this.ps);
$('#dijawab').textContent='Dijawab: '+ps.filter(x=>x.j!==null).length+' / '+ps.length;if(ps.every(x=>x.j!==null))this.tutup();}}},
pesanSoal(q){return {t:'soal',n:q.opsi.length,multi:q.tipe==='multi',ketik:q.tipe==='ketik',urut:q.tipe==='urut',w:Math.max(1,Math.round(this.waktu-(Date.now()-this.t0)/1000)),g:this.gid,ig:this.i,ada:!!(this.tampil&&q.gambar),...(q.tipe==='urut'?{tanya:q.tanya,opsi:this.perm.map(i=>q.opsi[i])}:this.tampil?{tanya:q.tanya,opsi:q.opsi}:{})};},
pulihkan(p){p.c.send({t:'nama',n:p.nama});if(this.tim&&p.tim!=null)p.c.send({t:'tim',i:p.tim});Lobi.bagi();const q=this.soal[this.i];if(this.i<0)p.c.send({t:'tunggu'});
else if(this.buka&&q){if(p.j!==null)p.c.send({t:'terkirim'});else{p.c.send(this.pesanSoal(q));if(this.tampil&&q.gambar)p.c.send({t:'gbr',g:this.gid,i:this.i,d:q.gambar});}}
else p.c.send(p.last||{t:'tunggu'});},
namaBaru(n){n=n.trim().slice(0,12)||'Peserta';const pakai=Object.values(this.ps).map(p=>p.nama);
const acak=()=>{for(let i=0;i<60;i++){const x=Nama.acak();if(!pakai.includes(x))return x;}return 'Peserta'+(pakai.length+1);};
if($('#cNamaAcak').checked||($('#cFilter').checked&&Nama.kasar(n)))return acak();
if(pakai.includes(n)){let k=2;while(pakai.includes(n.slice(0,10)+k))k++;return n.slice(0,10)+k;}return n;},
benarP(q,p){if(q.tipe==='ketik')return Soal.cocok(q,p.kt);if(q.tipe==='urut')return !!p.j&&p.j.every((k,i)=>this.perm[k]===i);return !!p.j&&p.j.join()===q.benar.join();},
skorTim(){const t=[[],[]];Object.values(this.ps).forEach(p=>{if(p.tim!=null)t[p.tim].push(p.skor);});return t.map(x=>x.length?Math.round(x.reduce((m,n)=>m+n,0)/x.length):0);},
kirim(m){Object.values(this.ps).forEach(p=>p.c.open&&p.c.send(m));},
async mulai(){if(this.sedang||!Object.keys(this.ps).length)return;const bad=Soal.rusak(this.asli),baik=this.asli.filter((q,i)=>!bad.includes(i));
if(!baik.some(q=>q.tipe!=='slide')){alert('Belum ada soal yang lengkap. Lengkapi dulu di Kuis Saya, tombol Edit.');return;}
if(bad.length&&!confirm('Soal nomor '+bad.map(i=>i+1).join(', ')+' belum lengkap.\n\nOK = mulai tanpa soal itu\nBatal = kembali dan lengkapi dulu'))return;
if($('#cTim').checked&&Object.keys(this.ps).length<2){alert('Mode tim butuh minimal 2 peserta.');return;}const L0=Object.values(this.ps);if($('#cTim').checked&&L0.every(p=>p.timPilih)){const c=[0,0];L0.forEach(p=>c[p.tim]++);if(!c[0]||!c[1]){alert('Semua peserta memilih tim yang sama. Minta sebagian pindah tim, atau matikan mode tim.');return;}}
if(L0.some(p=>p.siap)&&L0.some(p=>!p.siap)&&!confirm('Belum semua peserta siap ('+L0.filter(p=>p.siap).length+'/'+L0.length+'). Mulai tetap?'))return;
Soal.catat(this.kid);this.tampil=$('#cTampil').checked;this.baca=$('#cBaca').checked;this.sedang=true;this.batal=false;this.kunci=true;let s=JSON.parse(JSON.stringify(baik));
if($('#cAcakJ').checked)s.forEach(q=>{if(q.tipe==='bs'||q.tipe==='slide'||q.tipe==='ketik'||q.tipe==='urut')return;const x=q.opsi.map((_,k)=>k).sort(()=>Math.random()-.5);q.opsi=x.map(k=>q.opsi[k]);q.benar=q.benar.map(b=>x.indexOf(b)).sort((a,b)=>a-b);});
if($('#cAcakS').checked&&!s.some(q=>q.tipe==='slide'))s.sort(()=>Math.random()-.5);this.soal=s;this.i=-1;this.lap=[];this.pol=[];this.tim=$('#cTim').checked;if(this.tim){const L=Object.values(this.ps),n=[0,0];L.forEach(p=>{if(!p.timPilih)p.tim=null;else n[p.tim]++;});
L.filter(p=>p.tim==null).sort(()=>Math.random()-.5).forEach(p=>{const i=n[0]<n[1]?0:n[1]<n[0]?1:(Math.random()<.5?0:1);p.tim=i;n[i]++;});L.forEach(p=>p.c.open&&p.c.send({t:'tim',i:p.tim}));}this.gid=Date.now();if(this.tampil)this.kirimGambar();Object.values(this.ps).forEach(p=>{p.nb=0;});
for(let n=3;n>0&&!this.batal;n--){show('s-hitung');$('#angka').textContent=n;this.kirim({t:'hitung',n});Suara.tik();await wait(1000);}
if(!this.batal)this.next();},
next(){clearInterval(this.ta);this.i++;if(this.i>=this.soal.length)return this.akhir();
const q=this.soal[this.i];if(q.tipe==='slide')return this.slide(q);if(q.tipe==='urut'){let a=q.opsi.map((_,k)=>k);for(let t=0;t<20;t++){a.sort(()=>Math.random()-.5);if(a.some((v,k)=>v!==k))break;}this.perm=a;}Object.values(this.ps).forEach(p=>p.j=null);this.buka=true;this.t0=Date.now();this.waktu=q.waktu||20;
show('s-soal');if(this.baca)Baca.ucap(Baca.soal(q));Suara.mulai();Suara.stop();setTimeout(()=>{if(this.buka)Suara.musik(240);},600);$('#sisa').classList.remove('mepet');$('#dijawab').textContent='Dijawab: 0 / '+Object.keys(this.ps).length;$('#tanya').textContent=q.tanya;const g=$('#gbrSoal');g.hidden=!q.gambar;if(q.gambar)g.src=q.gambar;
$('#opsi').innerHTML=q.tipe==='ketik'?'<div class="ketikinfo">✍️ Ketik jawabanmu di HP!</div>':(q.tipe==='urut'?this.perm.map(i=>q.opsi[i]):q.opsi).map((o,k)=>`<div class="o o${k}"><b>${S[k]}</b>${esc(o)}</div>`).join('');
this.kirim(this.pesanSoal(q));let s=this.waktu;$('#sisa').textContent=s;clearInterval(this.tm);
this.tm=setInterval(()=>{s--;$('#sisa').textContent=s;$('#sisa').classList.toggle('mepet',s<=5);if(s===5)Suara.musik(150);if(s<=0)this.tutup(true);},1000);},
tutup(habis){if(!this.buka)return;this.buka=false;clearInterval(this.tm);Suara.stop();Baca.stop();if(habis)Suara.habis();
const q=this.soal[this.i],ps=Object.values(this.ps),hit=DUA(q)?[0,0]:q.opsi.map(()=>0);
ps.forEach(p=>{if(DUA(q)){if(p.j)hit[this.benarP(q,p)?0:1]++;}else if(p.j)p.j.forEach(x=>hit[x]++);const sisa=p.j===null?0:Math.max(0,this.waktu-(p.w-this.t0)/1000);
p.ok=q.tipe==='poll'?false:!!p.j&&this.benarP(q,p);p.plus=p.ok?Skor.hitung(sisa,this.waktu)*q.poin:0;p.skor+=p.plus;});
if(q.tipe!=='poll'){ps.forEach(p=>{p.nb=(p.nb||0)+(p.ok?1:0);});this.lap.push({t:q.tanya,b:ps.filter(p=>p.ok).length,n:ps.length});}else this.pol.push({t:q.tanya,o:q.opsi.slice(),h:hit.slice()});
const u=Skor.urut(this.ps),ts=this.tim?this.skorTim():null;
ps.forEach(p=>{p.last={t:'hasil',poll:q.tipe==='poll',habis:p.j===null,kunci:q.tipe==='urut'?q.opsi.join(' → '):q.tipe==='ketik'?q.kunci.join(' / '):q.benar.map(i=>S[i]+' '+q.opsi[i]).join('  •  '),ok:p.ok,plus:p.plus,skor:p.skor,rank:u.indexOf(p)+1,dari:u.length,tim:ts&&p.tim!=null?{i:p.tim,s:ts}:undefined};p.c.open&&p.c.send(p.last);});
show('s-hasil');$('#kunci').textContent=q.tipe==='poll'?'Hasil survei':'Jawaban: '+(q.tipe==='urut'?q.opsi.join(' → '):q.tipe==='ketik'?q.kunci.join(' / '):q.benar.map(i=>q.opsi[i]).join(', '));
$('#ringkas').textContent=q.tipe==='poll'?ps.filter(p=>p.j).length+' dari '+ps.length+' peserta menjawab':ps.filter(p=>p.ok).length+' dari '+ps.length+' menjawab benar';Maskot.pasang('#mkH',ps.filter(p=>p.ok).length*2>=ps.length?'benar':'salah');
const mx=Math.max(1,...hit);$('#grafik').innerHTML=hit.map((h,k)=>`<div style="height:${h/mx*100}%;background:${DUA(q)?(k?'var(--pink)':'var(--mint)'):W[k]}">${DUA(q)?['✓','✗'][k]:S[k]}<br>${h}</div>`).join('');
$('#timH').innerHTML=ts?'<div class="timbar">'+TIM.map((t,i)=>`<div style="background:${t.c}">${t.e} ${t.n}<b>${ts[i]}</b></div>`).join('')+'</div>':'';
$('#papan').innerHTML=u.slice(0,5).map(p=>`<li>${Avatar.html(p.av,30)}${this.tim&&p.tim!=null?TIM[p.tim].e+' ':''}${esc(p.nama)} - ${p.skor}</li>`).join('');
clearInterval(this.ta);const b=$('#btnNext');b.textContent='Lanjut';
if(this.auto)this.mulaiOto();},
slide(q){Suara.stop();Baca.stop();clearInterval(this.tm);this.buka=false;show('s-slide');Suara.mulai();$('#slJ').textContent=q.tanya;$('#slI').textContent=q.isi||'';
const g=$('#slG');g.hidden=!q.gambar;if(q.gambar)g.src=q.gambar;if(this.baca)Baca.ucap(q.tanya+'. '+(q.isi||''));
Object.values(this.ps).forEach(p=>{p.last={t:'slide'};});this.kirim({t:'slide'});},
lewati(){if(this.buka)this.tutup();else if(!$('#s-hasil').hidden||!$('#s-slide').hidden)this.next();},
akhirGame(){if(!this.sedang||!confirm('Akhiri game sekarang?'))return;this.batal=true;this.buka=false;this.akhir();},
akhir(){Suara.stop();this.sedang=false;clearInterval(this.tm);clearInterval(this.ta);const u=Skor.urut(this.ps);if((this.lap&&this.lap.length)||(this.pol&&this.pol.length))Lap.simpan({t:Date.now(),j:$('#lJudul').textContent,p:u.map(p=>({n:p.nama,s:p.skor,b:p.nb||0,a:p.av,m:this.tim&&p.tim!=null?p.tim:undefined})),q:this.lap,pl:this.pol||[],tm:this.tim?this.skorTim():undefined});this.lap=[];show('s-podium');Suara.selesai();const ts=this.tim?this.skorTim():null;$('#timJuara').innerHTML=ts?(ts[0]===ts[1]?'<h2>🤝 Seri!</h2>':'<h2>🏆 '+TIM[ts[0]>ts[1]?0:1].e+' '+TIM[ts[0]>ts[1]?0:1].n+' menang!</h2>')+'<p>'+TIM.map((t,i)=>t.e+' '+t.n+': '+ts[i]).join(' &nbsp;·&nbsp; ')+'</p>':'';
$('#juara').innerHTML=[1,0,2].filter(k=>u[k]).map(k=>`<div class="pd p${k}"><div class="nm">${['🥇','🥈','🥉'][k]}<br>${Avatar.html(u[k].av,64)}<br>${esc(u[k].nama)}<br>${u[k].skor}</div><div class="tg"></div></div>`).join('');
u.forEach((p,k)=>{p.last={t:'akhir',rank:k+1,skor:p.skor,tim:ts&&p.tim!=null?{i:p.tim,s:ts}:undefined};p.c.open&&p.c.send(p.last);});},
ulang(){Object.values(this.ps).forEach(p=>{p.skor=0;p.j=null;p.nb=0;p.siap=false;});this.i=-1;this.buka=false;this.sedang=false;this.batal=false;
this.kunci=$('#cKunci').checked;this.daftar();this.kirim({t:'tunggu'});show('s-lobi');},
batalGame(ya=true){if(ya&&Object.keys(this.ps).length&&!confirm('Batalkan game? Semua peserta akan dikeluarkan.'))return;
this.kirim({t:'keluar',m:'Host menutup game'});clearInterval(this.tm);clearInterval(this.ta);Suara.stop();this.buka=false;this.sedang=false;this.batal=true;
const p=Konek.p;setTimeout(()=>{try{p&&p.destroy();}catch(e){}},400);this.ps={};Pustaka.buka();},
selesaiHost(){this.batalGame(false);},
setTema(i){Tema.pasang(+i,true);this.kirim({t:'tema',i:+i});},
mute(){Suara.mute=!Suara.mute;$('#bMute').textContent=Suara.mute?'🔇':'🔊';},
pmute(){Suara.mute=!Suara.mute;$('#pMute').textContent=Suara.mute?'🔇':'🔊';},
gbr:{},
async kirimGambar(){for(let i=0;i<this.soal.length;i++){const q=this.soal[i];if(q.gambar){this.kirim({t:'gbr',g:this.gid,i,d:q.gambar});await wait(200);}}},
tampilGbr(src,tunggu){const g=$('#pGbr'),ok=/^data:image\//.test(src||'');g.hidden=!ok;if(ok)g.src=src;$('#pMuat').hidden=!(tunggu&&!ok);},
mulaiWaktuP(w){clearInterval(this.ptm);const e=$('#pW');e.hidden=!w;e.classList.remove('mepet');if(!w)return;this.pw=w;e.textContent=w;
this.ptm=setInterval(()=>{this.pw--;e.textContent=Math.max(0,this.pw);e.classList.toggle('mepet',this.pw<=5);if(this.pw<=0)clearInterval(this.ptm);},1000);},
mulaiOto(){clearInterval(this.ta);const b=$('#btnNext');let n=+$('#cJeda').value||5;b.textContent='Lanjut ('+n+')';
this.ta=setInterval(()=>{n--;if(n<=0)this.next();else b.textContent='Lanjut ('+n+')';},1000);},
setAuto(v){this.auto=!!v;['cAuto','cAutoL'].forEach(i=>{const e=$('#'+i);if(e)e.checked=this.auto;});$('#btnAuto').textContent='🔁 Otomatis: '+(this.auto?'Nyala':'Mati');
if(!this.auto){clearInterval(this.ta);$('#btnNext').textContent='Lanjut';}else if(!$('#s-hasil').hidden)this.mulaiOto();},
join(){Suara.buka();const kode=$('#inKode').value.trim(),nama=$('#inNama').value.trim();
if(!kode||!nama){$('#err').textContent='Isi kode dan nama dulu ya';return;}this.dalam=false;this.coba=0;this.sambung(kode,nama,false);},
sambung(kode,nama,ulang){this.kode=kode;this.nama=nama;this.tok=this.tok||sessionStorage.getItem('ts-tok')||Soal.id()+Soal.id();sessionStorage.setItem('ts-tok',this.tok);
if(!ulang)$('#err').textContent='Menyambung...';this.ditolak=false;Profil.pakai(nama);
Konek.gabung(kode,d=>this.pesan(d),c=>{this.c=c;this.dalam=true;this.coba=0;$('#putus').hidden=true;sessionStorage.setItem('ts-sesi',JSON.stringify({kode,nama}));
c.send({t:'join',nama,tok:this.tok,av:Avatar.a});if(!ulang){$('#sapaAv').innerHTML=Avatar.html(Avatar.a,90);$('#sapa').textContent='Halo, '+nama+'!';show('p-tunggu');}},
e=>{if(this.ditolak||!$('#p-akhir').hidden)return;if(this.dalam)this.putus(e);else{show('s-menu');$('#err').textContent=e;}},
m=>{if(!this.dalam)$('#err').textContent=m;});},
putus(e){$('#putus').hidden=false;if(e.startsWith('Kode tidak')||this.coba>=10){this.dalam=false;sessionStorage.removeItem('ts-sesi');$('#putus').hidden=true;show('s-menu');$('#err').textContent='Tidak bisa tersambung lagi. '+e;return;}
this.coba++;setTimeout(()=>{if(this.dalam)this.sambung(this.kode,this.nama,true);},3000);},
pesan(d){if(d.t==='hitung'){this.pb=0;this.pj=0;show('p-hitung');$('#pangka').textContent=d.n;}
else if(d.t==='soal'){show('p-soal');this.teks=d.tanya?Baca.soal(d):'';$('#bBaca').hidden=!d.tanya;$('#pTanya').textContent=d.tanya||'';$('#pTanya').hidden=!d.tanya;if(d.g!==this.gg){this.gg=d.g;this.gbr={};}this.pq=d.ig;this.tampilGbr(d.ada?this.gbr[d.ig]:null,d.ada);this.mulaiWaktuP(d.w);this.sel=[];this.urut=!!d.urut;this.multi=!!d.multi||this.urut;$('#kirimM').hidden=!this.multi;$('#pKetikBox').hidden=!d.ketik;if(d.ketik)$('#pKetik').value='';$('#petunjuk').textContent=d.urut?'Ketuk item sesuai urutan yang benar (mulai dari yang pertama), lalu Kirim':d.multi?'Pilih semua yang benar, lalu tekan Kirim':d.ketik?'Ketik jawabanmu, lalu tekan Kirim':'Pilih jawabanmu!';
$('#tombol').innerHTML=Array.from({length:d.n},(_,k)=>`<button class="o o${k}${d.opsi?' teks':''}" onclick="App.pilih(${k})">${S[k]}${d.opsi?'<span>'+esc(d.opsi[k])+'</span>':''}</button>`).join('');}
else if(d.t==='hasil'){show('p-hasil');if(!d.poll){Profil.jawab(!!d.ok);this.pb=(this.pb||0)+(d.ok?1:0);this.pj=(this.pj||0)+1;}document.body.dataset.hasil=d.poll?'':d.ok?'ok':'no';$('#kunciP').textContent=d.ok||d.poll?'':'Jawaban yang benar: '+d.kunci;$('#verdik').textContent=d.poll?(d.habis?'Waktu habis ⏰':'Terima kasih! 🙌'):d.habis?'Waktu habis! ⏰':d.ok?'Benar! 🎉':'Belum tepat 😅';d.poll?Suara.klik():d.habis?Suara.habis():d.ok?Suara.benar():Suara.salah();if(d.poll)$('#mkP').innerHTML='';else Maskot.pasang('#mkP',d.habis?'habis':d.ok?'benar':'salah',this.namaku);
$('#info').innerHTML=`${d.habis?'Kamu belum menjawab<br>':''}${d.poll?'Jawabanmu sudah tercatat<br>':'+'+d.plus+' poin<br>'}Skor: ${d.skor}<br>Peringkat ${d.rank} dari ${d.dari}`;$('#timP').textContent=d.tim?TIM.map((t,i)=>t.e+' '+d.tim.s[i]).join('  vs  '):'';}
else if(d.t==='akhir'){show('p-akhir');Suara.selesai();Profil.selesai('game',{rank:d.rank,benar:this.pb||0,jml:this.pj||0,tim:!!d.tim});Maskot.pasang('#mkA',d.rank<=3?'juara':'ikut',this.namaku);this.dalam=false;sessionStorage.removeItem('ts-sesi');$('#akhirT').textContent=this.namaku?this.namaku+', '+(d.rank<=3?'kamu juara '+d.rank+'! 🏆':'seru sekali!'):(d.rank<=3?'Kamu juara '+d.rank+'! 🏆':'Seru sekali!');
$('#akhirI').textContent='Skor akhir: '+d.skor+' (peringkat '+d.rank+')'+(d.tim?' · '+(d.tim.s[0]===d.tim.s[1]?'Seri!':(d.tim.s[d.tim.i]>d.tim.s[1-d.tim.i]?'Timmu menang! 🏆':'Tim lawan menang.')):'');}
else if(d.t==='tunggu'){show('p-tunggu');}
else if(d.t==='terkirim'){show('p-kirim');}
else if(d.t==='reaksi'){Reaksi.muncul(d.e,d.av,String(d.nama||'').slice(0,12));}
else if(d.t==='tema'){Tema.pasang(+d.i,false);}
else if(d.t==='daftar'){Lobi.daftar(d);}
else if(d.t==='tim'){const t=TIM[d.i];if(t){$('#sapaTim').textContent=$('#timHit').textContent='Kamu di '+t.e+' '+t.n+'!';$('#sapaTim').style.background=$('#timHit').style.background=t.c;}}
else if(d.t==='nama'){this.namaku=String(d.n||'').slice(0,20);$('#sapa').textContent='Halo, '+this.namaku+'!';if(Lobi.l.length)Lobi.daftar({l:Lobi.l,m:Lobi.mt?1:0});}
else if(d.t==='slide'){show('p-slide');}
else if(d.t==='gbr'){if(/^data:image\//.test(d.d||'')&&Number.isInteger(d.i)){if(d.g!==this.gg){this.gg=d.g;this.gbr={};}this.gbr[d.i]=d.d;if(this.pq===d.i&&!$('#p-soal').hidden)this.tampilGbr(d.d,false);}}
else if(d.t==='tolak'||d.t==='keluar'){this.ditolak=true;this.dalam=false;sessionStorage.removeItem('ts-sesi');$('#putus').hidden=true;show('s-menu');$('#err').textContent=d.m||'Kamu dikeluarkan oleh host';}},
pilih(k){Suara.buka();Suara.klik();Baca.stop();if(!this.multi){this.c.send({t:'jawab',i:[k]});show('p-kirim');return;}const x=this.sel.indexOf(k);x<0?this.sel.push(k):this.sel.splice(x,1);document.querySelectorAll('#tombol .o').forEach((e,i)=>{const n=this.sel.indexOf(i);e.classList.toggle('pilih',n>=0);if(this.urut)e.dataset.no=n>=0?n+1:'';});},
kirimK(){const v=$('#pKetik').value.trim();if(!v)return;Suara.klik();Baca.stop();this.c.send({t:'jawab',k:v});show('p-kirim');},
kirimM(){if(!this.sel.length||(this.urut&&this.sel.length<document.querySelectorAll('#tombol .o').length))return;this.c.send({t:'jawab',i:this.sel});show('p-kirim');}};
const cekHost=()=>{const h=location.hash==='#host';$('.hostk').hidden=!h;$('.duo').classList.toggle('solo',!h);};cekHost();addEventListener('hashchange',cekHost);
try{const ss=JSON.parse(sessionStorage.getItem('ts-sesi'));if(ss&&ss.kode&&location.hash!=='#host'){App.dalam=true;$('#putus').hidden=false;App.sambung(ss.kode,ss.nama,true);}}catch(e){}
if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js');
