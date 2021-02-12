const express = require('express');
const {Server} = require('http');
const socketio = require('socket.io');

module.exports = class ServerSocket {
    constructor(){
        this.app = express();
        this.puerto = process.env.PORT || 3000;
        this.httpServer = new Server(this.app);
        this.socket = socketio(this.httpServer,{
            cors:'*'
        });
        this.misSockets();
    }
    misSockets(){
        // El metodo ON me sirve para recibir una llamada del client
        // en los sockets existen metodos preestablecidos que solamente podemos interactuar con ellos y estos son : connect, disconnect
        this.socket.on('connect', (cliente)=>{
            console.log(cliente.id);
            cliente.on('disconnect',(reason)=>{
                console.log(reason);
                console.log('Se desconecto! :(');
            });
            cliente.on('mensaje-nuevo', (mensaje)=>{
                console.log(mensaje);
                cliente.emit('enviar-mensajes',['hola','hola amigo','vamos a montar bici?'])
            })
        })
    }







    start(){
        this.httpServer.listen(this.puerto, ()=>{
            console.log(`Servidor corriendo exitosamente en el puerto ${this.puerto}`);
        })
    }
}