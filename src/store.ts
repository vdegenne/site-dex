import {ReactiveController, state} from '@snar/lit';
import {PropertyValueMap} from 'snar';
import {saveToLocalStorage} from 'snar-save-to-local-storage';
import {app} from './app-shell/app-shell.js';
import {activateFirstItem} from '@material/web/list/internal/list-navigation-helpers.js';
import {sleep} from './utils.js';

export interface Bookmark {
	title: string;
	url: string;
}

export interface BookmarkFolder {
	title: string;
	items: BookmarkOrFolder[];
}

export type BookmarkOrFolder = Bookmark | BookmarkFolder;

@saveToLocalStorage('site-dex:store')
class AppStore extends ReactiveController {
	@state() structure: BookmarkFolder = {
		title: 'root',
		items: [
			{title: 'X', url: 'https://x.com'},
			{title: 'sub', items: []},
		],
	};
	selectedLeaf = this.structure;

	firstUpdated() {
		const onHashChange = () => {
			let leaf = (this.selectedLeaf = this.structure);
			const hash = window.location.hash.slice(1);
			if (hash) {
				const parts = hash.split('/').filter((i) => i);
				for (const part of parts) {
					leaf = leaf.items.find(
						(i) => 'items' in i && i.title === part,
					) as BookmarkFolder;
					// if (leaf === undefined) {
					// 	console.log('yes');
					// 	break;
					// }
				}
				this.selectedLeaf = leaf;
			}
			this.requestUpdate();
		};
		window.addEventListener('hashchange', onHashChange);
		onHashChange();
	}

	pushItem(item: BookmarkOrFolder, folder = this.selectedLeaf) {
		folder.items.push(item);
		this.requestUpdate();
	}

	removeItem(item: BookmarkOrFolder, folder = this.selectedLeaf) {
		folder.items.splice(folder.items.indexOf(item) >>> 0, 1);
		this.requestUpdate();
	}

	getFullRoute(item: BookmarkFolder, folder = this.selectedLeaf) {}
}

export const store = new AppStore();
