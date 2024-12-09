//components/Brand.jsx
import React from "react";
import { useTranslation } from "react-i18next";

const Brand = () => {
  const { t } = useTranslation();

  return (
    <div className="my-8 animate-pulse">
      <h1 className="text-4xl font-bold text-center my-2">{t("brand")}</h1>
      <h4 className="text-center text-base text-gray-500">{t("brandDesc")}</h4>
    </div>
  );
};

export default Brand;
