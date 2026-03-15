import { useEffect, useState } from "react";

const useDebounceTechnique = <T>(
  value: T,
  delay: number
): [T, (val?: T) => void] => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  const flush = (val?: T) => setDebouncedValue(val ?? value);

  return [debouncedValue, flush];
};

export default useDebounceTechnique;
