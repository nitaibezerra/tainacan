#!/bin/bash
 
# Executa o comando 'sass' para verificar se existe (veja http://stackoverflow.com/a/677212/329911)
command -v sass >/dev/null 2>&1 || {
  echo >&2 "SASS parece não está disponivel.";
  exit 1;
}
 
# Define o caminho.
echo "Compilando Sass..."
cd src/scss
 
sass -E 'UTF-8' --cache-location ../../.tmp/sass-cache-1 tainacan-embeds.scss:../assets/css/tainacan-embeds.css

cd ../admin/scss
sass -E 'UTF-8' --cache-location ../../../.tmp/sass-cache-2 tainacan-admin.scss:../../assets/css/tainacan-admin.css


echo "Compilação do Sass Concluído!"
exit 0
