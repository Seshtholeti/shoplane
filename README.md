import { ConnectClient, ListQueuesCommand,ListUsersCommand, GetCurrentMetricDataCommand, GetMetricDataV2Command } from "@aws-sdk/client-connect";
// Initialize the AWS Connect client
const client = new ConnectClient({ region: 'us-east-1' });
// Utility function to add delay between requests
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
// Function to retry the AWS SDK call in case of throttling
async function retryWithExponentialBackoff(fn, retries = 5, delayMs = 1000) {
    let attempt = 0;
    while (attempt < retries) {
        try {
          return await fn();
        } catch (error) {
          if (error.name === 'ThrottlingException' && attempt < retries - 1) {
                const delayTime = delayMs * Math.pow(2, attempt);
                console.log(`Throttling error. Retrying in ${delayTime}ms...`);
                await delay(delayTime);
                attempt++;
          } else {
                throw error;
          }
        }
    }
}
// Helper to fetch the list of queues
async function getQueues() {
    const input = { InstanceId: process.env.InstanceId };
    try {
        const command = new ListQueuesCommand(input);
        const data = await retryWithExponentialBackoff(() => client.send(command));
        return data.QueueSummaryList.map(queue => queue.Id);
    } catch (err) {
        console.error("Error fetching queues:", err);
        throw err;
    }
}
// Helper to fetch the list of agents
async function getAgents() {
    const input = { InstanceId: process.env.InstanceId };
    try {
        const command = new ListUsersCommand(input);
        const data = await retryWithExponentialBackoff(() => client.send(command));
        return data.UserSummaryList.map(user => user.Id).slice(0, 10); // Limit to 10 agents
    } catch (err) {
        console.error("Error fetching agents:", err);
        throw err;
    }
}
// Real-time metrics function
export const handler = async (event) => {
    const queues = await getQueues();
    const agents = await getAgents();
    const currentDate = new Date();
    const realTimeMetrics = [];
    // Loop through the past 30 days
    for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
        const date = new Date();
        date.setDate(currentDate.getDate() - dayOffset);
        const input = {
          InstanceId: process.env.InstanceId,
          Filters: { Channels: ['VOICE'], Queues: queues, Agents: agents },
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
          const data = await retryWithExponentialBackoff(() => client.send(command));
          const metrics = data.MetricResults.map(result => ({
                metricName: result.Name,
                value: result.Value
          }));
          realTimeMetrics.push({
                date: date.toISOString().split('T')[0],
                metrics,
          });
        } catch (error) {
          console.error("Error fetching real-time metrics:", error);
        }
        // Add delay between requests to prevent throttling
        await delay(1000);
    }
    return {
        statusCode: 200,
        body: JSON.stringify({
          message: "Real-time metrics fetched successfully.",
          metrics: realTimeMetrics
        })
    };
};


this lambda code is not giving any metric values, also taking so much time to give the response
