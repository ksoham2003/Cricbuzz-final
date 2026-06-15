import './Loader.css';

export default function Loader({ text = 'Loading...' }) {
  return (
    <div className="loader-wrapper">
      <div className="cricket-loader">
        <div className="stump stump--1"></div>
        <div className="stump stump--2"></div>
        <div className="stump stump--3"></div>
        <div className="bail bail--1"></div>
        <div className="bail bail--2"></div>
      </div>
      <p className="loader-text">{text}</p>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-card__header">
        <div className="skeleton" style={{ width: '40%', height: '12px' }} />
        <div className="skeleton" style={{ width: '60px', height: '20px', borderRadius: '9999px' }} />
      </div>
      <div className="skeleton-card__body">
        <div className="skeleton-card__team">
          <div className="skeleton" style={{ width: '32px', height: '32px', borderRadius: '6px' }} />
          <div className="skeleton" style={{ width: '60px', height: '14px' }} />
        </div>
        <div className="skeleton-card__team">
          <div className="skeleton" style={{ width: '32px', height: '32px', borderRadius: '6px' }} />
          <div className="skeleton" style={{ width: '60px', height: '14px' }} />
        </div>
      </div>
      <div className="skeleton" style={{ width: '70%', height: '12px', marginTop: '12px' }} />
    </div>
  );
}
