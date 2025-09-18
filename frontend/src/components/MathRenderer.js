import React, { useEffect, useRef } from 'react';

const MathRenderer = ({ content }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    // 在组件挂载后渲染数学公式
    if (window.MathJax && containerRef.current) {
      window.MathJax.typesetPromise([containerRef.current]);
    }
  }, [content]);

  return (
    <div 
      ref={containerRef} 
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};

export default MathRenderer;