# Public transport backend service

This project implements a backend service with persistent storage and REST API endpoints to compute statistics over real-time Helsinki public transport data. The service retrieves real-time positions of public transport vehicles in Helsinki and provides three key statistics via REST API endpoints.

## Table of Contents

- [Intro](#intro)
- [Features](#features)
- [Data Source](#data-source)
- [Technology](#technology)
- [Installation](#installation)
- [API Endpoints](#api-endpoints)
- [Discussion](#discussion)

## Introduction

The service connects to the DigiTransit high-frequency positioning API using MQTT client, saves the relevant data to a persistent storage, PostgreSQL database, and allows querying the data through REST API endpoints.

## Features

- Connects to the DigiTransit high-frequency positioning API using MQTT client.
- Stores real-time public transport data in a relational PostreSQL database.
- Provides three REST API endpoints to query statistics about the captured data.
- Ensures long-term stability and data integrity.

## Data Source

- **High-frequency positioning data of public transport in Helsinki**: [HFP API](https://digitransit.fi/en/developers/apis/4-realtime-api/vehicle-positions/)

## Technology

![Node.js](https://img.shields.io/badge/Node.js-22.1.0-green?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.19.2-green?style=for-the-badge&logo=express&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4.5-blue?style=for-the-badge&logo=typescript&logoColor=white)
![MQTT](https://img.shields.io/badge/MQTT-5.7.0-orange?style=for-the-badge&logo=mqtt&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-8.12.0-blue?style=for-the-badge&logo=postgresql&logoColor=white)
![Sequelize](https://img.shields.io/badge/Sequelize--typescript-2.1.6-blue?style=for-the-badge&logo=sequelize&logoColor=white)

## Installation

1. Clone repository
```sh
git clone https://github.com/sytnikov/dev-challenge-transport.git
```

2. Install dependencies
```sh
npm install
```

3. Create .env file and setup the database and environment variables in it
```sh
PORT=<yourPort>

POSTGRES_DB=<yourDbName>
POSTGRES_HOST=<yourDbHost>
POSTGRES_PORT=<yourDbPort>
POSTGRES_USERNAME=<yourDbUsername>
POSTGRES_PASSWORD=<yourDbPassword>
```

4. Start the service in the dev mode
```sh
npm run start-dev
```

## API Endpoints

### Get the three closest vehicles at the moment to a specific geo point

- **Endpoint**: `"/api/v1/vehicles/closest-vehicles"`
- **Method**: `GET`
- **Query Parameters**:
  - `latitude` (required)
  - `longitude` (required)
- **Response**: Array of three closest vehicles objects to a specific geo point with the basic information about them: route number, vehicle registration number, latitude and longitude, speed, vehicle operator and direction, and calculated distance to a specified geo point.
- **Comment**: "at the moment" is considred in the time interval [now - 5 secs; now].

### Get the average speed for each route

- **Endpoint**: `"/api/v1/vehicles/average-speed"`
- **Method**: `GET`
- **Response**: Array of objects with route number and average speed.
- **Comment**: The response time of this endpoint doesn't depend on the total amount of db entries because the aggregation table is used.

### Get metro vehicles' max speed near the office

- **Endpoint**: `"/api/v1/vehicles/metro-max-speed"`
- **Method**: `GET`
- **Response**: Array of metro vehicles with route number, vehicle number, maximum speed, time since max speed was achieved, and distance from the office at the time of max speed.


## Discussion

- The data returned by the positioning system is not always reliable - for some lines,
some data (eg. position) might be missing. As the data about geo positioning is important (especially for the first and third endpoints), it was decided discard the incoming messages with incomplete latitude or longitude data.

- During the night time, when the traffic is low, the first endpoint response can be an empty array as there are no vehicles around.

- After some data examination, it was found out that for some vehicles (specifically for metro ones), the timestamp goes ahead of the now moment, that's why the value of the time since max speed of the metro was achieved can be nagative.

- Data exploration issue: some of the metro vehicles have timestamps in the future.