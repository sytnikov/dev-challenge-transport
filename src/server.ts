import "dotenv/config"

import "./config/mqttClient";
import app from "./app"

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`✅ Server is running on http://localhost:${port}`);
});
