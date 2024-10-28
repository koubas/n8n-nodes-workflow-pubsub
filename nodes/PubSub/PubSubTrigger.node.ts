import { INodeType, ITriggerFunctions, ITriggerResponse, NodeConnectionType, INodeTypeDescription } from 'n8n-workflow';
import { addSubscriber, getSubscribers, removeSubscriber } from './GlobalSubscribers';

export class PubSubTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'PubSub Trigger',
		name: 'pubSubTrigger',
		group: ['trigger'],
		version: 1,
		description:
			'Helper for subscribing to events sent from other n8n workflows. Used for designing modular, microservice-like workflows.',
		eventTriggerDescription: '',
		defaults: {
			name: 'PubSub Trigger',
			color: '#ff6d5a',
		},

		inputs: [],
		outputs: [NodeConnectionType.Main],
		properties: [
			{
				displayName:
					'When a ‘PubSub’ node publishes an event with name matching this subscribtion, the execution starts here.',
				name: 'notice',
				type: 'notice',
				default: '',
			},
			{
				displayName: 'Event',
				name: 'event',
				type: 'string',
				noDataExpression: true,
				default: '.*',
			},
		],
	};

	async trigger(this: ITriggerFunctions): Promise<ITriggerResponse> {
		const eventFilter = this.getNodeParameter('event') as string;
		addSubscriber(this, eventFilter);
		console.log([`TRIG`, this.getNodeParameter('event'), getSubscribers()]);
		return {
			closeFunction: async () => {
				console.log(['CLO', getSubscribers()]);
				removeSubscriber(this);
			},
		};
	}
}
