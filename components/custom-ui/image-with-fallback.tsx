import React, { useState } from 'react';
import Image, { type ImageProps } from 'next/image';

interface ImageWithFallbackProps extends ImageProps {
  fallbackSrc: string;
}

const ImageWithFallback = (props: ImageWithFallbackProps): JSX.Element => {
  const { src, fallbackSrc, alt, ...rest } = props;
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={150}
      height={150}
      priority
      onError={() => {
        setImgSrc(fallbackSrc);
      }}
      {...rest}
    />
  );
};

export default ImageWithFallback;
