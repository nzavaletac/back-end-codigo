from django.urls import path
from .views import ComandasView, CrearPedidoView, CustomPayloadView, GenerarNotaPedidoView, MesasView, RegistroUsuarioView, crear_pedido, mesas_disponibles
# https://django-rest-framework-simplejwt.readthedocs.io/en/latest/customizing_token_claims.html
# Valida las credenciales y si estas son correctas me retornará la JWT
from rest_framework_simplejwt.views import TokenObtainPairView

urlpatterns = [
    path('registro',RegistroUsuarioView.as_view()),
    # path('login', TokenObtainPairView.as_view()),
    path('login', CustomPayloadView.as_view()),
    path('mesa', MesasView.as_view()),
    path('mesasDisponibles', mesas_disponibles),
    path('comanda', ComandasView.as_view()),
    path('crearPedido', CrearPedidoView.as_view()),
    path('crearPedidodeprecated', crear_pedido),
    path('notaPedido/<int:id_comanda>', GenerarNotaPedidoView.as_view()),
]