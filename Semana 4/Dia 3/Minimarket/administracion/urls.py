from django.urls import path
from .views import (ProductosView, 
                    ProductoView, 
                    AlmacenesView, 
                    ProductosAlmacenesView, 
                    CabeceraVentasView,
                    VentaView,
                    retornar_usuario_por_nombre,
                    filtrar_compras_fecha)

urlpatterns = [
    path('productos', ProductosView.as_view(), name="Productos"),
    path('producto/<int:id>', ProductoView.as_view()),
    path('almacenes', AlmacenesView.as_view()),
    path('productosalmacenes', ProductosAlmacenesView.as_view()),
    path('cabeceraventas', CabeceraVentasView.as_view()),
    path('venta', VentaView.as_view()),
    path('search/user/<str:nombre>',retornar_usuario_por_nombre),
    path('search/date/<str:fechainicio>/<str:fechafin>', filtrar_compras_fecha),
]