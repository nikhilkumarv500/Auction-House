import React, { useState } from "react";
import "./ImageUploadComponent.scss";
import ColorExanderMotionbutton from "../ColorExanderMotionbutton/ColorExanderMotionbutton";

export default function ImageUploadComponent({ setImage, className }) {
  const [preview, setPreview] = useState(null);

  const handleFile = (file) => {
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleChange = (e) => {
    const file = e.target.files[0];
    handleFile(file);
  };

  return (
    <div
      className={`image-upload-component-upload-wrapper ${className ? className : ""}`}
    >
      <div className="image-upload-component-tooltip">
        ℹ Uploading image is optional
      </div>

      <label className="image-upload-component-upload-card">
        {preview ? (
          <img
            src={preview}
            alt="preview"
            className="image-upload-component-preview-img"
          />
        ) : (
          <div className="image-upload-component-upload-placeholder">
            <span className="image-upload-component-upload-icon">📷</span>
            <p>Click to upload item image</p>
            <small>JPG / PNG</small>
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="image-upload-component-file-input"
          hidden
        />
      </label>
      {preview && (
        <ColorExanderMotionbutton
          buttonLabel={"Remove Image"}
          onClickFunction={() => {
            setImage(null);
            setPreview(null);
          }}
          className="image-upload-component-image-remove-button"
        />
      )}
    </div>
  );
}
