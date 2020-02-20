import { useEffect, useRef } from 'react';

export const useInterval = (callback: any, delay: number | undefined) => {
  const savedCallback: any = useRef<any>();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);


  // Set up the interval.
  useEffect(() => {
    const tick = () => {
      savedCallback.current();
    }
    let id: any;
    if (delay !== undefined) {
      id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
