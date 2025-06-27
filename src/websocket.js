export const handleError = (err) => {
    console.error("❌ WebSocket error:", err);
};

export const handleOpen = () => {
    console.log("✅ WebSocket connected");
};

export const handleClost = (e) => {
    console.log("🔌 WebSocket closed:", e.reason);
};

export const handleMessage = (e) => {
    console.log("mesasge received:", e.data);
};

