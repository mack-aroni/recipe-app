import express from "express";
import cors from "cors";
import * as RecipeAPI from "./recipe-api";
import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const app = express();
const prismaClient = new PrismaClient();

app.use(express.json());
app.use(cors());

app.post("/api/users/:id/:fullName", async (req, res) => {
  const id = req.params.id; // Use req.params to get parameters from the URL
  const fullName = req.params.fullName;

  try {
    // Check if the user already exists in the database
    const existingUser = await prismaClient.user.findUnique({
      where: {
        id: id,
      },
    });

    if (existingUser) {
      // If the user already exists, return a response indicating it
      return res.status(200).json({ message: "User already exists", user: existingUser });
    }

    // If the user does not exist, create a new user
    const newUser = await prismaClient.user.create({
      data: {
        id: id,
        name: fullName,
      },
    });

    return res.status(201).json(newUser);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Something Went Wrong" });
  }
});

app.get("/api/recipes/search", async (req, res) => {
  const searchTerm = req.query.searchTerm as string;
  const page = parseInt(req.query.page as string);
  const results = await RecipeAPI.searchRecipes(searchTerm, page);

  return res.json(results);
});

app.get("/api/recipes/:recipeId/summary", async (req, res) => {
  const recipeId = req.params.recipeId;
  const results = await RecipeAPI.getRecipeSummary(recipeId);

  return res.json(results);
});

app.post("/api/recipes/favorites/add", async (req, res) => {
  const { recipeId, userId } = req.body;

  // Validate the input
  if (!recipeId || !userId) {
    return res.status(400).json({ error: "Missing recipeId or userId" });
  }

  try {
    const favoriteRecipe = await prismaClient.favoriteRecipes.create({
      data: {
        userId: userId,
        recipeId: recipeId,
      },
    });
    return res.status(201).json(favoriteRecipe);
  } catch (error) {
    console.error(error);


    // Generic error response
    return res.status(500).json({ error: "Something went wrong" });
  }
});

app.get("/api/recipes/favorites/get", async (req, res) => {
  // Validate the query parameter
  const id = req.query.id;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: "Invalid or missing user ID" });
  }

  try {
    // Retrieve favorite recipes from the database
    const recipes = await prismaClient.favoriteRecipes.findMany({
      where: { userId: id },
    });

    // Check if the user has favorite recipes
    if (recipes.length === 0) {
      return res.status(404).json({ message: "No favorite recipes found for this user" });
    }

    // Extract recipe IDs and convert them to string
    const recipeIds = recipes.map(recipe => recipe.recipeId.toString());

    // Fetch favorite recipes details from the external API
    const favorites = await RecipeAPI.getFavoriteRecipesByIDs(recipeIds);
    return res.json(favorites);
  } catch (error) {
    console.error("Error fetching favorite recipes:", error);
    return res.status(500).json({ error: "Something went wrong" });
  }
});


app.delete("/api/recipes/favorites/delete", async (req, res) => {
  const { recipeId, userId } = req.body;

  // Validate input
  if (!recipeId || !userId) {
    return res.status(400).json({ error: "Missing recipeId or userId" });
  }

  try {
    // Attempt to delete the favorite recipe
    const deleteResult = await prismaClient.favoriteRecipes.deleteMany({
      where: {
        userId: userId,
        recipeId: recipeId,
      },
    });

    // Check if any record was deleted
    if (deleteResult.count === 0) {
      return res.status(404).json({ message: "Favorite recipe not found or already deleted" });
    }

    // Successfully deleted
    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting favorite recipe:", error);


    // Generic error response
    return res.status(500).json({ error: "Something went wrong" });
  }
});


app.listen(5000, () => {
  console.log("server running on localhost:5000");
});
