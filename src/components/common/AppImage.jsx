import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { getFullImageUrl } from '../../utils/imageUtils';

/**
 * AppImage - A reusable image component that handles URL transformation and fallbacks
 * 
 * @param {Object} props
 * @param {string} props.src - The image source URL (can be relative or absolute)
 * @param {string} props.alt - Alt text for the image
 * @param {string} props.fallbackSrc - Optional fallback image source
 * @param {Object} props.sx - MUI sx prop for styling
 * @param {string} props.component - Component to render (img, div, etc.)
 * @param {Function} props.onError - Optional error handler
 * @param {Function} props.onLoad - Optional load handler
 * @param {Object} props.imgProps - Additional props to pass to the img element
 */
const AppImage = ({
  src,
  alt = 'Image',
  fallbackSrc = '/assets/default-food.png',
  sx = {},
  component = 'img',
  onError,
  onLoad,
  imgProps = {},
  ...rest
}) => {
  const [imgSrc, setImgSrc] = useState(null);
  const [hasError, setHasError] = useState(false);
  
  // Process the src when it changes
  useEffect(() => {
    if (!src) {
      setImgSrc(fallbackSrc);
      return;
    }
    
    try {
      // Check for different image properties, prioritizing imageUrl (fixed casing)
      const rawSrc = (typeof src === 'object' && src !== null) 
        ? (src.imageUrl || src.image || src.imagePath || src.src || src.imageURL)
        : src;
        
      // Transform the URL using our utility
      const processedSrc = getFullImageUrl(rawSrc);
      setImgSrc(processedSrc || fallbackSrc);
      setHasError(false);
    } catch (err) {
      setImgSrc(fallbackSrc);
      setHasError(true);
    }
  }, [src, fallbackSrc]);

  const handleError = (e) => {
    setHasError(true);
    setImgSrc(fallbackSrc);
    if (onError) onError(e);
  };

  const handleLoad = (e) => {
    if (onLoad) onLoad(e);
  };

  // If component is img, return an img element
  if (component === 'img') {
    return (
      <Box
        component="img"
        src={hasError ? fallbackSrc : (imgSrc || fallbackSrc)}
        alt={alt}
        onError={handleError}
        onLoad={handleLoad}
        sx={{
          objectFit: 'cover',
          ...sx
        }}
        {...imgProps}
        {...rest}
      />
    );
  }

  // Otherwise, return a Box with backgroundImage
  return (
    <Box
      sx={{
        backgroundImage: `url(${hasError ? fallbackSrc : (imgSrc || fallbackSrc)})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        ...sx
      }}
      {...rest}
    />
  );
};

export default AppImage;
