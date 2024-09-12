```css
.header {
  background-color: #00008b;
  padding: 20px;
  text-align: center;
}
.header-content {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.ant-table {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
  font-size: 16px;
}
.ant-table th {
  background-color: #00008b;
  color: white;
  font-size: 20px; /* Enhanced font size */
  font-weight: bold;
  padding: 12px; /* Decreased padding for row height */
  border-bottom: 2px solid #ddd; /* Added bottom border */
}
.ant-table td {
  padding: 8px; /* Decreased padding for row height */
  font-size: 18px; /* Enhanced font size */
  background-color: #f6f6f6;
  border-bottom: 1px solid #ddd; /* Added bottom border */
}
.ant-table tr:hover {
  background-color: #e6f7ff; /* Light blue on hover */
}
.gold-row {
  background-color: #fffde7;
}
.silver-row {
  background-color: #f3f6f9;
}
.bronze-row {
  background-color: #f9f9f9;
}
.ant-badge {
  font-weight: bold;
}
.top-performers {
  margin-bottom: 20px;
}
.top-performers-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.top-performer-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  text-align: center;
  margin: 10px;
  width: 220px;
  transition: transform 0.2s;
}
.top-performer-card:hover {
  transform: scale(1.05);
}
.badge-container {
  display: flex;
  align-items: center;
  justify-content: center;
}
.gold-badge {
  color: #ffd700;
  font-size: 24px;
  margin-right: 8px;
}
.performance-score {
  display: block;
  margin: 10px 0;
}
.car-progress-container {
  position: relative;
  width: 100%;
  height: 50px;
  margin: 10px 0;
}
.track {
  background-color: #e0e0e0;
  border-radius: 15px;
  overflow: hidden;
  height: 100%;
  position: relative;
}
.progress-bar {
  background-color: #1890ff;
  height: 100%;
  border-radius: 15px;
  transition: width 0.5s ease-in-out;
}
.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-weight: bold;
}
.top-performer-container {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}
.sparkle {
  position: absolute;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  animation: sparkle 1.5s infinite;
}
@keyframes sparkle {
  0% {
    opacity: 0;
    transform: scale(0.5);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
  100% {
    opacity: 0;
    transform: scale(1);
  }
}
.sparkle:nth-child(1) {
  background-color: #ff0000;
  left: 10%;
  top: 10%;
  animation-delay: 0s;
}
.sparkle:nth-child(2) {
  background-color: #00ff00;
  left: 30%;
  top: 20%;
  animation-delay: 0.3s;
}
.sparkle:nth-child(3) {
  background-color: #0000ff;
  left: 50%;
  top: 10%;
  animation-delay: 0.6s;
}
.sparkle:nth-child(4) {
  background-color: #ffff00;
  left: 70%;
  top: 20%;
  animation-delay: 0.9s;
}
.sparkle:nth-child(5) {
  background-color: #ff00ff;
  left: 90%;
  top: 10%;
  animation-delay: 1.2s;
}

```
```javascript
import React, { useEffect, useState } from "react";
import {
  Table,
  Layout,
  Typography,
  Divider,
  Badge,
  Button,
  Modal,
  Tooltip,
} from "antd";
import axios from "axios";
import TopPerformerCard from "./TopPerformerCard";
import CarProgress from "./CarProgress";
import "./GamificationUI.css";

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const GamificationUI = () => {
  const [agents, setAgents] = useState([]);
  const [topPerformer, setTopPerformer] = useState(null);
  const [points, setPoints] = useState(0);
  const [showSparkles, setShowSparkles] = useState(false);
  const [isGameVisible, setIsGameVisible] = useState(false);
  const [userMetrics, setUserMetrics] = useState(null);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  const targetTalkTime = 9000; // Target talk time in seconds
  const targetCallsCount = 3; // Target calls count
  const targetCustomerSentiments = 30; // Target customer sentiments score
  const targetNonTalkTime = 10000; // Target non-talk time in seconds

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://rrjboaljfmf5vyhuienk5mzszi0weebt.lambda-url.us-east-1.on.aws/"
        );
        setAgents(response.data);
        const topAgent = response.data.reduce(
          (max, agent) =>
            agent.performance_score > max.performance_score ? agent : max,
          response.data[0]
        );
        setTopPerformer(topAgent);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleChallengeComplete = () => {
    setIsGameVisible(true);
    const userAgent = agents.find(
      (agent) => agent.agent_id === "872d83df-69ec-47ba-9458-5bfb3fa9970f"
    );
    setUserMetrics(userAgent);
  };

  const handleSubmit = () => {
    let score = 0;
    let feedback = "";
    if (userMetrics.agent_talk_time < targetTalkTime) {
      feedback += "Increase your agent talk time to improve your performance.\n";
    } else {
      score += 25;
    }
    if (userMetrics.agent_calls_count < targetCallsCount) {
      feedback += "Increase your agent calls count to improve your performance.\n";
    } else {
      score += 25;
    }
    if (userMetrics.customer_sentiments_score < targetCustomerSentiments) {
      feedback += "Increase your customer sentiments score to improve your performance.\n";
    } else {
      score += 25;
    }
    if (userMetrics.agent_non_talk_time > targetNonTalkTime) {
      feedback += "Decrease your agent non-talk time to improve your performance.\n";
    } else {
      score += 25;
    }
    setPoints(points + score);
    alert(`Congratulations! You earned ${score} points.\n\nFeedback:\n${feedback}`);
    setIsGameVisible(false);
  };

  const columns = [
    {
      title: "Agent Name",
      dataIndex: "agent_name",
      key: "agent_name",
      width: "30%",
      render: (text, record) => (
        <Button
          type="link"
          style={{ fontSize: "18px", textTransform: "capitalize" }} // Capitalize first letter of each word
          onClick={() => {
            const newExpandedRowKeys = expandedRowKeys.includes(record.agent_id)
              ? expandedRowKeys.filter((key) => key !== record.agent_id)
              : [...expandedRowKeys, record.agent_id];
            setExpandedRowKeys(newExpandedRowKeys);
          }}
        >
          {text}
        </Button>
      ),
    },
    {
      title: "Performance Score",
      dataIndex: "performance_score",
      key: "performance_score",
      width: "20%",
      render: (text) => (
        <span style={{ fontWeight: "bold", fontSize: "20px" }}>{text}</span> // Increased font size
      ),
    },
    {
      title: "Progress",
      dataIndex: "performance_score",
      key: "progress",
      width: "30%",
      render: (score) => <CarProgress score={score} />,
    },
    {
      title: "Badge",
      dataIndex: "performance_score",
      key: "badge",
      width: "20%",
      render: (score) => (
        <img
          src={
            score > 400
              ? "path/to/gold-badge.png"
              : score > 300
              ? "path/to/silver-badge.png"
              : "path/to/bronze-badge.png"
          }
          alt="Badge"
          style={{ width: "40px", height: "40px" }}
        />
      ),
    },
  ];

  const topPerformers = agents.filter((agent) => agent.performance_score > 400);

  const expandedRowRender = (record) => {
    return (
      <div>
        <Text>Agent Sentiments Score: {record.agent_sentiments_score}</Text>
        <br />
        <Text>Customer Sentiments Score: {record.customer_sentiments_score}</Text>
        <br />
        <Text>Agent Talk Time: {record.agent_talk_time}</Text>
        <br />
        <Text>Agent Non-Talk Time: {record.agent_non_talk_time}</Text>
        <br />
        <Text>Agent Calls Count: {record.agent_calls_count}</Text>
      </div>
    );
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header className="header">
        <div className="header-content">
          <Title style={{ color: "white" }} level={2}>
            Agent Performance Leaderboard
          </Title>
        </div>
      </Header>
      <Content style={{ padding: "20px" }}>
        {topPerformer && (
          <div className="top-performer-container">
            <TopPerformerCard
              key={topPerformer.agent_id}
              agent={topPerformer}
              showSparkles={showSparkles}
              onCelebrate={() => {
                setShowSparkles(true);
                setTimeout(() => setShowSparkles(false), 3000);
              }}
            />
          </div>
        )}
        {topPerformers.length > 0 && (
          <div className="top-performers">
            <Divider orientation="left">Top Performers</Divider>
            <Text>
              Congratulations to our top performers who have achieved the
              coveted Gold Badge! Keep up the excellent work and aim for the
              stars!
            </Text>
            <div className="top-performers-list">
              {topPerformers.map((agent) => (
                <TopPerformerCard key={agent.agent_id} agent={agent} />
              ))}
            </div>
          </div>
        )}
        <Button type="primary" onClick={handleChallengeComplete}>
          Complete Challenge
        </Button>
        <Text style={{ marginLeft: "10px" }}>Points: {points}</Text>
        <Table
          className="agent-performance-table"
          dataSource={agents}
          columns={columns}
          rowKey="agent_id"
          pagination={false}
          expandedRowKeys={expandedRowKeys}
          expandedRowRender={expandedRowRender}
          onExpand={(expanded, record) => {
            const newExpandedRowKeys = expanded
              ? [...expandedRowKeys, record.agent_id]
              : expandedRowKeys.filter((key) => key !== record.agent_id);
            setExpandedRowKeys(newExpandedRowKeys);
          }}
          rowClassName={(record) => {
            if (record.performance_score > 400) {
              return "gold-row";
            } else if (record.performance_score > 300) {
              return "silver-row";
            } else {
              return "bronze-row";
            }
          }}
        />
        <Modal
          title="Become the Top Performer!"
          visible={isGameVisible}
          onCancel={() => setIsGameVisible(false)}
          footer={null}
          width={600}
        >
          {userMetrics && (
            <div>
              <Text style={{ fontSize: "18px", fontWeight: "bold" }}>
                Current Metrics:
              </Text>
              <div style={{ marginTop: "10px" }}>
                <Text style={{ display: "block" }}>
                  Agent Talk Time: {userMetrics.agent_talk_time}
                </Text>
                <Text style={{ display: "block" }}>
                  Target: {targetTalkTime}
                </Text>
              </div>
              <div style={{ marginTop: "10px" }}>
                <Text style={{ display: "block" }}>
                  Agent Calls Count: {userMetrics.agent_calls_count}
                </Text>
                <Text style={{ display: "block" }}>
                  Target: {targetCallsCount}
                </Text>
              </div>
              <div style={{ marginTop: "10px" }}>
                <Text style={{ display: "block" }}>
                  Customer Sentiments Score:{" "}
                  {userMetrics.customer_sentiments_score}
                </Text>
                <Text style={{ display: "block" }}>
                  Target: {targetCustomerSentiments}
                </Text>
              </div>
              <div style={{ marginTop: "10px" }}>
                <Text style={{ display: "block" }}>
                  Agent Non-Talk Time: {userMetrics.agent_non_talk_time}
                </Text>
                <Text style={{ display: "block" }}>
                  Target: {targetNonTalkTime}
                </Text>
              </div>
              <Button
                type="primary"
                onClick={handleSubmit}
                style={{ marginTop: "20px" }}
              >
                Submit
              </Button>
            </div>
          )}
        </Modal>
      </Content>
    </Layout>
  );
};

export default GamificationUI;

```