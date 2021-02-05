from rest_framework import serializers
from .models import UsuarioModel


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
