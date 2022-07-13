import type { MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { ExternalScripts, ExternalScriptsFunction } from "remix-utils";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
});

const scripts: ExternalScriptsFunction = () => {
  return [
    {
      src: "https://cdn.jsdelivr.net/npm/@web3auth/web3auth@1.1.1",
      integrity: "sha384-FBByM2J4GLF0BU0zYGFqksU97eJV2mbpgZhajABFCELVsv+JhGpmGoiK6sAVY8OR",
      crossOrigin: "anonymous",
    },
    {
      src: "https://cdn.jsdelivr.net/npm/@web3auth/openlogin-adapter@1.1.1",
      integrity: "sha384-0LuO6v4sRENxqtVz/MmCM2N9eS9b6tRBSwO1+LviZds6PJlC/FbUbHPwljyKLedS", 
      crossOrigin: "anonymous",
    },
  ];
};
export const handle = { scripts }

export default function App() {
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <ExternalScripts />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
