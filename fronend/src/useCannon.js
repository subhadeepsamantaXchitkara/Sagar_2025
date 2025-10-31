import { useRef, useEffect, useState, useCallback } from 'react';

// This is a custom hook to help us get the position of the button
export const useCannon = () => {
  const ref = useRef();
  const [props, setProps] = useState({
    origin: { x: 0.5, y: 0.5 }, // Default to center of screen
  });

  const fire = useCallback(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const x = (rect.left + rect.width / 2) / window.innerWidth;
      const y = (rect.top + rect.height / 2) / window.innerHeight;
      setProps({ origin: { x, y } });
    }
  }, []);

  return [{ ref, ...props }, fire];
};