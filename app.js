var express=require('express')
var bodyparser=require('body-parser')
var mongoose=require('mongoose')
var app=express()
app.use(express.static('public'))
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({
    extended:true
}))
mongoose.connect('mongodb://localhost:27017/mydb1',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});
var db = mongoose.connection;
db.on('error',()=>console.log("Error in Connecting to Database"))
db.once('open',()=>console.log("Connected to Database"))
app.get('/',(req,res)=>{
    return res.redirect('register.html');
})
app.post('/registered',(req,res)=>{
    var email=req.body.user_email;
    var password=req.body.user_password;
    var data={
        "email":email,
        "pwd":password,
    }
    let s1=email.length;
    let s2=password.length;
    if(s1==0 || s2==0)
    return res.redirect('register.html')
    db.collection('users').insertOne(data,(err,collection)=>{
        
        console.log("Record Inserted Successfully");
        res.redirect('/registered.html');
    });
})
app.post("/loginUser",async (req,res)=>{
    //console.log(req.body.email);
    try{
    let data=await db.collection('users').findOne({email:req.body.email,pwd:req.body.password})
    //console.log(data);
    if (data){
        res.send("Successfully Logged In");
    }
    else{
       res.send(`First Register in this page and next login : <a href="./register.html">Register Page</a>`)
    }
}
catch (err) {
    res.send("not found");
}
})
app.listen(8080);