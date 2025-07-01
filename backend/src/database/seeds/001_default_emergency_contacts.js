/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Limpar tabela
  await knex('emergency_contacts').del();
  
  // Inserir contatos de emergência padrão (sem user_id específico)
  // Estes serão contatos de referência que podem ser copiados para novos usuários
  await knex('emergency_contacts').insert([
    {
      id: 1,
      user_id: null, // Contato de referência
      name: 'SAMU',
      phone: '192',
      relation: 'Serviço de Atendimento Móvel de Urgência',
      type: 'emergency',
      is_primary: true,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 2,
      user_id: null, // Contato de referência
      name: 'Bombeiros',
      phone: '193',
      relation: 'Corpo de Bombeiros',
      type: 'emergency',
      is_primary: false,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 3,
      user_id: null, // Contato de referência
      name: 'Polícia Militar',
      phone: '190',
      relation: 'Polícia Militar',
      type: 'emergency',
      is_primary: false,
      created_at: new Date(),
      updated_at: new Date()
    }
  ]);
};