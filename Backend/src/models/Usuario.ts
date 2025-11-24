import bcrypt from 'bcrypt'
import { BeforeCreate, Column, DataType, Model, Table } from 'sequelize-typescript';




@Table({tableName: 'usuarios'})
class Usuario extends Model{
    @Column({type: DataType.STRING(50), primaryKey: true, allowNull:false, validate:{isEmail: true}})
    declare email: string

    @Column({type: DataType.STRING(100), allowNull:false})
    declare password: string

    @BeforeCreate
    static async hashPassword(usuario: Usuario){
        usuario.password = await bcrypt.hash(usuario.password, 10)
    }
}

export default Usuario