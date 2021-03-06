import { slotService } from './slot-service';
import { templateService } from './template-service';

export function registerCustomAdLoader(methodName) {
	window[methodName] = (params) => {
		const slot = slotService.get(params.slotName);

		templateService.init(params.type, slot, params);
	};
}
