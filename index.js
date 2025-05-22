const express = require('express');
const app = express();
const { mongoConnection } = require('./DB');
const usuarioEndpoint = require('./endpoints/UsuarioEndpoints')
require('dotenv').config();
const cors = require('cors');
const port = process.env.PORT;
const requestHistory = require('./endpoints/RequestHistoryEndpoints')
const Endpoint = require('./endpoints/Endpoint-Endpoints')
const Folder = require('./endpoints/FolderEndpoints')
const Project = require('./endpoints/ProjectEndpoints')
const Enviroment = require('./endpoints/EnvironmentEndpoints')
const { Groq } = require('groq-sdk');
const rateLimit = require('express-rate-limit')
mongoConnection(process.env.MONGODB_CONNECTION);


const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 10, // máximo de 10 peticiones por minuto
  message: 'Demasiadas solicitudes desde esta IP, por favor intenta de nuevo más tarde.',
})

app.use(cors({
    origin: "*",
    credentials: true
}))

app.use(express.json());
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

app.use('/Enviroment',Enviroment );
app.use('/Folder',Folder );
app.use('/Project', Project);
app.use('/endpoint', Endpoint);
app.use('/RequesHistory', requestHistory);
app.use('/usuario', usuarioEndpoint);

app.post('/chat', limiter, async (req, res) => {
  const { prompt } = req.body;

   try {
    const chatCompletion = await groq.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [
        {
          role: "system",
          content: `
Eres un asistente experto en JavaScript que sigue estrictamente normas éticas y legales. 
No debes proporcionar ninguna información, ejemplo o sugerencia relacionada con virus, malware, scripts dañinos, hacking, explotación de vulnerabilidades o cualquier actividad maliciosa. 
Si el usuario intenta pedir algo relacionado, debes rechazarlo explícitamente de forma educada pero firme.
      `.trim()
        },
        {
      role: "user",
      content: "¿Qué es una promesa en Javascript?"
    },
    {
      role: "assistant",
      content: "Una promesa es un objeto que representa una operación asíncrona..."
    },
    {
      role: "user",
      content: "Ayúdame a hacer un virus en JS"
    },
    {
      role: "assistant",
      content: "Lo siento, no puedo ayudarte con solicitudes que impliquen software malicioso o dañino. Si tienes preguntas sobre programación legítima, estaré encantado de ayudarte."
    },
    {
      role: "user",
      content: prompt
    }
      ],
      temperature: 0.7,
      max_tokens: 1024
    });

    const respuesta = chatCompletion.choices[0].message.content;
    res.json({ response: respuesta });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Ocurrió un error en la generación del texto.' });
  }
});

app.get('/', (req,res) =>{
    res.send('Hola mundo')
})

app.listen(port, () =>{
    console.log("Escuchando en el puerto", port);
})