// Simple in-memory repo emulating a persistence layer (swap for DB later)
import { randomUUID } from 'node:crypto';
const customers = [
    { id: 'c1', name: 'Alice Carter', email: 'alice@example.com' },
    { id: 'c2', name: 'Brian Park', email: 'brian@example.com' }
];
const policies = [
    {
        id: 'p1', number: 'NM-0001', type: 'TERM', premium: 120.5, startDate: new
            Date().toISOString(), customerId: 'c1'
    },
    {
        id: 'p2', number: 'NM-0002', type: 'WHOLE', premium: 300.0, startDate: new
            Date().toISOString(), customerId: 'c2'
    }
];
export const Repo = {
    listPolicies({ search, limit = 25, offset = 0 }) {
        let rows = policies;
        if (search) {
            const q = search.toLowerCase();
            rows = rows.filter(p => p.number.toLowerCase().includes(q) ||
                p.type.toLowerCase().includes(q));
        }
        return rows.slice(offset, offset + limit);
    },
    getPolicy(id) { return policies.find(p => p.id === id) || null; },
    createPolicy(input) {
        const id = randomUUID();
        const row = { id, ...input };
        policies.push(row);
        return row;
    },
    updatePolicy(id, input) {
        const idx = policies.findIndex(p => p.id === id);
        if (idx === -1) return null;
        policies[idx] = { ...policies[idx], ...input };
        return policies[idx];
    },
    deletePolicy(id) {
        const idx = policies.findIndex(p => p.id === id);
        if (idx === -1) return false;
        policies.splice(idx, 1);
        return true;
    },
    getCustomer(id) { return customers.find(c => c.id === id) || null; },
    getCustomers() { return customers; }
};