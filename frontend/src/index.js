import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { GoogleOAuthProvider } from '@react-oauth/google';
import {createClient} from '@supabase/supabase-js';
import {SessionContextProvider} from '@supabase/auth-helpers-react'

const supabase = createClient(
  "https://azhlkmprmzgufanmoyxu.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6aGxrbXBybXpndWZhbm1veXh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU5MjM2MDcsImV4cCI6MjAzMTQ5OTYwN30.KXuxMxpQohWrtr9F2okxQKdUnpvXNqj69LTqfjdBIUs"
)

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <SessionContextProvider supabaseClient={supabase}>
    <App />
    </SessionContextProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
