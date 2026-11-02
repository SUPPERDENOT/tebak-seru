const Tema={i:0,L:[
{n:'Klasik',bg:'radial-gradient(circle at 20% 0,#3b2f8f 0,#1f2a5c 45%,#141c42 100%)',m:'#1f2a5c',e:['★','●','▲','♥']},
{n:'Luar Angkasa',bg:'radial-gradient(circle at 80% 10%,#4b1d8f 0,#150d3a 50%,#05031a 100%)',m:'#150d3a',e:['🚀','🪐','⭐','🌙','👽']},
{n:'Hutan',bg:'linear-gradient(160deg,#1f6b3a,#0e3b24)',m:'#0e3b24',e:['🌳','🦋','🍃','🐛','🦉']},
{n:'Laut',bg:'linear-gradient(180deg,#1a8fd1,#0a3d7a)',m:'#0a3d7a',e:['🐠','🐙','🐚','🐳','🦀']},
{n:'Dinosaurus',bg:'linear-gradient(160deg,#9a5b13,#4d2c0a)',m:'#4d2c0a',e:['🦖','🦕','🌋','🥚','🌴']},
{n:'Pelangi',bg:'linear-gradient(160deg,#d6409f,#6a2bb0)',m:'#6a2bb0',e:['🌈','🦄','☁️','🍭','🎈']}],
muat(){let v=0;try{v=+localStorage.getItem('tebakseru-tema')||0;}catch(e){}
$('#cTema').innerHTML=this.L.map((t,i)=>`<option value="${i}">${t.n}</option>`).join('');this.pasang(v,false);},
pasang(i,simpan){i=this.L[i]?i:0;this.i=i;const t=this.L[i],r=document.documentElement.style;r.setProperty('--malam',t.m);r.setProperty('--bgtema',t.bg);
$('#bgT').innerHTML=Array.from({length:8},(_,k)=>`<i style="left:${4+k*12}%;animation-delay:-${k*1.7}s">${t.e[k%t.e.length]}</i>`).join('');
$('#cTema').value=i;if(simpan){try{localStorage.setItem('tebakseru-tema',i);}catch(e){}}}};
Tema.muat();
Tema.buka=function(){show('s-tema');this.daftar();};
Tema.daftar=function(){$('#temaIsi').innerHTML=this.L.map((t,i)=>`<div class="kartu tc ${i==this.i?'on':''}" style="background:${t.bg}"><div class="em">${t.e.slice(0,4).join(' ')}</div><h3>${t.n}</h3><button class="big" onclick="Tema.pilih(${i})">${i==this.i?'Dipakai ✓':'Pakai'}</button></div>`).join('');};
Tema.pilih=function(i){this.pasang(i,true);this.daftar();};
