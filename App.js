import { useState } from 'react';
import axios from 'axios';

function App() {
  const [message, setMessage] = useState('');
  const [coupon, setCoupon] = useState('');

  const handleClaim = async () => {
    try {
      const response = await axios.get('http://localhost:3000/get-coupon', { withCredentials: true });
      setCoupon(response.data.coupon);
      setMessage('Coupon claimed successfully!');
    } catch (error) {
      setMessage(error.response.data.message);
    }
  };

  return (
    <div>
      <h1>Round-Robin Coupon Distribution</h1>
      <button onClick={handleClaim}>Claim Coupon</button>
      {coupon && <p>Your Coupon: {coupon}</p>}
      {message && <p>{message}</p>}
    </div>
  );
}

export default App;
