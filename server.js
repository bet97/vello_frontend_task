import express from "express";
// import serveStatic from "serve-static";
import path from "path";
import { fileURLToPath } from "url";
const app = express();
//we need to change up how __dirname is used for ES6 purposes
const __dirname = path.dirname(fileURLToPath(import.meta.url));
//now please load my static html and css files for my express app, from my /dist directory
app.use(express.static(path.join(__dirname, "dist")));
const port = import.meta.env.PORT || 3000;
app.listen(port);
