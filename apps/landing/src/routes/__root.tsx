import { Outlet, createRootRoute } from "@tanstack/react-router";
import "../index.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <Header />
      <div className="border-x border-dashed page-wrap">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}
