const NAMA={pg:'Pilihan ganda',bs:'Benar / Salah',multi:'Beberapa jawaban',slide:'Slide materi'};
const Edit={s:[],n:0,
async buka(id){this.all=await Soal.semua();this.k=this.all.find(x=>x.id===id);this.s=this.k.soal;this.n=0;$('#eJudul').value=this.k.judul;
$('.eBody').classList.toggle('pp',innerWidth>900);show('s-edit');this.gambar();},
tutup(){this.simpan();Pustaka.buka();},
q(){return this.s[this.n];},simpan(){Soal.simpanSemua(this.all);$('#eSimpan').textContent='✓ Tersimpan';},judul(v){this.k.judul=v;this.simpan();},
togProp(){$('.eBody').classList.toggle('pp');},
gambar(){const q=this.q(),m=q.tipe==='multi',t=q.tipe==='bs';
$('#dftSoal').innerHTML=this.s.map((x,i)=>`<div class="thumb ${i==this.n?'on':''}" onclick="Edit.pilih(${i})"><div class="tl">${i+1} &nbsp;${NAMA[x.tipe]}</div><div class="kt"><span class="wk">${x.waktu}</span><span class="tx">${esc((x.tanya||'Soal').slice(0,40))}</span>${x.gambar?'<span class="gm">🖼</span>':''}<div class="bar4">${x.opsi.map((_,k)=>`<i class="o${k}"></i>`).join('')}</div></div><div class="ik"><button title="Duplikat" onclick="event.stopPropagation();Edit.dup(${i})">⧉</button><button title="Hapus" onclick="event.stopPropagation();Edit.hapus(${i})">🗑</button></div></div>`).join('')+'<button class="tambah" onclick="Edit.tambah()">+ Tambahkan</button>';
$('#eTanya').value=q.tanya;$('#pTipe').value=q.tipe;$('#pWaktu').value=q.waktu;$('#pPoin').value=q.poin;
$('#eMedia').innerHTML=q.gambar?`<div class="med"><img src="${q.gambar}" alt=""><button onclick="Edit.hapusGbr()">✕ Hapus gambar</button></div>`:`<div class="med kosong" ondragover="event.preventDefault()" ondrop="Edit.drop(event)"><div class="plus" onclick="$('#fGbr').click()">+</div><p>Tambahkan gambar (opsional)</p><p><u onclick="$('#fGbr').click()">Unggah file</u> atau seret file ke sini</p></div>`;
$('#eOpsi').innerHTML=q.tipe==='slide'?`<textarea id="eIsi" rows="7" placeholder="Tulis materi atau penjelasan di sini..." oninput="Edit.isi(this.value)">${esc(q.isi||'')}</textarea>`:q.opsi.map((o,k)=>`<div class="o o${k}"><span class="sh">${S[k]}</span><input class="ot" value="${esc(o)}" ${t?'readonly':''} placeholder="Tambahkan jawaban ${k+1}" oninput="Edit.opsi(${k},this.value)"><label class="ck"><input type="${m?'checkbox':'radio'}" name="b" ${q.benar.includes(k)?'checked':''} onchange="Edit.benar(${k},this.checked)"><span></span></label></div>`).join('');},
pilih(i){this.n=i;this.gambar();},
tambah(){this.s.push(Soal.baru());this.n=this.s.length-1;this.simpan();this.gambar();},
dup(i){this.s.splice(i+1,0,JSON.parse(JSON.stringify(this.s[i])));this.n=i+1;this.simpan();this.gambar();},
hapus(i=this.n){if(this.s.length<2)return alert('Minimal harus ada satu soal');if(!confirm('Hapus soal '+(i+1)+'?'))return;
this.s.splice(i,1);this.n=Math.min(this.n,this.s.length-1);this.simpan();this.gambar();},
isi(v){this.q().isi=v;this.simpan();},
tanya(v){this.q().tanya=v;this.simpan();const b=document.querySelector('#dftSoal .on .tx');if(b)b.textContent=(v||'Soal').slice(0,40);},
opsi(k,v){this.q().opsi[k]=v;this.simpan();},
benar(k,on){const q=this.q();q.benar=q.tipe==='multi'?(on?[...new Set([...q.benar,k])]:q.benar.filter(x=>x!==k)).sort((a,b)=>a-b):[k];this.simpan();},
prop(){const q=this.q(),t=$('#pTipe').value;q.waktu=+$('#pWaktu').value;q.poin=+$('#pPoin').value;
if(t==='slide'){if(q.tipe!=='slide'){q.tipe='slide';q.opsi=[];q.benar=[];q.isi=q.isi||'';}this.simpan();this.gambar();return;}
if(t!==q.tipe){const isi=q.tipe==='bs'?[]:q.opsi.filter(x=>x),b=q.benar[0]??0;q.tipe=t;
if(t==='bs'){q.opsi=['Benar','Salah'];q.benar=[b>1?0:b];}else if(q.opsi.length<4){q.opsi=[...isi,'','','',''].slice(0,4);q.benar=[0];}else q.benar=[b];}
this.simpan();this.gambar();},
unggah(f){if(!f||!f.type.startsWith('image/'))return;const im=new Image(),u=URL.createObjectURL(f);
im.onload=()=>{const r=Math.min(1,640/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=im.width*r;c.height=im.height*r;
const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(im,0,0,c.width,c.height);URL.revokeObjectURL(u);
this.q().gambar=c.toDataURL('image/jpeg',.72);this.simpan();this.gambar();};im.src=u;},
drop(e){e.preventDefault();this.unggah(e.dataTransfer.files[0]);},
hapusGbr(){delete this.q().gambar;this.simpan();this.gambar();},
ekspor(){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify({judul:this.k.judul,soal:this.s},null,1)],{type:'application/json'}));a.download='soal-tebak-seru.json';a.click();}};
$('#fGbr').onchange=e=>{Edit.unggah(e.target.files[0]);e.target.value='';};
