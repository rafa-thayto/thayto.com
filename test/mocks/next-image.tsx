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
  // Marks the element as next/image output so tests can tell it apart from a
  // plain img rendered deliberately by a component.
  return <img src={src} alt={alt} data-next-image="true" {...props} />
}

export default Image
