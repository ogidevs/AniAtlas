// components/AnimeCard.jsx
import React, { useState } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const AnimeCard = ({ anime, openAnimeDialog, handleImageClick }) => {
  const { t } = useTranslation();
  const [isJapaneseTitle, setIsJapaneseTitle] = useState(true);

  return (
    <div
      key={`${anime.mal_id}`}
      className="card w-full shadow-md rounded-lg fadeIn"
    >
      <figure>
        <img
          src={anime.images.jpg.large_image_url}
          alt={anime.title}
          className="h-80 w-auto rounded-t cursor-pointer transition-transform transform hover:scale-105 ease-in-out duration-300"
          onClick={handleImageClick}
        />
      </figure>
      <div className="card-body">
        <div className="flex justify-between">
          <h3 className="text-lg font-semibold">
            <span
              onClick={() => {
                setIsJapaneseTitle(!isJapaneseTitle);
              }}
              className="cursor-pointer"
            >
              {isJapaneseTitle
                ? anime.title
                : anime.title_english?.length > 0
                  ? anime.title_english
                  : t("animeCard.noAltTitle")}
            </span>{" "}
            - {t("animeCard.rank")} {anime.rank}
          </h3>
          <a
            href={anime.url}
            target="_blank"
            className="text-blue-500 m-2 inline-block float-right transform hover:scale-110 transition-transform ease-in-out duration-300"
          >
            <FaExternalLinkAlt />
          </a>{" "}
        </div>
        <p className="text-sm" hidden={!anime.aired}>
          {t("animeCard.aired")}: {anime.aired.string}
        </p>
        <p className="text-sm" hidden={!anime.type}>
          {t("animeCard.type")}: {anime.type}
        </p>
        <p className="text-sm" hidden={!anime.source}>
          {t("animeCard.source")}: {anime.source}
        </p>
        <p className="text-sm" hidden={!anime.episodes}>
          {t("animeCard.episodes")}: {anime.episodes} ({anime.duration})
        </p>
        <p className="text-sm" hidden={!anime.rating}>
          {t("animeCard.rating")}: {anime.rating}
        </p>
        <p className="text-sm" hidden={!anime.score}>
          {t("animeCard.score")}: {anime.score} ({anime.scored_by}{" "}
          {t("animeCard.numOfScores")})
        </p>
        <p className="text-sm" hidden={!anime.status}>
          {t("animeCard.status")}: {anime.status}
        </p>
        <p className="text-sm">
          {t("animeCard.genres")}:{" "}
          {anime.genres?.length > 0 &&
            anime.genres
              .map((genre) => (
                <a
                  key={genre.mal_id}
                  href={genre.url}
                  target="_blank"
                  className="text-blue-500 hover:underline"
                >
                  {genre.name}
                </a>
              ))
              .reduce((prev, curr) => [prev, ", ", curr])}
        </p>

        {anime.themes.length > 0 && (
          <p className="text-sm">
            {t("animeCard.themes")}:{" "}
            {anime.themes
              .map((theme) => (
                <a
                  key={theme.mal_id}
                  href={theme.url}
                  target="_blank"
                  className="text-blue-500 hover:underline"
                >
                  {theme.name}
                </a>
              ))
              .reduce((prev, curr) => [prev, ", ", curr])}
          </p>
        )}

        {anime.licensors.length > 0 && (
          <>
            <p className="text-sm">
              {t("animeCard.licensors")}:{" "}
              {anime.licensors
                .map((licensor) => (
                  <a
                    key={licensor.mal_id}
                    href={licensor.url}
                    target="_blank"
                    className="text-blue-500 hover:underline"
                  >
                    {licensor.name}
                  </a>
                ))
                .reduce((prev, curr) => [prev, ", ", curr])}
            </p>
          </>
        )}

        {anime.studios.length > 0 && (
          <p className="text-sm">
            {t("animeCard.studios")}:{" "}
            <a
              href={anime.studios[0]?.url}
              className="text-blue-500 hover:underline"
              target="_blank"
            >
              {" "}
              {anime.studios[0]?.name}
            </a>
          </p>
        )}
        <div className="flex justify-center mt-2">
          <button
            className="btn btn-sm mx-2"
            onClick={() =>
              openAnimeDialog(
                anime.mal_id,
                anime.title,
                anime.synopsis,
                anime.trailer
              )
            }
          >
            {t("animeCard.moreInfo")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnimeCard;
