# n8n-nodes-workflow-pubsub

This package provides custom nodes for [n8n](https://community.n8n.io/) that
allow seamless event-driven communication between workflows within the n8n
ecosystem, creating a flexible, decoupled way to manage interactions between
workflows.

## Nodes

### Workflow PubSub

The Workflow PubSub node allows you to publish events that other workflows
can subscribe to. You can configure this node to either publish a new event or
retrieve a list of current subscribers.

### Workflow PubSub Trigger

The Workflow PubSub Trigger node listens for events published by the Workflow
PubSub node. When an event with a name matching the specified pattern is
published, this node triggers the workflow, enabling event-based automation.

## Contributing

Contributions are welcome! Please follow the standard GitHub flow for contributing:

 * Fork the repository
 * Create a new branch
 * Make your changes
 * Submit a pull request

For any questions or issues, feel free to open a GitHub issue or start a discussion.
