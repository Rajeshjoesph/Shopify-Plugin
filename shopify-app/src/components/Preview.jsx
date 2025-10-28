import React, { useState } from 'react';
import { AppProvider, Card, Button, TextField, Select, Tooltip, Icon } from '@shopify/polaris';
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin } from 'react-icons/fa';
import { DeleteIcon } from '@shopify/polaris-icons';
// import { AppProvider } from "@shopify/polaris";


const Preview = () => {
      const [socialIcons, setSocialIcons] = useState([
        { id: 1, name: 'Facebook', link: 'https://facebook.com', tooltip: 'Visit Facebook', clicks: 0 },
      ]);
  const [selectedPosition, setSelectedPosition] = useState('left');
        const handleClickIcon = (id) => {
    setSocialIcons(socialIcons.map(icon =>
      icon.id === id ? { ...icon, clicks: icon.clicks + 1 } : icon
    ));
  };
  const availableIcons = {
    Facebook: <FaFacebook />,
    Instagram: <FaInstagram />,
    Twitter: <FaTwitter />,
    LinkedIn: <FaLinkedin />
  };
  return (
    // <AppProvider>
      <div style={{ flex: 1, position: "relative" }}>
        <h2 style={{ textAlign: "center", marginTop: 20 }}>Live Preview</h2>

        <div
          style={{
            position: "absolute",
            display: "flex",
            flexDirection:
              selectedPosition === "top" || selectedPosition === "bottom"
                ? "row"
                : "column",
            top:
              selectedPosition === "top"
                ? "10px"
                : selectedPosition === "bottom"
                ? "auto"
                : "50%",
            bottom: selectedPosition === "bottom" ? "10px" : "auto",
            left:
              selectedPosition === "left"
                ? "10px"
                : selectedPosition === "right"
                ? "auto"
                : "50%",
            right: selectedPosition === "right" ? "10px" : "auto",
            transform:
              selectedPosition === "left" || selectedPosition === "right"
                ? "translateY(-50%)"
                : "translateX(-50%)",
            gap: 15,
          }}
        >
          {socialIcons.map((icon) => (
            <Tooltip
              key={icon.id}
              content={`${icon.tooltip} (${icon.clicks} clicks)`}
            >
              <div
                onClick={() => handleClickIcon(icon.id)}
                style={{
                  cursor: "pointer",
                  background: "#fff",
                  borderRadius: "50%",
                  padding: 10,
                  boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                  transition: "0.2s",
                }}
              >
                <a
                  href={icon.link}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "#000", fontSize: 24 }}
                >
                  {availableIcons[icon.name]}
                </a>
              </div>
            </Tooltip>
          ))}
        </div>
      </div>
    // </AppProvider>
  );
};


export default Preview