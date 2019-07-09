//auth.js
// 이 사람이 인증된 사람인지 아닌지 확인하는 것
//인증되지 않은 사람이라면 404로 보내버리고
const jwt = require('jsonwebtoken')
var tokenKey = 'sfisdifdslfsld'

const authMiddleware = (req, res, next) => {
    const token = req.headers['x-access-token'] || req.query.token;
    console.error(token)
    if(!token) {
        return res.status(403).json({
            success: false,
            message: 'not logged in'
        })
    }

    const p = new Promise(
        (resolve, reject) => {
            jwt.verify(token, tokenKey, (err, decoded) => {
                if(err) reject(err)
                resolve(decoded)
            })
        }
    )

    const onError = (error) => {
        console.log(error);
        res.status(403).json({
            success: false,
            message: error.message
        })
    }

    p.then((decoded)=>{
        req.decoded = decoded
        next()
    }).catch(onError)
}

module.exports = authMiddleware;
