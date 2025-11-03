# 🎞️ Gource do Projeto

Este diretório contém alguns arquivos e configurações necessárias para gerar o vídeo Gource do projeto a fim de visualizar a evolução e contribuições no repositório ao longo do tempo.

## 📁 Estrutura do Diretório
```
gource/
├── user-images/              # Fotos dos integrantes do grupo
├── captions.txt              # Arquivo de configuração de legendas
└── README.md                 # Este arquivo
```

## 📝 Gerando o  Gource

- Certifique-se de ter o [Gource](https://gource.io) instalado em sua máquina local.
- Abra o diretório ``/gource`` no seu terminal e rode o comando abaixo:
  
  ```
  gource \
    --user-image-dir user-images \  # Teste
    --key \
    --caption-file captions.txt \
    --caption-size 30 \
    --seconds-per-day 1 \
    --highlight-users \
    --title "BS Beauty Academy - Gource" \
    -f
  ```
  É possível fazer algumas customizações:
  - ``--caption-size`` muda o tamanho da fonte das legendas.
  - ``--seconds-per-day`` define a velocidade do vídeo.
