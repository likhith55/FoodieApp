import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [myRecipes, setMyRecipes] = useState([]);

  const toggleFavorite = (id) => {
    setFavorites((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id]
    );
  };

  const addRecipe = (recipe) => {
    setMyRecipes((previous) => [...previous, recipe]);
  };

  const updateRecipe = (updatedRecipe) => {
    setMyRecipes((previous) =>
      previous.map((recipe) =>
        recipe.id === updatedRecipe.id ? updatedRecipe : recipe
      )
    );
  };

  const deleteRecipe = (id) => {
    setMyRecipes((previous) =>
      previous.filter((recipe) => recipe.id !== id)
    );
  };

  return (
    <AppContext.Provider
      value={{
        favorites,
        toggleFavorite,
        myRecipes,
        addRecipe,
        updateRecipe,
        deleteRecipe,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
