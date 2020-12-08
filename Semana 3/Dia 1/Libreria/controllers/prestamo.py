from flask_restful import Resource, reqparse
from models.prestamo import PrestamoModel
from models.cliente import ClienteModel
from models.libro import LibroModel
from datetime import datetime

class PrestamosController(Resource):
    def get(self):
        resultado = PrestamoModel.query.all()
        respuesta = []
        for prestamo in resultado:
            respuesta.append(prestamo.devolverJson())
            print(prestamo.clientePrestamo.devolverJson())
        return {
            'ok':True,
            'message':None,
            'content': respuesta
        }
    def post(self):
        parseador = reqparse.RequestParser()
        parseador.add_argument(
            'fecha_inicio',
            required=True,
            type=str,
            location='json',
            help='Falta el fecha inicio'
        )
        parseador.add_argument(
            'fecha_fin',
            required=True,
            type=str,
            location='json',
            help='Falta el fecha fin'
        )
        parseador.add_argument(
            'cliente',
            required=True,
            type=int,
            location='json',
            help='Falta el cliente'
        )
        parseador.add_argument(
            'libro',
            required=True,
            type=int,
            location='json',
            help='Falta el libro'
        )
        resultado = parseador.parse_args()
        # al momento de ingresar un nuevo prestamo,
        # usar 
        # from datetime import datetime
        # datetime.date(datetime.now()) esto lo comparan con la fecha de entrega de mi usuario
        # datetime.now()
        # 1. que verifique que el usuario no tenga algun libro pendiente de devolucion 
        # 2. vea si existen ejemplares de ese libro a prestar (o sea que los prestamos actuales de ese libro no superen a la cantidad del mismo)
        # 3. que al momento de realizar el prestamo el libro y el cliente esten con estado True
        # fechaActual = datetime.date(datetime.now())
        prestamoCliente = PrestamoModel.query.filter_by(cliente=resultado['cliente']).all()
        # SELECT * FROM T_PRESTAMO WHERE CLI_ID = RESULTADO['CLIENTE']
        # print(prestamoCliente)
        restriccion = 0 # es una bandera (flag)
        if prestamoCliente:
            # la persona tiene un historial de prestamos
            for prestamo in prestamoCliente:
                # print(prestamo.fechentrega_prestamo)
                if prestamo.fechentrega_prestamo is None:
                    # la fecha de entrega es la fecha en la cual el cliente va a devolver el libro (aun no estamos controlado las penalidades que pudiese haber) y si no hay fecha de entrega significa que el cliente no ha devuelto el libro
                    restriccion += 1 # restriccion = restriccion + 1
        else:
            # la persona nunca ha realizado un prestamo
            pass
        
        # VALIDAR LA CANTIDAD DE LIBROS QUE HAY VS LOS QUE HAN SIDO PRESTADOS
        libro = LibroModel.query.filter_by(id_libro=resultado['libro']).first()
        librosPrestados = 0
        for prestamo in libro.prestamosLibro:
            if prestamo.fechentrega_prestamo is None:
                librosPrestados += 1
        if libro.cantidad_libro > librosPrestados:
            # si la cantidad que yo tengo en mi libreria es mayor que la cantidad de libros que he prestado y aun no han devuelto significa que todavia puedo prestar esos ejemplares
            # si se puede prestar el ejemplar
            pass
        else:
            # no puedo porque la cantidad de libros prestados es igual que la cantidad de ejemplares que tengo en mi libreria
            restriccion += 1
        
        # validar si el usuario y el libro estan habilitados
        # si no estan habilitados incrementar la restriccion
        cliente = ClienteModel.query.filter_by(id_cliente=resultado['cliente']).first()
        # if (libro.estado not True) or (cliente.estado not True):
        if (libro.estado==False) or (cliente.estado==False):
            # el or sirve para decir que basta con que una o mas de las condiciones se cumpla para que todo sea verdadero e ingrese a la condicional
            # o el libro o el cliente no estan disponibles para el prestamo
            restriccion += 1
        if restriccion == 0:
            # si la bandera (flag) sigue con su valor inicial significa que no ha entrado a ningun error
            prestamo = PrestamoModel(resultado['fecha_inicio'], resultado['fecha_fin'], resultado['cliente'], resultado['libro'])
            prestamo.save()
            return {
                'ok':True,
                'content': prestamo.devolverJson(),
                'message': 'Prestamo creado exitosamente'
            },201
        else:
            return {
                'ok': False,
                'content': None,
                'message': 'No se pudo realizar el prestamo, verifique los datos e intente nuevamente'
            }, 401