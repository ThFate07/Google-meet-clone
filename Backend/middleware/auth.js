export const auth = (req , res , next) => {
    const token = req.headers.authorization;

    if (!token) { 
        res.status(404).json({message : 'no token provided'})
        return; 
    }

    jwt.verify(token , secretKeyUser, (error , decryptedInfo) => { 
        if (error) { 
            res.status(404).json({message : 'login expired or invalid token'})
            return;
        }

        next()
    })

}