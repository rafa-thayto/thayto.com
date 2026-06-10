import React from 'react'

// Strip next/image-only props so they don't leak onto the DOM <img> and trigger
// React "non-boolean attribute" warnings in tests (e.g. `unoptimized`).
const Image = ({
  src,
  alt,
  unoptimized,
  fill,
  priority,
  placeholder,
  blurDataURL,
  loader,
  quality,
  ...props
}: any) => {
  return <img src={src} alt={alt} {...props} />
}

export default Image
