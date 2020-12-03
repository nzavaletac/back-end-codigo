from base_de_datos import bd
class PrestamoModel(bd.Model):
    __tablename__ = "t_prestamo"
    id_prestamo = bd.Column('prestamo_id', bd.Integer,
                            primary_key=True, autoincrement=True, nullable=False)
    fechin_prestamo = bd.Column('prestamo_fechin', bd.Date, nullable=False)
    fechfin_prestamo = bd.Column('prestamo_fechfin', bd.Date)
    estado = bd.Column(bd.Boolean, default=True, nullable=False)
    # RELACIONES
    cliente = bd.Column('cli_id', bd.Integer, bd.ForeignKey('t_cliente.cli_id'), nullable=False)
    libro = bd.Column('lib_id', bd.Integer, bd.ForeignKey('t_libro.lib_id'), nullable=False)

    def __init__(self, fecha_inicio, fecha_fin, cliente, libro):
        self.fechin_prestamo = fecha_inicio
        self.fechfin_prestamo = fecha_fin
        self.cliente = cliente
        self.libro = libro

    def save(self):
        bd.session.add(self)
        bd.session.commit()

    def devolverJson(self):
        return {
            'id': self.id_prestamo,
            'fecha_inicio': str(self.fechin_prestamo),
            'fecha_fin': str(self.fechfin_prestamo),
            'cliente': self.cliente,
            'libro': self.libro
        }