import React, { useState, useEffect } from "react";
import axios from "axios";
import { useImageContext } from "../context/ImageContext";
import debounce from "lodash/debounce";

const ImageManipulation: React.FC = () => {
  const { image, preview, setPreview, setDownload } = useImageContext();
  const [brightness, setBrightness] = useState<number>(1);
  const [contrast, setContrast] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);

  const processImage = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/process",
        {
          image,
          brightness,
          contrast,
          rotation,
          format: "jpeg",
        },
        {
          headers: { "Content-Type": "application/json" },
          responseType: "blob", // Expect a blob response for image data
        }
      );

      const previewBlob = new Blob([response.data as ArrayBuffer], {
        type: "image/jpeg",
      });
      const previewUrl = URL.createObjectURL(previewBlob);
      setPreview(previewUrl);
      setDownload(previewUrl);
    } catch (error) {
      console.error("Error processing image:", error);
    }
  };

  // Debounce the processImage function to avoid too many API calls
  const debouncedProcessImage = debounce(processImage, 300);

  // Use effects to trigger the API call when brightness, contrast, or rotation changes
  useEffect(() => {
    if (image) {
      debouncedProcessImage();
    }
    return () => {
      debouncedProcessImage.cancel();
    };
  }, [brightness, contrast, debouncedProcessImage, image, rotation]);

  // console.log("previewBlob: ", preview);

  return (
    <div className="flex flex-row w-screen justify-center space-x-60">
      <div className="flex flex-col space-y-3 justify-center items-center">
        <div className="flex flex-row justify-center items-center space-x-3">
          <label className="text-xl font-mono">Brightness</label>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={brightness}
            className="range range-info"
            onChange={(e) => setBrightness(parseFloat(e.target.value))}
          />
        </div>

        <div className="flex flex-row justify-center items-center space-x-3">
          <label className="text-xl font-mono">Contrast</label>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={contrast}
            className="range range-info"
            onChange={(e) => setContrast(parseFloat(e.target.value))}
          />
        </div>

        <div className="flex flex-row justify-center items-center space-x-3">
          <label className="text-xl font-mono">Rotation</label>
          <input
            type="range"
            min={0}
            max="360"
            value={rotation}
            className="range range-info"
            onChange={(e) => setRotation(parseInt(e.target.value))}
          />
        </div>

        {/* <div className="flex justify-center items-center">
          <button className="btn btn-warning" onClick={handleAdjustments}>
            Apply Adjustments
          </button>
        </div> */}
      </div>

      <div className="flex flex-col justify-center items-center space-y-4">
        {preview ? (
          <>
            <div className="font-mono text-blue-100">
              This is processed image
            </div>
            <img className="w-60 h-60" src={preview} alt="Processed Preview" />
          </>
        ) : (
          <>
            <div className="font-mono text-blue-100">Image appears here...</div>
            <div className="w-60 h-60 bg-gray-200" />
          </>
        )}
      </div>
    </div>
  );
};

export default ImageManipulation;
