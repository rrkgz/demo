import { Column, DataType, Model, Table, HasMany } from 'sequelize-typescript';
import Reserva from './Reserva';
import DetalleReserva from './DetalleReserva';

@Table({ tableName: 'servicios' })
class Servicio extends Model {
    @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
    declare id_servicio: number;

    @Column({ type: DataType.STRING, allowNull: false })
    declare nombre: string;

    @Column({ type: DataType.STRING, allowNull: true })
    declare descripcion: string;

    @Column({ type: DataType.INTEGER, allowNull: false })
    declare precio: number;

    @HasMany(() => Reserva)
    declare reservas: Reserva[];

    @HasMany(() => DetalleReserva)
    declare detalles: DetalleReserva[];
}

export default Servicio;
