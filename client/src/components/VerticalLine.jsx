import React, { useEffect, useState } from 'react';
import '../../styles.css';

const DarkVerticalLine = () => {
    const [lineHeight, setLineHeight] = useState(0);
  
    useEffect(() => {
        const handleScroll = () => {
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.body.clientHeight;
  
        const maxHeight = Math.min(windowHeight, documentHeight);
  
        const newHeight = (scrollPosition / (documentHeight - 500)) * maxHeight;
  
        setLineHeight(newHeight);
      };
  
      window.addEventListener('scroll', handleScroll);
  
      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }, []);
  
    return (
      <div
        id="vertical-line-container"
        className="vertical-line-container"
        style={{ height: `${lineHeight}px` }}
      ></div>
    );
  };
  
  export default DarkVerticalLine;