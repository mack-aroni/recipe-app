import { useEffect, useState } from "react";
import { RecipeSummary } from "../types";
import * as RecipeAPI from "../api";

interface Props {
  recipeId: string;
  onClose: () => void;
}

const RecipeModal = ({ recipeId, onClose }: Props) => {
  const [recipeSummary, setRecipeSummary] = useState<RecipeSummary>();

  useEffect(() => {
    const fetchRecipeSummary = async () => {
      try {
        const recipeSummary = await RecipeAPI.getRecipeSummary(recipeId);
        setRecipeSummary(recipeSummary);
      } catch (error) {
        console.log(error);
      }
    };
    fetchRecipeSummary();
  }, [recipeId]);

  if (!recipeSummary) {
    return <></>;
  }

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-70"></div>
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
          <div className="p-4 border-b">
            <h2 className="text-2xl font-semibold">{recipeSummary?.title}</h2>
            <button onClick={onClose} className="text-lg">&times;</button>
          </div>
          <div className="p-4">
            <p dangerouslySetInnerHTML={{ __html: recipeSummary?.summary }}></p>
          </div>
        </div>
      </div>
    </>
  );
};

export default RecipeModal;
