const express = require('express')
const morgan = require('morgan')
const app = express()


app.use(express.json())

const cors = require('cors')
app.use(cors())

morgan.token('post-data', (req, res) => req.method === 'POST' ? JSON.stringify(req.body) : '')
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-data'))

let notes = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })
  
app.get('/api/persons', (request, response) => {
    response.json(notes)
  })
  
app.get('/api/info', (request, response) => {
  const currentTime = new Date();
  const responseText = `
      <p>Phonebook has info for ${notes.length} people</p>
      <p>${currentTime}</p>
  `;
  response.send(responseText);
});

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = notes.find(note => note.id === id);
  
  if (person) {
      response.json(person);
  } else {
      response.status(404).send({ error: '404 - Person not found' });
  }
});


app.delete('/api/persons/:id', (request, response) => {
  console.log("delete");
  const id = Number(request.params.id)
  person = notes.filter(note => note.id !== id)
  
  response.status(204).end()
});


const generateId = () => {  
  return Math.round(Math.random() * 50000)
};

app.post('/api/persons', (request, response) => {
  const body = request.body
  
  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }
  
  if (notes.find(note => note.name === body.name)) {
    return response.status(400).json({ 
      error: 'name must be unique' 
    })
  }

  const note = {
    id: generateId(),
    name: body.name,
    number: body.number || false,
  }

  notes = notes.concat(note)
  response.json(note)
});


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})