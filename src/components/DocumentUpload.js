"use client";

import { useState, useRef } from "react";
import { uploadDocument } from "@/lib/api";

export default function DocumentUpload({ userId = "guest", onUploadSuccess }) {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const fileInputRef = useRef(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage("");

    try {
      const result = await uploadDocument(file, userId);
      setMessage(result.message || "Document uploaded successfully!");
      
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Notify parent component if callback provided
      if (onUploadSuccess) {
        onUploadSuccess(result);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="document-upload">
      <div className="upload-section">
        <label
          htmlFor="file-upload"
          className="upload-button"
          style={{
            display: "inline-block",
            padding: "10px 20px",
            backgroundColor: uploading ? "#ccc" : "#00B383",
            color: "white",
            borderRadius: "8px",
            cursor: uploading ? "not-allowed" : "pointer",
            transition: "background-color 0.2s",
            fontSize: "14px",
            fontWeight: "500",
          }}
        >
          {uploading ? "Uploading..." : "📄 Upload Document"}
        </label>
        <input
          id="file-upload"
          ref={fileInputRef}
          type="file"
          accept=".txt,.pdf,.doc,.docx,.md"
          onChange={handleFileChange}
          disabled={uploading}
          style={{ display: "none" }}
        />
      </div>
      
      {message && (
        <div
          className="upload-message"
          style={{
            marginTop: "10px",
            padding: "8px 12px",
            borderRadius: "6px",
            fontSize: "13px",
            backgroundColor: message.startsWith("Error") ? "#ffebee" : "#e8f5e9",
            color: message.startsWith("Error") ? "#c62828" : "#2e7d32",
          }}
        >
          {message}
        </div>
      )}
      
      <div
        className="upload-info"
        style={{
          marginTop: "8px",
          fontSize: "12px",
          color: "#666",
        }}
      >
        Supported formats: TXT, PDF, DOC, DOCX, MD
      </div>
    </div>
  );
}
