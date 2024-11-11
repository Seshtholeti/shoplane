import { ConnectClient, ListQueuesCommand, ListUsersCommand, GetCurrentMetricDataCommand } from "@aws-sdk/client-connect";

const client = new ConnectClient({ region: 'us-east-1' });

// Function to fetch queues dynamically using ListQueues
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

// Function to fetch agents dynamically using ListUsers
async function getAgents() {
    const input = { InstanceId: process.env.InstanceId };
    try {
        const command = new ListUsersCommand(input);
        const data = await client.send(command);
        const agentIds = data.UserSummaryList.map(user => user.Id);
        console.log("Fetched Agents:", agentIds);
        return agentIds.slice(0, 10); // Limiting to a maximum of 10 agents
    } catch (err) {
        console.error("Error fetching agents:", err);
        throw err;
    }
}

// Fetch real-time metrics
async function getRealTimeMetrics() {
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
            { Name: "AGENTS_AFTER_CONTACT_WORK", Unit: "COUNT" },
            { Name: "AGENTS_ON_CALL", Unit: "COUNT" },
            { Name: "AGENTS_AVAILABLE", Unit: "COUNT" },
            { Name: "AGENTS_ONLINE", Unit: "COUNT" },
            { Name: "AGENTS_STAFFED", Unit: "COUNT" },
            { Name: "CONTACTS_IN_QUEUE", Unit: "COUNT" },
        ],
    };

    try {
        const command = new GetCurrentMetricDataCommand(input);
        const data = await client.send(command);
        const metricsObject = convertToObject(data);

        const response = {
            queueMetrics: metricsObject.filter(metric => queues.includes(metric.Queue)),
            agentMetrics: metricsObject.filter(metric => agents.includes(metric.Agent)),
        };
        console.log("Real-time Metrics:", response);
        return response;
    } catch (err) {
        console.error("Error fetching real-time metrics:", err);
        throw err;
    }
}

// Function to convert API response into a clean object
function convertToObject(data) {
    const result = [];
    if (data && data.MetricResults) {
        for (const resultItem of data.MetricResults) {
            const metrics = resultItem.Collections.map(metric => ({
                MetricName: metric.Metric.Name,
                Value: metric.Value,
            }));
            result.push({
                Queue: resultItem.Queue ? resultItem.Queue.Id : null,
                Agent: resultItem.Agent ? resultItem.Agent.Id : null,
                Metrics: metrics,
            });
        }
    }
    return result;
}

export { getRealTimeMetrics };