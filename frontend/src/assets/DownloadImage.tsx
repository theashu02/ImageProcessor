import React, { useEffect, useState } from "react";
import axios from "axios";
import { useImageContext } from "../context/ImageContext";

const DownloadImage: React.FC = () => {
  const { preview } = useImageContext();
  const [temp, setTemp] = useState<string | null>(null);

  useEffect(() => {
    if (preview) {
      setTemp(preview); // Set the Blob URL directly to temp
    }
  }, [preview]);

  // Function to fetch the blob from Blob URL and convert it to base64
  const blobToBase64 = async (blobUrl: string): Promise<string | ArrayBuffer | null> => {
    const response = await fetch(blobUrl); // Fetch the Blob from the URL
    const blob = await response.blob();    // Convert the response to a Blob object
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result); // Convert Blob to base64
      reader.onerror = reject;
      reader.readAsDataURL(blob); // Read the blob as Data URL (base64)
    });
  };

  const handleDownload = async (format: string) => {
    try {
      if (!temp) {
        console.error("No preview available.");
        return;
      }

      // Convert Blob URL to base64 string
      const base64Image = await blobToBase64(temp); // Convert the blob to base64 string
      if (typeof base64Image !== "string") {
        throw new Error("Failed to convert image to base64.");
      }

      const response = await axios.post(
        "http://localhost:5000/api/download",
        {
          image: base64Image, // Send base64-encoded image data
          format,
        },
        {
          headers: { "Content-Type": "application/json" },
          responseType: "blob",
        }
      );

      // Convert the response to a Blob and trigger the download
      const blob = new Blob([response.data as ArrayBuffer], {
        type: `image/${format}`,
      });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `processed-image.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url); // Clean up the URL object
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  return (
    <>
      <div className="flex flex-row w-screen justify-center space-x-60 items-center">
        <div className="flex flex-col space-y-4">
          <button
            onClick={() => handleDownload("jpeg")}
            className="btn btn-accent p-2 text-black rounded hover:text-blue-700"
          >
            Download as JPEG
          </button>
          <button
            onClick={() => handleDownload("png")}
            className="btn btn-accent p-2 text-black rounded hover:text-blue-700"
          >
            Download as PNG
          </button>
        </div>
        {/* <div className="flex flex-col justify-center items-center space-y-4">
          {preview && (
            <>
              <div>This is the processed image</div>
              <img className="w-44" src={preview} alt="Processed Preview" />
            </>
          )}
        </div> */}
      </div>
    </>
  );
};

export default DownloadImage;
