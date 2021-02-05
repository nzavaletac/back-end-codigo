from rest_framework import generics
from .serializers import RegistroSerializer
from rest_framework.response import Response

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