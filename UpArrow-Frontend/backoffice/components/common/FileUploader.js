import React from "react";
import FilePreview from "../../../components/common/FilePreview";

export const FileUploader = ({
  name,
  file,
  url,
  setImage,
  onChange,
  hasEmptyImage = true,
  previewStyle = {
    width: "10rem",
    height: undefined,
  },
  ...props
}) => {
  return (
    <div
      {...props}
      style={{
        display: "flex",
        flexDirection: "column",
        width: "10rem",
        ...props.style,
      }}
    >
      <label htmlFor={name} style={{ marginBottom: "0.4rem" }}>
        <FilePreview
          file={file}
          url={url}
          hasEmptyImage={hasEmptyImage}
          style={file ? { ...previewStyle } : {}}
        />
      </label>
      <input
        type="file"
        id={name}
        name={name}
        hidden
        onChange={(e) => {
          setImage?.(e.target.files[0]);
          onChange?.(e);
        }}
      />
    </div>
  );
};
