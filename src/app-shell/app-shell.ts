import {type MdList} from '@material/web/list/list.js';
import {LitElement, html} from 'lit';
import {withStyles} from 'lit-with-styles';
import {customElement, query} from 'lit/decorators.js';
import {repeat} from 'lit/directives/repeat.js';
import {materialShellLoadingOff} from 'material-shell';
import {getItemDialog} from '../imports.js';
import {store} from '../store.js';
import styles from './app-shell.css?inline';
import {copyToClipboard} from '../utils.js';
import toast from 'toastit';
import {type MdListItem} from '@material/web/all.js';

declare global {
	interface Window {
		app: AppShell;
	}
	interface HTMLElementTagNameMap {
		'app-shell': AppShell;
	}
}

@customElement('app-shell')
@withStyles(styles)
export class AppShell extends LitElement {
	@query('md-list') list!: MdList;

	getListItems() {
		return this.list.items as MdListItem[];
	}
	get selectedListItem(): MdListItem {
		return this.getListItems().find((el) => el.tabIndex === 0);
	}

	async firstUpdated() {
		store.bind(this);
		materialShellLoadingOff.call(this);
	}

	updated() {
		// this.selectFirst();
	}

	async selectFirst() {
		try {
			await this.list.updateComplete;
			const item = this.list.items[0];
			if (item) {
				item.focus();
				// @ts-ignore
				this.list.listController.activateItem(item);
			}
		} catch {}
	}

	render() {
		if (!store.selectedLeaf) {
			return html`Not found or deleted.`;
		}
		return html`
			<md-list>
				${window.location.hash
					? (() => {
							const hash = window.location.hash
								.slice(1)
								.split('/')
								.slice(0, -2)
								.join('/');
							return html`
								<md-list-item type="button" href="#${hash}${hash ? '/' : ''}">
									<md-icon slot="start">arrow_back</md-icon>
									${hash}
								</md-list-item>
							`;
						})()
					: null}
				${store.selectedLeaf.items.length === 0
					? html`<div class="m-9">No bookmarks yet.</div>`
					: null}
				${repeat(
					store.selectedLeaf.items,
					(item) => item.title,
					(item) => {
						return html`<md-list-item
							type="button"
							target="${'url' in item ? '_blank' : ''}"
							href="${'url' in item
								? item.url
								: `#${window.location.hash.slice(1)}${item.title}/`}"
							@pointerenter=${(e: Event) => {
								const target = e.target as HTMLElement;
								target
									.querySelectorAll('md-icon-button')
									.forEach((el) => el.removeAttribute('transparent'));
							}}
							@pointerleave=${(e: Event) => {
								const target = e.target as HTMLElement;
								target
									.querySelectorAll('md-icon-button')
									.forEach((el) => el.setAttribute('transparent', ''));
							}}
						>
							${'items' in item
								? html`<md-icon slot="start">folder</md-icon>`
								: (() => {
										try {
											const url = new URL(item.url);
											return html`<md-icon slot="start"
												><img src="${url.protocol}//${url.host}/favicon.ico"
											/></md-icon>`;
										} catch (e) {
											console.log(e);
										}
									})()}
							${item.title}

							<md-icon-button
								transparent
								slot="end"
								class="move-up-button"
								@click=${async (e: PointerEvent) => {
									e.preventDefault();
									store.moveItemUp(item);
								}}
							>
								<md-icon>arrow_upward</md-icon>
							</md-icon-button>

							<md-icon-button
								transparent
								slot="end"
								class="move-down-button"
								@click=${async (e: PointerEvent) => {
									e.preventDefault();
									store.moveItemDown(item);
								}}
							>
								<md-icon>arrow_downward</md-icon>
							</md-icon-button>

							<md-icon-button
								transparent
								slot="end"
								@click=${async (e: PointerEvent) => {
									e.preventDefault();
									try {
										const dialog = await getItemDialog();
										const modifiedItem = await dialog.show(item);
										Object.assign(item, modifiedItem);
										store.requestUpdate();
									} catch {}
								}}
							>
								<md-icon>edit</md-icon>
							</md-icon-button>
						</md-list-item>`;
					},
				)}
			</md-list>

			<div id="fabs">
				<md-fab
					variant="small"
					@click=${async () => {
						copyToClipboard(JSON.stringify(store.structure));
						toast('Data copied to clipboard');
					}}
				>
					<md-icon slot="icon">download</md-icon>
				</md-fab>
				<md-fab
					size="large"
					@click=${async () => {
						try {
							const dialog = await getItemDialog();
							const item = await dialog.show();
							store.pushItem(item);
						} catch {}
					}}
				>
					<md-icon slot="icon">add</md-icon>
				</md-fab>
			</div>
		`;
	}

	activePreviousItem() {
		this.list.activatePreviousItem();
	}
	activeNextItem() {
		this.list.activateNextItem();
	}
}

export const app = (window.app = new AppShell());
