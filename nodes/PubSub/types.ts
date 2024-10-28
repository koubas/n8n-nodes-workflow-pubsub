import { INodeExecutionData } from 'n8n-workflow';

export type PubSubEvent = {
	name: string;
	publisherWorkflowId: string;
	publisherNodeId: string;
	data: INodeExecutionData[][];
};

export type Subscriber = {
	workflowId?: string;
	nodeId: string;
	eventFilter: string;
	triggerCallback: (event: PubSubEvent) => void;
};
