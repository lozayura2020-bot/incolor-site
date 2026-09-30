(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  // Change catalogue prices here. These are indicative, confirmed by the manager.
  const colors = [
    ['wh','Білий','#fafafa'],['bk','Чорний','#24282d'],['gm','Темно-зелений','#254d3b'],
    ['kg','Хакі','#818160'],['ny','Синій','#243e6b'],['pk','Рожевий','#efb5ca'],
    ['rb','Бордовий','#74364a'],['rd','Червоний','#cf4546'],['sk','Сірий','#a1a6ae'],['sy','Салатовий','#b9d961']
  ];
  const sizes = {XS:1,S:1,M:1,L:1.05,XL:1.1,'2XL':1.18,'3XL':1.25,'4XL':1.32};
  const printRates = {DTF:1,DTG:1.05,'Термотрансфер':.95,'Шовкодрук':1.2};
  const clothingPrints = ['DTF','DTG','Термотрансфер','Шовкодрук'];
  const catalogue = {
    shirt:{name:'Футболка',base:290,prints:clothingPrints,area:[154,168,92,136],shape:'M145 72 Q200 110 255 72 L315 98 350 162 302 187 277 148 277 387 Q200 405 123 387 L123 148 98 187 50 162 85 98Z'},
    hoodie:{name:'Худі',base:490,prints:['DTF','Термотрансфер','Шовкодрук'],area:[154,184,92,96],shape:'M150 96 Q140 22 200 20 Q260 22 250 96 L297 116 339 354 299 366 272 206 278 398 122 398 128 206 101 366 61 354 103 116Z'},
    sweat:{name:'Світшот',base:430,prints:clothingPrints,area:[154,154,92,136],shape:'M147 72 Q200 104 253 72 L294 106 342 357 302 370 271 201 275 398 125 398 129 201 98 370 58 357 106 106Z'},
    cap:{name:'Кепка',base:210,prints:['DTF','Термотрансфер','Шовкодрук'],area:[156,202,88,44],shape:'M98 280 Q88 155 200 148 Q312 155 302 280 Q245 326 82 310 L60 292Z'},
    mug:{name:'Кружка',base:180,prints:['Термотрансфер'],area:[132,190,112,98],shape:'M106 148 Q180 128 267 148 L267 320 Q186 349 106 320Z'}
  };
  let product = 'shirt', color = 'wh', artwork = '', uploadVersion = 0;
  const svgNS = 'http://www.w3.org/2000/svg';
  function element(tag, attrs = {}, text) {
    const node = document.createElementNS(svgNS,tag);
    Object.entries(attrs).forEach(([key,value]) => node.setAttribute(key,value));
    if (text !== undefined) node.textContent = text;
    return node;
  }
  function renderSVG(withPrint = true, id = 'preview') {
    const item = catalogue[product], tint = colors.find(c => c[0] === color)[2];
    const svg = element('svg',{viewBox:'0 0 400 440',xmlns:svgNS,role:'img','aria-label':`${item.name}: схематичний попередній перегляд`});
    const defs = element('defs');
    const gradient = element('linearGradient',{id:`fabric-${id}`,x1:'0%',y1:'0%',x2:'100%',y2:'100%'});
    gradient.append(element('stop',{offset:'0%','stop-color':tint}),element('stop',{offset:'100%','stop-color':tint}));
    defs.append(gradient);
    const [x,y,w,h] = item.area;
    const clip = element('clipPath',{id:`area-${id}`});clip.append(element('rect',{x,y,width:w,height:h,rx:2}));defs.append(clip);svg.append(defs);
    svg.append(element('ellipse',{cx:200,cy:417,rx:110,ry:8,fill:'#083d66',opacity:'.07'}));
    if(product === 'mug') svg.append(element('path',{d:'M266 171 C348 146 348 287 266 277',fill:'none',stroke:tint,'stroke-width':22}));
    svg.append(element('path',{d:item.shape,fill:`url(#fabric-${id})`,stroke:'#083d66','stroke-opacity':'.3','stroke-width':2,'stroke-linejoin':'round'}));
    const seams = {shirt:'M146 76 Q200 124 254 76 M127 375 Q200 390 273 375',hoodie:'M153 96 Q200 147 247 96 M178 129 L175 196 M222 129 L225 196 M153 309 L168 286 232 286 247 309 247 350 153 350Z',sweat:'M148 77 Q200 119 252 77 M128 384 L272 384 M65 345 L99 337 M301 337 L335 345',cap:'M102 280 Q196 255 302 280 M200 150 L200 261 M115 270 Q82 292 82 310',mug:'M107 149 Q185 171 266 149'};
    svg.append(element('path',{d:seams[product],fill:'none',stroke:'#083d66','stroke-opacity':'.18','stroke-width':2}));
    if(withPrint) {
      const group = element('g',{'clip-path':`url(#area-${id})`});
      const scale = Number($('studioScale').value)/100;
      const cx=x+w/2 + Number($('studioX').value)*w/200;
      const cy=y+h/2 + Number($('studioY').value)*h/200;
      const layer = element('g',{transform:`translate(${cx},${cy}) scale(${scale})`});
      const text = $('studioText').value.trim();
      if(artwork) layer.append(element('image',{href:artwork,x:-w*.45,y:-h*.44,width:w*.9,height:h*(text ? .65 : .88),preserveAspectRatio:'xMidYMid meet'}));
      if(text) layer.append(element('text',{x:0,y:artwork?h*.36:0,'text-anchor':'middle','dominant-baseline':'middle',fill:$('studioTextColor').value,'font-family':'Arial, sans-serif','font-size':Math.min(24,w*1.55/Math.max(text.length,1)),'font-weight':800},text));
      group.append(layer);svg.append(group);
      if(id==='preview' && $('studioGuides').checked) svg.append(element('rect',{x,y,width:w,height:h,rx:2,fill:'none',stroke:'#1684c6','stroke-width':1,'stroke-dasharray':'4 4'}));
    }
    return svg;
  }
  function pricing() {
    const qty=Number($('studioQty').value);
    if(!Number.isInteger(qty)||qty<1||qty>10000) return null;
    const item=catalogue[product];
    const sizeRate=['cap','mug'].includes(product)?1:sizes[$('studioSize').value];
    const rate=printRates[$('studioPrint').value];
    const extra=artwork||$('studioText').value.trim()?25:0;
    const discount=qty >= 50 ? .12 : qty >= 20 ? .07 : qty >= 10 ? .03 : 0;
    const unit=(item.base*sizeRate*rate+extra)*(1-discount);
    return {qty,discount,unit,total:unit*qty};
  }
  const money = n => new Intl.NumberFormat('uk-UA',{style:'currency',currency:'UAH',maximumFractionDigits:2}).format(n);
  function update() {
    $('studioCanvas').replaceChildren(renderSVG());
    $('compareBefore').replaceChildren(renderSVG(false,'before'));
    $('compareAfter').replaceChildren(renderSVG(true,'after'));
    $('studioProductName').textContent=catalogue[product].name;
    const price=pricing();
    $('studioTotal').textContent=price?money(price.total):'Перевір кількість';
    $('studioUnit').textContent=price?`${money(price.unit)} / шт. × ${price.qty}`:'Від 1 до 10 000 шт.';
    $('studioDiscount').textContent=price&&price.discount?`Знижка ${Math.round(price.discount*100)}%`:'10+ шт. −3%\n20+ −7% · 50+ −12%';
    $('studioOrder').disabled=!price;
    $('studioScaleValue').textContent=$('studioScale').value+'%';
  }
  function configure() {
    const item=catalogue[product];
    document.querySelectorAll('[data-studio-product]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.studioProduct===product));
    const isOneSize=['cap','mug'].includes(product);
    const size=$('studioSize'),oldSize=size.value;size.replaceChildren();
    (isOneSize?[product==='cap'?'Універсальний':'Стандартна']:Object.keys(sizes)).forEach(s=>size.add(new Option(s,s)));
    size.disabled=isOneSize;size.value=!isOneSize&&sizes[oldSize]?oldSize:size.options[0].value;
    const print=$('studioPrint'),oldPrint=print.value;print.replaceChildren();
    item.prints.forEach(p=>print.add(new Option(p,p)));print.value=item.prints.includes(oldPrint)?oldPrint:item.prints[0];
    if(isOneSize)color='wh';
    $('studioColors').replaceChildren();
    colors.filter(c=>!isOneSize||c[0]==='wh').forEach(([id,name,hex])=>{
      const b=document.createElement('button');b.type='button';b.title=name;b.setAttribute('aria-label',name);b.setAttribute('aria-pressed',id===color);
      b.style.setProperty('--swatch',hex);b.style.setProperty('--tick',['bk','gm','ny','rb','rd'].includes(id)?'#fff':'#083d66');
      b.addEventListener('click',()=>{color=id;configure();});$('studioColors').append(b);
    });
    $('studioColorName').textContent=colors.find(c=>c[0]===color)[1];update();
  }
  document.querySelectorAll('[data-studio-product]').forEach(b=>b.addEventListener('click',()=>{product=b.dataset.studioProduct;configure();}));
  ['studioSize','studioPrint','studioQty','studioText','studioTextColor','studioScale','studioX','studioY','studioGuides'].forEach(id=>$(id).addEventListener('input',update));
  $('studioFile').addEventListener('change',async e=>{
    const version=++uploadVersion;
    const file=e.target.files[0];if(!file)return;
    if(!['image/png','image/jpeg','image/webp'].includes(file.type)||file.size>8*1024*1024){$('studioStatus').textContent='Вибери PNG, JPG або WebP до 8 МБ.';e.target.value='';return;}
    try{
      const data=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(file);});
      await new Promise((resolve,reject)=>{const img=new Image();img.onload=resolve;img.onerror=reject;img.src=data;});
      if(version!==uploadVersion)return;
      artwork=data;$('studioStatus').textContent='Зображення додано до попереднього перегляду.';update();
    }catch{if(version===uploadVersion)$('studioStatus').textContent='Не вдалося відкрити зображення. Вибери інший файл.';}
  });
  $('studioRemove').addEventListener('click',()=>{++uploadVersion;artwork='';$('studioFile').value='';$('studioStatus').textContent='Зображення видалено.';update();});
  $('studioReset').addEventListener('click',()=>{++uploadVersion;artwork='';product='shirt';color='wh';$('studioFile').value='';$('studioText').value='ТВІЙ ДИЗАЙН';$('studioTextColor').value='#1684c6';$('studioScale').value=85;$('studioX').value=0;$('studioY').value=0;$('studioQty').value=1;$('studioGuides').checked=true;$('studioStatus').textContent='';configure();$('studioSize').value='M';$('studioPrint').value='DTF';update();});
  $('studioDownload').addEventListener('click',()=>{
    const data=new XMLSerializer().serializeToString(renderSVG(true,'download'));
    const url=URL.createObjectURL(new Blob([data],{type:'image/svg+xml'}));
    const a=document.createElement('a');a.href=url;a.download='incolor-preview.svg';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  });
  $('studioOrder').addEventListener('click',()=>{
    const p=pricing();if(!p)return;
    const message=[`Мій мерч InColor: ${catalogue[product].name}`,`Колір: ${colors.find(c=>c[0]===color)[1]}`,`Розмір: ${$('studioSize').value}`,`Друк: ${$('studioPrint').value}`,`Тираж: ${p.qty} шт.`,`Текст: ${$('studioText').value.trim()||'без тексту'}`,`Зображення: ${artwork?'додано до прев’ю; надішлю окремо':'без зображення'}`,`Орієнтовно: ${money(p.total)}`,`Масштаб принта: ${$('studioScale').value}%; зміщення X: ${$('studioX').value}%, Y: ${$('studioY').value}%`].join('\n');
    const field=document.querySelector('#contactForm textarea[name=message]');field.value=message;
    $('studioStatus').textContent='Параметри перенесено у форму. Додай контакти й надішли заявку. Зображення надішли менеджеру окремо.';
    $('contact').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});field.focus({preventScroll:true});
  });
  $('compareRange').addEventListener('input',e=>$('compareStage').style.setProperty('--split',`${e.target.value}%`));
  // Real portfolio photos, opened with keyboard or pointer.
  const dialog=$('studioLightbox');let previousFocus;
  document.querySelectorAll('.work-card').forEach(card=>{
    card.tabIndex=0;card.setAttribute('role','button');card.setAttribute('aria-haspopup','dialog');card.setAttribute('aria-label',`Роздивитися: ${card.querySelector('h3').textContent}`);
    function open(){previousFocus=document.activeElement;const source=card.querySelector('img');$('studioZoomImage').src=source.src;$('studioZoomImage').alt=source.alt;$('studioZoomTitle').textContent=card.querySelector('h3').textContent;dialog.showModal();}
    card.addEventListener('click',open);card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open();}});
  });
  $('studioZoomClose').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});dialog.addEventListener('close',()=>previousFocus?.focus());
  const header=$('siteHeader'),burger=$('burgerBtn');
  const onScroll=()=>header.classList.toggle('scrolled',scrollY>60);window.addEventListener('scroll',onScroll,{passive:true});onScroll();
  burger.setAttribute('aria-controls','mobileNav');burger.setAttribute('aria-expanded','false');
  new MutationObserver(()=>burger.setAttribute('aria-expanded',$('mobileNav').classList.contains('open'))).observe($('mobileNav'),{attributes:true,attributeFilter:['class']});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('mobileNav').classList.contains('open')){window.closeMobile();burger.focus();}});
  document.querySelectorAll('.faq-question').forEach(q=>{q.tabIndex=0;q.setAttribute('role','button');q.setAttribute('aria-expanded','false');q.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();q.click();}});new MutationObserver(()=>q.setAttribute('aria-expanded',q.parentElement.classList.contains('open'))).observe(q.parentElement,{attributes:true,attributeFilter:['class']});});
  configure();$('studioSize').value='M';update();
})();
