import { Column, DataType, Model, Table, ForeignKey, BelongsTo, HasOne } from 'sequelize-typescript';
import Reserva from './Reserva';
import Servicio from './Servicio';
import Boleta from './Boleta';

@Table({ tableName: 'detalles_reserva' })
class DetalleReserva extends Model {
    @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
    declare id_detalle_reserva: number;

    @ForeignKey(() => Reserva)
    @Column({ type: DataType.INTEGER, allowNull: false })
    declare id_reserva: number;

    @ForeignKey(() => Servicio)
    @Column({ type: DataType.INTEGER, allowNull: false })
    declare id_servicio: number;

    @Column({ type: DataType.INTEGER, allowNull: false })
    declare precio: number;

    @Column({ type: DataType.STRING, allowNull: true })
    declare detalle: string;

    @BelongsTo(() => Reserva)
    declare reserva: Reserva;

    @BelongsTo(() => Servicio)
    declare servicio: Servicio;

    @HasOne(() => Boleta)
    declare boleta: Boleta;
}

export default DetalleReserva;
