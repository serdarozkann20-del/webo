import React, {useState} from 'react';
import { createRoot } from 'react-dom/client';
import { LayoutDashboard, BookOpen, ClipboardList, Sparkles, BarChart3, Settings, Search, Bell, ChevronDown, ChevronRight, ArrowUpRight, Play, Clock3, Target, CheckCircle2, MoreHorizontal, Menu, X, FileText, Database, Brain, ExternalLink, SlidersHorizontal } from 'lucide-react';
import './styles.css';

const subjects = [
  {name:'Türkçe', icon:'A', color:'coral', progress:68, topics:'12 / 18 konu', questions:'248 soru', desc:'Paragraf, dil bilgisi ve sözel mantık'},
  {name:'Matematik', icon:'√', color:'blue', progress:42, topics:'8 / 20 konu', questions:'186 soru', desc:'Temel kavramlar, problemler ve geometri'},
  {name:'Tarih', icon:'✦', color:'gold', progress:76, topics:'16 / 21 konu', questions:'312 soru', desc:'İlk Türk devletlerinden Cumhuriyet dönemine'},
  {name:'Coğrafya', icon:'⌁', color:'teal', progress:54, topics:'10 / 19 konu', questions:'164 soru', desc:'Türkiye’nin fiziki ve beşeri coğrafyası'},
  {name:'Vatandaşlık', icon:'§', color:'violet', progress:31, topics:'6 / 18 konu', questions:'118 soru', desc:'Hukuk başlangıcı ve anayasa bilgisi'},
  {name:'Güncel Bilgiler', icon:'◈', color:'orange', progress:20, topics:'3 / 15 konu', questions:'76 soru', desc:'2024–2025 önemli gelişmeler'},
];
const navItems = [
  {label:'Genel Bakış', icon:LayoutDashboard}, {label:'Dersler', icon:BookOpen, badge:'6'}, {label:'Soru Bankası', icon:ClipboardList}, {label:'Kodlamalı Çözüm', icon:Sparkles, new:true}, {label:'İlerlemem', icon:BarChart3}
];
function App(){
 const [active, setActive]=useState('Genel Bakış'); const [mobileOpen,setMobileOpen]=useState(false); const [search,setSearch]=useState(''); const [toast,setToast]=useState('');
 const notify=(text)=>{setToast(text);setTimeout(()=>setToast(''),2800)};
 return <div className="app">
   <aside className={mobileOpen?'sidebar open':'sidebar'}>
    <div className="brand"><div className="brand-mark">k<span>p</span></div><div><b>KPSS</b><small>CEPTE</small></div><button className="close" onClick={()=>setMobileOpen(false)}><X size={20}/></button></div>
    <div className="exam-pill"><span className="dot"></span><div><strong>2026 Önlisans</strong><small>Sınava 183 gün kaldı</small></div><ChevronDown size={15}/></div>
    <p className="nav-title">ÇALIŞMA ALANI</p>
    <nav>{navItems.map(({label,icon:Icon,badge,new:nw})=><button key={label} className={active===label?'nav-item active':'nav-item'} onClick={()=>{setActive(label);setMobileOpen(false)}}><Icon size={19}/><span>{label}</span>{badge&&<em>{badge}</em>}{nw&&<i>yeni</i>}</button>)}</nav>
    <p className="nav-title bottom-title">DİĞER</p><nav><button className="nav-item"><Settings size={19}/><span>Ayarlar</span></button><button className="nav-item"><FileText size={19}/><span>Yardım ve Destek</span></button></nav>
    <div className="sidebar-foot"><div className="mini-avatar">ED</div><div><strong>Elif Demir</strong><small>Hedef: 85 puan</small></div><MoreHorizontal size={18}/></div>
   </aside>
   <main className="main">
    <header className="topbar"><button className="hamburger" onClick={()=>setMobileOpen(true)}><Menu/></button><div className="breadcrumb"><span>Çalışma alanı</span><ChevronRight size={14}/><b>{active}</b></div><div className="top-actions"><div className="search"><Search size={18}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Konu, soru veya kaynak ara..."/><kbd>⌘ K</kbd></div><button className="icon-btn"><Bell size={19}/><span className="notification-dot"></span></button><div className="top-avatar">ED</div></div></header>
    <div className="content">
      <section className="welcome"><div><p className="eyebrow">SALI, 2 NİSAN 2025 <span></span> 14. GÜN</p><h1>Merhaba Elif, <span>bugün ne çalışıyoruz?</span></h1><p className="subcopy">Hedefine ulaşmak için küçük bir adım daha. İlerlemen çok iyi gidiyor.</p></div><button className="primary" onClick={()=>notify('Günün çalışma planı açıldı')}><Play size={16} fill="currentColor"/> Bugünkü plana başla</button></section>
      <section className="hero-card"><div className="hero-copy"><div className="label-chip"><Sparkles size={14}/> YAPAY ZEKA DESTEKLİ</div><h2>Aradığın her bilgi,<br/><span>tek bir yerde.</span></h2><p>ÖSYM kaynakları, çıkmış sorular ve güvenilir yayınlardan derlenen kişisel çalışma asistanın.</p><button className="light-btn" onClick={()=>notify('Deep Search açılıyor...')}><Search size={16}/> Deep Search ile keşfet <ArrowUpRight size={16}/></button></div><div className="hero-art"><div className="orbit orbit1"></div><div className="orbit orbit2"></div><div className="spark s1">✦</div><div className="spark s2">✦</div><div className="book"><BookOpen size={42}/><span>?</span></div><div className="source-card"><Database size={14}/><b>1.248</b><small>kaynak tarandı</small></div></div></section>
      <section className="stats"><div className="stat"><div className="stat-icon green"><Target size={19}/></div><div><small>GENEL İLERLEME</small><strong>% 48</strong><span className="positive">↑ %6 bu hafta</span></div></div><div className="stat"><div className="stat-icon yellow"><Clock3 size={19}/></div><div><small>TOPLAM ÇALIŞMA</small><strong>32s 45dk</strong><span>Bu ay</span></div></div><div className="stat"><div className="stat-icon purple"><CheckCircle2 size={19}/></div><div><small>ÇÖZÜLEN SORU</small><strong>1.104</strong><span className="positive">↑ 86 bu hafta</span></div></div><div className="stat goal-stat"><div><small>HAFTALIK HEDEF</small><strong>4 / 6 gün</strong><div className="tiny-progress"><i style={{width:'66%'}}></i></div></div><span className="goal-face">✺</span></div></section>
      <div className="section-heading"><div><p className="eyebrow">KONU TAKİBİ</p><h2>Dersler</h2></div><button className="text-btn" onClick={()=>setActive('Dersler')}>Tüm dersleri gör <ArrowUpRight size={16}/></button></div>
      <section className="subject-grid">{subjects.map(s=><article className="subject-card" key={s.name} onClick={()=>notify(`${s.name} çalışma alanı açıldı`)}><div className={'subject-icon '+s.color}>{s.icon}</div><div className="subject-top"><div><h3>{s.name}</h3><p>{s.desc}</p></div><ChevronRight size={17} className="card-arrow"/></div><div className="subject-meta"><span>{s.topics}</span><span>{s.questions}</span></div><div className="progress"><i style={{width:s.progress+'%'}}></i></div><div className="progress-foot"><span>İlerleme</span><b>%{s.progress}</b></div></article>)}</section>
      <section className="lower-grid"><div className="panel activity"><div className="panel-head"><div><p className="eyebrow">SON AKTİVİTELER</p><h2>Kaldığın yerden devam et</h2></div><button className="dots"><MoreHorizontal size={19}/></button></div><div className="activity-row"><div className="activity-icon blue"><BookOpen size={17}/></div><div><strong>Osmanlı Kültür ve Medeniyeti</strong><small>Tarih · Konu özeti</small></div><span>%72</span><button className="continue" onClick={()=>notify('Konu özeti açıldı')}>Devam et <ChevronRight size={15}/></button></div><div className="activity-row"><div className="activity-icon coral"><ClipboardList size={17}/></div><div><strong>Paragrafta Anlam</strong><small>Türkçe · 20 soruluk test</small></div><span>%40</span><button className="continue" onClick={()=>notify('Test başlatıldı')}>Devam et <ChevronRight size={15}/></button></div></div><div className="panel quote"><div className="quote-mark">“</div><p>Başarı, her gün tekrarlanan küçük çabaların toplamıdır.</p><small>— Robert Collier</small><div className="quote-dots"><i></i><i className="selected"></i><i></i></div></div></section>
      <footer><span><span className="status"></span> İçerikler güncel</span><span>Son senkronizasyon: 2 dk önce</span><span className="footer-links">Güvenilir kaynaklar <ExternalLink size={13}/></span></footer>
    </div>
    {toast&&<div className="toast"><CheckCircle2 size={18}/>{toast}</div>}
   </main>
 </div>
}
createRoot(document.getElementById('root')).render(<App/>);
