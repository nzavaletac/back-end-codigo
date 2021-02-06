from rest_framework.permissions import BasePermission

class SoloCajeros(BasePermission):
    def has_permission(self, request, view):
        # Restringir el acceso para que SOLAMENTE un usuario de tipo 2 (mesero) y metodo GET pueda acceder a las mesas
        # Restringir el acceso para que SOLAMENTE un usuario de tipo 1 (administrado) y metodo POST pueda acceder para crear una mesa
        # print(request.user.usuarioTipo)
        print(request.auth)
        print(request.method)
        # if request.auth == None:
        #     return False
        if (request.method =="GET" and request.user.usuarioTipo == 2):
            return True
        if (request.method == "POST" and request.user.usuarioTipo == 1):
            return True
        print(view)
        return False