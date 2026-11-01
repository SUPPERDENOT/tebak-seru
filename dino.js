const Dino={W:640,H:200,on:false,
stop(){cancelAnimationFrame(this.r);this.on=false;removeEventListener('keydown',this.kd);},
mulai(){this.stop();$('#gArea').innerHTML=`<p>Skor: <b id="dS">0</b> &nbsp;·&nbsp; Terbaik: ${Mini.best('dino')||0}</p><canvas id="dC" class="dino" width="${this.W}" height="${this.H}"></canvas><button class="big" onpointerdown="Dino.lompat()">🦘 Lompat!</button><p><small>Ketuk layar atau tombol, atau tekan spasi, untuk melompat.</small></p>`;
this.c=$('#dC');this.x=this.c.getContext('2d');this.y=0;this.v=0;this.o=[];this.s=0;this.sp=4;this.nx=120;this.on=true;
this.kd=e=>{if(e.code==='Space'||e.code==='ArrowUp'){e.preventDefault();this.lompat();}};addEventListener('keydown',this.kd);
this.c.onpointerdown=()=>this.lompat();this.last=performance.now();this.r=requestAnimationFrame(t=>this.loop(t));},
lompat(){if(this.on&&this.y===0){this.v=11;Suara.pip(620,.08,0,'square',.1);}},
loop(t){if(!this.on)return;const dt=Math.min(2,(t-this.last)/16.7);this.last=t;
this.v-=.6*dt;this.y=Math.max(0,this.y+this.v*dt);if(this.y===0&&this.v<0)this.v=0;
this.s+=dt*.1;this.sp=Math.min(12,4+this.s/30);this.nx-=this.sp*dt;
if(this.nx<=0){this.o.push({x:this.W+10});this.nx=200+Math.random()*160+this.sp*12;}
this.o.forEach(b=>b.x-=this.sp*dt);this.o=this.o.filter(b=>b.x>-40);
if(this.o.some(b=>b.x<80&&b.x+24>50&&this.y<30))return this.akhir();
this.gambar();$('#dS').textContent=Math.floor(this.s);this.r=requestAnimationFrame(t2=>this.loop(t2));},
gambar(){const x=this.x,g=160;x.fillStyle='#fff7e6';x.fillRect(0,0,this.W,this.H);x.fillStyle='#1f2a5c';x.fillRect(0,g,this.W,3);
x.font='38px serif';x.textBaseline='bottom';x.fillText('🦖',40,g-this.y);this.o.forEach(b=>x.fillText('🌵',b.x,g));},
akhir(){this.stop();const k=Math.floor(this.s);Suara.salah();Mini.rekor('dino',k,false);
$('#gArea').innerHTML=`<h2>Tertabrak kaktus! 🌵</h2><p>Skor kamu: <b>${k}</b> (terbaik: ${Mini.best('dino')})</p><div id="mkG"></div><button class="big" onclick="Dino.mulai()">Main lagi</button>`;Maskot.pasang('#mkG',k>=30?'benar':'ikut');}};
Mini.L.dino=Dino;
