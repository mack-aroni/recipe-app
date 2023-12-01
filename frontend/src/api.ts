
export const searchRecipes = async (searchTerm: string, page: number) => {
  const baseUrl = new URL("http://localhost:5000/api/recipes/search");
  baseUrl.searchParams.append("searchTerm", searchTerm);
  baseUrl.searchParams.append("page", String(page));

  const response = await fetch(baseUrl);
  if (!response.ok) {
    throw new Error(`HTTP error. Status: ${response.status}`);
  }

  return response.json();
};


export const checkAndCreateUserIfNotExists = async (id: string, fullName: string | null) => {
  const baseUrl = new URL("http://localhost:5000/api/users");
  baseUrl.searchParams.append("id", id);

  if (fullName !== null) {
    baseUrl.searchParams.append("fullName", fullName);
  }
  
  const response = await fetch(baseUrl);
  if (!response.ok) {
    throw new Error(`HTTP error. Status: ${response.status}`);
  }

  return response.json();
};

export const getRecipeSummary = async (recipeId: string) => {
  const url = new URL(`http://localhost:5000/api/recipes/${recipeId}/summary`);
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error. Status: ${response.status}`);
  }

  return response.json();
};

export const getFavoriteRecipes = async (id: string) => {
  const url = new URL("http://localhost:5000/api/recipes/favorites/get");
  url.searchParams.append("id", id);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error. Status: ${response.status}`);
  }

  return response.json();
};

export const addFavoriteRecipe = async (recipeId: string, id: string) => {
  const url = new URL("http://localhost:5000/api/recipes/favorites/add");
  url.searchParams.append("recipeId", recipeId);
  url.searchParams.append("id", id);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error. Status: ${response.status}`);
  }

  return response.json();

  
};

export const removeFavoriteRecipe = async (recipeId: string, id: string) => {
  const url = new URL(
    "http://localhost:5000/api/recipes/favorites/delete"
  );
  url.searchParams.append("recipeId", recipeId);
  url.searchParams.append("id", id);
  
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error. Status: ${response.status}`);
  }
};
