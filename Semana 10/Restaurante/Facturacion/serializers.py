from rest_framework import serializers
from .models import MesaModel, UsuarioModel
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class RegistroSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    def save(self):
        usuarioCorreo = self.validated_data.get('usuarioCorreo')
        usuarioNombre = self.validated_data.get('usuarioNombre')
        usuarioApellido = self.validated_data.get('usuarioApellido')
        usuarioTipo = self.validated_data.get('usuarioTipo')
        password = self.validated_data.get('password')
        nuevoUsuario = UsuarioModel(
            usuarioCorreo=usuarioCorreo,
            usuarioNombre=usuarioNombre,
            usuarioApellido=usuarioApellido,
            usuarioTipo=usuarioTipo)
        nuevoUsuario.set_password(password)
        nuevoUsuario.save()
        return nuevoUsuario

    class Meta:
        model = UsuarioModel
        # fields = '__all__'
        exclude = ['groups','user_permissions']

class MesaSerializer(serializers.ModelSerializer):
    # a un model serializer se le pueden agregar campos extras diferentes del mismo model
    # campoExtra = serializers.CharField(max_length=50)
    class Meta:
        model = MesaModel
        fields = '__all__'

class CustomPayloadSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super(CustomPayloadSerializer, cls).get_token(user)
        # luego que ya tenemos definida la token con el padre podemos agregar nuevos elementos
        token['nombreCompleto'] = user.usuarioNombre + user.usuarioApellido
        token['usuarioTipo'] = user.usuarioTipo
        return token