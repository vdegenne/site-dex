import {ReactiveController, state} from '@snar/lit';
import {saveToLocalStorage} from 'snar-save-to-local-storage';
import {app} from './app-shell/app-shell.js';

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

	@state() selectedIndexMap: {path: string; index: number}[] = [];

	firstUpdated() {
		const onHashChange = async () => {
			let leaf = (this.selectedLeaf = this.structure);
			const hash = decodeURIComponent(window.location.hash.slice(1));
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
			// await this.updateComplete;
			// await app.updateComplete;
			// app.selectFirst();
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

	moveItemUp(item: BookmarkOrFolder, folder = this.selectedLeaf) {
		const index = folder.items.indexOf(item);
		if (index <= 0) {
			return;
		}
		const newIndex = index - 1;
		const switchElement = folder.items[newIndex];
		folder.items[newIndex] = item;
		folder.items[index] = switchElement;
		this.requestUpdate();
	}
	moveItemDown(item: BookmarkOrFolder, folder = this.selectedLeaf) {
		const index = folder.items.indexOf(item);
		if (index === -1 || index === folder.items.length - 1) {
			return;
		}
		const newIndex = index + 1;
		const switchElement = folder.items[newIndex];
		folder.items[newIndex] = item;
		folder.items[index] = switchElement;
		this.requestUpdate();
	}

	getItemFromPath(path: string, from = this.structure) {
		const parts = path.split('/').filter((p) => p);
		for (const part of parts) {
			const nextLeaf = from.items.find((i) => i.title === part);
			if (nextLeaf === undefined) {
				// can't continue
				return null;
			}
			from = nextLeaf as BookmarkFolder;
		}
		return from;
	}

	// TODO: to implement
	getFullRoute(item: BookmarkFolder, folder = this.selectedLeaf) {}

	getPathSelectedIndex(path: string) {
		const info = this.selectedIndexMap.find((i) => i.path === path);
		if (info) {
			return info.index;
		} else {
			return 0;
		}
	}
	setPathSelectedIndex(path: string, index: number) {
		let info = this.selectedIndexMap.find((i) => i.path === path);
		if (!info) {
			info = {path, index};
			this.selectedIndexMap.push(info);
		} else {
			info.index = index;
		}
		this.selectedIndexMap = [...this.selectedIndexMap];
	}

	selectPreviousItem() {
		const currentPath = window.location.hash.slice(1);
		const currentFolder = this.getItemFromPath(currentPath);
		const numberOfItems = currentFolder.items.length;
		const currentIndex = this.getPathSelectedIndex(currentPath);
		const nextIndex = (currentIndex - 1 + numberOfItems) % numberOfItems;
		console.log(
			currentPath,
			currentFolder,
			numberOfItems,
			currentIndex,
			nextIndex,
		);
		this.setPathSelectedIndex(currentPath, nextIndex);
	}
	selectNextItem() {
		const currentPath = window.location.hash.slice(1);
		const currentFolder = this.getItemFromPath(currentPath);
		const numberOfItems = currentFolder.items.length;
		const currentIndex = this.getPathSelectedIndex(currentPath);
		const nextIndex = (currentIndex + 1) % numberOfItems;
		console.log(
			currentPath,
			currentFolder,
			numberOfItems,
			currentIndex,
			nextIndex,
		);
		this.setPathSelectedIndex(currentPath, nextIndex);
	}

	goUp() {
		const hash = window.location.hash;
		const parts = hash.split('/').filter((p) => p);
		parts.pop();
		window.location.hash = parts.join('/');
	}
}

export const store = new AppStore();
