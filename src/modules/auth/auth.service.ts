
import  bcrypt  from 'bcrypt';
import { pool } from "../../config/db"
import jwt from 'jsonwebtoken';
import config from '../../config';

const signup = async (payload: Record<string, unknown>) => {
  const { name, email, password, phone, role } = payload;

  const hashedPass = await bcrypt.hash(password as string,10)

  const result = await pool.query(
    `INSERT INTO users(name, email, password, phone, role) VALUES($1, $2, $3, $4, $5) RETURNING *`,
    [name, email, hashedPass, phone, role,]
  );
  return result;
};


const loginUser = async(email: string, password: string) =>{

    const result = await pool.query(`SELECT * FROM users WHERE email=$1`, [email]);

    if(result.rows.length ===0){
        return null;
    }
    const user = result.rows[0];

    const match = await bcrypt.compare(password, user.password);
    if(!match){
        return false;
    }
    delete user.password;

    const token = jwt.sign({id:user.id, name: user.name, email: user.email, role: user.role}, config.jwtSecret as string, {
        expiresIn: '7d'
    })
    console.log({token});
    return {token, user}
}

export const authServices = {
    signup,
    loginUser
}