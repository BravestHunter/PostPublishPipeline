import express from "express";

const app = express();

/** liveness probe */
app.get("/healthz", (_req, res) => res.send("OK"));

const port = process.env.PORT ? Number(process.env.PORT) : 8080;
app.listen(port, () => console.log(`[content-filter] up on :${port}`));