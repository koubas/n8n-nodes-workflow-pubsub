import { ITriggerFunctions } from 'n8n-workflow';
import { PubSubEvent, Subscriber } from './types';

const subscribers: Subscriber[] = [];

export function addSubscriber(context: ITriggerFunctions, eventFilter: string) {
	const { id: nodeId } = context.getNode();
	const eventFilterRegexp = new RegExp(`^${eventFilter}$`);
	subscribers.push({
		workflowId: context.getWorkflow().id,
		nodeId: nodeId,
		eventFilter,
		triggerCallback: (event: PubSubEvent) => {
			if (eventFilterRegexp.test(event.name)) {
				context.emit(event.data);
			}
		},
	});
}

export function removeSubscriber(context: ITriggerFunctions) {
	const { id: nodeId } = context.getNode();
	const idx = subscribers.findIndex((s) => s.nodeId === nodeId);
	if (idx >= 0) {
		subscribers.splice(idx, 1);
	} else {
		context.emitError(new Error(`Subscribtion not found for trigger id ${nodeId} when truing to close it`));
	}
}

export function getSubscribers() {
	return subscribers as Readonly<Readonly<Subscriber>[]>;
}

export function clearSubscribers() {
	subscribers.length = 0;
}
