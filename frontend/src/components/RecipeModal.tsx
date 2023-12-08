import { useEffect, useState } from "react";
import { RecipeSummary } from "../types";
import * as RecipeAPI from "../api";

interface Props {
  recipeId: string;
  onClose: () => void;
}

const RecipeModal = ({ recipeId, onClose }: Props) => {
  const [recipe, setRecipe] = useState<RecipeSummary>();

  useEffect(() => {
    const fetchRecipeSummary = async () => {
      try {
        const recipeSummary = await RecipeAPI.getRecipe(recipeId);
        console.log('Received Recipe:', recipeSummary); // Log the received recipe
        setRecipe(recipeSummary);
      } catch (error) {
        console.log(error);
      }
    };
    fetchRecipeSummary();
  }, [recipeId]);

  if (!recipe) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-70"></div>
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
          <div className="p-4 border-b">
            <h2 className="text-2xl font-semibold">{recipe?.title}</h2>
            <button onClick={onClose} className="text-lg">&times;</button>
          </div>
          <div className="p-4">
            <p dangerouslySetInnerHTML={{ __html: recipe?.information}}></p>
          </div>
        </div>
      </div>
    </>
  );
};

export default RecipeModal;
