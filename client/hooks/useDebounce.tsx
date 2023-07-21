import { useEffect, useState } from 'react';

type useDebounceProps = {
  value: any;
  timeout: number;
  callback: () => void;
};

export function useDebounce({ value, timeout, callback }: useDebounceProps) {
  const [timer, setTimer] = useState(null);

  useEffect(() => {
    if (timer) clearTimeout(timer);

    if (value && callback) {
      const newTimer = setTimeout(callback, timeout);
      setTimer(newTimer);
    }
  }, [value]);
}
