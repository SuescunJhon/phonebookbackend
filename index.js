const express = require("express");
const morgan = require("morgan");

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

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
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const person = persons.find((person) => person.id === id);

  if (!person) {
    return res.status(404).end();
  }

  res.json(person);
});

app.post("/api/persons/", (req, res) => {
  const body = req.body;

  if (!body || !body.name || !body.number) {
    return res.status(400).send({ error: "Name or Number missing" });
  }

  if (
    persons.some(
      (person) => person.name.toLowerCase() === body.name.toLowerCase(),
    )
  ) {
    return res.status(400).send({ error: "name must be unique" });
  }

  const person = {
    name: body.name,
    number: body.number,
    id: Math.trunc(Math.random() * 1000000).toString(),
  };

  persons = persons.concat(person);
  res.status(201).json(person);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  persons = persons.filter((person) => person.id !== id);
  res.status(204).end();
});

app.get("/info", (_req, res) => {
  res.send(`Phonebook has info for ${persons.length} people \n${new Date()}`);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
