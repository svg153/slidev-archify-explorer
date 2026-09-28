const plugins = [
  ["@semantic-release/commit-analyzer", { preset: "conventionalcommits" }],
  ["@semantic-release/release-notes-generator", { preset: "conventionalcommits" }],
];

// npm publishing stays opt-in until the repository variable enables Trusted Publishing.
if (process.env.NPM_PUBLISH_ENABLED === "true") {
  plugins.push("@semantic-release/npm");
}

plugins.push(["@semantic-release/github", { successComment: false }]);

module.exports = { branches: ["main"], plugins };
