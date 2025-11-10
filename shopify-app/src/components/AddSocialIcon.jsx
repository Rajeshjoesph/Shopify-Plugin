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

// available icons map
const availableIcons = {
  Facebook: <FaFacebook />,
  Instagram: <FaInstagram />,
  Twitter: <FaTwitter />,
  LinkedIn: <FaLinkedin />,
  Threads: <FaThreads />,
  Pinterest: <FaPinterestP />,
};

// default global design settings (global to all icons)
const defaultDesignSettings = {
  containerPosition: "bottom-right", // top-left | top-center | top-right | bottom-left | bottom-center | bottom-right
  arrangement: "row", // row | column
  iconSize: 28, // px
  spacing: 12, // px
  borderWidth: 0,
  borderColor: "#E5E7EB",
  borderRadius: 50, // px
  animation: "none", // none | scale | rotate | pulse
  animationDuration: 200, // ms
  iconColorMode: "per-icon", // 'per-icon' or 'global' - screenshot shows "Color" section: this keeps per-icon by default
  globalIconColor: "#111827",
};

const AddSocialIcon = () => {
  const token = localStorage.getItem("authToken");
  const [socialIcons, setSocialIcons] = useState([]);
  const [editIcon, setEditIcon] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clickCounts, setClickCounts] = useState({});
  const [activeTab, setActiveTab] = useState("Design"); // your screenshot shows Design as active by default
  const [design, setDesign] = useState(defaultDesignSettings);
  const [isDesignDirty, setIsDesignDirty] = useState(false);

  // Track which design list section is expanded (to match screenshot style)
  const [expandedSection, setExpandedSection] = useState(null);
  const toggleSection = (key) => setExpandedSection((s) => (s === key ? null : key));

  // --- Backend data operations ---
  const fetchIcons = async () => {
    try {
      const { data } = await axios.get(`${API_BASE}userAction/getAllSocialIcons`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Fetched icons:", data.data);

      const sorted = (data.data.icons || []).sort(
        (a, b) => (a.display_order || 0) - (b.display_order || 0)
      );
      setSocialIcons(sorted);
      if (data && data.data.settings) {
        setDesign((d) => ({ ...d, ...data.data.settings }));
      } else {
        setDesign((d) => ({ ...d })); // keep defaults
      }
    } catch (err) {
      console.error("Error fetching icons:", err);
    }
  };

  // const fetchDesign = async () => {
  //   try {
  //     const { data } = await axios.get(`${API_BASE}userAction/getDesignSettings`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     if (data && data.data) {
  //       setDesign((d) => ({ ...d, ...data.data }));
  //     } else {
  //       setDesign((d) => ({ ...d })); // keep defaults
  //     }
  //   } catch (err) {
  //     console.warn("No design settings from backend, using defaults.", err);
  //   }
  // };

  const countClicks = async () => {
    try {
      const { data } = await axios.get(`${API_BASE}clickAnalytics/click-count`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const formatted = {};
      (data.data || []).forEach((item) => {
        formatted[item.platform] = item.totalClicks;
      });
      setClickCounts(formatted);
    } catch (err) {
      console.error("Error getting click count:", err);
    }
  };

  useEffect(() => {
    fetchIcons();
    // fetchDesign();
    countClicks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save design to backend
  const saveDesignSettings = async () => {
    try {
      await axios.post(`${API_BASE}userAction/postIconStyle`, design, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsDesignDirty(false);
      console.log("Design saved");
    } catch (err) {
      console.error("Error saving design settings:", err);
    }
  };

  // --- Behaviour logic preserved from original code ---
  const handleSaveEdit = async () => {
    try {
      if (editIcon && editIcon._id) {
        const { data } = await axios.put(
          `${API_BASE}userAction/updateSocialIcon?platformName=${editIcon.platform}`,
          editIcon,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const updatedIcon = data?.data || editIcon;
        setSocialIcons((prev) => prev.map((ic) => (ic._id === updatedIcon._id ? updatedIcon : ic)));
      } else {
        const { data } = await axios.post(`${API_BASE}userAction/action`, editIcon, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const createdIcon = data?.data || data;
        setSocialIcons((prev) => [...prev, createdIcon]);
      }
      setIsModalOpen(false);
      setEditIcon(null);
    } catch (err) {
      console.error("Error saving/editing icon:", err);
    }
  };

  const handleDelete = async (id, platform) => {
    try {
      await axios.put(
        `${API_BASE}userAction/updateSocialIcon?platformName=${platform}`,
        { is_active: false },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSocialIcons((prev) => prev.filter((i) => i._id !== id));
    } catch (err) {
      console.error("Error deleting icon:", err);
    }
  };

  const handleClickIcon = async (icon) => {
    setSocialIcons((prev) =>
      prev.map((it) => (it._id === icon._id ? { ...it, clicks: (it.clicks || 0) + 1 } : it))
    );
    setClickCounts((prev) => ({ ...prev, [icon.platform]: (prev[icon.platform] || 0) + 1 }));

    try {
      await fetch(
        `${API_BASE}clickAnalytics/track-click?platform=${icon.platform}&icon_id=${icon._id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ icon_id: icon._id }),
        }
      );
    } catch (err) {
      console.error("Tracking failed", err);
    }
  };

  const handleOnDragEnd = async (result) => {
    if (!result.destination) return;
    const items = Array.from(socialIcons);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);

    const updated = items.map((item, idx) => ({ ...item, display_order: idx + 1 }));
    setSocialIcons(updated);

    try {
      await axios.put(
        `${API_BASE}userAction/reorder`,
        {
          icons: updated.map((i) => ({ id: i._id, platform: i.platform, display_order: i.display_order })),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Error updating order", err);
    }
  };

  // --- Styling/helpers to render "screenshot-like" design panel rows ---
  const listRow = (label, key) => {
    const isOpen = expandedSection === key;
    return (
      <div
        onClick={() => toggleSection(key)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 18px",
          marginBottom: 12,
          borderRadius: 12,
          cursor: "pointer",
          background: isOpen ? "#F0FDF4" : "#fff",
          boxShadow: isOpen ? "0 2px 8px rgba(16, 185, 129, 0.06)" : "0 1px 2px rgba(0,0,0,0.03)",
          border: isOpen ? "1px solid rgba(16,185,129,0.08)" : "1px solid #f3f4f6",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 8, height: 8, borderRadius: 8, background: "transparent" }} />
          <div style={{ fontWeight: 500, color: "#111827" }}>{label}</div>
        </div>
        <div style={{ color: "#9CA3AF", fontWeight: 500 }}>{isOpen ? "▴" : "▾"}</div>
      </div>
    );
  };

  // compute container style for preview positioning
  const computeContainerStyle = () => {
    const base = {
      position: "absolute",
      display: "flex",
      gap: `${design.spacing}px`,
      flexDirection: design.arrangement === "row" ? "row" : "column",
      alignItems: "center",
      justifyContent: "center",
      padding: 8,
      pointerEvents: "auto",
      // avoid overlaying text too much
    };

    const edgePadding = 18;

    switch (design.containerPosition) {
      case "top-left":
        return { ...base, top: edgePadding, left: edgePadding };
      case "top-center":
        return { ...base, top: edgePadding, left: "50%", transform: "translateX(-50%)" };
      case "top-right":
        return { ...base, top: edgePadding, right: edgePadding };
      case "bottom-left":
        return { ...base, bottom: edgePadding, left: edgePadding };
      case "bottom-center":
        return { ...base, bottom: edgePadding, left: "50%", transform: "translateX(-50%)" };
      case "bottom-right":
      default:
        return { ...base, bottom: edgePadding, right: edgePadding };
    }
  };

  const getIconStyle = (icon) => {
    const size = design.iconSize;
    const bw = design.borderWidth;
    const bc = design.borderColor;
    const br = design.borderRadius;
    const color = design.iconColorMode === "global" ? design.globalIconColor : icon.color || "#111827";

    return {
      color,
      fontSize: size,
      width: size + 18,
      height: size + 18,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#fff",
      borderRadius: br,
      border: `${bw}px solid ${bc}`,
      boxShadow: "0 0 6px rgba(0,0,0,0.06)",
      cursor: "pointer",
      transition: `transform ${design.animationDuration}ms ease, box-shadow ${design.animationDuration}ms ease`,
      textDecoration: "none",
    };
  };

  const applyHoverTransform = () => {
    switch (design.animation) {
      case "scale":
        return "scale(1.12)";
      case "rotate":
        return "rotate(12deg)";
      case "pulse":
        return "scale(1.06)";
      default:
        return "none";
    }
  };

  // --- JSX ---
  return (
    <AppProvider>
      <div style={{ display: "flex", height: "100vh", background: "#f6f6f7" }}>
        {/* LEFT PANEL */}
        <div
          style={{
            width: "35%",
            padding: 20,
            background: "#fff",
            borderRight: "1px solid #ddd",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Layout.Section oneThird>
            <Card sectioned>
              {/* Tab header */}
              <div style={{ display: "flex", borderBottom: "1px solid #e5e7eb", marginBottom: 16 }}>
                <div
                  onClick={() => setActiveTab("Behaviour")}
                  style={{
                    flex: 1,
                    padding: "8px 12px",
                    textAlign: "center",
                    borderBottom: activeTab === "Behaviour" ? "3px solid #4ADE80" : "none",
                    fontWeight: activeTab === "Behaviour" ? 600 : 500,
                    color: activeTab === "Behaviour" ? "#111827" : "#9CA3AF",
                    background: activeTab === "Behaviour" ? "#F0FDF4" : "transparent",
                    cursor: "pointer",
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
                  onClick={() => setActiveTab("Design")}
                  style={{
                    flex: 1,
                    padding: "8px 12px",
                    textAlign: "center",
                    borderBottom: activeTab === "Design" ? "3px solid #4ADE80" : "none",
                    fontWeight: activeTab === "Design" ? 600 : 500,
                    color: activeTab === "Design" ? "#111827" : "#9CA3AF",
                    background: activeTab === "Design" ? "#F0FDF4" : "transparent",
                    cursor: "pointer",
                    borderTopRightRadius: 8,
                  }}
                >
                  Design
                </div>
              </div>

              {/* BEHAVIOUR content (unchanged) */}
              {activeTab === "Behaviour" && (
                <>
                  <DragDropContext onDragEnd={handleOnDragEnd}>
                    <Droppable droppableId="iconsList">
                      {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                          {socialIcons
                            .filter((i) => i.is_active)
                            .map((icon, index) => (
                              <Draggable key={icon._id} draggableId={icon._id} index={index}>
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
                                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                      <span style={{ cursor: "grab", fontSize: 18, color: "#9CA3AF" }}>⋮⋮</span>
                                      <div style={{ color: icon.color, fontSize: 20 }}>{availableIcons[icon.platform]}</div>
                                      <span style={{ fontWeight: 600 }}>{icon.platform}</span>
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
                                      <Button plain destructive icon={DeleteIcon} onClick={() => handleDelete(icon._id, icon.platform)} />
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
                </>
              )}

              {/* DESIGN content styled like your screenshot */}
              {activeTab === "Design" && (
                <>
                  {/* Layout row */}
                  {listRow("Layout", "layout")}
                  {expandedSection === "layout" && (
                    <div style={{ padding: "0 6px 12px 6px", marginBottom: 6 }}>
                      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                        <Select
                          label="Container position"
                          value={design.containerPosition}
                          onChange={(v) => {
                            setDesign((d) => ({ ...d, containerPosition: v }));
                            setIsDesignDirty(true);
                          }}
                          options={[
                            { label: "Top left", value: "top-left" },
                            { label: "Top center", value: "top-center" },
                            { label: "Top right", value: "top-right" },
                            { label: "Bottom left", value: "bottom-left" },
                            { label: "Bottom center", value: "bottom-center" },
                            { label: "Bottom right", value: "bottom-right" },
                          ]}
                        />
                        <Select
                          label="Arrangement"
                          value={design.arrangement}
                          onChange={(v) => {
                            setDesign((d) => ({ ...d, arrangement: v }));
                            setIsDesignDirty(true);
                          }}
                          options={[
                            { label: "Row", value: "row" },
                            { label: "Column", value: "column" },
                          ]}
                        />
                      </div>
                    </div>
                  )}

                  {/* Color row */}
                  {listRow("Color", "color")}
                  {expandedSection === "color" && (
                    <div style={{ padding: "0 6px 12px 6px", marginBottom: 6 }}>
                      <div style={{ marginBottom: 8 }}>
                        <div style={{ fontSize: 13, marginBottom: 6, color: "#374151" }}>Icon color mode</div>
                        <Select
                          labelHidden
                          value={design.iconColorMode}
                          onChange={(v) => {
                            setDesign((d) => ({ ...d, iconColorMode: v }));
                            setIsDesignDirty(true);
                          }}
                          options={[
                            { label: "Per icon (use each icon color)", value: "per-icon" },
                            { label: "Global color for all icons", value: "global" },
                          ]}
                        />
                      </div>

                      {design.iconColorMode === "global" && (
                        <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 8 }}>
                          <input
                            type="color"
                            value={design.globalIconColor}
                            onChange={(e) => {
                              setDesign((d) => ({ ...d, globalIconColor: e.target.value }));
                              setIsDesignDirty(true);
                            }}
                            style={{ width: 56, height: 40, borderRadius: 8, border: "1px solid #E5E7EB" }}
                          />
                          <div style={{ color: "#6B7280" }}>{design.globalIconColor}</div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Size row */}
                  {listRow("Size", "size")}
                  {expandedSection === "size" && (
                    <div style={{ padding: "0 6px 12px 6px", marginBottom: 6 }}>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <input
                          type="range"
                          min={16}
                          max={80}
                          value={design.iconSize}
                          onChange={(e) => {
                            setDesign((d) => ({ ...d, iconSize: parseInt(e.target.value, 10) }));
                            setIsDesignDirty(true);
                          }}
                          style={{ flex: 1 }}
                        />
                        <div style={{ width: 56, textAlign: "right", color: "#374151" }}>{design.iconSize}px</div>
                      </div>
                    </div>
                  )}

                  {/* Border row */}
                  {listRow("Border", "border")}
                  {expandedSection === "border" && (
                    <div style={{ padding: "0 6px 12px 6px", marginBottom: 6 }}>
                      <div style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "center" }}>
                        <input
                          type="number"
                          min={0}
                          value={design.borderWidth}
                          onChange={(e) => {
                            setDesign((d) => ({ ...d, borderWidth: parseInt(e.target.value || 0, 10) }));
                            setIsDesignDirty(true);
                          }}
                          style={{ width: 80, padding: 8 }}
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 12, marginBottom: 6, color: "#374151" }}>Border color</div>
                          <input
                            type="color"
                            value={design.borderColor}
                            onChange={(e) => {
                              setDesign((d) => ({ ...d, borderColor: e.target.value }));
                              setIsDesignDirty(true);
                            }}
                            style={{ width: "100%", height: 36, borderRadius: 8, border: "1px solid #E5E7EB" }}
                          />
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <div style={{ fontSize: 12, color: "#374151" }}>Radius</div>
                        <input
                          type="range"
                          min={0}
                          max={64}
                          value={design.borderRadius}
                          onChange={(e) => {
                            setDesign((d) => ({ ...d, borderRadius: parseInt(e.target.value, 10) }));
                            setIsDesignDirty(true);
                          }}
                          style={{ flex: 1 }}
                        />
                        <div style={{ width: 48, textAlign: "right", color: "#374151" }}>{design.borderRadius}px</div>
                      </div>
                    </div>
                  )}

                  {/* Animations row */}
                  {listRow("Animations", "animations")}
                  {expandedSection === "animations" && (
                    <div style={{ padding: "0 6px 12px 6px", marginBottom: 6 }}>
                      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                        <Select
                          labelHidden
                          value={design.animation}
                          onChange={(v) => {
                            setDesign((d) => ({ ...d, animation: v }));
                            setIsDesignDirty(true);
                          }}
                          options={[
                            { label: "None", value: "none" },
                            { label: "Scale", value: "scale" },
                            { label: "Rotate", value: "rotate" },
                            { label: "Pulse", value: "pulse" },
                          ]}
                        />
                        <div style={{ display: "flex", gap: 8, alignItems: "center", marginLeft: 8 }}>
                          <div style={{ fontSize: 12, color: "#374151" }}>Duration</div>
                          <input
                            type="number"
                            min={50}
                            value={design.animationDuration}
                            onChange={(e) => {
                              setDesign((d) => ({ ...d, animationDuration: parseInt(e.target.value || 0, 10) }));
                              setIsDesignDirty(true);
                            }}
                            style={{ width: 84, padding: 8 }}
                          />
                          <div style={{ color: "#6B7280" }}>ms</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Spacing row */}
                  {listRow("Spacing", "spacing")}
                  {expandedSection === "spacing" && (
                    <div style={{ padding: "0 6px 12px 6px", marginBottom: 6 }}>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <input
                          type="range"
                          min={4}
                          max={48}
                          value={design.spacing}
                          onChange={(e) => {
                            setDesign((d) => ({ ...d, spacing: parseInt(e.target.value, 10) }));
                            setIsDesignDirty(true);
                          }}
                          style={{ flex: 1 }}
                        />
                        <div style={{ width: 48, textAlign: "right", color: "#374151" }}>{design.spacing}px</div>
                      </div>
                    </div>
                  )}

                  {/* Save/reset buttons */}
                  <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                    <Button primary onClick={saveDesignSettings} disabled={!isDesignDirty}>
                      Save design
                    </Button>
                    <Button
                      plain
                      onClick={() => {
                        fetchIcons();
                        setIsDesignDirty(false);
                      }}
                    >
                      Reset
                    </Button>
                  </div>
                </>
              )}
            </Card>
          </Layout.Section>
        </div>

        {/* RIGHT PANEL (Preview + Summary) */}
        <Layout.Section style={{ position: "relative", flex: 1 }}>
          {/* Click summary */}
          <Card sectioned title="Click Summary">
            <div style={{ display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap" }}>
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
                    <div style={{ fontSize: 28, color: icon.color }}>{availableIcons[icon.platform]}</div>
                    <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>Total Clicks</div>
                    <div style={{ fontWeight: 700, fontSize: 18, color: "#111827" }}>{clickCounts[icon.platform] || 0}</div>
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
                minHeight: 520,
              }}
            >
              {/* Browser header */}
              <div style={{ background: "#000", color: "#fff", padding: "8px 16px", display: "flex", alignItems: "center" }}>
                <div style={{ display: "flex", gap: 6, marginRight: 12 }}>
                  <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FF605C" }} />
                  <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FFBD44" }} />
                  <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#00CA4E" }} />
                </div>
                <span style={{ fontSize: 14 }}>Live preview</span>
              </div>

              {/* preview content area */}
              <div style={{ background: "#f9fafb", textAlign: "center", padding: "60px 20px", minHeight: 420, position: "relative" }}>
                <div style={{ padding: 16 }}>
                  <h3 style={{ margin: 0, marginBottom: 8 }}>Example content</h3>
                  <p style={{ margin: 0, color: "#6b7280" }}>
                    Social icons appear using the selected design settings. Change Layout / Size / Border / Animations / Spacing from the Design tab to see changes live.
                  </p>
                </div>

                {/* positioned icon container */}
                <div style={computeContainerStyle()}>
                  {socialIcons
                    .filter((i) => i.is_active)
                    .sort((a, b) => a.display_order - b.display_order)
                    .map((icon) => (
                      <Tooltip key={icon._id} content={icon.tooltip}>
                        <a
                          href={icon.url}
                          target="_blank"
                          rel="noreferrer"
                          onClick={() => handleClickIcon(icon)}
                          style={getIconStyle(icon)}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = applyHoverTransform();
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "none";
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

      {/* Edit Modal (behaviour unchanged) */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editIcon?._id ? "Edit Social Icon" : "Add Social Icon"}
        primaryAction={{ content: "Save", onAction: handleSaveEdit }}
        secondaryActions={[{ content: "Cancel", onAction: () => setIsModalOpen(false) }]}
      >
        <Modal.Section>
          {editIcon && (
            <>
              <Select
                label="Platform"
                options={Object.keys(availableIcons).map((name) => ({ label: name, value: name }))}
                value={editIcon.platform}
                onChange={(value) => !editIcon._id && setEditIcon({ ...editIcon, platform: value })}
                disabled={!!editIcon._id}
              />

              <TextField label="URL" value={editIcon.url} onChange={(value) => setEditIcon({ ...editIcon, url: value })} />
              <TextField label="Tooltip" value={editIcon.tooltip} onChange={(value) => setEditIcon({ ...editIcon, tooltip: value })} />

              <div style={{ marginTop: 10 }}>
                <label style={{ fontWeight: 500 }}>Color</label>
                <input
                  type="color"
                  value={editIcon.color}
                  onChange={(e) => setEditIcon({ ...editIcon, color: e.target.value })}
                  style={{ width: "100%", height: 40, borderRadius: 6, border: "1px solid #ccc", cursor: "pointer" }}
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
