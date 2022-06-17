// Node modules.
import React from "react";
import PropTypes from "prop-types";
// Relative imports.
import "./styles.scss";

const Filters = ({
  lastName,
  maxOccurrences,
  setLastName,
  setMaxOccurrences,
  setStartsWith,
  startsWith,
}) => {
  const onLastNameChange = (event) => {
    setLastName(event.target.value);
  };

  const onMaxOccurrencesChange = (event) => {
    setMaxOccurrences(event.target.value);
  };

  const onStartsWithChange = (event) => {
    setStartsWith(event.target.value);
  };

  return (
    <div className="filters-wrapper">
      <div className="fields">
        {/* Starts with */}
        <div className="field">
          <label htmlFor="startsWith">Starts with</label>
          <input
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
    </div>
  );
};

Filters.propTypes = {
  lastName: PropTypes.string.isRequired,
  maxOccurrences: PropTypes.string.isRequired,
  setLastName: PropTypes.func.isRequired,
  setMaxOccurrences: PropTypes.func.isRequired,
  setStartsWith: PropTypes.func.isRequired,
  startsWith: PropTypes.string.isRequired,
};

export default Filters;
