const { pool } = require('./db_connect');
const bcrypt = require('bcrypt');
const saltRounds = 15;

// straight outta SO
// https://stackoverflow.com/questions/23593052/format-javascript-date-as-yyyy-mm-dd
const getDateNow = () => {
  var d = new Date(),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) 
    month = '0' + month;
  if (day.length < 2) 
    day = '0' + day;

  return [year, month, day].join('-');
}

// internal method currently, need middleware if public
const _createUser = (username, password) => {

  if (!username || !password) {
    return false;
  }

  // do check if username taken
  pool.query(
    `SELECT username FROM users WHERE username = ?`,
    [username],
    (err, res) => {
      if (err) {
        console.log('failed to create user', err);
        return false;
      } else {
        if (res.length && typeof res[0].username !== "undefined") {
          console.log('failed to create user', err);
          return false;
        }
      }
    }
  );

  bcrypt.genSalt(saltRounds, (err, salt) => {
    bcrypt.hash(password, salt, (err,hash) => {
      if (hash) {
        const dateNow = getDateNow();

        pool.query(
          `INSERT INTO users SET username = ?, password_hash = ?, created_at = ?, last_login = ?`,
          [username, hash, dateNow, dateNow],
          (err, res) => {
            if (err) {
              console.log('failed to create user', err);
            } else {
              console.log(`user created with ID: ${res.insertId}`);
            }
          }
        );
      }
      
      return false;
    });
  });
}

// generates and returns shortcode if successful login
const loginUser = (req, res) => {
  // get these from post params
  if (
      !Object.keys(req.body).length ||
      typeof req.body.username === "undefined" ||
      typeof req.body.password === "undefined"
  ) {
      res.status(401).send('No user/pass provided');
  }
  
  const username = req.body.username;
  const password = req.body.password;

  let passwordHash;
  
  pool.query(
    `SELECT id, password_hash FROM users WHERE username = ?`,
    [username],
    (err, qres) => {
      if (err) {
        res.status(401).send('Failed to login');
      } else {
        if (qres.length && typeof qres[0].password_hash !== "undefined") {
          passwordHash = qres[0].password_hash;
          _comparePasswords(res, username, password, passwordHash);
        } else {
          res.status(401).send('Failed to login');
        }
      }
    }
  );
}

// https://stackoverflow.com/a/1349426/2710227
const _generateRandomString = (length) =>  {
  let result           = '';
  const characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

const _getUserId = async (username) => {
  return new Promise(resolve => {
    pool.query(
      `SELECT id FROM users WHERE username = ?`,
      [username],
      (err, res) => {
        if (err) {
          resolve(null); // failed, might as well fail sign up process, does not recursively try again could but eh... just for me
        } else {
          if (res.length) {
            resolve(res[0].id);
          } else {
            resolve(null);
          }
        }
      }
    );
  });
}

// from milli to seconds 10 vs. 13
const trimTimestamp = (timestamp) => {
  return (timestamp.toString().length === 13)
    ? timestamp = timestamp / 1000
    : timestamp;
}

const _shortcodeExists = async (newShortcode, returnExpiresAt = false) => {
  return new Promise(resolve => {
    pool.query(
      `SELECT expires_at, shortcode FROM shortcodes WHERE shortcode = ?`,
      [newShortcode],
      (err, res) => {
        if (err) {
          resolve(true);
        } else {
          if (res.length) {
            resolve(returnExpiresAt ? res[0].expires_at : true);
          } else {
            resolve(false);
          }
        }
      }
    );
  });
}

const _generateShortcode = async (username) => {
  let newShortCode = _generateRandomString(6);
  
  let timestamp = Date.now();

  timestamp = trimTimestamp(timestamp);

  return new Promise(async (resolve) => {
    // this should almost never happen
    let shortcodeExists = await _shortcodeExists(newShortCode);

    if (!shortcodeExists) {
      // insert
      pool.query(
        `INSERT INTO shortcodes SET username = ?, shortcode = ?, created_at = ?, expires_at = ?`, // keeps inserting new rows hmm
        [username, newShortCode, timestamp, (timestamp + 86400)], // wanted epoch easier for math
        (err, res) => {
          if (err) {
            console.log('failed to create shortcode', err);
            resolve(false);
          } else {
            console.log(`shortcode created with ID: ${res.insertId}`);
            resolve(newShortCode);
          }
        }
      );
    } else {
      resolve(false);
    }
  });
}

// private
const _comparePasswords = (res, username, password, passwordHash) => {
  bcrypt.compare(password, passwordHash, async (err, bres) => { // this is bad bres
    if (err || !bres) {
      res.status(401).send('Failed to login');
      return;
    }

    const shortcode = await _generateShortcode(username);
    res.status(200).send({shortcode});
  });
}

// https://stackoverflow.com/a/18153637/2710227
const _getShortcodeByUsername = async (username) => {
  return new Promise(resolve => {
    pool.query(
      // have to deal with matching time
      // `SELECT shortcode FROM shortcodes WHERE username = ? AND expires_at > UNIX_TIMESTAMP(NOW()) ORDER BY id DESC LIMIT 1`,
      `SELECT shortcode, expires_at FROM shortcodes WHERE username = ? ORDER BY id DESC LIMIT 1`, // just 1 not terrible
      [username],
      (err, res) => {
        if (err) {
          resolve(null);
        } else {
          let timestamp = Date.now();

          timestamp = trimTimestamp(timestamp);

          if (res.length && res[0].expires_at > timestamp) {
            resolve(res[0].shortcode);
          } else {
            resolve(null);
          }
        }
      }
    );
  });
}

const getShortCode = async (req, res) => {
  const username = req.body.username;
  const shortcode = await _getShortcodeByUsername(username);

  if (!shortcode) {
    res.status(200).json({shortcode: ""});
  } else {
    res.status(200).json({shortcode});
  }
}

const validateShortcode = async (req, res) => {
  const shortcodeExists = await _shortcodeExists(req.body.shortcode, true);

  if (trimTimestamp(Date.now()) < shortcodeExists) { // bad naming
    res.status(200).json({msg: true});
  } else {
    res.status(200).json({msg: false});
  }
}

module.exports = {
  loginUser,
  getShortCode,
  validateShortcode
}