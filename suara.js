const Suara={vol:.6,mute:false,ctx:null,lp:null,st:0,
pip(f,d=.15,t=0,tp='triangle',g=.3){if(this.mute||!f)return;try{this.ctx=this.ctx||new (window.AudioContext||window.webkitAudioContext)();const c=this.ctx;c.resume();
const o=c.createOscillator(),k=c.createGain(),s=c.currentTime+t,v=Math.max(.0002,this.vol*g);o.type=tp;o.frequency.value=f;
o.connect(k);k.connect(c.destination);k.gain.setValueAtTime(v,s);k.gain.exponentialRampToValueAtTime(.0001,s+d);o.start(s);o.stop(s+d);}catch(e){}},
tik(){this.pip(660,.12);},mulai(){[523,659,784].forEach((f,i)=>this.pip(f,.18,i*.12));},
selesai(){[784,659,523,659,784,1047].forEach((f,i)=>this.pip(f,.22,i*.14));},
musik(ms=240){this.stop();const B=[110,110,130.8,110,98,98,123.5,98],L=[0,440,0,523.3,0,466.2,0,415.3];
this.lp=setInterval(()=>{const i=this.st++%8;this.pip(B[i],ms/1000*.9,0,'sawtooth',.16);if(L[i])this.pip(L[i],.09,0,'square',.07);if(i%2==0)this.pip(1760,.03,0,'square',.04);},ms);},
stop(){clearInterval(this.lp);this.lp=null;},
buka(){try{this.ctx=this.ctx||new (window.AudioContext||window.webkitAudioContext)();this.ctx.resume();}catch(e){}},
klik(){this.pip(900,.05,0,'square',.08);},
benar(){[523,659,784,1047].forEach((f,i)=>this.pip(f,.16,i*.1));},
salah(){this.pip(220,.25,0,'sawtooth',.2);this.pip(165,.4,.22,'sawtooth',.2);},
habis(){[0,.2,.4].forEach(t=>this.pip(880,.12,t,'square',.12));[392,330,262,196].forEach((f,i)=>this.pip(f,.2,.7+i*.18,'sawtooth',.14));}};
