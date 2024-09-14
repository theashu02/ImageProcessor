import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ImageContextType {
  image: string | null;
  setImage: (image: string | null) => void;
  preview: string | null;
  setPreview: (preview: string | null) => void;
  download: string | null;
  setDownload: (download: string | null) => void;
}

const ImageContext = createContext<ImageContextType | undefined>(undefined);

export const ImageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [image, setImage] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [download, setDownload] = useState<string | null>(null);

  return (
    <ImageContext.Provider value={{ image, setImage, preview, setPreview, download, setDownload }}>
      {children}
    </ImageContext.Provider>
  );
};

export const useImageContext = (): ImageContextType => {
  const context = useContext(ImageContext);
  if (context === undefined) {
    throw new Error('useImageContext must be used within an ImageProvider');
  }
  return context;
};
