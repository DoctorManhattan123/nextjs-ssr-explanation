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
    `<html>
      <head>
        <title>My blog</title>
      </head>
      <body>
        <nav>
          <a href="/">Home</a>
          <hr />
        </nav>
        <article>
          ${escapeHtml(postContent)}
        </article>
        <footer>
          <hr>
          <p><i>(c) ${escapeHtml(author)}, ${new Date().getFullYear()}</i></p>
        </footer>
      </body>
    </html>`
  );
});

function sendHTML(res: FastifyReply, html: string) {
  res.header("Content-Type", "text/html");
  res.send(html);
}
