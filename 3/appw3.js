import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import * as render from './render_w3.js';

const contactNumbers = [
    { id: 0, Name: 'Tashia', phoneNumber: '1234567890' },
    { id: 1, Name: 'Phillip', phoneNumber: '9876543210' }
];

const router = new Router();

router
  .get('/', list)
  .get('/contact-number/new', add)
  .get('/contact-number/:id', show)
  .post('/contact-number', create)
  .post('/find-number', findNumber);

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

async function findNumber(ctx) {
  const body = await ctx.request.body();
  const params = await body.value;

  const nameToFind = params.get('name');
  const contactNumber = contactNumbers.find(c => c.Name === nameToFind);

  if (contactNumber) {
    ctx.response.body = await render.showContactNumber(contactNumber);
  } else {
    ctx.response.body = await render.notFound();
  }
}



async function list(ctx) {
  ctx.response.body = await render.list(contactNumbers);
}

async function add(ctx) {
  ctx.response.body = await render.newContactNumber();
}

async function show(ctx) {
  const id = ctx.params.id;
  const contactNumber = contactNumbers[id];
  if (!contactNumber) {
    ctx.throw(404, 'Invalid contact number id');
  }
  ctx.response.body = await render.showContactNumber(contactNumber);
}

async function create(ctx) {
  const body = ctx.request.body();
  if (body.type === "form") {
    const pairs = await body.value;
    const contactNumber = {};
    for (const [key, value] of pairs) {
      contactNumber[key] = value;
    }
    console.log('contactNumber=', contactNumber);
    const id = contactNumbers.push(contactNumber) - 1;
    contactNumber.created_at = new Date();
    contactNumber.id = id;
    ctx.response.redirect('/');
  }
}

console.log('Server run at http://127.0.0.1:8000');
await app.listen({ port: 8000 });
