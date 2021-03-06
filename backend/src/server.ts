import express = require('express');
import path = require('path');
import { routes } from './routes/index';
import cors = require('cors');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

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
