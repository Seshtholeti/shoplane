async function getCurrentMetrics() {
    const currentTime = new Date();
    const endDate = new Date(currentTime);
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);

    console.log("Fetching daily real-time metrics from:", startDate.toISOString(), "to", endDate.toISOString());

    const queues = await getQueues();
    const dailyRealTimeMetrics = [];

    // Loop through each day in the range
    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
        const startTime = new Date(date);
        const endTime = new Date(date);
        endTime.setHours(23, 59, 59, 999);
