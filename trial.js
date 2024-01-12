import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import * as render from './render_blog.js';

const Blog_lists = [
    { id: 0, Title: 'I Saw A Kitten Stuck On a Tree Today', Content: 'Today was an unexpected adventure in our tight-knit neighborhood as we rallied together to rescue a stranded kitten. The little furball had perched itself high up in a tree for nearly a day, eliciting concern from everyone. With the help of local firefighters and animal control, we orchestrated a daring rescue …    ' },
    { id: 1, Title: 'My Most Delicious Food', Content: 'The most delicious food in the world is Noodles. You don’t understand but after I eat noodle, I am very content. I think the noodle from my country is better than any other country. Maybe its because I haven’t tried other country’s noodle, but I believe that my country’s noodle is the best！    ' }
];

const router = new Router();

router
  .get('/', list)
  .get('/posting/new', add)
  .get('/posting/:id', show)
  .post('/posting', create)

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
        // Assign the value to the correct property
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
    ctx.response.redirect('/');
  }
}

console.log('Server run at http://127.0.0.1:8000');
await app.listen({ port: 8000 });
