# Music Web UI

This software provides a responsive web interface for managing users, root folders and sessions for the [music-server](https://github.com/selfhostmedia/music-server).

If you are using the music-server docker image this server is set up automatically in its docker image. You can access it at `http://<your-server-ip>:3000` and log in with the default administrator account `admin` with password `admin` or whatever you set the  `DEFAULT_ADMIN_USERNAME` and `DEFAULT_ADMIN_PASSWORD` environment variables in your environment settings to.

## Manual set up

This software can be set up manually by following these steps:

1.  Set your `VITE_API_BASE_URL` environment variable to point to your music-server instance. For example, if your music-server is running on `http://localhost:7000` set `VITE_API_BASE_URL=http://localhost:7000`.

2.  Set your `PORT` environment variable to the port you want the web interface to run on. For example, if you want it to run on port `http://localhost:8000` set `PORT=8000`.

3.  If you are accessing the web interface across your network configure the `HOST` address to be available on your work by setting `HOST=0.0.0.0` for all network interfaces, or `HOST=<specific ip>`.

4.  Set up the NodeJS project

```bash
$ npm install
$ npm run build
```

5.  Start the web interface

```bash
$ npm run start:prod
```

## Technical details

The web interface is built with React using React Hook Forms, React-Router, Tanstack-Query, Shadcn components with Tailwind CSS and Lucide icons.

UI tests are performed using Playwright in Chrome, Firefox and WebKit using desktop and mobile specifications.

It leverages the backend's OpenAPI specification for importing API type definitions and typed-API clients using `openapi-typescript` and `openapi-fetch`.
