// Presentation only: no calculation, exchange-rate or form-state changes.
(() => {
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 if(!reduced.matches){
  document.querySelector('.calculator-grid').animate([{opacity:0,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],{duration:650,easing:'cubic-bezier(.22,1,.36,1)'});
 }
 const values=[...document.querySelectorAll('.result-row strong,#result-total,#result-total-byn')];
 const previous=new Map(values.map(el=>[el,el.textContent]));
 new MutationObserver(()=>{
  values.forEach(el=>{
   if(previous.get(el)===el.textContent)return;
   previous.set(el,el.textContent);
   if(reduced.matches)return;
   el.getAnimations().forEach(animation=>animation.cancel());
   el.animate([{opacity:.35,transform:'translateY(4px)'},{opacity:1,transform:'translateY(0)'}],{duration:360,easing:'cubic-bezier(.22,1,.36,1)'});
  });
 }).observe(document.querySelector('.calculator-result'),{subtree:true,childList:true,characterData:true});
})();
