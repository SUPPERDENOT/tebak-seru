const Impor={hasil:null,
contoh:`Judul: Matematika Kelas 2

1. Berapa 2 + 3?
a. 4
b. 5*
c. 6
d. 7

[ketik] Berapa 10 - 4?
Jawaban: 6 / enam

[urut] Urutkan dari yang terkecil
a. 1
b. 5
c. 9
d. 12

[survei] Pelajaran apa yang paling kamu suka?
a. Matematika
b. Bahasa
c. Seni
d. Olahraga

[slide] Tahukah kamu?
Bilangan genap habis dibagi 2.

Benar atau salah: 4 adalah bilangan genap.
a. Benar*
b. Salah`,
prompt:`Buatkan 10 soal pilihan ganda untuk anak kelas 2 SD tentang [TULIS TOPIK DI SINI]. Tulis persis dengan format di bawah ini, tanpa penjelasan tambahan. Tanda * di akhir pilihan menandai jawaban yang benar. Bahasa sederhana dan singkat.

Judul: [nama kuis]

1. Pertanyaan pertama?
a. Pilihan
b. Pilihan yang benar*
c. Pilihan
d. Pilihan

2. Pertanyaan kedua?
a. Pilihan
b. Pilihan
c. Pilihan
d. Pilihan yang benar*

(Jenis lain yang boleh dipakai: [ketik] Pertanyaan? lalu baris "Jawaban: 5 / lima"; [urut] lalu a-d berisi urutan yang benar; [survei] tanpa tanda *; [slide] Judul lalu baris materi.)`,
buka(){show('s-impor');$('#imTeks').value='';$('#imHasil').innerHTML='';$('#imJudul').value='';$('#imBuat').hidden=true;this.hasil=null;},
isiContoh(){$('#imTeks').value=this.contoh;this.periksa();},
salinPerintah(){navigator.clipboard.writeText(this.prompt).then(()=>Lobi.toast('Perintah disalin! Tempel di chat Claude.'),()=>prompt('Salin perintah ini:',this.prompt));},
bukaFile(f){if(!f)return;const r=new FileReader();r.onload=()=>{$('#imTeks').value=String(r.result).slice(0,200000);this.periksa();};r.readAsText(f);},
huruf(s){return String(s||'').toUpperCase().match(/[A-D]/g)||[];},
buat(i,w){const nama=String(i.tanya||'').trim().slice(0,300),no=i.no;let tipe=(i.tipe||'').toLowerCase();if(tipe==='survei')tipe='poll';
if(!nama){w.push('Soal '+no+': pertanyaan kosong, dilewati');return null;}
const q={tipe:'pg',tanya:nama,opsi:[],benar:[],waktu:Math.min(90,Math.max(5,+i.waktu||20)),poin:1};
let op=(i.opsi||[]).map(x=>String(x||'').trim().slice(0,100));while(op.length&&!op[op.length-1])op.pop();
if(op.length>4){w.push('Soal '+no+': pilihan lebih dari 4, hanya 4 yang dipakai');op=op.slice(0,4);}
if(tipe==='slide'){q.tipe='slide';q.isi=String(i.isi||'').slice(0,2000);q.poin=0;q.opsi=[];return q;}
const tandai=[...(i.tandai||[])];
if(i.kunci&&!tandai.length&&op.length){const hs=this.huruf(i.kunci);if(hs.length&&String(i.kunci).replace(/[A-Da-d,\s&dan]/g,'')==='')hs.forEach(h=>tandai.push(h.charCodeAt(0)-65));else{const k=op.findIndex(o=>o.toLowerCase()===String(i.kunci).trim().toLowerCase());if(k>=0)tandai.push(k);}}
if(tipe==='ketik'||(!tipe&&!op.length&&i.kunci)){q.tipe='ketik';q.opsi=[];q.kunci=String(i.kunci||'').split(/\s*[\/|;]\s*|\s*,\s*/).map(s=>s.trim()).filter(Boolean).slice(0,10);if(!q.kunci.length)w.push('Soal '+no+': jawaban untuk soal ketik belum ada');return q;}
while(op.length<4)op.push('');
if(op.filter(Boolean).length<2)w.push('Soal '+no+': pilihan jawaban kurang dari 2');
q.opsi=op;
if(tipe==='urut'||tipe==='poll'){q.tipe=tipe;q.poin=tipe==='poll'?0:1;return q;}
q.benar=[...new Set(tandai)].filter(k=>k>=0&&k<4).sort();
if(!q.benar.length)w.push('Soal '+no+': belum ada jawaban benar (beri tanda * atau isi "Jawaban: B")');
const a=op[0].toLowerCase(),b=op[1].toLowerCase();
if(op.filter(Boolean).length===2&&((a==='benar'&&b==='salah')||(a==='salah'&&b==='benar'))){q.tipe='bs';q.opsi=[op[0],op[1]];}
else q.tipe=q.benar.length>1?'multi':'pg';
return q;},
teks(t,w){const k=[];let n=0;
t.split(/\n\s*\n/).forEach(blok=>{const L=blok.split('\n').map(s=>s.trim()).filter(Boolean);if(!L.length)return;let f=L.shift(),tipe='';const m=f.match(/^\[(ketik|urut|survei|poll|slide|multi)\]\s*(.*)$/i);if(m){tipe=m[1].toLowerCase();f=m[2];}
f=f.replace(/^\d+\s*[.)]\s*/,'').trim();n++;const i={no:n,tipe,tanya:f,opsi:[],tandai:[],isi:[]};
L.forEach(s=>{let x;if(x=s.match(/^(?:waktu|detik)\s*:\s*(\d+)/i))i.waktu=+x[1];else if(x=s.match(/^(?:jawaban|kunci)\s*:\s*(.+)$/i))i.kunci=x[1];
else if(x=s.match(/^([a-d])\s*[.)]\s*(.*)$/i)){let o=x[2].trim();if(/\*\s*$/.test(o)){i.tandai.push(i.opsi.length);o=o.replace(/\*\s*$/,'').trim();}i.opsi.push(o);}else i.isi.push(s);});
i.isi=i.isi.join('\n');const q=this.buat(i,w);if(q)k.push(q);});
return k;},
csv(baris,w){const d=['\t',';',','].map(c=>[c,baris[0].split(c).length]).sort((a,b)=>b[1]-a[1])[0][0];
const sp=l=>{const r=[];let c='',q=false;for(let i=0;i<l.length;i++){const ch=l[i];if(ch==='"'){if(q&&l[i+1]==='"'){c+='"';i++;}else q=!q;}else if(ch===d&&!q){r.push(c);c='';}else c+=ch;}r.push(c);return r.map(x=>x.trim());};
const H=sp(baris[0]).map(x=>x.toLowerCase()),ix=(...n)=>H.findIndex(h=>n.includes(h)),I={t:ix('jenis','tipe'),q:ix('soal','tanya','pertanyaan'),a:ix('a'),b:ix('b'),c:ix('c'),d:ix('d'),j:ix('jawaban','benar','kunci'),w:ix('waktu','detik')};
const k=[];baris.slice(1).forEach((l,r)=>{if(!l.trim())return;const c=sp(l),g=x=>x>=0?(c[x]||''):'';
const q=this.buat({no:r+1,tipe:g(I.t),tanya:g(I.q),opsi:[g(I.a),g(I.b),g(I.c),g(I.d)],kunci:g(I.j),waktu:g(I.w),isi:g(I.j)},w);if(q)k.push(q);});return k;},
parse(t){const w=[];t=String(t||'').replace(/\r/g,'').trim();if(!t)return {judul:'',k:[],w:['Teks masih kosong']};
let judul='';const m=t.match(/^\s*judul\s*:\s*(.+)$/im);if(m){judul=m[1].trim().slice(0,60);t=t.replace(m[0],'').trim();}
const baris=t.split('\n'),h=baris[0].toLowerCase();let k;
if(/[\t;,]/.test(h)&&/(^|[\t;,])\s*(soal|tanya|pertanyaan)\s*([\t;,]|$)/.test(h))k=this.csv(baris,w);else k=this.teks(t,w);
if(k.length>100){w.push('Lebih dari 100 soal, hanya 100 pertama yang diambil');k=k.slice(0,100);}
if(!k.length&&!w.length)w.push('Tidak ada soal yang terbaca. Cek formatnya.');
return {judul,k,w};},
periksa(){const r=this.parse($('#imTeks').value);this.hasil=r;if(r.judul&&!$('#imJudul').value)$('#imJudul').value=r.judul;
const N={pg:'Pilihan ganda',bs:'Benar/Salah',multi:'Beberapa jawaban',ketik:'Ketik',urut:'Urutkan',poll:'Survei',slide:'Slide'};
$('#imHasil').innerHTML=(r.k.length?'<p><b>'+r.k.length+' soal terbaca.</b></p>':'')+(r.w.length?'<div class="imw">'+r.w.map(x=>'<div>⚠ '+esc(x)+'</div>').join('')+'</div>':'')+
r.k.map((q,i)=>'<div class="imq"><b>'+(i+1)+'.</b> <small>'+N[q.tipe]+'</small> '+esc(q.tanya)+(Soal.masalah(q)?' <span class="bad">⚠</span>':'')+'</div>').join('');
$('#imBuat').hidden=!r.k.length;},
buatKuis(){if(!this.hasil||!this.hasil.k.length)return;const j=($('#imJudul').value||this.hasil.judul||'Kuis impor').trim().slice(0,60);
Soal.semua().then(a=>{const k={id:Soal.id(),judul:j,soal:this.hasil.k.map(x=>Soal.norm(x))};a.push(k);Soal.simpanSemua(a);Edit.buka(k.id);});},
templat(){const L=['jenis;soal;a;b;c;d;jawaban;waktu','pg;Berapa 2 + 3?;4;5;6;7;B;20','pg;Hewan berkaki empat?;Kucing;Burung;Ikan;Ular;A;20','ketik;Berapa 10 - 4?;;;;;6 / enam;20','urut;Urutkan dari terkecil;1;5;9;12;;20','survei;Warna favorit?;Merah;Biru;Hijau;Kuning;;20','slide;Tahukah kamu?;;;;;Bilangan genap habis dibagi 2.;'];
const a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['\ufeff'+L.join('\r\n')],{type:'text/csv;charset=utf-8'}));a.download='template-soal-tebak-seru.csv';a.click();}};
document.getElementById('imFile').onchange=e=>{Impor.bukaFile(e.target.files[0]);e.target.value='';};
