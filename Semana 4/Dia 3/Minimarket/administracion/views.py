# para evitar ese "error" del modelo debemos instalar la siguiente libreria
# pip install pylint-django
from django.shortcuts import render
from .models import ProductoModel
# https://www.django-rest-framework.org/api-guide/generic-views/
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.response import Response
from .serializers import ProductoSerializer
from rest_framework import status
# Create your views here.

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