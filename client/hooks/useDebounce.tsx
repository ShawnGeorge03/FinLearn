import { useEffect, useState } from 'react';

type useDebounceProps = {
  value: any;
  timeout: number;
  callback: () => void;
};

function useDebounce({ value, timeout, callback }: useDebounceProps) {
  const [timer, setTimer] = useState<number>();

  useEffect(() => {
    if (timer) clearTimeout(timer);

    if (value && callback) {
      const newTimer = window.setTimeout(callback, timeout);
      setTimer(newTimer);
    }
  }, [value]);
}

export default useDebounce;
