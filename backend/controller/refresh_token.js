import Users from "../models/users_model.js";
import jwt from "jsonwebtoken";

export const refreshToken = async(req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken) return res.sendStatus(401);
        const user = await Users.findAll({
            where:{
                refresh_token: refreshToken
            },include: { all: true }
        });
        if(!user[0]) return res.sendStatus(403);
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, decoded) => {
            if(err) return res.sendStatus(403);
            const userId = user[0].id;
            const name = user[0].name;
            const email = user[0].email;
            // console.log(user[0])
            const doctor = user[0].dokter?1:0;
            const accessToken = jwt.sign({userId, name, email, doctor}, process.env.ACCESS_TOKEN,{
                expiresIn: '1800s'
            });
            res.json({ accessToken });
        });
    } catch (error) {
        console.log(error);
    }
}