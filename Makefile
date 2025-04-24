.PHONY: setup-system setup-project run clean

# Sadece bir kez çalıştırılır – sistem bağımlılıklarını kurar
setup-system:
	@echo "🔧 Miniconda indiriliyor..."
	@wget -q https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh -O miniconda.sh
	@chmod +x miniconda.sh
	@./miniconda.sh -b -p $$HOME/miniconda
	@rm miniconda.sh
	@echo "✅ Miniconda kuruldu."
	@echo 'export PATH="$$HOME/miniconda/bin:$$PATH"' >> ~/.bashrc
	@source ~/.bashrc || true

	@echo "🔧 Node.js kuruluyor..."
	@curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
	@sudo apt-get install -y nodejs
	@echo "✅ Node.js versiyonu:"
	@node -v
	@npm -v

# Proje bağımlılıklarını yükler (herkes çalıştırmalı)
setup-project:
	@echo "📦 Conda ortamı oluşturuluyor (ceng316-env)..."
	@$$HOME/miniconda/bin/conda env create -f environment.yml || echo "❗ Ortam zaten mevcut olabilir."
	@echo "📦 React bağımlılıkları yükleniyor..."
	@cd frontend && npm install

# Frontend + Backend başlatılır (ayrı terminallerde)
run:
	@echo "🚀 Geliştirme sunucuları başlatılıyor..."
	@gnome-terminal -- bash -c "cd frontend && npm start; exec bash"
	@gnome-terminal -- bash -c "cd backend && source $$HOME/miniconda/bin/activate ceng316-env && uvicorn main:app --reload --host 0.0.0.0 --port 8000; exec bash"

# Ortamı temizler
clean:
	@echo "🧹 Ortam temizleniyor..."
	@rm -rf frontend/node_modules frontend/build
	@$$HOME/miniconda/bin/conda remove --name ceng316-env --all -y || echo "❗ Ortam bulunamadı"
