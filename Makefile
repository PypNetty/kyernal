dev-back:
    cd backend && go run ./cmd/server

dev-front:
    cd frontend && npx rsbuild dev

build-front:
    cd frontend && npx rsbuild build