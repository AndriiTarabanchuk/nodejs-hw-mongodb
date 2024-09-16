import express from "express";

export const startServer = () => {
  const app = express();

  const PORT = 3000;

  app.get("/", (req, res) => {
    res.json({
      message: "Hello world",
    });
  });

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};
