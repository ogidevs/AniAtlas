// components/InitialLoad.jsx
import { useEffect } from "react";
import Brand from "./Brand";
import { t } from "i18next";

const InitialLoad = () => {
  return (
    <div className="flex flex-col min-h-screen bg-base-200 skeleton">
      <div className="flex items-center justify-center flex-center my-32">
        <div className="card bg-base-100 shadow-lg p-8 text-center">
          <Brand />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 m-auto"
            viewBox="0 0 24 24"
          >
            <path
              fill="black"
              d="M2,12A11.2,11.2,0,0,1,13,1.05C12.67,1,12.34,1,12,1a11,11,0,0,0,0,22c.34,0,.67,0,1-.05C6,23,2,17.74,2,12Z"
            >
              <animateTransform
                attributeName="transform"
                dur="0.6s"
                repeatCount="indefinite"
                type="rotate"
                values="0 12 12;360 12 12"
              />
            </path>
          </svg>
          <p className="text-lg font-semibold text-gray-700">{t("loading")}</p>
        </div>
      </div>
    </div>
  );
};

export default InitialLoad;
