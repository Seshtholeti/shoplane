import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import csvParser from 'csv-parser';
import { ConnectClient, GetMetricDataV2Command, GetContactAttributesCommand } from '@aws-sdk/client-connect';
import { subDays, format } from 'date-fns';

const s3 = new S3Client();
const connect = new ConnectClient();

export const handler = async () => {
  const bucketName = 'customeroutbound-data';
  const fileName = 'CustomerOutboundNumber.csv';
  const instanceId = 'bd16d991-11c8-4d1e-9900-edd5ed4a9b21';
  const queueId = 'f8c742b9-b5ef-4948-8bbf-9a33c892023f';
  const yesterdayStart = `${format(subDays(new Date(), 1), 'yyyy-MM-dd')}T00:00:00Z`;
  const yesterdayEnd = `${format(subDays(new Date(), 1), 'yyyy-MM-dd')}T23:59:59Z`;

  try {
    // Step 1: Fetch contact data metrics for yesterday
    const metricDataInput = {
      ResourceArn: `arn:aws:connect:us-east-1:768637739934:instance/${instanceId}`,
      StartTime: new Date(yesterdayStart),
      EndTime: new Date(yesterdayEnd),
      Interval: { TimeZone: 'UTC', IntervalPeriod: 'DAY' },
      Filters: [{ FilterKey: 'QUEUE', FilterValues: [queueId] }],
      Groupings: ['CONTACT_ID'],
      Metrics: [{ Name: 'CONTACTS_HANDLED' }],
    };

    const metricCommand = new GetMetricDataV2Command(metricDataInput);
    const metricResponse = await connect.send(metricCommand);

    // Step 2: Parse Contact IDs
    const contactIds = [];
    metricResponse.MetricResults.forEach((result) => {
      result.Collections.forEach((collection) => {
        if (collection.Metric.Name === 'CONTACTS_HANDLED' && collection.Value > 0) {
          const contactId = result.Dimensions?.CONTACT_ID;
          if (contactId) contactIds.push(contactId);
        }
      });
    });

    if (contactIds.length === 0) {
      throw new Error('No contact IDs found for yesterday.');
    }

    // Step 3: Fetch details for each contact
    const contactDetails = await Promise.all(
      contactIds.map(async (contactId) => {
        const attrCommand = new GetContactAttributesCommand({
          InstanceId: instanceId,
          InitialContactId: contactId,
        });
        const attributesResponse = await connect.send(attrCommand);

        return {
          contactId,
          attributes: attributesResponse.Attributes,
        };
      })
    );

    console.log('Contact Details:', contactDetails);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Contact details retrieved successfully.',
        contactDetails,
      }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message, details: error.stack }),
    };
  }
};