import '../styles/LoadingSpinner.css';

const LoadingSpinner = ({ size = 'medium', className = '' }) => {
  return (
    <div className={`loading-spinner ${size} ${className}`}>
      <div className="spinner"></div>
    </div>
  );
};

export default LoadingSpinner;
