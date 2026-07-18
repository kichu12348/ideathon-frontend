import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { Header } from "./components/Header/Header";
import { PageSkeleton } from "./components/PageSkeleton/PageSkeleton";

// Code-split pages — each becomes its own chunk, loaded on first visit
const TeamsList = lazy(() =>
  import("./pages/TeamsList/TeamsList").then((m) => ({ default: m.TeamsList })),
);
const TeamDetail = lazy(() =>
  import("./pages/TeamDetail/TeamDetail").then((m) => ({
    default: m.TeamDetail,
  })),
);
const RedirectsList = lazy(() =>
  import("./pages/RedirectsList/RedirectsList").then((m) => ({
    default: m.RedirectsList,
  })),
);
const RedirectEdit = lazy(() =>
  import("./pages/RedirectEdit/RedirectEdit").then((m) => ({
    default: m.RedirectEdit,
  })),
);

// Layout that includes the Header — used by the non-redirects section
const MainLayout = () => (
  <>
    <Header />
    <main>
      <Suspense fallback={<PageSkeleton />}>
        <Outlet />
      </Suspense>
    </main>
  </>
);

// Bare layout with no Header — used by the redirects section
const BareLayout = () => (
  <main>
    <Suspense fallback={<PageSkeleton />}>
      <Outlet />
    </Suspense>
  </main>
);

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<TeamsList />} />
          <Route path="/team/:teamId" element={<TeamDetail />} />
        </Route>
        <Route element={<BareLayout />}>
          <Route path="/redirects" element={<RedirectsList />} />
          <Route path="/redirects/new" element={<RedirectEdit />} />
          <Route path="/redirects/:slug" element={<RedirectEdit />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
