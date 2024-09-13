import React from "react";
import { Badge, Typography, Button } from "antd";
import { StarOutlined } from "@ant-design/icons";
import "./GamificationUI.css";
const { Text } = Typography;
const TopPerformerCard = ({ agent, showSparkles, onCelebrate }) => {
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
          agent.performance_score > 400
            ? "Gold"
            : agent.performance_score > 300
            ? "Silver"
            : "Bronze"
        }
        style={{
          backgroundColor:
            agent.performance_score > 400
              ? "#FFD700"
              : agent.performance_score > 300
              ? "#C0C0C0"
              : "#cd7f32",
        }}
      />
      {showSparkles && (
        <div className="sparkles">
          <div className="sparkle"></div>
          <div className="sparkle"></div>
          <div className="sparkle"></div>
          <div className="sparkle"></div>
          <div className="sparkle"></div>
        </div>
      )}
      <Button
        type="primary"
        onClick={onCelebrate}
        style={{ marginTop: "10px", backgroundColor: "green" }}
      >
        Celebrate Top Performer
      </Button>
    </div>
  );
};
export default TopPerformerCard;

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
  /* background: #fff; */

  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
  font-size: 14px; /* Reduced font size */
}
.ant-table th {
  background-color: #00008b;
  color: white;
  font-size: 25px; /* Reduced font size */
  font-weight: bold;
  padding: 8px; /* Adjusted padding */
  border: 1px solid #ddd; /* Added border */
}
.ant-table td {
  padding: 8px; /* Adjusted padding */
  font-size: 14px; /* Reduced font size */
  background-color: #f6f6f6;
  border-bottom: 2px solid #ddd; /* Added bottom border */
  height: 50px; /* Set height for rows */
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
  height: 70%;
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
  top: 35%;
  left: 50%;
  transform: translate(-50%, -50%);
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
