import { Application, Router, send } from "https://deno.land/x/oak/mod.ts";
import * as render from './render_blog.js';
const Blog_lists = [
  { id: 0, Title: 'I Saw A Kitten Stuck On a Tree Today', Content: 'Today was an unexpected adventure in our tight-knit neighborhood as we rallied together to rescue a stranded kitten. The little furball had perched itself high up in a tree for nearly a day, eliciting concern from everyone. With the help of local firefighters and animal control, we orchestrated a daring rescue …    ' },
  { id: 1, Title: 'My Most Delicious Food', Content: 'The most delicious food in the world is Noodles. You don’t understand but after I eat noodle, I am very content. I think the noodle from my country is better than any other country. Maybe its because I haven’t tried other country’s noodle, but I believe that my country’s noodle is the best！    ' }
];
const users = new Map();
  users.set("john", {
    username: "john",
    password: "nani123",
  });
  users.set("mary", {
    username: "mary",
    password: "sugoi-313543",
  });


const router = new Router();

//blog router
router
  .get('/posting/new', add)
  .get('/posting/:id', show)
  .post('/posting', create)
  .get('/list', list);
const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());
async function list(ctx) {
  ctx.response.body = await render.list(Blog_lists);
}

async function add(ctx) {
  ctx.response.body = await render.newBlog();
}

async function show(ctx) {
  const id = ctx.params.id;
  const Blog = Blog_lists[id];
  if (!Blog) {
    ctx.throw(404, 'Invalid Title id');
  }
  ctx.response.body = await render.showBlog(Blog);
}

async function create(ctx) {
  const body = ctx.request.body();
  if (body.type === "form") {
    const pairs = await body.value;
    const Blog = {};
    for (const [key, value] of pairs) {
        if (key === 'title') {
          Blog['Title'] = value;
        } else if (key === 'content') {
          Blog['Content'] = value;
        }
      }
    console.log('Blog=', Blog);
    const id = Blog_lists.push(Blog) - 1;
    Blog.created_at = new Date();
    Blog.id = id;
    ctx.response.redirect('/list');
  }
}

//login router
router
  .get("/", async (ctx) => {
    await send(ctx, "/start/mid.html", {
      root: Deno.cwd(),
    });
  })
  .get("/users", (ctx) => {
    ctx.response.body = Array.from(users.values());
  })
  .post("/users/login", async (ctx) => {
    const body = ctx.request.body();
    if (body.type === "form") {
      const pairs = await body.value;
      const username = pairs.get("username");
      const password = pairs.get("password");

      const user = users.get(username);
      if (user && user.password === password) {
        ctx.response.body = await render.list(Blog_lists);
      } else {
        ctx.response.redirect('/start/mid.html?login=failed');
      }
    }
  })
  .post("/users/signup", async (ctx) => {
    const body = ctx.request.body();
    if (body.type === "form") {
      const pairs = await body.value;
      console.log('pairs=', pairs);
      const params = {};
      for (const [key, value] of pairs) {
        params[key] = value;
      }
      console.log('params=', params);
      let username = params['username'];
      let password = params['password'];
      console.log(`username=${username} password=${password}`);
      if (users.get(username)) {
        ctx.response.redirect('/start/signup.html?signup=failed');
      } else {
        users.set(username, {username, password});
        ctx.response.type = 'text/html';
        ctx.response.redirect('/start/aftersignup.html')
      }
    }
  })
  .get("/start/(.*)", async (ctx) => {
    const wpath = ctx.params[0];
    console.log('wpath=', wpath);
    await send(ctx, wpath, {
      root: Deno.cwd()+"/start/",
      index: "mid.html",
    });
  });



console.log('start at : http://127.0.0.1:8008');

await app.listen({ port: 8008 });
