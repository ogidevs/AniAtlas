import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

const LanguageToggle = (color) => {
  const { i18n } = useTranslation();
  
  useEffect(() => {
    const lang = localStorage.getItem('userLang');
    if (lang) {
        i18n.changeLanguage(lang);
    }
  }, []);

  const changeLanguage = () => {
    const newLang = i18n.language === "en" ? "sr" : "en";
    i18n.changeLanguage(newLang);
    localStorage.setItem("userLang", newLang);
  };

  return (
    <div className="flex items-center justify-center">
      <p
        className={`text-lg cursor-pointer ${color != null ? `text-${color}-500` : 'text-gray-500'} transition duration-300 hover:text-gray-700`}
        onClick={changeLanguage}
      >
        {i18n.language.toUpperCase() === "SR" ? "EN" : "SR"}
      </p>
    </div>
  );
};

export default LanguageToggle;
