from rest_framework import generics, status
from .serializers import InventarioModel, InventarioSerializer
from rest_framework.response import Response

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
        inventario = self.queryset.filter(inventarioId=inventario_id).first()
        # Otra forma de hacer SELECT pero mas "delicada"
        print(self.queryset.get(inventarioId=inventario_id))
        # al usar el first ya no retornara una lista sino que retornara un objeto, es la unica clausula de filtros que retorna un objeto
        inventarioSerializado = self.serializer_class(instance=inventario)
        return Response({
            "ok": True,
            "content": inventarioSerializado.data
        })

    def put(self, request, inventario_id):
        pass
    def delete(self, request, inventario_id):
        pass