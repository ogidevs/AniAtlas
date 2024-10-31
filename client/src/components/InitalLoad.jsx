// components/InitialLoad.jsx
import { useState, useEffect } from "react";
import Brand from "./Brand";
import { t } from "i18next";

const InitialLoad = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prevProgress + 1;
      });
    }, 15);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-base-200 skeleton">
      <div className="flex items-center justify-center flex-center my-32">
        <div className="card bg-base-100 shadow-lg p-8 text-center">
          <Brand />
          <p className="text-lg font-semibold text-gray-700">
            {progress < 100 ? t("loading") : t("loadingComplete")}
          </p>
          <progress
            className="progress w-56 bg-primary-focus mx-auto my-4"
            value={progress}
            max="100"
          ></progress>
          <p className="text-sm text-gray-500">{progress}%</p>
        </div>
      </div>
    </div>
  );
};

export default InitialLoad;
