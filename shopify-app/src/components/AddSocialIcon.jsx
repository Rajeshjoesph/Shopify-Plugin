import React, { useState } from "react";
import {
  AppProvider,
  Card,
  Button,
  TextField,
  Select,
  Tooltip,
  Modal,
} from "@shopify/polaris";
import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaPinterestP,
} from "react-icons/fa";
import { FaThreads } from "react-icons/fa6";
import { DeleteIcon, EditIcon } from "@shopify/polaris-icons";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

// 🧩 Available social icons
const availableIcons = {
  Facebook: <FaFacebook />,
  Instagram: <FaInstagram />,
  Twitter: <FaTwitter />,
  LinkedIn: <FaLinkedin />,
  Threads: <FaThreads />,
  Pinterest: <FaPinterestP />,
};

function AddSocialIcon() {
  const [socialIcons, setSocialIcons] = useState([
    {
      id: 1,
      name: "Facebook",
      link: "https://facebook.com",
      tooltip: "Visit Facebook",
      color: "#1877F2",
      clicks: 0,
    },
  ]);

  const [selectedPosition, setSelectedPosition] = useState("left");
  const [newIcon, setNewIcon] = useState({
    name: "Facebook",
    link: "",
    tooltip: "",
    color: "#000000",
  });

  const [editIcon, setEditIcon] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ➕ Add icon
  const handleAddIcon = () => {
    if (!newIcon.link.trim()) return;
    setSocialIcons([...socialIcons, { ...newIcon, id: Date.now(), clicks: 0 }]);
    setNewIcon({ name: "Facebook", link: "", tooltip: "", color: "#000000" });
  };

  // 🗑 Delete icon
  const handleDelete = (id) => {
    setSocialIcons(socialIcons.filter((icon) => icon.id !== id));
  };

  // ✏️ Edit icon
  const handleEdit = (icon) => {
    setEditIcon(icon);
    setIsModalOpen(true);
  };

  const handleSaveEdit = () => {
    setSocialIcons(
      socialIcons.map((icon) =>
        icon.id === editIcon.id ? editIcon : icon
      )
    );
    setIsModalOpen(false);
  };

  // 🖱 Count clicks
  const handleClickIcon = (id) => {
    setSocialIcons(
      socialIcons.map((icon) =>
        icon.id === id ? { ...icon, clicks: icon.clicks + 1 } : icon
      )
    );
  };

  // 🔁 Drag & Drop reorder
  const handleOnDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(socialIcons);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setSocialIcons(items);
  };

  // 📍 Position dropdown options
  const positionOptions = [
    { label: "Left", value: "left" },
    { label: "Right", value: "right" },
    { label: "Top", value: "top" },
    { label: "Bottom", value: "bottom" },
    { label: "Bottom Left", value: "bottom-left" },
    { label: "Bottom Right", value: "bottom-right" },
    { label: "Bottom Center", value: "bottom-center" },
  ];

  // 🎯 Dynamic positioning for preview
  const getPositionStyle = (position) => {
    switch (position) {
      case "left":
        return { top: "50%", left: "10px", transform: "translateY(-50%)" };
      case "right":
        return { top: "50%", right: "10px", transform: "translateY(-50%)" };
      case "top":
        return { top: "10px", left: "50%", transform: "translateX(-50%)" };
      case "bottom":
        return { bottom: "10px", left: "50%", transform: "translateX(-50%)" };
      case "bottom-left":
        return { bottom: "10px", left: "10px" };
      case "bottom-right":
        return { bottom: "10px", right: "10px" };
      case "bottom-center":
        return { bottom: "10px", left: "50%", transform: "translateX(-50%)" };
      default:
        return {};
    }
  };

  return (
    <AppProvider>
      <div style={{ display: "flex", height: "100vh", background: "#f6f6f7" }}>
        {/* 🧭 Left Panel */}
        <div
          style={{
            width: "35%",
            padding: "20px",
            background: "#fff",
            borderRight: "1px solid #ddd",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-evenly",
          }}
        >
          {/* Add Social Icon */}
          <Card sectioned>
            <h2 style={{ marginBottom: 10 }}>Add Social Icon</h2>
            <Select
              label="Icon"
              options={Object.keys(availableIcons).map((name) => ({
                label: name,
                value: name,
              }))}
              value={newIcon.name}
              onChange={(value) => setNewIcon({ ...newIcon, name: value })}
            />
            <TextField
              label="Link"
              value={newIcon.link}
              onChange={(value) => setNewIcon({ ...newIcon, link: value })}
            />
            <TextField
              label="Tooltip"
              value={newIcon.tooltip}
              onChange={(value) => setNewIcon({ ...newIcon, tooltip: value })}
            />

            {/* 🎨 Color Picker */}
            <div style={{ marginTop: 10 }}>
              <label style={{ fontWeight: "500" }}>Color</label>
              <input
                type="color"
                value={newIcon.color}
                onChange={(e) =>
                  setNewIcon({ ...newIcon, color: e.target.value })
                }
                style={{
                  width: "100%",
                  height: "40px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  cursor: "pointer",
                }}
              />
            </div>

            <div style={{ marginTop: 10 }}>
              <Button primary onClick={handleAddIcon}>
                Add Icon
              </Button>
            </div>
          </Card>

          {/* 🧩 Icons List */}
          <Card sectioned title="Icons List">
            <DragDropContext onDragEnd={handleOnDragEnd}>
              <Droppable droppableId="socialIcons">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {socialIcons.map((icon, index) => (
                      <Draggable
                        key={icon.id.toString()}
                        draggableId={icon.id.toString()}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              padding: "8px 10px",
                              background: "#fafafa",
                              marginBottom: 6,
                              borderRadius: 6,
                              ...provided.draggableProps.style,
                            }}
                          >
                            <div
                              {...provided.dragHandleProps}
                              style={{
                                cursor: "grab",
                                marginRight: 10,
                                color: "#888",
                                fontSize: "18px",
                              }}
                            >
                              ☰
                            </div>

                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                flex: 1,
                              }}
                            >
                              <span style={{ color: icon.color, fontSize: 20 }}>
                                {availableIcons[icon.name]}
                              </span>
                              <div>
                                <p style={{ margin: 0 }}>{icon.name}</p>
                                <small>{icon.link}</small>
                              </div>
                            </div>

                            <div style={{ display: "flex", gap: 5 }}>
                              <Button
                                icon={EditIcon}
                                onClick={() => handleEdit(icon)}
                              />
                              <Button
                                icon={DeleteIcon}
                                onClick={() => handleDelete(icon.id)}
                              />
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </Card>

          {/* 📊 Click Analytics */}
          <Card sectioned title="Click Analytics">
            {socialIcons.length === 0 ? (
              <p>No clicks recorded yet.</p>
            ) : (
              socialIcons.map((icon) => (
                <div
                  key={icon.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    margin: "6px 0",
                    padding: "6px 10px",
                    background: "#f9fafb",
                    borderRadius: "6px",
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <span style={{ color: icon.color }}>{availableIcons[icon.name]}</span>
                    <span>{icon.name}</span>
                  </div>
                  <strong>{icon.clicks}</strong>
                </div>
              ))
            )}
          </Card>

          {/* Position Selector */}
          <Card sectioned>
            <Select
              label="Position"
              options={positionOptions}
              value={selectedPosition}
              onChange={setSelectedPosition}
            />
          </Card>
        </div>

        {/* 🎨 Right Panel - Live Preview */}
        <div style={{ flex: 1, position: "relative" }}>
          <h2 style={{ textAlign: "center", marginTop: 20 }}>Live Preview</h2>
          <div
            style={{
              position: "absolute",
              display: "flex",
              ...getPositionStyle(selectedPosition),
              gap: 15,
            }}
          >
            {socialIcons.map((icon) => (
              <Tooltip key={icon.id} content={icon.tooltip}>
                <a
                  href={icon.link}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: icon.color, fontSize: 28 }}
                  onClick={() => handleClickIcon(icon.id)}
                >
                  {availableIcons[icon.name]}
                </a>
              </Tooltip>
            ))}
          </div>
        </div>
      </div>

      {/* ✏️ Edit Modal */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Edit Social Icon"
        primaryAction={{
          content: "Save",
          onAction: handleSaveEdit,
        }}
        secondaryActions={[{ content: "Cancel", onAction: () => setIsModalOpen(false) }]}
      >
        <Modal.Section>
          {editIcon && (
            <>
              <Select
                label="Icon"
                options={Object.keys(availableIcons).map((name) => ({
                  label: name,
                  value: name,
                }))}
                value={editIcon.name}
                onChange={(value) => setEditIcon({ ...editIcon, name: value })}
              />
              <TextField
                label="Link"
                value={editIcon.link}
                onChange={(value) => setEditIcon({ ...editIcon, link: value })}
              />
              <TextField
                label="Tooltip"
                value={editIcon.tooltip}
                onChange={(value) => setEditIcon({ ...editIcon, tooltip: value })}
              />
              <div style={{ marginTop: 10 }}>
                <label style={{ fontWeight: "500" }}>Color</label>
                <input
                  type="color"
                  value={editIcon.color}
                  onChange={(e) =>
                    setEditIcon({ ...editIcon, color: e.target.value })
                  }
                  style={{
                    width: "100%",
                    height: "40px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    cursor: "pointer",
                  }}
                />
              </div>
            </>
          )}
        </Modal.Section>
      </Modal>
    </AppProvider>
  );
}

export default AddSocialIcon;
