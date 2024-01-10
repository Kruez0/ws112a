export function layout(title, content) {
    return `
    <html>
    <head>
      <title>${title}</title>
      <style>
        body {
          padding: 80px;
          font: 16px Helvetica, Arial;
        }
    
        h1 {
          font-size: 2em;
        }
    
        h2 {
          font-size: 1.2em;
        }
    
        #contactNumbers {
          margin: 0;
          padding: 0;
        }
    
        #contactNumbers li {
          margin: 40px 0;
          padding: 0;
          padding-bottom: 20px;
          border-bottom: 1px solid #eee;
          list-style: none;
        }
    
        #contactNumbers li:last-child {
          border-bottom: none;
        }
    
        textarea {
          width: 500px;
          height: 300px;
        }
    
        input[type=text],
        input[type=tel],
        textarea {
          border: 1px solid #eee;
          border-top-color: #ddd;
          border-left-color: #ddd;
          border-radius: 2px;
          padding: 15px;
          font-size: .8em;
        }
    
        input[type=text] {
          width: 500px;
        }
      </style>
    </head>
    <body>
      <section id="content">
        ${content}
      </section>
    </body>
    </html>
    `;
}

export function list(contactNumbers) {
    let list = [];
    for (let contactNumber of contactNumbers) {
        list.push(`
      <li>
        <h2>${contactNumber.Name}</h2>
        <p><a href="/contact-number/${contactNumber.id}">View contact number</a></p>
      </li>
      `);
    }
    let content = `
    <h2>Find Phone Number</h2>
        <form action="/find-number" method="post">
          <p><input type="text" placeholder="Enter Name" name="name"></p>
          <p><input type="submit" value="Find Number"></p>
    <h1>Contact Numbers</h1>
    <p>You have <strong>${contactNumbers.length}</strong> contact numbers!</p>
    <p><a href="/contact-number/new">Add a Contact Number</a></p>
    <ul id="contactNumbers">
      ${list.join('\n')}
    </ul>
    `;
    return layout('Contact Numbers', content);
}

export function newContactNumber() {
    return layout('New Contact Number', `
    <h1>New Contact Number</h1>
    <p>Add a new contact number.</p>
    <form action="/contact-number" method="post">
      <p><input type="text" placeholder="Contact Name" name="contactName"></p>
      <p><input type="tel" placeholder="Phone Number" name="phoneNumber"></p>
      <p><input type="submit" value="Add Contact"></p>
    </form>
    `);
}

export function showContactNumber(contactNumber) {
    return layout(contactNumber.Name, `
      <h1>${contactNumber.Name}</h1>
      <p>Phone Number: ${contactNumber.phoneNumber}</p>
    `);
}
export function notFound() {
    return `
      <html>
      <head>
        <title>Contact Not Found</title>
      </head>
      <body>
        <h1>Contact Not Found</h1>
        <p>The requested contact was not found.</p>
      </body>
      </html>
    `;
  }
  
