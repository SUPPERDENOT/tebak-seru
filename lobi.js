const Lobi={l:[],mt:false,mode:'',siapSaya:false,nPrev:null,
toast(t){const e=$('#toast');e.textContent=t;e.hidden=false;clearTimeout(this.tt);this.tt=setTimeout(()=>{e.hidden=true;},2500);},
bagi(){if(App.sedang||App.i>=0)return;App.kirim({t:'daftar',m:$('#cTim').checked?1:0,l:Object.values(App.ps).map(p=>({n:p.nama,a:p.av,s:p.siap?1:0,t:p.timPilih&&p.tim!=null?p.tim:-1}))});},
host(c,d){const p=App.ps[c.tok];if(!p||App.sedang||App.i>=0)return;
if(d.t==='siap')p.siap=!!d.v;
else if(d.t==='avatar'&&!p.siap)p.av=Avatar.ok(d.av);
else if(d.t==='pilihtim'&&!p.siap&&$('#cTim').checked&&Number.isInteger(d.i)&&d.i>=0&&d.i<2){p.tim=d.i;p.timPilih=true;p.c.send({t:'tim',i:d.i});}
App.daftar();},
segar(){const L=Object.values(App.ps);$('#siapInfo').textContent='✋ '+L.filter(p=>p.siap).length+' / '+L.length+' siap';if(!$('#modal').hidden&&this.mode==='siap')this.isiSiap();},
panelSiap(){this.mode='siap';$('#mJudul').textContent='Daftar siap';this.isiSiap();$('#modal').hidden=false;},
isiSiap(){const L=Object.values(App.ps);$('#mIsi').innerHTML=L.map(p=>`<div class="brs">${Avatar.html(p.av,36)} <b>${esc(p.nama)}</b><span>${p.siap?'✅ Siap':'⏳ Belum'}</span></div>`).join('')||'<p>Belum ada peserta.</p>';},
daftar(d){this.l=Array.isArray(d.l)?d.l:[];this.mt=!!d.m;
if(this.nPrev!=null&&this.l.length>this.nPrev){const b=this.l[this.l.length-1];if(b&&b.n!==App.namaku)this.toast(b.n+' sudah masuk! 🎉');}this.nPrev=this.l.length;
const s=this.l.find(x=>x.n===App.namaku);this.siapSaya=!!(s&&s.s);
$('#nTeman').textContent=this.l.length;$('#lobiTim').hidden=!this.mt;$('#bSiap').textContent=this.siapSaya?'✅ Siap! (ketuk untuk batal)':'✋ Aku siap!';
['bAv','bT0','bT1'].forEach(i=>{$('#'+i).disabled=this.siapSaya;});$('#bT0').classList.toggle('on',!!s&&s.t===0);$('#bT1').classList.toggle('on',!!s&&s.t===1);
if(!$('#modal').hidden&&this.mode==='teman')this.isiTeman();},
siap(){Suara.klik();if(App.c)App.c.send({t:'siap',v:!this.siapSaya});},
pilihTim(i){Suara.klik();if(App.c)App.c.send({t:'pilihtim',i});},
panelTeman(){this.mode='teman';$('#mJudul').textContent='Teman yang sudah masuk';this.isiTeman();$('#modal').hidden=false;},
isiTeman(){$('#mIsi').innerHTML=this.l.map(x=>`<div class="brs">${Avatar.html(x.a,36)} <b>${esc(x.n)}</b><span>${x.s?'✅ ':''}${x.t>=0?TIM[x.t].e:''}</span></div>`).join('')||'<p>Belum ada teman.</p>';}};
const Gambar={w:320,h:380,warna:'#1f2a5c',x:null,on:false,
buka(){show('s-gambar');const c=$('#gC');if(!this.x){this.x=c.getContext('2d');this.hapus();this.x.lineCap='round';this.x.lineJoin='round';this.x.lineWidth=6;
const pos=e=>{const r=c.getBoundingClientRect();return [(e.clientX-r.left)*c.width/r.width,(e.clientY-r.top)*c.height/r.height];};
c.onpointerdown=e=>{this.on=true;const [a,b]=pos(e);this.x.strokeStyle=this.warna;this.x.beginPath();this.x.moveTo(a,b);this.x.lineTo(a+.1,b);this.x.stroke();try{c.setPointerCapture(e.pointerId);}catch(_){}};
c.onpointermove=e=>{if(!this.on)return;const [a,b]=pos(e);this.x.lineTo(a,b);this.x.stroke();};c.onpointerup=c.onpointercancel=()=>{this.on=false;};}
this.palet();},
palet(){const W=['#1f2a5c','#e84545','#ff8a3d','#ffd23f','#1fcf9f','#4aa3ff','#9b6bff','#ffffff'];
$('#gPal').innerHTML=W.map(c=>`<button class="${c===this.warna?'on':''}" style="background:${c}" onclick="Gambar.pilih('${c}')"></button>`).join('');},
pilih(c){this.warna=c;this.x.lineWidth=c==='#ffffff'?22:6;this.palet();},
hapus(){this.x.fillStyle='#fff';this.x.fillRect(0,0,this.w,this.h);}};
