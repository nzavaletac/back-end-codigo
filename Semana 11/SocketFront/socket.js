const socket = io('http://127.0.0.1:3000');
const input = document.getElementById('mensaje')
const btnEnviar = document.getElementById('btnEnviar');
const username = document.getElementById('username');
const btnRegistrar = document.getElementById('btnIngresar');
const login = document.getElementById('login');
const chat = document.getElementById('chat');
// chat.style.display = "none";
const estado = document.getElementById('estado');
const listaMensajes = document.getElementById('listaMensajes');
// para poder ver si el backend esta funcionando correctamente  llamo al metodo connect
socket.on('connect', ()=>{
    console.log(socket.id); // id del socket, es el mismo el front que el back
    if (socket.connected){
        estado.classList.remove('bg-danger');
        estado.classList.add('bg-success');
        estado.innerText = "ONLINE";
    }
    console.log(socket.connected);
    console.log(socket.disconnected);
});
socket.on('disconnect',(reason)=>{
    // me devuelve (al igual que en el back la razon por la cual se desconecto y las razones son las mismas)
    // io server disconnect
    // io client disconnect
    // ping timeout
    // transport close
    // transport error
    console.log(reason);
    estado.classList.remove('bg-success');
    estado.classList.add('bg-danger');
    estado.innerText = "OFFLINE";
    console.log('me desconecte!');
})
btnRegistrar.addEventListener('click', (e)=>{
    // la forma de desconectarnos del sistema de socket manualmente
    // socket.disconnect()
    // la forma de conectarme manualmente al sistema de socket
    // socket.open()
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
    listaMensajes.innerHTML = '';
    console.log(mensajes);
    for (const key in mensajes) {
        const mensaje = document.createElement('li');
        mensaje.className = 'list-group-item';
        mensaje.innerText = `${mensajes[key].cliente} dice: ${mensajes[key].mensaje}`;
        listaMensajes.appendChild(mensaje);
        input.value = '';
    }
})
socket.on('lista-usuarios', (usuarios)=>{
    // login.style.display ="none";
    // chat.style.display = "";
    console.log(usuarios);
})