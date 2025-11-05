import React, { useState, useEffect } from "react";
import {
  AppProvider,
  Card,
  Button,
  TextField,
  Select,
  Tooltip,
  Modal,
  Layout,
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
import axios from "axios";

const API_BASE = "http://localhost:8000/";

// 🧩 Available social media icons
const availableIcons = {
  Facebook: <FaFacebook />,
  Instagram: <FaInstagram />,
  Twitter: <FaTwitter />,
  LinkedIn: <FaLinkedin />,
  Threads: <FaThreads />,
  Pinterest: <FaPinterestP />,
};

const AddSocialIcon = () => {
  const token = localStorage.getItem("authToken");
  const [socialIcons, setSocialIcons] = useState([]);
  const [editIcon, setEditIcon] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 🧭 Fetch icons from backend
  const fetchIcons = async () => {
    try {
      const { data } = await axios.get(`${API_BASE}userAction/getAllSocialIcons`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const sorted = (data.data || []).sort(
        (a, b) => (a.display_order || 0) - (b.display_order || 0)
      );
      setSocialIcons(sorted);
    } catch (err) {
      console.error("❌ Error fetching icons:", err);
    }
  };

  useEffect(() => {
    fetchIcons();
  }, []);

  // 💾 Save or Update Icon
  const handleSaveEdit = async () => {
    try {
      if (editIcon && editIcon._id) {
        // 🛠 Edit existing icon (use PUT)
        const { data } = await axios.put(
          `${API_BASE}userAction/updateSocialIcon?platformName=${editIcon.platform}`,
          editIcon,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const updatedIcon = data?.data || editIcon;
        setSocialIcons((prev) =>
          prev.map((icon) =>
            icon._id === updatedIcon._id ? updatedIcon : icon
          )
        );
      } else {
        // ➕ Add new icon (use POST)
        const { data } = await axios.post(
          `${API_BASE}userAction/action`,
          editIcon,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const createdIcon = data?.data || data;
        setSocialIcons((prev) => [...prev, createdIcon]);
      }

      setIsModalOpen(false);
    } catch (err) {
      console.error("❌ Error saving/editing icon:", err);
    }
  };

  // 🗑 Deactivate (Delete)
  const handleDelete = async (id, platform) => {
    try {
      await axios.put(
        `${API_BASE}userAction/updateSocialIcon?platformName=${platform}`,
        { is_active: false },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSocialIcons((prev) => prev.filter((icon) => icon._id !== id));
    } catch (err) {
      console.error("❌ Error deleting icon:", err);
    }
  };

  // 🖱 Click tracking
  const handleClickIcon = (id) => {
    setSocialIcons((prev) =>
      prev.map((icon) =>
        icon._id === id
          ? { ...icon, clicks: (icon.clicks || 0) + 1 }
          : icon
      )
    );
  };

  // 🔁 Drag reorder logic
  const handleOnDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(socialIcons);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);

    const updated = items.map((item, index) => ({
      ...item,
      display_order: index + 1,
    }));

    setSocialIcons(updated);

    // Update backend order
    try {
      await axios.put(
        `${API_BASE}userAction/updateSocialIcon?platformName=${reordered.platform}`,
        {
          icons: updated.map((i) => ({
            id: i._id,
            display_order: i.display_order,
          })),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("✅ Order updated successfully");
    } catch (err) {
      console.error("❌ Error updating order:", err);
    }
  };

  return (
    <AppProvider>
      <div
        style={{
          display: "flex",
          height: "100vh",
          background: "#f6f6f7",
        }}
      >
        {/* LEFT PANEL */}
        <div
          style={{
            width: "35%",
            padding: "20px",
            background: "#fff",
            borderRight: "1px solid #ddd",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Layout.Section oneThird>
            <Card sectioned>
              {/* Header */}
              <div
                style={{
                  display: "flex",
                  borderBottom: "1px solid #e5e7eb",
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    flex: 1,
                    padding: "8px 12px",
                    textAlign: "center",
                    borderBottom: "3px solid #4ADE80",
                    fontWeight: 600,
                    color: "#111827",
                    background: "#F0FDF4",
                    borderTopLeftRadius: 8,
                  }}
                >
                  Behaviour{" "}
                  <span
                    style={{
                      background: "#4ADE80",
                      color: "#fff",
                      borderRadius: 12,
                      padding: "0 8px",
                      fontSize: 12,
                      marginLeft: 4,
                    }}
                  >
                    {socialIcons.filter((i) => i.is_active).length}
                  </span>
                </div>
                <div
                  style={{
                    flex: 1,
                    padding: "8px 12px",
                    textAlign: "center",
                    fontWeight: 500,
                    color: "#9CA3AF",
                    cursor: "pointer",
                    borderTopRightRadius: 8,
                  }}
                >
                  Design
                </div>
              </div>

              {/* ICON LIST with DragDropContext */}
              <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId="iconsList">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 12,
                      }}
                    >
                      {socialIcons
                        .filter((i) => i.is_active)
                        .map((icon, index) => (
                          <Draggable
                            key={icon._id}
                            draggableId={icon._id}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  padding: "10px 14px",
                                  background: "#fff",
                                  borderRadius: 12,
                                  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                                  border: "1px solid #f3f4f6",
                                  ...provided.draggableProps.style,
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 10,
                                  }}
                                >
                                  <span
                                    style={{
                                      cursor: "grab",
                                      fontSize: 18,
                                      color: "#9CA3AF",
                                    }}
                                  >
                                    ⋮⋮
                                  </span>
                                  <div
                                    style={{
                                      color: icon.color,
                                      fontSize: 20,
                                    }}
                                  >
                                    {availableIcons[icon.platform]}
                                  </div>
                                  <span style={{ fontWeight: 600 }}>
                                    {icon.platform}
                                  </span>
                                </div>
                                <div style={{ display: "flex", gap: 10 }}>
                                  <Button
                                    plain
                                    icon={EditIcon}
                                    onClick={() => {
                                      setEditIcon(icon);
                                      setIsModalOpen(true);
                                    }}
                                  />
                                  <Button
                                    plain
                                    destructive
                                    icon={DeleteIcon}
                                    onClick={() =>
                                      handleDelete(icon._id, icon.platform)
                                    }
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

              {/* ADD ICON BUTTON */}
              <div
                onClick={() => {
                  setEditIcon({
                    platform: "Facebook",
                    url: "",
                    tooltip: "",
                    color: "#000000",
                    clicks: 0,
                    display_order: socialIcons.length + 1,
                    is_active: true,
                  });
                  setIsModalOpen(true);
                }}
                style={{
                  border: "2px dashed #d1d5db",
                  borderRadius: 12,
                  padding: "12px 0",
                  textAlign: "center",
                  color: "#111827",
                  fontWeight: 500,
                  cursor: "pointer",
                  background: "#fafafa",
                  marginTop: 6,
                }}
              >
                + Add icon
              </div>
            </Card>
          </Layout.Section>
        </div>

        {/* RIGHT PANEL (Preview + Summary) */}
        <Layout.Section>
          {/* Click Summary */}
          <Card sectioned title="Click Summary">
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 20,
                flexWrap: "wrap",
              }}
            >
              {socialIcons
                .filter((i) => i.is_active)
                .sort((a, b) => a.display_order - b.display_order)
                .map((icon) => (
                  <div
                    key={icon._id}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "#fff",
                      borderRadius: 16,
                      boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                      padding: "12px 20px",
                      width: 150,
                      height: 90,
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: 28, color: icon.color }}>
                      {availableIcons[icon.platform]}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "#6b7280",
                        marginTop: 4,
                      }}
                    >
                      Total Clicks
                    </div>
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 18,
                        color: "#111827",
                      }}
                    >
                      {icon.clicks || 0}
                    </div>
                  </div>
                ))}
            </div>
          </Card>

          {/* Live Preview */}
          <Card sectioned>
            <div
              style={{
                position: "relative",
                background: "#fff",
                borderRadius: 12,
                overflow: "hidden",
                boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
              }}
            >
              {/* Browser Header */}
              <div
                style={{
                  background: "#000",
                  color: "#fff",
                  padding: "8px 16px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div style={{ display: "flex", gap: 6, marginRight: 12 }}>
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      background: "#FF605C",
                    }}
                  />
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      background: "#FFBD44",
                    }}
                  />
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      background: "#00CA4E",
                    }}
                  />
                </div>
                <span style={{ fontSize: 14 }}>Live preview</span>
              </div>

              {/* Preview Area */}
              <div
                style={{
                  background: "#f9fafb",
                  textAlign: "center",
                  padding: "60px 20px",
                  minHeight: 420,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 16,
                    flexWrap: "wrap",
                    minHeight: 180,
                  }}
                >
                  {socialIcons
                    .filter((i) => i.is_active)
                    .sort((a, b) => a.display_order - b.display_order)
                    .map((icon) => (
                      <Tooltip key={icon._id} content={icon.tooltip}>
                        <a
                          href={icon.url}
                          target="_blank"
                          rel="noreferrer"
                          onClick={() => handleClickIcon(icon._id)}
                          style={{
                            color: icon.color,
                            fontSize: 28,
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: "#fff",
                            borderRadius: "50%",
                            width: 46,
                            height: 46,
                            boxShadow: "0 0 6px rgba(0,0,0,0.1)",
                          }}
                        >
                          {availableIcons[icon.platform]}
                        </a>
                      </Tooltip>
                    ))}
                </div>
              </div>
            </div>
          </Card>
        </Layout.Section>
      </div>

      {/* ✏️ Edit Modal */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editIcon?._id ? "Edit Social Icon" : "Add Social Icon"}
        primaryAction={{ content: "Save", onAction: handleSaveEdit }}
        secondaryActions={[
          { content: "Cancel", onAction: () => setIsModalOpen(false) },
        ]}
      >
        <Modal.Section>
          {editIcon && (
            <>
              <Select
                label="Platform"
                options={Object.keys(availableIcons).map((name) => ({
                  label: name,
                  value: name,
                }))}
                value={editIcon.platform}
                onChange={(value) =>
                  setEditIcon({ ...editIcon, platform: value })
                }
              />
              <TextField
                label="URL"
                value={editIcon.url}
                onChange={(value) =>
                  setEditIcon({ ...editIcon, url: value })
                }
              />
              <TextField
                label="Tooltip"
                value={editIcon.tooltip}
                onChange={(value) =>
                  setEditIcon({ ...editIcon, tooltip: value })
                }
              />
              <div style={{ marginTop: 10 }}>
                <label style={{ fontWeight: 500 }}>Color</label>
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
};

export default AddSocialIcon;
