// const getQueueIds = async (instanceId) => {
//  try {
//    const input = {
//      InstanceId: instanceId,
//      MaxResults: 100, // Adjust based on your needs; max is 100 per request
//    };
//    const command = new ListQueuesCommand(input);
//    const response = await client.send(command);
//    // Extract Queue IDs
//    const queueIds = response.QueueSummaryList.map((queue) => queue.Id);
//    return queueIds;
//  } catch (error) {
//    console.error("Error fetching queue IDs:", error);
//    throw new Error("Failed to retrieve queue IDs");
//  }
