import { Icons } from "@/components/icons";
import Image from "next/image";
import React from "react";

interface Props {
  src: string;
}
const ImageViewer: React.FC<Props> = ({ src }) => {
  const [isHovered, setIsHovered] = React.useState<boolean>(false);
  const [isViewerOpen, setIsViewerOpen] = React.useState<boolean>(false);

  const handleImageClick = (): void => {
    setIsViewerOpen(true);
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => {
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
    >
      <Image
        src={src}
        alt=""
        className="h-auto max-h-[400px] max-w-full cursor-pointer rounded-lg" // Add max-height here
        onClick={handleImageClick}
        width={200}
        height={200}
        layout="responsive"
      />
      {isHovered && (
        <a href={src} target="_blank" rel="noreferrer">
          <button
            // onClick={handleDownload}
            className="absolute right-0 top-0 m-2 rounded bg-secondary p-2 text-white"
          >
            <Icons.download />
          </button>
        </a>
      )}
      {isViewerOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={() => {
            setIsViewerOpen(false);
          }}
        >
          <div className="mx-4 my-8">
            {/* Add the desired margin styles here */}
            <Image
              src={src}
              alt="image"
              layout="responsive"
              width={1920}
              height={1080}
              objectFit="contain"
              className="max-h-[80vh] max-w-[80vw]"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageViewer;
