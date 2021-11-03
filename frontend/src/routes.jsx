import React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";

import ProtectedRoute from "./helpers/ProtectedRoute";

import { UserProvider } from "./contexts/UserContext";
import { ScheduleProvider } from "./contexts/ScheduleContext";
import { EventProvider } from "./contexts/EventContext";

import Login from "./pages/Login";
import Schedule from "./pages/Schedule";
import Event from "./pages/Event";

import Header from "./components/Header";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <UserProvider>
        <Header />

        <Switch>
          <Route path="/" exact>
            <Redirect to="/login" />
          </Route>

          <Route path="/login" component={Login} />

          <ScheduleProvider>
            <ProtectedRoute path="/schedule" exact component={Schedule} />

            <EventProvider>
              <ProtectedRoute path="/schedule/event/create" component={Event} />
              <ProtectedRoute
                path="/schedule/event/show/:name"
                component={Event}
              />
            </EventProvider>

            {/* Está redirecionando na página de evento ao dar F5 */}
            <Route path="*">
              <Redirect to="/schedule" />
            </Route>
          </ScheduleProvider>
        </Switch>
      </UserProvider>
    </BrowserRouter>
  );
};

export default AppRoutes;
