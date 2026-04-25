import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Header } from "../components/layout/Header";
import { Layout } from "../components/layout/Layout";

const gridLines = ["16%", "38%", "62%", "84%"];

const noiseDataUri = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E\")";

export const Route = createRootRoute({
  component: () => (
    <>
      {gridLines.map((left) => (
        <div
          key={left}
          className="fixed top-0 bottom-0 w-px pointer-events-none hidden lg:block"
          style={{ left, backgroundColor: "rgba(26,26,26,0.06)", zIndex: 40 }}
        />
      ))}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ backgroundImage: noiseDataUri, opacity: 0.025, zIndex: 50 }}
      />
      <Header />
      <Layout>
        <Outlet />
      </Layout>
      <TanStackRouterDevtools />
    </>
  ),
});
