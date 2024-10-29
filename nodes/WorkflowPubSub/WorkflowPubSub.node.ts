import { INodeType, INodeTypeDescription, IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { getSubscribers } from './GlobalSubscribers';

export class WorkflowPubSub implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Workflow PubSub',
		name: 'workflowPubSub',
		subtitle:
			'={{ $parameter["action"] === "publish" ? `Publish event: ${$parameter["event_name"]}` : $parameter["action"] }}',
		group: ['transform'],
		icon: 'file:workflow-pubsub.svg',
		version: 1,
		description: 'Publish an event that other workflows can subscribe to using `Workflow PubSub Trigger`',
		defaults: {
			name: 'Workflow PubSub',
		},

		inputs: ['main'],
		outputs: ['main'],
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
						// eslint-disable-next-line n8n-nodes-base/node-param-operation-option-action-miscased
						action: 'Publish an event that other workflows can subscribe to using `Workflow PubSub Trigger`.',
					},
					{
						name: 'List Subscribers',
						value: 'list_subscribers',
						action: 'List event filters other workflows have subscribed to',
					},
				],
			},

			{
				displayName: 'Event Name',
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
