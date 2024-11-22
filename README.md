for (let i=0;i<data['MetricResults'].length;i++){
    console.log('dataMetricresults',i,data['MetricResults'][i])
    for(let j =0 ;j<data['MetricResults'][i]['Collections'].length;j++){
console.log(data['MetricResults'][i]['Collections'][j]['Metric']['Name'],'res12',data['MetricResults'][i]['Collections'][j]['Value'])
        result[data['MetricResults'][i]['Collections'][j]['Metric']['Name']]=data['MetricResults'][i]['Collections'][j]['Value']
    }
