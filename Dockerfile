FROM golang:1.7
ADD . ./
WORKDIR ./
RUN go get -u github.com/mattn/go-sqlite3
RUN	go get -u github.com/jinzhu/gorm
CMD ["go", "run", "main.go"]
