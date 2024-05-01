import ImageViewer from "@/components/custom-ui/image-viewer";
import { cn } from "@/lib/utils";
import React from "react";

const ImageGallery: React.FC<{ urls: string[]; columns?: number }> = ({
  urls,
  columns = 2,
}) => {
  // Function to chunk array into columns
  const chunkArray = (array: string[], size: number): string[][] => {
    const chunkedArr = [];
    for (let i = 0; i < array.length; i += size) {
      chunkedArr.push(array.slice(i, i + size));
    }
    return chunkedArr;
  };

  // Divide attachments into columns (adjust the size for different layouts)
  const splitted = chunkArray(urls, Math.ceil(urls.length / columns));

  return (
    <div
      className={cn(
        "grid gap-4",
        urls.length === 1 ? `grid-cols-1` : "grid-cols-2 md:md:grid-cols-4",
      )}
    >
      {splitted.map((column, columnIndex) => (
        <div key={columnIndex} className="grid gap-4">
          {column.map((image, imageIndex) => (
            <div key={imageIndex} className="w-full">
              <ImageViewer src={image} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ImageGallery;
