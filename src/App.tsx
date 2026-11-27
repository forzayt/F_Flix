import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import Index from "./pages/Index";
import Movies from "./pages/Movies";
import TVSeries from "./pages/TVSeries";
import Anime from "./pages/Anime";
import Search from "./pages/Search";
import MovieDetails from "./pages/MovieDetails";
import TVDetails from "./pages/TVDetails";
import Player from "./pages/Player";
import Live from "./pages/Live";
import NotFound from "./pages/NotFound";
import Intro from "./pages/Intro";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Intro page — no sidebar / topbar / mobile nav */}
          <Route path="/intro" element={<Intro />} />

          {/* All other pages wrapped in AppLayout */}
          <Route element={<AppLayout />}>
            <Route path="/" element={<Index />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/tv-series" element={<TVSeries />} />
            <Route path="/anime" element={<Anime />} />
            <Route path="/search" element={<Search />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="/tv/:id" element={<TVDetails />} />
            <Route path="/watch/:type/:id" element={<Player />} />
            <Route path="/Live" element={<Live />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
