// components/AnimeDialog.jsx
import React from "react";
import { useState } from "react";
import { useTranslation } from "../../node_modules/react-i18next";
import { FaExternalLinkAlt } from "react-icons/fa";

const AnimeDialog = ({ isDialogOpen, animeInfo, closeDialog }) => {
  const { t } = useTranslation();
  const [characters, setCharacters] = useState([]);

  if (!isDialogOpen) return null;
  const fetchAnimeCharacters = async () => {
    fetch(`https://api.jikan.moe/v4/anime/${animeInfo.id}/characters`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw response;
      })
      .then((data) => {
        setCharacters(data.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={() => closeDialog()}
    >
      <div
        className="bg-white p-6 m-6 rounded-lg shadow-lg sm:w-full md:w-2/3 text-center fadeIn"
        onClick={(e) => e.stopPropagation()}
        style={{ maxHeight: "80vh", overflowY: "auto" }}
      >
        <div className="flex flex-row justify-between">
          <h2 className="text-2xl font-bold mb-2">{animeInfo.title}</h2>
          <div className="flex justify-center items-center">
            <strong>{t("animeDialog.aniCrush")}</strong>
            <a
              href={`https://anicrush.to/search?keyword=${animeInfo.title}`}
              target="_blank"
              className="text-blue-500 hover:underline mx-2"
            >
              <FaExternalLinkAlt className="transform hover:scale-110 transition-transform ease-in-out duration-300" />
            </a>
          </div>
        </div>
        <p className="text-justify lg:text-base">{animeInfo.content}</p>

        {characters.length === 0 && (
          <>
            <button
              className="btn btn-primary mt-4"
              onClick={() => fetchAnimeCharacters()}
            >
              {t("animeDialog.fetchCharacters")}
            </button>
          </>
        )}
        <div className="my-4 flex flex-wrap justify-center">
          {characters.map((data, index) => (
            <div
              key={`${data.character.mal_id}-${index}`}
              className="flex flex-col items-center mx-4 my-2"
            >
              <img
                src={data.character.images?.webp?.image_url}
                alt={data.character.name}
                loading="lazy"
                width="100"
                height="100"
                className="rounded-lg shadow-md mx-auto"
              />
              <p className="text-lg font-bold">{data.character.name}</p>
              <p className="text-sm">{data.role}</p>
            </div>
          ))}
        </div>
        {animeInfo.trailer !== null && animeInfo.trailer.url && (
          <>
            <p className="block my-4 border-b border-gray-300"></p>
            <h2 className="text-xl font-bold mb-2">
              {t("animeDialog.trailer")}:{" "}
            </h2>
            <span className="flex flex-wrap justify-center">
              <iframe
                src={`https://www.youtube.com/embed/${animeInfo.trailer?.url?.split("?v=")[1]}`}
                title={animeInfo.title}
                width="560"
                height="315"
                allowFullScreen
                className="mx-auto"
              ></iframe>
            </span>
          </>
        )}

        <button className="btn btn-error mt-4" onClick={() => closeDialog()}>
          {t("animeDialog.close")}
        </button>
      </div>
    </div>
  );
};

export default AnimeDialog;
