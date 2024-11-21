import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import csvParser from 'csv-parser';
import { 
  ConnectClient, 
  StartOutboundVoiceContactCommand, 
  GetMetricDataCommand 
} from '@aws-sdk/client-connect';
import { subDays, format } from 'date-fns';

const s3 = new S3Client();
const connect = new ConnectClient();

export const handler = async (event) => {
  const bucketName = 'customeroutbound-data';
  const fileName = 'CustomerOutboundNumber.csv';
  const instanceId = 'bd16d991-11c8-4d1e-9900-edd5ed4a9b21';

  // Calculate yesterday dynamically
  const yesterdayStart = `${format(subDays(new Date(), 1), 'yyyy-MM-dd')}T00:00:00Z`;
  const yesterdayEnd = `${format(subDays(new Date(), 1), 'yyyy-MM-dd')}T23:59:59Z`;

  try {
    // Step 1: Fetch phone numbers from S3 CSV
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

    console.log('Phone numbers parsed and formatted:', phoneNumbers);

    // Step 2: Fetch call records from Amazon Connect for yesterday
    const metricParams = {
      InstanceId: instanceId,
      StartTime: yesterdayStart,
      EndTime: yesterdayEnd,
      Filters: {
        Channels: ['VOICE'],
      },
      Groupings: ['AGENT'],
      Metrics: [
        { Name: 'CONTACTS_ANSWERED', Unit: 'COUNT' },
        { Name: 'CONTACTS_NOT_ANSWERED', Unit: 'COUNT' },
      ],
    };

    const metricCommand = new GetMetricDataCommand(metricParams);
    const metricResponse = await connect.send(metricCommand);

    console.log('Call metrics for yesterday:', metricResponse);

    const result = {
      answered: [],
      notAnswered: [],
    };

    // Step 3: Process metrics and print results
    metricResponse.MetricResults?.forEach((metric) => {
      const { Collections } = metric;
      Collections?.forEach((dataPoint) => {
        if (dataPoint.Metric?.Name === 'CONTACTS_ANSWERED') {
          result.answered.push({
            AgentId: dataPoint.Groupings?.find((g) => g.Name === 'AGENT')?.Value,
            Count: dataPoint.Value,
          });
        } else if (dataPoint.Metric?.Name === 'CONTACTS_NOT_ANSWERED') {
          result.notAnswered.push({ Count: dataPoint.Value });
        }
      });
    });

    console.log('Answered calls:', result.answered);
    console.log('Not answered calls:', result.notAnswered);

    // Return result
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Call data processed successfully.',
        result,
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