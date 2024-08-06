const express = require('express');
const mysql = require('mysql2');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false})) 
app.use(bodyParser.json()) 
// Create connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'ifb'
});

// Connect
db.connect((err) => {
  if(err){
      throw err;
  }
  console.log('MySql Connected...');
});

app.get('/', (req, res) => {
  res.send(`
  <h1>Menu</h1>
  <ul>
    <li><a href="/getprof">Listar Professores</a></li>
    <li><a href="/deleteprof">Apagar Professor</a></li>
    <li><a href="/addprof">Adicionar Professor</a></li>
  </ul> 
  `);
});

app.get('/addprof', (req, res) => {
  res.send(`
  <h1>Menu</h1>
  <ul>
    <li><a href="/getprof">Listar Professores</a></li>
    <li><a href="/deleteprof">Apagar Professor</a></li>
  </ul>
  <br>
    <form action="/addprof" method="post">
      <label>Siape:</label>
      <input type="text" name="siape">
      <label>Nome:</label>
      <input type="text" name="nome" required><br><br>
      <label>Idade:</label>
      <input type="number" name="idade" required><br><br>
      <label>Materia:</label>
      <input type="text" name="materia"><br><br>
      <input type="submit" value="Submit">
    </form>
  `);
});


app.get('/deleteprof', (req, res) => {
    res.send(`
    <h1>Menu</h1>
    <ul>
      <li><a href="/addprof">Adicionar Professor</a></li>
      <li><a href="/getprof">Listar Professores</a></li>
      </ul>
    <br>
      <form action="/deleteprof" method="post">
        <label>Siape do professor:</label>
        <input type="text" name="siape" required><br><br>
       <br>
        <input type="submit" value="Submit">
      </form>
    `);
  });



  app.post('/deleteprof', (req, res) => {
    let query = db.query('DELETE FROM prof where siape=?',
   [req.body.siape],
   (err, result) => {
       if(err) throw err;
       console.log(result);
       res.redirect('/getprof');
   });
 });


app.post('/addprof', (req, res) => {
   let query = db.query('INSERT INTO prof (idade, nome, siape, materia) Values(?,?,?,?)',
  [req.body.idade,req.body.nome, req.body.siape, req.body.materia],
  (err, result) => {
      if(err) throw err;
      console.log(result);
      res.redirect('/getprof');
  });
});

app.get('/getprof', (req, res) => {
  let sql = 'SELECT * FROM prof';
  let query = db.query(sql, (err, results) => {
      if(err) throw err;
      console.log(results);
      res.send(`
      <h1>Menu</h1>
    <ul>
      <li><a href="/addprof">Adicionar Professor</a></li>
      <li><a href="/deleteprof">Apagar Professor</a></li>
    </ul>
    <br>
        <table>
          <tr>
            <th>siape</th>
            <th>Nome</th>
            <th>Idade</th>
            <th>materia lecionada</th>
          </tr>
          ${results.map(prof => `<tr><td>${prof.siape}</td><td>${prof.nome}</td><td>${prof.idade}</td><td>${prof.materia}</td></tr>`).join('')}
        </table>
      `);
  });
});

app.listen('3000', () => {
    console.log('Server started on port 3000');
});