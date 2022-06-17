// Node modules.
const fs = require("fs");
const path = require("path");

// Get all the txt files in the data directory.
const txtFiles = fs.readdirSync(path.join(__dirname, "../data"));

// Show spinner.
console.log("Creating JS object... 🕓");

// Read each file and convert each row to a list item.
const defaultNamesLookup = txtFiles.reduce(
  (namesLookup, file) => {
    const filePath = path.join(__dirname, "../data", file);
    const fileContents = fs.readFileSync(filePath, "utf8");
    const lines = fileContents.split("\n");
    const fileListItems = lines
      .filter((line) => !!line)
      .map((line) => {
        // Convert each line to a list item with a ',' delimiter.
        return {
          // Parse the year from the file name.
          year: parseInt(file.split(".")[0].split("yob")[1]),
          name: line.split(",")[0],
          gender: line.split(",")[1],
          occurrences: parseInt(line.split(",")[2].replace("\r", "")),
        };
      });
    namesLookup["male"] = [
      ...namesLookup["male"],
      ...fileListItems.filter((item) => item.gender === "M"),
    ];
    namesLookup["female"] = [
      ...namesLookup["female"],
      ...fileListItems.filter((item) => item.gender === "F"),
    ];
    return namesLookup;
  },
  { male: [], female: [] }
);

// Log building json file.
console.log("✅ Built up data structure successfully!");
console.log("Building male.json file... 🕓");

// Create a `male.json` file in the data directory that includes the default male names.
fs.writeFileSync(
  path.join(__dirname, "../src/data", "male.json"),
  JSON.stringify(defaultNamesLookup["male"], null, 2),
  "utf8"
);

// Log building json file.
console.log("✅ Built src/data/male.json successfully!");
console.log("Building female.json file... 🕓");

// Create a `female.json` file in the data directory that includes the default female names.
fs.writeFileSync(
  path.join(__dirname, "../src/data", "female.json"),
  JSON.stringify(defaultNamesLookup["female"], null, 2),
  "utf8"
);
