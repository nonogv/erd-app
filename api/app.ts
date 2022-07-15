import express from "express";

const app = express();

const port = process.env.PORT || 4000;

app.get('/', (_: unknown, res: any) => {
  res.send('Home Route');
});

app.listen(port, () =>
  console.log(`Server running on port ${port}, http://localhost:${port}`)
);