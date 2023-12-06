import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

// Define the structure of your recipe details
interface RecipeDetails {
  name: string;
  description: string;
  // Add other properties as needed
}

const RecipeDetailPage = () => {
  const { recipeId } = useParams();
  const [recipeDetails, setRecipeDetails] = useState<RecipeDetails | null>(null);
  const [videoId, setVideoId] = useState('');

  useEffect(() => {
    // Fetch recipe details (update this with your actual data fetching logic)
    // Example: api.getRecipeDetails(recipeId).then(setRecipeDetails);

    // Fetch YouTube video based on recipe name
    const fetchYoutubeVideo = async () => {
      if (recipeDetails) {
        try {
          const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
          const query = recipeDetails.name;
          const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&key=${apiKey}`;

          const response = await axios.get(url);
          if (response.data.items.length > 0) {
            setVideoId(response.data.items[0].id.videoId);
          }
        } catch (error) {
          console.error('Error fetching YouTube video', error);
        }
      }
    };

    if (recipeDetails?.name) {
      fetchYoutubeVideo();
    }
  }, [recipeDetails?.name]);

  if (!recipeDetails) {
    return <div>Loading...</div>;
  }

  const youtubeEmbedUrl = `https://www.youtube.com/embed/${videoId}`;

  return (
    <div>
      <h1>{recipeDetails.name}</h1>
      {/* Embed YouTube video */}
      <iframe
        width="560"
        height="315"
        src={youtubeEmbedUrl}
        title="YouTube video player"
        frameBorder="0"
        allowFullScreen>
      </iframe>
      {/* Display the written recipe */}
      <p>{recipeDetails.description}</p>
    </div>
  );
};

export default RecipeDetailPage;
