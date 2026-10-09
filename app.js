const header=document.querySelector('.header'), mega=document.querySelector('#mega'), content=document.querySelector('#mega-content'), navButtons=[...document.querySelectorAll('[data-menu]')];
let activeMenu=null,closeTimer;
const menus={cars:{a:'ВЫБЕРИТЕ СВОЙ АВТОМОБИЛЬ',b:'ВАШ ФОРМАТ',items:[['Geely Monjaro','Комфорт в каждой поездке'],['Li Auto L6','Новый взгляд на электричество'],['Avatr 12','Дизайн, который притягивает'],['Zeekr 7X','Новый уровень комфорта'],['BYD Sea Lion 06','Технологии на каждый день']],second:[['Электромобили','Тишина. Динамика. Технологии.'],['Гибриды','Свобода дальних поездок'],['Бензиновые авто','Знакомый характер, новые возможности']],title:'Тот самый.<br>По вашим правилам.',text:'Расскажите, что важно для вас. Найдём автомобиль под ваш стиль жизни.'},delivery:{a:'ПУТЬ ВАШЕГО АВТО',b:'ВСЁ ПОД КОНТРОЛЕМ',items:[['01. Подбор','Модель, комплектация, ваши пожелания'],['02. Проверка','Изучаем автомобиль перед покупкой'],['03. Доставка','Организуем маршрут в Беларусь']],second:[['Расчёт стоимости','Разберём, из чего складывается цена'],['Документы','Поможем разобраться в оформлении'],['Получение автомобиля','Самый приятный этап пути']],title:'Далеко —<br>не значит сложно.',text:'От первого вопроса до ключей в ваших руках. Обсудим каждый этап заранее.'},about:{a:'ЗНАКОМЬТЕСЬ, ARIVA',b:'ДАВАЙТЕ НА СВЯЗИ',items:[['Наш подход','Внимание к автомобилю и его владельцу'],['Команда','Люди, которым вы доверяете свой выбор'],['Вопросы и ответы','О самом важном перед покупкой']],second:[['Обсудить автомобиль','Начнём с ваших пожеланий'],['Сотрудничество','Возможности для партнёров']],title:'Ваш выбор.<br>Наша забота.',text:'Делаем путь к автомобилю понятным — от Китая до Беларуси.'}};
function menuMarkup(key){if(key==='cars')return `<div class="catalog-menu-column"><p class="menu-heading">ПОПУЛЯРНЫЕ БРЕНДЫ</p>${['Geely','Li Auto','Avatr','BYD','Zeekr'].map(brand=>`<a class="menu-link" href="catalog.html?brand=${encodeURIComponent(brand)}" data-catalog-brand="${brand}"><b>${brand}</b></a>`).join('')}<a class="all-brands-button" href="./" data-catalog-brand="">Все бренды <span>→</span></a></div><div class="catalog-menu-column"><p class="menu-heading">ТИП ДВИГАТЕЛЯ</p><a class="menu-link" href="catalog.html?fuel=electric" data-catalog-fuel="electric"><b>Электро</b><small>Полностью электрические автомобили</small></a><a class="menu-link" href="catalog.html?fuel=petrol" data-catalog-fuel="petrol"><b>ДВС</b><small>Бензиновые автомобили</small></a><a class="menu-link" href="catalog.html?fuel=hybrid" data-catalog-fuel="hybrid"><b>Гибрид</b><small>Два источника энергии</small></a></div>`;return `<div class="mobile-nav-panel"><p class="menu-heading">ARIVA · ВЫБОР БЕЗ ГРАНИЦ</p><nav aria-label="Мобильная навигация"><a href="catalog.html"><small>01</small>Каталог</a><a href="./#process"><small>02</small>Этапы работы</a><a href="faq.html"><small>03</small>Часто задаваемые вопросы</a><a href="calculator.html"><small>04</small>Калькулятор растаможки</a></nav><div class="mobile-nav-contact"><p>МЫ ВСЕГДА НА СВЯЗИ</p><a href="tel:+375298777208" class="mobile-nav-phone">+375 29 877-72-08</a><a class="mobile-nav-telegram" href="https://t.me/ariva_by" target="_blank" rel="noopener noreferrer">Написать в Telegram</a></div></div>`}
function openMenu(key){clearTimeout(closeTimer);if(activeMenu!==key){content.innerHTML=menuMarkup(key);mega.classList.toggle("catalog-dropdown",key==="cars");if(!matchMedia('(prefers-reduced-motion: reduce)').matches)content.animate([{opacity:.2,transform:'translateY(6px)'},{opacity:1,transform:'translateY(0)'}],{duration:280,easing:'ease-out'});}activeMenu=key;mega.inert=false;header.classList.add('menu-open');document.body.classList.add('menu-is-open');navButtons.forEach(b=>b.setAttribute('aria-expanded',String(b.dataset.menu===key)));document.querySelector('.mobile-toggle').setAttribute('aria-expanded','true');document.querySelector('.mobile-toggle').setAttribute('aria-label','Закрыть меню');}
function closeMenu(){activeMenu=null;header.classList.remove('menu-open');document.body.classList.remove('menu-is-open');mega.inert=true;navButtons.forEach(b=>b.setAttribute('aria-expanded','false'));document.querySelector('.mobile-toggle').setAttribute('aria-expanded','false');document.querySelector('.mobile-toggle').setAttribute('aria-label','Открыть меню');}
navButtons.forEach(b=>{b.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')openMenu(b.dataset.menu)});b.addEventListener('click',()=>{if(activeMenu===b.dataset.menu&&b.dataset.clicked==='true'){closeMenu();b.dataset.clicked='false'}else{openMenu(b.dataset.menu);b.dataset.clicked='true'}});b.addEventListener('keydown',e=>{if(e.key==='ArrowDown'){e.preventDefault();openMenu(b.dataset.menu);content.querySelector('.menu-link').focus()}})});
header.addEventListener('pointerleave',()=>{if(matchMedia('(min-width:1201px)').matches)closeTimer=setTimeout(closeMenu,180)});header.addEventListener('pointerenter',()=>clearTimeout(closeTimer));header.addEventListener('focusout',e=>{if(!header.contains(e.relatedTarget))closeMenu()});document.querySelector('.scrim').addEventListener('click',closeMenu);document.querySelector('.mobile-toggle').addEventListener('click',()=>activeMenu?closeMenu():openMenu('mobile'));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&activeMenu){const previous=activeMenu;closeMenu();navButtons.find(b=>b.dataset.menu===previous)?.focus()}});
const brandLogos = [['aito', 'AITO'], ['avatr', 'Avatr'], ['bmw', 'BMW'], ['byd', 'BYD'], ['deepal', 'Deepal'], ['denza', 'Denza'], ['dongfeng', 'Dongfeng'], ['geely', 'Geely'], ['honda', 'Honda'], ['hongqi', 'Hongqi'], ['leapmotor', 'Leapmotor'], ['leopard', 'Leopard'], ['mazda', 'Mazda'], ['mercedes-benz', 'Mercedes-Benz'], ['nissan', 'Nissan'], ['polar-stone', 'Polar Stone'], ['toyota', 'Toyota'], ['tesla', 'Tesla'], ['volkswagen', 'Volkswagen'], ['voyah', 'Voyah'], ['xiaomi', 'Xiaomi'], ['zeekr', 'Zeekr'], ['li-xiang', 'Li Xiang']];
const brands = brandLogos.map(([id,name]) => `<a class="brand brand-image" href="catalog.html?brand=${encodeURIComponent(name)}" aria-label="Каталог ${name}"><span class="brand-mark" style="--brand-logo:url('assets/brands/${id}.svg?v=2')"></span></a>`).join('');
const brandTrack = document.querySelector('#brand-track');
if(brandTrack){brandTrack.innerHTML=`<div class="brand-set">${brands}</div><div class="brand-set" aria-hidden="true">${brands}</div>`;
brandTrack.querySelectorAll('.brand-set[aria-hidden] a').forEach(brand=>{brand.tabIndex=-1;});
 const carousel=brandTrack.closest('.brands');
 const reducedMotion=matchMedia('(prefers-reduced-motion: reduce)');
 let offset=0,cycle=0,lastFrame=0,pointer=null,hovered=false,suppressClick=false;
 carousel.classList.add('is-draggable');
 const wrap=value=>cycle?((value%cycle)+cycle)%cycle:0;
 const render=()=>{brandTrack.style.transform=`translate3d(${-offset}px,0,0)`};
 const measure=()=>{cycle=brandTrack.querySelector('.brand-set').getBoundingClientRect().width;offset=wrap(offset);render()};
 new ResizeObserver(measure).observe(brandTrack.querySelector('.brand-set'));
 measure();
 carousel.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse')hovered=true});
 carousel.addEventListener('pointerleave',event=>{if(event.pointerType==='mouse')hovered=false});
 carousel.addEventListener('dragstart',event=>event.preventDefault());
 carousel.addEventListener('pointerdown',event=>{
  if(!event.isPrimary||event.button!==0)return;
  suppressClick=false;
  pointer={id:event.pointerId,x:event.clientX,y:event.clientY,offset,dragging:false};
 });
 carousel.addEventListener('pointermove',event=>{
  if(!pointer||pointer.id!==event.pointerId)return;
  const dx=event.clientX-pointer.x,dy=event.clientY-pointer.y;
  if(!pointer.dragging){
   if(Math.abs(dx)<(event.pointerType==='mouse'?5:8))return;
   if(event.pointerType!=='mouse'&&Math.abs(dy)>Math.abs(dx)){pointer=null;return;}
   pointer.dragging=true;
   carousel.classList.add('is-dragging');
   carousel.setPointerCapture(event.pointerId);
  }
  event.preventDefault();
  offset=wrap(pointer.offset-dx);
  render();
 });
 const release=event=>{
  if(!pointer||pointer.id!==event.pointerId)return;
  suppressClick=pointer.dragging&&event.type!=='pointercancel';
  pointer=null;
  carousel.classList.remove('is-dragging');
  if(carousel.hasPointerCapture(event.pointerId))carousel.releasePointerCapture(event.pointerId);
 };
 window.addEventListener('pointerup',release);
 window.addEventListener('pointercancel',release);
 carousel.addEventListener('lostpointercapture',release);
 carousel.addEventListener('click',event=>{
  if(suppressClick&&event.detail!==0){event.preventDefault();event.stopPropagation();suppressClick=false;}
 },true);
 carousel.addEventListener('keydown',event=>{
  if(event.key!=='ArrowLeft'&&event.key!=='ArrowRight')return;
  event.preventDefault();
  offset=wrap(offset+(event.key==='ArrowRight'?1:-1)*carousel.clientWidth*.6);
  render();
 });
 function moveBrands(now){
  const elapsed=lastFrame?Math.min(now-lastFrame,64):0;
  lastFrame=now;
  if(!document.hidden&&!pointer&&!hovered&&!reducedMotion.matches&&!carousel.matches(':has(.brand:focus-visible)')){
   offset=wrap(offset+cycle*elapsed/160000);
   render();
  }
  requestAnimationFrame(moveBrands);
 }
 requestAnimationFrame(moveBrands);
}

const dialog=document.querySelector('#request-dialog'),form=document.querySelector('#request-form');function request(model=''){closeMenu();let saved={};try{saved=JSON.parse(localStorage.getItem('ariva-preferences')||'{}')}catch{}form.elements.model.value=model||saved.model||'';form.elements.budget.value=saved.budget||'Пока определяюсь';document.querySelector('#form-result').textContent='';dialog.showModal();}
document.addEventListener('click',e=>{const switcher=e.target.closest('[data-switch]');if(switcher)openMenu(switcher.dataset.switch);const req=e.target.closest('[data-request]');if(req)request();const choice=e.target.closest('[data-choice]');if(choice)request(['Geely Monjaro','Li Auto L6','Avatr 12','Zeekr 7X','BYD Sea Lion 06'].includes(choice.dataset.choice)?choice.dataset.choice:'');});dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});form.addEventListener('submit',e=>{e.preventDefault();try{localStorage.setItem('ariva-preferences',JSON.stringify(Object.fromEntries(new FormData(form))));document.querySelector('#form-result').textContent='Готово! Ваш выбор сохранён в этом браузере.'}catch{document.querySelector('#form-result').textContent='Браузер не разрешил сохранение. Ваш выбор пока остаётся в форме.'}});


// Accordion panels use intrinsic CSS grid heights, so rapid clicks reverse smoothly.
const processSteps=[...document.querySelectorAll('.process-step')];
const processTriggers=processSteps.map(step=>step.querySelector('.process-trigger'));
const processCounter=document.querySelector('#process-current');
const processBars=[...document.querySelectorAll('.process-progress>span')];
let counterAnimation;
function setProcessStep(index){
 processSteps.forEach((step,i)=>{
  const open=i===index,panel=step.querySelector('.step-panel');
  step.classList.toggle('is-open',open);
  processTriggers[i].setAttribute('aria-expanded',String(open));
  panel.setAttribute('aria-hidden',String(!open));
  panel.inert=!open;
 });
 processCounter.textContent=index<0?'—':String(index+1).padStart(2,'0');
 processBars.forEach((bar,i)=>{bar.classList.toggle('is-current',i===index);bar.classList.toggle('is-past',i<index)});
 counterAnimation?.cancel();
 if(!matchMedia('(prefers-reduced-motion: reduce)').matches){
  counterAnimation=processCounter.animate([{opacity:.35,transform:'translateY(5px)'},{opacity:1,transform:'translateY(0)'}],{duration:420,easing:'cubic-bezier(.22,1,.36,1)'});
 }
}
processTriggers.forEach((trigger,index)=>{
 trigger.addEventListener('click',()=>setProcessStep(trigger.getAttribute('aria-expanded')==='true'?-1:index));
 trigger.addEventListener('keydown',event=>{
  let next;
  if(event.key==='ArrowDown')next=(index+1)%processTriggers.length;
  else if(event.key==='ArrowUp')next=(index-1+processTriggers.length)%processTriggers.length;
  else if(event.key==='Home')next=0;
  else if(event.key==='End')next=processTriggers.length-1;
  if(next!==undefined){event.preventDefault();processTriggers[next].focus()}
 });
});

 document.querySelectorAll('.nav-calculator').forEach(link=>link.addEventListener('pointerenter',closeMenu));

content.addEventListener("click",event=>{if(event.target.closest("a"))closeMenu()});

document.querySelectorAll(".desktop-nav>a").forEach(link=>link.addEventListener("pointerenter",closeMenu));
