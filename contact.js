(() => {
 document.querySelectorAll('.callback-form').forEach(form=>{
 const messengerSet=form.querySelector('fieldset[hidden]');
 const contact=form.elements.contact;
 const label=form.querySelector('[id$=contact-label]');
 const status=form.querySelector('.callback-status');
 const drafts={phone:'',telegram:'',viber:'',whatsapp:''};
 let active='phone';
 function update(){
  drafts[active]=contact.value;
  const isMessenger=form.elements.method.value==='messenger';
  messengerSet.hidden=!isMessenger;messengerSet.disabled=!isMessenger;
  active=isMessenger?form.elements.messenger.value:'phone';
  const telegram=active==='telegram';
  contact.value=drafts[active];contact.type=telegram?'text':'tel';contact.inputMode=telegram?'text':'tel';
  contact.autocomplete=telegram?'off':'tel';contact.placeholder=telegram?'@username':'+375';
  contact.maxLength=telegram?33:24;
  if(telegram)contact.pattern='@?[A-Za-z][A-Za-z0-9_]{4,31}';else contact.removeAttribute('pattern');
  contact.title=telegram?'Имя пользователя Telegram: от 5 до 32 латинских букв, цифр или знаков подчёркивания':'Номер телефона с кодом страны';
  label.textContent=telegram?'Ваш Telegram':'Ваш номер телефона';
  form.querySelector('[id$=callback-action]').textContent=isMessenger?'Напишите мне':'Перезвоните мне';
  contact.setCustomValidity('');status.textContent='';
 }
 form.querySelectorAll('input[type=radio]').forEach(input=>input.addEventListener('change',update));
 contact.addEventListener('input',()=>{contact.setCustomValidity('');status.textContent=''});
 let sending=false;
 form.addEventListener('submit',async event=>{
  event.preventDefault();
  if(sending||!form.reportValidity())return;
  if(!form.elements.name.value.trim()){form.elements.name.setCustomValidity('Пожалуйста, укажите ваше имя.');form.elements.name.reportValidity();return}
  if(active!=='telegram'&&(!/^[+0-9() .-]+$/.test(contact.value)||contact.value.replace(/\D/g,'').length<7)){contact.setCustomValidity('Укажите номер телефона с кодом страны.');contact.reportValidity();return}
  const endpoint=document.querySelector('meta[name=ariva-feedback-endpoint]')?.content;
  if(!endpoint){status.textContent='Отправка пока не подключена. Свяжитесь с нами по телефону или в Telegram.';return}
  const submit=form.querySelector('button[type=submit]');
  const action=form.querySelector('[id$=callback-action]');
  const method=form.elements.method.value;
  const payload={name:form.elements.name.value.trim(),method,messenger:method==='messenger'?form.elements.messenger.value:null,contact:contact.value.trim(),consent:form.elements.consent.checked,website:form.elements.website?.value||''};
  sending=true;submit.disabled=true;form.setAttribute('aria-busy','true');action.textContent='Отправляем…';status.textContent='';
  const controller=new AbortController();
  const timeout=setTimeout(()=>controller.abort(),18000);
  try{
   const result=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),signal:controller.signal});
   const data=await result.json();
   if(!result.ok||data.ok!==true)throw new Error('delivery_failed');
   form.reset();Object.keys(drafts).forEach(key=>drafts[key]='');contact.value='';update();
   status.textContent='Спасибо! Заявка отправлена. Свяжемся в рабочее время.';
  }catch{
   status.textContent='Не удалось отправить заявку. Попробуйте ещё раз или свяжитесь с нами по телефону или в Telegram.';
  }finally{
   clearTimeout(timeout);
   sending=false;submit.disabled=false;form.removeAttribute('aria-busy');action.textContent=form.elements.method.value==='messenger'?'Напишите мне':'Перезвоните мне';
  }
 });
 form.elements.name.addEventListener('input',()=>form.elements.name.setCustomValidity(''));
 form.querySelector('.policy-link').addEventListener('click',()=>{window.location.href='privacy.html'});

 update();
 });
 const policy=document.querySelector('#callback-policy');
 policy.querySelector('button').addEventListener('click',()=>policy.close());
 const popup=document.querySelector('#callback-dialog');
 if(!popup)return;
 document.querySelectorAll('[data-callback]').forEach(button=>button.addEventListener('click',()=>popup.showModal()));
 popup.querySelector('.dialog-close').addEventListener('click',()=>popup.close());
 popup.addEventListener('click',event=>{if(event.target===popup){const r=popup.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)popup.close()}});
})();
