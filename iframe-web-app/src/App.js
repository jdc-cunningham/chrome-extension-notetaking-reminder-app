import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NoteTakingModule from './features/notes/NoteTakingModule' ;
import SolarChan from './assets/gifs/awake.gif';

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
    <div className={`cenra-iframe ${validShortcode ? "" : "shortcode"}`}>
      {!validShortcode && <div className="centra-iframe__shortcode-input">
        <input type="text" onChange={(e) => setShortcode(e.target.value)} placeholder="shortcode"/>
      </div>}
      {validShortcode && <div className="centra-iframe__app">
        <NoteTakingModule/>
        <img src={SolarChan} alt={"anime-character"} className="centra-iframe__anime-character"/>
      </div>}
    </div>
  );
}

export default App;
