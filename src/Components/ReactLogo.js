import React from 'react';
import {StaticImage} from 'gatsby-plugin-image';

export function ReactLogo() {
  return (
    <StaticImage
      src="../images/react-icon.png"
      alt="ReactJS Logo"
      placeholder="blurred"
      layout="fixed"
      width={200}
      height={200}
    />
  );
}

export default ReactLogo;
