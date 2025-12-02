import bcrypt from 'bcrypt';
import { BeforeCreate, Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'veterinarios' })
class Veterinario extends Model {
    @Column({ type: DataType.STRING(50), primaryKey: true, allowNull: false, validate: { isEmail: true } })
    declare email: string;

    @Column({ type: DataType.STRING(100), allowNull: false })
    declare nombre: string;

    @Column({ type: DataType.STRING(20), allowNull: false })
    declare especialidad: string;

    @Column({ type: DataType.STRING(10), allowNull: false, defaultValue: 'activo' })
    declare estado: string;

    @Column({ type: DataType.STRING(100), allowNull: false })
    declare password: string;

    @BeforeCreate
    static async hashPassword(veterinario: Veterinario) {
        veterinario.password = await bcrypt.hash(veterinario.password, 10);
    }
}

export default Veterinario;
