import {setupProtocolForm} from './protocol-form.mjs';
// Extensão local: não altera os formulários nativos nem outros módulos.
export function waitForm(config){
 class ValidatedFormDialog extends foundry.applications.api.DialogV2{
  async _onRender(...args){await super._onRender?.(...args);setupProtocolForm(this.element);}
  async _onSubmit(target,event){
   event?.preventDefault?.();if(this._savingForm)return this;
   const form=target?.form??this.element?.querySelector('form'),output=this.element?.querySelector('[data-form-error]');if(output)output.textContent='';
   if(target?.dataset?.action!=='cancel'&&form?.reportValidity?.()===false){const field=form.querySelector?.(':invalid');if(output)output.textContent=field?.dataset?.label?`${field.dataset.label}: ${field.validationMessage||'preencha este campo.'}`:'Confira os campos indicados no formulário.';return this;}
   const buttons=Array.from(this.element?.querySelectorAll('button[data-action]')??[]).map(button=>[button,button.disabled]);this._savingForm=true;
   try{return await super._onSubmit(target,event);}
   catch(error){const message=error?.message??String(error);if(output)output.textContent=message;else ui.notifications.warn(message);const field=error?.field?form?.elements?.namedItem?.(error.field):null;if(field){let parent=field.parentElement;while(parent){if(parent.tagName==='DETAILS')parent.open=true;parent=parent.parentElement;}field.focus?.();field.scrollIntoView?.({block:'center',behavior:'smooth'});}else output?.focus?.();return this;}
   finally{this._savingForm=false;for(const [button,disabled] of buttons)if(button.isConnected)button.disabled=disabled;}
  }
 }
 return ValidatedFormDialog.wait(config);
}
