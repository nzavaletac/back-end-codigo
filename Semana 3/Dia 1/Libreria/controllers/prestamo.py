from flask_restful import Resource, reqparse
from models.prestamo import PrestamoModel

class PrestamosController(Resource):
    def get(self):
        resultado = PrestamoModel.query.all()
        respuesta = []
        for prestamo in resultado:
            respuesta.append(prestamo.devolverJson())
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
        prestamo = PrestamoModel(resultado['fecha_inicio'], resultado['fecha_fin'], resultado['cliente'], resultado['libro'])
        prestamo.save()
        return {
            'ok':True,
            'content':prestamo.devolverJson(),
            'message': 'Prestamo creado exitosamente'
        },201
        