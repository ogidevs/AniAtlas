// src/pages/Home.js
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "react-i18next";
import { useAuth } from "../AuthContext";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import {
  GiFragmentedSword,
  GiRunningNinja,
  GiGreekTemple,
  GiMagnifyingGlass,
  GiDramaMasks,
  GiFairyWand,
  GiGhost,
  GiSlicedBread,
  GiLoveMystery,
  GiSoccerBall,
  GiSchoolBag,
  GiSpaceship,
  GiImpLaugh,
  GiSuspicious,
} from "react-icons/gi";
import { MdOutlineSportsMartialArts, MdBoy } from "react-icons/md";

import InitialLoad from "../components/InitalLoad";
import AnimeList from "../components/AnimeList";
import AnimeDialog from "../components/AnimeDialog";
import GenreSelector from "../components/GenreSelector";
import TypeSelector from "../components/TypeSelector";
import KeywordsSelector from "../components/KeywordsSelector";

import Brand from "../components/Brand";
import Header from "../components/Header";


export const Home = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const { t } = useTranslation();
  const [animeList, setAnimeList] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [initalLoad, setInitialLoad] = useState(true);
  const [animeLoading, setAnimeLoading] = useState(false);
  const [noMoreData, setNoMoreData] = useState(false);
  const [selectedMood, setSelectedMood] = useState("modern");
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedKeywords, setSelectedKeywords] = useState([]);
  const [isAnimeDialogOpen, setIsAnimeDialogOpen] = useState(false);
  const [animeInfo, setAnimeInfo] = useState({ title: "", content: "" });
  const imageRef = useRef(null);

  const genres = [
    {
      name: t("genreSelector.genres.action"),
      value: "1",
      icon: <GiFragmentedSword />,
    },
    {
      name: t("genreSelector.genres.adventure"),
      value: "2",
      icon: <GiRunningNinja />,
    },
    {
      name: t("genreSelector.genres.comedy"),
      value: "4",
      icon: <GiImpLaugh />,
    },
    {
      name: t("genreSelector.genres.mythology"),
      value: "6",
      icon: <GiGreekTemple />,
    },
    {
      name: t("genreSelector.genres.mystery"),
      value: "7",
      icon: <GiMagnifyingGlass />,
    },
    {
      name: t("genreSelector.genres.drama"),
      value: "8",
      icon: <GiDramaMasks />,
    },
    // {
    //   name: t("genreSelector.genres.ecchi"),
    //   value: "9",
    //   icon: <GiHeartBeats />,
    // },
    {
      name: t("genreSelector.genres.fantasy"),
      value: "10",
      icon: <GiFairyWand />,
    },
    { name: t("genreSelector.genres.horror"), value: "14", icon: <GiGhost /> },
    {
      name: t("genreSelector.genres.sliceOfLife"),
      value: "36",
      icon: <GiSlicedBread />,
    },
    {
      name: t("genreSelector.genres.romance"),
      value: "22",
      icon: <GiLoveMystery />,
    },
    {
      name: t("genreSelector.genres.sports"),
      value: "30",
      icon: <GiSoccerBall />,
    },
    {
      name: t("genreSelector.genres.suspense"),
      value: "41",
      icon: <GiSuspicious />,
    },
    {
      name: t("genreSelector.genres.martialArts"),
      value: "17",
      icon: <MdOutlineSportsMartialArts />,
    },
    {
      name: t("genreSelector.genres.school"),
      value: "23",
      icon: <GiSchoolBag />,
    },
    {
      name: t("genreSelector.genres.sciFi"),
      value: "24",
      icon: <GiSpaceship />,
    },
    { name: t("genreSelector.genres.shounen"), value: "27", icon: <MdBoy /> },
  ];

  const fetchAnime = () => {
    if (user.disabled) {
      toast.error(t("error.searchDisabled"));
      setAnimeLoading(false);
      return;
    }
    const genresQuery =
      selectedGenres.length === 0 ? "" : `&genres=${selectedGenres.join(",")}`;
    const keywordQuery =
      selectedKeywords.length === 0 ? "" : `&q=${selectedKeywords.join(",")}`;
    const apiUrl =
      `https://api.jikan.moe/v4/anime?page=${currentPage}${genresQuery}${keywordQuery}&limit=9&order_by=score&sort=desc` +
      (selectedMood === "modern"
        ? `&start_date=2010-01-01`
        : `&end_date=2005-01-01`);

    axios.get(apiUrl)
      .then((response) => {
      if (response.data.pagination?.has_next_page === false) {
        setNoMoreData(true);
      }
      setAnimeList((prev) => [...prev, ...response.data.data]);
      setAnimeLoading(false);
      })
      .catch((error) => {
      console.error("Error fetching data:", error);
      toast.error(t("error.fetchingData") + ": " + error.message);
      setAnimeLoading(false);
      });
  };

  const handleScroll = () => {
    const scrollTop =
      document.body.scrollTop || document.documentElement.scrollTop;
    const clientHeight = window.innerHeight;
    const scrollHeight = document.documentElement.scrollHeight;

    if (scrollTop + clientHeight >= scrollHeight - 10) {
      if (!animeLoading && !noMoreData && animeList.length > 0) {
        setCurrentPage((prev) => prev + 1);
        setAnimeLoading(true);
      }
    }
  };

  // Throttle function to limit the frequency of scroll events
  const throttle = (func, limit) => {
    let lastFunc;
    let lastRan;
    return function (...args) {
      if (!lastRan) {
        func.apply(this, args);
        lastRan = Date.now();
      } else {
        clearTimeout(lastFunc);
        lastFunc = setTimeout(
          () => {
            if (Date.now() - lastRan >= limit) {
              func.apply(this, args);
              lastRan = Date.now();
            }
          },
          limit - (Date.now() - lastRan)
        );
      }
    };
  };

  const handleGenreToggle = (genre) => {
    setSelectedGenres((prevSelected) =>
      prevSelected.includes(genre)
        ? prevSelected.filter((g) => g !== genre)
        : [...prevSelected, genre]
    );
  };

  const handleKeywordSelect = (keyword) => {
    setSelectedKeywords((prevSelected) =>
      prevSelected.includes(keyword)
        ? prevSelected.filter((s) => s !== keyword)
        : [...prevSelected, keyword]
    );
  };

  const handleKeywordDelete = (keyword, all = false) => {
    if (all) {
      setSelectedKeywords([]);
      return;
    }
    setSelectedKeywords((prevSelected) =>
      prevSelected.filter((s) => s !== keyword)
    );
  };

  const handleSubmit = () => {
    setCurrentPage(1);
    setNoMoreData(false);
    setAnimeList([]);
    setAnimeLoading(true);
  };

  const handleImageClick = (e) => {
    imageRef.current = e.target;
    if (imageRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        imageRef.current.requestFullscreen();
      }
    }
  };

  const handleClickOutside = (event) => {
    if (document.fullscreenElement) {
      const target = event.target;
      if (!imageRef.current.contains(target)) {
        document.exitFullscreen();
      }
    }
  };
  const openAnimeDialog = (id, title, content, trailer) => {
    setAnimeInfo({ id, title, content, trailer });
    setIsAnimeDialogOpen(true);
  };

  useEffect(() => {
    const throttledHandleScroll = throttle(handleScroll, 500);
    window.addEventListener("scroll", throttledHandleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", throttledHandleScroll);
    };
  }, [animeLoading]);

  useEffect(() => {
    if (
      (selectedGenres.length !== 0 || selectedKeywords.length !== 0) &&
      currentPage > 0 &&
      animeLoading
    ) {
      fetchAnime();
    }
  }, [animeLoading]);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isAuthenticated !== null) {
      setInitialLoad(false);
    }
  }, [isAuthenticated]);
  
  if (initalLoad) {
    return <InitialLoad />;
  }

  return (
    <div className="container mx-auto px-4">
        <Header logout={logout} isAuthenticated={isAuthenticated} />
        <Brand />
        {user.admin && (
            <a href="/admin" className="text-blue-500 hover:underline">{t("admin.title")}</a>
          )}
        <div className="fadeIn">
        <TypeSelector
            selectedMood={selectedMood}
            setSelectedMood={setSelectedMood}
        />
        <GenreSelector
            genres={genres}
            selectedGenres={selectedGenres}
            handleGenreToggle={handleGenreToggle}
        />
        <KeywordsSelector
            selectedKeywords={selectedKeywords}
            handleKeywordSelect={handleKeywordSelect}
            handleKeywordDelete={handleKeywordDelete}
        />
        <div className="flex justify-center w-full">
            <button
            disabled={
                selectedGenres.length === 0 && selectedKeywords.length === 0
            }
            className="btn btn-primary my-5 mx-auto block"
            onClick={handleSubmit}
            >
            {t("submit")}
            </button>
        </div>
        <AnimeList
            animeList={animeList}
            currentPage={currentPage}
            noMoreData={noMoreData}
            openAnimeDialog={openAnimeDialog}
            handleImageClick={handleImageClick}
            searchingAnime={animeLoading}
        />
        {isAnimeDialogOpen && (
            <AnimeDialog
            isDialogOpen={isAnimeDialogOpen}
            animeInfo={animeInfo}
            closeDialog={() => setIsAnimeDialogOpen(false)}
            />
        )}
        {animeLoading && (
            <div className="my-4 mx-auto justify-center flex">
            <AiOutlineLoading3Quarters />
            </div>
        )}
        <footer className="text-center my-8">
            <p>
            {t("footer")}{" "}
            <a
                href={t("footerLink")}
                target="_blank"
                className="text-blue-500 hover:underline"
            >
                {" "}
                {t("author")}
            </a>
            </p>
        </footer>
        </div>
    </div>
  );
};

export default Home;