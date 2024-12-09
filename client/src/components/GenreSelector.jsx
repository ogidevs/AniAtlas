// components/GenreSelector.jsx
import React from "react";
import { useTranslation } from "react-i18next";

const GenreSelector = ({ genres, selectedGenres, handleGenreToggle }) => {
  const { t } = useTranslation();
  return (
    <div>
      <h2 className="text-2xl mt-5 mb-2">{t("genreSelector.title")}</h2>
      <div className="flex flex-wrap mb-5">
        <div className="flex flex-wrap place-content-center">
          {genres.map((genre) => (
            <label key={genre.value} className="m-2 flex items-center">
              <input
                type="checkbox"
                value={genre.value}
                checked={selectedGenres.includes(genre.value)}
                onChange={() => handleGenreToggle(genre.value)}
                className="toggle toggle-primary"
              />
              <span className="ml-2 text-lg">{genre.icon}</span>
              <span className="ml-2">{genre.name}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};
export default GenreSelector;
