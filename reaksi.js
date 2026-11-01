const Reaksi={E:['😂','😍','👏','😮','😢','🔥','🎉','👍'],t:0,
bar(){$('#reaksi').innerHTML=this.E.map((e,i)=>`<button onclick="Reaksi.kirim(${i})">${e}</button>`).join('');},
kirim(i){if(Date.now()-this.t<800)return;this.t=Date.now();Suara.klik();if(App.c)App.c.send({t:'reaksi',e:i});},
muncul(i,av,nama){const e=this.E[i];if(!e)return;const d=document.createElement('div');d.className='fl';d.style.left=(6+Math.random()*78)+'%';
d.innerHTML=`<div>${e}</div><small>${Avatar.html(av,24)} ${esc(nama)}</small>`;$('#float').appendChild(d);setTimeout(()=>d.remove(),3200);}};
Reaksi.bar();
