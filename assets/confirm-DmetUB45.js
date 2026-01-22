import{y as b,g as n,A as $,z as f,k as y,u as p}from"./index-CmtoM4UA.js";import{o as d}from"./item-dialog-BuxtHGhI.js";function P({headline:i,content:s,cancelButton:a,confirmButton:t,blockScrimClick:k=!1,blockEscapeKey:g=!1,onDialogReady:w,styles:v}){return new Promise(async(A,h)=>{const o=document.createElement("div");let m=Promise.resolve(),u=Promise.resolve(),c=!1;b(n`
				<md-dialog
					?block-scrim-click="${k}"
					?block-escape-key="${g}"
					style="${d(v??{})}"
					@cancel=${e=>{const r=e.target;r.returnValue===""&&(c?r.hasAttribute("block-escape-key")&&e.preventDefault():r.hasAttribute("block-scrim-click")&&e.preventDefault(),c=!1)}}
					@keydown=${e=>{e.code==="Escape"&&(c=!0)}}
					@closed=${async e=>{switch(e.target.returnValue){case"":case"cancel":h(await m);break;default:A(await u)}e.target.remove(),o.remove()}}
				>
				</md-dialog>
			`,o),document.body.prepend(o);const l=o.querySelector(":scope > md-dialog");await l.updateComplete,b(n`
				<div slot="headline">${i}</div>
				<form method="dialog" id="inner-form" slot="content">
					${s(l)}
				</form>

				${a||t?n`
							<div slot="actions">
								${a?(()=>{a.buttonType=a.buttonType??"md-text-button";const e=y`${f(a.buttonType)}`;return p`
									<${e}
										id="cancelButton"
										style=${d(a.styles??{})}
										@click=${()=>{a.callback&&(m=new Promise(async r=>{r(await a.callback(l))}))}}
										form="inner-form"
										value="${a.dialogAction??"cancel"}"
										>${a.label??"Cancel"}</${e}
									>
								`})():$}
								${t?(()=>{t.buttonType=t.buttonType??"md-text-button";const e=y`${f(t.buttonType)}`;return p`
									<${e}
										id="confirmButton"
										style=${d(t.styles??{})}
										@click=${()=>{t.callback&&(u=new Promise(async r=>{r(await t.callback(l))}))}}
										form="inner-form"
										value="${t.dialogAction??"confirm"}"
										>${t.label??"Confirm"}</${e}
									>
								`})():$}
							</div>
					  `:null}
			`,l),l.$={confirmButton:null,cancelButton:null},l.querySelectorAll("[id]").forEach(e=>{l.$[e.getAttribute("id")]=e}),await l.updateComplete,await w?.(l),l.show()})}async function D({headline:i="Are you sure?",content:s="Are you sure to perform this action?",cancelButton:a={},confirmButton:t={}}={}){return await P({headline:i,content(){return s},confirmButton:t,cancelButton:a})}export{D as materialConfirm};
