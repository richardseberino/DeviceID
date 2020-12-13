docker pull swaggerapi/swagger-ui
echo "ATENÇÃO:"
echo "Execute o comando dentro da pasta swagger apenas"
echo "--------------------------------"
echo "Executando SWAGGER na porta 8000"
echo "--------------------------------"
cd $(dirname -- $0)
docker run -p 8000:8080 -e BASE_URL=/ -e SWAGGER_JSON=/foo/swagger.json -v $PWD:/foo  swaggerapi/swagger-ui
