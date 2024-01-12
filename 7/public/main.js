var R = {}

window.onhashchange = async function () {
  var r
  var tokens = window.location.hash.split('/')
  console.log('tokens=', tokens)
  switch (tokens[0]) {
    case '#show':
      r = await window.fetch('/post/' + tokens[1])
      let post = await r.json()
      R.show(post)
      break
    case '#new':
      R.new()
      break
    default:
      r = await window.fetch('/list')
      let posts = await r.json()
      R.list(posts)
      break
  }
}

window.onload = function () {
  window.onhashchange()
}

R.layout = function (title, content) {
  document.querySelector('title').innerText = title
  document.querySelector('#content').innerHTML = content
}

R.list = function (posts) {
  let list = []
  for (let post of posts) {
    list.push(`
    <li>
      <h2>${post.title}</h2>
      <p><a id="show${post.id}" href="#show/${post.id}">View Contacts</a></p>
    </li>
    `)
  }
  let content = `
  <h1>Contact Person</h1>
  <p>You have <strong>${posts.length}</strong> Contacts</p>
  <p><a id="createPost" href="#new">New Contacts</a></p>
  <ul id="posts">
    ${list.join('\n')}
  </ul>
  `
  return R.layout('Posts', content)
}

R.new = function () {
  return R.layout('New Post', `
  <h1>New Contact</h1>
  <form>
    <p><input id="title" type="text" placeholder="First Name" name="title"></p>
    <p><textarea id="body" placeholder="Phone Number" name="body"></textarea></p>
    <p><input id="savePost" type="button" onclick="R.savePost()" value="New"></p>
  </form>
  `)
}

R.show = function (post) {
  return R.layout(post.title, `
    <h1>${post.title}</h1>
    <p>${post.body}</p>
  `)
}

R.savePost = async function () {
  let title = document.querySelector('#title').value
  let body = document.querySelector('#body').value
  let r = await window.fetch('/post', {
    body: JSON.stringify({title: title, body: body}),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  window.location.hash = '#list'
  return r
}