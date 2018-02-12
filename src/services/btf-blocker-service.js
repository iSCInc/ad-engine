import { logger, makeLazyQueue } from '../utils';
import { context } from './context-service';
import { slotService } from './slot-service';

const logGroup = 'btf-blocker';

function finishQueue() {
	this.atfEnded = true;

	if (window.ads.runtime.disableBtf) {
		slotService.forEach((adSlot) => {
			if (!adSlot.isAboveTheFold()) {
				slotService.disable(adSlot.getSlotName());
			}
		});
	}

	this.slotsQueue.start();
}

class BtfBlockerService {
	constructor() {
		this.slotsQueue = [];
		this.atfEnded = false;
	}

	init() {
		makeLazyQueue(this.slotsQueue, ({ adSlot, fillInCallback }) => {
			logger(logGroup, adSlot.getId(), 'Filling delayed BTF slot');
			fillInCallback(adSlot);
		});

		context.push('listeners.slot', { onRenderEnded: (adSlot) => {
			logger(logGroup, adSlot.getId(), 'Slot rendered');
			if (!this.atfEnded && adSlot.isAboveTheFold()) {
				finishQueue.bind(this)();
			}
		} });
	}

	push(adSlot, fillInCallback) {
		if (!this.atfEnded && !adSlot.isAboveTheFold()) {
			this.slotsQueue.push({ adSlot, fillInCallback });
			logger(logGroup, adSlot.getId(), 'BTF slot pushed to queue');
			return;
		}

		if (this.atfEnded && !adSlot.isEnabled()) {
			logger(logGroup, adSlot.getId(), 'BTF slot blocked');
			return;
		}

		logger(logGroup, adSlot.getId(), 'Filling in slot');
		fillInCallback(adSlot);
	}
}

export const btfBlockerService = new BtfBlockerService();