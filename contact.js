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
 form.addEventListener('submit',event=>{
  event.preventDefault();
  if(!form.elements.name.value.trim()){form.elements.name.setCustomValidity('Пожалуйста, укажите ваше имя.');form.elements.name.reportValidity();return}
  if(active!=='telegram'&&(!/^[+0-9() .-]+$/.test(contact.value)||contact.value.replace(/\D/g,'').length<7)){contact.setCustomValidity('Укажите номер телефона с кодом страны.');contact.reportValidity();return}
  status.textContent='Форма пока работает в режиме предпросмотра. Отправка ещё не подключена — ваши данные никуда не отправлены.';
 });
 form.elements.name.addEventListener('input',()=>form.elements.name.setCustomValidity(''));
 const policy=document.querySelector('#callback-policy');
 form.querySelector('.policy-link').addEventListener('click',()=>policy.showModal());

 update();
 });
 const policy=document.querySelector('#callback-policy');
 policy.querySelector('button').addEventListener('click',()=>policy.close());
 const popup=document.querySelector('#callback-dialog');
 document.querySelectorAll('[data-callback]').forEach(button=>button.addEventListener('click',()=>popup.showModal()));
 popup.querySelector('.dialog-close').addEventListener('click',()=>popup.close());
 popup.addEventListener('click',event=>{if(event.target===popup){const r=popup.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)popup.close()}});
})();
