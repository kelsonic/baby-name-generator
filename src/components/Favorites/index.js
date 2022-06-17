// Node modules.
import PropTypes from "prop-types";
import React, { useState } from "react";
import moment from "moment";
// Relative imports.
import "./styles.scss";

const Favorites = ({ favorites, setFavorites }) => {
  const [viewFavorites, setViewFavorites] = useState(false);

  // Do not render if we have no favorites.
  if (!favorites?.length) {
    return null;
  }

  const onDeleteFavorite = (clickedFavoriteDetails) => () => {
    // Update the favorites list in local storage.
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    favorites.splice(
      favorites.findIndex(
        (favoriteDetails) =>
          favoriteDetails.name === clickedFavoriteDetails.name
      ),
      1
    );
    localStorage.setItem("favorites", JSON.stringify(favorites));

    // Update the favorites state.
    setFavorites(favorites);
  };

  if (!viewFavorites) {
    return (
      <div className="favorites">
        <button
          className="link view-favorites"
          onClick={() => setViewFavorites(true)}
          type="button"
        >
          View Favorites
        </button>
      </div>
    );
  }

  return (
    <div className="favorites">
      <button
        className="link view-favorites"
        onClick={() => setViewFavorites(false)}
        type="button"
      >
        Hide Favorites
      </button>
      {favorites.map((favoriteDetails) => (
        <div className="favorite" key={favoriteDetails?.name}>
          <h3>{favoriteDetails?.name}</h3>
          <p className="delete" onClick={onDeleteFavorite(favoriteDetails)}>
            Remove
          </p>
          <p>
            Favorited on:{" "}
            {favoriteDetails?.dateFavorited
              ? moment(favoriteDetails?.dateFavorited).format("MM/DD/YYYY")
              : "N/A"}
          </p>
          <p>Gender: {favoriteDetails?.gender === "M" ? "Male" : "Female"}</p>
          <p>Occurrences: {favoriteDetails?.occurrences}</p>
          <p>Year: {favoriteDetails?.year}</p>
        </div>
      ))}
    </div>
  );
};

Favorites.propTypes = {
  favorites: PropTypes.arrayOf(
    PropTypes.shape({
      dateFavorited: PropTypes.string.isRequired,
      gender: PropTypes.oneOf(["M", "F"]).isRequired,
      name: PropTypes.string.isRequired,
      occurrences: PropTypes.number.isRequired,
      year: PropTypes.number.isRequired,
    })
  ).isRequired,
  setFavorites: PropTypes.func.isRequired,
};

export default Favorites;
