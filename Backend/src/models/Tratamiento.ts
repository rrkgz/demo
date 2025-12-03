import { Column, DataType, Model, Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import Boleta from './Boleta';

@Table({ tableName: 'tratamientos' })
class Tratamiento extends Model {
    @Column({ type: DataType.INTEGER, primaryKey: true, autoIncrement: true })
    declare id_tratamiento: number;

    @ForeignKey(() => Boleta)
    @Column({ type: DataType.INTEGER, allowNull: false })
    declare id_boleta: number;

    @Column({ type: DataType.DATE, allowNull: false })
    declare fecha: Date;

    @Column({ type: DataType.STRING, allowNull: true })
    declare descripcion: string;

    @Column({ type: DataType.STRING, allowNull: true })
    declare medicamentos: string;

    @Column({ type: DataType.STRING, allowNull: true })
    declare tratamiento: string;

    @Column({ type: DataType.STRING, allowNull: true })
    declare diagnostico: string;

    @BelongsTo(() => Boleta)
    declare boleta: Boleta;
}

export default Tratamiento;
