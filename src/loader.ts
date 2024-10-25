// This needs to be before anything else
// because it sets a shared stylesheet used by
// elements' construtor.
import './styles/shared.js';

import '@material/web/all.js';

import {app} from './app-shell/app-shell.js';
document.querySelector<HTMLElement>('material-shell').appendChild(app);
/** or Firebase */
// import "./firebase/onAuthStateChanged.js";

import './material/outlined-field-patch.js';
import './material/dialog-patch.ts';

import './gamepad.js';

import './global-listeners.js';