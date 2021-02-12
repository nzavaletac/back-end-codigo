const socket = io('http://127.0.0.1:3000');
const input = document.getElementById('mensaje')
const btnEnviar = document.getElementById('btnEnviar');

btnEnviar.addEventListener('click',(e)=>{
    e.preventDefault();
    const mensaje = input.value;
    // emit sirve para mandar mediante 'la ruta' un contenido para que lo pueda recibir el back (socket)
    socket.emit('mensaje-nuevo', mensaje);
})

socket.on('enviar-mensajes', (mensajes)=>{
    console.log(mensajes);
})