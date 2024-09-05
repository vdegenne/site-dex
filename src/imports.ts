export async function getThemeStore() {
	const {themeStore} = await import('./styles/styles.js');
	return themeStore;
}

export async function getItemDialog() {
	const {ItemDialog} = await import('./item/item-dialog.js');
	return new ItemDialog();
}
