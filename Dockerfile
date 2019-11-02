FROM tiangolo/meinheld-gunicorn-flask:python3.7

LABEL maintainer="Sebastian Ramirez <tiangolo@gmail.com>"

# If STATIC_INDEX is 1, serve / with /static/index.html directly (or the static URL configured)
ENV STATIC_INDEX 1
# ENV STATIC_INDEX 0
# Add demo app
RUN apt-get update
RUN apt-get install -y unrtf

COPY ./requirements.txt /app
COPY ./main.py /app
COPY ./database.py /app
COPY ./files /app/files
COPY ./dist /app/dist

RUN pip install -r requirements.txt
RUN python database.py

RUN apt-get install -y redis

ENV LISTEN_PORT 8080

EXPOSE 8080

WORKDIR /app