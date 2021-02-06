from rest_framework import generics, status
from .models import MesaModel
from .serializers import RegistroSerializer, MesaSerializer, CustomPayloadSerializer
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated , IsAuthenticatedOrReadOnly
from .permissions import SoloCajeros
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.decorators import api_view, permission_classes
# AllowAny Permite que todos los controladores no pidan autenticacion
# IsAuthenticated No va a permitir que pueda proceder sin que no se haya dado una token
# IsAuthenticatedOrReadOnly solamente va a permitir acceder a metodos GET sin la necesidad de una token

class RegistroUsuarioView(generics.CreateAPIView):
    serializer_class = RegistroSerializer
    def post(self, request):
        nuevoUsuario = self.serializer_class(data=request.data)
        nuevoUsuario.is_valid(raise_exception=True)
        nuevoUsuario.save()
        print(nuevoUsuario)
        return Response({
            "ok":True,
            "content": nuevoUsuario.data
        }, status=201)

class CustomPayloadView(TokenObtainPairView):
    permission_classes= [AllowAny,]
    serializer_class = CustomPayloadSerializer

class MesasView(generics.ListCreateAPIView):
    queryset = MesaModel.objects.all()
    serializer_class = MesaSerializer
    # Este es el atributo que va a regir en toda mi view y va a permitir o denegar ciertos accesos
    permission_classes = [IsAuthenticated, SoloCajeros]
    def get(self, request):
        resultado = self.serializer_class(instance=self.get_queryset(), many=True)
        print(resultado.data)
        return Response({
            "ok": True,
            "content":resultado.data,
            "message": None
        })
    def post(self, request):
        # body => request.data
        # primero le paso la data que el cliente me manda para que sea serializada y validada
        nuevaMesa = self.serializer_class(data=request.data)
        # el valor initial_data me mostrara toda la data que le estoy pasando al serializador sin aplicar ningun filtro
        print(nuevaMesa.initial_data)
        # el metodo is_valid aparte de devolver un booleano o de lanzar una excepcion si es que su parametro raise_exception=True aplicará un filtro entre todo lo que ingreso al serializador vs todo lo que necesita para cumplir con lo necesario por el model
        nuevaMesa.is_valid(raise_exception=True)
        # una vez hecho ese filtro recien se puede llamar al atributo .data pero si se va a guardar en la bd no se puede acceder a este atributo hasta despues de guardarlo
        # print(nuevaMesa.data)
        # y para terminar se hacer el guardado en la base de datos
        nuevaMesa.save()
        return Response({
            "ok": True,
            "content": nuevaMesa.data,
            "message": "se creo la mesa exitosamente"
        }, status=status.HTTP_201_CREATED)

# controlador en el cual me muestre las mesas disponibles
# se usa mas un apiview cuando nosotros tengamos que solamente usar un metodo (GET, POST, PUT) y asi nos evitaremos de crear una clase con todos sus atributos
@api_view(['GET'])
@permission_classes([IsAuthenticated, SoloCajeros])
def mesas_disponibles(request):
    mesas = MesaModel.objects.filter(mesaEstado=True).all()
    resultadoSerializado = MesaSerializer(instance= mesas, many=True)
    return Response({
        "ok": True,
        "content":resultadoSerializado.data,
        "message": None
    })