import bcrypt from 'bcrypt'
import { BeforeCreate, Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({tableName: 'usuarios'})
class Usuario extends Model{
    @Column({type: DataType.STRING(50), primaryKey: true, allowNull:false, validate:{isEmail: true}})
    declare email: string

    @Column({type: DataType.STRING(100), allowNull:false})
    declare password: string

    @Column({type: DataType.STRING(12), allowNull: true, unique: true})
    declare rut_cliente: string | null

    @Column({type: DataType.STRING(255), allowNull: true})
    declare nombre: string | null

    @Column({type: DataType.STRING(255), allowNull: true})
    declare direccion: string | null

    @Column({type: DataType.STRING(20), allowNull: true})
    declare telefono: string | null

    @BeforeCreate
    static async hashPassword(usuario: Usuario){
        usuario.password = await bcrypt.hash(usuario.password, 10)
    }
}

export default Usuario