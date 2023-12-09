import { useEffect, useState } from "react";
import { RecipeSummary } from "../types";
import * as RecipeAPI from "../api";
import axios from 'axios';

interface Props {
  recipeId: string;
  onClose: () => void;
}

const RecipeModal = ({ recipeId, onClose }: Props) => {
  const [recipeSummary, setRecipeSummary] = useState<RecipeSummary>();
  const [videoId, setVideoId] = useState('');

  useEffect(() => {
    const fetchRecipeSummaryAndVideo = async () => {
      try {
        const recipeSummary = await RecipeAPI.getRecipeSummary(recipeId);
        setRecipeSummary(recipeSummary);

        // Fetch the YouTube video ID if the recipe title is available
        if (recipeSummary?.title) {

          console.log("Querying YouTube for recipe title:", recipeSummary.title);


          const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
          const query = `${recipeSummary.title} recipe`; // More specific query
          const maxResults = 1; // Limit the number of results
          const type = 'video'; // Ensure only videos are returned
          const safeSearch = 'strict'; // Use strict safe search filtering

          const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=${type}&maxResults=${maxResults}&q=${encodeURIComponent(query)}&safeSearch=${safeSearch}&key=${apiKey}`;

          const response = await axios.get(url);
          if (response.data.items.length > 0) {
            setVideoId(response.data.items[0].id.videoId);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchRecipeSummaryAndVideo();
  }, [recipeId]);

  if (!recipeSummary) {
    return <div>Loading...</div>;
  }

  const youtubeEmbedUrl = `https://www.youtube.com/embed/${videoId}`;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-70"></div>
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
          <div className="p-4 border-b">
            <h2 className="text-2xl font-semibold">{recipeSummary?.title}</h2>
            <button onClick={onClose} className="text-lg">&times;</button>
          </div>
          {/* Embed YouTube Video */}
          <iframe
            src={youtubeEmbedUrl}
            title="YouTube video player"
            frameBorder="0"
            allowFullScreen
            className="w-full"
            style={{ height: '315px' }}
          ></iframe>
          <div className="p-4">
            <p dangerouslySetInnerHTML={{ __html: recipeSummary?.summary }}></p>
          </div>
        </div>
      </div>
    </>
  );
};

export default RecipeModal;
