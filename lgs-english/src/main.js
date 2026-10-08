import './styles.css';
import './layout.css';
import './themes.css';
import { mountApp } from './ui/app.js';

const app = document.getElementById('app');
if (app) mountApp(app);
