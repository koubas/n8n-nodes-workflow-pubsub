import { ITriggerFunctions } from 'n8n-workflow';
import { addSubscriber, clearSubscribers, getSubscribers, removeSubscriber } from '../GlobalSubscribers';

const triggerFunctionsStub = {
	getNode: () => ({
		id: 'node-id-1',
	}),
	getWorkflow: () => ({
		id: 'workflow-id-1',
	}),
} as ITriggerFunctions;

beforeEach(() => {
	clearSubscribers();
});

describe('GlobalSubscribers::addSubscriber', () => {
	it('Should contain a subscriber when we add one', () => {
		addSubscriber(triggerFunctionsStub, 'foo');
		expect(getSubscribers()).toMatchObject([
			{
				workflowId: 'workflow-id-1',
				nodeId: 'node-id-1',
				eventFilter: 'foo',
				triggerCallback: expect.any(Function),
			},
		]);
	});
});

describe('GlobalSubscribers::removeSubscriber', () => {
	it('Should contain no subscriber, when we add one and remove it', () => {
		addSubscriber(triggerFunctionsStub, 'foo');
		removeSubscriber(triggerFunctionsStub);
		expect(getSubscribers()).toEqual([]);
	});
});

describe('GlobalSubscribers::clearSubscriber', () => {
	it('Should contain no subscriber, when we add one and clear', () => {
		addSubscriber(triggerFunctionsStub, 'foo');
		clearSubscribers();
		expect(getSubscribers()).toEqual([]);
	});
});
