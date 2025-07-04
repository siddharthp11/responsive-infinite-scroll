import { useEffect, useState, type InputHTMLAttributes } from "react";

interface DebouncedInputProp extends InputHTMLAttributes<HTMLInputElement> {
  onDebounceEnd: (value: string) => void;
  delay: number;
}
export function DebouncedInput({
  onDebounceEnd,
  delay,
  ...props
}: DebouncedInputProp) {
  const [value, setValue] = useState("");
  useEffect(() => {
    const onTimeout = setTimeout(() => {
      onDebounceEnd(value);
    }, delay);
    return () => clearTimeout(onTimeout);
  }, [value, delay, onDebounceEnd]);
  return (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      {...props}
    />
  );
}
