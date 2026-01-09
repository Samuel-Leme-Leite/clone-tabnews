function status(request, response) {
  response.status(200).json({ status: "é cara vamos ver como vai ser" });
}

export default status; //Função para o Next interpretar
