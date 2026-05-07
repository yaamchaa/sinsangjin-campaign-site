import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch, Router } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import ErrorBoundary from "./components/ErrorBoundary";
import SiteLayout from "./components/SiteLayout";
import { ThemeProvider } from "./contexts/ThemeContext";

import Home from "./pages/Home";
import Analysis from "./pages/Analysis";
import Pledges from "./pages/Pledges";
import Achievements from "./pages/Achievements";
import About from "./pages/About";
import Voice from "./pages/Voice";
import Newsroom from "./pages/Newsroom";
import UserLogin from "./pages/UserLogin";
import AdminLogin from "./pages/AdminLogin";
import AdminNews from "./pages/AdminNews";
import NotFound from "./pages/NotFound";

function AppRouter() {
  return (
    <Router hook={useHashLocation}
      <SiteLayout>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/analysis" component={Analysis} />
          <Route path="/pledges" component={Pledges} />
          <Route path="/achievements" component={Achievements} />
          <Route path="/about" component={About} />
          <Route path="/voice" component={Voice} />
          <Route path="/newsroom" component={Newsroom} />

          <Route path="/user-login" component={UserLogin} />
          <Route path="/admin-login" component={AdminLogin} />
          <Route path="/admin-news" component={AdminNews} />

          <Route path="/404" component={NotFound} />
          <Route component={NotFound} />
        </Switch>
      </SiteLayout>
    </Router>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <AppRouter />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
