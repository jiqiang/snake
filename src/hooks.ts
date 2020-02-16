import { useEffect, useRef } from 'react';

export const useInterval = (callback: (() => void), delay: number) => {
  const savedCallback: any = useRef<() => void>();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);


  // Set up the interval.
  useEffect(() => {
    const tick = () => {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
