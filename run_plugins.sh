#!/usr/bin/env bash


docker build -t superset_plugins . -f Dockerfile_plugins

docker-compose -f docker-compose_plugins.yml up
