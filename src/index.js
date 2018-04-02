import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Route, BrowserRouter, Switch } from 'react-router-dom';

import configureStore from './store/configureStore';
import ListAgvInfo from './containers/ListAgvInfo';
import registerServiceWorker from './registerServiceWorker';
import ChartFormContainer from './containers/statics/ChartFormContainer';

import 'animate.css/animate.css';
import 'antd/dist/antd.less';
import './styles/index.less';

const store = configureStore();

const routerSet = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={ListAgvInfo} />
        <Route path="/statics" component={ChartFormContainer} exact />
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
