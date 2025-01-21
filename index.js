const express=require('express');

const app=express();
const fs = require('fs');
const logFilePath = './requests.log';

app.use((req,res,next)=>{
    console.log('Request URL:',req.url);
    console.log('Protocol:',req.protocol)
    console.log('Request Method:',req.method);
    console.log('Request Time:',new Date());
    console.log('Request IP:',req.ip);
    console.log('Hostname',req.hostname);
    const logDetails = {
        timestamp: new Date().toISOString(), 
        ip: req.ip,                         
        url: req.url,
        protocol: req.protocol,         
        method: req.method,                 
        hostname: req.hostname              
    };
    fs.appendFile(
        logFilePath,
        JSON.stringify(logDetails) + '\n',
        (err) => {
            if (err) {
                console.error('Error writing to log file:', err);
            }
        }
    );
    next();
});

app.get('/',(req,res)=>{
    res.send('Hello World');
});

app.get('/about',(req,res)=>{
    res.send('About Us');
});

// app.get('/profile/:commentId/:Id',(req,res)=>{
//     console.log(req.params);
//     const {commentId,Id}=req.params;
//     // res.send('print the commentId and Id');
//     res.send(`Comment ID: ${req.params.commentId} and ID: ${req.params.Id}`);
// }   );


app.listen(3000,()=>{
    console.log('Server is running on port 3000');
}); 