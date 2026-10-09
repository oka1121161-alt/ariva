const catalogGrid=document.querySelector('#catalog-grid');
const catalogMore=document.querySelector('#catalog-more');
const catalogCount=document.querySelector('#catalog-count');
const catalogFilters=[...document.querySelectorAll('.catalog-filter')];
const catalogPrev=document.querySelector('#catalog-prev'),catalogNext=document.querySelector('#catalog-next');
const catalogMobile=matchMedia('(max-width:700px)');
const catalogTablet=matchMedia('(max-width:1050px)'),catalogLaptop=matchMedia('(max-width:1240px)');
let catalogBrand='',catalogFilter='all',catalogExpanded=false,catalogVisible=[],catalogScrollFrame=0;
function catalogSpecs(car){
 if(car.type==='hybrid')return [
  car.fuel,
  car.batteryCapacity||'— кВт·ч',
  car.horsepower||'— л.с.',
  car.rangeCltc?`${car.rangeCltc} CLTC`:'— CLTC',
  car.drive
 ];
 const values=[car.fuel,car.batteryCapacity||(car.volume&&car.horsepower?`${car.volume} / ${car.horsepower}`:car.power)];
 if(car.batteryCapacity&&car.horsepower)values.push(car.horsepower);
 if(car.rangeCltc)values.push(`${car.rangeCltc} CLTC`);
 values.push(car.drive);
 return values;
}
function catalogCard(car){return `<article class="catalog-card" role="listitem" data-car-page="car-${car.id}.html"><div class="catalog-image"><img src="assets/catalog/${car.image}" alt="${car.name}" loading="lazy" decoding="async" width="1400" height="1050" style="object-position:${car.position||'50% 50%'}">${car.year?`<span class="catalog-year">${car.year}</span>`:''}</div><div class="catalog-card-body"><div class="catalog-car-heading"><h3><a href="car-${car.id}.html">${car.name}</a></h3>${car.trim?`<span>${car.trim}</span>`:''}</div><ul class="catalog-specs" aria-label="Параметры">${catalogSpecs(car).map(value=>`<li>${value}</li>`).join('')}</ul><div class="catalog-card-footer"><div class="catalog-price"><span>Стоимость</span><strong${car.price?'':' class="catalog-price-pending"'}>${car.price?`${car.price} <small>$</small>`:'По запросу'}</strong></div></div></div></article>`}
function catalogPosition(){
 if(!catalogMobile.matches)return;
 const cards=[...catalogGrid.children];if(!cards.length)return;
 const offset=catalogGrid.scrollLeft;
 const step=cards.length>1?cards[1].offsetLeft-cards[0].offsetLeft:cards[0].offsetWidth;
 const current=Math.min(cards.length-1,Math.round(offset/step));
 catalogCount.textContent=`${String(current+1).padStart(2,'0')} / ${String(cards.length).padStart(2,'0')}`;
 catalogPrev.disabled=offset<2;
 catalogNext.disabled=offset>=catalogGrid.scrollWidth-catalogGrid.clientWidth-2;
}
function mixCatalogCars(cars){
 const pattern=['petrol','petrol','electric','hybrid'];
 const queues={petrol:[],electric:[],hybrid:[]},other=[];
 cars.forEach(car=>(queues[car.type]||other).push(car));
 const mixed=[];
 while(Object.values(queues).some(queue=>queue.length)){
  pattern.forEach(type=>{if(queues[type].length)mixed.push(queues[type].shift())});
 }
 return mixed.concat(other);
}
function renderCatalog(){
 const total=catalogFilters.find(button=>button.dataset.filter==='all')?.querySelector('span');if(total)total.textContent=catalogCars.length;
 const filtered=catalogCars.filter(car=>(catalogFilter==='all'||car.type===catalogFilter)&&(!catalogBrand||car.name.startsWith(catalogBrand)));
 const cars=catalogFilter==='all'?mixCatalogCars(filtered):filtered;
 const columns=catalogTablet.matches?2:catalogLaptop.matches?3:4;
 catalogVisible=catalogMobile.matches||catalogExpanded?cars:cars.slice(0,columns*2);
 catalogGrid.innerHTML=catalogVisible.map(catalogCard).join('');
 catalogGrid.scrollTo({left:0,behavior:'instant'});
 catalogMore.hidden=false;
 catalogMore.setAttribute('aria-expanded',String(catalogExpanded));
 catalogMore.innerHTML=catalogExpanded?'Свернуть подборку <span aria-hidden="true">↑</span>':'Показать все автомобили';
 catalogCount.textContent=`${catalogVisible.length} из ${cars.length} автомобилей`;
 catalogPosition();
}
catalogFilters.forEach(button=>button.addEventListener('click',()=>{
 if(catalogFilter===button.dataset.filter&&!catalogBrand)return;
 catalogBrand='';
 catalogFilter=button.dataset.filter;catalogExpanded=false;
 catalogFilters.forEach(item=>{const active=item===button;item.classList.toggle('is-active',active);item.setAttribute('aria-pressed',String(active))});
 renderCatalog();
 if(!matchMedia('(prefers-reduced-motion: reduce)').matches)catalogGrid.animate([{opacity:.45,transform:'translateY(7px)'},{opacity:1,transform:'translateY(0)'}],{duration:380,easing:'cubic-bezier(.22,1,.36,1)'});
}));
catalogMore.addEventListener('click',()=>{location.href='catalog.html'});
catalogGrid.addEventListener('click',event=>{const card=event.target.closest('[data-car-page]');if(card)location.href=card.dataset.carPage});
function moveCatalog(direction){const cards=catalogGrid.children;if(!cards.length)return;const step=cards.length>1?cards[1].offsetLeft-cards[0].offsetLeft:cards[0].offsetWidth;catalogGrid.scrollBy({left:direction*step,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})}
catalogPrev.addEventListener('click',()=>moveCatalog(-1));catalogNext.addEventListener('click',()=>moveCatalog(1));
catalogGrid.addEventListener('keydown',event=>{if(event.target!==catalogGrid||!catalogMobile.matches)return;if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();moveCatalog(event.key==='ArrowRight'?1:-1)}});
catalogGrid.addEventListener('scroll',()=>{if(catalogScrollFrame)return;catalogScrollFrame=requestAnimationFrame(()=>{catalogPosition();catalogScrollFrame=0})},{passive:true});
[catalogMobile,catalogTablet,catalogLaptop].forEach(query=>query.addEventListener('change',renderCatalog));
window.addEventListener('resize',catalogPosition);
renderCatalog();

function applyMenuCatalog(brand='',fuel='all'){
 catalogBrand=brand;catalogFilter=fuel;catalogExpanded=false;
 catalogFilters.forEach(button=>{const active=button.dataset.filter===fuel;button.classList.toggle('is-active',active);button.setAttribute('aria-pressed',String(active))});
 renderCatalog();
}
