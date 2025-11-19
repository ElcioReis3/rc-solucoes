import { useEffect, useState } from "react";

export function useWhats() {
  const contacts = ["5586998012172", "5586998519292"];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev === 0 ? 1 : 0));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return contacts[index];
}
