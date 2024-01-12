import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import * as render from './render.js';
import { DB } from "https://deno.land/x/sqlite/mod.ts";

const db = new DB("contactNumbers.db");
db.query("CREATE TABLE IF NOT EXISTS contactNumbers (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, phoneNumber TEXT)");

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

function query(sql,params) {
  let list = [];
  for (const [id, name, phoneNumber] of db.query(sql,params)) {
    list.push({ id, name, phoneNumber });
  }
  return list;
}

async function findNumber(ctx) {
  const body = await ctx.request.body();
  const params = await body.value;

  const nameToFind = params.get('name');
  const contactNumbers = query("SELECT id, name, phoneNumber FROM contactNumbers WHERE name = ?", [nameToFind]);

  if (contactNumbers.length > 0) {
    ctx.response.body = await render.showContactNumber(contactNumbers[0]);
  } else {
    ctx.response.body = await render.notFound();
  }
  console.log('Name to find:', nameToFind);
  console.log('Contact numbers:', contactNumbers);
}

async function list(ctx) {
  let contactNumbers = query("SELECT id, name, phoneNumber FROM contactNumbers");
  console.log('list:contactNumbers=', contactNumbers)
  ctx.response.body = await render.list(contactNumbers);
}

async function add(ctx) {
  ctx.response.body = await render.newContactNumber();
}

async function show(ctx) {
  const pid = ctx.params.id;
  let contactNumbers = query(`SELECT id, name, phoneNumber FROM contactNumbers WHERE id=${pid}`)
  let contactNumber = contactNumbers[0]
  console.log('show:contactNumber=', contactNumber)
  if (!contactNumber) {
    ctx.throw(404, 'Invalid contact number id');
  }
  ctx.response.body = await render.showContactNumber(contactNumber);
}

async function create(ctx) {
  const body = ctx.request.body({ type: 'form' }); 
  const form = await body.value; 
  const contactName = form.get('contactName'); 
  const phoneNumber = form.get('phoneNumber');
  console.log('create:contactName=', contactName, 'phoneNumber=', phoneNumber);
  await db.query("INSERT INTO contactNumbers (name, phoneNumber) VALUES (?, ?)", [contactName, phoneNumber]);
  ctx.response.redirect('/');
}


let port = parseInt(Deno.args[0])
console.log(`Server run at http://127.0.0.1:${port}`)
await app.listen({ port });