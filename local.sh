#!/usr/bin/env bash

superset db upgrade

export FLASK_APP=superset
flask fab create-admin --username admin --firstname admin --lastname admin --email admin@example.com  --password admin 2>/dev/null


superset init
