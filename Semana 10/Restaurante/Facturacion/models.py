from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
# Create your models here.


class UsuarioManager(BaseUserManager):
    """Manejo del modelo del usuario"""

    def create_user(self, email, nombre, apellido, tipo, password=None):
        """Creacion de un nuevo usuario comun y corriente"""
        if not email:  # si no hay correo, mandare un error
            raise ValueError(
                "El usuario debe tener obligatoriamente un correo")
        # normalizo el email que aparte de ver si hay el @ y . todo lo llevar a lowerCase (minusculas y quitara los espacios que pudiesen haber)
        email = self.normalize_email(email)
        # creo mi objeto de usuario pero aun no lo guarod en la bd
        usuario = self.model(usuarioCorreo=email, usuarioNombre=nombre,
                             usuarioApellido=apellido, usuarioTipo=tipo)
        # con este paso se encripta la contraseña
        usuario.set_password(password)
        usuario.save(using=self._db)  # acá recien se guarda en la bd
        return usuario

    def create_superuser(self, email, nombre, apellido, tipo, password):
        """Creacion de un nuevo super usuario que pueda acceder a todas las opciones del panel administrativo"""
        user = self.create_user(email, nombre, apellido, tipo, password)
        # este campo se crea automaticamente por la herencia de la clase PermissionsMixin
        user.is_superuser = True
        user.is_staff = True
        user.save(using=self._db)


class UsuarioModel(AbstractBaseUser, PermissionsMixin):
    """Modelo de la base de datos de los usuarios del sistema"""
    TIPOS_USUARIO = [
        (1, 'ADMINISTRADOR'),
        (2, 'CAJERO'),
        (3, 'MOZO')
    ]
    usuarioCorreo = models.EmailField(
        db_column="usu_mail", max_length=50, unique=True)
    usuarioNombre = models.CharField(db_column="usu_nombre",
                                     max_length=40)
    usuarioApellido = models.CharField(db_column="usu_apellido",
                                       max_length=50,
                                       help_text="Apellido del usuario")
    usuarioTipo = models.IntegerField(
        db_column="usu_tipo", help_text="Tipo del usuario", choices=TIPOS_USUARIO)
    password = models.TextField(db_column="usu_pass")
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UsuarioManager()
    USERNAME_FIELD = 'usuarioCorreo'
    REQUIRED_FIELDS = ['usuarioNombre', 'usuarioApellido']

    def __str__(self):
        return self.usuarioCorreo
    
    class Meta:
        db_table ="t_usuario"
        verbose_name ="usuario"
        verbose_name_plural = "usuarios"