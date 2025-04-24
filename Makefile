
---

## 🛠️ `Makefile`

```makefile
.PHONY: setup run frontend backend clean

setup:
	@echo "🔧 Miniconda ortamı kuruluyor..."
	wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh -O miniconda.sh
	chmod +x miniconda.sh
	./miniconda.sh -b -p $$HOME/miniconda
	source $$HOME/miniconda/bin/activate
	echo "✅ Conda kuruldu. Versiyon:"
	rm -r miniconda.sh
	$$HOME/miniconda/bin/conda --version

	@echo "🔧 Ortam dosyasından conda env oluşturuluyor..."
	$$HOME/miniconda/bin/conda env create -f environment.yml || echo "Zaten var olabilir"

	@echo "🔧 Node.js kuruluyor..."
	curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
	sudo apt-get install -y nodejs

	cd frontend && npm install

run:
	@echo "🚀 Uygulama başlatılıyor (frontend + backend)..."
	gnome-terminal -- bash -c "cd frontend && npm start; exec bash"
	gnome-terminal -- bash -c "cd backend && source $$HOME/miniconda/bin/activate ceng316-env && uvicorn main:app --reload --host 0.0.0.0 --port 8000; exec bash"

clean:
	rm -rf frontend/node_modules frontend/build
	$$HOME/miniconda/bin/conda remove --name ceng316-env --all -y
