Hello,

Warm Greetings from AWS Premium Support. 
Thank you for your patience.

As discussed with our Amazon Connect team, it indeed seems to be an issue with the request body syntax.

The changes that are required in the syntax as per the documentation [1] are as follows:

1. For the "FilterKey" parameter, it is case-sensitive and should be set to "QUEUE" (all in capital letters), while in your API call it is set to "Queue". Hence, please set it to "QUEUE".

2. For "Groupings" parameter, it is currently set to "QUEUES"in your API Call, but should be set to "QUEUE". Hence, please make the necessary change for this parameter as well.

Therefore, the correct syntax of the entire GetMetricsDataV2 API Call for you should look like below:

============

"requestParameters": {
        "ResourceArn": "arn:aws:connect:us-east-1:768637739934:instance/bd16d991-11c8-4d1e-9900-edd5ed4a9b21",
        "Filters": {
            "FilterKey": "QUEUE",
            "FilterValues": [
                "045b5ede-7cee-45ef-a633-0d7936f5e937",
                "077f1888-2b9e-4e77-9cd9-141b09b701e3",
                "0a28581b-e2a7-4da1-833b-d4a51e5f3ef4",
                "0f416be9-1980-4ed0-b046-9711a1059712",
                "10c22474-89a5-4e20-9925-31d8a60f3282",
                "1273cf13-3cb9-4b8b-92c5-c60a19c7b919",
                "127f1326-4ced-4755-8622-6145a837381c",
                "13b9b19a-5aa2-4823-b4e1-f4e52665a92b",
                "1516ff3b-b29e-44bb-bd28-f9f762cbffc2",
                "1746c79d-3cc4-480f-93f0-70bfc28552c5",
                "1880b22b-c904-427a-add9-211961a7ad5c",
                "1afd1a58-b843-4fe9-a4b8-b3b0321c824c",
                "1d7ed2c6-8bac-4313-b991-9b0888f61871",
                "20beb4c6-5d36-4c20-b893-1580666dd78c",
                "214d333e-4b14-4bfd-b8df-56f2aea98ec9",
                "26cadb98-49ee-473e-acbc-d1c5db8886cf",
                "2c93099e-af83-41b6-a030-4e755e526dc7",
                "2fdbb317-041c-44b3-968a-b2b3fce76541",
                "311d4455-ffa5-46d8-b782-0a959074d5bb",
                "37c99675-0560-42a6-baa6-e6de865366ae",
                "3a04127b-9b4e-4b1e-a7e1-1a303679e475",
                "3bc23a8f-b740-404e-b6b4-87a84d7391dc",
                "417b0910-2b48-4bbd-b49a-8f4481303b7d",
                "45f8ac94-b329-415e-9694-6605b032c26c",
                "46021ff0-7dbc-454a-979e-c33a0f854e93",
                "469af5d9-edc3-47c6-a593-e8bc4307d3ca",
                "47c687d6-e5cc-4c6c-9b6a-26cdf7e9240e",
                "480c8674-616b-4214-8478-a9ff2312281c",
                "48b0b6fe-daac-4cd7-89cc-d161504fc805",
                "494d2967-a0c7-4062-80fc-ec406161dc8c",
                "49c7da53-f578-427c-821c-c185ee374ac9",
                "49e8c297-54a4-4cdd-9ff9-d9d72c1a8a9c",
                "4bb5872e-ab24-4260-aeff-b05c3fd55271",
                "4e44fed5-2413-44bf-8f8e-abbc5f37ca23",
                "4fab155b-5ff1-45d0-b09d-5a1e73b50b85",
                "5348c510-30b5-4a07-885e-36ece9cbb72c",
                "545ed82c-1860-4d1a-8f08-ab4b97121c71",
                "559eb611-3b67-4a03-a50b-d89602356e22",
                "58aad751-7d88-408f-8487-011c78903136",
                "6220c7da-28c2-4ff4-8ea8-4ec77486c4a8",
                "627ac4f3-3adb-429b-a3d1-b1c48b0f8cde",
                "6911fc2c-f689-4c35-95b0-1973615cf8fd",
                "6bcca815-cc29-41e9-b405-d019c6da02f5",
                "732642f4-c36b-46fc-b9ae-4c4faa127778",
                "7673ac18-5835-4d0d-9f36-b3df76cf4a4b",
                "7a87cff0-1042-4551-8fe3-cbc798247ce9",
                "7dbfc450-0a08-48da-9f9c-7f895155f1a5",
                "8727dd3d-b5ba-45d2-8bdf-136c6a65e0ac",
                "872d83df-69ec-47ba-9458-5bfb3fa9970f",
                "87ffde5e-ee77-4abb-94e4-12c95a8c904c",
                "893bc18f-8a5b-4048-a6ce-11f0aa673a3e",
                "894ca497-012b-47a8-86b6-3d7773e8e33f",
                "95e0eed0-2e91-402e-b250-eaa8071363e6",
                "9783145b-f6e4-4d42-9414-eb8943c0d9aa",
                "9aea1464-be8c-468c-9a39-39e56007f754",
                "9b037488-b81f-4f77-a561-c6e65a527381",
                "9b2818ba-3be3-4059-8f53-a8e4fdccd116",
                "9f61a88b-3f10-43c5-8f98-a7578af8f736",
                "a15fac6b-d419-4218-840a-3bd00f785a8e",
                "a19874f2-38f9-42f6-b29a-f6f2535b5f3d",
                "a4f4bfeb-e9e5-4d8e-8df3-a65259199bc2",
                "abe773c6-1ffd-42f9-9cd2-6c6b0e37dedb",
                "ac795f93-5515-4ecc-ac83-0f6967218bc7",
                "adcd29f8-e774-443c-9b14-a2988d5f54a5",
                "b1d36b05-27bc-4154-baa1-47ed65020d23",
                "b39eab73-5576-4f02-be82-fb5e1ca36e94",
                "b4e416a6-c013-4103-8146-45c528a5f7d7",
                "bc3b1e11-2f07-4297-bb1f-2f5be7c9d890",
                "bf6cfb03-d35e-452b-a98e-0b54c813d768",
                "c2929772-db83-48c3-a083-28bfb4d24651",
                "caadb6e3-cc3d-4fff-b3e8-b68b80e7a571",
                "cb482f2e-4e7b-418d-abde-fba131e907bd",
                "cd7db7bc-2bc5-46d9-bc3b-b0f1ab958968",
                "d08cd6b0-6a47-4783-8ddf-137186cd9b1f",
                "d4d34e3e-3304-45b2-b586-e4daed57366a",
                "d807563c-1ae5-48d6-97ee-80335e686469",
                "da4ed226-624c-483f-804c-aac4012bfe07",
                "db147016-68c1-4da0-960a-7d808dd7a1bc",
                "e212c573-84cb-44d6-a538-68f77f5d0183",
                "e830b05c-8c7b-4e80-898c-44add2907b91",
                "eb46c039-dbc3-47dc-a3b4-5bbca8ee6484",
                "ee9a1cb0-f774-455d-a770-c502db756354",
                "f0e46a5c-0eec-4cf5-bbe9-aad98013b923",
                "f2a2173d-eb4f-4246-aa65-443a75ea7011",
                "f5e62bba-bf8e-4dec-aa6d-525bcebbfd16",
                "f5fc0046-52b6-432c-bceb-9581ef8042e9",
                "f8c742b9-b5ef-4948-8bbf-9a33c892023f"
            ]
        },
        "Metrics": [
            {
                "Name": "CONTACTS_HANDLED"
            },
            {
                "Name": "AVG_HANDLE_TIME"
            },
            {
                "Name": "CONTACTS_ABANDONED"
            }
        ],
        "EndTime": 1731369599,
        "Groupings": [
            "QUEUE"
        ],
        "StartTime": 1731283200,
        "Interval": {
            "IntervalPeriod": "DAY"
        }
    }

============

Please make the necessary changes as mentioned above and let us know if this resolves our issue.

I trust you will find this information helpful. In case you need any further clarification or have more questions/concerns, please feel free to reply to this case and I'll be more than happy to assist you.

Have a great day ahead!

=======References=======

[1]GetMetricDataV2
https://docs.aws.amazon.com/connect/latest/APIReference/API_GetMetricDataV2.html#API_GetMetricDataV2_RequestBody 

We value your feedback. Please share your experience by rating this and other correspondences in the AWS Support Center. You can rate a correspondence by selecting the stars in the top right corner of the correspondence.

Best regards,
Rohit  D.
Amazon Web Services

this is the response from aws team.

and this is my updated code as oer their advise
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
    const metricDataInput = {
      ResourceArn: `arn:aws:connect:us-east-1:768637739934:instance/${instanceId}`,
      StartTime: new Date(yesterdayStart),
      EndTime: new Date(yesterdayEnd),
      Interval: { TimeZone: 'UTC', IntervalPeriod: 'DAY' },
      Filters: [{ FilterKey: 'QUEUE', FilterValues: queueId }],
      Groupings: ['QUEUE'],
      Metrics: [{ Name: 'CONTACTS_HANDLED' }, { Name: 'CONTACTS_ABANDONED' }],
    };

    console.log('****MetricCommnad******',metricDataInput)
    const metricCommand = new GetMetricDataV2Command(metricDataInput);
    const metricResponse = await connect.send(metricCommand);

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

          const attributesResponse = await connect.send(attributesCommand);

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








     
     

