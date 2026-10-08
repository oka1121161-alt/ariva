(() => {
 const form=document.querySelector('#shop-filters'),brands={AITO:['M5','M7','M9'],Avatr:['11','12','07'],BMW:['i3','iX3'],BYD:['Song Plus','Sea Lion 06','Han','Seal'],Deepal:['S05','S07','L07'],Denza:['D9','N7'],Dongfeng:['Mage','Huge'],Geely:['Monjaro','Coolray','Boyue L','Xingyue L'],Honda:['CR-V','Accord'],Hongqi:['H5','HS5','E-HS9'],Leapmotor:['C10','C11','C16'],Leopard:['Bao 5','Bao 8'],Mazda:['CX-5','EZ-6'],'Mercedes-Benz':['C-Class','E-Class','GLC'],Nissan:['Qashqai','X-Trail'],'Polar Stone':['01'],Toyota:['Camry','RAV4'],Tesla:['Model 3','Model Y'],Volkswagen:['ID.3','ID.4','ID.6'],Voyah:['Free','Dream'],Xiaomi:['SU7','YU7'],Zeekr:['X','001','7X'],'Li Xiang':['L6','L7','L8','L9'],AUDI:['E5'],Changan:['CS75 Plus','UNI-K'],GAC:['GS8','Aion Y'],'Lynk & Co':['01','08','09']};
 Object.keys(brands).sort().forEach(brand=>form.elements.brand.add(new Option(brand,brand)));
 const params=new URLSearchParams(location.search);if(params.get('brand')==='Li Auto')params.set('brand','Li Xiang');
 function models(){const brand=form.elements.brand.value;form.elements.model.replaceChildren(new Option('Все модели',''));(brands[brand]||[]).forEach(model=>form.elements.model.add(new Option(model,model)));form.elements.model.disabled=!brand;}
 for(const [key,value] of params){const el=form.elements.namedItem(key);if(el&&key!=='model')el.value=value;}
 models();form.elements.model.value=params.get('model')||'';
 function sync(){const query=new URLSearchParams();for(const [key,value] of new FormData(form))if(value)query.set(key,value);history.replaceState(null,'','catalog.html'+(query.size?'?'+query:''));document.querySelector('#filter-status').textContent=query.size?'Параметры сохранены. Каталог готовится к запуску.':'';}
 form.elements.brand.addEventListener('change',models);form.addEventListener('change',sync);form.addEventListener('submit',e=>{e.preventDefault();sync()});form.addEventListener('reset',()=>setTimeout(()=>{models();sync()},0));
})();
