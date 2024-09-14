import React from 'react';
import UploadImage from './assets/UploadImage';
import ImageManipulation from './assets/ImageManipulation';
import DownloadImage from './assets/DownloadImage';
import { ImageProvider } from './context/ImageContext';

const App: React.FC = () => {
  return (
    <ImageProvider>
      <div className="flex flex-col h-screen w-screen">
        <div className="flex h-16 text-blue-100 justify-center items-center">
          <h1 className="font-mono font-bold text-3xl">Image Processing App</h1>
        </div>
        <div className="flex flex-col h-20 justify-center items-center">
          <UploadImage />
        </div>
        <div className="flex flex-row h-2/4 w-screen">
          <ImageManipulation />
        </div>
        <div className="flex flex-row h-1/5 w-screen">
          <DownloadImage />
        </div>
        <div className="flex justify-center items-center text-center mt-6">
          <p className="text-sm text-gray-400">
            © 2024 ImageProcessor. All rights reserved.
          </p>
        </div>
      </div>
    </ImageProvider>
  );
};

export default App;
