export default function PageTemplate({ children }) {
  return (
    <div>
      <header>
        <div className="top-bar">
          <img src="logo.png" alt="Erasmus Logo" className="logo" />
          <div className="menu-icon">&#9776;</div>
        </div>
        <nav className="menu">
          <a href="#contact">Contact</a>
          <a href="#home">Home</a>
          <a href="#login">Login/Sign in</a>
        </nav>
      </header>

      {children}

      <footer>
        <p>© 2025 Erasmus Hogeschool Brussel</p>
      </footer>
    </div>
  );
}
