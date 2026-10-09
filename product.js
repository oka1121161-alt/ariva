(() => {
 const car=catalogCars.find(c=>c.id===Number(document.querySelector('[data-product-id]').dataset.productId));
 if(!car)return;
 const escape=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
 const format=new Intl.NumberFormat('ru-RU');
 const volume=car.batteryCapacity||car.volume||(car.type==='electric'?'—':car.power);
 const output=car.horsepower||(car.type==='electric'?car.power:'Уточняется');
 const mileage=car.mileage==null?'Уточняется':format.format(car.mileage)+' км';
 const year=car.year||'Уточняется';
 const photos=car.photos?.length?car.photos:[car.image];
 const photoLabel=index=>`${car.name} — ${index<(car.exteriorCount??photos.length)?'вид снаружи':'салон'}, фото ${index+1}`;
 const gallery=photos.map((photo,index)=>`<div class="product-slide"><img src="assets/catalog/${escape(photo)}" alt="${escape(photoLabel(index))}" width="1400" height="1050" ${index?'loading="lazy"':'fetchpriority="high"'} decoding="async" style="object-position:${escape(car.position||'50% 50%')}"></div>`).join('');
 const thumbnails=photos.length>1?`<div class="product-thumbnails" aria-label="Фотографии автомобиля">${photos.map((photo,index)=>`<button type="button" class="product-thumbnail" data-photo="${index}" aria-label="${escape(photoLabel(index))}" aria-pressed="${index===0}"><img src="assets/catalog/${escape(photo)}" alt="" width="84" height="63" loading="lazy" decoding="async"></button>`).join('')}</div>`:'';
 const price=car.price?`${escape(car.price)} <small>USD</small>`:'По запросу';
 document.title=car.name+' — ARIVA';
 document.querySelector('#product-content').innerHTML=`<p class="section-eyebrow">АВТОМОБИЛИ ИЗ КИТАЯ</p><h1>${escape(car.name)}${car.trim?` <span>${escape(car.trim)}</span>`:''}</h1><div class="product-layout"><div class="product-gallery"><div class="product-photo-frame"><div class="product-photo product-photo-track" id="product-photo-track" role="region" aria-label="Фотографии ${escape(car.name)}" tabindex="0">${gallery}</div>${photos.length>1?`<span class="product-photo-counter" aria-hidden="true"><span id="product-photo-current">01</span> / ${String(photos.length).padStart(2,'0')}</span>`:''}</div>${thumbnails}</div><aside class="product-summary">${car.year?`<span class="section-eyebrow">${escape(car.year)}</span>`:''}<h2>${escape(car.name)}</h2><dl><div><dt>Тип двигателя</dt><dd>${escape(car.fuel)}</dd></div><div><dt>${car.batteryCapacity?'Батарея / мощность':'Объем / мощность'}</dt><dd>${escape(volume)} / ${escape(output)}</dd></div>${car.rangeCltc?`<div><dt>Запас хода (CLTC)</dt><dd>${format.format(car.rangeCltc)} км</dd></div>`:''}<div><dt>Привод</dt><dd>${escape(car.drive)}</dd></div><div><dt>Год выпуска</dt><dd>${escape(year)}</dd></div><div><dt>Пробег</dt><dd>${escape(mileage)}</dd></div></dl><p class="product-price${car.price?'':' product-price-pending'}"><span class="product-price-amount">${price}</span><span class="product-price-note">под ключ, со всеми расходами</span></p><button class="button" data-callback>Получить консультацию</button><p class="photo-note">Уточним наличие, комплектацию и итоговую стоимость.</p></aside></div><section class="product-description"><h2>Об автомобиле</h2><p>${escape(car.name)}${car.trim?`, комплектация ${escape(car.trim)}`:''}${car.year?`, ${escape(car.year)} года`:''}. Тип двигателя — ${escape(car.fuel.toLowerCase())}, привод — ${escape(car.drive)}.${car.mileage!=null?` Пробег — ${escape(mileage)}.`:''}</p><p>Расскажем подробнее об этом варианте, уточним оснащение и подготовим расчёт покупки и доставки в Беларусь. На консультации можно запросить видео и информацию о проверке автомобиля.</p></section>`;
 document.querySelector('[data-callback]').addEventListener('click',()=>document.querySelector('#callback-dialog').showModal());
 if(photos.length<2)return;
 const track=document.querySelector('#product-photo-track');
 const buttons=[...document.querySelectorAll('[data-photo]')];
 const counter=document.querySelector('#product-photo-current');
 let active=0,scrollFrame=0;
 const markPhoto=index=>{
  active=index;
  buttons.forEach((button,i)=>button.setAttribute('aria-pressed',String(i===index)));
  counter.textContent=String(index+1).padStart(2,'0');
 };
 const showPhoto=index=>{
  index=Math.max(0,Math.min(photos.length-1,index));
  track.scrollTo({left:index*track.clientWidth,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
 };
 buttons.forEach((button,index)=>button.addEventListener('click',()=>showPhoto(index)));
 track.addEventListener('scroll',()=>{
  if(scrollFrame)return;
  scrollFrame=requestAnimationFrame(()=>{
   const index=Math.min(photos.length-1,Math.max(0,Math.round(track.scrollLeft/track.clientWidth)));
   if(index!==active){markPhoto(index);buttons[index].scrollIntoView({block:'nearest',inline:'nearest',behavior:'smooth'});}
   scrollFrame=0;
  });
 },{passive:true});
 track.addEventListener('keydown',event=>{
  if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();showPhoto(active+(event.key==='ArrowRight'?1:-1));}
  else if(event.key==='Home'||event.key==='End'){event.preventDefault();showPhoto(event.key==='Home'?0:photos.length-1);}
 });
 window.addEventListener('resize',()=>track.scrollTo({left:active*track.clientWidth,behavior:'instant'}));
})();
