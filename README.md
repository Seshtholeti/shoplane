```javascript
// src/GamificationUI.js
import React, { useEffect, useState } from 'react';
import { Table, Progress, Badge, Layout, Typography } from 'antd';
import axios from 'axios';
import './GamificationUI.css'; // Import custom styles

const { Header, Content } = Layout;
const { Title } = Typography;

const GamificationUI = () => {
    const [agents, setAgents] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://rrjboaljfmf5vyhuienk5mzszi0weebt.lambda-url.us-east-1.on.aws/');
                setAgents(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    const columns = [
        { title: 'Agent Name', dataIndex: 'agent_name', key: 'agent_name' },
        { title: 'Performance Score', dataIndex: 'performance_score', key: 'performance_score' },
        { title: 'Calls Count', dataIndex: 'agent_calls_count', key: 'agent_calls_count' },
        {
            title: 'Progress',
            dataIndex: 'performance_score',
            render: (score) => <Progress percent={(score / 400) * 100} status={score > 300 ? 'success' : 'normal'} />,
        },
        {
            title: 'Badge',
            dataIndex: 'performance_score',
            render: (score) => (
                <Badge count={score > 300 ? 'Gold' : score > 200 ? 'Silver' : 'Bronze'} style={{ backgroundColor: score > 300 ? '#FFD700' : score > 200 ? '#C0C0C0' : '#cd7f32' }} />
            ),
        },
    ];

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header className="header">
                <Title style={{ color: 'white' }} level={2}>Agent Performance Leaderboard</Title>
            </Header>
            <Content style={{ padding: '20px' }}>
                <Table dataSource={agents} columns={columns} rowKey="agent_id" pagination={false} />
            </Content>
        </Layout>
    );
};

export default GamificationUI;

```

```css
/* src/GamificationUI.css */
.header {
    background-color: #1890ff;
    padding: 20px;
    text-align: center;
}

.ant-table {
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.ant-table th {
    background: #f0f2f5;
}

.ant-badge {
    font-weight: bold;
}

```


```javascript
// src/App.js
import React from 'react';
import 'antd/dist/antd.css'; // Import Ant Design styles
import GamificationUI from './GamificationUI';

const App = () => {
    return (
        <div>
            <GamificationUI />
        </div>
    );
};

export default App;

```
