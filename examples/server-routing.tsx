import * as React from "react";
import { readFile, readdir } from "fs/promises";
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

fastify.get("/*", async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const page = await matchRoute(url);
    sendHTML(res, <BlogLayout children={page}></BlogLayout>);
  } catch (err) {
    console.error(err);
    res.statusCode = err.statusCode ?? 500;
    res.send();
  }
});

async function matchRoute(url) {
  if (url.pathname === "/") {
    const postFiles = await readdir("./files");
    const postSlugs = postFiles.map((file) =>
      file.slice(0, file.lastIndexOf("."))
    );
    const postContents = await Promise.all(
      postSlugs.map((postSlug) =>
        readFile("./files/" + postSlug + ".txt", "utf8")
      )
    );
    return <BlogIndexPage postSlugs={postSlugs} postContents={postContents} />;
  } else {
    const postSlug = url.pathname.slice(1);
    try {
      const postContent = await readFile(
        "./files/" + postSlug + ".txt",
        "utf8"
      );
      return <BlogPostPage postSlug={postSlug} postContent={postContent} />;
    } catch (err) {
      throwNotFound(err);
    }
  }
}

function sendHTML(res: FastifyReply, jsx: Element) {
  const html = renderJSXToHTML(jsx);
  res.header("Content-Type", "text/html");
  res.send(html);
}

function renderJSXToHTML(jsx) {
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
      if (typeof jsx.type === "string") {
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
        // added this else statement to treat function components
      } else if (typeof jsx.type === "function") {
        // Is it a component like <BlogPostPage>?
        // Call the component with its props, and turn its returned JSX into HTML.
        const Component = jsx.type;
        const props = jsx.props;
        const returnedJsx = Component(props);
        return renderJSXToHTML(returnedJsx);
      } else throw new Error("Not implemented.");
    }
  } else throw new Error("Not implemented.");
}

function BlogLayout({ children }) {
  const author = "Jae Doe";
  return (
    <html>
      <head>
        <title>My blog</title>
      </head>
      <body>
        <nav>
          <a href="/">Home</a>
          <hr />
        </nav>
        <main>{children}</main>
        <Footer author={author} />
      </body>
    </html>
  );
}

function BlogPostPage({ postSlug, postContent }) {
  return (
    <section>
      <h2>
        <a href={"/" + postSlug}>{postSlug}</a>
      </h2>
      <article>{postContent}</article>
    </section>
  );
}

function BlogIndexPage({ postSlugs, postContents }) {
  return (
    <section>
      <h1>Welcome to my blog</h1>
      <div>
        {postSlugs.map((postSlug, index) => (
          <section key={postSlug}>
            <h2>
              <a href={"/" + postSlug}>{postSlug}</a>
            </h2>
            <article>{postContents[index]}</article>
          </section>
        ))}
      </div>
    </section>
  );
}

function Footer({ author }) {
  return (
    <footer>
      <hr />
      <p>
        <i>
          (c) {author} {new Date().getFullYear()}
        </i>
      </p>
    </footer>
  );
}

function throwNotFound(cause) {
  const notFound = new Error(`Not found. ${cause}`);
  throw notFound;
}
