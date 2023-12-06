import * as api from "./api";
import { useState, useRef, useEffect, FormEvent } from "react";
import { useUser, SignIn, UserButton } from "@clerk/clerk-react";
import { Recipe } from "./types";
import RecipeCard from "./components/RecipeCard";
import RecipeModal from "./components/RecipeModal"; 

type Tabs = "search" | "favorites";

const App = () => {
  const { isSignedIn, user } = useUser();
  console.log(user);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | undefined>(
    undefined
  );
  const [selectedTab, setSelectedTab] = useState<Tabs>("search");
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const pageNumber = useRef(1);

  
  useEffect(() => {
    // Fetch initial recipes
    const fetchInitialRecipes = async () => {
      try {
        const initialRecipes = await api.searchRecipes(searchTerm, 1);
        setRecipes(initialRecipes.results);
      } catch (error) {
        console.log(error);
      }
    };

    fetchInitialRecipes();
  }, [searchTerm]);

  useEffect(() => {
    if (isSignedIn) {
      const fetchFavoriteRecipes = async () => {
        try {
          await api.checkAndCreateUserIfNotExists(user.id);
          const favoriteRecipes = await api.getFavoriteRecipes(user.id);
          setFavoriteRecipes(favoriteRecipes.results);
        } catch (error) {
          console.log(error);
        }
      };
      fetchFavoriteRecipes();
    }
  }, [isSignedIn]);

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
      await api.addFavoriteRecipe(recipe.id.toString(), user.id);
      setFavoriteRecipes([...favoriteRecipes, recipe]);
    } catch (error) {
      console.log(error);
    }
  };

  const removeFavoriteRecipe = async (recipe: Recipe) => {
    if (!isSignedIn) return;
    try {
      await api.removeFavoriteRecipe(recipe.id.toString(), user.id);
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
      <div className="flex justify-center items-center ">
        <SignIn />
      </div>
    );
  }

  return (
    <div className="bg-gray-900">

      <div className="flex justify-between items-center bg--400 p-4">
        <div className="flex space-x-4"> {/* Flex container for buttons */}
          <h1 className="text-xl font-semibold text-gray-200 hover:text-blue-300 cursor-pointer" onClick={() => setSelectedTab("search")}>Recipe Search</h1>
          <h1 className="text-xl font-semibold text-gray-200 hover:text-blue-300 cursor-pointer" onClick={() => setSelectedTab("favorites")}>Favorites</h1>
        </div>
        <UserButton />
      </div>

      {selectedTab === "search" && (
        <>
          <form onSubmit={handleSearchSubmit} className="mb-4 flex justify-center">
            <input
              type="text"
              required
              placeholder="Search for recipes..." 
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="border border-gray-300 p-2 rounded mr-2 w-96" // Updated width
            />
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Search</button>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recipes.map((recipe) => {
              const isFavorite = favoriteRecipes.some(
                (favRecipe) => recipe.id === favRecipe.id
              );

              return (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onClick={() => setSelectedRecipe(recipe)}
                  onFavoriteButtonClick={
                    isFavorite ? removeFavoriteRecipe : addFavoriteRecipe
                  }
                  isFavorite={isFavorite}
                />
              );
            })}
          </div>

          <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleViewMoreClick}>
            View More
          </button>
        </>
      )}

      {selectedTab === "favorites" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {favoriteRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onClick={() => setSelectedRecipe(recipe)}
              onFavoriteButtonClick={removeFavoriteRecipe}
              isFavorite={true}
            />
          ))}
        </div>
      )}

      {selectedRecipe && (
        <RecipeModal
          recipeId={selectedRecipe.id.toString()}
          onClose={() => setSelectedRecipe(undefined)}
        />
      )}
    </div>
  );
};

export default App;
