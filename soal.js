const Soal={K:'tebakseru-kuis',
id:()=>Date.now().toString(36)+Math.random().toString(36).slice(2,6),
norm:q=>({tipe:q.tipe||(q.opsi.length==2?'bs':'pg'),tanya:String(q.tanya||''),opsi:q.opsi.map(String),benar:[].concat(q.benar).sort((a,b)=>a-b),waktu:q.waktu||20,poin:q.poin??1,gambar:/^data:image\//.test(q.gambar||'')?q.gambar:undefined,isi:q.tipe==='slide'?String(q.isi||'').slice(0,2000):undefined}),
baru:()=>({tipe:'pg',tanya:'',opsi:['','','',''],benar:[0],waktu:20,poin:1}),
kuisBaru(){return {id:this.id(),judul:'Kuis Baru',soal:[this.baru()]};},
async semua(){let raw=null;try{raw=localStorage.getItem(this.K);}catch(e){}
if(raw!==null){try{const s=JSON.parse(raw);if(Array.isArray(s))return s.map(k=>({id:k.id,judul:k.judul||'',main:k.main||0,terakhir:k.terakhir||0,soal:k.soal.map(q=>this.norm(q))}));}catch(e){}}
let lama=null;try{lama=JSON.parse(localStorage.getItem('tebakseru-soal'));}catch(e){}
if(!Array.isArray(lama)||!lama.length)lama=await (await fetch('data/soal-contoh.json')).json();
const k=[{id:this.id(),judul:'Contoh Kuis',soal:lama.map(q=>this.norm(q))}];this.simpanSemua(k);return k;},
async catat(id){const a=await this.semua(),k=a.find(x=>x.id===id);if(k){k.main=(k.main||0)+1;k.terakhir=Date.now();this.simpanSemua(a);}},
simpanSemua(a){try{localStorage.setItem(this.K,JSON.stringify(a));}catch(e){}},
cek(s){if(!s.some(q=>q.tipe!=='slide'))return 'Kuis belum punya soal (hanya slide)';for(const [i,q] of s.entries()){if(q.tipe==='slide'){if(!q.tanya.trim())return `Slide ${i+1}: judul masih kosong`;continue;}if(!q.tanya.trim())return `Soal ${i+1}: pertanyaan masih kosong`;
if(q.opsi.some(o=>!o.trim()))return `Soal ${i+1}: ada pilihan jawaban yang kosong`;if(!q.benar.length)return `Soal ${i+1}: belum ada jawaban benar`;}return '';}};
