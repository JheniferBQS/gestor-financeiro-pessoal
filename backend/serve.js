import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Conectado ao MongoDB'))
  .catch(err => console.error('Erro na conexão:', err.message));

  const movimentacaoSchema = new mongoose.Schema({
    tipo: { type: String, required: true, enum: ['entrada', 'saida'] },
    descricao: { type: String, required: true, trim: true },
    categoria: { type: String, required: true, trim: true },
    valor: { type: Number, required: true, min: 0 },
    data: { type: Date, default: Date.now }
  }, { collection: 'Movimentacoes', timestamps: true });

  const Movimentacao = mongoose.model('Movimentacao', movimentacaoSchema, 'Movimentacoes');
  //rota inicial
  app.get('/', (req, res) => res.json({ msg: 'API rodando' }));
  //criar movimentação
  app.post('/movimentacoes', async (req, res) => {
    const movimentacao = await Movimentacao.create(req.body);
    res.status(201).json(movimentacao);
  });
  //listar movimentações
  app.get('/movimentacoes', async (req, res) => {
    const movimentacoes = await Movimentacao.find();
    res.json(movimentacoes);
  });
  //iniciar servidor
  app.listen(process.env.PORT, () =>
    console.log(`Servidor rodando em http://localhost:${process.env.PORT}`)
  );
