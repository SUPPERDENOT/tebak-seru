const Hitung={stop(){clearInterval(this.t);},
mulai(){this.stop();this.s=0;this.w=30;this.soal();this.gambar();this.t=setInterval(()=>{this.w--;const e=$('#hW');if(e)e.textContent=this.w;if(this.w<=0)this.selesai();},1000);},
soal(){const op=Math.random()<.5?'+':'-';let a=1+Math.random()*12|0,b=1+Math.random()*12|0;if(op==='-'&&b>a)[a,b]=[b,a];
this.j=op==='+'?a+b:a-b;this.q=a+' '+op+' '+b;const o=new Set([this.j]);while(o.size<4){const d=(Math.random()*7|0)-3;if(d&&this.j+d>=0)o.add(this.j+d);}
this.o=[...o].sort(()=>Math.random()-.5);},
gambar(){$('#gArea').innerHTML=`<p>⏱ <b id="hW">${this.w}</b> detik &nbsp;·&nbsp; Skor: <b>${this.s}</b></p><h1 class="raksasa">${this.q} = ?</h1><div class="grid">${this.o.map((v,k)=>`<button class="o o${k}" onclick="Hitung.pilih(${v})">${v}</button>`).join('')}</div>`;},
pilih(v){if(v===this.j){this.s++;Suara.benar();}else{this.s=Math.max(0,this.s-1);Suara.salah();}this.soal();this.gambar();},
selesai(){this.stop();Suara.selesai();Mini.rekor('hitung',this.s,false);
$('#gArea').innerHTML=`<h2>Waktu habis!</h2><p>Skor kamu: <b>${this.s}</b> (terbaik: ${Mini.best('hitung')})</p><div id="mkG"></div><button class="big" onclick="Hitung.mulai()">Main lagi</button>`;Maskot.pasang('#mkG',this.s>=8?'benar':'ikut');}};
Mini.L.hitung=Hitung;
