FROM golang:1.22-alpine AS builder

WORKDIR /usr/local/src

RUN apk --no-cache add bash git make gcc gettext musl-dev

COPY ["go.mod", "go.sum", "./"]
RUN go mod download

COPY ["main.go", "server.go", "storage.go", "types.go", "config.go", "./"]
RUN go build -o ./bin/app

FROM alpine AS runner

COPY --from=builder /usr/local/src/bin/app /
RUN mkdir config
COPY config ./config

CMD ["/app"]