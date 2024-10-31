// components/KeywordsSelector.jsx
import React from "react";
import { useTranslation } from "../../node_modules/react-i18next";

const KeywordsSelector = ({
  selectedKeywords,
  handleKeywordSelect,
  handleKeywordDelete,
}) => {
  const { t } = useTranslation();
  return (
    <div>
      <h2 className="text-2xl mt-5 mb-2">{t("keywordsSelector.title")}</h2>
      <div className="flex flex-wrap gap-2 mb-4">
        {selectedKeywords.map((keyword, index) => (
          <div key={index} className="badge badge-primary">
            {keyword}
            <button
              className="ml-2 text-white"
              onClick={() => handleKeywordDelete(keyword)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          className="input input-bordered w-full"
          placeholder={t("keywordsSelector.placeholder")}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.target.value.trim() !== "") {
              handleKeywordSelect(e.target.value.trim());
              e.target.value = "";
            }
          }}
        />
        <button
          className="btn btn-primary ml-2"
          onClick={() => {
            const input = document.querySelector('input[type="text"]');
            if (input.value.trim() !== "") {
              handleKeywordSelect(input.value.trim());
              input.value = "";
            }
          }}
        >
          {t("keywordsSelector.add")}
        </button>

        <button
          className="btn btn-secondary ml-2"
          onClick={() => handleKeywordDelete(null, true)}
        >
          {t("keywordsSelector.clear")}
        </button>
      </div>
    </div>
  );
};
export default KeywordsSelector;
