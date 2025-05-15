import RegisterPage from '../pages/auth/register/register-page';
import LoginPage from '../pages/auth/login/login-page';
import HomePage from '../pages/home/home-page';
import DetailPage from '../pages/detail/detail-page';
import AddPage from '../pages/add/add-page';
import FavoritePage from '../pages/fav/favorite-page.js';
import NotFound from '../pages/not_found/not_found.js';

import { checkAuthenticatedRoute, checkUnauthenticatedRouteOnly } from '../utils/auth';

const routes = {
  '/': () => checkAuthenticatedRoute(new HomePage()),
  '/login': () => checkUnauthenticatedRouteOnly(new LoginPage()),
  '/register': () => checkUnauthenticatedRouteOnly(new RegisterPage()),
  '/add': () => checkAuthenticatedRoute(new AddPage()),
  '/stories/:id': () => checkAuthenticatedRoute(new DetailPage()),
  '/favorite': () => checkAuthenticatedRoute(new FavoritePage()),
  '*': () => new NotFound(),
};

export default routes;
