(() => {
 const triggers=[...document.querySelectorAll('.customs-trigger')];
 triggers.forEach((trigger,index)=>{
  trigger.addEventListener('click',()=>{
   const shouldOpen=trigger.getAttribute('aria-expanded')!=='true';
   const panel=document.getElementById(trigger.getAttribute('aria-controls'));
   trigger.setAttribute('aria-expanded',String(shouldOpen));
   trigger.closest('.customs-item').classList.toggle('is-open',shouldOpen);
   panel.inert=!shouldOpen;panel.setAttribute('aria-hidden',String(!shouldOpen));
  });
  trigger.addEventListener('keydown',event=>{
   const next=event.key==='ArrowDown'?(index+1)%triggers.length:event.key==='ArrowUp'?(index+triggers.length-1)%triggers.length:event.key==='Home'?0:event.key==='End'?triggers.length-1:null;
   if(next!==null){event.preventDefault();triggers[next].focus()}
  });
 });
})();
