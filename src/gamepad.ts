import gamectrl, {XBoxButton} from 'esm-gamecontroller.js';
import {app} from './app-shell/app-shell.js';

const REPEATER_TIMEOUT = 80;
const REPEATER_SPEED = 400;

let upKeyRepeaterTimeout: number;
let upKeyRepeaterInterval: number;
let downKeyRepeaterTimeout: number;
let downKeyRepeaterInterval: number;

window.addEventListener('blur', () => {
	clearTimeout(upKeyRepeaterTimeout);
	clearInterval(upKeyRepeaterInterval);
	clearTimeout(downKeyRepeaterTimeout);
	clearInterval(downKeyRepeaterInterval);
});

gamectrl.on('connect', async (gamepad) => {
	function noTrigger() {
		return !gamepad.pressed.button6 && !gamepad.pressed.button7;
	}
	function isSecondary() {
		return gamepad.pressed.button6 && !gamepad.pressed.button7;
	}

	function UP_FUNCTION() {
		if (isSecondary()) {
			const selectedItem = app.selectedListItem;
			console.log(selectedItem);
			if (selectedItem) {
				const moveButton =
					selectedItem.querySelector<HTMLElement>('.move-up-button');
				moveButton?.click();
			}
		} else {
			app.activePreviousItem();
		}
	}
	function DOWN_FUNCTION() {
		if (isSecondary()) {
			const selectedItem = app.selectedListItem;
			if (selectedItem) {
				const moveButton =
					selectedItem.querySelector<HTMLElement>('.move-down-button');
				moveButton?.click();
			}
		} else {
			app.activeNextItem();
		}
	}

	gamepad.axeThreshold = [0.4];

	gamepad.before(XBoxButton.UP, () => {
		if (!noTrigger()) {
			return;
		}
		upKeyRepeaterTimeout = setTimeout(() => {
			upKeyRepeaterInterval = setInterval(() => {
				UP_FUNCTION();
			}, REPEATER_SPEED);
			// app.activePreviousItem();
		}, REPEATER_TIMEOUT);
		UP_FUNCTION();
	});
	gamepad.after(XBoxButton.UP, () => {
		clearTimeout(upKeyRepeaterTimeout);
		clearInterval(upKeyRepeaterInterval);
	});
	gamepad.before(XBoxButton.DPAD_UP, () => {
		if (!noTrigger()) {
			return;
		}
		upKeyRepeaterTimeout = setTimeout(() => {
			upKeyRepeaterInterval = setInterval(() => {
				UP_FUNCTION();
				app.activePreviousItem();
			}, REPEATER_SPEED);
			// UP_FUNCTION()
		}, REPEATER_TIMEOUT);
		UP_FUNCTION();
	});
	gamepad.after(XBoxButton.DPAD_UP, () => {
		clearTimeout(upKeyRepeaterTimeout);
		clearInterval(upKeyRepeaterInterval);
	});

	gamepad.before(XBoxButton.LEFT_STICK_DOWN, () => {
		if (!noTrigger()) {
			return;
		}
		downKeyRepeaterTimeout = setTimeout(() => {
			downKeyRepeaterInterval = setInterval(() => {
				DOWN_FUNCTION();
			}, REPEATER_SPEED);
			// DOWN_FUNCTION();
		}, REPEATER_TIMEOUT);
		DOWN_FUNCTION();
	});
	gamepad.after(XBoxButton.LEFT_STICK_DOWN, () => {
		clearTimeout(downKeyRepeaterTimeout);
		clearInterval(downKeyRepeaterInterval);
	});
	gamepad.before(XBoxButton.DPAD_DOWN, () => {
		if (!noTrigger()) {
			return;
		}
		downKeyRepeaterTimeout = setTimeout(() => {
			downKeyRepeaterInterval = setInterval(() => {
				DOWN_FUNCTION();
			}, REPEATER_SPEED);
			// DOWN_FUNCTION()
		}, REPEATER_TIMEOUT);
		DOWN_FUNCTION();
	});
	gamepad.after(XBoxButton.DPAD_DOWN, () => {
		clearTimeout(downKeyRepeaterTimeout);
		clearInterval(downKeyRepeaterInterval);
	});

	gamepad.before(XBoxButton.B, () => {
		if (noTrigger()) {
			const item = app.selectedListItem;
			// @ts-ignore
			item?.listItemRoot.click();
		}
	});

	gamepad.before(XBoxButton.A, () => {
		window.history.back();
	});
});
