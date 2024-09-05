import{Q as b,k as m,u as f,A as p,l as k,D as y}from"./index-7kV3smd2.js";import{s as d}from"./item-dialog-Bh728tCR.js";function P({headline:i,content:o,cancelButton:t,confirmButton:a,blockScrimClick:w=!1,blockEscapeKey:g=!1,onDialogReady:c,styles:v}){return new Promise(async(A,h)=>{const s=document.createElement("div");let u=Promise.resolve(),$=Promise.resolve(),n=!1;b(m`
				<md-dialog
					?block-scrim-click="${w}"
					?block-escape-key="${g}"
					style="${d(v??{})}"
					@cancel=${e=>{const l=e.target;l.returnValue===""&&(n?l.hasAttribute("block-escape-key")&&e.preventDefault():l.hasAttribute("block-scrim-click")&&e.preventDefault(),n=!1)}}
					@keydown=${e=>{e.code==="Escape"&&(n=!0)}}
					@closed=${async e=>{switch(e.target.returnValue){case"":case"cancel":h(await u);break;case"confirm":default:A(await $)}e.target.remove(),s.remove()}}
				>
				</md-dialog>
			`,s),document.body.prepend(s);const r=s.querySelector(":scope > md-dialog");await r.updateComplete,b(m`
				<div slot="headline">${i}</div>
				<form method="dialog" id="inner-form" slot="content">
					${o(r)}
				</form>

				${t||a?m`
							<div slot="actions">
								${t?(()=>{t.buttonType=t.buttonType??"md-text-button";const e=f`${p(t.buttonType)}`;return k`
									<${e}
										id="cancelButton"
										style=${d(t.styles??{})}
										@click=${()=>{t.callback&&(u=new Promise(async l=>{l(await t.callback(r))}))}}
										form="inner-form"
										value="${t.dialogAction??"cancel"}"
										>${t.label??"Cancel"}</${e}
									>
								`})():y}
								${a?(()=>{a.buttonType=a.buttonType??"md-text-button";const e=f`${p(a.buttonType)}`;return k`
									<${e}
										id="confirmButton"
										style=${d(a.styles??{})}
										@click=${()=>{a.callback&&($=new Promise(async l=>{l(await a.callback(r))}))}}
										form="inner-form"
										value="${a.dialogAction??"confirm"}"
										>${a.label??"Confirm"}</${e}
									>
								`})():y}
							</div>
					  `:null}
			`,r),r.$={confirmButton:null,cancelButton:null},r.querySelectorAll("[id]").forEach(e=>{r.$[e.getAttribute("id")]=e}),await r.updateComplete,await(c==null?void 0:c(r)),r.show()})}async function x({headline:i="Are you sure?",content:o="Are you sure to perform this action?",cancelButton:t={},confirmButton:a={}}={}){return await P({headline:i,content(){return o},confirmButton:a,cancelButton:t})}export{x as materialConfirm,P as materialDialog};
