from rest_framework import generics, status
from .serializers import InventarioModel, InventarioSerializer
from rest_framework.response import Response
# https://www.django-rest-framework.org/api-guide/exceptions/
from rest_framework.exceptions import ParseError
from django.shortcuts import get_object_or_404
class InventariosView(generics.ListCreateAPIView):
    # algunos atributos de la clase generica son:
    queryset = InventarioModel.objects.all() # SELECT * FROM t_inventario
    serializer_class = InventarioSerializer
    def post(self, request):
        # para capturar todo lo que me manda el cliente por el body uso el request.data
        inventario = self.serializer_class(data=request.data)
        # si se quiere usar el metodo is_valid OBLIGATORIAMENTE se tiene que pasar al constructor del serializador el parametro data sino nos dara un error
        inventario.is_valid(raise_exception=True)
        # que si todo es correcto en relacion a los modelos puedo proceder a hacer el guardado
        # print("Todo bien, todo correcto")
        # el save hace el guardado de mi informacion en la bd
        inventario.save()
        # Forma de realizar un guardado en la bd sin la necesidad de un serializer
        # InventarioModel(inventarioPlato="Chicharron de Pez", inventarioCantidad=40).save()
        return Response({
            "ok": True,
            "content":inventario.data
        }, status=status.HTTP_201_CREATED)

    def get(self, request):
        # si nosotros queremos pasar mas de una instancia al serializador (una lista de instancias) tendremos que declarar su parametro many=True para que internamente haga la iteacion y puedan entender lo que le estamos pasando
        resultado = self.serializer_class(instance=self.get_queryset(), many=True)
        print(resultado.data)
        return Response({
            "ok": True,
            "content": resultado.data
        })

class InventarioView(generics.RetrieveUpdateDestroyAPIView):
    # la clase RetrieveUpdateDestroyAPIView me permite usar los metodos GET, PUT, DELETE
    queryset = InventarioModel.objects.all()
    serializer_class = InventarioSerializer
    def get(self, request, inventario_id):
        # SELECT * FROM t_inventario WHERE inventario_id=var
        # al usar el first ya no retornara una lista sino que retornara un objeto, es la unica clausula de filtros que retorna un objeto
        inventario = self.queryset.filter(inventarioId=inventario_id).first()
        # SEGUNDA FORMA
        # Otra forma de hacer SELECT pero mas "delicada"
        # al momento de usar get tenemos que estar seguros que no nos va a pasar un campo incorrecto porque sino crasheará el programa
        # try:
        #     print(self.queryset.get(inventarioId=inventario_id))
        # except:
        #     raise ParseError("Error!")
        # TERCERA FORMA
        # Se usa el metodo del propio DJANGO
        # si encuentra un objeto con ese filtro lo retornará, sino automaticamente retornara al cliente un estado 404
        # lo que retorna es un objecto NO SERIALIZADO
        inventarioObject = get_object_or_404(InventarioModel,pk=inventario_id)
        print(inventarioObject)
        
        inventarioSerializado = self.serializer_class(instance=inventarioObject)
        return Response({
            "ok": True,
            "content": inventarioSerializado.data
        })

    def put(self, request, inventario_id):
        pass
    def delete(self, request, inventario_id):
        pass