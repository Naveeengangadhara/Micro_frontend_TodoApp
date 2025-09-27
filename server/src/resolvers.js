import { GraphQLScalarType, Kind } from 'graphql';
import { Repo } from './repo.js';
const DateScalar = new GraphQLScalarType({
    name: 'Date',
    serialize(value) { return new Date(value).toISOString(); },
    parseValue(value) { return new Date(value).toISOString(); },
    parseLiteral(ast) {
        if (ast.kind === Kind.STRING) return new Date(ast.value).toISOString();
        return null;
    }
});
export const resolvers = {
    Date: DateScalar,
    Query: {
        health: () => 'ok',
        policies: (_, args) => Repo.listPolicies(args),
        policy: (_, { id }) => Repo.getPolicy(id)
    },
    Mutation: {
        createPolicy: (_, { input }) => Repo.createPolicy(input),
        updatePolicy: (_, { id, input }) => Repo.updatePolicy(id, input),
        deletePolicy: (_, { id }) => Repo.deletePolicy(id)
    },
    Policy: {
        customer: (p) => Repo.getCustomer(p.customerId)
    }
};