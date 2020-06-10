import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import reducer from './rootReducer'; 

const enhancer = compose(applyMiddleware(thunk));

export default createStore(reducer, enhancer); 