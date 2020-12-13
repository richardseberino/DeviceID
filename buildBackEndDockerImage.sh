# Para rodar corretamente o script deve-se:
# 1- rodar chmod +x buildBackEndDockerImage.sh
# 2- ./buildBackEndDockerImage.sh <nome da imagem> <porta>

# Construindo a imagem do backEnd
echo 'Criando a imagem do backEnd no Docker com o nome passado por parâmetro'
docker build -t "$1" .
echo 'Mensagem criada com sucesso'

# Rodando localmente a imagem na porta especificada
echo 'Rodando a imagem criada na porta especificada no segundo parâmetro'
docker run -p "$2":3000 -t "$1"