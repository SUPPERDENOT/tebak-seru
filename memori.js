const Memori={mulai(){const E=['🦁','🐼','🐸','🦊','🐙','🦄','🐢','🐬'];
this.k=[...E,...E].sort(()=>Math.random()-.5).map(e=>({e,o:false,m:false}));this.p=[];this.g=0;this.gambar();},
gambar(){$('#gArea').innerHTML=`<p>Langkah: ${this.g} &nbsp;·&nbsp; Terbaik: ${Mini.best('memori')||'-'}</p><div class="mem">${this.k.map((c,i)=>`<button class="${c.o||c.m?'buka':''}" onclick="Memori.klik(${i})">${c.o||c.m?c.e:'❓'}</button>`).join('')}</div>`;},
klik(i){const c=this.k[i];if(c.o||c.m||this.p.length>1)return;Suara.klik();c.o=true;this.p.push(i);
if(this.p.length===2){this.g++;const [a,b]=this.p.map(x=>this.k[x]);
if(a.e===b.e){a.m=b.m=true;a.o=b.o=false;this.p=[];Suara.pip(880,.12);if(this.k.every(x=>x.m))return this.selesai();}
else setTimeout(()=>{a.o=b.o=false;this.p=[];this.gambar();},800);}this.gambar();},
selesai(){Suara.benar();Mini.rekor('memori',this.g,true);
$('#gArea').innerHTML=`<h2>Hebat! 🎉</h2><p>Selesai dalam ${this.g} langkah</p><div id="mkG"></div><button class="big" onclick="Memori.mulai()">Main lagi</button>`;Maskot.pasang('#mkG','benar');}};
Mini.L.memori=Memori;
