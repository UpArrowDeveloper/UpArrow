import styled from "@emotion/styled";
import React, { useEffect, useState } from "react";

export default function FilePreview({ file, url, hasEmptyImage, ...props }) {
  const [imageUrl, setImageUrl] = useState(url);
  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImageUrl(reader.result);
      });
      reader.readAsDataURL(file);
    } else if (!url) {
      setImageUrl();
    }
  }, [file]);

  return (
    <>
      {imageUrl ? (
        <Img src={imageUrl} {...props} />
      ) : hasEmptyImage ? (
        <EmptyImage className="empty-image" {...props} />
      ) : (
        <EmptyImage {...props} />
      )}
    </>
  );
}

const Img = styled.img`
  width: 48rem;
  height: 27rem;

  object-fit: cover;

  &.empty-image {
    background-image: url("/images/profile-upload.jpg");
    background-size: cover;
    background-repeat: no-repeat;
  }
`;

const EmptyImage = styled.div`
  width: 10rem;
  height: 10rem;

  &.empty-image {
    background-image: url("/images/profile-upload.jpg");
    background-size: cover;
    background-repeat: no-repeat;
  }
`;
