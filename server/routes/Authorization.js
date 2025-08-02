const express=require('express')
const router=express.Router();


const USER={
    username:'admin',
    password:'admin123'
}



router.post('/login',(req,res)=>{
    const{username,password}=req.body

    if(!username || !password){
        return res.status(400).json({message:'Username and password are requires'})
    }

   if(username === USER.username && password === USER.password){
   return res.json({
     message: 'Login successful',
     username: USER.username,
     email: 'admin@example.com' 
   });
}
    else {

    return res.status(401).json({ message: 'Invalid username or password' });
  }

  
})

module.exports = router;