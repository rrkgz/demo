import { Column, DataType, Model, Table, ForeignKey, BelongsTo, HasMany, HasOne } from 'sequelize-typescript';
import Cliente from './Cliente';
import Mascota from './Mascota';
import Veterinario from './Veterinario';
import Servicio from './Servicio';
import DetalleReserva from './DetalleReserva';
@Table({ tableName: 'reservas' })
class Reserva extends Model {
    @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
    declare id_reserva: number;

    @Column({ type: DataType.STRING(12), allowNull: true })
    declare rut_cliente: string | null;

    @ForeignKey(() => Mascota)
    @Column({ type: DataType.INTEGER, allowNull: false })
    declare id_mascota: number;

    @ForeignKey(() => Veterinario)
    @Column({ type: DataType.STRING, allowNull: false })
    declare id_veterinario: string;

    @ForeignKey(() => Servicio)
    @Column({ type: DataType.INTEGER, allowNull: false })
    declare id_servicio: number;

    @Column({ type: DataType.DATE, allowNull: false })
    declare fecha: Date;

    @Column({ type: DataType.TIME, allowNull: false })
    declare hora: string;

    @BelongsTo(() => Mascota)
    declare mascota: Mascota;

    @BelongsTo(() => Veterinario)
    declare veterinario: Veterinario;

    @BelongsTo(() => Servicio)
    declare servicio: Servicio;

    @HasMany(() => DetalleReserva)
    declare detalles: DetalleReserva[];
}

export default Reserva;
