// import React, { useEffect, useState } from "react";
// const containerStyle = {
//   display: "flex",
//   alignItems: "flex-start",
//   // backgroundColor: "blue",
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
// };
// const imageStyle = {
//   width: "100%",
//   height: "100%",
//   borderRadius: "5px",
// };
// const dataContainerStyle = {
//   flex: 1,
//   display: "flex",
//   flexDirection: "column",
//   marginTop: "10px",
//   marginLeft: "110px",
//   gap: "12px",
//   height: "90%",
//   justifyContent: "center",
//   alignItems: "center",
// };
// const cardStyle = {
//   backgroundColor: "#800080",
//   padding: "4px",
//   borderRadius: "5px",
//   display: "flex",
//   justifyContent: "space-between",
//   alignItems: "center",
//   height: "30px",
//   color: "#fff",
//   fontSize: "21px",
//   width: "200px",
//   transition: "background-color 0.3s ease",
// };
// const hoveredCardStyle = {
//   backgroundColor: "red",
//   color: "white",
//   pointer: "cursor",
// };
// const App = () => {
//   const [data, setData] = useState(null);
//   const [imageUrl, setImageUrl] = useState("");
//   const [hoveredCards, setHoveredCards] = useState([]); // Track hovered state for each card
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch(
//           "https://1mh8wqhvf7.execute-api.eu-west-2.amazonaws.com/reservation"
//         );
//         const data = await response.json();
//         console.log("seshu", data.body.Item);
//         let filtered = data.body.Item;
//         delete filtered["DEPARTMENT"];
//         console.log(filtered);
//         setData(data.body.Item);
//         console.log("seshu", data.body.Item);
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
//         ...(hoveredCards[index] ? hoveredCardStyle : null),
//       }}
//       onMouseEnter={() => handleMouseEnter(index)}
//       onMouseLeave={() => handleMouseLeave(index)}
//     >
//       <span>{label}:</span>
//       <span>{value}</span>
//     </div>
//   );
//   const handleMouseEnter = (index) => {
//     setHoveredCards((prev) => {
//       const newHoveredCards = [...prev];
//       newHoveredCards[index] = true;
//       return newHoveredCards;
//     });
//   };
//   const handleMouseLeave = (index) => {
//     setHoveredCards((prev) => {
//       const newHoveredCards = [...prev];
//       newHoveredCards[index] = false;
//       return newHoveredCards;
//     });
//   };
//   return (
//     <div style={containerStyle}>
//       <div style={imageContainerStyle}>
//         {imageUrl ? (
//           <img src={imageUrl} alt="Uploaded" style={imageStyle} />
//         ) : (
//           <span>Upload Image</span>
//         )}
//       </div>
//       <div style={dataContainerStyle}>
//         {data &&
//           Object.keys(data).map((key, index) =>
//             renderCard(key, data[key], index)
//           )}
//       </div>
//     </div>
//   );
// };
// export default App;
import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
const containerStyle = {
  display: "flex",
  alignItems: "flex-start",
  backgroundColor: "#cdcdcd",
  color: "#333",
  padding: "20px",
  height: "82vh",
  boxSizing: "border-box",
  overflow: "hidden",
};
const imageContainerStyle = {
  width: "130%",
  height: "100%",
  display: "flex",
  marginLeft: "80px",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: "5px",
};
const imageStyle = {
  width: "160%",
  height: "100%",
  borderRadius: "5px",
};
const dataContainerStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  marginBottom: "10px",
  marginLeft: "90px",
  marginRight: "90px",
  gap: "12px",
  height: "100%",
  justifyContent: "center",
  alignItems: "center",
};
const cardStyle = {
  backgroundColor: "#800080",
  padding: "4px",
  borderRadius: "5px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  height: "30px",
  color: "#fff",
  fontSize: "21px",
  width: "200px",
  transition: "background-color 0.3s ease",
};
const hoveredCardStyle = {
  backgroundColor: "red",
  color: "white",
  pointer: "cursor",
};
const App = () => {
  const [data, setData] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [hoveredCards, setHoveredCards] = useState([]); // Track hovered state for each card
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://1mh8wqhvf7.execute-api.eu-west-2.amazonaws.com/reservation"
        );
        const data = await response.json();
        console.log("seshu", data.body.Item);
        let filtered = data.body.Item;
        delete filtered["DEPARTMENT"];
        console.log(filtered);
        setData(data.body.Item);
        console.log("seshu", data.body.Item);
        setImageUrl(
          "https://wb-quicksight-html.s3.eu-west-2.amazonaws.com/Whitbread-image.jpg"
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    // Fetch data initially
    fetchData();

    const interval = setInterval(fetchData, 10000);

    return () => clearInterval(interval);
  }, []);
  const renderCard = (label, value, index) => (
    <div
      key={index}
      style={{
        ...cardStyle,
        ...(hoveredCards[index] ? hoveredCardStyle : null),
      }}
      onMouseEnter={() => handleMouseEnter(index)}
      onMouseLeave={() => handleMouseLeave(index)}
    >
      <span>{label}:</span>
      <span>{value}</span>
    </div>
  );
  const handleMouseEnter = (index) => {
    setHoveredCards((prev) => {
      const newHoveredCards = [...prev];
      newHoveredCards[index] = true;
      return newHoveredCards;
    });
  };
  const handleMouseLeave = (index) => {
    setHoveredCards((prev) => {
      const newHoveredCards = [...prev];
      newHoveredCards[index] = false;
      return newHoveredCards;
    });
  };
  const guestRels = data ? data.GUEST_RELS : "";
  const resCentre = data ? data.RES_CENTRE : "";
  return (
    <div style={{ height: "88.9vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <div>
        <div style={containerStyle}>
          <div style={imageContainerStyle}>
            {imageUrl ? (
              <img src={imageUrl} alt="Uploaded" style={imageStyle} />
            ) : (
              <span>Upload Image</span>
            )}
          </div>
          <div style={dataContainerStyle}>
            {data &&
              Object.keys(data).map((key, index) =>
                renderCard(key, data[key], index)
              )}
          </div>
        </div>
      </div>
      <Footer guestRels={guestRels} resCentre={resCentre} />
    </div>
  );
};
export default App;


this is my dashboard.js



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
        <Dashboard />
      </main>
    </div>
  );
}
export default App;


this is my app.js


now I want to authenticate whoever accessing this url by amazon connect(ccp) via ad sso url


https://launcher.myapps.microsoft.com/api/signin/414fc211-0fd8-46fa-b949-ea7f993309be?tenantId=e0e80fc4-4c12-4245-8bfd-c06791ad303a

above is ad sso url. sp whenever I open the above react code website, it has to open the amazon ccp and giving valid credentials should navigate to this ui page

