(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  // Add your real print-process video here, e.g. 'videos/incolor-print.mp4'.
  // With no video the section shows an existing close-up photo without a fake play button.
  const PROCESS_VIDEO = '';
  const audiences = {
    self:{title:'Те, що хочеться носити.',eyebrow:'НЕХАЙ РЕЧІ ГОВОРЯТЬ ЗА ТЕБЕ',description:'Улюблене місто, власна ілюстрація або напис зі змістом. Допоможемо перенести твою ідею на одяг чи аксесуари.',image:'images/portfolio-city-enhanced.webp',alt:'Світшот з принтом Харків',tag:'ТВОЯ ІДЕЯ / ТВОЯ РІЧ',chips:['Футболки','Худі','Кружки'],cta:'Обговорити мою ідею',draft:'Хочу персональний принт. Моя ідея: '},
    team:{title:'Різні люди. Спільний стиль.',eyebrow:'ДЛЯ ТИХ, ХТО РОБИТЬ РАЗОМ',description:'Одяг для спортивної спільноти, творчого колективу або команди події. Зберемо спільну візуальну ідею та підберемо вироби під вашу задачу.',image:'images/portfolio-skate-enhanced.webp',alt:'Командний одяг із принтом',tag:'ВАША КОМАНДА / ВАШ СТИЛЬ',chips:['Командні футболки','Худі','Одяг для подій'],cta:'Обговорити мерч для команди',draft:'Потрібен мерч для команди. Кількість людей та ідея: '},
    business:{title:'Бренд, який можна взяти з собою.',eyebrow:'ВІД ЛОГОТИПА ДО ГОТОВОЇ РЕЧІ',description:'Одяг для співробітників, брендовані аксесуари або подарунки клієнтам. Допоможемо поєднати ваш логотип, кольори й потрібні вироби.',image:'images/portfolio-cap-mug-enhanced.webp',alt:'Кепка та чашка з принтом',tag:'ВАШ БРЕНД / ЩОДЕННІ ДЕТАЛІ',chips:['Одяг з логотипом','Кепки','Кружки'],cta:'Обговорити мерч для бізнесу',draft:'Потрібен мерч для бізнесу. Вироби, тираж і задум: '}
  };
  const cases = [
    {category:'КОМАНДНИЙ ОДЯГ',title:'Одна команда. Свій стиль.',description:'Приклад командного одягу: спільний принт об’єднує речі у впізнаваний комплект.',idea:'Футболки для вашої спільноти, спортивної команди чи спільної події.'},
    {category:'ХАРКІВ / СВІТШОТ',title:'Носи своє місто з гордістю.',description:'Світшот із принтом Харкова. Міський мотив стає частиною щоденного образу.',idea:'Улюблене місто, місце або символ, який має значення саме для тебе.'},
    {category:'КЕПКА ТА КРУЖКА',title:'Твій бренд у щоденних деталях.',description:'Приклад принта на аксесуарах: невеликі речі можуть продовжувати одну візуальну ідею.',idea:'Поєднати одяг та аксесуари спільним написом, знаком або кольором.'},
    {category:'ДРУК ЗБЛИЗЬКА',title:'Принт, який хочеться роздивлятися.',description:'Крупний план друку на тканині. Роздивись деталі зображення та його розташування на виробі.',idea:'Погодити композицію та масштаб свого принта до запуску замовлення.'}
  ];
  let audience = 'self', activeCase = 0, lastFocus, skipRestore = false;
  const tabs = [...document.querySelectorAll('[data-audience]')];
  function selectAudience(key) {
    audience=key;const item=audiences[key];
    tabs.forEach(tab=>{const active=tab.dataset.audience===key;tab.setAttribute('aria-selected',active);tab.tabIndex=active?0:-1;});
    $('audience-panel').setAttribute('aria-labelledby',`audience-${key}`);
    $('audience-title').textContent=item.title;$('audience-description').textContent=item.description;
    $('audience-eyebrow').textContent=item.eyebrow;$('audience-tag').textContent=item.tag;
    $('audience-image').src=item.image;$('audience-image').alt=item.alt;
    $('audience-chips').replaceChildren(...item.chips.map(text=>{const span=document.createElement('span');span.textContent=text;return span;}));
    $('audience-order').replaceChildren(document.createTextNode(item.cta),Object.assign(document.createElement('span'),{textContent:'↗'}));
  }
  tabs.forEach((tab,index)=>{tab.addEventListener('click',()=>selectAudience(tab.dataset.audience));tab.addEventListener('keydown',e=>{let next;if(e.key==='ArrowRight')next=(index+1)%tabs.length;if(e.key==='ArrowLeft')next=(index+tabs.length-1)%tabs.length;if(e.key==='Home')next=0;if(e.key==='End')next=tabs.length-1;if(next!==undefined){e.preventDefault();tabs[next].focus();selectAudience(tabs[next].dataset.audience);}});});
  function draftOrder(text) {
    const field=document.querySelector('#contactForm textarea[name=message]');
    // Preserve anything the visitor has already written.
    field.value=field.value.trim()?`${field.value}\n\n${text}`:text;
    $('contact').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
    field.focus({preventScroll:true});
  }
  $('audience-order').addEventListener('click',()=>draftOrder(audiences[audience].draft));
  const cards=[...document.querySelectorAll('.work-card')],dialog=$('case-dialog');
  function openCase(index,trigger){
    activeCase=index;lastFocus=trigger||document.activeElement;const item=cases[index],image=cards[index].querySelector('img');
    $('case-category').textContent=item.category;$('case-title').textContent=item.title;$('case-description').textContent=item.description;$('case-idea').textContent=item.idea;
    $('case-image').src=image.src;$('case-image').alt=image.alt;
    dialog.showModal();
  }
  cards.forEach((card,index)=>{card.tabIndex=0;card.setAttribute('role','button');card.setAttribute('aria-haspopup','dialog');card.setAttribute('aria-label',`Відкрити кейс: ${cases[index].title}`);card.addEventListener('click',()=>openCase(index,card));card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openCase(index,card);}});});
  $('case-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
  dialog.addEventListener('close',()=>{if(!skipRestore)lastFocus?.focus();skipRestore=false;});
  $('case-order').addEventListener('click',()=>{skipRestore=true;dialog.close();draftOrder(`Хочу щось подібне до роботи «${cases[activeCase].title}». Мій задум: `);});
  $('process-open').addEventListener('click',()=>openCase(3,$('process-open')));
  if(PROCESS_VIDEO){
    const video=$('process-video');video.src=PROCESS_VIDEO;video.hidden=false;$('process-poster').hidden=true;$('process-open').hidden=true;
    $('process-title').textContent='Як народжується принт.';$('process-description').textContent='Зазирни у процес друку InColor: від нанесення до готової речі.';
    $('process-caption').hidden=true;
    video.addEventListener('error',()=>{video.hidden=true;$('process-poster').hidden=false;$('process-open').hidden=false;$('process-title').textContent='Вся увага — до деталей.';$('process-description').textContent='Роздивись приклад друку на тканині зблизька.';$('process-caption').hidden=false;});
  }
  const header=$('siteHeader'),burger=$('burgerBtn'),nav=$('mobileNav');
  function updateHeader(){header.classList.toggle('scrolled',scrollY>60);}window.addEventListener('scroll',updateHeader,{passive:true});updateHeader();
  burger.setAttribute('aria-controls','mobileNav');burger.setAttribute('aria-expanded','false');
  new MutationObserver(()=>burger.setAttribute('aria-expanded',nav.classList.contains('open'))).observe(nav,{attributes:true,attributeFilter:['class']});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('open')){window.closeMobile();burger.focus();}});
  document.querySelectorAll('.faq-question').forEach(q=>{q.tabIndex=0;q.setAttribute('role','button');q.setAttribute('aria-expanded','false');q.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();q.click();}});new MutationObserver(()=>q.setAttribute('aria-expanded',q.parentElement.classList.contains('open'))).observe(q.parentElement,{attributes:true,attributeFilter:['class']});});
})();

/* Price labels: confirmed prices include print. */
(() => {
  const products = [
    ['.about-flow-visual', 'Худі', '1 500', 'з друком'],
    ['img[src="images/portfolio-cap-mug-enhanced.webp"]', 'Чашка', '180', 'чашка · з друком'],
    ['img[src="images/showcase-shirt-red.webp"]', 'Футболка', '550', 'з друком'],
    ['img[src="images/showcase-shirt-black.webp"]', 'Футболка', '550', 'з друком']
  ];
  products.forEach(([selector, product, price, caption]) => {
    const target = document.querySelector(selector);
    const card = target && (target.matches('.about-flow-visual') ? target : target.closest('article'));
    if (!card || card.querySelector('.product-price-label')) return;
    const label = document.createElement('div');
    label.className = 'product-price-label';
    label.setAttribute('aria-label', product + ': ' + price + ' гривень з друком');
    const text = document.createElement('div');
    const amount = document.createElement('strong');
    amount.textContent = price + ' ₴';
    const note = document.createElement('small');
    note.textContent = caption;
    text.append(amount, note);
    label.append(text);
    card.append(label);
  });
})();
