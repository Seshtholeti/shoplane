import { ConnectClient, ListQueuesCommand,ListUsersCommand, GetCurrentMetricDataCommand, GetMetricDataV2Command } from "@aws-sdk/client-connect";

const client = new ConnectClient({ region: 'us-east-1' });

// Function to fetch queues dynamically using list queues
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

// // Function to fetch agents dynamically using ListUsers
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

// Fetch real-time metrics for each day over one month
async function getCurrentMetrics() {
    const currentTime = new Date();
    const endDate = new Date(currentTime);
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);

    console.log("Fetching daily real-time metrics from:", startDate.toISOString(), "to", endDate.toISOString());

    const queues = await getQueues();
    const agents = await getAgents();
    const dailyRealTimeMetrics = [];

    // Loop through each day in the range
    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
         const startTime = new Date(date);
         const endTime = new Date(date);
         endTime.setHours(23, 59, 59, 999);

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
              { Name: "AGENTS_ERROR", Unit: "COUNT" },
              { Name: "AGENTS_NON_PRODUCTIVE", Unit: "COUNT" },
              { Name: "AGENTS_ON_CONTACT", Unit: "COUNT" },
              { Name: "CONTACTS_SCHEDULED", Unit: "COUNT" },
              { Name: "OLDEST_CONTACT_AGE", Unit: "SECONDS" },
              { Name: "SLOTS_ACTIVE", Unit: "COUNT" },
              { Name: "SLOTS_AVAILABLE", Unit: "COUNT" },
            ],
         };

         try {
            const command = new GetCurrentMetricDataCommand(input);
            const data = await client.send(command);
            const metricsObject = convertToObject(data);

            dailyRealTimeMetrics.push({
                date: startTime.toISOString().split('T')[0],
                metrics: metricsObject,
            });
            console.log(`Real-time Metrics for ${startTime.toISOString().split('T')[0]}:`, metricsObject);
         } catch (err) {
            console.error(`Error fetching real-time metrics for ${startTime.toISOString().split('T')[0]}:`, err);
         }
    }

    return dailyRealTimeMetrics;
}

// Fetch historical metrics for each day over one month
async function getHistoricalMetrics() {
    const currentTime = new Date();
    const endDate = new Date(currentTime);
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);

    console.log("Fetching daily historical metrics from:", startDate.toISOString(), "to", endDate.toISOString());

    const queues = await getQueues();
    const agents = await getAgents();
    const dailyHistoricalMetrics = [];

    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
         const startTime = new Date(date);
         const endTime = new Date(date);
         endTime.setHours(23, 59, 59, 999);

         const input = {
            ResourceArn: process.env.ResourceArn,
            StartTime: startTime,
            EndTime: endTime,
            Metrics: [
                  { Name: "SUM_CONTACTS_ABANDONED_IN_X", Threshold: [{ Comparison: "LT", ThresholdValue: 7200 }] },
              { Name: "SUM_CONTACTS_ANSWERED_IN_X", Threshold: [{ Comparison: "LT", ThresholdValue: 7200 }] },
              { Name: "ABANDONMENT_RATE", Unit: "Percent" },
              { Name: "AGENT_ANSWER_RATE", Unit: "Percent"},
              { Name: "CONTACTS_HANDLED" },
              { Name: "MAX_QUEUED_TIME" },
              { Name: "AVG_HANDLE_TIME" },
              { Name: "AGENT_ADHERENT_TIME", Unit: "Seconds" },
              { Name: "AGENT_NON_ADHERENT_TIME", Unit: "Seconds" },
              { Name: "AGENT_NON_RESPONSE", Unit: "COUNT" },
              { Name: "AGENT_NON_RESPONSE_WITHOUT_CUSTOMER_ABANDONS", Unit: "COUNT" },
              { Name: "AGENT_OCCUPANCY", Unit: "Percentage" },
              { Name: "AGENT_SCHEDULE_ADHERENCE", Unit: "Percent" },
              { Name: "AGENT_SCHEDULED_TIME", Unit: "Seconds" },
            ],
            Filters: [
                { FilterKey: "QUEUE", FilterValues: queues },
                { FilterKey: "AGENT", FilterValues: agents },
            ],
         };

         try {
            const command = new GetMetricDataV2Command(input);
            const data = await client.send(command);
            const metricsObject = convertToObject(data);

            dailyHistoricalMetrics.push({
                date: startTime.toISOString().split('T')[0],
                metrics: metricsObject,
            });
            console.log(`Historical Metrics for ${startTime.toISOString().split('T')[0]}:`, metricsObject);
         } catch (err) {
            console.error(`Error fetching historical metrics for ${startTime.toISOString().split('T')[0]}:`, err);
         }
    }

    return dailyHistoricalMetrics;
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

         console.log("Combined metrics for one month:", JSON.stringify(allMetrics));
         return allMetrics;
    } catch (err) {
         console.error("Error in handler:", err);
         throw err;
    }
}

// Function to convert API response into a clean object
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

export { handler, getCurrentMetrics, getHistoricalMetrics };
// import { ConnectClient, ListQueuesCommand, ListUsersCommand, GetCurrentMetricDataCommand, GetMetricDataV2Command } from "@aws-sdk/client-connect";

// import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
// import { createObjectCsvWriter } from 'csv-writer'; // Import csv-writer for CSV conversion
// import { readFileSync } from 'fs'; // To read the CSV file for uploading to S3
// const client = new ConnectClient({ region: 'us-east-1' });
// const s3Client = new S3Client({ region: 'us-east-1' });
// const BUCKET_NAME = process.env.S3_BUCKET_NAME; // Ensure this is set in your environment variables
// const INSTANCE_ID = process.env.InstanceId; // Ensure this is set in your environment variables
// const RESOURCE_ARN = process.env.ResourceArn; // Ensure this is set in your environment variables
// // Function to fetch queues dynamically using ListQueues
// async function getQueues() {
//    const input = {
//        InstanceId: INSTANCE_ID,
//    };
//    try {
//        const command = new ListQueuesCommand(input);
//        const data = await client.send(command);
//        const queueIds = data.QueueSummaryList.map(queue => queue.Id);
//        console.log("Fetched Queues:", queueIds);
//        return queueIds;
//    } catch (err) {
//        console.error("Error fetching queues:", err);
//        throw err;
//    }
// }
// // Function to fetch agents dynamically using ListUsers
// async function getAgents() {
//    const input = { InstanceId: INSTANCE_ID };
//    try {
//        const command = new ListUsersCommand(input);
//        const data = await client.send(command);
//        const agentIds = data.UserSummaryList.map(user => user.Id);
//        console.log("Fetched Agents:", agentIds);
//        return agentIds.slice(0, 10); // Limiting to a maximum of 10 agents
//    } catch (err) {
//        console.error("Error fetching agents:", err);
//        throw err;
//    }
// }
// // Function to convert API response into a clean object
// function convertToObject(data) {
//    const result = {};
//    if (data && data.MetricResults) {
//        for (let i = 0; i < data.MetricResults.length; i++) {
//           for (let j = 0; j < data.MetricResults[i].Collections.length; j++) {
//                const metricName = data.MetricResults[i].Collections[j].Metric.Name;
//                const metricValue = data.MetricResults[i].Collections[j].Value;
//                result[metricName] = metricValue;
//           }
//        }
//    }
//    console.log(result, 'Formatted Metrics');
//    return result;
// }
// // Function to fetch real-time metrics
// async function getCurrentMetrics() {
//    const currentTime = new Date();
//    const endDate = new Date(currentTime);
//    const startDate = new Date();
//    startDate.setMonth(startDate.getMonth() - 1);
//    console.log("Fetching daily real-time metrics from:", startDate.toISOString(), "to", endDate.toISOString());
//    const queues = await getQueues();
//    const agents = await getAgents();
//    const dailyRealTimeMetrics = [];
//    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
//        const startTime = new Date(date);
//        const endTime = new Date(date);
//        endTime.setHours(23, 59, 59, 999);
//        const input = {
//           InstanceId: INSTANCE_ID,
//           Filters: {
//                Channels: ['VOICE'],
//                Queues: queues,
//                Agents: agents,
//           },
//           CurrentMetrics: [
//                { Name: "AGENTS_AFTER_CONTACT_WORK", Unit: "COUNT" },
//                { Name: "AGENTS_ON_CALL", Unit: "COUNT" },
//                { Name: "AGENTS_AVAILABLE", Unit: "COUNT" },
//                { Name: "AGENTS_ONLINE", Unit: "COUNT" },
//                { Name: "AGENTS_STAFFED", Unit: "COUNT" },
//                { Name: "CONTACTS_IN_QUEUE", Unit: "COUNT" },
//           ],
//        };
//        try {
//           const command = new GetCurrentMetricDataCommand(input);
//           const data = await client.send(command);
//           const metricsObject = convertToObject(data);
//           dailyRealTimeMetrics.push({
//                date: startTime.toISOString().split('T')[0],
//                metrics: metricsObject,
//           });
//           console.log(`Real-time Metrics for ${startTime.toISOString().split('T')[0]}:`, metricsObject);
//        } catch (err) {
//           console.error(`Error fetching real-time metrics for ${startTime.toISOString().split('T')[0]}:`, err);
//        }
//    }
//    return dailyRealTimeMetrics;
// }
// // Function to fetch historical metrics
// async function getHistoricalMetrics() {
//    const currentTime = new Date();
//    const endDate = new Date(currentTime);
//    const startDate = new Date();
//    startDate.setMonth(startDate.getMonth() - 1);
//    console.log("Fetching daily historical metrics from:", startDate.toISOString(), "to", endDate.toISOString());
//    const queues = await getQueues();
//    const agents = await getAgents();
//    const dailyHistoricalMetrics = [];
//    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
//        const startTime = new Date(date);
//        const endTime = new Date(date);
//        endTime.setHours(23, 59, 59, 999);
//        const input = {
//           ResourceArn: RESOURCE_ARN,
//           StartTime: startTime,
//           EndTime: endTime,
//           Metrics: [
//                { Name: "SUM_CONTACTS_ABANDONED_IN_X", Threshold: [{ Comparison: "LT", ThresholdValue: 7200 }] },
//                { Name: "SUM_CONTACTS_ANSWERED_IN_X", Threshold: [{ Comparison: "LT", ThresholdValue: 7200 }] },
//                { Name: "ABANDONMENT_RATE", Unit: "COUNT" },
//                { Name: "AGENT_ANSWER_RATE" },
//                { Name: "CONTACTS_HANDLED" },
//                { Name: "MAX_QUEUED_TIME" },
//                { Name: "AVG_HANDLE_TIME" },
//           ],
//           Filters: [
//                { FilterKey: "QUEUE", FilterValues: queues },
//                { FilterKey: "AGENT", FilterValues: agents },
//           ],
//        };
//        try {
//           const command = new GetMetricDataV2Command(input);
//           const data = await client.send(command);
//           const metricsObject = convertToObject(data);
//           dailyHistoricalMetrics.push({
//                date: startTime.toISOString().split('T')[0],
//                metrics: metricsObject,
//           });
//           console.log(`Historical Metrics for ${startTime.toISOString().split('T')[0]}:`, metricsObject);
//        } catch (err) {
//           console.error(`Error fetching historical metrics for ${startTime.toISOString().split('T')[0]}:`, err);
//        }
//    }
//    return dailyHistoricalMetrics;
// }
// // Function to convert metrics data to CSV format
// async function convertToCSV(data) {
//    const csvWriter = createObjectCsvWriter({
//        path: '/tmp/metrics_data.csv', // Temporary path for Lambda
//        header: [
//           { id: 'date', title: 'Date' },
//           { id: 'AGENTS_AFTER_CONTACT_WORK', title: 'AGENTS_AFTER_CONTACT_WORK' },
//           { id: 'AGENTS_ON_CALL', title: 'AGENTS_ON_CALL' },
//           { id: 'AGENTS_AVAILABLE', title: 'AGENTS_AVAILABLE' },
//           { id: 'AGENTS_ONLINE', title: 'AGENTS_ONLINE' },
//           { id: 'AGENTS_STAFFED', title: 'AGENTS_STAFFED' },
//           { id: 'CONTACTS_IN_QUEUE', title: 'CONTACTS_IN_QUEUE' },
//        ]
//    });
//    try {
//        await csvWriter.writeRecords(data); // Write data to CSV
//        console.log('CSV file created successfully');
//    } catch (err) {
//        console.error('Error creating CSV:', err);
//        throw err;
//    }
// }
// // Function to upload the CSV file to S3
// async function uploadToS3() {
//    const fileContent = readFileSync('/tmp/metrics_data.csv');
//    const uploadParams = {
//        Bucket: BUCKET_NAME,
//        Key: `metrics_data_${Date.now()}.csv`, // Use current timestamp for unique file name
//        Body: fileContent,
//        ContentType: 'text/csv'
//    };
//    try {
//        const command = new PutObjectCommand(uploadParams);
//        const data = await s3Client.send(command);
//        console.log("File uploaded to S3:", data);
//    } catch (err) {
//        console.error('Error uploading to S3:', err);
//        throw err;
//    }
// }
// // Handler function to call both APIs, convert to CSV, and upload to S3
// async function handler(event, context) {
//    try {
//        // Fetch real-time and historical metrics
//        const currentMetrics = await getCurrentMetrics();
//        const historicalMetrics = await getHistoricalMetrics();
//        // Combine metrics data
//        const allMetrics = {
//           realTimeMetrics: currentMetrics,
//           historicalMetrics: historicalMetrics,
//        };
//        // Convert metrics to CSV format
//        const metricsData = [...currentMetrics, ...historicalMetrics]; // Combine both metric types
//        await convertToCSV(metricsData);
//        // Upload CSV to S3
//        await uploadToS3();
//        console.log("All metrics data processed and uploaded to S3.");
//        return allMetrics; // Return the combined metrics data
//    } catch (err) {
//        console.error("Error in handler:", err);
//        throw err;
//    }
// }
// export { handler, getCurrentMetrics, getHistoricalMetrics };
