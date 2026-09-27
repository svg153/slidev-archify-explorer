const plugins = [
  ["@semantic-release/commit-analyzer", { preset: "conventionalcommits" }],
  ["@semantic-release/release-notes-generator", { preset: "conventionalcommits" }],
];

// Keep npm publishing off until the owner bootstraps the package and enables OIDC.
if (process.env.NPM_PUBLISH_ENABLED === "true") {
  plugins.push("@semantic-release/npm");
}

plugins.push(["@semantic-release/github", { successComment: false }]);

module.exports = { branches: ["main"], plugins };
