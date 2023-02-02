import { Model, DataTypes, Optional } from 'sequelize';
import db from '../config/Database';

interface UserAttributes {
    user_id: string;
    first_name: string;
    last_name: string;
    date_of_birth: Date;
    username: string;
    password: string;
    is_admin: boolean;
}

interface UserCreationAttributes
    extends Optional<UserAttributes, 'user_id'> {}

interface UserInstance
    extends Model<UserAttributes, UserCreationAttributes>,
    UserAttributes {
        id: string;
        createdAt?: Date;
        updatedAt?: Date;
    }

    const Users = db.define<UserInstance>('users', {
        user_id: {
            type: DataTypes.STRING,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        first_name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [3, 50]
            }
        },
        last_name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        date_of_birth: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        is_admin: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        }
    }, {
        freezeTableName: true
    })
    
    export default Users;