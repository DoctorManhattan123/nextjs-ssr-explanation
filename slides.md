# Next.js Introduction

## React Components

Pre Server Components:

Previously react components were just javascript objects that were places into the virtual DOM
by `react` and `react-dom`.
The main drawback of using doing this is that the whole page had to load before any content could 
be displayed. Even one long running request would block the entire page.

### SSR Pre-React 18 Basic Server Side Rendering

Sends the entire html in one go to the client.

```ts
// Server-side (Express.js example)
import express from 'express';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { App } from '../client/App';

const app = express();

app.get('/', (req, res) => {
    const appString = ReactDOMServer.renderToString(<App />);
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head><title>React App</title></head>
        <body>
            <div id="root">${appString}</div>
            <script src="/bundle.js"></script>
        </body>
        </html>
    `);
});

app.listen(8080);
```

### SSR React 18 `renderToNodeStream`

Introduced in React 16 and continued in React 18, renderToNodeStream allows for streaming of SSR content
but does not support Suspense or incremental data fetching strategies. It streams the HTML as it is generated,
which can improve the perceived performance by sending the HTML to the client as soon as possible.

This example shows an improvement by beginning to send the response as soon as the server starts rendering, 
but it still renders the entire app before sending anything to the client, not leveraging data loading boundaries
or incremental rendering.

```ts
import express from 'express';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { App } from '../client/App';

const app = express();

app.get('/', (req, res) => {
    res.write('<!DOCTYPE html><html lang="en"><head><title>React App</title></head><body><div id="root">');
    const stream = ReactDOMServer.renderToNodeStream(<App />);
    stream.pipe(res, { end: false });
    stream.on('end', () => {
        res.write('</div><script src="/bundle.js"></script></body></html>');
        res.end();
    });
});

app.listen(8080);
```

### SSR React 18 `renderToPipeableStream`

React 18's renderToPipeableStream and Suspense allow for truly incremental rendering, where different 
parts of the application can be streamed and rendered independently as data becomes available, 
significantly improving loading times and interactivity.

```ts
import express from 'express';
import React, { Suspense } from 'react';
import ReactDOMServer from 'react-dom/server';
import { App } from '../client/App';

const app = express();

app.get('/', (req, res) => {
    let didError = false;

    const { pipe, abort } = ReactDOMServer.renderToPipeableStream(
        <Suspense fallback={<div>Loading...</div>}>
            <App />
        </Suspense>,
        {
            onShellReady() {
                res.statusCode = didError ? 500 : 200;
                res.setHeader('Content-Type', 'text/html');
                res.write('<!DOCTYPE html><html lang="en"><head><title>React App</title></head><body><div id="root">');
                pipe(res);
            },
            onShellError(err) {
                console.error(err);
                res.statusCode = 500;
                res.send('Server error');
                abort();
            },
            onError(error) {
                didError = true;
                console.error('Streaming error:', error);
            },
        }
    );

    pipe.on('end', () => res.end('</div><script src="/bundle.js"></script></body></html>'));
});

app.listen(8080);
```


Streams make it easy to build more responsive websites due to content not needing to wait for long loading content
to start rendering.

Next.js also uses this technique to optimize the user experience.

You could implement this yourself, but you should probably use a predefined framework for that ([here](https://react.dev/learn/start-a-new-react-project#which-features-make-up-the-react-teams-full-stack-architecture-vision))

Streaming makes even heavy loaded sites very performant, if used correctly.

Further notes:

* [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
* [Client Components](https://nextjs.org/docs/app/building-your-application/rendering/client-components)
* [Composition Patterns](https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns)
* [Streaming](https://nextjs.org/docs/app/building-your-application/routing/loading-ui-and-streaming)
* [Streaming Example](https://nextjs.org/learn/dashboard-app/streaming)

## Next.js Routing

Next.js uses `file-based` routing. There are currently two routers:

* pages router (outdated)
* app router

### Pages

Both routers use the same method for routing. Folders are used to define routes and each folder represents a route segment.
To expose a route, you have to export a default component inside a `page.tsx` (page.js) file.

All paths will be relative to the app directory.

For example a default exported component inside the `src/app/page.tsx` file would be shown if you navigate to `localhost:3000/`.
A default exported component inside the `src/app/posts/dashboard/page.tsx` file would be shown if you navigate to `localhost:3000/posts/dashboard`.

### Dynamic Routes

You can also create dynamic routes, by using the following syntax. Lets assume you have call a site with `/posts/3` and you
want the page to display different content depending on the last number, but the component of the page is the same,
you just want to fetch a post with another id depending on the last number. You can use the following syntax:

You default export a component at `src/app/posts/[id]/page.tsx`, the `[id]` will map to anything and give you the param
inside your component:

```ts
export default function Task({ params }: { params: { id: string } }) {
  return <p>This is a task with ID {params.id}</p>;
}
```

If you now call `/posts/4`, the page will display: `This is a task with ID 4`.
If you call `/posts/asahjkas`, the page will display: `This is a task with ID asahjkas`.

With this you can fetch data extremely dynamically only depending on the values in your url. This makes it possible
to put a lot of state into the url, moving a lot of complex state logic onto the server.

### Layouts

You can define layouts to share some common UI between pages. To do this you have to default export a component
inside a `layout.tsx` file. There is already one root layout defined, which you can find at `src/app/layout.tsx`. This root
layout wraps every content of pages or other layouts into an html:

```ts
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

If you now want to add a header for every page, you can just do:

```ts
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header>My header</header>
        {children}
      </body>
    </html>
  );
}
```

Now every page will have a header, this is incredibly useful for common UI, like navbars footer, etc. Next.js will also
cache layouts between different pages, removing the need to fetch the same layout for different pages, which makes it
more performant.

Next.js has a special component for navigating called `Link`, this component does a few additional things, but is
essentially just a wrapper around the anchor tag `<a href="/">Link</a>`.

```ts
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <h1>Welcome</h1>
      Go to the <Link href="/about">About</Link> page
    </>
  );
}
```

You can also very easily define router handlers:

Route handlers are following the same file based routing structure as the pages, but instead of a `page.tsx`, you
define a `route.ts`

```ts
// src/app/api/posts/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    postId: 1,
  });
}
```

```sh
$ curl localhost:3000/api/posts
{"postId": 1}
```

Next.js will create an API endpoint, and if you call `localhost/api/posts` you will get the data you return in this route handler.
This makes it extremely easy to use put heavy logic inside of SSR and use Next.js features for your app and still expose
API endpoints for other things, for example other application which want to use the same database, or some specific data, belonging
to the application.

## Data Fetching

Next.js extends the native fetch Web API to allow you to configure the caching and revalidating behavior for
each fetch request on the server.

You can use fetch inside Server Components, route handlers and server actions with async/await.


