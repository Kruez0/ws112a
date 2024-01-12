export function list(Blog_lists) {
    if (!Array.isArray(Blog_lists)) {
        console.error('Invalid Blog_lists: not an array');
        return '';
    }

    let listItems = [];
    for (let Blog of Blog_lists) {
        listItems.push(`
            <li class="post">
                <h2 class="post-title">${Blog.Title}</h2>
                <div class="post-content">${Blog.Content}</div>
                <p><a href="/posting/${Blog.id}">View posts</a></p>
            </li>
        `);
    }
    let content = `
        <h1>My Blog</h1>
        <p>You have <strong>${Blog_lists.length}</strong> Posts!</p>
        <p><a href="/posting/new" class="add-post">Add a Post!</a></p>
        <ul id="Blog_lists">${listItems.join('\n')}</ul>
    `;
    console.log("Generated blog list HTML:", content);
    return layout('Blog_lists', content);
}

export async function renderBlog(ctx, Blog_lists) {
    try {
        const blogContent = list(Blog_lists);
        const blogHTML = layout("My Blog", blogContent);
        ctx.response.body = blogHTML;
        ctx.response.type = 'html';
    } catch (error) {
        console.error('Error in renderBlog:', error);
        ctx.response.status = 500;
        ctx.response.body = 'Internal Server Error';
    }
}

export function layout(title, content) {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${title}</title>
        <style>

        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 0;
            background: #fff;
            color: #333;
        }

        header {
            background-color: #f8f8f8;
            padding: 20px 0;
            text-align: center;
            border-bottom: 1px solid #e7e7e7;
        }

        header h1 {
            margin: 0;
            font-size: 2.5em;
            color: #333;
        }

        #main-content {
            width: 80%;
            max-width: 800px;
            margin: 40px auto;
        }

        .add-post {
            background-color: #333;
            color: #fff;
            text-decoration: none;
            padding: 10px 15px;
            display: inline-block;
            margin-bottom: 30px;
            border-radius: 2px;
        }

        .add-post:hover {
            background-color: #555;
        }

        .post {
            border-left: 4px solid #333;
            padding-left: 15px;
            margin-bottom: 30px;
        }

        .post-title {
            font-size: 1.5em;
            color: #333;
            margin-top: 0;
        }

        .post-content {
            font-size: 1em;
            line-height: 1.6;
        }

        @media (max-width: 768px) {
            #main-content {
                width: 95%;
            }
        }

        </style>
      </head>
      <body>
        <header>
          <h1>MY BLOG</h1>
        </header>
        <div id="main-content">
          ${content}
        </div>
      </body>
      </html>
    `;
  }

export function newBlog() {
    return layout('NewBlog', `
    <h1>New Post</h1>
    <p>Add a new post.</p>
    <form action="/posting" method="post">
      <p><input type="text" placeholder="Title" name="title"></p>
      <p><textarea placeholder="Content" name="content"></textarea></p>
      <p><input type="submit" value="Publish Post"></p>
    </form>
    `);
}

export function showBlog(Blog) {
    return layout(Blog.Title, `
        <div class="post">
            <h1 class="post-title">${Blog.Title}</h1>
            <div class="post-content">${Blog.Content}</div>
        </div>
    `);
}

