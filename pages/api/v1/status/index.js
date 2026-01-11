import database from '../../../../infra/database';

async function status(request, response) {
  const result = await database.query('SELECT 1 as status');
  console.log(result.rows);
  response.status(200).json({ status: "é cara vamos ver como vai ser" });
}

export default status; //Função para o Next interpretar
