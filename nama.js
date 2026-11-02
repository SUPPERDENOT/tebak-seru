const Nama={A:['Kucing','Harimau','Panda','Kelinci','Gajah','Jerapah','Burung','Ikan','Singa','Koala','Bebek','Kuda'],B:['Ceria','Lucu','Pintar','Berani','Cepat','Gesit','Hebat','Ramah','Riang','Kuat'],
L:['bangsat','bajingan','kontol','ngentot','goblok','sialan','kampret','jancok','jancuk','brengsek','keparat','anjing','pantek'],
S:['asu','babi','bego','tolol','tai','taik','memek','pepek','bokep','tetek','setan','iblis','mampus','anjir','peler','cuki'],
acak(){return this.A[Math.random()*this.A.length|0]+' '+this.B[Math.random()*this.B.length|0];},
kasar(n){const t=String(n).toLowerCase().replace(/[0@]/g,'o').replace(/[1!|]/g,'i').replace(/3/g,'e').replace(/4/g,'a').replace(/5|\$/g,'s').replace(/7/g,'t');
const kata=t.split(/[^a-z]+/).filter(Boolean),rapat=t.replace(/[^a-z]/g,'');
return kata.some(k=>this.S.includes(k))||this.L.some(w=>rapat.includes(w));}};
