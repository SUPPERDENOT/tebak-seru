const PR={k:null,
sah(q){if(!q.tanya)return false;if(q.tipe==='slide')return true;if(q.tipe==='ketik')return (q.kunci||[]).length>0;if(q.tipe==='urut')return q.opsi.filter(Boolean).length>=2;return q.opsi.length>=2&&q.benar.length>0;},
parse(){const m=location.hash.match(/^#pr=([\w-]+)$/);if(!m)return false;
try{let b=m[1].replace(/-/g,'+').replace(/_/g,'/');while(b.length%4)b+='=';const d=JSON.parse(decodeURIComponent(escape(atob(b))));
const s=(d.s||[]).slice(0,60).map(x=>{const q=Soal.norm({tipe:x.t,tanya:String(x.q||'').slice(0,300),opsi:(x.o||[]).slice(0,4).map(v=>String(v).slice(0,100)),benar:x.b||[],waktu:Math.min(90,Math.max(5,+x.w||20)),kunci:x.k,isi:x.i});
q.benar=q.benar.filter(i=>Number.isInteger(i)&&i>=0&&i<q.opsi.length);return q;}).filter(q=>q.tipe!=='poll'&&this.sah(q));
if(!s.length)return false;this.k={judul:String(d.j||'Latihan').slice(0,60),soal:s};return true;}catch(e){return false;}},
tot(){return this.k.soal.filter(q=>q.tipe!=='slide').length;},
tampil(){show('s-pr');$('#prJudul').textContent=this.k.judul;const p=Profil.p();$('#prInfo').textContent=this.tot()+' soal. Berlatih sebagai '+(p?p.n:'Anak')+'. Jawab sebaik-baiknya ya!';},
mulai(){Suara.buka();if(!Profil.p())Profil.pakai('Anak');this.i=0;this.skor=0;this.nb=0;this.no=0;this.maju();},
maju(){const q=this.k.soal[this.i];if(!q)return this.akhir();q.tipe==='slide'?this.slide(q):this.tanya(q);},
slide(q){show('s-prs');$('#prSJ').textContent=q.tanya;$('#prSI').textContent=q.isi||'';},
tanya(q){this.no++;this.sel=[];this.kt='';this.buka=true;this.w=q.waktu;show('s-prq');$('#prT').textContent=q.tanya;$('#prNo').textContent=this.no+' / '+this.tot();
if(q.tipe==='urut'){let a=q.opsi.map((_,k)=>k);for(let t=0;t<20;t++){a.sort(()=>Math.random()-.5);if(a.some((v,k)=>v!==k))break;}this.perm=a;}
const tm=q.tipe==='urut'?this.perm.map(i=>q.opsi[i]):q.opsi;
$('#prO').innerHTML=q.tipe==='ketik'?'':tm.map((o,k)=>`<button class="o o${k}" onclick="PR.pilih(${k})"><b>${S[k]}</b>${esc(o)}</button>`).join('');
$('#prM').hidden=!(q.tipe==='multi'||q.tipe==='urut');$('#prKetik').hidden=q.tipe!=='ketik';if(q.tipe==='ketik')$('#prKi').value='';
clearInterval(this.tm);$('#prW').textContent=this.w;this.tm=setInterval(()=>{this.w--;$('#prW').textContent=this.w;if(this.w<=0)this.jawab(true);},1000);},
bacakan(){const q=this.k.soal[this.i],t=q.tipe==='urut'?{tanya:q.tanya,opsi:this.perm.map(i=>q.opsi[i])}:q;Baca.ucap(Baca.soal(t));},
pilih(k){const q=this.k.soal[this.i];if(!this.buka)return;Suara.klik();if(q.tipe!=='multi'&&q.tipe!=='urut'){this.sel=[k];return this.jawab();}
const x=this.sel.indexOf(k);x<0?this.sel.push(k):this.sel.splice(x,1);
document.querySelectorAll('#prO .o').forEach((e,i)=>{const n=this.sel.indexOf(i);e.classList.toggle('pilih',n>=0);if(q.tipe==='urut')e.dataset.no=n>=0?n+1:'';});},
kirim(){const q=this.k.soal[this.i];if(!this.buka||!this.sel.length||(q.tipe==='urut'&&this.sel.length<q.opsi.length))return;this.jawab();},
kirimK(){const v=$('#prKi').value.trim();if(!this.buka||!v)return;this.kt=v;this.jawab();},
benar(q){if(q.tipe==='ketik')return Soal.cocok(q,this.kt||'');if(q.tipe==='urut')return this.sel.length===q.opsi.length&&this.sel.every((k,i)=>this.perm[k]===i);return [...this.sel].sort((a,b)=>a-b).join()===q.benar.join();},
kunci(q){return q.tipe==='ketik'?q.kunci.join(' / '):q.tipe==='urut'?q.opsi.join(' → '):q.benar.map(i=>S[i]+' '+q.opsi[i]).join('  •  ');},
jawab(habis){if(!this.buka)return;this.buka=false;clearInterval(this.tm);Baca.stop();const q=this.k.soal[this.i],ok=!habis&&this.benar(q);
if(ok){this.nb++;this.skor+=Skor.hitung(this.w,q.waktu);}Profil.jawab(ok);ok?Suara.benar():habis?Suara.habis():Suara.salah();
show('s-prh');document.body.dataset.hasil=ok?'ok':'no';$('#prV').textContent=habis?'Waktu habis! ⏰':ok?'Benar! 🎉':'Belum tepat 😅';
$('#kunciPr').textContent=ok?'':'Jawaban yang benar: '+this.kunci(q);Maskot.pasang('#mkPr',habis?'habis':ok?'benar':'salah',(Profil.p()||{}).n);},
lanjut(){this.i++;this.maju();},
akhir(){let d={};try{d=JSON.parse(localStorage.getItem('tebakseru-prbest'))||{};}catch(e){}const j=this.k.judul,lama=d[j]||0;
if(this.skor>lama){d[j]=this.skor;try{localStorage.setItem('tebakseru-prbest',JSON.stringify(d));}catch(e){}}
show('s-prakhir');Suara.selesai();$('#prHasil').innerHTML=`Benar ${this.nb} dari ${this.tot()}<br>Skor: ${this.skor}<br>Skor terbaik: ${Math.max(lama,this.skor)}`;
Maskot.pasang('#mkPa',this.nb*2>=this.tot()?'juara':'ikut',(Profil.p()||{}).n);Profil.selesai('pr',{benar:this.nb,jml:this.tot()});}};
if(PR.parse())PR.tampil();addEventListener('hashchange',()=>{if(PR.parse())PR.tampil();});
