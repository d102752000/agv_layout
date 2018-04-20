import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Route, BrowserRouter, Switch } from 'react-router-dom';

import configureStore from './store/configureStore';
import registerServiceWorker from './registerServiceWorker';
import LoginFormContainer from './containers/LoginFormContainer';
import HomepageContainer from './containers/HomepageContainer';
import ListAgvInfoContainer from './containers/ListAgvInfoContainer';
import RealTimeFormContainer from './containers/RealTimeFormContainer';

import 'animate.css/animate.css';
import 'antd/dist/antd.less';
import './styles/index.less';

const store = configureStore();

const routerSet = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/status" component={ListAgvInfoContainer} exact />
        <Route path="/realtime" component={RealTimeFormContainer} exact />
      </Switch>
    </BrowserRouter>
  );
};
ReactDOM.render(
  <Provider store={store}>
    {routerSet()}
  </Provider>,
  document.getElementById('root')
);

registerServiceWorker();
  // 
  // <Route path="/" exact component={LoginFormContainer}/>
  // <Route path="/admin" exact component={HomepageContainer}/>
