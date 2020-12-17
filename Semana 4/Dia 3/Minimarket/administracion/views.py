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
                            VentaSerializer )
from rest_framework import status
# Create your views here.
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
        print(respuesta.is_valid(raise_exception=True))
        print(respuesta.data)
        return Response({
            "ok":True
        })