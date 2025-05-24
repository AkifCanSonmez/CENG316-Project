import React from 'react'
import { Outlet } from 'react-router-dom'
import NavBar from './NavBar'
import './Layout.css'

export default function Layout() {
  return (
    <div className="layout-container">
      <NavBar />
      <main className="layout-content">
        <Outlet />
      </main>
    </div>
  )
}
