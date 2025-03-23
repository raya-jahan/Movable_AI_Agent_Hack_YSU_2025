import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import agentRoutes from "./routes/agent.js";
import uploadRoutes from "./routes/upload.js"; // New upload route


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", agentRoutes);
app.use("/api", uploadRoutes);
const PORT = 5001;
app.listen(PORT, () =>{
    console.log(`server running at http://localhost:${PORT}`);
});