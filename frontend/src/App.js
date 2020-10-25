
import ChatWindow from './ChatWindow';
import Home from './Home';
import MoodSelection from './MoodSelection';
import History from './History';

import {BrowserRouter as Router,Route,Switch} from 'react-router-dom';

function App() {
  return (
      <Router>
          <Switch>
              <Route exact path="/" component={Home}/>
              <Route path="/mood" component={MoodSelection}/>
              <Route path="/chat" component={ChatWindow}/>
              <Route path="/history" component={History}/>
          </Switch>
      </Router>
  );
}

export default App;
