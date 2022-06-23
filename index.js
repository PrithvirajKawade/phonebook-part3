

const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')

app.use(cors())

app.use(express.json())
let persons= [
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

app.get('/api/persons', (request,response) => {
    console.log(request)
    response.send(persons)
})
app.get('/info', (request,response) => {
    console.log(request,response)
    response.write(`Phonebook has info for ${persons.length} people \n`)
    response.write(`${new Date()}`)
    response.end()
    // response.send(`Date ${new Date()}`)
})

app.get('/api/persons/:id', (request,response) => {
    const id = Number(request.params.id)
    console.log(request)
    const person = persons.find(person => person.id === id)
    if(person){
        response.json(person)
    }else{
        response.status(404).end()
    }
    
})
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })

app.post('/api/persons', (request, response) => {
    const body = request.body
    const nameCheck = persons.every(person=> person.name !== body.name)
    console.log("namecheck", nameCheck)


    if(!body.name){
      return response.status(404).json({
        error: 'Name is missing'
      })
    }else if(!body.number){
      return response.status(404).json({
        error: 'Number is missing'
      })
    }else if(nameCheck === false){
      return response.status(404).json({
        error: 'Name already exists'
      })
    }
    // person.id = 
    const person = {
      ...body,
      id: Number(Math.random().toFixed(4))
    }
    
    persons = persons.concat(person)
    // console.log(persons)
    response.json(person)
    // console.log(response)
  })


  app.use(morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      JSON.stringify(req.body)
    ].join(' ')
  }))

const PORT = process.env.PORT || '8080'
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})