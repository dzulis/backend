const express = require('express');
const morgan = require('morgan');
const app = express();
const mongoose = require('mongoose'); 
const path = require('path');
const { error } = require('console');


app.use(express.json());
app.use(express.static("dist"));
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'dist', 'index.html'));
// });

const mongoUrl = `mongodb+srv://jjedrzejek5:Juleczka14@dtabasepolo.mdleepc.mongodb.net/?retryWrites=true&w=majority&appName=dtabasepolo`;
mongoose.connect(mongoUrl)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((error) => console.error('❌ Error connecting to MongoDB:', error.message));


morgan.token('body', (req) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));



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
  
  Persons.findById(response.params.id)
    .then(persons =>{
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    }
    )
    .catch(error => nextTick(error));
  });
  

//usuwaie osoby 
// DELETE by MongoDB _id
app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(result => {
      if (result) {
        res.status(204).end();
      } else {
        res.status(404).json({ error: 'Person not found' });
      }
    })
    .catch(error => next(error));
});

// POST new person
app.post('/api/persons', (req, res, next) => {
  const { name, number } = req.body;

  if (!name || !number) {
    return res.status(400).json({ error: 'name or number is missing' });
  }

  const person = new Person({ name, number });

  person.save()
    .then(saved => res.json(saved))
    .catch(error => next(error));
});

// PUT update by MongoDB _id
app.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body;

  if (!name || !number) {
    return res.status(400).json({ error: 'name or number is missing' });
  }

  Person.findByIdAndUpdate(
    req.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updated => {
      if (updated) {
        res.json(updated);
      } else {
        res.status(404).send({ error: 'Person not found' });
      }
    })
    .catch(error => next(error));
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
