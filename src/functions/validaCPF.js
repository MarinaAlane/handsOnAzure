const { app } = require('@azure/functions');

app.http('validaCPF', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);

        try {
            const { cpf } = await request.json();

            if (!cpf) {
                return { status: 400, body: 'CPF is required' };
            }

            const isValidCPF = (cpf) => {
                cpf = cpf.replace(/[^\d]+/g, '');
                if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
                    return false;
                }
                let sum = 0;
                let remainder;
                for (let i = 1; i <= 9; i++) {
                    sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
                }
                remainder = (sum * 10) % 11;
                if (remainder < 2) {
                    remainder = 0;
                } else {
                    remainder = 11 - remainder;
                }
                if (remainder !== parseInt(cpf.substring(9, 10))) {
                    return false;
                }
                sum = 0;
                for (let i = 1; i <= 10; i++) {
                    sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
                }
                remainder = (sum * 10) % 11;
                if (remainder < 2) {
                    remainder = 0;
                } else {
                    remainder = 11 - remainder;
                }

                if (remainder !== parseInt(cpf.substring(10, 11))) {
                    return false;
                }
                return true;
            };

            if (!isValidCPF(cpf)) {
                return { status: 400, body: 'CPF inválido' };
            }

            return { body: `CPF ${cpf} é válido` };

        } catch (error) {
            context.log.error('Erro de processamento:', error);
            return {
                status: 500,
                body: `Internal server error: ${error.message}`
            };
        }
    }
});
