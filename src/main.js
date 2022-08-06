
import express from 'express'
import { Server as HttpServer }  from 'http'
import { Server as IOServer } from 'socket.io'
const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)


//------------------Configuracion EJS---------------------------------//
app.set('views', './views')
app.set('view engine', 'ejs')


app.get('/', (req, res) => {
    res.render('pages/index')
})



//-----------Containers Knex para Bases de Datos MySQL y SQLite3-----------//

import { optionMySQL , optionSQLite } from "./options/options.js";
import { ContainerDB } from "./container/container.js";

const containerProducts = new ContainerDB(optionMySQL)
const containerMessages = new ContainerDB(optionSQLite)

const prod = [                   // Productos a cargar por defecto
    {
        title: 'Paper plane' , price: 100 ,
        thumbnail: 'https://cdn3.iconfinder.com/data/icons/education-209/64/plane-paper-toy-science-school-512.png'
    },
    {
        title: 'Ruler' ,
        price: 200 ,
        thumbnail: 'https://cdn3.iconfinder.com/data/icons/education-209/64/ruler-triangle-stationary-school-512.png'
    },
    {
        title: 'Pen' ,
        price: 125 ,
        thumbnail: 'https://cdn3.iconfinder.com/data/icons/education-209/64/pencil-pen-stationery-school-512.png'
    }
]

await containerProducts.newTable()           // Creo tabla porducts
await containerMessages.newTable()           // Creo tabla messages
await containerProducts.save(prod)           // Guardo porductos en tabla products


//--------------------------Websockets----------------------------//

io.on('connection', async (socket) => {
    console.log('Nuevo cliente conectado!')

    /* Envio los productos y mensajes al cliente que se conectó */
    socket.emit('products', await containerProducts.getAll())
    socket.emit('messages', await containerMessages.getAll())

    /* Escucho el nuevo producto enviado por el cliente y se los propago a todos */
    socket.on('newProduct', async (newProduct) => {
            await containerProducts.save(newProduct)
            console.log(newProduct)
            io.sockets.emit('products', await containerProducts.getAll())
        })

    /* Escucho el nuevo mensaje de chat enviado por el cliente y se los propago a todos */
    socket.on('newMessage', async (res) =>{
        await containerMessages.save(res)
        console.log(res)
        io.sockets.emit('messages', await containerMessages.getAll())
    })
})


//------------------Configuracion Server---------------------------------//

const PORT = 8081
const server = httpServer.listen(PORT, ()=>{
    console.log(`Servidor escuchando en el puerto ${server.address().port}`)
})
server.on(`error`, error => console.log(`Error en servidor: ${error}`))
