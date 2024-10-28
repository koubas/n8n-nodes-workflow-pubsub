import { INodeType, ITriggerFunctions, ITriggerResponse, INodeTypeDescription } from 'n8n-workflow';
import { addSubscriber, removeSubscriber } from './GlobalSubscribers';

export class WorkflowPubSubTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Workflow PubSub Trigger',
		subtitle: '={{ `Subscribe to: ${$parameter["event_name"]}` }}',
		name: 'workflowPubSubTrigger',
		group: ['trigger'],
		version: 1,
		description:
			'Triggers the workflow on events you subscribe it to, published by Workflow PubSub node in another workflow.',
		eventTriggerDescription: '',
		defaults: {
			name: 'Workflow PubSub Trigger',
		},

		inputs: [],
		outputs: ['main'],
		properties: [
			{
				displayName:
					'When a ‘Workflow PubSub’ node publishes an event with name matching this subscribtion, the execution starts here.',
				name: 'notice',
				type: 'notice',
				default: '',
			},
			{
				displayName: 'Event Name',
				description:
					'Event name this workflow is triggered by. It can be specified as `/regex/[flags]` to match multiple event names.',
				name: 'event_name',
				type: 'string',
				noDataExpression: true,
				required: true,
				default: '',
			},
		],
	};

	async trigger(this: ITriggerFunctions): Promise<ITriggerResponse> {
		const eventName = this.getNodeParameter('event_name') as string;
		addSubscriber(this, eventName);
		return {
			closeFunction: async () => {
				removeSubscriber(this);
			},
		};
	}
}
