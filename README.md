import React, { useState } from "react";
import axios from "axios";

const MainComponent = () => {
  const [searchQuery, setSearchQuery] = useState(
    "bd16d991-11c8-4d1e-9900-edd5ed4a9b21"
  );
  const [components, setComponents] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [selectedName, setSelectedName] = useState(null);
  const [names, setNames] = useState([]);

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleFetchClick = async () => {
    const api =
      "https://guixfoyppb.execute-api.us-east-1.amazonaws.com/tagging/";
    axios.post(api, { intent: "all" }).then((response) => {
      console.log(response.data);

      setComponents(response.data)
    });
  };

  const handleClickComponent = (component) => {
    setSelectedComponent(component);

    setNames(Object.values(component));
  };
  const handleSelectName = (name) =>{
    setSelectedName(name);

  }
  };

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#f0f0f0",
        borderRadius: "10px",
        boxShadow: "0 0 10px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ marginBottom: "20px" }}>Search for the Instance</h2>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <select
            value={searchQuery}
            onChange={handleSearchInputChange}
            style={{
              width: "400px",
              marginRight: "10px",
              marginLeft: "430px",
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
        </div>
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
      <div style={{display:'flex', justifyContent:'space-between'}}>
        <div style={{flex:1,padding:'20px', backgroundColor:'#f0f0f0', borderRadius: '10px', boxShadow:'0 0 10px rgba(0, 0, 0, 0.1'}}>
          <h2 style={{marginBottom:'20px'}}>Components</h2>
          <ul>
            {components.map((component, index) => (
            <li key={index} style={{cursor:'pointer', marginBottom: '10px'}} onClick={() => handleClickComponent(component)}>{component.Name}</li>

            ))}
          </ul>
        </div>

      </div>
      <div style={{flex:1,padding:'20px', backgroundColor:'#f0f0f0', borderRadius: '10px', boxShadow:'0 0 10px rgba(0, 0, 0, 0.1'}}>
        <h2 style={{ marginBottom:'20px'}}>Names</h2>
        <select value={selectedName} onChange={(e) => handleSelectName(e.target.value)} 
        style={{width: '100%', padding: '8px', border : '1px solid #ccc', borderRadius: '5px', fontSize:'16px'}}>
          <option value= "">Select a name</option>
          {names.map((name,index) => (
            <option key={index} value={name}>{name}</option>
          ))}

        </select>
      </div>
    </div>
    
  );
          };


export default MainComponent;
