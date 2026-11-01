const Skor={hitung:(sisa,total)=>Math.round(500+500*sisa/total),urut:ps=>Object.values(ps).sort((a,b)=>b.skor-a.skor)};
