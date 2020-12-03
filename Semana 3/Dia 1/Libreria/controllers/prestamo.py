from flask_restful import Resource, reqparse
from models.prestamo import PrestamoModel
from models.cliente import ClienteModel

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
        prestamo = PrestamoModel(resultado['fecha_inicio'], resultado['fecha_fin'], resultado['cliente'], resultado['libro'])
        prestamo.save()
        return {
            'ok':True,
            'content':prestamo.devolverJson(),
            'message': 'Prestamo creado exitosamente'
        },201
        