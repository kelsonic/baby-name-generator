// Node modules.
import moment from "moment";
import { useState } from "react";
// Relative imports.
import "./styles.css";

function App() {
  // Derive the state we need.
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem("favorites") || "[]")
  );
  const [gender, setGender] = useState("M");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [maxOccurrences, setMaxOccurrences] = useState("10000");
  const [nameDetails, setNameDetails] = useState("");
  const [startsWith, setStartsWith] = useState("");

  const onLastNameChange = (event) => {
    setLastName(event.target.value);
  };

  const onMaxOccurrencesChange = (event) => {
    setMaxOccurrences(event.target.value);
  };

  const onStartsWithChange = (event) => {
    setStartsWith(event.target.value);
  };

  const onGenderChange = (newGender) => (event) => {
    setGender(newGender);
  };

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
      <form className="App" onSubmit={onSubmit}>
        {/* Title */}
        <h1>Generate a baby name! 🍼👶 🎉</h1>

        <p className="subtitle">
          All data comes from{" "}
          <a
            href="https://www.ssa.gov/oact/babynames/"
            rel="noreferrer noopener"
            target="_blank"
          >
            SSA.gov
          </a>
          .
        </p>

        <div className="fields">
          {/* Gender */}
          <button
            className={`gender${gender === "M" ? " selected" : ""}`}
            onClick={onGenderChange("M")}
            type="button"
          >
            Male
          </button>
          <button
            className={`gender${gender === "F" ? " selected" : ""}`}
            onClick={onGenderChange("F")}
            type="button"
          >
            Female
          </button>

          {/* Starts with */}
          <div className="field">
            <label htmlFor="startsWith">Starts with</label>
            <input
              autoFocus
              className="starts-with"
              id="startsWith"
              maxLength="1"
              name="startsWith"
              onChange={onStartsWithChange}
              placeholder="A"
              type="text"
              value={startsWith}
            />
          </div>

          {/* Last name */}
          <div className="field">
            <label htmlFor="lastName">Last name</label>
            <input
              className="last-name"
              id="lastName"
              onChange={onLastNameChange}
              placeholder="Adams"
              type="text"
              value={lastName}
            />
          </div>
        </div>

        {/* Max Occurrences */}
        <div className="field">
          <label htmlFor="maxOccurrences">Max Occurrences</label>
          <input
            id="maxOccurrences"
            max="10000"
            min="5"
            name="maxOccurrences"
            onChange={onMaxOccurrencesChange}
            step="1"
            type="range"
            value={maxOccurrences}
          />
          <p>{maxOccurrences}</p>
        </div>

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
