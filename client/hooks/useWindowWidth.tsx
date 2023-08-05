import { useEffect, useState } from 'react';

function useWindowWidth() {
  const hasWindow = typeof window !== 'undefined';
  const [windowWidth, setWindowWidth] = useState(
    hasWindow ? window.innerWidth : 0,
  );

  useEffect(() => {
    const handleResize = () =>
      setWindowWidth(hasWindow ? window.innerWidth : 0);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [hasWindow]);
  return windowWidth;
}

export default useWindowWidth;
