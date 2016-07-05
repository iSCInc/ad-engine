'use strict';

import {logger} from '../utils/logger';

function getIframe(adSlot) {
	return document.getElementById(adSlot.getId()).querySelector('div[id*="_container_"] iframe');
}

function getAdType(event, adSlot) {
	let iframe = getIframe(adSlot),
		isIframeAccessible = false;

	if (event.isEmpty) {
		return 'collapse';
	}

	try {
		isIframeAccessible = !!iframe.contentWindow.document.querySelector;
	} catch (e) {}

	if (isIframeAccessible && iframe.contentWindow.AdEngine_adType) {
		return iframe.contentWindow.AdEngine_adType;
	}

	return 'success';
}

export default class SlotListener {
	static onRenderEnded(event, adSlot) {
		const adType = getAdType(event, adSlot);

		logger('slot-listener', adSlot.getId(), adType);

		switch (adType) {
			case 'collapse':
				adSlot.collapse();
				break;
			default:
				adSlot.success();
				break;
		}
	}
}