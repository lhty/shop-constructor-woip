import React from 'react';
import Header from '../components/header';
import Items from '../components/items/items';
import Item from '../components/items/item';
import { BrowserRouter, Route  } from 'react-router-dom';

export default function Router() {
  return (
    <BrowserRouter>
      <Header />
      <div className="centered"></div>
      <Route exact path="/" component={Items} />
      <Route exact path="/:title" component={Item} />
    </BrowserRouter>
  );
}
