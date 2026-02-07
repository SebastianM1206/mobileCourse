
import { useEffect, useState } from "react";

const CleanUpExample = () => {
  const [segundos, setSegundos] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSegundos((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return <div>Segundos: {segundos}</div>;
};

export default CleanUpExample;
