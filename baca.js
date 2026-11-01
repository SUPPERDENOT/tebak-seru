const Baca={BN:['bintang','hati','bulat','segitiga'],
ucap(t){if(!t)return;try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang='id-ID';u.rate=.9;
const v=speechSynthesis.getVoices().find(x=>(x.lang||'').toLowerCase().startsWith('id'));if(v)u.voice=v;speechSynthesis.speak(u);}catch(e){}},
soal(q){return q.tanya+'. '+q.opsi.map((o,k)=>this.BN[k]+', '+o).join('. ');},
stop(){try{speechSynthesis.cancel();}catch(e){}}};
