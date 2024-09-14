import React, { ChangeEvent } from 'react';
import axios from 'axios';
import { useImageContext } from '../context/ImageContext';

interface UploadResponse {
  imageBuffer: string; // Adjust the type based on your actual backend response
}

const UploadImage: React.FC = () => {
  const { setImage, setPreview } = useImageContext();

  const handleUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('image', file);

      try {
        const response = await axios.post<UploadResponse>('http://localhost:5000/api/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        const { imageBuffer } = response.data;
        setImage(imageBuffer);
        setPreview(URL.createObjectURL(file));
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        className="file-input file-input-bordered file-input-secondary w-full max-w-xs"
        onChange={handleUpload}
      />
    </div>
  );
};

export default UploadImage;
