const socket = io('http://127.0.0.1:3000');
const input = document.getElementById('mensaje')
const btnEnviar = document.getElementById('btnEnviar');
const username = document.getElementById('username');
const btnRegistrar = document.getElementById('btnIngresar');
const login = document.getElementById('login');
const chat = document.getElementById('chat');
chat.style.display = "none";

btnRegistrar.addEventListener('click', (e)=>{
    e.preventDefault();
    // mandar el username al socket y que este lo reciba y lo imprima en pantalla
    socket.emit('registrar',username.value);
})
btnEnviar.addEventListener('click',(e)=>{
    e.preventDefault();
    const mensaje = input.value;
    // emit sirve para mandar mediante 'la ruta' un contenido para que lo pueda recibir el back (socket)
    socket.emit('mensaje-nuevo', mensaje);
})
socket.on('enviar-mensajes', (mensajes)=>{
    console.log(mensajes);
})
socket.on('lista-usuarios', (usuarios)=>{
    login.style.display ="none";
    chat.style.display = "";
    console.log(usuarios);
})