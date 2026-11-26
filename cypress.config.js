
const { defineConfig } = require("cypress");

module.exports = defineConfig({
  pageLoadTimeout: 120000,
  defaultCommandTimeout: 15000,
  retries: { runMode: 2, openMode: 1 },
  e2e: { /* ... */ },
})
