import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { readFileSync } from 'node:fs';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { resolvers } from './resolvers.js';
const typeDefs = readFileSync(new URL('./schema.graphql', import.meta.url),
    'utf-8');
const app = express();
const PORT = process.env.PORT || 4000;
// Allow MFEs during local dev + support Apollo CSRF preflight header
app.use(cors({
    origin: [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:3002'
    ],
    allowedHeaders: ['Content-Type', 'apollo-require-preflight', 'x-apollooperation-name']
}));
app.use(bodyParser.json());

const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true // Apollo v4 enables CSRF protection; urql will send preflight header
});
await server.start();
app.use('/graphql', expressMiddleware(server));
app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.listen(PORT, () => console.log(`API ready on http://localhost:${PORT}/
graphql`));