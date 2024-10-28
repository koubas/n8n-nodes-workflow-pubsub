import { ITriggerFunctions } from 'n8n-workflow';
import { addSubscriber, clearSubscribers, getSubscribers, removeSubscriber } from '../GlobalSubscribers';

const triggerFunctionsMock = {
	getNode: () => ({
		id: 'node-id-1',
	}),
	getWorkflow: () => ({
		id: 'workflow-id-1',
	}),
	emit: jest.fn() as jest.MockedFunction<ITriggerFunctions['emit']>,
} as jest.Mocked<ITriggerFunctions>;

beforeEach(() => {
	clearSubscribers();
	jest.resetAllMocks();
});

describe('GlobalSubscribers::addSubscriber', () => {
	it('Should contain a subscriber when we add one', () => {
		addSubscriber(triggerFunctionsMock, 'foo');
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
		addSubscriber(triggerFunctionsMock, 'foo');
		removeSubscriber(triggerFunctionsMock);
		expect(getSubscribers()).toEqual([]);
	});
});

describe('GlobalSubscribers::clearSubscriber', () => {
	it('Should contain no subscriber, when we add one and clear', () => {
		addSubscriber(triggerFunctionsMock, 'foo');
		clearSubscribers();
		expect(getSubscribers()).toEqual([]);
	});
});

describe('Subscriber callback', () => {
	const event = {
		data: [[{ json: { bar: 'baz' } }]],
		name: 'foo',
		publisherNodeId: 'n1',
		publisherWorkflowId: 'w1',
	};
	it('Should match the literal', () => {
		const s = addSubscriber(triggerFunctionsMock, 'foo');
		s.triggerCallback(event);
		expect(triggerFunctionsMock.emit).toHaveBeenCalled();
	});
	it('Should NOT match another literal', () => {
		const s = addSubscriber(triggerFunctionsMock, 'bar');
		s.triggerCallback(event);
		expect(triggerFunctionsMock.emit).not.toHaveBeenCalled();
	});
	it('Should match part of literal using regexp', () => {
		const s = addSubscriber(triggerFunctionsMock, '/oo/');
		s.triggerCallback(event);
		expect(triggerFunctionsMock.emit).toHaveBeenCalled();
	});
	it('Should NOT match part of literal using another regexp', () => {
		const s = addSubscriber(triggerFunctionsMock, '/ar/');
		s.triggerCallback(event);
		expect(triggerFunctionsMock.emit).not.toHaveBeenCalled();
	});
});
