// Node modules.
import React, { useState } from "react";
import PropTypes from "prop-types";
// Relative imports.
import "./styles.scss";

const DataSources = ({ dataSource, gender, setDataSource, setGender }) => {
  const [changingDataSource, setChangingDataSource] = useState(false);

  return (
    <div className="data-sources-wrapper">
      {/* Data Source Disclaimer */}
      {dataSource === "USA Nationwide" && (
        <p className="subtitle">
          Baby names currently sourced from{" "}
          <a
            href="https://www.ssa.gov/oact/babynames/"
            rel="noreferrer noopener"
            target="_blank"
          >
            SSA.gov
          </a>
          .
        </p>
      )}

      {changingDataSource ? (
        // Change Data Sources.
        <>
          <button
            className="link"
            onClick={() => setChangingDataSource(false)}
            type="button"
          >
            Hide Data Sources
          </button>
          <div className="data-sources">
            <button
              className={`data-source${
                dataSource === "USA Nationwide" ? " selected" : ""
              }`}
              onClick={() => setDataSource("USA Nationwide")}
              type="button"
            >
              USA Nationwide
            </button>
          </div>
          <hr />
        </>
      ) : (
        // Button to show data sources.
        <button
          className="link"
          onClick={() => setChangingDataSource(true)}
          type="button"
        >
          Change Data Source
        </button>
      )}

      {/* Gender */}
      <div className="genders">
        <button
          className={`gender${gender === "M" ? " selected" : ""}`}
          onClick={() => setGender("M")}
          type="button"
        >
          Male
        </button>
        <button
          className={`gender${gender === "F" ? " selected" : ""}`}
          onClick={() => setGender("F")}
          type="button"
        >
          Female
        </button>
      </div>
    </div>
  );
};

DataSources.propTypes = {
  dataSource: PropTypes.string.isRequired,
  gender: PropTypes.string.isRequired,
  setDataSource: PropTypes.func.isRequired,
  setGender: PropTypes.func.isRequired,
};

export default DataSources;
