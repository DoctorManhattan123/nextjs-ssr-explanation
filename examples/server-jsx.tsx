import * as React from "react";
import { readFile } from "fs/promises";
import * as escapeHtml from "escape-html";
// Import the framework and instantiate it
import Fastify, { FastifyReply, FastifyRequest } from "fastify";
const fastify = Fastify({
  logger: true,
});

// Run the server!
fastify
  .listen({ port: 3000 })
  .then()
  .catch((err) => {
    fastify.log.error(err);
    process.exit(1);
  });

fastify.get("/post", async (req: FastifyRequest, res: FastifyReply) => {
  const author = "Alexander Berkov";
  const postContent = await readFile("./files/hello-world.txt", "utf8");
  sendHTML(
    res,
    <html>
      <head>
        <title>My blog</title>
      </head>
      <body>
        <nav>
          <a href="/">Home</a>
          <hr />
        </nav>
        <article>{escapeHtml(postContent)}</article>
        <footer>
          <hr />
          <p>
            <i>
              (c) {escapeHtml(author)}, {new Date().getFullYear()}
            </i>
          </p>
        </footer>
      </body>
    </html>
  );
});

function sendHTML(res: FastifyReply, jsx: Element) {
  const html = renderJSXToHTML(jsx);
  res.header("Content-Type", "text/html");
  res.send(html);
}

function renderJSXToHTML(jsx) {
  console.debug({ jsx });
  if (typeof jsx === "string" || typeof jsx === "number") {
    // This is a string. Escape it and put it into HTML directly.
    return escapeHtml(jsx);
  } else if (jsx == null || typeof jsx === "boolean") {
    // This is an empty node. Don't emit anything in HTML for it.
    return "";
  } else if (Array.isArray(jsx)) {
    // This is an array of nodes. Render each into HTML and concatenate.
    return jsx.map((child) => renderJSXToHTML(child)).join("");
  } else if (typeof jsx === "object") {
    // Check if this object is a React JSX element (e.g. <div />).
    if (jsx.$$typeof === Symbol.for("react.element")) {
      // Turn it into an an HTML tag.
      let html = "<" + jsx.type;
      for (const propName in jsx.props) {
        if (jsx.props.hasOwnProperty(propName) && propName !== "children") {
          html += " ";
          html += propName;
          html += "=";
          html += escapeHtml(jsx.props[propName]);
        }
      }
      html += ">";
      html += renderJSXToHTML(jsx.props.children);
      html += "</" + jsx.type + ">";
      return html;
    } else throw new Error("Cannot render an object.");
  } else throw new Error("Not implemented.");
}
