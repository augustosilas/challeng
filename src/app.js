const express = require("express");
const cors = require("cors");

const { isUuid, uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  if (!title && !url && !techs) {
    return response
      .status(400)
      .json({ error: "Not found title, url or techs" });
  }

  const newRepositore = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };
  repositories.push(newRepositore);

  return response.status(201).json(newRepositore);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const newRepository = request.body;

  if (!isUuid(id)) {
    return response.status(400).json({ error: "Id is not uuid" });
  }

  const repository = repositories.find((repositore) => repositore.id === id);

  if (!repository) {
    return response.status(400).json({ error: "Not found repositore" });
  }
  if (repository.title) repository.title = newRepository.title;
  if (repository.url) repository.url = newRepository.url;
  if (repository.techs) repository.techs = newRepository.techs;
  // console.log(repository);
  return response.status(200).json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  if (!isUuid(id))
    return response.status(400).json({ error: "Id is not uuid" });

  const indexRepository = repositories.findIndex(
    (repository) => repository.id === id
  );

  repositories.splice(indexRepository, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  if (!isUuid(id))
    return response.status(400).json({ error: "Id is not uuid" });

  const repository = repositories.find((repository) => repository.id === id);

  repository.likes += 1;

  return response.json(repository);
});

module.exports = app;
