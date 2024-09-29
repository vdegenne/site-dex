import type {MdDialog} from '@material/web/all.js';
import {customElement} from 'custom-element-decorator';
import {LitElement, html} from 'lit';
import {withStyles} from 'lit-with-styles';
import {state, query} from 'lit/decorators.js';
import styles from './item-dialog.css?inline';
import {bindInput} from 'relit';
import {type BookmarkFolder, type BookmarkOrFolder, store} from '../store.js';
import {confirm} from '../confirm.js';

declare global {
	interface Window {
		itemDialog: ItemDialog;
	}
	interface HTMLElementTagNameMap {
		'item-dialog': ItemDialog;
	}
}

@customElement({name: 'item-dialog', inject: true})
@withStyles(styles)
export class ItemDialog extends LitElement {
	@state() open = false;
	@state() type: 'Create' | 'Update' = 'Create';
	@state() trackItem: BookmarkOrFolder | undefined;
	@state() isFolder = false;
	@state() title = '';
	@state() url = '';

	@query('md-dialog') dialog!: MdDialog;

	render() {
		return html`
			<md-dialog
				?open=${this.open}
				@close=${() => {
					if (this.dialog.returnValue !== 'submit') {
						this.submitReject();
					} else {
						this.submit();
					}
					this.open = false;
				}}
				@closed=${() => {
					this.remove();
				}}
			>
				<header slot="headline">
					${this.type === 'Create'
						? this.isFolder
							? 'New folder'
							: 'New bookmark'
						: this.title}
				</header>

				<form slot="content" method="dialog" id="form">
					<md-outlined-text-field
						label="Title"
						${bindInput(this, 'title')}
					></md-outlined-text-field
					><br />
					<label
						class="block my-9"
						@input=${() => {
							this.isFolder = !this.isFolder;
						}}
					>
						<md-checkbox
							class="mr-2"
							slot="start"
							?checked=${this.isFolder}
							inert
						></md-checkbox>
						Folder
					</label>
					${!this.isFolder
						? html`
								<md-outlined-text-field
									type="url"
									label="URL"
									${bindInput(this, 'url')}
								></md-outlined-text-field>
							`
						: null}
				</form>

				<div slot="actions">
					${this.trackItem
						? html`<md-filled-button error @click=${this.confirmDeletion}>
								<md-icon slot="icon">delete</md-icon>
								Delete item</md-filled-button
							>`
						: null}
					<md-text-button form="form" value="cancel">Cancel</md-text-button>
					<md-filled-button
						value="submit"
						form="form"
						?disabled=${this.title === '' || (!this.isFolder && !this.url)}
					>
						${this.type}
					</md-filled-button>
				</div>
			</md-dialog>
		`;
	}

	@confirm({content: 'Are you sure to delete this item?'})
	confirmDeletion() {
		store.removeItem(this.trackItem);
		this.close('other');
	}

	submit() {
		let returnObject: BookmarkOrFolder;
		if (this.isFolder) {
			returnObject = {
				title: this.title,
				items: (this.trackItem as BookmarkFolder)?.items ?? [],
			};
		} else {
			returnObject = {
				title: this.title,
				url: this.url,
			};
		}
		this.submitResolve(returnObject);
	}

	submitResolve: (value: BookmarkOrFolder) => void;
	submitReject: (reason?: any) => void;

	async show(item?: BookmarkOrFolder) {
		this.trackItem = item;
		if (item) {
			this.type = 'Update';
			this.title = item.title;
			this.isFolder = 'items' in item;
			if ('url' in item) {
				this.url = item.url;
			}
		}
		this.open = true;
		const promise = new Promise<BookmarkOrFolder>((resolve, reject) => {
			this.submitResolve = resolve;
			this.submitReject = reject;
		});
		return promise;
	}

	close(returnValue?: string) {
		return this.dialog.close(returnValue);
	}
}
