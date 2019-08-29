import React from 'react';
import './header.css';
import { Link } from 'react-router-dom';
import Logo from './logo';
import VK, { Auth } from 'react-vk';
import Strapi from 'strapi-sdk-javascript';

const strapi = new Strapi('http://sweetdreams.ru.com:1337/');

export default function header() {
  return (
    <div className="header">
      <Link to="/">
        <Logo />
      </Link>
      <VK apiId={6870521}>
        <Auth
          options={{
            onAuth: user => {
              strapi.register(
                `${user.first_name} ${user.last_name}`,
                'TBD',
                'TBD pass gen'
              );
            }
          }}
        />
      </VK>
    </div>
  );
}
