FROM ubuntu:latest
MAINTAINER Anders Milje
ENV LC_ALL C.UTF-8
ENV LANG C.UTF-8
RUN apt-get update -y
RUN apt-get install -y python3-pip python3-dev build-essential git
COPY . /pineappleapp
WORKDIR /pineappleapp
RUN pip3 install --upgrade pip
RUN pip3 install -r requirements.txt
RUN npm install
ENV FLASK_APP app.py
ENV FLASK_DEBUG 0
CMD ["flask", "assets", "build"]
CMD ["flask", "run", "--host=0.0.0.0"]
