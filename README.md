import { ConnectClient, ListQueuesCommand, ListUsersCommand, GetCurrentMetricDataCommand } from "@aws-sdk/client-connect";

const client = new ConnectClient({ region: 'us-east-1' });

// Function to fetch queues dynamically
async function getQueues() {
    const input = {
        InstanceId: process.env.InstanceId,
    };
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
        return agentIds;
    } catch (err) {
        console.error("Error fetching agents:", err);
        throw err;
    }
}

// Function to fetch phone numbers dynamically (mock for now)
async function getPhoneNumbers() {
    return ['+1234567890', '+1987654321'];  // Example phone numbers
}

// Function to fetch real-time metrics based on selected resource and date range
async function getRealTimeMetrics(resourceType, selectedResources, startDate, endDate) {
    // Convert startDate and endDate to Date objects
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    console.log(`Fetching real-time metrics from: ${start.toISOString()} to ${end.toISOString()}`);

    let resources = [];
    if (resourceType === "Queues") {
        resources = await getQueues();
    } else if (resourceType === "Agents") {
        resources = await getAgents();
    } else if (resourceType === "Phone Numbers") {
        resources = await getPhoneNumbers();
    } else {
        throw new Error("Invalid resource type selected.");
    }

    // Filter resources based on selected items (e.g., agents, queues, or phone numbers)
    const filteredResources = resources.filter(resource => selectedResources.includes(resource));

    // Prepare input for AWS Connect metric request
    const input = {
        InstanceId: process.env.InstanceId,
        Filters: {
            Channels: ['VOICE'],
            [resourceType]: filteredResources,
        },
        CurrentMetrics: [
            { Name: "AGENTS_ONLINE", Unit: "COUNT" },
            { Name: "AGENTS_AVAILABLE", Unit: "COUNT" },
            { Name: "AGENTS_ON_CALL", Unit: "COUNT" },
            { Name: "CONTACTS_IN_QUEUE", Unit: "COUNT" },
            { Name: "SLOTS_ACTIVE", Unit: "COUNT" },
            { Name: "SLOTS_AVAILABLE", Unit: "COUNT" },
            // Add more metric types as required
        ],
        StartTime: start.toISOString(),
        EndTime: end.toISOString(),
    };

    try {
        const command = new GetCurrentMetricDataCommand(input);
        const data = await client.send(command);

        const metricsObject = convertToObject(data);
        console.log(`Real-time Metrics from ${start.toISOString()} to ${end.toISOString()}:`, metricsObject);
        return metricsObject;
    } catch (err) {
        console.error("Error fetching real-time metrics:", err);
        throw err;
    }
}

// Convert API response into a clean object
function convertToObject(data) {
    const result = {};
    if (data && data.MetricResults) {
        for (let i = 0; i < data.MetricResults.length; i++) {
            for (let j = 0; j < data.MetricResults[i].Collections.length; j++) {
                const metricName = data.MetricResults[i].Collections[j].Metric.Name;
                const metricValue = data.MetricResults[i].Collections[j].Value;
                result[metricName] = metricValue;
            }
        }
    }
    console.log(result, 'Formatted Metrics');
    return result;
}

// Lambda Handler to receive the event with user input from the front-end
exports.handler = async (event) => {
    const { resourceType, selectedResources, startDate, endDate } = event;  // Inputs from front-end

    // Validate inputs
    if (!resourceType || !selectedResources || !startDate || !endDate) {
        return {
            statusCode: 400,
            body: JSON.stringify({ success: false, message: "Missing required input parameters." }),
        };
    }

    try {
        const metrics = await getRealTimeMetrics(resourceType, selectedResources, startDate, endDate);
        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, metrics }),
        };
    } catch (err) {
        console.error("Error in handler:", err);
        return {
            statusCode: 500,
            body: JSON.stringify({ success: false, message: err.message }),
        };
    }
};