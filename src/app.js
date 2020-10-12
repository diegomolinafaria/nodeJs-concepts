const express = require("express");
const cors = require("cors");

const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs, like } = request.body;
  const repository = { id: uuid(), title, url, techs, likes: 0};
  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repoIndex = repositories.findIndex(r => r.id === id);

  if (repoIndex < 0) {
      return response.status(400).json({error: "Repository not found"});
  }
  const likeCount = repositories[repoIndex].likes
  const repository = { id, title, url, techs, likes : likeCount };

  repositories[repoIndex] = repository;
  return response.status(200).json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex(r => r.id === id);

  if (repoIndex < 0) {
      return response.status(400).json({error: "Repository not found"});
  }

  repositories.splice(repoIndex, 1);
  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  
  const repoIndex = repositories.findIndex(r => r.id === id);

  if(repoIndex < 0){
    return response.status(400).json({error: 'Id not found.'});
  }

  const repository = repositories[repoIndex];
  const incrementLike = 1;
  repository.likes += incrementLike;
  return response.status(201).json(repository);
});

module.exports = app;
