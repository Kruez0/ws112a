import { Application, Router, send } from "https://deno.land/x/oak/mod.ts";

const users = new Map();
  users.set("john", {
    username: "john",
    password: "nani",
  });
  users.set("mary", {
    username: "mary",
    password: "Magdalana-313543",
  });
const router = new Router();

router
  .get("/", async (ctx) => {
    await send(ctx, "/public/index.html", {
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
        ctx.response.body = `Login successful for ${username}!`;
      } else {
        ctx.response.body = "Login failed. Please check your username and password.";
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
        ctx.response.body = {'error': `Username ${username} already exists!`};
      } else {
        users.set(username, {username, password});
        ctx.response.type = 'text/html';
        ctx.response.body = `<p>Sign up (${username}, ${password}) successful</p><p><a href="/public/login.html">Login?</a></p>`;
      }
    }
  })
  .get("/public/(.*)", async (ctx) => {
    const wpath = ctx.params[0];
    console.log('wpath=', wpath);
    await send(ctx, wpath, {
      root: Deno.cwd() + "/public/",
      index: "index.html",
    });
  });

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

console.log('start at : http://127.0.0.1:8010');

await app.listen({ port: 8010 });
