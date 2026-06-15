import { Link } from 'react-router-dom';
import { Zap, Heart } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__inner">
          <div className="footer__brand">
            <Link to="/" className="footer__logo">
              <div className="footer__logo-icon">
                <Zap size={16} />
              </div>
              <span>CricBuzz</span>
            </Link>
            <p className="footer__tagline">
              Live cricket scores, commentary & updates
            </p>
          </div>

          <div className="footer__links">
            <Link to="/series">Series</Link>
            <Link to="/teams">Teams</Link>
            <Link to="/players">Players</Link>
          </div>

          <div className="footer__bottom">
            <p>
              Made with <Heart size={14} className="footer__heart" /> for cricket fans
            </p>
            <p className="footer__copy">
              &copy; {new Date().getFullYear()} CricBuzz Clone. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
