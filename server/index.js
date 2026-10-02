import 'dotenv/config';
import http from 'node:http';
import { URL } from 'node:url';

const PORT = Number(process.env.PORT || 8787);
const TAVILY_URL = 'https://api.tavily.com/search';
const TELEGRAM = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN || ''}`;

const json = (res, status, body) => { res.writeHead(status, {'content-type':'application/json; charset=utf-8','access-control-allow-origin':'*'}); res.end(JSON.stringify(body)); };
const readBody = req => new Promise((resolve,reject)=>{ let data=''; req.on('data',c=>data+=c); req.on('end',()=>{try{resolve(data?JSON.parse(data):{})}catch(e){reject(e)}}); });

async function deepSearch(query, subject='Tümü') {
  const clean = `${query} KPSS önlisans ${subject !== 'Tümü' ? subject : ''}`.trim();
  if (process.env.TAVILY_API_KEY) {
    const r = await fetch(TAVILY_URL,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({api_key:process.env.TAVILY_API_KEY,query:clean,search_depth:'advanced,',include_answer:true,max_results:8,include_domains:['osym.gov.tr','meb.gov.tr']})});
    if (!r.ok) throw new Error(`Arama sağlayıcısı ${r.status} döndürdü`);
    const data=await r.json();
    return {query,answer:data.answer||'Kaynaklardan derlenen sonuçlar aşağıda.',sources:(data.results||[]).map(x=>({title:x.title,url:x.url,content:x.content,domain:new URL(x.url).hostname}))};
  }
  return {query,answer:'Deep Search bağlantısı hazır. Gerçek kaynak taraması için .env dosyasına TAVILY_API_KEY ekleyin. Demo arama sonucu yerine sistem bu noktada ÖSYM ve MEB kaynaklarını sorgular.',sources:[{title:'ÖSYM resmi sitesi',url:'https://www.osym.gov.tr/',domain:'osym.gov.tr',content:'Sınav takvimleri, kılavuzlar ve resmi duyurular için ÖSYM kaynağı.'},{title:'MEB resmi sitesi',url:'https://www.meb.gov.tr/',domain:'meb.gov.tr',content:'Eğitim mevzuatı ve güncel resmi içerikler için MEB kaynağı.'}]};
}
async function telegram(method, body) { if(!process.env.TELEGRAM_BOT_TOKEN) throw new Error('TELEGRAM_BOT_TOKEN eksik'); const r=await fetch(`${TELEGRAM}/${method}`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)}); return r.json(); }
function compact(text,max=3500){return text.length>max?text.slice(0,max-1)+'…':text}
async function runBot(){
 if(!process.env.TELEGRAM_BOT_TOKEN){console.log('Telegram bot kapalı: TELEGRAM_BOT_TOKEN tanımlı değil.');return}
 let offset=0; console.log('Telegram deep search bot çalışıyor.');
 while(true){try{const data=await telegram('getUpdates',{offset,timeout:25,allowed_updates:['message']}); for(const u of data.result||[]){offset=u.update_id+1; const msg=u.message; if(!msg?.text) continue; const text=msg.text.trim(); if(text==='/start'){await telegram('sendMessage',{chat_id:msg.chat.id,text:'Merhaba! KPSS Cepte Deep Search botuna hoş geldin.\n\nAramak için: /ara Osmanlı kültür ve medeniyeti\n\nKaynaklar ÖSYM ve MEB öncelikli taranır.'});continue} if(text==='/help'){await telegram('sendMessage',{chat_id:msg.chat.id,text:'Komutlar:\n/ara <konu> — güvenilir kaynaklarda ara\n/start — botu başlat'});continue} if(text.startsWith('/ara ')||text.startsWith('/search ')){const q=text.replace(/^\/(ara|search)\s+/,'').trim(); if(!q){await telegram('sendMessage',{chat_id:msg.chat.id,text:'Aramak istediğin konuyu yaz: /ara Türkiye coğrafyası'});continue} await telegram('sendChatAction',{chat_id:msg.chat.id,action:'typing'}); try{const out=await deepSearch(q); const sources=out.sources.slice(0,5).map((s,i)=>`${i+1}. ${s.title}\n${s.url}`).join('\n\n'); await telegram('sendMessage',{chat_id:msg.chat.id,text:compact(`🔎 ${q}\n\n${out.answer}\n\n📚 Kaynaklar\n${sources}`),disable_web_page_preview:true});}catch(e){await telegram('sendMessage',{chat_id:msg.chat.id,text:`Arama sırasında hata oluştu: ${e.message}`})}continue} await telegram('sendMessage',{chat_id:msg.chat.id,text:'Bir konu aramak için /ara komutunu kullan. Örnek: /ara anayasa temel haklar'}); }}catch(e){console.error('Telegram:',e.message);await new Promise(r=>setTimeout(r,3000));}}
}

const server=http.createServer(async(req,res)=>{const url=new URL(req.url,`http://${req.headers.host}`); if(req.method==='OPTIONS'){res.writeHead(204,{'access-control-allow-origin':'*','access-control-allow-methods':'GET,POST','access-control-allow-headers':'content-type'});return res.end()} if(url.pathname==='/api/health') return json(res,200,{ok:true,service:'kpss-cepte-api'}); if(url.pathname==='/api/search'&&req.method==='POST'){try{const body=await readBody(req); if(!body.query?.trim()) return json(res,400,{error:'Arama metni zorunlu'}); return json(res,200,await deepSearch(body.query,body.subject));}catch(e){return json(res,502,{error:e.message})}} json(res,404,{error:'Bulunamadı'});});
server.listen(PORT,'0.0.0.0',()=>console.log(`API http://0.0.0.0:${PORT}`));
runBot();
