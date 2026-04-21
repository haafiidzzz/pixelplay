import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <h3 className="brand-name">PIXELPLAY</h3>
          <p className="copyright">
            © 2026 PixelPlay. All rights reserved. All trademarks are property of their respective owners.
          </p>
          <div className="social-icons">
            <a href="#instagram" className="social-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a href="#facebook" className="social-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
          </div>
        </div>

        <div className="footer-column">
          <h4 className="column-title">BROWSE</h4>
          <ul className="footer-links">
            <li><a href="#store">Store</a></li>
            <li><a href="#new">New Releases</a></li>
            <li><a href="#top">Top Sellers</a></li>
            <li><a href="#free">Free to Play</a></li>
            <li><a href="#deals">Deals & Offers</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4 className="column-title">SUPPORT</h4>
          <ul className="footer-links">
            <li><a href="#store">Store</a></li>
            <li><a href="#new">New Releases</a></li>
            <li><a href="#top">Top Sellers</a></li>
            <li><a href="#free">Free to Play</a></li>
            <li><a href="#deals">Deals & Offers</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4 className="column-title">SUPPORT</h4>
          <ul className="footer-links">
            <li><a href="#store">Store</a></li>
            <li><a href="#new">New Releases</a></li>
            <li><a href="#top">Top Sellers</a></li>
            <li><a href="#free">Free to Play</a></li>
            <li><a href="#deals">Deals & Offers</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;