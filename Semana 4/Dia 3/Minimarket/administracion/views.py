# para evitar ese "error" del modelo debemos instalar la siguiente libreria
# pip install pylint-django
from django.shortcuts import render
from .models import ProductoModel, AlmacenModel, ProductoAlmacenModel, CabeceraVentaModel, DetalleVentaModel
# https://www.django-rest-framework.org/api-guide/generic-views/
from rest_framework.generics import ( ListCreateAPIView, 
                                    RetrieveUpdateDestroyAPIView, 
                                    ListAPIView, 
                                    CreateAPIView )
from rest_framework.response import Response
from .serializers import (  ProductoSerializer, 
                            AlmacenSerializer, 
                            ProductoAlmacenSerializer, 
                            AlmacenSerializerMany, 
                            CabeceraVentaSerializer,
                            VentaSerializer,
                            VentaCompletaSerializer )
from rest_framework import status
from rest_framework.decorators import api_view
# Create your views here.
# Si solamente yo quiero usar una funcionalidad basica y no usar mucha logica ni muchos metodos (POST,GET...) puedo entonces utilizar un decorador llamado api_view
# como unico parametro del api_view indico los metodos de acceso, pero si no pongo nada el unico metodo de acceso va a ser por defecto el GET
@api_view()
def retornar_usuario_por_nombre(request, nombre):
    # para mandar espacios y caracteres especiales como ; , / ? .... en el frontEnd debemos antes de pasar el valor usar el metodo "encodeURI(palabra) para JS|TS"
    print(nombre)
    # Hacer una busqueda de mi tabla CabeceraVenta para que, pasandole el nombre del cliente, me devuelva todas sus cabeceras y usar el VentaCompletaSerializer.
    # solamente usando COINCIDENCIA EXACTA
    # Field Lookup 
    # son configuraciones adicionales a mis campos de mis modelos que puedo usar para hacer un filtro mas especifico como clausulas like, limites de fechas, entre otros
    # https://docs.djangoproject.com/en/3.1/ref/models/querysets/#field-lookups
    compras = CabeceraVentaModel.objects.filter(cabeceraVentaNombre__contains=nombre).all()
    comprasSerilizada = VentaCompletaSerializer(instance=compras, many=True)
    return Response({
        "ok" : True,
        "content": comprasSerilizada.data,
        "message": None
    })

# https://docs.djangoproject.com/en/3.1/ref/models/querysets/#range
# http://127.0.0.1:8000/minimarket/search/date/2020-12-17%2000:00:00/2020-12-17%2023:59:59
@api_view(['GET'])
def filtrar_compras_fecha(request, fechainicio, fechafin):
    comprasPorFechas = CabeceraVentaModel.objects.filter(cabeceraVentaFecha__range=(fechainicio, fechafin)).all()
    comprasPorFechasSerializada = VentaCompletaSerializer(instance=comprasPorFechas, many=True)
    return Response({
        "ok":True,
        "content":comprasPorFechasSerializada.data,
        "message":None
    })




# las APIViews sirve, para ya darnos una serie de metodos predefinidos que pueden ser modificados pero si nosotros dentro de esa clase agregamos un metodo que no viene predeterminado, se creará sin ningun problema
class ProductosView(ListCreateAPIView):
    # queryset es la consulta a la base de datos que se va a hacer para efectuar esa vista, utilizando ORM
    # serializer es la forma en la cual yo voy a decorar mi resultado para mostrarlo al cliente y tambien hace las validaciones para guardar en la base de datos
    queryset = ProductoModel.objects.all() # SELECT * FROM T_PRODUCTO
    # https://www.django-rest-framework.org/api-guide/serializers/
    serializer_class = ProductoSerializer
    def get(self, request):
        respuesta = self.get_serializer(self.get_queryset(), many=True)
        print(respuesta.data)
        return Response({
            "ok":True,
            "content":respuesta.data,
            "message":None
        },status=status.HTTP_200_OK)
    
    def post(self, request):
        # request.data es la forma de traer todo lo que me manda el cliente x el body
        producto = self.get_serializer(data=request.data)
        # https://www.django-rest-framework.org/api-guide/serializers/
        if producto.is_valid():
            producto.save()
            return Response({
                "ok":True,
                "content":producto.data,
                "message":"Se creo exitosamente el producto"
            },status.HTTP_201_CREATED)
        else:
            return Response({
                "ok":False,
                "content": producto.errors,
                "message": "Hubo un error al guardar el producto"
            }, status.HTTP_400_BAD_REQUEST)

class ProductoView(RetrieveUpdateDestroyAPIView):
    queryset = ProductoModel.objects.all()
    serializer_class = ProductoSerializer
    def get(self, request, id):
        # print(self.get_queryset().filter(productoId=id).first())
        respuesta = self.get_serializer(self.get_queryset().filter(productoId=id).first())
        return Response({
            "ok":True,
            "content":respuesta.data,
            "message":None
        })
    def put(self, request, id):
        producto = self.get_queryset().filter(productoId=id).first()
        # ProductoSerializer.update(producto,request.data)
        respuesta = self.get_serializer(producto, data=request.data)
        if respuesta.is_valid():
            resultado = respuesta.update()
            return Response({
                "ok":True,
                "content": self.serializer_class(resultado).data,
                "message": "se actulizo exitosamente el producto"
            }, status.HTTP_201_CREATED)
        else:
            return Response({
                "ok":False,
                "content":respuesta.errors,
                "message":"Hubo un error al actualizar el producto"
            },status.HTTP_400_BAD_REQUEST)

    def delete(self, request, id):
        # implementar el metodo delete pero primero implementar la columna estado en el modelo PRODUCTO y que su valor por default sea True, ademas implmentar el metodo delete en el serializador para que se modifique el estado a False
        producto = self.get_queryset().filter(productoId=id).first()
        respuesta = self.get_serializer(producto)
        respuesta.delete()
        return Response({
            "ok":True,
            "content":respuesta.data,
            "message":"Se elimino el producto exitosamente"
        })

class AlmacenesView(ListCreateAPIView):
    queryset = AlmacenModel.objects.all() # si no pongo nada y lo dejo en objects va a retornar la sentencia SQL
    serializer_class = AlmacenSerializerMany
    def post(self, request):
        respuesta = self.get_serializer(data=request.data)
        if respuesta.is_valid():
            # aca va a ir el guardado y la devolucion que todo fue exitoso
            respuesta.save()
            return Response({
                "ok": True,
                "content": respuesta.data,
                "message": "se guardo correctamente el almacen"
            },status.HTTP_201_CREATED)
        else:
            # aca va la lista de error que sucedieron al guardar ese almacen
            return Response({
                "ok":False,
                "content": respuesta.errors,
                "message": "hubo un error al guardar el almacen"
            }, status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        almacenes = self.get_serializer(instance=self.get_queryset(), many=True)
        return Response({
            "ok":True,
            "content": almacenes.data,
            "message": None
        })
        
class ProductosAlmacenesView(ListCreateAPIView):
    queryset = ProductoAlmacenModel.objects.all()
    serializer_class = ProductoAlmacenSerializer
    def get(self, request):
        prodalmas = self.get_serializer(instance=self.get_queryset(), many=True)
        return Response({
            "ok":True,
            "content": prodalmas.data
        })
    def post(self, request):
        info = request.data 
        productoAlmacenSerializado = self.get_serializer(data=info)
        # print(productoAlmacenSerializado.is_valid())
        # print(productoAlmacenSerializado.errors)
        if productoAlmacenSerializado.is_valid():
            # aca recien meto la logica de los estados y otros
            # primer metodo 
            producto = ProductoModel.objects.filter(productoId=info['productoId']).first()
            # segundo metodo 
            # validated_data es un diccionario que se crea a partir de pasarle una data y luego gracias al metodo is_valid() se crea esa data validada en la cual se corrobora que todas las llaves foraneas y todos los campos esten correctamente ingresados
            # producto = productoAlmacenSerializado.validated_data['productoId'].estado
            almacen = AlmacenModel.objects.filter(almacenId=info['almacenId']).first()
            # print(producto.estado, almacen.estado)
            if producto.estado == True and almacen.estado: # if producto.estado
                # HINT: aca tienen que hacer el ejercicio
                inventario = ProductoAlmacenModel.objects.filter(productoId=info['productoId'], almacenId=info['almacenId']).first()
                if inventario:
                    # voy a tener que sobreescribir mi productoalmacen
                    # cuando yo uso el metodo update de mi serializador le tengo que pasar dos parametros, el primero es la instancia (el campo ya creado en mi base de datos que yo quiero actualizar) y el segundo es todo el contenido que yo quiero actualizar en mi base de datos y automaticamente ya hace el guardado en mi base de datos (implicitamente hace el save) por lo que yo no tengo que volver a usar el metodo save() sino se creará otra instancia de mi objeto creado
                    # ESTA SERIA LA CONSULTA SQL: UPDATE t_productoalmacen set productoId=... , WHERE almacenId = inventario['almacenId'] and productoId = inventario['productoId]
                    productoAlmacenSerializado.update(inventario, productoAlmacenSerializado.validated_data)
                    return Response({
                        "ok": True,
                        "content": productoAlmacenSerializado.data,
                        "message": "Se actualizo el productoalmacen con su nueva cantidad"
                    })
                else:
                    # voy a tener que crear un nuevo productoalmacen
                    # instance es ya la instancia de del productoalmacen creado, osea se crea una vez que yo ya agrege esa row a la base de datos, si yo no lo guardo, me retornara un None(vacio)
                    productoAlmacenSerializado.save()
                    return Response({
                        "ok":True,
                        "content":productoAlmacenSerializado.data,
                        "message": "Se agrego exitosamente el producto con almacen"
                    }, status.HTTP_201_CREATED)
            else:
                return Response({
                    "ok":False,
                    "content":None,
                    "message":"No se logro ingresar correctamente los datos, producto o almacen no esta correctamente habilitado"
                }, status.HTTP_400_BAD_REQUEST)
        else:
            return Response({
                "ok": False,
                "content": productoAlmacenSerializado.errors,
                "message":"Hubo un error al registrar el producto almacen"
            },status.HTTP_400_BAD_REQUEST)        

class CabeceraVentasView(ListAPIView):
    queryset = CabeceraVentaModel.objects.all() # SELECT * FROM T_CABECERAVENTA
    serializer_class = CabeceraVentaSerializer
    def get(self, request):
        resultado = self.get_serializer(instance = self.get_queryset(), many=True)
        return Response({
            "ok":True,
            "content": resultado.data,
            "message": None
        })

class VentaView(CreateAPIView):
    queryset = DetalleVentaModel.objects.all()
    serializer_class = VentaSerializer
    def post(self, request):
        respuesta = self.get_serializer(data=request.data)
        respuesta.is_valid(raise_exception=True)
        # print(respuesta.data['articulos'])
        # banderaProductos = 0
        # I aca yo valido si mi producto existe y si su estado esta como habilitado
        for articulo in respuesta.data['articulos']:
            # print(articulo['id'])
            # VER SI EXISTEN LOS ARTICULOS SEGUN SU ID
            producto = ProductoModel.objects.filter(productoId=articulo['id']).first()
            # FORMA 1
            # if (producto and producto.estado):
            #     pass
            # else:
            #     banderaProductos += 1
            # FORMA 2
            if (producto is None or producto.estado == False):
                return Response({
                            "ok": False,
                            "message": "Verifique los productos ingresados"
                        }, status.HTTP_400_BAD_REQUEST)
        
        # II VALIDAR LAS CANTIDADES
        for articulo in respuesta.data['articulos']:
            producto = ProductoModel.objects.filter(productoId=articulo['id']).first()
            # GRACIAS al related_name indicado en la llave foranea yo puedo ingresar a su relacion inversa (relacion del padre hacia los hijos) y devolver todos sus registros (rows) de ese padre
            cantidadSolicitada = articulo['cantidad']
            print("La cantidad solicitada es:",cantidadSolicitada)
            productoAlmacenes = producto.productosAlmacenes.all() # LIST
            # print(productoAlmacenes)
            # ahora hay que ver si existe la cantidad indicada en los inventarios
            # DEVOLVER LA CANTIDAD DE ESE PRODUCTO EN DETERMINADO PRODUCTOALMACEN
            cantidadAlmacen = 0
            for productoAlmacen in productoAlmacenes:
                # print(productoAlmacen.productoAlmacenCantidad)
                cantidadAlmacen += productoAlmacen.productoAlmacenCantidad
            print("La cantidad en stock es", cantidadAlmacen)
            if cantidadSolicitada > cantidadAlmacen:
                return Response({
                    "ok": False,
                    "message": "La cantidad solicitada del articulo "+ str(articulo['id'])+" es mayor que la que hay en el inventario"
                })
        
        # III REALIZAR EL GUARDADO DE LA CABECERA VENTA USANDO EL SERIALIZER
        cabeceraVenta = CabeceraVentaModel(cabeceraVentaFecha=respuesta.data['fecha'],cabeceraVentaTotal= 0,cabeceraVentaNombre= respuesta.data['nombre'])
        # Se tiene que hacer el guardado de la cabecera en otra linea despues de crear la instancia porque sino lo capturado sera lo devuelvo por el metodo save() que, en django models no retorna nada
        cabeceraVenta.save()
        detalles = []
        precioFinal = 0
        # IV REALIZAR EL GUARDADO DE CADA ARTICULO
        for articulo in respuesta.data['articulos']:
            producto = ProductoModel.objects.filter(productoId=articulo['id']).first()
            precioTotal = producto.productoPrecio * articulo['cantidad']
            precioFinal += precioTotal

            # Para crear con una FK es necesario pasar todo el objecto (instancia) de mi modelo y no solamente su numero de primary key
            detalle = DetalleVentaModel(productoId=producto, cabeceraVentaId=cabeceraVenta, detalleVentaCantidad=articulo['cantidad'], detalleVentaSubTotal=precioTotal)
            detalle.save()
            detalles.append(detalle)

            
            # VI ACTUALIZAR SUS CANTIDADES DE LA TABLA PRODUCTOALMACEN
            # print(producto.productosAlmacenes.all())
            # PRIMERO agarro la cantidad de cuantos articulos necesito para luego restar cada vez que ingrese a un productoAlmacen
            cantidadesNecesitadas = articulo['cantidad']
            for productoAlmacen in producto.productosAlmacenes.all():
                # Itero todos mis productosAlmacenes segun su relacion inversa del producto y luego capturo su cantidad en ese almacen determinado
                cantidadAlmacen = productoAlmacen.productoAlmacenCantidad
                # En cada iteracion voy restando las cantidades necesitadas hasta llegar a 0, si llego ya no necesito restar mas de mis almacenes
                if cantidadesNecesitadas > 0:
                    # si la cantidad del almacen es mayor que la solicitada (es decir satisface de mas lo que el usuario necesita) le resto esa cantidad y coloco las cantidadesNecesitadas a 0 puesto que ya tengo todas las cantidades necesitadas y le resto a esa cantidad del Almacen toda la cantidadNecesitada y lo guardo
                    if cantidadAlmacen >= cantidadesNecesitadas:
                        # Se proveyo la cantidad solicitada
                        productoAlmacen.productoAlmacenCantidad = productoAlmacen.productoAlmacenCantidad - cantidadesNecesitadas
                        productoAlmacen.save()
                        cantidadesNecesitadas = 0
                    # Sino consumiré todas las cantidades de ese almacen pero aun me falta stock para satisface por lo que recorreré al siguiente Almacen en busca de mas productos
                    else:
                        # Falta mas stock
                        cantidadesNecesitadas = cantidadesNecesitadas - cantidadAlmacen
                        productoAlmacen.productoAlmacenCantidad = 0
                        productoAlmacen.save()
        # print(detalles)
        # V MODIFICAR EL PRECIO FINAL DE MI CABECERA
        cabeceraVenta.cabeceraVentaTotal = precioFinal
        cabeceraVenta.save()

        # Llamo a mi serializador para devolver la data correctamente formateada
        ventaCompleta = VentaCompletaSerializer(instance=cabeceraVenta)
        # print(banderaProductos)
        # si la bandera incremento su valor significa que no se cumplio las condiciones anteriores y por ende termino el proceso
        # if banderaProductos != 0:
        #     return Response({
        #         "ok": False,
        #         "message": "Verifique los productos ingresados"
        #     }, status.HTTP_400_BAD_REQUEST)

        return Response({
            "ok":True,
            "content": ventaCompleta.data
        }, status.HTTP_201_CREATED)

