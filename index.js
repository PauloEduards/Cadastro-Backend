const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./config/db');
const usuarioRoutes = require('./routes/Usuario');
const User = require('./models/Usuario');

const bcrypt = require('bcrypt');
const { generateToken } = require('./middleware/auth');

const app = express();
const PORT = 3000;
app.use(cors());
app.use(bodyParser.json());
app.use('/usuarios', usuarioRoutes);

// Middleware
app.use(express.json());





// Routes
app.post('/register', async (req, res) => {
    try{
        const{ name, email} = req.body;
        
        const password = bcrypt.hashSync(req.body.password, 10);
        
        const user = await User.create({ name, email, password });
        res.status(201).json(user);
    }
    catch (error) {
        console.error('Erro ao criar um usuario', error);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } })
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const token = generateToken(user);
        res.status(200).json({ message: 'Login successful', user ,token });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
        console.error('Error during login:', error);
    }
});

app.get('/users', async (req, res) =>{
    try{
        const users = await User.findAll();
        res.status(200).json(users);
    }
    catch(error) {
        console.error('Erro ao buscar usuarios', error);
        res.status(500).json({message:'Erro interno no Servidor' });
    }
});

db.sync().then(() => {
  app.listen(3001, () => console.log('API no ar em http://localhost:3001'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});