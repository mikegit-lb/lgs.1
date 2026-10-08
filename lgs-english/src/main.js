import './styles.css';
import { mountApp } from './ui/app.js';

const app = document.getElementById('app');
if (app) mountApp(app);
