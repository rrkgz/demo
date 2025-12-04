import { Column, DataType, Model, Table, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import Cliente from './Cliente';
import Reserva from './Reserva';

@Table({ tableName: 'mascotas' })
class Mascota extends Model {
    @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
    declare id_mascota: number;

    @ForeignKey(() => Cliente)
    @Column({ type: DataType.INTEGER, allowNull: false })
    declare rut_cliente: number;

    @Column({ type: DataType.STRING, allowNull: false })
    declare nombre: string;

    @Column({ type: DataType.STRING, allowNull: false })
    declare especie: string;

    @Column({ type: DataType.STRING, allowNull: false, defaultValue: '' })
    declare raza: string;

    @Column({ type: DataType.INTEGER, allowNull: true })
    declare edad: number | null;

    @Column({ type: DataType.FLOAT, allowNull: true })
    declare peso: number | null;

    @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
    declare sexo: boolean;

    @BelongsTo(() => Cliente)
    declare cliente: Cliente;

    @HasMany(() => Reserva)
    declare reservas: Reserva[];
}

export default Mascota;
