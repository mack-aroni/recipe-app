import "./App.css";
import * as api from "./api";

import { useState, useRef, useEffect, FormEvent } from "react";
import { useUser, SignIn, UserButton } from "@clerk/clerk-react";
import { Recipe } from "./types";
import RecipeCard from "./components/RecipeCard";
import RecipeModal from "./components/RecipeModal"; // Assuming RecipeModal is the correct import

type Tabs = "search" | "favorites";

const App = () => {
  const { isSignedIn, user } = useUser();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | undefined>(
    undefined
  );
  const [selectedTab, setSelectedTab] = useState<Tabs>("search");
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const pageNumber = useRef(1);

  useEffect(() => {
    if (isSignedIn && user && user.id && user.fullName) {
      const fetchFavoriteRecipes = async () => {
        try {
          // Check if the user exists in the database and create if not
          await api.checkAndCreateUserIfNotExists(user.id, user.fullName); // Implement this method in your API

          // Fetch favorite recipes after ensuring the user exists
          const favoriteRecipes = await api.getFavoriteRecipes(user.id);
          setFavoriteRecipes(favoriteRecipes.results);
        } catch (error) {
          console.log(error);
        }
      };
      fetchFavoriteRecipes();
    }
  }, [isSignedIn, user]);

  const handleSearchSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const recipes = await api.searchRecipes(searchTerm, 1);
      setRecipes(recipes.results);
    } catch (error) {
      console.log(error);
    }
  };

  const handleViewMoreClick = async () => {
    const nextPage = pageNumber.current + 1;
    try {
      const nextRecipes = await api.searchRecipes(searchTerm, nextPage);
      setRecipes([...recipes, ...nextRecipes.results]);
      pageNumber.current = nextPage;
    } catch (error) {
      console.log(error);
    }
  };

  const addFavoriteRecipe = async (recipe: Recipe) => {
    if (!isSignedIn) return;
    try {
      await api.addFavoriteRecipe(recipe.id.toString(), user.id); // Assuming the API expects a string ID
      setFavoriteRecipes([...favoriteRecipes, recipe]);
    } catch (error) {
      console.log(error);
    }
  };

  const removeFavoriteRecipe = async (recipe: Recipe) => {
    if (!isSignedIn) return;
    try {
      await api.removeFavoriteRecipe(recipe.id.toString(), user.id); // Assuming the API expects a string ID
      const updatedRecipes = favoriteRecipes.filter(
        (favRecipe) => recipe.id !== favRecipe.id
      );
      setFavoriteRecipes(updatedRecipes);
    } catch (error) {
      console.log(error);
    }
  };

  if (!isSignedIn) {
    return (
      <div>
        <SignIn />
      </div>
    );
  }

  return (
    <div>
      <div className="tabs">
        <h1 onClick={() => setSelectedTab("search")}>Recipe Search</h1>
        <h1 onClick={() => setSelectedTab("favorites")}>Favorites</h1>
        <UserButton />
      </div>

      {selectedTab === "search" && (
        <>
          <form onSubmit={(event) => handleSearchSubmit(event)}>
            <input
              type="text"
              required
              placeholder="Enter a search term ..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            ></input>
            <button type="submit">Submit</button>
          </form>

          {recipes.map((recipe) => {
            const isFavorite = favoriteRecipes.some(
              (favRecipe) => recipe.id === favRecipe.id
            );

            return (
              <RecipeCard
                key={recipe.id} // Add a unique key here
                recipe={recipe}
                onClick={() => setSelectedRecipe(recipe)}
                onFavoriteButtonClick={
                  isFavorite ? removeFavoriteRecipe : addFavoriteRecipe
                }
                isFavorite={isFavorite}
              />
            );
          })}

          <button className="view-more-button" onClick={handleViewMoreClick}>
            View More
          </button>
        </>
      )}

      {selectedTab === "favorites" && (
        <div>
          {favoriteRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id} // Add a unique key here
              recipe={recipe}
              onClick={() => setSelectedRecipe(recipe)}
              onFavoriteButtonClick={removeFavoriteRecipe}
              isFavorite={true}
            />
          ))}
        </div>
      )}

      {selectedRecipe ? (
        <RecipeModal
          recipeId={selectedRecipe.id.toString()}
          onClose={() => setSelectedRecipe(undefined)}
        />
      ) : null}
    </div>
  );
};
export default App;
