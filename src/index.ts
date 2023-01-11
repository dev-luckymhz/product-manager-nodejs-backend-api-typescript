import  express, {Request, Response} from "express";
import  cors  from "cors";

const app = express();


app.use(express.json());
app.use(cors({
    origin: ["http://localhost:3000"]
    }));

app.get('/', (req: Request, res: Response)=>{
    res.send('Welcome to the app')
});

app.listen(8000, ()=>{
console.log("listening in port 8000");

})