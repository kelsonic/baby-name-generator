// Node modules.
import moment from "moment";
import { useState } from "react";
// Relative imports.
import "./styles.scss";
import DataSources from "components/DataSources";
import Filters from "components/Filters";
import link from "assets/link.png";

function App() {
  // Derive the state we need.
  const [dataSource, setDataSource] = useState("USA Nationwide");
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem("favorites") || "[]")
  );
  const [gender, setGender] = useState("M");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [maxOccurrences, setMaxOccurrences] = useState("10000");
  const [nameDetails, setNameDetails] = useState("");
  const [startsWith, setStartsWith] = useState("");

  const onFavorite = (newFavoritedState) => () => {
    // Update the favorites list in local storage.
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    const isFavorited = favorites.some(
      (favoriteDetails) => favoriteDetails.name === nameDetails.name
    );
    if (isFavorited) {
      favorites.splice(
        favorites.findIndex(
          (favoriteDetails) => favoriteDetails.name === nameDetails.name
        ),
        1
      );
    } else {
      favorites.push({
        ...nameDetails,
        dateFavorited: new Date(),
      });
    }
    localStorage.setItem("favorites", JSON.stringify(favorites));

    // Update the favorites state.
    setFavorites(favorites);
  };

  const onDeleteFavorite = (favoriteDetails) => () => {
    // Update the favorites list in local storage.
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    favorites.splice(
      favorites.findIndex(
        (favoriteDetails) => favoriteDetails.name === nameDetails.name
      ),
      1
    );
    localStorage.setItem("favorites", JSON.stringify(favorites));

    // Update the favorites state.
    setFavorites(favorites);
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    // Escape early if we are loading.
    if (loading) {
      return;
    }

    // Show loading indicator.
    setLoading(true);

    // Dynamically import the file.
    const file =
      gender === "F"
        ? await import("../../data/female.json")
        : await import("../../data/male.json");

    let filteredNames = file.default;

    // Filter by the first character.
    if (startsWith) {
      filteredNames = filteredNames.filter((nameDetails) => {
        return nameDetails.name
          .toLowerCase()
          .startsWith(startsWith.toLowerCase());
      });
    }

    // Filter by max occurrences.
    if (maxOccurrences) {
      filteredNames = filteredNames.filter((nameDetails) => {
        return nameDetails.occurrences <= maxOccurrences;
      });
    }

    // Derive the name from the filtered names.
    const sampleName =
      filteredNames[Math.floor(Math.random() * filteredNames.length)];

    // Sample a random name.
    setNameDetails(sampleName);

    // Hide loading indicator.
    setLoading(false);
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        {/* Title */}
        <h1>Generate a baby name! 🍼👶 🎉</h1>

        {/* Data sources */}
        <DataSources
          dataSource={dataSource}
          gender={gender}
          setDataSource={setDataSource}
          setGender={setGender}
        />

        {/* Filters / Search Criteria */}
        <Filters
          lastName={lastName}
          maxOccurrences={maxOccurrences}
          setLastName={setLastName}
          setMaxOccurrences={setMaxOccurrences}
          setStartsWith={setStartsWith}
          startsWith={startsWith}
        />

        {/* Submit */}
        <button disabled={loading} type="submit">
          {loading ? "Generating..." : "Generate Name"}
        </button>

        {/* Generated */}
        {nameDetails?.name && (
          <div className="generated">
            <h2>
              {nameDetails?.name} {lastName}
            </h2>
            <a
              href={`https://www.babynamespedia.com/meaning/${nameDetails?.name}`}
              rel="noreferrer noopener"
              target="_blank"
            >
              <img alt="external link" className="link" src={link} /> Meaning
            </a>
            <p>Gender: {nameDetails?.gender === "M" ? "Male" : "Female"}</p>
            <p>Occurrences: {nameDetails?.occurrences}</p>
            <p>Year: {nameDetails?.year}</p>
            <button
              className="favorite-toggle"
              onClick={onFavorite(nameDetails)}
              type="button"
            >
              {favorites.some(
                (favoriteDetails) => favoriteDetails.name === nameDetails.name
              )
                ? "Unfavorite"
                : "Favorite"}
            </button>
          </div>
        )}
      </form>

      {/* Favorites */}
      {favorites?.length ? (
        <div className="favorites">
          <h2>Favorites</h2>
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
              <p>
                Gender: {favoriteDetails?.gender === "M" ? "Male" : "Female"}
              </p>
              <p>Occurrences: {favoriteDetails?.occurrences}</p>
              <p>Year: {favoriteDetails?.year}</p>
            </div>
          ))}
        </div>
      ) : null}
    </>
  );
}

export default App;
