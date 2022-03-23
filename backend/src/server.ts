import express = require('express');
import path = require('path');
import { routes } from './routes/index';
import cors = require('cors');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const __dirname = path.resolve();

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'frontend', 'dist', 'index.html'));
});

app.use(
  express.static(
    path.resolve(__dirname, '..', 'frontend', 'dist', 'index.html')
  )
);
app.use(routes);

app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    res.status(500).send({ message: err.message });
  }
);

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => console.log(`Server rodando na porta ${PORT}`));
