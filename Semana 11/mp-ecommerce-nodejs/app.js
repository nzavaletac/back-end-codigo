var express = require('express');
var bodyParser = require('body-parser');
var exphbs  = require('express-handlebars');
var port = process.env.PORT || 3000
const mercadopago = require('mercadopago');
var app = express();
app.use(bodyParser.json());
// primero debemos inicializar nuestra referencia de mercado pago con las tokens que nos brinda la pagina de desarroladores (una vez que saquemos la certificacion mercado pago nos dara nuestras propias tokens de acceso)
// access_token: esta token se generar por cada establecimiento que desee integrar la pasarela de pagos de mercadopago
// integrator_id: es el identificador de cada desarrollador certificado por mercadopago
mercadopago.configure({
    access_token: 'APP_USR-8208253118659647-112521-dd670f3fd6aa9147df51117701a2082e-677408439',
    integrator_id: 'dev_2e4ad5dd362f11eb809d0242ac130004'
})
// el front deberia de mandarme el id del usuario para jalar toda su informacion (nombre, apellido, email, telefono, identificacion, direccion)
const comprador = {
    name: 'Lalo',
    surname: 'Landa',
    email: 'test_user_46542185@testuser.com',
    phone: {
        area_code: '52',
        number: 5549737300
    },
    identification: {
        type: 'DNI',
        number: '22334445'
    },
    address: {
        zip_code: '03940',
        street_name: 'Insurgentes Sur',
        street_number: 1602
    }
}
// opcionalmente los metodos de pago
const metodos_pago = {
    installments: 6, // con esto defino el maximo numero de cuotas que puede permitir mi pasarela de pagos
    excluded_payment_methods: [
        {
            id: 'diners'
        }
    ],
    excluded_payment_types: [
        {
            id: 'atm'
        }
    ]
}
// crear mi preferencia => es juntar el cliente, con los metodos de pago, con los items y configuraciones adicionales
let back_urls = {
    success: '',
    pending: '',
    failure: ''
};
let preference = {
    items: [], // aca iran todos los items que el cliente quiere comprar
    payer : comprador,
    payment_methods : metodos_pago,
    back_urls: back_urls, // sirven para mostrar el resultado luego que el cliente completo la compra, la pasarela de pagos lo redireccionara a estas
    notification_url : '', //aquí va a ser donde mercado pago nos mande las actualizaciones de nuestro pago
    statement_descriptor: 'MITIENDA', // el detalle que va a aparecer en la aplicacion bancaria del cliente
    auto_return: 'approved', // una vez que se completo el pago pasado 5seg se retornara a la pagina de la tienda dependiendo del estado del proceso 
    external_reference: 'ederiveroman@gmail.com', // sirve para validar con el integrator id para ver si esta correcta la integracion
}
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.use(express.static('assets'));
 
app.use('/assets', express.static(__dirname + '/assets'));

app.get('/', function (req, res) {
    res.render('home');
});

app.get('/detail', async function (req, res) {
    // req.get('host'); => sirve para capturar el dominio actual de mi aplicacion
    // acá se trabaja la logica de la preferencia
    // llenar los items
    const item = {
        id: '1234',
        title: req.query.title,
        description: 'Dispositivo móvil de Tienda e-commerce',
        picture_url: req.get('host') + req.query.img.slice(1),
        quantity: +req.query.unit,
        currency_id: 'PEN',
        unit_price: +req.query.price
    }
    // las back_urls sirven para ver el estado del proceso de pago que realizo mercado pago, NOTA: no confundir el resultado con las notificaciones que aun me puede estar mandando mercadopago
    preference.back_urls.success = `${req.get('host')}/success`;
    preference.back_urls.pending = `${req.get('host')}/pending`;
    preference.back_urls.failure = `${req.get('host')}/failure`;
    preference.items = [];
    preference.items.push(item);
    // no podemos poner una url que nos notifique que sea ni localhost ni 127.0.0.1 
    preference.notification_url = `${req.get('host')}/notificaciones_mercadopago`; // para saber que hace ver linea 57
    try {
        const respuestaMP = await mercadopago.preferences.create(preference);
        console.log(respuestaMP);
        req.query.init_point = respuestaMP.body.init_point;
        // cuando nosotros hacemos uso del checkout PRO no podemos usar el valor auto_return 
        req.query.id_mp = respuestaMP.body.id;
    } catch (error) {
        console.error(error);
    }
    res.render('detail', req.query);
});
// Crear tres endpoints metodo get que van a servir para usar el success - pending - failure 
// en los cuales renderizar un html 
// en el html mostrar el payment_method external_reference y payment_id (success)
// en los otros dos indicar que el pago esta pendiente (pending) o que el pago fallo (failure)
app.get('/success', function(req,res){
    res.render('success', req.query)
})

app.get('/failure', function(req,res){
    res.render('failure', req.query)
})
app.get('/pending', function(req,res){
    res.render('pending', req.query)
})

app.post('/notificaciones_mercadopago', function(req, res){
    console.log('Esto es el query:');
    console.log(req.query);
    console.log('Esto es el body:');
    console.log(req.body);
    res.status(200).send('received');
})

app.listen(port);