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
        let usuarios = [];
        let mensajes = [];
        this.socket.on('connect', (cliente)=>{
            console.log(cliente.id);
            // proximamente salas....
            // console.log(cliente.rooms);
            // cliente.join('room1');
            // console.log(cliente.rooms);
            cliente.on('registrar',(username)=>{
                const objUsuario = {
                    id: cliente.id,
                    username: username
                }
                usuarios.push(objUsuario);
                // el metodo emit solamente sirve para retornarnos la emision al mismo usuario
                cliente.emit('lista-usuarios', usuarios);
                // si quieremos notificar a todos los clientes conectados deberemos utilizar un broadcast pero no se notificará al cliente actual
                cliente.broadcast.emit('lista-usuarios', usuarios);

            })
            
            cliente.on('mensaje-nuevo', (mensaje)=>{
                console.log(mensaje);
                cliente.emit('enviar-mensajes',['hola','hola amigo','vamos a montar bici?'])
            });
            cliente.on('disconnect',(reason)=>{
                console.log(reason);
                console.log('Se desconecto! :(');
            });
        })
    }







    start(){
        this.httpServer.listen(this.puerto, ()=>{
            console.log(`Servidor corriendo exitosamente en el puerto ${this.puerto}`);
        })
    }
}