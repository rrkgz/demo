import { Column, DataType, Model, Table, HasMany } from 'sequelize-typescript';
import Mascota from './Mascota';

@Table({ tableName: 'clientes' })
class Cliente extends Model {
    @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
    declare id_cliente: number;

    @Column({ type: DataType.STRING(12), allowNull: true, unique: true })
    declare rut: string | null;

    @Column({ type: DataType.STRING, allowNull: false })
    declare nombre: string;

    @Column({ type: DataType.STRING, allowNull: false })
    declare direccion: string;

    @Column({ type: DataType.STRING, allowNull: false })
    declare telefono: string;

    @Column({ type: DataType.STRING, allowNull: false })
    declare email: string;

    @HasMany(() => Mascota)
    declare mascotas: Mascota[];
}

export default Cliente;
