import { ConnectClient, GetCurrentMetricDataCommand, GetMetricDataCommand } from '@aws-sdk/client-connect';
import { parse } from 'json2csv';
import fs from 'fs';

const REGION = 'us-east-1';
const INSTANCE_ID = '<Your_Instance_ID>';
const connectClient = new ConnectClient({ region: REGION });

// Metrics list as per provided requirements
const metrics = [
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
  { Name: "SLOTS_AVAILABLE", Unit: "COUNT" }
];

/**
 * Fetch Real-Time Metrics
 * @param {string} filterType - Type of filter (queue, phoneNumber, agent)
 * @param {Array} filterValues - Values to filter (queueIds, agentIds)
 * @returns {Array} - Real-time metrics data
 */
async function getRealTimeMetrics(filterType, filterValues) {
  const params = {
    InstanceId: INSTANCE_ID,
    CurrentMetrics: metrics,
    Filters: {
      Channels: ['VOICE'],
    },
  };

  // Apply Queue or Agent filters
  if (filterType === 'queue') params.Filters.Queues = filterValues;
  if (filterType === 'agent') params.Filters.RoutingProfiles = filterValues;

  const command = new GetCurrentMetricDataCommand(params);
  try {
    const data = await connectClient.send(command);
    return data.MetricResults || [];
  } catch (error) {
    console.error('Error fetching real-time metrics:', error);
    return [];
  }
}

/**
 * Export Metrics Data
 * @param {Array} metrics - Metrics data to export
 * @param {string} format - Export format (CSV or JSON)
 * @returns {string} - Exported data as string
 */
function exportMetricsData(metrics, format) {
  if (format === 'CSV') {
    try {
      return parse(metrics);
    } catch (error) {
      console.error('Error converting to CSV:', error);
      return '';
    }
  }
  return JSON.stringify(metrics, null, 2);
}

/**
 * Main Function to Execute Fetching and Displaying of Metrics
 */
async function main() {
  // Input Parameters
  const filterType = 'queue'; // Options: 'queue', 'agent'
  const filterValues = ['QueueID1']; // Replace with actual Queue or Agent IDs
  const downloadFormat = 'CSV'; // Options: 'CSV', 'JSON'
  
  // Fetch Real-Time Metrics
  const realTimeMetrics = await getRealTimeMetrics(filterType, filterValues);
  console.log('Real-Time Metrics:', realTimeMetrics);

  // Export Metrics to file
  const exportData = exportMetricsData(realTimeMetrics, downloadFormat);
  const fileName = `realtime_metrics_report.${downloadFormat.toLowerCase()}`;
  fs.writeFileSync(fileName, exportData);
  console.log(`Metrics report saved to ${fileName}`);
}

// Execute the main function
main().catch(error => console.error('Execution Error:', error));