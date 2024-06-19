import mqtt from "mqtt";
import { Vehicle } from "../model/Vehicle";

const client = mqtt.connect("mqtt://mqtt.hsl.fi:1883");

client.on("connect", () => {
  console.log("Connected to MQTT broker");
  client.subscribe("/hfp/v2/journey/ongoing/vp/+/+/+/+/+/+/+/+/3/#", (err) => {
  // client.subscribe("/hfp/v2/journey/ongoing/vp/#", (err) => {
    if (err) {
      console.error("Failed to subscribe to topic");
    } else {
      console.log("Subscribed to topic");
    }
  });
});

client.on("message", async (topic, message) => {
  const data = JSON.parse(message.toString());
  if (!data.VP) {
    throw new Error("No payload from the service")
  }
  const {
    desi: customer_number,
    veh: reg_number,
    lat: latitude,
    long: longitude,
  } = data.VP;

  if (customer_number && reg_number && latitude && longitude) {
    const vehicle = {
      customer_number,
      reg_number,
      latitude,
      longitude
    };
    try {
      await Vehicle.create(vehicle)
      // console.log("Data inserted");
    } catch (err) {
      console.error("Failed to insert data", err);
    }
  }
});

export default client;