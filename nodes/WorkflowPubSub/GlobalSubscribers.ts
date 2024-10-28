import { ITriggerFunctions } from 'n8n-workflow';
import { PubSubEvent, Subscriber } from './types';

const subscribers: Subscriber[] = [];

export function addSubscriber(context: ITriggerFunctions, eventName: string) {
	const regexp = eventName.match(/^\/(.*?)\/([gimy]*)$/);
	const eventFilter = regexp ? new RegExp(regexp[1], regexp[2]) : eventName;
	const { id: nodeId } = context.getNode();
	const subscriber = {
		workflowId: context.getWorkflow().id,
		nodeId: nodeId,
		eventFilter: eventName,
		triggerCallback: (event: PubSubEvent) => {
			if (eventFilter instanceof RegExp ? eventFilter.test(event.name) : event.name === eventFilter) {
				context.emit(event.data);
			}
		},
	};
	subscribers.push(subscriber);
	return subscriber;
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
