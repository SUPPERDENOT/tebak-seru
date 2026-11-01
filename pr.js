const PR={k:null,
parse(){const m=location.hash.match(/^#pr=([\w-]+)$/);if(!m)return false;
try{let b=m[1].replace(/-/g,'+').replace(/_/g,'/');while(b.length%4)b+='=';const d=JSON.parse(decodeURIComponent(escape(atob(b))));
const s=(d.s||[]).slice(0,50).map(x=>{const q=Soal.norm({tipe:x.t,tanya:String(x.q||'').slice(0,300),opsi:(x.o||[]).slice(0,4).map(v=>String(v).slice(0,100)),benar:x.b,waktu:Math.min(90,Math.max(5,+x.w||20))});
q.benar=q.benar.filter(i=>Number.isInteger(i)&&i>=0&&i<q.opsi.length);return q;}).filter(q=>q.tanya&&q.opsi.length>=2&&q.benar.length);
if(!s.length)return false;this.k={judul:String(d.j||'Latihan').slice(0,60),soal:s};return true;}catch(e){return false;}},
tampil(){show('s-pr');$('#prJudul').textContent=this.k.judul;$('#prInfo').textContent=this.k.soal.length+' soal. Jawab sebaik-baiknya ya!';},
mulai(){Suara.buka();this.i=0;this.skor=0;this.nb=0;this.tanya();},
tanya(){const q=this.k.soal[this.i];this.sel=[];this.buka=true;this.w=q.waktu;show('s-prq');$('#prT').textContent=q.tanya;
$('#prNo').textContent=(this.i+1)+' / '+this.k.soal.length;$('#prM').hidden=q.tipe!=='multi';
$('#prO').innerHTML=q.opsi.map((o,k)=>`<button class="o o${k}" onclick="PR.pilih(${k})"><b>${S[k]}</b>${esc(o)}</button>`).join('');
clearInterval(this.tm);$('#prW').textContent=this.w;this.tm=setInterval(()=>{this.w--;$('#prW').textContent=this.w;if(this.w<=0)this.jawab(true);},1000);},
bacakan(){Baca.ucap(Baca.soal(this.k.soal[this.i]));},
pilih(k){const q=this.k.soal[this.i];if(!this.buka)return;Suara.klik();if(q.tipe!=='multi'){this.sel=[k];return this.jawab();}
const x=this.sel.indexOf(k);x<0?this.sel.push(k):this.sel.splice(x,1);document.querySelectorAll('#prO .o')[k].classList.toggle('pilih');},
jawab(habis){if(!this.buka)return;this.buka=false;clearInterval(this.tm);Baca.stop();const q=this.k.soal[this.i],s=[...this.sel].sort((a,b)=>a-b),ok=!habis&&s.join()===q.benar.join();
if(ok){this.nb++;this.skor+=Skor.hitung(this.w,q.waktu);}ok?Suara.benar():habis?Suara.habis():Suara.salah();
show('s-prh');document.body.dataset.hasil=ok?'ok':'no';$('#prV').textContent=habis?'Waktu habis! ⏰':ok?'Benar! 🎉':'Belum tepat 😅';
$('#kunciPr').textContent=ok?'':'Jawaban yang benar: '+q.benar.map(i=>S[i]+' '+q.opsi[i]).join('  •  ');Maskot.pasang('#mkPr',habis?'habis':ok?'benar':'salah');},
lanjut(){this.i++;if(this.i>=this.k.soal.length)return this.akhir();this.tanya();},
akhir(){let d={};try{d=JSON.parse(localStorage.getItem('tebakseru-prbest'))||{};}catch(e){}const j=this.k.judul,lama=d[j]||0;
if(this.skor>lama){d[j]=this.skor;try{localStorage.setItem('tebakseru-prbest',JSON.stringify(d));}catch(e){}}
show('s-prakhir');Suara.selesai();$('#prHasil').innerHTML=`Benar ${this.nb} dari ${this.k.soal.length}<br>Skor: ${this.skor}<br>Skor terbaik: ${Math.max(lama,this.skor)}`;
Maskot.pasang('#mkPa',this.nb*2>=this.k.soal.length?'juara':'ikut');}};
if(PR.parse())PR.tampil();addEventListener('hashchange',()=>{if(PR.parse())PR.tampil();});
