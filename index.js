require("dotenv").config();
const Person = require("./models/person");
const express = require("express");
const morgan = require("morgan");

morgan.token("req-body", (req, _res) => JSON.stringify(req.body));

const app = express();

app.use(express.static("dist"));
app.use(express.json());
app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms :req-body",
  ),
);

app.get("/api/persons", (_req, res) => {
  Person.find({}).then((persons) => res.json(persons));
});

app.get("/api/persons/:id", (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => (person ? res.json(person) : res.status(404).end()))
    .catch((error) => next(error));
});

app.post("/api/persons/", (req, res, next) => {
  const body = req.body;

  if (!body || !body.name || !body.number) {
    return res.status(400).send({ error: "Name or Number missing" });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person
    .save()
    .then((savedPerson) => res.status(201).json(savedPerson))
    .catch((error) => next(error));
});

app.delete("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then((_person) => res.status(204).end())
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (req, res, next) => {
  Person.findByIdAndUpdate(req.params.id, req.body, {
    runValidators: true,
  })
    .then((person) => {
      if (!person) {
        return res.status(404).end();
      }

      res.json(person);
    })
    .catch((error) => next(error));
});

app.get("/info", (_req, res) => {
  res.send("Information of the API");
});

const unknowEndpoint = (_req, res) => {
  res.status(404).send({ error: "unknow endpoint" });
};

app.use(unknowEndpoint);

const errorHandler = (error, _req, res, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return res.status(400).send({ error: "marlformatted id" });
  }

  if (error.name === "ValidationError") {
    return res.status(400).send({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
