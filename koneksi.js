const O={username:'82c7ef6ed01f666a5684f559',credential:'o0WlgB4YprDMYUgw'};
const ICE={iceServers:[{urls:'stun:stun.relay.metered.ca:80'},
{urls:'turn:global.relay.metered.ca:80',...O},{urls:'turn:global.relay.metered.ca:80?transport=tcp',...O},
{urls:'turn:global.relay.metered.ca:443',...O},{urls:'turns:global.relay.metered.ca:443?transport=tcp',...O}]};
const Konek={
host(onMsg,cb){const mk=()=>{const k=String(1000+Math.random()*9000|0),p=new Peer('tebakseru-'+k,{config:ICE});
p.on('open',()=>cb(k));p.on('error',e=>{if(e.type==='unavailable-id')mk();else alert('Error host: '+e.type);});
p.on('connection',c=>{c.on('data',d=>onMsg(c,d));});this.p=p;};mk();},
gabung(kode,onMsg,onOpen,onErr,st){let done=false,tahap='menghubungi server';
const gagal=m=>{if(!done){done=true;onErr(m);}};st('1/3 Menghubungi server...');
try{this.pc&&this.pc.destroy();}catch(e){}const p=new Peer({config:ICE});this.pc=p;
const tm=setTimeout(()=>gagal('Waktu habis, macet di tahap: '+tahap),25000);
p.on('open',()=>{tahap='membuka jalur ke host';st('2/3 Menyambung ke host...');
const c=p.connect('tebakseru-'+kode,{reliable:true});
c.on('open',()=>{done=true;clearTimeout(tm);onOpen(c);});c.on('data',onMsg);
c.on('close',()=>onErr('Terputus dari host'));});
p.on('error',e=>{clearTimeout(tm);gagal(e.type==='peer-unavailable'?'Kode tidak ditemukan':'Error: '+e.type+' (tahap: '+tahap+')');});}};
