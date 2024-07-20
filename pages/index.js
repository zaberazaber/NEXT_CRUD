// pages/index.js
import { useEffect, useState } from 'react';
import axios from 'axios';
import UserTable from '../components/UserTable';
import UserForm from '../components/UserForm';

export default function Home() {
  
  return (
    <div> <h1>Problem Statement</h1>
    <ol>
        <li>Create a page called <code>/dashboard</code></li>
        <li>Include a navigation panel on the right with a single tab labeled <strong>Users</strong></li>
        <li>The <strong>Users</strong> tab should list users with the following fields:
            <ul>
                <li><code>first_name</code></li>
                <li><code>last_name</code></li>
                <li><code>email</code></li>
                <li><code>alternate_email</code></li>
                <li><code>password</code> (hashed)</li>
                <li><code>age</code> (must be greater than 18)</li>
            </ul>
        </li>
        <li>Provide options to add, edit, and delete users</li>
        <li>Use <strong>Next.js 14 server actions</strong> and <strong>JSON</strong> for database needs</li>
        <li>Use <strong>Tanstack Table</strong> for displaying user data with features including:
            <ul>
                <li>Searching users</li>
                <li>Filtering users by age</li>
                <li>Pagination</li>
                <li>Multi-select and delete operations</li>
            </ul>
        </li>
        <li>On any mutation (add, edit, and delete), page list data should be automatically updated without any need of refreshing the page</li>
    </ol></div>
   
);
}