import React, { useEffect, useState } from "react";
import Header from "./Header";
// Import the local images
import img1 from "./img/img1.jpg";
import img2 from "./img/img2.jpg";
import img3 from "./img/img3.jpg";
import img4 from "./img/img4.jpeg";
import img5 from "./img/img5.jpg";
import img6 from "./img/img6.jpeg";
const columnStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  marginTop: "10px",
  marginLeft: "10px",
  gap: "12px",
  justifyContent: "center",
  alignItems: "center",
};
const containerStyle = {
  display: "flex",
  alignItems: "flex-start",
  color: "#333",
  padding: "20px",
  height: "80.9vh",
  boxSizing: "border-box",
  overflow: "hidden",
};
const imageContainerStyle = {
  width: "80%",
  height: "90%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "5px",
  marginLeft: "10px",
  marginTop: "25px",
};
const imageStyle = {
  width: "100%",
  height: "100%",
  borderRadius: "5px",
};
const dataContainerStyle = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  width: "100%",
  height: "90%",
  marginLeft: "10px",
  marginTop: "20px",
};
const cardStyle = {
  backgroundColor: "#800080",
  padding: "8px",
  borderRadius: "5px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  height: "30px",
  color: "#fff",
  fontSize: "14px", // Adjusted font size
  width: "220px", // Adjusted width
  transition: "background-color 0.3s ease",
};
const hoveredCardStyle = {
  backgroundColor: "red",
  color: "white",
  cursor: "pointer",
};
const App = () => {
  const [data, setData] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [hoveredCardIndex, setHoveredCardIndex] = useState(null);
  const images = [img1, img2, img3, img4, img5, img6];
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://w4pcvz4yl0.execute-api.eu-west-2.amazonaws.com/PROD"
        );
        const responseData = await response.json();
        console.log(responseData);
        setData(responseData.body.flat());
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    const imageRotationInterval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(imageRotationInterval);
  }, [images.length]);
  const renderCard = (label, value, index) => (
    <div
      key={index}
      style={{
        ...cardStyle,
        ...(hoveredCardIndex === index ? hoveredCardStyle : null),
      }}
      onMouseEnter={() => handleMouseEnter(index)}
      onMouseLeave={() => handleMouseLeave()}
    >
      <span>{label}:</span>
      <span>{value}</span>
    </div>
  );
  const handleMouseEnter = (index) => {
    setHoveredCardIndex(index);
  };
  const handleMouseLeave = () => {
    setHoveredCardIndex(null);
  };
  const renderColumn = (items, department) => {
    const orderedKeys = [
      "DEPARTMENT",
      "CIQ",
      "LWT",
      "OFFERED",
      "ANS",
      "ANS_RATE",
      "RDY",
      "TALK",
      "NOT_RDY",
      "ONLINE",
    ];
    return (
      <div style={columnStyle}>
        {items.map((item, index) => {
          const orderedItems = orderedKeys.map((key) => ({
            key,
            value: item[key],
          }));
          return orderedItems.map((orderedItem, subIndex) =>
            renderCard(
              orderedItem.key,
              orderedItem.value,
              `${department}-${index}-${subIndex}`
            )
          );
        })}
      </div>
    );
  };
  const reservationItems = data.filter(
    (item) => item.DEPARTMENT === "Reservation center"
  );
  const guestRelationsItems = data.filter(
    (item) => item.DEPARTMENT === "Guest Relations"
  );
  const restaurantItems = data.filter(
    (item) => item.DEPARTMENT === "Restaurant"
  );
  return (
    <div style={containerStyle}>
      <div style={imageContainerStyle}>
        {images.length > 0 ? (
          <img
            src={images[currentImageIndex]}
            alt="Carousel"
            style={imageStyle}
          />
        ) : (
          <span>Upload Image</span>
        )}
      </div>
      {data.length > 0 && (
        <div style={dataContainerStyle}>
          {renderColumn(reservationItems, "Reservation center")}
          {renderColumn(guestRelationsItems, "Guest Relations")}
          {renderColumn(restaurantItems, "Restaurant")}
        </div>
      )}
    </div>
  );
};
export default App;
