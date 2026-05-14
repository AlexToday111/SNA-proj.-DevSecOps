FROM golang:1.26-alpine AS builder

WORKDIR /src
COPY go.mod ./
COPY *.go ./

RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -trimpath -ldflags="-s -w" -o /safe-backend .

FROM scratch

USER 65532:65532
COPY --from=builder /safe-backend /safe-backend

EXPOSE 8080
ENTRYPOINT ["/safe-backend"]
