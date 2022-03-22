require('dotenv').config()
const express=require('express')
const app=express()
const cors=require('cors')
const Note=require('./models/note')
app.use(cors())
app.use(express.json())


const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
  return maxId + 1
}
app.get('/',(request,response)=>{
    response.send('<h1>Hello World!</h1>')
})
app.get('/api/notes',(request,response,next)=>{
  Note.find({}).then(notes=>{
    if (notes){
    response.json(notes)
    }
    else{
      response.status(404).end()
    }

  })  
  .catch(error=>
    {next(error)}
    )
})
app.get('/api/notes/:id',(request,response,next)=>{
Note.findById(request.params.id).then(note=>{
  if (notes){
    response.json(notes)
    }
    else{
      response.status(404).end()
    }
   
  })  
  .catch(error=>
    next(error)
    )
})
app.post('/api/notes',(request,response,next)=>{
    const body=request.body
    if (!body.content) {
      return response.status(400).json({ 
        error: 'content missing' 
      })
    }
    const note = new Note({
      content: body.content,
      important: body.important || false,
      date: new Date()
      
    })
   note.save().then(savedNote=>{
    response.json(savedNote)
  })
  .catch(error=>
    next(error)
    )
})
app.put('/api/notes/:id',(request,response)=>{
  const {content,important}=request.body
 

  Note.findByIdAndUpdate(request.params.id,{content,important},{new:true,runValidators:true,context:'query'})
 .then(savedNote=>{
  response.json(savedNote)
})
})
app.delete('/api/notes/:id',(request,response)=>{
    
    const id=Number(request.params.id)
    Note.findByIdAndRemove(id).then(result=>{
      response.status(204).end()
    })
    .catch(error=>next(error))
    
})

const port=3001
app.listen(port,()=>{
console.log(`Server Running on port ${port}`)
})
const unknownEndpoint=(request,response)=>{
  response.status(404).send({error:'Unknown Endpoint'})
}

app.use(unknownEndpoint)


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 
  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)