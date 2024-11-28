import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import csvParser from 'csv-parser';
import { ConnectClient, GetMetricDataV2Command, GetContactAttributesCommand, ListQueuesCommand } from '@aws-sdk/client-connect';
import { subDays, format } from 'date-fns';

const s3 = new S3Client();
const client = new ConnectClient({ region: 'us-east-1' });

// Function to fetch all queue IDs
const fetchAllQueueIds = async () => {
  const queueIds = [];
  try {
    const listQueuesCommand = new ListQueuesCommand({
      InstanceId: process.env.InstanceId,
    });
    const data = await client.send(listQueuesCommand);
    console.log('Fetched Queues:', data.QueueSummaryList);  // Log queue details for debugging
    if (data.QueueSummaryList && data.QueueSummaryList.length > 0) {
      data.QueueSummaryList.forEach(queue => {
        queueIds.push(queue.Id);
      });
    }
  } catch (err) {
    console.error('Error fetching queue IDs:', err);
  }
  console.log('Queue IDs:', queueIds);  // Log the final array of queue IDs
  return queueIds;
};

export const handler = async () => {
  const bucketName = 'customeroutbound-data';
  const fileName = 'CustomerOutboundNumber.csv';
  const instanceId = 'bd16d991-11c8-4d1e-9900-edd5ed4a9b21';
  
  const yesterdayStart = `${format(subDays(new Date(), 1), 'yyyy-MM-dd')}T00:00:00Z`;
  const yesterdayEnd = `${format(subDays(new Date(), 1), 'yyyy-MM-dd')}T23:59:59Z`;

  try {
    // Fetch CSV from S3
    const params = { Bucket: bucketName, Key: fileName };
    const command = new GetObjectCommand(params);
    const response = await s3.send(command);
    const stream = response.Body;

    if (!stream) {
      throw new Error('No stream data found in the S3 object.');
    }

    const phoneNumbers = [];
    await new Promise((resolve, reject) => {
      stream
        .pipe(csvParser({ separator: ';' }))
        .on('data', (row) => {
          const phoneNumber = row.PhoneNumber || row['Name;PhoneNumber']?.split(';')[1]?.trim();
          if (phoneNumber) {
            let formattedNumber = phoneNumber.replace(/\D/g, '');
            if (formattedNumber.length === 10) {
              formattedNumber = `+91${formattedNumber}`;
            } else if (formattedNumber.length === 11) {
              formattedNumber = `+1${formattedNumber}`;
            }
            phoneNumbers.push(formattedNumber);
          }
        })
        .on('end', resolve)
        .on('error', reject);
    });

    if (phoneNumbers.length === 0) {
      throw new Error('No phone numbers found in the CSV file.');
    }

    // Fetch metrics from Amazon Connect
    const queueIds = await fetchAllQueueIds();
    if (queueIds.length === 0) {
      throw new Error('No queues found');
    }

    
    console.log('Queue IDs for Metric Command:', queueIds);

    // Verify that queueIds is a valid array
    if (!Array.isArray(queueIds) || queueIds.length === 0) {
      throw new Error('Invalid or empty Queue IDs');
    }

    const metricDataInput = {
      ResourceArn: `arn:aws:connect:us-east-1:768637739934:instance/${instanceId}`,
      StartTime: new Date(yesterdayStart),
      EndTime: new Date(yesterdayEnd),
      Interval: { IntervalPeriod: 'DAY' },
      Filters: [{
        FilterKey: 'QUEUE',
        FilterValues: queueIds 
      }],
      Groupings: ['QUEUE'],
      Metrics: [
        { Name: "CONTACTS_HANDLED", Unit: "COUNT" },
        { Name: "CONTACTS_ABANDONED", Unit: "COUNT" },
      ],
    };

    // Log metric data input for debugging
    console.log('**** Metric Command ******', metricDataInput);

    const metricCommand = new GetMetricDataV2Command(metricDataInput);
    const metricResponse = await client.send(metricCommand);

    const contactDetails = [];

    // Extract and format contact details
    for (const result of metricResponse.MetricResults) {
      const agentId = result.Dimensions?.AGENT || 'N/A';
      const phoneNumber = result.Dimensions?.PhoneNumber || 'N/A';
      const disposition = result.Dimensions?.Disposition || 'Unknown';

      for (const collection of result.Collections) {
        if (collection.Metric.Name === 'CONTACTS_HANDLED' && collection.Value > 0) {
          // Fetch contact attributes from Amazon Connect
          const attributesCommand = new GetContactAttributesCommand({
            InstanceId: instanceId,
            InitialContactId: result.Dimensions?.ContactId || 'N/A',
          });

          const attributesResponse = await client.send(attributesCommand);

          contactDetails.push({
            contactId: result.Dimensions?.ContactId || 'N/A',
            agentId,
            timestamp: new Date().toISOString(),
            outboundPhoneNumber: phoneNumber,
            disposition: disposition || 'Completed',
            attributes: attributesResponse.Attributes || {},
          });
        } else if (collection.Metric.Name === 'CONTACTS_ABANDONED' && collection.Value > 0) {
          contactDetails.push({
            contactId: result.Dimensions?.ContactId || 'N/A',
            agentId,
            timestamp: new Date().toISOString(),
            outboundPhoneNumber: phoneNumber,
            disposition: 'Abandoned',
            attributes: {},
          });
        }
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Contact details fetched successfully.',
        contactDetails,
      }),
    };
  } catch (error) {
    console.error('Error processing the Lambda function:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message, details: error.stack }),
    };
  }
};

this is the code and this is the error.

Response
{
  "statusCode": 500,
  "body": "{\"error\":\"User: arn:aws:sts::768637739934:assumed-role/CustomerCallMetricsLogger-role-eb56n0ad/CustomerCallMetricsLogger is not authorized to perform: connect:* on resource: * with an explicit deny\",\"details\":\"AccessDeniedException: User: arn:aws:sts::768637739934:assumed-role/CustomerCallMetricsLogger-role-eb56n0ad/CustomerCallMetricsLogger is not authorized to perform: connect:* on resource: * with an explicit deny\\n    at de_AccessDeniedExceptionRes (/var/runtime/node_modules/@aws-sdk/client-connect/dist-cjs/index.js:9821:21)\\n    at de_CommandError (/var/runtime/node_modules/@aws-sdk/client-connect/dist-cjs/index.js:9755:19)\\n    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)\\n    at async /var/runtime/node_modules/@aws-sdk/node_modules/@smithy/middleware-serde/dist-cjs/index.js:35:20\\n    at async /var/runtime/node_modules/@aws-sdk/node_modules/@smithy/core/dist-cjs/index.js:165:18\\n    at async /var/runtime/node_modules/@aws-sdk/node_modules/@smithy/middleware-retry/dist-cjs/index.js:320:38\\n    at async /var/runtime/node_modules/@aws-sdk/middleware-logger/dist-cjs/index.js:34:22\\n    at async Runtime.handler (file:///var/task/index.mjs:275:38)\"}"
}

Function Logs
356e22',
  '58aad751-7d88-408f-8487-011c78903136',
  '6220c7da-28c2-4ff4-8ea8-4ec77486c4a8',
  '627ac4f3-3adb-429b-a3d1-b1c48b0f8cde',
  '6911fc2c-f689-4c35-95b0-1973615cf8fd',
  '6bcca815-cc29-41e9-b405-d019c6da02f5',
  '732642f4-c36b-46fc-b9ae-4c4faa127778',
  '7673ac18-5835-4d0d-9f36-b3df76cf4a4b',
  '7a87cff0-1042-4551-8fe3-cbc798247ce9',
  '7dbfc450-0a08-48da-9f9c-7f895155f1a5',
  '8727dd3d-b5ba-45d2-8bdf-136c6a65e0ac',
  '872d83df-69ec-47ba-9458-5bfb3fa9970f',
  '87ffde5e-ee77-4abb-94e4-12c95a8c904c',
  '893bc18f-8a5b-4048-a6ce-11f0aa673a3e',
  '894ca497-012b-47a8-86b6-3d7773e8e33f',
  '95e0eed0-2e91-402e-b250-eaa8071363e6',
  '9783145b-f6e4-4d42-9414-eb8943c0d9aa',
  '9aea1464-be8c-468c-9a39-39e56007f754',
  '9b037488-b81f-4f77-a561-c6e65a527381',
  '9b2818ba-3be3-4059-8f53-a8e4fdccd116',
  '9f61a88b-3f10-43c5-8f98-a7578af8f736',
  'a15fac6b-d419-4218-840a-3bd00f785a8e',
  'a19874f2-38f9-42f6-b29a-f6f2535b5f3d',
  'a4f4bfeb-e9e5-4d8e-8df3-a65259199bc2',
  'abe773c6-1ffd-42f9-9cd2-6c6b0e37dedb',
  'ac795f93-5515-4ecc-ac83-0f6967218bc7',
  'adcd29f8-e774-443c-9b14-a2988d5f54a5',
  'b1d36b05-27bc-4154-baa1-47ed65020d23',
  'b39eab73-5576-4f02-be82-fb5e1ca36e94',
  'b4e416a6-c013-4103-8146-45c528a5f7d7',
  'bc3b1e11-2f07-4297-bb1f-2f5be7c9d890',
  'bf6cfb03-d35e-452b-a98e-0b54c813d768',
  'c2929772-db83-48c3-a083-28bfb4d24651',
  'caadb6e3-cc3d-4fff-b3e8-b68b80e7a571',
  'cb482f2e-4e7b-418d-abde-fba131e907bd',
  'cd7db7bc-2bc5-46d9-bc3b-b0f1ab958968',
  'd08cd6b0-6a47-4783-8ddf-137186cd9b1f',
  'd4d34e3e-3304-45b2-b586-e4daed57366a',
  'd807563c-1ae5-48d6-97ee-80335e686469',
  'da4ed226-624c-483f-804c-aac4012bfe07',
  'db147016-68c1-4da0-960a-7d808dd7a1bc',
  'e212c573-84cb-44d6-a538-68f77f5d0183',
  'e830b05c-8c7b-4e80-898c-44add2907b91',
  'eb46c039-dbc3-47dc-a3b4-5bbca8ee6484',
  'ee9a1cb0-f774-455d-a770-c502db756354',
  'f0e46a5c-0eec-4cf5-bbe9-aad98013b923',
  'f2a2173d-eb4f-4246-aa65-443a75ea7011',
  'f5e62bba-bf8e-4dec-aa6d-525bcebbfd16',
  'f5fc0046-52b6-432c-bceb-9581ef8042e9',
  'f8c742b9-b5ef-4948-8bbf-9a33c892023f'
]
2024-11-28T08:33:59.278Z	e21a9209-a10f-4e33-a3bf-1e18d8d87c96	INFO	**** Metric Command ****** {
  ResourceArn: 'arn:aws:connect:us-east-1:768637739934:instance/bd16d991-11c8-4d1e-9900-edd5ed4a9b21',
  StartTime: 2024-11-27T00:00:00.000Z,
  EndTime: 2024-11-27T23:59:59.000Z,
  Interval: { IntervalPeriod: 'DAY' },
  Filters: [ { FilterKey: 'QUEUE', FilterValues: [Array] } ],
  Groupings: [ 'QUEUE' ],
  Metrics: [
    { Name: 'CONTACTS_HANDLED', Unit: 'COUNT' },
    { Name: 'CONTACTS_ABANDONED', Unit: 'COUNT' }
  ]
}
2024-11-28T08:33:59.598Z	e21a9209-a10f-4e33-a3bf-1e18d8d87c96	ERROR	Error processing the Lambda function: AccessDeniedException: User: arn:aws:sts::768637739934:assumed-role/CustomerCallMetricsLogger-role-eb56n0ad/CustomerCallMetricsLogger is not authorized to perform: connect:* on resource: * with an explicit deny
    at de_AccessDeniedExceptionRes (/var/runtime/node_modules/@aws-sdk/client-connect/dist-cjs/index.js:9821:21)
