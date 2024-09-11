import React from "react";
import { useSpring, animated } from "react-spring";
import { CarOutlined } from "@ant-design/icons";
import "./GamificationUI.css";
const CarProgress = ({ score }) => {
  const maxScore = 500; // Maximum score
  const progress = (score / maxScore) * 100; // Calculate percentage for progress
  const animationProps = useSpring({
    to: { transform: `translateX(${progress}%)` },
    from: { transform: "translateX(0%)" },
    config: { duration: 1000 },
  });
  return (
    <div className="car-progress-container">
      <div className="track">
        <animated.div className="car" style={animationProps}>
          <CarOutlined className="car-icon" />
        </animated.div>
      </div>
      <span className="progress-text">{score}</span>
    </div>
  );
};
export default CarProgress;



.header {
  background-color: #1890ff;
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
  font-size: 16px; /* Increased font size for better readability */
}
.ant-table th {
  background-color: #1890ff; /* Header color */
  color: white;
  font-size: 18px; /* Increased font size */
  font-weight: bold;
  padding: 12px;
}
.ant-table td {
  padding: 12px;
}
.gold-row {
  background-color: #fffde7; /* Light yellow for gold */
}
.silver-row {
  background-color: #f3f6f9; /* Light gray for silver */
}
.bronze-row {
  background-color: #f9f9f9; /* Light background for bronze */
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
/* Car Progress Styles */
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
.car {
  position: absolute;
  bottom: 0;
  font-size: 30px;
  color: #1890ff;
}


import React, { useEffect, useState } from "react";
import { Table, Layout, Typography, Divider, Badge } from "antd";
import axios from "axios";
import TopPerformerCard from "./TopPerformerCard";
import CarProgress from "./CarProgress";
import "./GamificationUI.css";
const { Header, Content } = Layout;
const { Title, Text } = Typography;
const GamificationUI = () => {
  const [agents, setAgents] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://rrjboaljfmf5vyhuienk5mzszi0weebt.lambda-url.us-east-1.on.aws/"
        );
        setAgents(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);
  const columns = [
    {
      title: "Agent Name",
      dataIndex: "agent_name",
      key: "agent_name",
      width: "30%",
    },
    {
      title: "Performance Score",
      dataIndex: "performance_score",
      key: "performance_score",
      width: "20%",
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
        <Badge
          count={score > 300 ? "Gold" : score > 200 ? "Silver" : "Bronze"}
          style={{
            backgroundColor:
              score > 300 ? "#FFD700" : score > 200 ? "#C0C0C0" : "#cd7f32",
          }}
        />
      ),
    },
  ];
  const topPerformers = agents.filter((agent) => agent.performance_score > 300);
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
        <Table
          dataSource={agents}
          columns={columns}
          rowKey="agent_id"
          pagination={false}
          rowClassName={(record) => {
            if (record.performance_score > 300) {
              return "gold-row";
            } else if (record.performance_score > 200) {
              return "silver-row";
            } else {
              return "bronze-row";
            }
          }}
        />
      </Content>
    </Layout>
  );
};
export default GamificationUI;


import React from "react";
import { Badge, Typography } from "antd";
import { StarOutlined } from "@ant-design/icons"; // Importing star icon for gold badge
import "./GamificationUI.css";
const { Text } = Typography;
const TopPerformerCard = ({ agent }) => {
  return (
    <div className="top-performer-card">
      <div className="badge-container">
        <StarOutlined className="gold-badge" />
        <Text strong>{agent.agent_name}</Text>
      </div>
      <Text className="performance-score">
        Performance Score: {agent.performance_score}
      </Text>
      <Badge
        count={
          agent.performance_score > 300
            ? "Gold"
            : agent.performance_score > 200
            ? "Silver"
            : "Bronze"
        }
        style={{
          backgroundColor:
            agent.performance_score > 300
              ? "#FFD700"
              : agent.performance_score > 200
              ? "#C0C0C0"
              : "#cd7f32",
        }}
      />
    </div>
  );
};
export default TopPerformerCard;
