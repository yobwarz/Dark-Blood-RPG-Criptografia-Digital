import {ID,esc} from './model.mjs';

export async function diceHTML(roll){
 if(typeof roll?.render==='function')return roll.render();
 return `<div class="dice-roll"><div class="dice-result"><div class="dice-formula">${esc(roll?.formula??'1d20')}</div><h4 class="dice-total">${esc(roll?.total??'')}</h4></div></div>`;
}

export async function testCard({title,actorName,skillName,difficulty,success,matches=true,progress,currentDC,opened=false,discovery=false},roll){
 const label=success?'Sucesso':matches===false?'Falha na combinação':'Falha no teste';
 const reason=opened?'Proteção aberta.':discovery?(success?'A etapa foi descoberta.':'A etapa permanece oculta; CD e progresso preservados.'):matches===false?'A perícia escolhida não corresponde à próxima etapa. A sequência foi reiniciada.':success?'Etapa concluída.':'A rolagem não alcançou a CD. A sequência foi reiniciada.';
 return `<div class="se-flavor cd-test-card"><h3>${esc(title)} — Análise</h3><small>${esc(actorName)} · ${esc(skillName)} · CD ${esc(difficulty)}</small><p class="se-resultado ${success?'ok':'falha'}">${label}</p><p class="se-nota">${esc(reason)}</p><p class="se-nota">Progresso ${esc(progress)} · CD atual ${esc(currentDC)}</p>${await diceHTML(roll)}</div>`;
}

export async function prepareTestChat(message,html){
 // Only dice results produced by this module. Never restyle request/update notices.
 if(!message?.flags?.[ID]?.event||message.flags[ID].request||!message.rolls?.length||message.isContentVisible===false||message.blind&&!globalThis.game?.user?.isGM)return;
 const root=html?.querySelector?html:html?.[0];if(!root)return;
 const card=root.closest?.('.chat-message')??root;
 card.classList.add('se-chat-card','cd-test-message');
 const content=root.matches?.('.message-content')?root:root.querySelector?.('.message-content');
 if(!content||content.querySelector('.dice-roll'))return;
 const target=content.querySelector('.se-flavor')??content;
 const rendered=await diceHTML(message.rolls[0]);
 // A rerender may have added the block while native rendering was pending.
 if(!content.querySelector('.dice-roll'))target.insertAdjacentHTML('beforeend',rendered);
}
