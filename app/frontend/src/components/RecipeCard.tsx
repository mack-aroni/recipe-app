import { Recipe } from "../types";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

interface Props {
  recipe: Recipe;
  isFavorite: boolean;
  onClick: () => void;
  onFavoriteButtonClick: (recipe: Recipe) => void;
}

const RecipeCard = ({
  recipe,
  onClick,
  onFavoriteButtonClick,
  isFavorite,
}: Props) => {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden cursor-pointer" onClick={onClick}>
      <img src={recipe.image} alt={recipe.title} className="w-full h-32 sm:h-48 object-cover" />
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{recipe.title}</h3>
          <span onClick={(event) => {
              event.stopPropagation();
              onFavoriteButtonClick(recipe);
            }}
          >
            {isFavorite ? (
              <AiFillHeart size={25} color="red" />
            ) : (
              <AiOutlineHeart size={25} />
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
