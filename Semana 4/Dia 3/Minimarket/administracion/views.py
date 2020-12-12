# para evitar ese "error" del modelo debemos instalar la siguiente libreria
# pip install pylint-django
from django.shortcuts import render
from .models import ProductoModel
# https://www.django-rest-framework.org/api-guide/generic-views/
from rest_framework.generics import ListCreateAPIView
from rest_framework.response import Response
from .serializers import ProductoSerializer
from rest_framework import status
# Create your views here.

class ProductosView(ListCreateAPIView):
    # queryset es la consulta a la base de datos que se va a hacer para efectuar esa vista, utilizando ORM
    # serializer es la forma en la cual yo voy a decorar mi resultado para mostrarlo al cliente y tambien hace las validaciones para guardar en la base de datos
    queryset = ProductoModel.objects.all() # SELECT * FROM T_PRODUCTO
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
        # VALIDAR SI ESTA BIEN INGRESADO O NO Y SI NO ESTA MEDIANTE SUS ERRORES INDICAR QUE PASO Y RETORNALOS AL CLIENTE EN EL FORMATO {
        #     "ok":False,
        #     "content":[LOS ERRORES],
        #     "message":"Hubo un error al guardar el producto"
        # }
        # y con un estado 400
        # y si si esta, hacer el guardado y retornar lo de abajo
        producto.is_valid()
        print(producto.errors)
        # producto.save()
        return Response({
            "ok":True,
            # "content":producto.data,
            "message":"Se creo exitosamente el producto"
        },status.HTTP_201_CREATED)
