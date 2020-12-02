from flask_restful import Resource, reqparse
from models.libro import LibroModel

class LibrosController(Resource):
    def get(self):
        resultado = LibroModel.query.all() # SELECT * FROM T_LIBRO
        respuesta = []
        for libro in resultado:
            respuesta.append(libro.devolverJson())
            print(libro.devolverJson())
        return {
            'ok': True,
            'content':respuesta,
            'message': None
        }
    def post(self):
        parseador = reqparse.RequestParser()
        # una vez declarada la instancia de la clase RequestParser tengo que declarar que argumentos van a ser encargados de la validacion y todo argumento que no lo declare y me lo pase el front va a ser eliminado
        parseador.add_argument(
            'nombre',
            type=str,
            required=True,
            location='json',
            help='Falta el campo nombre'
        )
        parseador.add_argument(
            'edicion',
            type=str,
            required=True,
            location='json',
            help='Falta la edicion'
        )
        parseador.add_argument(
            'autor',
            type=str,
            required=True,
            location='json',
            help='Falta el autor'
        )
        parseador.add_argument(
            'cantidad',
            type=int,
            required=True,
            location='json',
            help='Falta la cantidad'
        )
        # gracias al metodo parse_args se va a validar que todos los argumentos se esten pasando de la manera correcta y si todo esta correcto va a devolver la informacion en formato de un diccionario
        resultado = parseador.parse_args()
        # creo una instancia de mi modelo 
        nuevoLibro = LibroModel(resultado['nombre'],resultado['edicion'],resultado['cantidad'],resultado['autor'])
        # hago que todos los cambios hechos sean almacenados en la bd
        nuevoLibro.save()
        print(nuevoLibro.id_libro)
        return {
            'ok':True
        }, 201

class LibroController(Resource):
    def get(self, id):
        # SELECT * FROM T_LIBRO WHERE id_libro=id
        # al usar el metodo first() va a devolver la primera coincidencia y ya no una lista, sino un objeto en concreto y si no cumple la condicion retorna None
        resultado = LibroModel.query.filter_by(id_libro=id).first()
        # devolver en el content todo el libro y si no hubiese indicar que no se encuentra ese libro con esa posicion con un status 404
        if resultado:
            # si hay un libro
            return {
                'ok': True,
                'content': resultado.devolverJson(),
                'message': None
            }
        else:
            # no hay libro con ese id
            return {
                'ok': False,
                'content': None,
                'message': 'No existe ese libro'
            }, 404
    
    def put(self, id):
        resultado = LibroModel.query.filter_by(id_libro=id).first()
        if resultado:
            parseador = reqparse.RequestParser()
            parseador.add_argument(
                'nombre',
                type=str,
                required=False,
                location='json',
                help='Falta el campo nombre'
            )
            parseador.add_argument(
                'edicion',
                type=str,
                required=False,
                location='json',
                help='Falta la edicion'
            )
            parseador.add_argument(
                'autor',
                type=str,
                required=False,
                location='json',
                help='Falta el autor'
            )
            parseador.add_argument(
                'cantidad',
                type=int,
                required=False,
                location='json',
                help='Falta la cantidad'
            )
            body = parseador.parse_args()
            resultado.update(nombre=body['nombre'], edicion=body['edicion'], autor=body['autor'], cantidad=body['cantidad'] )
            return {
                'ok': True,
                'content': resultado.devolverJson(),
                'message':'Libro actualizado con exito'
            }, 201

        else:
            return {
                'ok': False,
                'content': None,
                'message': 'No existe ese libro'
            }, 404
    
    def delete(self, id):
        resultado = LibroModel.query.filter_by(id_libro=id).first()
        if resultado:
            resultado.delete()
            return {
                'ok': True,
                'content':None,
                'message': 'Se elimino exitosamente el Libro'
            }
        else:
            return {
                'ok': False,
                'content': None,
                'message': 'No existe ese libro'
            }, 404