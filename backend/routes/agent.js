import {GoogleGenerativeAI} from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();




const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
// console.log('model',model);
// console.log('apikey',process.env.GEMINI_API_KEY);


import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
    console.log('hey');
  res.send("Hello from Agent API");
});

router.post("/", async(req, res) => {
    // console.log('hello', req.body);

    try{
  const{ prompt} = req.body;
//   console.log('prompt', prompt);
  const result = await model.generateContent(prompt);
  const chatResponse = result?.response?.text();
  console.log('this is the result', chatResponse);
  res.send(chatResponse);
}
catch(error){
    res.status(500).send({error: error.message});
    console.error(error);
}

});

export default router;
