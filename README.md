import { ConnectClient, GetCurrentMetricDataCommand, GetMetricDataV2Command } from "@aws-sdk/client-connect";

// Initialize the ConnectClient with config
const client = new ConnectClient({ region: process.env.AWS_REGION });

// Fetch real-time metrics
async function getCurrentMetrics() {
    const currentTime = new Date();
    const endTime = Math.floor(currentTime.getTime() / 1000);
    const startTime = new Date(currentTime.getTime() - (30 * 24 * 60 * 60 * 1000));
    const unixStartTimestamp = Math.floor(startTime.getTime() / 1000);

    console.log("Start time:", unixStartTimestamp);
    console.log("End time:", endTime);

    const input = {
        InstanceId: process.env.InstanceId,
        Filters: {
            Channels: ['VOICE'],
            Queues: [process.env.genAI_kmdb_queue, process.env.BasicQueue],
        },
        CurrentMetrics: [
            { Name: "AGENTS_AFTER_CONTACT_WORK", Unit: "COUNT" },
            { Name: "AGENTS_ON_CALL", Unit: "COUNT" },
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

// Fetch historical metrics
async function getHistoricalMetrics() {
    const currentTime = new Date();
    const roundedMinutes = Math.floor(currentTime.getMinutes() / 5) * 5;
    const startTime = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate(), currentTime.getHours(), roundedMinutes);
    const unixStartTimestamp = Math.floor(startTime.getTime() / 1000);
    const endTime = new Date(startTime.getTime() - (120 * 60 * 1000)); // Last 2 hours
    const unixEndTimestamp = Math.floor(endTime.getTime() / 1000);

    console.log("Historical start time:", unixStartTimestamp);
    console.log("Historical end time:", unixEndTimestamp);

    const input = {
        ResourceArn: process.env.ResourceArn,
        StartTime: new Date(unixEndTimestamp * 1000),
        EndTime: new Date(unixStartTimestamp * 1000),
        Metrics: [
            {
                Name: "SUM_CONTACTS_ABANDONED_IN_X",
                Threshold: [{ Comparison: "LT", ThresholdValue: 7200 }],
            },
        ],
        Filters: [
            { FilterKey: "QUEUE", FilterValues: [process.env.genAI_kmdb_queue, process.env.BasicQueue] },
        ],
    };

    try {
        const command = new GetMetricDataV2Command(input);
        const data = await client.send(command);
        console.log("Historical metrics:", JSON.stringify(data));
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
    for (let i = 0; i < data.MetricResults.length; i++) {
        for (let j = 0; j < data.MetricResults[i].Collections.length; j++) {
            const metricName = data.MetricResults[i].Collections[j].Metric.Name;
            const metricValue = data.MetricResults[i].Collections[j].Value;
            result[metricName] = metricValue;
        }
    }
    console.log(result, 'Formatted Metrics');
    return result;
}

export { handler, getCurrentMetrics, getHistoricalMetrics };