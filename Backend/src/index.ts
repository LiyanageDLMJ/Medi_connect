const express = require("express");
const app=express();
const PORT=3000;
const mongoose = require('mongoose');
const URI="mongodb+srv://liyanagedlmj22:Mokshitha2002@cvupdate.hivx4.mongodb.net/?retryWrites=true&w=majority&appName=CvUpdate"


try{
    mongoose.connect(URI);
    console.log("Connect to server");
}
catch(err){
    console.log(err);
}
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})