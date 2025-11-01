IMAGE_NAME = henrriky1231/bs-beauty

.PHONY: build push

# Build da imagem Docker
# Uso: make build TAG=1.0.0 LASTEST=true
build:
	@if [ -z "$(TAG)" ] && [ "$(LATEST)" != "true" ]; then \
    		echo "ERRO: você deve passar uma TAG ou definir LATEST=true"; \
    		exit 1; \
	fi
	@echo "=============================="
	@echo "Construindo imagem Docker..."
	@echo "Imagem: $(IMAGE_NAME):$(TAG)"
	@echo "Dockerfile: $(DOCKERFILE)"
	@echo "=============================="
	@docker build -t $(IMAGE_NAME):$(TAG) .

ifeq ($(LATEST),true)
	@echo "=============================="
	@echo "Marcando imagem como latest"
	@docker tag $(IMAGE_NAME):$(TAG) $(IMAGE_NAME):latest
endif

# Push da imagem para o Docker Hub
# Uso: make push TAG=1.0.0 LATEST=true
push: build
	@echo "=============================="
	@echo "Fazendo push da imagem Docker..."
	@echo "Imagem: $(IMAGE_NAME):$(TAG)"
	@echo "=============================="
	@docker push $(IMAGE_NAME):$(TAG)


ifeq ($(LATEST),true)
	@echo "=============================="
	@echo "Fazendo push da tag latest..."
	@docker push $(IMAGE_NAME):latest
endif
