import React from 'react';
import Header from '../components/header/header';
import Items from '../components/items/items';
import Item from '../components/items/item';
import { BrowserRouter, Route } from 'react-router-dom';
import VK, { Auth } from 'react-vk';

export default function Router() {
  return (
    <BrowserRouter>
      <Header />
      <div className="centered">
        <VK apiId={6870521}>
          <Auth />
        </VK>
      </div>
      <Route exact path="/" component={Items} />
      <Route exact path="/:title" component={Item} />
    </BrowserRouter>
  );
}
