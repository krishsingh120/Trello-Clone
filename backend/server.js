// Starts the Express server using the configured port.
const app = require('./src/app');
const { PORT } = require('./src/config/serverConfig');

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
