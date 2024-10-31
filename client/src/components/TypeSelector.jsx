// components/typeSelector.jsx
import React from "react";
import { useTranslation } from "../../node_modules/react-i18next";

const TypeSelector = ({ selectedMood, setSelectedMood }) => {
  const { t } = useTranslation();
  return (
    <div>
      <h2 className="text-2xl mt-5 mb-2">{t("typeSelector.title")}</h2>
      <div className="flex space-x-4 mb-5">
        <label className="flex items-center">
          <input
            type="radio"
            name="mood"
            value="modern"
            checked={selectedMood === "modern"}
            onChange={() => setSelectedMood("modern")}
            className="mr-2"
          />
          {t("typeSelector.modern")}
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            name="mood"
            value="old"
            checked={selectedMood === "old"}
            onChange={() => setSelectedMood("old")}
            className="mr-2"
          />
          {t("typeSelector.old")}
        </label>
      </div>
    </div>
  );
};

export default TypeSelector;
