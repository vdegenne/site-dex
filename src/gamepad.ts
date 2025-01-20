import gamectrl, {
	getMode,
	Modes,
	setStateGamepad,
	XBoxButton,
} from 'esm-gamecontroller.js';
import {app} from './app-shell/app-shell.js';
import {store} from './store.js';
import toast from 'toastit';

const REPEATER_TIMEOUT = 300;
const REPEATER_SPEED = 150;

let focus = true;

let upKeyRepeaterTimeout: number;
let upKeyRepeaterInterval: number;
let downKeyRepeaterTimeout: number;
let downKeyRepeaterInterval: number;

window.addEventListener('focus', () => {
	focus = true;
});

window.addEventListener('blur', () => {
	focus = false;
	clearTimeout(upKeyRepeaterTimeout);
	clearInterval(upKeyRepeaterInterval);
	clearTimeout(downKeyRepeaterTimeout);
	clearInterval(downKeyRepeaterInterval);
});

gamectrl.on('connect', async (gamepad) => {
	setStateGamepad(gamepad);

	function noTrigger() {
		return !gamepad.pressed.button6 && !gamepad.pressed.button7;
	}
	function isSecondary() {
		return gamepad.pressed.button6 && !gamepad.pressed.button7;
	}

	function UP_FUNCTION() {
		if (isSecondary()) {
			store.moveItemUp();
			// const selectedItem = app.selectedListItem;
			// if (selectedItem) {
			// 	const moveButton =
			// 		selectedItem.querySelector<HTMLElement>('.move-up-button');
			// 	moveButton?.click();
			// 	// selectedItem.focus();
			// }
		} else {
		}
		store.selectPreviousItem();
	}
	async function DOWN_FUNCTION() {
		if (isSecondary()) {
			store.moveItemDown();
			// const selectedItem = app.selectedListItem;
			// if (selectedItem) {
			// 	const moveButton =
			// 		selectedItem.querySelector<HTMLElement>('.move-down-button');
			// 	moveButton?.click();
			// 	await sleep(50);
			// 	selectedItem.focus();
			// }
		} else {
		}
		store.selectNextItem();
	}

	gamepad.axeThreshold = [0.4];

	gamepad.before(XBoxButton.UP, () => {
		if (!focus) {
			return;
		}
		upKeyRepeaterTimeout = setTimeout(() => {
			upKeyRepeaterInterval = setInterval(() => {
				UP_FUNCTION();
			}, REPEATER_SPEED);
			UP_FUNCTION();
		}, REPEATER_TIMEOUT);
		UP_FUNCTION();
	});
	gamepad.after(XBoxButton.UP, () => {
		clearTimeout(upKeyRepeaterTimeout);
		clearInterval(upKeyRepeaterInterval);
	});
	gamepad.before(XBoxButton.DPAD_UP, () => {
		if (!focus) {
			return;
		}
		upKeyRepeaterTimeout = setTimeout(() => {
			upKeyRepeaterInterval = setInterval(() => {
				UP_FUNCTION();
			}, REPEATER_SPEED);
			UP_FUNCTION();
		}, REPEATER_TIMEOUT);
		UP_FUNCTION();
	});
	gamepad.after(XBoxButton.DPAD_UP, () => {
		clearTimeout(upKeyRepeaterTimeout);
		clearInterval(upKeyRepeaterInterval);
	});

	gamepad.before(XBoxButton.LEFT_STICK_DOWN, () => {
		if (!focus) {
			return;
		}
		downKeyRepeaterTimeout = setTimeout(() => {
			downKeyRepeaterInterval = setInterval(() => {
				DOWN_FUNCTION();
			}, REPEATER_SPEED);
			DOWN_FUNCTION();
		}, REPEATER_TIMEOUT);
		DOWN_FUNCTION();
	});
	gamepad.after(XBoxButton.LEFT_STICK_DOWN, () => {
		clearTimeout(downKeyRepeaterTimeout);
		clearInterval(downKeyRepeaterInterval);
	});
	gamepad.before(XBoxButton.DPAD_DOWN, () => {
		if (!focus) {
			return;
		}
		downKeyRepeaterTimeout = setTimeout(() => {
			downKeyRepeaterInterval = setInterval(() => {
				DOWN_FUNCTION();
			}, REPEATER_SPEED);
			DOWN_FUNCTION();
		}, REPEATER_TIMEOUT);
		DOWN_FUNCTION();
	});
	gamepad.after(XBoxButton.DPAD_DOWN, () => {
		clearTimeout(downKeyRepeaterTimeout);
		clearInterval(downKeyRepeaterInterval);
	});

	gamepad.before(XBoxButton.LEFT_TRIGGER, () => {
		app._blank = false;
	});
	gamepad.after(XBoxButton.LEFT_TRIGGER, () => {
		app._blank = true;
	});

	gamepad.before(XBoxButton.B, () => {
		if (!focus) {
			return;
		}
		const mode = getMode();
		switch (mode) {
			case Modes.NORMAL:
			case Modes.PRIMARY:
				const item = app.selectedListItem;
				// @ts-ignore
				item?.listItemRoot.click();
				break;
		}
	});

	gamepad.before(XBoxButton.A, () => {
		if (!focus) {
			return;
		}
		// window.history.back();
		store.goUp();
	});
});
