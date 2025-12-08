import React from 'react'

const Image = ({ src, alt, ...props }: any) => {
  return <img src={src} alt={alt} {...props} />
}

export default Image
