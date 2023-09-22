import { Application, Router } from "https://deno.land/x/oak/mod.ts";

const classes = new Map();
classes.set("e320", {
  id: "e320",
  title: "Multimedia Classroom",
  author: "Teacher 1",
});
classes .set("e319", {
  id: "e319",
  title: "Embedded Lab Classroom",
  author: "Teacher 2",
});
const router = new Router();
router
  .get("/", (context) => {
    context.response.body = `
    <html>
    <body>
       <a href="http://127.0.0.1:8000/room/">know the classes</a><br></br>
       <a href="http://127.0.0.1:8000/nqu/">金門大學</a><br></br>
       <a href="http://127.0.0.1:8000/nqu/csie/">金門大學資工系</a><br></br>
       <a href="http://127.0.0.1:8000/to/nqu/">go directly to 金門大學網站</a><br></br>
       <a href="http://127.0.0.1:8000/to/nqu/csie/">go directly to 金門大學資工系</a><br></br>
    </body>
    </html>`
  })
  .get("/nqu", (context) => {
    context.response.body = `
    <html>
    <body>
    <a href="https://www.nqu.edu.tw/">金門大學</a>
    </body>
    </html>`
})
.get("/nqu/csie", (context) => {
    
    context.response.body = ` 
    <html>
    <body>
       <a href="https://csie.nqu.edu.tw/">金門大學資工系</a>
    </body>
    </html>`
  })
  .get("/to/nqu", (context) => {
    context.response.redirect("https://www.nqu.edu.tw/");
  })
  .get("/to/nqu/csie", (context) => {
    context.response.redirect("https://csie.nqu.edu.tw/");
  })
  .get("/room", (context) => {
    context.response.body = Array.from(classes.values());
  })
  .get("/room/:id", (context) => {
    if (context.params && context.params.id && classes.has(context.params.id)) {
      context.response.body = classes.get(context.params.id);
    }
  });

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

console.log('start at : http://127.0.0.1:8000')
await app.listen({ port: 8000 });
