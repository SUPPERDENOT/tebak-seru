const Mini={L:{},
dat(){try{return JSON.parse(localStorage.getItem('tebakseru-mini'))||{};}catch(e){return {};}},
best(k){return this.dat()[k];},
rekor(k,v,rendah){const d=this.dat();if(d[k]==null||(rendah?v<d[k]:v>d[k])){d[k]=v;try{localStorage.setItem('tebakseru-mini',JSON.stringify(d));}catch(e){}}},
buka(l){if(l!==undefined)this.dariLobi=!!l;Suara.buka();show('s-mini');const m=this.best('memori'),h=this.best('hitung'),dn=this.best('dino');$('#bDino').textContent=dn?'Skor terbaik: '+dn:'';
$('#bMem').textContent=m?'Terbaik: '+m+' langkah':'';$('#bHit').textContent=h?'Skor terbaik: '+h:'';},
kembali(){const l=this.dariLobi;this.dariLobi=false;show(l?'p-tunggu':'s-menu');},
henti(){Hitung.stop();Dino.stop();},
main(k){Suara.buka();show('s-game');this.L[k].mulai();},
keluar(){Hitung.stop();Dino.stop();this.buka();}};
