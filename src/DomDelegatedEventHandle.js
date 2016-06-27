'use strict';

import { array, core } from 'metal';
import domData from './domData';
import { EventHandle } from 'metal-events';

/**
 * This is a special EventHandle, that is responsible for dom delegated events
 * (only the ones that receive a target element, not a selector string).
 * @extends {EventHandle}
 */
class DomDelegatedEventHandle extends EventHandle {
	/**
	 * The constructor for `DomDelegatedEventHandle`.
	 * @param {!Event} emitter Element the event was subscribed to.
	 * @param {string} event The name of the event that was subscribed to.
	 * @param {!Function} listener The listener subscribed to the event.
	 * @param {string=} opt_selector An optional selector used when delegating
	 *     the event.
	 * @constructor
	 */
	constructor(emitter, event, listener, opt_selector) {
		super(emitter, event, listener);
		this.selector_ = opt_selector;
	}

	/**
	 * @inheritDoc
	 */
	removeListener() {
		var data = domData.get(this.emitter_);
		var selector = this.selector_;
		var arr = core.isString(selector) ? data.delegating[this.event_].selectors : data.listeners;
		var key = core.isString(selector) ? selector : this.event_;

		array.remove(arr[key] || [], this.listener_);
		if (arr[key] && arr[key].length === 0) {
			delete arr[key];
		}
	}
}

export default DomDelegatedEventHandle;
