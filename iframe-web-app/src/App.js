import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css-reset.css';
import './App.css';

const App = () => {
  const [validShortcode, setValidShortcode] = useState(false);
  const [shortcode, setShortcode] = useState('');

  useEffect(() => {
    if (shortcode.length === 6) {
      axios.post(`${process.env.REACT_APP_API_BASE}/validate-shortcode`, {
        shortcode
      })
      .then((res) => {
        console.log(res.data);
        if (res.status !== 200) {
          alert('Failed to validate shortcode');
        } else {
          if (res.data.msg) {
            setValidShortcode(true);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
    }
  }, [shortcode]);

  return (
    <div className={`cenra-iframe ${shortcode ? "" : "shortcode"}`}>
      {!validShortcode && <div className="centra-iframe__shortcode-input">
        <input type="text" onChange={(e) => setShortcode(e.target.value)} placeholder="shortcode"/>
      </div>}
      {validShortcode && <div className="centra-iframe__app">
        <h2>Search notes</h2>
        <input type="text" placeholder="search notes"/>
      </div>}
    </div>
  );
}

export default App;
