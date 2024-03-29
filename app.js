const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const PORT = 3306;

const authRoute = require('./routes/auth');
const usersRoute = require('./routes/users');
const navRoute = require('./routes/nav');
const zonesRoute = require('./routes/zones');

app.use(cors());
app.use(bodyParser.json());  

app.use('/', authRoute);  
app.use('/', usersRoute);
app.use('/', navRoute);
app.use('/', zonesRoute);

app.get('/', (req, res) => { 
    res.json({ message: 'Restful API Backend Using ExpressJS' });
}); 

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});  