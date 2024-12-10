import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AnimeDialog from "../components/AnimeDialog";
import Header from "../components/Header";
import { useAuth } from "../AuthContext";
import axios from "axios";

const AnimeDetail = () => {
  const { isAuthenticated, logout } = useAuth();
  const { id } = useParams();
  const [animeInfo, setAnimeInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnime = async () => {
      try {
        const response = await axios.get(`https://api.jikan.moe/v4/anime/${id}/full`);
        const data = response.data;

        setAnimeInfo({
          id: data.data.mal_id,
          title: data.data.title,
          synopsis: data.data.synopsis,
          trailer: data.data.trailer
        });
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchAnime();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mx-auto px-4">
      <Header logout={logout} isAuthenticated={isAuthenticated} />
      {animeInfo && (
        <AnimeDialog
          isDialogOpen={true}
          animeInfo={animeInfo}
          closeDialog={() => {}}
        />
      )}
    </div>
  );
};

export default AnimeDetail;
