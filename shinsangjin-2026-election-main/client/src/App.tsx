import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Analysis from "./pages/Analysis";
import Pledges from "./pages/Pledges";
import Achievements from "./pages/Achievements";
import About from "./pages/About";
import Voice from "./pages/Voice";
import Newsroom from "./pages/Newsroom";
import SiteLayout from "./components/SiteLayout";
function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <SiteLayout>
      <Switch>
        <Route path={"/"} component={Home} />
        <Route path={"/analysis"} component={Analysis} />
        <Route path={"/pledges"} component={Pledges} />
        <Route path={"/achievements"} component={Achievements} />
        <Route path={"/about"} component={About} />
        <Route path={"/voice"} component={Voice} />
        <Route path={"/newsroom"} component={Newsroom} />
        <Route path={"/404"} component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </SiteLayout>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
