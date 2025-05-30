const express = require('express');
const morgan = require('morgan');
const app = express();
const path = require('path');


app.use(express.json());
app.use(express.static("dist"));
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'dist', 'index.html'));
// });


morgan.token('body', (req) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

let persons = [
  { id: '1', name: 'Arto Hellas', number: '040-123456' },
  { id: '2', name: 'Ada Lovelace', number: '39-44-5323523' },
  { id: '3', name: 'Dan Abramov', number: '12-43-234345' },
  { id: '4', name: 'Mary Poppendieck', number: '39-23-6423122' }
];

//wyswietlanie wszystkich z książki 
app.get('/api/persons', (request, response) => {
  response.json(persons);
});

//wyswietlanie ile jest w książce
app.get('/info', (request, response) => {
  const total = persons.length;
  const date = new Date();
  response.send(`<p>Phonebook has info for ${total} people</p><p>${date}</p>`);
});

//wyswietlanie konkretnej osoby z wybranym id
app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  const person = persons.find(p => p.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

//usuwaie osoby 
app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id;
  persons = persons.filter(p => p.id !== id);
  response.status(204).end();
});

//dodawanie osoby 
app.post('/api/persons', (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'name or number missing' });
  }

  if (persons.find(p => p.name === body.name)) {
    return response.status(400).json({ error: 'name must be unique' });
  }

  const newPerson = {
    id: (Math.random() * 1000000).toFixed(0),
    name: body.name,
    number: body.number
  };

  persons = persons.concat(newPerson);
  response.json(newPerson);
});

//obsługiwanie wyjątków
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};
app.use(unknownEndpoint);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
