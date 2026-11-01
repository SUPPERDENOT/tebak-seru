const Baca={BN:['bintang','hati','bulat','segitiga'],v:null,q:[],aud:null,
cari(){try{const a=speechSynthesis.getVoices().filter(x=>/^id[-_]/i.test(x.lang||'')||/indones/i.test(x.name||''));
this.v=a.find(x=>/natural|online/i.test(x.name))||a.find(x=>/google/i.test(x.name))||a[0]||null;}catch(e){this.v=null;}},
info(){this.cari();return this.v?'Suara bahasa Indonesia: '+this.v.name:'Suara bahasa Indonesia tidak ditemukan di perangkat ini, dipakai suara online (butuh internet).';},
ucap(t){if(!t)return;this.stop();this.cari();
if(this.v){try{const u=new SpeechSynthesisUtterance(t);u.voice=this.v;u.lang=this.v.lang;u.rate=.95;speechSynthesis.speak(u);return;}catch(e){}}
this.online(t);},
online(t){const q=[];(t.match(/[^.!?]+[.!?]?/g)||[t]).forEach(s=>{s=s.trim();while(s.length>180){let i=s.lastIndexOf(' ',180);if(i<1)i=180;q.push(s.slice(0,i));s=s.slice(i).trim();}if(s)q.push(s);});this.q=q;this.main();},
main(){const s=this.q.shift();if(!s)return;const a=this.aud=new Audio('https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=id&q='+encodeURIComponent(s));a.onended=()=>this.main();a.play().catch(()=>{});},
soal(q){return q.tanya+'. '+q.opsi.map((o,k)=>this.BN[k]+', '+o).join('. ');},
stop(){this.q=[];try{speechSynthesis.cancel();}catch(e){}try{if(this.aud)this.aud.pause();}catch(e){}this.aud=null;}};
try{speechSynthesis.onvoiceschanged=()=>Baca.cari();}catch(e){}Baca.cari();
