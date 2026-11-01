const Avatar={H:['🦁','🐯','🐼','🐨','🐵','🐸','🐰','🦊','🐶','🐱','🐻','🐷','🐮','🦄','🐙','🐧','🦉','🐢','🦖','🐬','🦋','🐝','🐞','🐘','🦒','🦓','🐊','🦜','🦈','🐳'],
W:['#ff5c8a','#ffb020','#1fcf9f','#4aa3ff','#9b6bff','#ff8a3d','#e84545','#2ec4b6','#8ac926','#f15bb5','#00bbf9','#b5838d'],
A:['','👑','🎩','🧢','🎀','😎','🎧','⭐','🌸','🎓'],a:{h:0,w:0,a:0},t:{},
ok(s){s=s||{};const i=(v,n)=>Number.isInteger(v)&&v>=0&&v<n?v:0;return {h:i(s.h,this.H.length),w:i(s.w,this.W.length),a:i(s.a,this.A.length)};},
html(s,px=48){s=this.ok(s);return `<span class="av" style="width:${px}px;height:${px}px;background:${this.W[s.w]};font-size:${px*.6}px"><b>${this.H[s.h]}</b>${s.a?`<i style="font-size:${px*.42}px">${this.A[s.a]}</i>`:''}</span>`;},
rnd(){const r=n=>Math.random()*n|0;return {h:r(this.H.length),w:r(this.W.length),a:r(this.A.length)};},
muat(){let s=null;try{s=JSON.parse(localStorage.getItem('tebakseru-avatar'));}catch(e){}this.a=s?this.ok(s):this.rnd();},
buka(){this.t={...this.a};show('s-avatar');this.gambar();},
gambar(){const t=this.t;$('#avPrev').innerHTML=this.html(t,120);
$('#avH').innerHTML=this.H.map((e,i)=>`<button class="${i==t.h?'on':''}" onclick="Avatar.set('h',${i})">${e}</button>`).join('');
$('#avW').innerHTML=this.W.map((c,i)=>`<button class="${i==t.w?'on':''}" style="background:${c}" onclick="Avatar.set('w',${i})"></button>`).join('');
$('#avA').innerHTML=this.A.map((e,i)=>`<button class="${i==t.a?'on':''}" onclick="Avatar.set('a',${i})">${e||'✕'}</button>`).join('');},
set(k,i){this.t[k]=i;this.gambar();},acak(){this.t=this.rnd();this.gambar();},
simpan(){this.a=this.t;try{localStorage.setItem('tebakseru-avatar',JSON.stringify(this.a));}catch(e){}this.menu();show('s-menu');},
menu(){$('#avMenu').innerHTML=this.html(this.a,40);}};
Avatar.muat();Avatar.menu();
