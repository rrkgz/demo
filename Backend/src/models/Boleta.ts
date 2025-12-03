import { Column, DataType, Model, Table, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import DetalleReserva from './DetalleReserva';
import Tratamiento from './Tratamiento';

@Table({ tableName: 'boletas' })
class Boleta extends Model {
    @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
    declare id_boleta: number;

    @ForeignKey(() => DetalleReserva)
    @Column({ type: DataType.INTEGER, allowNull: false })
    declare id_detalle_reserva: number;

    @Column({ type: DataType.DATE, allowNull: false })
    declare fecha_pago: Date;

    @Column({ type: DataType.INTEGER, allowNull: false })
    declare monto_total: number;

    @BelongsTo(() => DetalleReserva)
    declare detalle: DetalleReserva;

    @HasMany(() => Tratamiento)
    declare tratamientos: Tratamiento[];
}

export default Boleta;
