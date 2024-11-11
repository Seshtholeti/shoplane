import { 
    ConnectClient, 
    ListQueuesCommand, 
    ListUsersCommand, 
    GetCurrentMetricDataCommand 
} from "@aws-sdk/client-connect";

const client = new ConnectClient({ region: 'us-east-1' });

// Function to fetch queues dynamically
async function getQueues() {
    const input = { InstanceId: process.env.InstanceId };
    try {
        const command = new ListQueuesCommand(input);
        const data = await client.send(command);
        const queueIds = data.QueueSummaryList.map(queue => queue.Id);
        console.log("Fetched Queues:", queueIds);
        return queueIds;
    } catch (err) {
        console.error("Error fetching queues:", err);
        throw err;
    }
}

// Function to fetch agents dynamically
async function getAgents() {
    const input = { InstanceId: process.env.InstanceId };
    try {
        const command = new ListUsersCommand(input);
        const data = await client.send(command);
        const agentIds = data.UserSummaryList.map(user => user.Id);
        console.log("Fetched Agents:", agentIds);
        return agentIds.slice(0, 10); // Limiting to 10 agents
    } catch (err) {
        console.error("Error fetching agents:", err);
        throw err;
    }
}

// Fetch real-time metrics
async function getCurrentMetrics() {
    const queues = await getQueues();
    const agents = await getAgents();

    const input = {
        InstanceId: process.env.InstanceId,
        Filters: {
            Channels: ['VOICE'],
            Queues: queues,
            Agents: agents,
        },
        CurrentMetrics: [
            { Name: "AGENTS_ONLINE", Unit: "COUNT" },
            { Name: "CONTACTS_IN_QUEUE", Unit: "COUNT" },
            { Name: "AGENTS_AVAILABLE", Unit: "COUNT" },
        ],
    };

    try {
        const command = new GetCurrentMetricDataCommand(input);
        const data = await client.send(command);

        const metrics = data.MetricResults.map(result => {
            return {
                metric: result.Metric.Name,
                value: result.Collections[0].Value,
            };
        });
        return metrics;
    } catch (err) {
        console.error("Error fetching real-time metrics:", err);
        throw err;
    }
}

// Handler function for real-time metrics
async function handlerRealTimeMetrics(event, context) {
    try {
        const metrics = await getCurrentMetrics();
        console.log("Real-Time Metrics:", metrics);
        return {
            statusCode: 200,
            body: JSON.stringify(metrics),
        };
    } catch (err) {
        console.error("Handler Error:", err);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to fetch real-time metrics" }),
        };
    }
}

export { handlerRealTimeMetrics };