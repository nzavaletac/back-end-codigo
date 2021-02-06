from django.urls import path
from .views import CustomPayloadView, MesasView, RegistroUsuarioView
# https://django-rest-framework-simplejwt.readthedocs.io/en/latest/customizing_token_claims.html
# Valida las credenciales y si estas son correctas me retornará la JWT
from rest_framework_simplejwt.views import TokenObtainPairView

urlpatterns = [
    path('registro',RegistroUsuarioView.as_view()),
    # path('login', TokenObtainPairView.as_view()),
    path('login', CustomPayloadView.as_view()),
    path('mesa', MesasView.as_view()),
]