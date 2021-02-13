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
                // cliente.emit('lista-usuarios', usuarios);
                // si quieremos notificar a todos los clientes conectados deberemos utilizar un broadcast pero no se notificará al cliente actual
                // cliente.broadcast.emit('lista-usuarios', usuarios);
                this.socket.emit('lista-usuarios', usuarios)

            })
            cliente.on('mensaje-nuevo', (mensaje)=>{
                const usuario = usuarios.filter(usuario => usuario.id === cliente.id)[0];
                mensajes.push({
                    cliente: usuario.username,
                    mensaje: mensaje
                })
                // console.log(mensajes);
                // cliente.emit('enviar-mensajes',mensajes);
                // cliente.broadcast.emit('enviar-mensajes',mensajes);
                this.socket.emit('enviar-mensajes', mensajes)
            });
            cliente.on('disconnect',(reason)=>{
                console.log(reason);
                console.log('Se desconecto! :(');
                usuarios = usuarios.filter(usuario => usuario.id !== cliente.id) // sacando el usuario de la lista de usuarios conectados
                // va a notificar a todos los usuarios conectados ya sea al que mando la accion y a los demas
                this.socket.emit('lista-usuarios', usuarios) 
            });
            // no es indispensable que el emit sea una reaccion a un metodo on, se puede ejecutar independientemente y este se llamara ni bien el usuario se conecte
            this.socket.emit('lista-usuarios', usuarios) 
            this.socket.emit('enviar-mensajes', mensajes)
        })
    }
    start(){
        this.httpServer.listen(this.puerto, ()=>{
            console.log(`Servidor corriendo exitosamente en el puerto ${this.puerto}`);
        })
    }
}