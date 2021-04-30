import './App.css';
import { Switch, Route } from 'react-router-dom';
import Toolbar from 'src/components/Toolbar';
import Login from './components/Login';

function App() {
  return (
    <>
      <Toolbar></Toolbar>
      <Switch>
        <Route path="/login">
          <Login></Login>
        </Route>
        <Route path="/">

        </Route>
      </Switch>
    </>
  );
}

export default App;
