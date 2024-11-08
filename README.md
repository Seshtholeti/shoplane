import { 
    ConnectClient, 
    ListQueuesCommand, 
    GetCurrentMetricDataCommand, 
    GetMetricDataV2Command 
} from "@aws-sdk/client-connect";

const client = new ConnectClient({ region: 'us-east-1' });

// Function to fetch queues dynamically using ListQueuesCommand
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

// Fetch real-time metrics
async function getCurrentMetrics() {
    const currentTime = new Date();
    const endTime = Math.floor(currentTime.getTime() / 1000);
    const startTime = new Date(currentTime.getTime() - (30 * 24 * 60 * 60 * 1000));
    const unixStartTimestamp = Math.floor(startTime.getTime() / 1000);

    console.log("Start time:", unixStartTimestamp);
    console.log("End time:", endTime);

    // Fetch queues dynamically
    const queues = await getQueues();
    const input = {
        InstanceId: process.env.InstanceId,
        Filters: {
            Channels: ['VOICE'],
            Queues: queues,
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
        console.log("Real-time metrics:", JSON.stringify(data));
        return convertToObject(data);
    } catch (err) {
        console.error("Error fetching real-time metrics:", err);
        throw err;
    }
}

// Fetch historical metrics for one month
async function getHistoricalMetrics() {
    const currentTime = new Date();
    
    // Set end time to the current time
    const endTime = currentTime;

    // Set start time to one month before the current time
    const startTime = new Date();
    startTime.setMonth(startTime.getMonth() - 1);

    const unixStartTimestamp = Math.floor(startTime.getTime() / 1000);
    const unixEndTimestamp = Math.floor(endTime.getTime() / 1000);

    console.log("Historical start time (Unix):", unixStartTimestamp);
    console.log("Historical end time (Unix):", unixEndTimestamp);

    // Fetch queues dynamically
    const queues = await getQueues();

    const input = {
        ResourceArn: process.env.ResourceArn,
        StartTime: startTime,
        EndTime: endTime,
        Metrics: [
            {
                Name: "SUM_CONTACTS_ABANDONED_IN_X",
                Threshold: [{ Comparison: "LT", ThresholdValue: 7200 }],
            },
            {
                Name: "SUM_CONTACTS_ANSWERED_IN_X",
                Threshold: [{ Comparison: "LT", ThresholdValue: 7200 }],
            },
            { Name: "ABANDONMENT_RATE", Unit: "COUNT" },
            { Name: "AGENT_ANSWER_RATE" },
            { Name: "CONTACTS_HANDLED" },
            { Name: "MAX_QUEUED_TIME" },
            { Name: "AVG_HANDLE_TIME" },
        ],
        Filters: [
            { FilterKey: "QUEUE", FilterValues: queues },
        ],
    };

    try {
        const command = new GetMetricDataV2Command(input);
        const data = await client.send(command);
        console.log("Historical metrics (One Month):", JSON.stringify(data));
        return convertToObject(data);
    } catch (err) {
        console.error("Error fetching historical metrics:", err);
        throw err;
    }
}

// Handler function to call both APIs and return all metrics
async function handler(event, context) {
    try {
        const currentMetrics = await getCurrentMetrics();
        const historicalMetrics = await getHistoricalMetrics();
        const allMetrics = {
            realTimeMetrics: currentMetrics,
            historicalMetrics: historicalMetrics,
        };
        console.log("Combined metrics:", JSON.stringify(allMetrics));
        return allMetrics;
    } catch (err) {
        console.error("Error in handler:", err);
        throw err;
    }
}

// Function to convert API response into a clean object
function convertToObject(data) {
    const result = {};
    if (data.MetricResults) {
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

export { handler, getCurrentMetrics, getHistoricalMetrics };