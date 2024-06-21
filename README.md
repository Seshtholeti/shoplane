import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
function Header({ onLogout }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isHovered, setIsHovered] = useState(false);
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  const headerStyle = {
    color: "white",
    backgroundColor: "#800080",
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
    return `${day}/${month}/${year}`; // Changed date format to use slashes
  };
  const formatTime = (date) => {
    return date.toLocaleTimeString("en-GB"); // en-GB locale for 24-hour format
  };
  const iconContainerStyle = {
    display: "flex",
    alignItems: "center",
  };
  const iconStyle = {
    marginLeft: "20px",
    fontSize: "30px",
    color: "white",
    cursor: "pointer",
  };
  const logoutTextStyle = {
    fontSize: "10px",
    marginLeft: "5px", // Adjusted margin to separate from the icon
    visibility: isHovered ? "visible" : "hidden", // Toggle visibility based on hover state
  };
  return (
    <div style={headerStyle}>
      <div style={{ paddingLeft: "60px", paddingBottom: "5px" }}>
        Wallboard-UK
      </div>
      <div style={iconContainerStyle}>
        <div>
          {formatDate(currentTime)}&nbsp;&nbsp;{formatTime(currentTime)}
        </div>
        <div
          style={logoutTextStyle}
          onMouseOver={() => setIsHovered(true)}
          onMouseOut={() => setIsHovered(false)}
          onClick={onLogout}
        >
          Logout
        </div>
        <FontAwesomeIcon
          icon={faSignOutAlt}
          style={iconStyle}
          onMouseOver={() => setIsHovered(true)}
          onMouseOut={() => setIsHovered(false)}
          onClick={onLogout}
        />
      </div>
    </div>
  );
}
export default Header;


this is my uk,
import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
function Header({ onLogout }) {
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
  const iconStyle = {
    marginLeft: "20px",
    fontSize: "30px",
    color: "white",
    cursor: "pointer",
  };
  const iconHoverStyle = {
    color: "#c9302c",
  };
  return (
    <div style={headerStyle}>
      <div style={{ paddingLeft: "60px", paddingBottom: "5px" }}>
        Wallboard-Germany
      </div>
      <div style={{ paddingRight: "60px", paddingBottom: "5px" }}>
        {formatDate(currentTime)}&nbsp;&nbsp;{formatTime(currentTime)}
        <FontAwesomeIcon
          icon={faSignOutAlt}
          style={iconStyle}
          onMouseOver={(e) =>
            (e.currentTarget.style.color = iconHoverStyle.color)
          }
          onMouseOut={(e) => (e.currentTarget.style.color = iconStyle.color)}
          onClick={onLogout}
        />
      </div>
    </div>
  );
}
export default Header;


this is my germany
