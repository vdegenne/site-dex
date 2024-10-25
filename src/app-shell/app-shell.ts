import {type MdList} from '@material/web/list/list.js';
import {until} from 'lit/directives/until.js';
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
	get selectedListItem() {
		// return this.getListItems().find((el) => el.tabIndex === 0);
		return this.list.items.find((item) => item.hasAttribute('selected'));
	}

	async firstUpdated() {
		store.bind(this);
		materialShellLoadingOff.call(this);
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
		console.log('rendered');
		if (!store.selectedLeaf) {
			return html`Not found or deleted.`;
		}
		const pathname = window.location.hash;

		return html`
			<md-list>
				${pathname
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
					(item, itemIndex) => {
						return html`<md-list-item
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
							?selected=${store.getPathSelectedIndex(pathname) === itemIndex}
						>
							${'items' in item
								? html`<md-icon slot="start" fill>folder</md-icon>`
								: until(this.renderFavicon(item.url))}
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

	async renderFavicon(url: string) {
		try {
			const _URL = new URL('/favicon.ico', url);
			const src = _URL.toString();

			// Create an Image element to check if the favicon exists
			const image = new Image();
			image.src = src;

			// Return a promise that resolves once the image has loaded or failed
			const imageExists = await new Promise((resolve) => {
				image.onload = () => resolve(true); // Resolves to true if image loads successfully
				image.onerror = () => resolve(false); // Resolves to false if there's an error loading
			});

			// Return the icon if the image exists, otherwise return an empty string
			return imageExists ? html`<md-icon slot="start">${image}</md-icon>` : '';
		} catch (_error) {
			return ''; // Return empty if there's an error (invalid URL, etc.)
		}
	}
}

export const app = (window.app = new AppShell());
