import React from "react";
import "./App.css";
import Dashboard from "./Dashboard";
import Header from "./Header";
import Footer from "./Footer";
function App() {
  return (
    <div className="App">
      <header>{/* <h1>QuickSight Dashboard</h1> */}</header>
      <main>
        <Header />
        <Dashboard />
        <Footer />
      </main>
    </div>
  );
}
export default App;


this is app.js

// import React, { useEffect, useState } from "react";
// import Header from "./Header";

// const columnStyle = {
//   flex: 1,
//   display: "flex",
//   flexDirection: "column",
//   marginTop: "10px",
//   marginLeft: "10px",
//   gap: "12px",
//   justifyContent: "center",
//   alignItems: "center",
// };

// const containerStyle = {
//   display: "flex",
//   alignItems: "flex-start",
//   color: "#333",
//   padding: "20px",
//   height: "80.9vh",
//   boxSizing: "border-box",
//   overflow: "hidden",
// };
// const imageContainerStyle = {
//   width: "80%",
//   height: "90%",
//   display: "flex",
//   justifyContent: "center",
//   alignItems: "center",
//   borderRadius: "5px",
//   // backgroundColor: "red",
//   marginLeft: "10px",
//   marginTop: "25px",
// };
// const imageStyle = {
//   width: "100%",
//   height: "100%",
//   borderRadius: "5px",
// };
// const dataContainerStyle = {
//   display: "flex",
//   flexDirection: "row",
//   justifyContent: "space-between",
//   width: "100%",
//   height: "90%",
//   // backgroundColor: "red",
//   marginLeft: "10px",
//   marginTop: "20px",
// };

// const cardStyle = {
//   backgroundColor: "#00008B",
//   padding: "8px",
//   borderRadius: "5px",
//   display: "flex",
//   justifyContent: "space-between",
//   alignItems: "center",
//   height: "30px",
//   color: "#fff",
//   fontSize: "16px",
//   width: "200px",
//   transition: "background-color 0.3s ease",
// };
// const hoveredCardStyle = {
//   backgroundColor: "red",
//   color: "white",
//   cursor: "pointer",
// };
// const App = () => {
//   const [data, setData] = useState([]);
//   const [imageUrl, setImageUrl] = useState("");
//   const [hoveredCardIndex, setHoveredCardIndex] = useState(null); // Track hovered state for each card
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch(
//           "https://0ns1q7m4zj.execute-api.eu-west-2.amazonaws.com/de"
//         );
//         const data = await response.json();
//         console.log(data);
//         setData(data.body);
//         setImageUrl(
//           "https://wb-quicksight-html.s3.eu-west-2.amazonaws.com/Whitbread-image.jpg"
//         ); // Replace with the actual URL
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };
//     // Fetch data initially
//     fetchData();
//     // Fetch data every 10 seconds (adjust interval as needed)
//     const interval = setInterval(fetchData, 10000);
//     // Cleanup interval on component unmount
//     return () => clearInterval(interval);
//   }, []);
//   const renderCard = (label, value, index) => (
//     <div
//       key={index}
//       style={{
//         ...cardStyle,
//         ...(hoveredCardIndex === index ? hoveredCardStyle : null),
//       }}
//       onMouseEnter={() => handleMouseEnter(index)}
//       onMouseLeave={() => handleMouseLeave()}
//     >
//       <span>{label}:</span>
//       <span>{value}</span>
//     </div>
//   );
//   const handleMouseEnter = (index) => {
//     setHoveredCardIndex(index);
//   };
//   const handleMouseLeave = () => {
//     setHoveredCardIndex(null);
//   };
//   const renderColumn = (items, department) => (
//     <div style={columnStyle}>
//       {items.map((item, index) =>
//         Object.keys(item.Item).map((key, subIndex) =>
//           renderCard(key, item.Item[key], `${department}-${index}-${subIndex}`)
//         )
//       )}
//     </div>
//   );
//   const queryItems = data.filter((item) => item.Item.DEPARTMENT === "Query");
//   const reservationItems = data.filter(
//     (item) => item.Item.DEPARTMENT === "Reservation"
//   );
//   const groupItems = data.filter((item) => item.Item.DEPARTMENT === "Group");
//   return (
//     <div style={containerStyle}>
//       <div style={imageContainerStyle}>
//         {imageUrl ? (
//           <img src={imageUrl} alt="Uploaded" style={imageStyle} />
//         ) : (
//           <span>Upload Image</span>
//         )}
//       </div>
//       {data.length > 0 && (
//         <div style={dataContainerStyle}>
//           {renderColumn(queryItems, "Query")}
//           {renderColumn(reservationItems, "Reservation")}
//           {renderColumn(groupItems, "Group")}
//         </div>
//       )}
//     </div>
//   );
// };
// export default App;
// import React, { useEffect, useState } from "react";
// import Header from "./Header";
// const columnStyle = {
//   flex: 1,
//   display: "flex",
//   flexDirection: "column",
//   marginTop: "10px",
//   marginLeft: "10px",
//   gap: "12px",
//   justifyContent: "center",
//   alignItems: "center",
// };
// const containerStyle = {
//   display: "flex",
//   alignItems: "flex-start",
//   color: "#333",
//   padding: "20px",
//   height: "80.9vh",
//   boxSizing: "border-box",
//   overflow: "hidden",
// };
// const imageContainerStyle = {
//   width: "80%",
//   height: "90%",
//   display: "flex",
//   justifyContent: "center",
//   alignItems: "center",
//   borderRadius: "5px",
//   marginLeft: "10px",
//   marginTop: "25px",
// };
// const imageStyle = {
//   width: "100%",
//   height: "100%",
//   borderRadius: "5px",
// };
// const dataContainerStyle = {
//   display: "flex",
//   flexDirection: "row",
//   justifyContent: "space-between",
//   width: "100%",
//   height: "90%",
//   marginLeft: "10px",
//   marginTop: "20px",
// };
// const cardStyle = {
//   backgroundColor: "#00008B",
//   padding: "8px",
//   borderRadius: "5px",
//   display: "flex",
//   justifyContent: "space-between",
//   alignItems: "center",
//   height: "30px",
//   color: "#fff",
//   fontSize: "16px",
//   width: "200px",
//   transition: "background-color 0.3s ease",
// };
// const hoveredCardStyle = {
//   backgroundColor: "red",
//   color: "white",
//   cursor: "pointer",
// };
// const App = () => {
//   const [data, setData] = useState([]);
//   const [imageUrl, setImageUrl] = useState("");
//   const [hoveredCardIndex, setHoveredCardIndex] = useState(null);
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch(
//           "https://3c7zirzusl.execute-api.eu-west-2.amazonaws.com/test"
//         );
//         const responseData = await response.json();
//         console.log(responseData);
//         setData(responseData.body.flat());
//         setImageUrl(
//           "https://wb-quicksight-html.s3.eu-west-2.amazonaws.com/Whitbread-image.jpg"
//         );
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };
//     fetchData();
//     const interval = setInterval(fetchData, 10000);
//     return () => clearInterval(interval);
//   }, []);
//   const renderCard = (label, value, index) => (
//     <div
//       key={index}
//       style={{
//         ...cardStyle,
//         ...(hoveredCardIndex === index ? hoveredCardStyle : null),
//       }}
//       onMouseEnter={() => handleMouseEnter(index)}
//       onMouseLeave={() => handleMouseLeave()}
//     >
//       <span>{label}:</span>
//       <span>{value}</span>
//     </div>
//   );
//   const handleMouseEnter = (index) => {
//     setHoveredCardIndex(index);
//   };
//   const handleMouseLeave = () => {
//     setHoveredCardIndex(null);
//   };
//   const renderColumn = (items, department) => {
//     const orderedKeys = [
//       "DEPARTMENT",
//       "CIQ",
//       "LWT",
//       "OFFERED",
//       "ANS",
//       "ANS_RATE",
//       "RDY",
//       "TALK",
//       "NOT_RDY",
//       "ONLINE",
//     ];
//     return (
//       <div style={columnStyle}>
//         {items.map((item, index) => {
//           const orderedItems = orderedKeys.map((key) => ({
//             key,
//             value: item[key],
//           }));
//           return orderedItems.map((orderedItem, subIndex) =>
//             renderCard(
//               orderedItem.key,
//               orderedItem.value,
//               `${department}-${index}-${subIndex}`
//             )
//           );
//         })}
//       </div>
//     );
//   };
//   const queryItems = data.filter((item) => item.DEPARTMENT === "Query");
//   const reservationItems = data.filter(
//     (item) => item.DEPARTMENT === "Reservation"
//   );
//   const groupItems = data.filter((item) => item.DEPARTMENT === "Group");
//   return (
//     <div style={containerStyle}>
//       <div style={imageContainerStyle}>
//         {imageUrl ? (
//           <img src={imageUrl} alt="Uploaded" style={imageStyle} />
//         ) : (
//           <span>Upload Image</span>
//         )}
//       </div>
//       {data.length > 0 && (
//         <div style={dataContainerStyle}>
//           {renderColumn(reservationItems, "Reservation")}
//           {renderColumn(queryItems, "Query")}
//           {renderColumn(groupItems, "Group")}
//         </div>
//       )}
//     </div>
//   );
// };
// export default App;

import React, { useEffect, useState } from "react";
import Header from "./Header";
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
  backgroundColor: "#00008B",
  padding: "8px",
  borderRadius: "5px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  height: "30px",
  color: "#fff",
  fontSize: "16px",
  width: "300px",
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
  const images = [
    "https://wb-quicksight-html.s3.eu-west-2.amazonaws.com/Whitbread-image.jpg",
    "https://cdn.whitbread.co.uk/media/2022/10/Jill-Anderson-Property-Acquisition-Manager-Whitbread_October-2022.jpg-LANDSCAPE-CROPPED-scaled.jpg",
    "https://e3.365dm.com/19/01/768x432/skynews-premier-inn-bradford_4556884.jpg?20190125140608",
    "https://costar.brightspotcdn.com/dims4/default/39fe5b4/2147483647/strip/true/crop/1000x640+0+0/resize/1000x640!/quality/100/?url=http%3A%2F%2Fcostar-brightspot.s3.us-east-1.amazonaws.com%2F86%2F8b%2F3300a001482691cbc9fa712e7b01%2Fpremier-inn-wiesbaden-city-center.jpg",
    "https://cdn.whitbread.co.uk/media/2024/02/Owen-Ellender-Senior-Development-Manager-Whitbread.jpg",
  ];
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://3c7zirzusl.execute-api.eu-west-2.amazonaws.com/test"
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
  }, []);
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
  const queryItems = data.filter((item) => item.DEPARTMENT === "Queries");
  const reservationItems = data.filter(
    (item) => item.DEPARTMENT === "Reservation"
  );
  // const groupItems = data.filter((item) => item.DEPARTMENT === "Group");
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
          {renderColumn(reservationItems, "Reservation")}
          {renderColumn(queryItems, "Query")}
          {/* {renderColumn(groupItems, "Group")} */}
        </div>
      )}
    </div>
  );
};
export default App;



this is dashboard.js

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

this is index.js

import React, { useState, useEffect } from "react";
function Header() {
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  const headerStyle = {
    color: "white",
    backgroundColor: "#00008B",
    padding: "10px",
    height: "50px",
    display: "flex",
    alignItems: "center",
    fontSize: "40px",
    justifyContent: "space-between",
  };

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };
  const formatTime = (date) => {
    return date.toLocaleTimeString("en-GB"); // en-GB locale for 24-hour format
  };
  return (
    <div style={headerStyle}>
      <div style={{ paddingLeft: "60px", paddingBottom: "5px" }}>
        Reservation, Queries and Group
      </div>
      <div style={{ paddingRight: "60px", paddingBottom: "5px" }}>
        {formatDate(currentTime)}&nbsp;&nbsp;{formatTime(currentTime)}
      </div>
    </div>
  );
}
export default Header;




now I have to add azure ad login to this react app
