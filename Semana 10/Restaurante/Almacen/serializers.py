from rest_framework import serializers
from .models import InventarioModel

class InventarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = InventarioModel
        # los campos como PK (autofield) solamente seran de solo lectura
        fields = '__all__' # voy a usar por completo todas las columnas del modelo inventario
        # fields = ['inventarioPlato',]
        # exclude = ['inventarioId'] # solamente puedo usar o el exclude o el fields 