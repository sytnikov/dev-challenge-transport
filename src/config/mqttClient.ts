import mqtt from "mqtt";

import { VehicleRepo } from "../repository/VehicleRepo";
import { VehicleCreateDtoType } from "../types/VehicleCreateDtoType";

const lastCoordinatesMap = new Map();

const client = mqtt.connect("mqtt://mqtt.hsl.fi:1883");

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
  if (!data.VP) {
    console.error("No VP data received, skipping processing");
    return;
  }

  const {
    desi: route_number,
    veh: reg_number,
    lat: latitude,
    long: longitude,
    tst: timestamp,
    spd: speed,
    dir: direction,
    oper: operator,
  } = data.VP;

  if (
    !route_number ||
    !reg_number ||
    !latitude ||
    !longitude ||
    !timestamp ||
    !speed ||
    !direction ||
    !operator
  ) {
    return;
  }

  const lastCoordinates = lastCoordinatesMap.get(reg_number);

  if (
    lastCoordinates &&
    lastCoordinates.latitude === latitude &&
    lastCoordinates.longitude === longitude
  ) {
    return;
  }

  lastCoordinatesMap.set(reg_number, { latitude, longitude });

  const vehicle: VehicleCreateDtoType = {
    route_number,
    reg_number,
    latitude,
    longitude,
    speed,
    timestamp,
    direction,
    operator,
  };

  try {
    await new VehicleRepo().createOne(vehicle);
  } catch (err) {
    console.error("Failed to insert data", err);
  }
});

export default client;
