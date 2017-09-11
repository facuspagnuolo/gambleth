import React from 'react'
import { Link } from 'react-router-dom'

export default class Navbar extends React.Component {
  render() {
    return (
      <nav>
        <div className="nav-wrapper container">
          <Link to="/" className="brand-logo">Gambleth</Link>
        </div>
      </nav>
    );
  }
}
