import {
	INodeType,
	NodeConnectionType,
	INodeTypeDescription,
	IExecuteFunctions,
	INodeExecutionData,
} from 'n8n-workflow';
import { getSubscribers } from './GlobalSubscribers';

export class PubSub implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'PubSub',
		name: 'pubSub',
		group: ['transform'],
		version: 1,
		description:
			'Helper for subscribing to events sent from other n8n workflows. Used for designing modular, microservice-like workflows.',
		defaults: {
			name: 'PubSub Trigger',
			color: '#ff6d5a',
		},

		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		properties: [
			{
				displayName: 'Action',
				name: 'action',
				type: 'options',
				required: true,
				default: 'publish',
				noDataExpression: true,
				options: [
					{
						name: 'Publish',
						value: 'publish',
					},
					{
						name: 'List Subscribers',
						value: 'list_subscribers',
					},
				],
			},

			{
				displayName: 'Event name',
				displayOptions: {
					show: {
						action: ['publish'],
					},
				},
				name: 'event_name',
				type: 'string',
				required: true,
				default: '',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const action = this.getNodeParameter('action', 0);
		if (action === 'publish') {
			const input = this.getInputData();
			for (let i = 0; i < input.length; i++) {
				const eventName = this.getNodeParameter('event_name', i) as string;
				getSubscribers().forEach((s) => {
					s.triggerCallback({
						name: eventName,
						data: [[input[i]]],
						publisherNodeId: '',
						publisherWorkflowId: '',
					});
				});
			}
			return [input];
		}
		if (action === 'list_subscribers') {
			return [
				getSubscribers().map((s) => ({
					json: s,
				})),
			];
		}
		return [];
	}
}
