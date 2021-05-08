import './App.module.scss';
import { Switch, Route } from 'react-router-dom';
import Toolbar from 'src/components/Toolbar';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <>
      <Toolbar></Toolbar>
      <Switch>
        <Route path="/login">
          <Login></Login>
        </Route>
        <Route path="/">
          <Dashboard />
        </Route>
      </Switch>
    </>
  );
}

export default App;
