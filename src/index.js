import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Route, BrowserRouter, Switch } from 'react-router-dom';

import configureStore from './store/configureStore';
import HomepageContainer from './containers/HomepageContainer';
import registerServiceWorker from './registerServiceWorker';
import ListAgvInfoContainer from './containers/ListAgvInfoContainer';
import LoginFormContainer from './containers/LoginFormContainer';
import ChartFormContainer from './containers/statics/ChartFormContainer';

import 'animate.css/animate.css';
import 'antd/dist/antd.less';
import './styles/index.less';

const store = configureStore();

const routerSet = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={ListAgvInfoContainer} />
        <Route path="/admin" component={HomepageContainer} exact />
        <Route path="/statics/:side" component={ChartFormContainer} exact />
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
