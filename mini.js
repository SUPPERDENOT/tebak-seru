const Mini={L:{},
dat(){try{return JSON.parse(localStorage.getItem('tebakseru-mini'))||{};}catch(e){return {};}},
best(k){return this.dat()[k];},
rekor(k,v,rendah){const d=this.dat();if(d[k]==null||(rendah?v<d[k]:v>d[k])){d[k]=v;try{localStorage.setItem('tebakseru-mini',JSON.stringify(d));}catch(e){}}},
buka(){Suara.buka();show('s-mini');const m=this.best('memori'),h=this.best('hitung');
$('#bMem').textContent=m?'Terbaik: '+m+' langkah':'';$('#bHit').textContent=h?'Skor terbaik: '+h:'';},
main(k){Suara.buka();show('s-game');this.L[k].mulai();},
keluar(){Hitung.stop();this.buka();}};
