import { Column, DataType, Model, Table, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript';
import Cliente from './Cliente';
import Veterinario from './Veterinario';
import Reserva from './Reserva';

@Table({ tableName: 'mascotas' })
class Mascota extends Model {
    @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
    declare id_mascota: number;

    @ForeignKey(() => Cliente)
    @Column({ type: DataType.INTEGER, allowNull: false })
    declare rut_cliente: number;

    @ForeignKey(() => Veterinario)
    @Column({ type: DataType.STRING(50), allowNull: true })
    declare id_veterinario: string;

    @Column({ type: DataType.STRING, allowNull: false })
    declare nombre: string;

    @Column({ type: DataType.STRING, allowNull: false })
    declare especie: string;

    @Column({ type: DataType.STRING, allowNull: false, defaultValue: '' })
    declare raza: string;

    @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
    declare edad: number;

    @Column({ type: DataType.FLOAT, allowNull: false, defaultValue: 0 })
    declare peso: number;

    @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
    declare sexo: boolean;

    @BelongsTo(() => Cliente)
    declare cliente: Cliente;

    @BelongsTo(() => Veterinario, { foreignKey: 'id_veterinario', targetKey: 'email' })
    declare veterinario: Veterinario;

    @HasMany(() => Reserva)
    declare reservas: Reserva[];
}

export default Mascota;
