// import React, { useState } from "react";
// import axios from "axios";
// const MainComponent = () => {
//   const [searchQuery, setSearchQuery] = useState(
//     "bd16d991-11c8-4d1e-9900-edd5ed4a9b21"
//   );
//   const [components, setComponents] = useState([]);
//   const [selectedComponent, setSelectedComponent] = useState(null);
//   const [responseData, setResponseData] = useState(null);
//   const [selectedName, setSelectedName] = useState(null);
//   const [availableTags, setAvailableTags] = useState([]);
//   const [selectedTag, setSelectedTag] = useState(null);
//   const handleSearchInputChange = (event) => {
//     setSearchQuery(event.target.value);
//   };
//   const handleFetchClick = () => {
//     const apiComponents =
//       "https://guixfoyppb.execute-api.us-east-1.amazonaws.com/tagging/";
//     axios
//       .post(apiComponents, { intent: "agents" })
//       .then((response) => {
//         setComponents(Object.keys(response.data));
//         setResponseData(response.data);
//       })
//       .catch((error) => {
//         console.error("Error fetching components:", error);
//       });
//   };
//   const fetchTagsForARN = (arn) => {
//     const api = "https://l78y00q47e.execute-api.us-east-1.amazonaws.com/test/";
//     axios
//       .post(api, { arn: arn })
//       .then((response) => {
//         // const apiTags =
//         //   "https://178y00q47e.execute-api.us-east-1.amazonaws.com/test/";
//         // // https://l78y00q47e.execute-api.us-east-1.amazonaws.com/test/
//         // axios
//         //   .post(apiTags, { arn: arn })
//         //   .then((response) => {
//         console.log(response);
//         setAvailableTags(response.data);
//       })
//       .catch((error) => {
//         console.error("Error fetching tags:", error);
//       });
//   };
//   const handleComponentSelect = (component) => {
//     setSelectedComponent(component);
//     setSelectedName(null);
//     // const arn = responseData[component][0].Arn;
//   };
//   const handleNameSelect = (name) => {
//     fetchTagsForARN(name);
//     setSelectedName(name);
//   };
//   const handleTagSelect = (tag) => {
//     setSelectedTag(tag);
//   };
//   return (
//     <div>
//       <div style={{ marginBottom: "20px" }}>
//         <h2 style={{ marginBottom: "20px" }}>Search Component</h2>
//         <div style={{ display: "flex", alignItems: "center" }}>
//           <select
//             value={searchQuery}
//             onChange={handleSearchInputChange}
//             style={{
//               width: "400px",
//               marginRight: "10px",
//               marginLeft: "400px",
//               padding: "8px",
//               border: "1px solid #ccc",
//               borderRadius: "5px",
//               fontSize: "16px",
//             }}
//           >
//             <option value="bd16d991-11c8-4d1e-9900-edd5ed4a9b21">
//               bd16d991-11c8-4d1e-9900-edd5ed4a9b21
//             </option>
//           </select>
//           <button
//             onClick={handleFetchClick}
//             style={{
//               padding: "10px 20px",
//               backgroundColor: "#007bff",
//               color: "#fff",
//               border: "none",
//               borderRadius: "5px",
//               cursor: "pointer",
//               fontSize: "16px",
//             }}
//           >
//             Fetch
//           </button>
//         </div>
//       </div>
//       <div style={{ display: "flex", padding: "20px" }}>
//         <div
//           style={{
//             flex: "1",
//             marginRight: "20px",
//             backgroundColor: "#D3D3D3",
//             borderRadius: "10px",
//             boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
//             padding: "20px",
//           }}
//         >
//           <h2 style={{ marginBottom: "20px", fontSize: "20px" }}>Components</h2>
//           <select
//             value={selectedComponent}
//             onChange={(event) => handleComponentSelect(event.target.value)}
//             style={{
//               width: "100%",
//               padding: "8px",
//               border: "1px solid #ccc",
//               borderRadius: "5px",
//               fontSize: "16px",
//             }}
//           >
//             <option value="">Select a component</option>
//             {components.map((component, index) => (
//               <option key={index} value={component}>
//                 {component}
//               </option>
//             ))}
//           </select>
//         </div>
//         <div
//           style={{
//             flex: "1",
//             backgroundColor: "#D3D3D3",
//             borderRadius: "10px",
//             boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
//             padding: "20px",
//           }}
//         >
//           <h2 style={{ marginBottom: "20px", fontSize: "20px" }}>
//             Component Names
//           </h2>
//           <select
//             value={selectedName}
//             onChange={(event) => handleNameSelect(event.target.value)}
//             style={{
//               width: "100%",
//               padding: "8px",
//               border: "1px solid #ccc",
//               borderRadius: "5px",
//               fontSize: "16px",
//             }}
//           >
//             <option value="">Select a name</option>
//             {selectedComponent &&
//               responseData[selectedComponent].map((item, index) => (
//                 <option key={index} value={item.Arn}>
//                   {item.Name}
//                 </option>
//               ))}
//           </select>
//         </div>
//       </div>
//       <div
//         style={{
//           marginTop: "20px",
//           width: "610px",
//           backgroundColor: "#D3D3D3",
//           borderRadius: "10px",
//           boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
//           padding: "20px",
//           marginLeft: "20px",
//         }}
//       >
//         <h2 style={{ marginBottom: "20px", fontSize: "20px" }}>
//           Available Tags
//         </h2>
//         <select
//           value={selectedTag}
//           onChange={(event) => handleTagSelect(event.target.value)}
//           style={{
//             width: "100%",
//             padding: "8px",
//             border: "1px solid #ccc",
//             borderRadius: "5px",
//             fontSize: "16px",
//           }}
//         >
//           <option value="">Select a tag</option>
//           {availableTags.map((tag, index) => (
//             <option key={index} value={tag}>
//               {tag}
//             </option>
//           ))}
//         </select>
//       </div>
//     </div>
//   );
// };
// export default MainComponent;

import React, { useState } from "react";
import axios from "axios";
const MainComponent = () => {
  const [searchQuery, setSearchQuery] = useState(
    "bd16d991-11c8-4d1e-9900-edd5ed4a9b21"
  );
  const [components, setComponents] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const [selectedName, setSelectedName] = useState(null);
  const [availableTags, setAvailableTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState(null);
  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };
  const handleFetchClick = () => {
    const apiComponents =
      "https://guixfoyppb.execute-api.us-east-1.amazonaws.com/tagging/";
    axios
      .post(apiComponents, { intent: "agents" })
      .then((response) => {
        setComponents(Object.keys(response.data));
        setResponseData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching components:", error);
      });
  };
  const fetchTagsForARN = (arn) => {
    const api = "https://l78y00q47e.execute-api.us-east-1.amazonaws.com/test/";
    axios
      .post(api, { arn: arn })
      .then((response) => {
        console.log(response.data);
        const tagsArray = Object.entries(response.data);
        setAvailableTags(tagsArray);
      })
      .catch((error) => {
        console.error("Error fetching tags:", error);
      });
  };
  const handleComponentSelect = (component) => {
    setSelectedComponent(component);
    setSelectedName(null);
  };
  const handleNameSelect = (name) => {
    fetchTagsForARN(name);
    setSelectedName(name);
  };
  const handleTagSelect = (tag) => {
    setSelectedTag(tag);
  };
  return (
    <div>
      <div style={{ marginBottom: "20px" }}>
        <h2 style={{ marginBottom: "20px" }}>Search Component</h2>
        <div style={{ display: "flex", alignItems: "center" }}>
          <select
            value={searchQuery}
            onChange={handleSearchInputChange}
            style={{
              width: "400px",
              marginRight: "10px",
              marginLeft: "400px",
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "5px",
              fontSize: "16px",
            }}
          >
            <option value="bd16d991-11c8-4d1e-9900-edd5ed4a9b21">
              bd16d991-11c8-4d1e-9900-edd5ed4a9b21
            </option>
          </select>
          <button
            onClick={handleFetchClick}
            style={{
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            Fetch
          </button>
        </div>
      </div>
      <div style={{ display: "flex", padding: "20px" }}>
        <div
          style={{
            flex: "1",
            marginRight: "20px",
            backgroundColor: "#D3D3D3",
            borderRadius: "10px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
            padding: "20px",
          }}
        >
          <h2 style={{ marginBottom: "20px", fontSize: "20px" }}>Components</h2>
          <select
            value={selectedComponent}
            onChange={(event) => handleComponentSelect(event.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "5px",
              fontSize: "16px",
            }}
          >
            <option value="">Select a component</option>
            {components.map((component, index) => (
              <option key={index} value={component}>
                {component}
              </option>
            ))}
          </select>
        </div>
        <div
          style={{
            flex: "1",
            backgroundColor: "#D3D3D3",
            borderRadius: "10px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
            padding: "20px",
          }}
        >
          <h2 style={{ marginBottom: "20px", fontSize: "20px" }}>
            Component Names
          </h2>
          <select
            value={selectedName}
            onChange={(event) => handleNameSelect(event.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "5px",
              fontSize: "16px",
            }}
          >
            <option value="">Select a name</option>
            {selectedComponent &&
              responseData[selectedComponent]?.map((item, index) => (
                <option key={index} value={item.Arn}>
                  {item.Name}
                </option>
              ))}
          </select>
        </div>
      </div>
      <div
        style={{
          marginTop: "20px",
          width: "610px",
          backgroundColor: "#D3D3D3",
          borderRadius: "10px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          padding: "20px",
          marginLeft: "20px",
        }}
      >
        <h2 style={{ marginBottom: "20px", fontSize: "20px" }}>
          Available Tags
        </h2>
        <select
          value={selectedTag}
          onChange={(event) => handleTagSelect(event.target.value)}
          style={{
            width: "100%",
            padding: "8px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            fontSize: "16px",
          }}
        >
          <option value="">Select a tag</option>
          {availableTags.map(([key, value], index) => (
            <option key={index} value={value}>
              {key}: {value}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
export default MainComponent;
