import express from "express";
import { createClient } from "@google/maps";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const api = process.env.api;

if (!api) {
    throw new Error("Please set the API key in the environment variable 'api'");
}

const googleMapsClient = createClient({
    key: api,
});

app.get("/geocode", async (req, res) => {
    const address = typeof req.query.address === "string" ? req.query.address : undefined;

    if (!address) {
        return res.status(400).send({ error: "Address is required" });
    }

    try {
        // Notez que nous avons dû faire un cast pour indiquer à TypeScript de quel type est la réponse.
        const results = await test(address);

        if (!results) {
            return res.status(500).send({ error: "Failed to fetch data" });
        }

        res.send(results);
    } catch (err) {
        return res.status(500).send({ error: "Failed to fetch data", details: (err as any).message });
    }
});

async function test(address: string) {
    const response = await new Promise((resolve, reject) => {
        googleMapsClient.geocode({ address: address }, (err, response) => {
            if (err) {
                reject(err);
            } else {
                resolve(response.json.results[0].geometry.location);
            }
        });
    });
    console.log(response);

    return response;
}

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
