import mqtt from "mqtt";
import pool from "./db";

const client = mqtt.connect("mqtt://mqtt.hsl.fi");

client.on("connect", () => {
  console.log("Connected to MQTT broker");
  client.subscribe("/hfp/v2/journey/ongoing/vp/#", (err) => {
    if (err) {
      console.error("Failed to subscribe to topic");
    } else {
      console.log("Subscribed to topic");
    }
  });
});

client.on("message", async (topic, message) => {
  const data = JSON.parse(message.toString());
  if (data.VP) {
    const {
      desi: vehicle_number,
      lat: latitude,
      long: longitude,
      tst,
    } = data.VP;
    const timestamp = new Date(tst);
    try {
      const query = `
        INSERT INTO vehicles (vehicle_number, latitude, longitude, timestamp)
        VALUES ($1, $2, $3, $4)
      `;
      await pool.query(query, [vehicle_number, latitude, longitude, timestamp]);
      console.log("Data inserted");
    } catch (err) {
      console.error("Failed to insert data", err);
    }
  }
});

export default client;
