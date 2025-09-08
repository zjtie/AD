// Behavior Journal v4 — main.js (floating panels + calendar + lightbox + backup)
const { createApp, reactive, ref, computed, onMounted, watch } = Vue;

/* ---------- Utils ---------- */
const Utils = {
  uuid(){ return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,c=>(c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c/4).toString(16)); },
  toMinutes(t){ if(!t) return null; const [h,m]=t.split(':').map(Number); return h*60+m; },
  durationMs(s,e){ const sm=this.toMinutes(s), em=this.toMinutes(e); if(sm==null||em==null) return 0; let d=em-sm; if(d<0) d+=1440; return d*60000; },
  minutes(ms){ return Math.max(0, Math.round(ms/60000)); },
  durationDisplay(ms){ const mins=Utils.minutes(ms); if(mins<60) return `${mins}分`; const hours=Math.round((mins/60)*10)/10; return `${hours}时`; },
  todayISO(){ return new Date().toISOString().slice(0,10); },
  nowTime(){ const d=new Date(); return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`; },
  formatDateTime(ts){ const d=new Date(ts); const y=d.getFullYear(), m=String(d.getMonth()+1).padStart(2,'0'), dd=String(d.getDate()).padStart(2,'0'), hh=String(d.getHours()).padStart(2,'0'), mi=String(d.getMinutes()).padStart(2,'0'); return `${y}-${m}-${dd} ${hh}:${mi}`; },
  debounce(fn, delay=400){ let t=null; return (...a)=>{ clearTimeout(t); t=setTimeout(()=>fn(...a), delay); }; },
  async sha256(str){ const enc=new TextEncoder().encode(str); const buf=await crypto.subtle.digest('SHA-256', enc); return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0')).join(''); },
  csvCell(s){ if(s==null) return ''; const str=String(s); if(/[",\n]/.test(str)) return `"${str.replace(/"/g,'""')}"`; return str; },
  decodeUnicodeEscapes(text){ return text.replace(/\\u([\dA-Fa-f]{4})/g,(_,g)=>String.fromCharCode(parseInt(g,16))); },
  blobToBase64(blob){ return new Promise(res=>{ const r=new FileReader(); r.onload=()=>res(r.result.split(',')[1]); r.readAsDataURL(blob); }); },
  base64ToBlob(b64, type){ const bin=atob(b64); const len=bin.length; const arr=new Uint8Array(len); for(let i=0;i<len;i++) arr[i]=bin.charCodeAt(i); return new Blob([arr], {type:type||'application/octet-stream'}); }
};

/* ---------- IndexedDB ---------- */
const DB = {
  db:null,
  open(){ return new Promise((resolve,reject)=>{ const req=indexedDB.open('behavior_journal_v4',3);
    req.onupgradeneeded=(e)=>{ const db=e.target.result;
      if(!db.objectStoreNames.contains('records')){ const s=db.createObjectStore('records',{keyPath:'id'}); s.createIndex('by_date','date',{unique:false}); s.createIndex('by_updated','updatedAt',{unique:false}); }
      if(!db.objectStoreNames.contains('images')) db.createObjectStore('images',{keyPath:'id'});
      if(!db.objectStoreNames.contains('meta')) db.createObjectStore('meta',{keyPath:'key'});
    };
    req.onsuccess=()=>{ this.db=req.result; resolve(); }; req.onerror=()=>reject(req.error);
  }); },
  tx(name,mode='readonly'){ return this.db.transaction(name,mode).objectStore(name); },
  putRecord(r){ return new Promise(res=> this.tx('records','readwrite').put(r).onsuccess=()=>res()); },
  getAllRecords(){ return new Promise(res=>{ const out=[]; const cur=this.tx('records').openCursor(); cur.onsuccess=()=>{ const c=cur.result; if(c){ out.push(c.value); c.continue(); } else res(out); }; }); },
  getRecord(id){ return new Promise((res,rej)=>{ const req=this.tx('records').get(id); req.onsuccess=()=>res(req.result); req.onerror=()=>rej(req.error); }); },
  deleteRecord(id){ return new Promise(res=> this.tx('records','readwrite').delete(id).onsuccess=()=>res()); },
  clearRecords(){ return new Promise(res=> this.tx('records','readwrite').clear().onsuccess=()=>res()); },
  putImage(img){ return new Promise(res=> this.tx('images','readwrite').put(img).onsuccess=()=>res()); },
  getImage(id){ return new Promise(res=>{ const req=this.tx('images').get(id); req.onsuccess=()=>res(req.result); }); },
  deleteImage(id){ return new Promise(res=> this.tx('images','readwrite').delete(id).onsuccess=()=>res()); },
  clearImages(){ return new Promise(res=> this.tx('images','readwrite').clear().onsuccess=()=>res()); },
  putMeta(key,value){ return new Promise(res=> this.tx('meta','readwrite').put({key,value}).onsuccess=()=>res()); },
  getMeta(key){ return new Promise(res=>{ const req=this.tx('meta').get(key); req.onsuccess=()=>res(req.result?.value); }); }
};

/* ---------- WebDAV ---------- */
class WebDAV {
  constructor({ url, username, password, root }){
    this.base = url?.replace(/\/+$/,'') || '';
    this.root = root?.startsWith('/') ? root : '/'+(root||'');
    this.auth = (username||password) ? 'Basic '+btoa(`${username}:${password}`) : null;
  }
  headers(extra={}){ const h={...extra}; if(this.auth) h['Authorization']=this.auth; return h; }
  async ensureDir(path){ const r=await fetch(this.base+path,{method:'MKCOL',headers:this.headers()}); return [201,301,405,409].includes(r.status); }
  async put(path, blob, type='application/octet-stream'){ const r=await fetch(this.base+path,{method:'PUT',headers:this.headers({'Content-Type':type}),body:blob}); if(!r.ok) throw new Error(`PUT ${r.status}`); return true; }
  async get(path){ const r=await fetch(this.base+path,{method:'GET',headers:this.headers()}); if(!r.ok) throw new Error(`GET ${r.status}`); return r; }
}

/* ---------- App ---------- */
createApp({
  setup(){
    const ui = reactive({ showEventModal:false, showImage:false, showSettings:false, showDataPanel:false, showCalendarPanel:false });
    const drag = reactive({ isOver:false });

    const settings = reactive({
      dark: (localStorage.getItem('bj.dark')==='1'),
      webdav: { url:'', username:'', password:'', root:'/behavior-journal/' },
      deviceId: localStorage.getItem('bj.deviceId') || Utils.uuid(),
      syncMode: localStorage.getItem('bj.syncMode') || 'manual',
      remember: localStorage.getItem('bj.remember') === '1',
      intervalMinutes: Number(localStorage.getItem('bj.intervalMinutes') || 15)
    });
    localStorage.setItem('bj.deviceId', settings.deviceId);

    const form = reactive({
      id:null, date:Utils.todayISO(), startTime:'', endTime:'', type:'学习',
      tagsInput:'', tags:[], event:{main:'',goal:'',metric:'',reason:''},
      progress:50, review:'', images:[], createdAt:null, updatedAt:null
    });

    const records = reactive([]);
    const filters = reactive({ startDate:'', endDate:'', type:'', tagKeywords:'', selectedDay:'' });
    const sync = reactive({ lastSync:null, running:false, timer:null });
    const tagSuggestions = ref([]);
    const imageInput = ref(null);
    const importInput = ref(null);
    const restoreInput = ref(null);

    const lightbox = reactive({ show:false, src:'' });
    function openLightbox(src){ lightbox.src=src; lightbox.show=true; }
    function closeLightbox(){ lightbox.show=false; lightbox.src=''; }

    // Calendar
    const calendar = reactive({ year:new Date().getFullYear(), month:new Date().getMonth(), cells:[] });
    function buildCalendar(){
      const first = new Date(calendar.year, calendar.month, 1);
      const firstDow = (first.getDay()+6)%7;
      const daysInMonth = new Date(calendar.year, calendar.month+1, 0).getDate();
      const prevDays = new Date(calendar.year, calendar.month, 0).getDate();
      const cells = [];
      for(let i=0;i<42;i++){
        const dayNum = i - firstDow + 1;
        let y=calendar.year, m=calendar.month, d=dayNum, out=false;
        if(dayNum<=0){ m-=1; if(m<0){ m=11; y-=1; } d=prevDays+dayNum; out=true; }
        else if(dayNum>daysInMonth){ m+=1; if(m>11){ m=0; y+=1; } d=dayNum-daysInMonth; out=true; }
        const dateISO = `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
        const count = records.filter(r=> r.date===dateISO).length;
        cells.push({ key:`${y}-${m}-${d}`, y, m, d, day:d, out, dateISO, count, selected: filters.selectedDay===dateISO });
      }
      calendar.cells = cells;
    }
    function calendarPrev(){ if(--calendar.month<0){ calendar.month=11; calendar.year--; } buildCalendar(); }
    function calendarNext(){ if(++calendar.month>11){ calendar.month=0; calendar.year++; } buildCalendar(); }
    function calendarToday(){ const n=new Date(); calendar.year=n.getFullYear(); calendar.month=n.getMonth(); filters.selectedDay=Utils.todayISO(); buildCalendar(); }
    function selectCalendarDay(cell){ filters.selectedDay = cell.dateISO; buildCalendar(); }

    // Derived
    const humanDurationText = computed(()=> Utils.durationDisplay(Utils.durationMs(form.startTime, form.endTime)));
    const uniqueTags = computed(()=>{ const s=new Set(); records.forEach(r=> (r.tags||[]).forEach(t=> s.add(t))); return s; });
    const weeklyHours = computed(()=>{
      const now=new Date(); const dow=(now.getDay()+6)%7; const monday=new Date(now); monday.setDate(now.getDate()-dow); monday.setHours(0,0,0,0);
      let ms=0; records.forEach(r=>{ const d=new Date(r.date+'T00:00:00'); if(d>=monday) ms+=r.durationMs||0; }); return (ms/3600000).toFixed(1)+' h';
    });
    const filteredRecords = computed(()=>{
      const tagKeys = filters.tagKeywords.split(',').map(s=>s.trim()).filter(Boolean);
      return records.filter(r=>{
        if(filters.selectedDay && r.date !== filters.selectedDay) return false;
        if(filters.startDate && r.date < filters.startDate) return false;
        if(filters.endDate && r.date > filters.endDate) return false;
        if(filters.type && r.type !== filters.type) return false;
        if(tagKeys.length){
          const set = new Set(r.tags||[]);
          const ok = tagKeys.every(k=> Array.from(set).some(t=> t.includes(k)));
          if(!ok) return false;
        }
        return true;
      });
    });

    /* ----- UI actions ----- */
    function toggleDark(){ settings.dark=!settings.dark; document.documentElement.classList.toggle('dark', settings.dark); localStorage.setItem('bj.dark', settings.dark?'1':'0'); }
    function fillNow(which){ const t=Utils.nowTime(); if(which==='start') form.startTime=t; else form.endTime=t; }
    function onTagsInput(){
      form.tags = form.tagsInput.split(',').map(s=>s.trim()).filter(Boolean);
      const all=Array.from(uniqueTags.value);
      const last=form.tagsInput.split(',').slice(-1)[0]?.trim()||'';
      tagSuggestions.value = last ? all.filter(t=> t.includes(last)).slice(0,8) : all.slice(0,8);
    }
    function resetForm(){
      Object.assign(form,{ id:null, date:Utils.todayISO(), startTime:'', endTime:'', type:'学习', tagsInput:'', tags:[], event:{main:'',goal:'',metric:'',reason:''}, progress:50, review:'', images:[], createdAt:null, updatedAt:null });
      ui.showImage=false;
    }
    function recomputeDuration(){}

    async function onSelectFiles(e){ const files=Array.from(e.target.files||[]); await addFiles(files); e.target.value=''; }
    function onDragOver(){ drag.isOver=true; }
    function onDragLeave(){ drag.isOver=false; }
    async function onDropFiles(e){ drag.isOver=false; const files=Array.from(e.dataTransfer.files||[]); await addFiles(files); }
    async function addFiles(files){
      for(const f of files){ if(!f.type.startsWith('image/')) continue; const preview=URL.createObjectURL(f); form.images.push({ localId:Utils.uuid(), blob:f, type:f.type, preview, name:f.name }); }
    }
    function removeImage(idx){ const img=form.images[idx]; if(img?.preview) URL.revokeObjectURL(img.preview); form.images.splice(idx,1); }
    function replaceImage(idx){
      imageInput.value.onchange = async (e)=>{
        const f=e.target.files[0];
        if(f && f.type.startsWith('image/')){ const preview=URL.createObjectURL(f); const old=form.images[idx]; if(old?.preview) URL.revokeObjectURL(old.preview); form.images[idx]={ ...old, blob:f, type:f.type, preview, name:f.name }; }
        imageInput.value.onchange = onSelectFiles;
      };
      imageInput.value.click();
    }

    function validateForm(){
      if(!form.date) return '请选择日期';
      if(!form.startTime || !form.endTime) return '请填写开始和结束时间';
      if(Utils.durationMs(form.startTime, form.endTime) <= 0) return '耗时应大于 0 分钟（支持跨天）';
      return '';
    }

    async function submitRecord(){
      const err=validateForm(); if(err){ toast(err); return; }
      const now=Date.now(); const id=form.id||Utils.uuid(); const durationMs=Utils.durationMs(form.startTime, form.endTime);

      const imageRefs=[];
      for(const img of form.images){
        const imgId=img.id||img.localId||Utils.uuid();
        await DB.putImage({ id:imgId, blob:img.blob, type:img.type, createdAt:now, name:img.name||'' });
        imageRefs.push({ id:imgId, type:img.type, createdAt:now, name:img.name||'' });
      }

      const record={ id, date:form.date, startTime:form.startTime, endTime:form.endTime, durationMs, type:form.type, tags:[...form.tags], event:{...form.event}, progress:Number(form.progress)||0, review:form.review, images:imageRefs, createdAt:form.createdAt||now, updatedAt:now };
      await DB.putRecord(record);

      const idx=records.findIndex(x=>x.id===id);
      const enriched=await enrichRecord(record);
      if(idx>=0) records.splice(idx,1,enriched); else records.unshift(enriched);

      if(settings.syncMode==='onSave') syncNow();
      resetForm(); toast('已保存');
      buildCalendar();
    }

    async function startEdit(r){
      const imgs=[];
      for(const ir of (r.images||[])){ const rec=await DB.getImage(ir.id); if(rec){ const preview=URL.createObjectURL(rec.blob); imgs.push({ localId:Utils.uuid(), id:rec.id, blob:rec.blob, type:rec.type, preview, name:rec.name||'' }); } }
      Object.assign(form, { id:r.id, date:r.date, startTime:r.startTime, endTime:r.endTime, type:r.type, tagsInput:(r.tags||[]).join(','), tags:[...(r.tags||[])], event:{ ...(r.event||{main:'',goal:'',metric:'',reason:''}) }, progress:r.progress, review:r.review||'', images:imgs, createdAt:r.createdAt, updatedAt:r.updatedAt });
      ui.showImage = imgs.length>0;
      window.scrollTo({ top:0, behavior:'smooth' });
    }

    async function deleteRecord(id){
      if(!confirm('确定删除该记录？')) return;
      const r=records.find(x=>x.id===id);
      if(r?.images){ for(const ir of r.images){ await DB.deleteImage(ir.id); } }
      await DB.deleteRecord(id);
      const i=records.findIndex(x=>x.id===id); if(i>=0) records.splice(i,1);
      toast('已删除');
      buildCalendar();
    }

    function applyFilters(){ toast('筛选已应用'); }

    function exportJSON(){
      const data = records.map(plainRecord);
      const blob = new Blob([JSON.stringify(data, null, 2)], { type:'application/json;charset=utf-8' });
      downloadBlob(blob, `records_${new Date().toISOString().slice(0,10)}.json`);
      toast('已导出 JSON');
    }

    async function exportCSV(){
      const head = ['id','date','startTime','endTime','durationMinutes','type','tags','progress','event_main','event_goal','event_metric','event_reason','review'];
      const rows = [head.join(',')];
      for(const r of records){
        const line = [
          r.id, r.date, r.startTime, r.endTime, Math.round((r.durationMs||0)/60000),
          r.type, (r.tags||[]).join('|'), r.progress,
          r.event?.main||'', r.event?.goal||'', r.event?.metric||'', r.event?.reason||'',
          (r.review||'').replace(/\r?\n/g,' / ')
        ].map(Utils.csvCell).join(',');
        rows.push(line);
      }
      const bom = new Uint8Array([0xEF,0xBB,0xBF]); // UTF-8 BOM for Chinese CSV
      const blob = new Blob([bom, rows.join('\n')], { type:'text/csv;charset=utf-8' });
      downloadBlob(blob, `records_${new Date().toISOString().slice(0,10)}.csv`);
      toast('已导出 CSV');
    }

    async function importJSON(e){
      const file=e.target.files?.[0]; if(!file) return;
      const text = await file.text();
      let decoded=Utils.decodeUnicodeEscapes(text), arr;
      try{ arr=JSON.parse(decoded); }catch{ try{ arr=JSON.parse(text); }catch{ toast('导入失败：JSON 格式错误'); e.target.value=''; return; } }
      if(!Array.isArray(arr)){ toast('导入失败：JSON 须为数组'); e.target.value=''; return; }
      for(const p of arr){
        const now=Date.now(), id=p.id||Utils.uuid();
        const rec={ id, date:p.date, startTime:p.startTime, endTime:p.endTime, durationMs:Utils.durationMs(p.startTime,p.endTime), type:p.type||'学习', tags:p.tags||[], event:p.event||{}, progress:Number(p.progress)||0, review:p.review||'', images:[], createdAt:p.createdAt||now, updatedAt:now };
        await DB.putRecord(rec);
      }
      await refreshRecords(); toast('导入完成'); e.target.value='';
      buildCalendar();
    }

    // 备份（含图片为 base64）
    async function backupAll(){
      const data = [];
      for(const r of records){
        const item = plainRecord(r);
        item.imagesData = [];
        for(const ir of r.images||[]){
          const imgRec = await DB.getImage(ir.id);
          if(imgRec){
            const b64 = await Utils.blobToBase64(imgRec.blob);
            item.imagesData.push({ id: ir.id, type: imgRec.type, name: imgRec.name||'', base64: b64 });
          }
        }
        data.push(item);
      }
      const backup = { version:4, createdAt:Date.now(), device:settings.deviceId, records:data };
      const blob = new Blob([JSON.stringify(backup)], { type:'application/json;charset=utf-8' });
      downloadBlob(blob, `bj_backup_${new Date().toISOString().slice(0,10)}.bjbak`);
      toast('已生成备份');
    }

    // 恢复（合并，不清空）
    async function restoreBackup(e){
      const file=e.target.files?.[0]; if(!file) return;
      try{
        const text = await file.text();
        const json = JSON.parse(text);
        const list = Array.isArray(json) ? json : (json.records||[]);
        if(!Array.isArray(list)) throw new Error('备份格式不正确');
        for(const p of list){
          const now=Date.now(); const id=p.id||Utils.uuid();
          const rec={ id, date:p.date, startTime:p.startTime, endTime:p.endTime, durationMs:p.durationMs ?? Utils.durationMs(p.startTime,p.endTime), type:p.type||'学习', tags:p.tags||[], event:p.event||{}, progress:Number(p.progress)||0, review:p.review||'', images:[], createdAt:p.createdAt||now, updatedAt:now };
          const imagesData = p.imagesData||[];
          for(const item of imagesData){
            const blob = Utils.base64ToBlob(item.base64, item.type||'image/jpeg');
            await DB.putImage({ id:item.id, blob, type:item.type, createdAt:now, name:item.name||'' });
            rec.images.push({ id:item.id, type:item.type, createdAt:now, name:item.name||'' });
          }
          await DB.putRecord(rec);
        }
        await refreshRecords(); toast('恢复完成');
        buildCalendar();
      }catch(err){ console.error(err); toast('恢复失败：文件格式错误'); }
      e.target.value='';
    }

    function clearAll(){
      if(!confirm('确定清空所有数据（记录与图片）？')) return;
      Promise.all([DB.clearRecords(), DB.clearImages()]).then(async ()=>{
        records.splice(0, records.length);
        toast('已清空');
        buildCalendar();
      });
    }

    function downloadBlob(blob, name){ const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=name; a.click(); setTimeout(()=>URL.revokeObjectURL(url),1000); }
    function plainRecord(r){ return { id:r.id, date:r.date, startTime:r.startTime, endTime:r.endTime, durationMs:r.durationMs, type:r.type, tags:r.tags, event:r.event, progress:r.progress, review:r.review, images:r.images, createdAt:r.createdAt, updatedAt:r.updatedAt, _expanded:false }; }
    async function enrichRecord(r){
      const copy = JSON.parse(JSON.stringify(r));
      if(copy.images?.length){
        for(const ir of copy.images){
          const imgRec = await DB.getImage(ir.id);
          if(imgRec){ ir.preview = URL.createObjectURL(imgRec.blob); }
        }
      }
      copy._expanded=false;
      return copy;
    }
    async function refreshRecords(){
      const arr = (await DB.getAllRecords()).sort((a,b)=> b.updatedAt - a.updatedAt);
      const out=[]; for(const r of arr){ out.push(await enrichRecord(r)); }
      records.splice(0, records.length, ...out);
    }

    /* ----- WebDAV sync ----- */
    function buildClient(){
      const { url, username, password, root } = settings.webdav;
      if(!url) throw new Error('未配置 WebDAV 地址');
      return new WebDAV({ url, username, password, root });
    }
    function imagePath(dateISO, ext='jpg'){ return `${settings.webdav.root}${settings.deviceId}/images/${dateISO}/${Utils.uuid()}.${ext.replace(/^\./,'')}`; }
    function manifestPath(){ return `${settings.webdav.root}${settings.deviceId}/manifest.json`; }
    async function ensureBaseDirs(client){
      await client.ensureDir(settings.webdav.root);
      await client.ensureDir(`${settings.webdav.root}${settings.deviceId}/`);
      await client.ensureDir(`${settings.webdav.root}${settings.deviceId}/images/`);
    }
    async function syncNow(){
      if(sync.running){ toast('同步进行中…'); return; }
      try{
        sync.running=true;
        const client=buildClient();
        await ensureBaseDirs(client);

        // 分月合并上传
        const groups={};
        for(const r of records){ const ym=r.date.slice(0,7); (groups[ym]=groups[ym]||[]).push(plainRecord(r)); }
        for(const ym of Object.keys(groups)){
          const path = `${settings.webdav.root}${settings.deviceId}/records_${ym}.json`;
          let remote = [];
          try{ const resp = await client.get(path); const text = await resp.text(); remote = JSON.parse(text); }catch{}
          const byId = new Map();
          [...remote, ...groups[ym]].forEach(rec=>{
            const ex = byId.get(rec.id);
            if(!ex) byId.set(rec.id, rec);
            else{
              if((rec.updatedAt||0) > (ex.updatedAt||0)) byId.set(rec.id, rec);
              else if((rec.updatedAt||0) === (ex.updatedAt||0) && JSON.stringify(rec)!==JSON.stringify(ex)){
                const twin = { ...rec, id: rec.id + '_conflict_' + Utils.uuid() };
                byId.set(twin.id, twin);
              }
            }
          });
          const merged = Array.from(byId.values());
          await client.put(path, new Blob([JSON.stringify(merged,null,2)], {type:'application/json;charset=utf-8'}), 'application/json;charset=utf-8');
        }

        // 上传图片（添加 url 标记）
        for(const r of records){
          for(const img of (r.images||[])){
            if(img.url) continue;
            const rec = await DB.getImage(img.id);
            if(!rec) continue;
            const ext = (rec.type?.split('/')[1]||'jpg');
            const dateDir = `${settings.webdav.root}${settings.deviceId}/images/${r.date}/`;
            await client.ensureDir(dateDir);
            const p = imagePath(r.date, ext);
            await client.put(p, rec.blob, rec.type||'application/octet-stream');
            img.url = client.base + p;
            await DB.putRecord(plainRecord(r));
          }
        }

        const manifest = { version:4, lastSync:Date.now(), device:settings.deviceId, hash: await Utils.sha256(JSON.stringify(records.map(plainRecord))) };
        await client.put(manifestPath(), new Blob([JSON.stringify(manifest,null,2)], {type:'application/json;charset=utf-8'}), 'application/json;charset=utf-8');

        sync.lastSync = Date.now();
        await DB.putMeta('lastSync', sync.lastSync);
        toast('同步完成');
      }catch(err){
        console.error(err);
        toast('同步失败：' + (err?.message||'网络错误'));
      }finally{
        sync.running=false;
      }
    }
    async function testWebDAV(){
      try{ const c=buildClient(); await ensureBaseDirs(c); toast('连接正常'); }
      catch(err){ toast('连接失败：' + (err?.message||'网络错误')); }
    }
    function setupInterval(){
      if(sync.timer){ clearInterval(sync.timer); sync.timer=null; }
      if(settings.syncMode==='interval'){
        const ms = Math.max(5, settings.intervalMinutes||15)*60000;
        sync.timer = setInterval(()=> syncNow(), ms);
      }
    }

    function onKey(e){
      if((e.ctrlKey||e.metaKey) && e.key==='Enter'){ e.preventDefault(); submitRecord(); }
      if(e.key==='Escape'){
        if(ui.showEventModal) ui.showEventModal=false;
        else if(ui.showSettings) ui.showSettings=false;
        else if(ui.showDataPanel) ui.showDataPanel=false;
        else if(ui.showCalendarPanel) ui.showCalendarPanel=false;
        else if(lightbox.show) closeLightbox();
      }
    }

    // toast
    let toastTimer=null; const toastMsg=ref('');
    function toast(s){ toastMsg.value=s; clearTimeout(toastTimer); toastTimer=setTimeout(()=> toastMsg.value='', 2200); }

    onMounted(async ()=>{
      document.addEventListener('keydown', onKey);
      await DB.open();
      sync.lastSync = await DB.getMeta('lastSync');
      await refreshRecords();
      buildCalendar();

      const load = (k,def)=> (settings.remember ? localStorage.getItem(k) : sessionStorage.getItem(k)) || def || '';
      settings.webdav.url = load('bj.webdav.url','');
      settings.webdav.username = load('bj.webdav.username','');
      settings.webdav.password = load('bj.webdav.password','');
      settings.webdav.root = load('bj.webdav.root','/behavior-journal/');
           settings.syncMode = load('bj.syncMode', 'manual');
      settings.intervalMinutes = Number(load('bj.intervalMinutes') || 15);
      settings.remember = (localStorage.getItem('bj.remember') === '1');

      setupInterval();
    });

    // 自动保存设置
    const persist = Utils.debounce(() => {
      const store = settings.remember ? localStorage : sessionStorage;
      const clear = settings.remember ? sessionStorage : localStorage;
      store.setItem('bj.webdav.url', settings.webdav.url || '');
      store.setItem('bj.webdav.username', settings.webdav.username || '');
      store.setItem('bj.webdav.password', settings.webdav.password || '');
      store.setItem('bj.webdav.root', settings.webdav.root || '/behavior-journal/');
      store.setItem('bj.syncMode', settings.syncMode || 'manual');
      store.setItem('bj.intervalMinutes', String(settings.intervalMinutes || 15));
      localStorage.setItem('bj.remember', settings.remember ? '1' : '0');
      clear.removeItem('bj.webdav.url');
      clear.removeItem('bj.webdav.username');
      clear.removeItem('bj.webdav.password');
      clear.removeItem('bj.webdav.root');
      clear.removeItem('bj.syncMode');
      clear.removeItem('bj.intervalMinutes');
    }, 500);
    watch(settings, persist, { deep: true });

    return {
      ui, drag, settings, form, records, filters, sync,
      tagSuggestions, imageInput, importInput, restoreInput,
      lightbox, openLightbox, closeLightbox,
      calendar, calendarPrev, calendarNext, calendarToday, selectCalendarDay,
      humanDurationText, uniqueTags, weeklyHours, filteredRecords,
      toggleDark, fillNow, onTagsInput, resetForm, recomputeDuration,
      onSelectFiles, onDragOver, onDragLeave, onDropFiles, removeImage, replaceImage,
      submitRecord, startEdit, deleteRecord, applyFilters,
      exportJSON, exportCSV, importJSON, clearAll,
      backupAll, restoreBackup,
      syncNow, testWebDAV,
      formatDateTime: Utils.formatDateTime,
      durationText: Utils.durationDisplay,
      toastMsg
    };
  }
}).mount('#app');
