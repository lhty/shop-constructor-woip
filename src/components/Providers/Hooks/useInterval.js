import { useEffect, useRef } from "react";

export const useInterval = (callback, delay, reset) => {
  const Callback = useRef();
  const Reset = useRef();

  useEffect(() => {
    Callback.current = callback;
    Reset.current = reset;
  }, [callback, reset]);

  useEffect(() => {
    function tick() {
      Callback.current();
    }
    if (delay !== null || reset !== Reset.current) {
      let id = setInterval(tick, delay * 1000);
      return () => {
        clearInterval(id);
      };
    }
  }, [delay, reset]);
};
