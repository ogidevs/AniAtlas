// components/AnimeDialog.jsx
import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { FaExternalLinkAlt } from "react-icons/fa";
import { useAuth } from "../AuthContext";
import { API_URL } from "../config";

const AnimeDialog = ({ isDialogOpen, animeInfo, closeDialog }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user } = useAuth();
  const [characters, setCharacters] = useState([]);
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState("");
  const [hasNext, setHasNext] = useState(true);

  if (!isDialogOpen) return null;
  const fetchAnimeCharacters = async () => {
    try {
      const response = await axios.get(`https://api.jikan.moe/v4/anime/${animeInfo.id}/characters`);
      setCharacters(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const addComment = async () => {
    const body = {
      content: commentContent,
      user_id: user.id,
      username: user.username,
      anime_id: animeInfo.id,
    };
    try {
      const response = await axios.post(`${API_URL}/comment`, body, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.data.data === null || response.data.data === undefined) {
        throw new Error(response.data.detail);
      }
      setComments([
        ...comments,
        ...(Array.isArray(response.data.data)
          ? response.data.data
          : response.data.data
          ? [response.data.data]
          : []),
      ]);
      setCommentContent("");
      toast.success(t("animeDialog.commentAdded"));
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error(error.message);
    }
  };

  const deleteComment = async (commentId) => {
    try {
      const response = await axios.delete(`${API_URL}/comment/${commentId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.status === 200) {
        setComments(comments.filter((comment) => comment.id !== commentId));
        toast.success(t("animeDialog.commentDeleted"));
      } else {
        throw new Error(response.data.detail);
      }
    } catch (error) {
      toast.error(error.message);
      console.error("Error deleting comment:", error);
    }
  };

  const fetchAnimeComments = async (skip) => {
    try {
      const response = await axios.get(`${API_URL}/comment`, {
        params: {
          anime_id: animeInfo.id,
          skip: skip,
          limit: 10,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.data.data.length < 10) {
        setHasNext(false);
      }
      setComments([
        ...comments,
        ...(Array.isArray(response.data.data)
          ? response.data.data
          : response.data.data
          ? [response.data.data]
          : []),
      ]);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  useEffect(() => {
    fetchAnimeComments(0);
  }, []);

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

        <div className="my-4">
          <h2 className="text-xl font-bold mb-2">
            {t("animeDialog.comments")}
          </h2>
          <div className="mt-4">
            {comments && comments.length === 0 && (
              <p>{t("animeDialog.noComments")}</p>
            )}
            {comments && comments.length > 0 && (
              <>
                {comments.map((comment, index) => (
                  <div
                    key={`${comment.id}-${index}`}
                    className="border-b border-gray-300 py-2 flex justify-between max-w-full"
                  >
                    <div className="flex flex-col items-start text-left w-3/4">
                      <figure className="flex items-center">
                        <img
                          src={`https://ui-avatars.com/api/?name=${comment.username}`}
                          alt={comment.username}
                          className="w-8 h-8 rounded-full mr-2"
                        />
                        <p className="text-sm font-bold">
                          {comment.username}
                        </p>
                      </figure>
                      <p className="text-sm text-wrap break-words w-full">
                        {comment.content}
                      </p>
                    </div>
                    {(comment.user_id === user.id || user.admin) && (
                      <button
                        className="btn btn-sm btn-error mt-2 text-red-500"
                        onClick={() => deleteComment(comment.id)}
                      >
                        X
                      </button>
                    )}
                  </div>
                ))}
                {hasNext && (
                  <button
                    className="btn btn-primary my-2"
                    onClick={() => fetchAnimeComments(comments.length)}
                  >
                    {t("animeDialog.loadMore")}
                  </button>
                )}
              </>
            )}
          </div>
          <textarea
            className="w-full p-2 border rounded-lg border-gray-300 bg-gray-100 mt-2"
            placeholder={t("animeDialog.addComment")}
            onChange={(e) => setCommentContent(e.target.value)}
            value={commentContent}
          ></textarea>
          <button
            className="btn btn-primary mt-2"
            onClick={() => addComment()}
            disabled={commentContent.length === 0}
          >
            {t("animeDialog.addComment")}
          </button>
        </div>

        <button className="btn btn-error mt-4" onClick={() => closeDialog()}>
          {t("animeDialog.close")}
        </button>
        {window.location.href.includes("/anime") && (
          <button
            className="btn btn-primary mt-4 ml-2"
            onClick={() => navigate(`/home`)}
          >
            {t("animeDialog.back")}
          </button>
        ) || (
          <button
            className="btn btn-primary mt-4 ml-2"
            onClick={() => navigate(`/anime/${animeInfo.id}`)}
          >
            {t("animeDialog.openPage")}
          </button>
        )}
      </div>
    </div>
  );
};

export default AnimeDialog;
