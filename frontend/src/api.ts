
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


export const checkAndCreateUserIfNotExists = async (id: string) => {
  const url = "http://localhost:5000/api/users";

  const body = {
    id: id,
    
    // fullName: fullName,
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body),
  });

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

export const addFavoriteRecipe = async (recipeId: string, userId: string) => {
  const url = "http://localhost:5000/api/recipes/favorites/add";

  const body = {
    recipeId: recipeId,
    userId: userId
  };

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`HTTP error. Status: ${response.status}`);
  }

  return response.json();
};


export const removeFavoriteRecipe = async (recipeId: string, userId: string) => {
  const url = new URL(
    "http://localhost:5000/api/recipes/favorites/delete"
  );
  const body = {
    recipeId: recipeId,
    userId: userId
  }

  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`HTTP error. Status: ${response.status}`);
  }
};
