const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const mysql = require('mysql2');

app.use(bodyParser.json());

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'glicin'
});


app.use(express.static(path.join(__dirname, '../frontend')));


app.post('/kerdoiv', (req, res) => {

    const query = 'INSERT INTO kerdoiv (halott, haigenhonnan, nemzetiseg, orszag, nem, lakhely, kor, egeszsegallapot, vegzettseg) VALUES (?, ?, ?, ?, ?, ?,?, ?, ?)';
    const values = [req.body[1], req.body[2], req.body[3], req.body[4], req.body[5], req.body[6], req.body[7], req.body[8], req.body[9]];

    connection.query(query, values, (err) => {
        if (err) return res.status(500).send('Hiba történt: ' + err);
        res.json({ status: 'ok' });
    });

});


app.post('/ajanlas', (req, res) => {
    const query = 'INSERT INTO ajanlas (kod, szazalek,tanacs,status,bmi) VALUES (?, ?,?,?,?)';
    const values = [req.body.kod, req.body.szazalek,req.body.tanacs,req.body.status,req.body.bmi];

    connection.query(query, values, (err) => {
        if (err) {
            console.error("DB hiba:", err);
            return res.status(500).json({ error: 'Hiba történt az adatbázis művelet közben.' });
        }
        res.json({ status: 'ok' });
    });
});


app.get('/ajanlas/:kod', (req, res) => {
  const kod = req.params.kod;
  connection.query('SELECT * FROM ajanlas WHERE kod = ? LIMIT 1', [kod], (err, results) => {
    if (err) {
      console.error('DB hiba:', err);
      return res.status(500).json({ error: 'db' });
    }
    res.json(results[0] || null); 
  });
});



app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/html/index.html'));
});


app.get('/statisztikak', (req, res) => {
    connection.query('SELECT * FROM kerdoiv', (err, results) => {
        if (err) return res.send('Hiba történt: ' + err);
        res.json(results);
    });
});



app.listen(3000, () => console.log('Server running on http://localhost:3000'));


