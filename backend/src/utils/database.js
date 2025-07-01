const knex = require('knex');
const config = require('../config/database');

const environment = process.env.NODE_ENV || 'development';
const db = knex(config[environment]);

// Função para inicializar o banco de dados
const initializeDatabase = async () => {
  try {
    // Executar migrações
    await db.migrate.latest();
    console.log('✅ Migrações executadas com sucesso');

    // Executar seeds apenas em desenvolvimento
    if (environment === 'development') {
      await db.seed.run();
      console.log('✅ Seeds executados com sucesso');
    }

    console.log('✅ Banco de dados inicializado');
  } catch (error) {
    console.error('❌ Erro ao inicializar banco de dados:', error);
    throw error;
  }
};

// Função para fechar conexão com o banco
const closeDatabase = async () => {
  try {
    await db.destroy();
    console.log('✅ Conexão com banco de dados fechada');
  } catch (error) {
    console.error('❌ Erro ao fechar conexão com banco:', error);
  }
};

module.exports = {
  db,
  initializeDatabase,
  closeDatabase
};