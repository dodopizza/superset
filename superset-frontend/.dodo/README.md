# DODO SUPERSET FRONTEND

## Local requirements for backend

Create a file `docker/requirements-local.txt` with this content:

```
Authlib==0.15.5
gevent==21.12.0
moz-sql-parser==4.9.21002
mysqlclient==2.1.0
prometheus-client==0.13.1
psycopg2==2.8.5
pybigquery==0.5.0
pymssql==2.1.5
python-json-logger==2.0.2
redis==4.6.0
typing-extensions==4.9.0
sqlalchemy-kusto==2.0.1
xlsxwriter==3.0.7
flask-http-middleware==0.3.1
sshtunnel==0.4.0
Flask-SQLAlchemy==2.5.1
marshmallow-enum==1.5.1

```

## Start docker

In order to start development in the root directory perform

```
docker-compose -f docker-compose.yml up
```

The core version is going to run on http://localhost:8088/

## Developing frontend (standalone)

If you want to develop frontend part (standalone) in the `superset-frontend` directory perform

```
npm run dev-server
```

The version for development is going to run on http://localhost:9000/

## Developing frontend (plugin)

If you want to develop frontend part (plugin) in the `superset-frontend` directory perform

```
npm run pl:dev-server
```

The version for development is going to run on http://localhost:3000/

## Superset login/pass

```
login: admin
password: admin

```

## When developing localy you need to change some files, without commiting them later:

`config.py` file:

```
"DASHBOARD_NATIVE_FILTERS": False
=>
"DASHBOARD_NATIVE_FILTERS": True
# add languages
LANGUAGES = {
    "en": {"flag": "us", "name": "English"},
    "ru": {"flag": "ru", "name": "Russian"},
}
```

## How to release this to the dev stage (https://superset.d.yandex.dodois.dev/) and PROD (https://analytics.dodois.io/)?

1. Merge everything to the branch `3.0-dodo` (March 2024)
2. Go to the repo https://github.com/dodopizza/superset-plugins/actions
3. Actions -> Build Frontend

> `Superset frontend branch`

```
3.0-dodo
```

!Deprecated

> `Superset UI branch`

```
dodo-plugins-0.17.41
```

**Wait until this job is done and green.**

4. Actions -> Build Backend
   > `Superset backend branch`

```
add-kusto-support-1.3.1
```

**Wait until this job is done and green.**

5. Go to Slack and release, using Yunga

```
/yunga images superset
```

```
Last 10 app versions:
 | Tag                                      | Last update (UTC)   |
 |----------------------------------------------------------------|
 | main-0fc46f1-312768185                   | 02/02/2022 08:28:26 |
 | main-0fc46f1-871965247                   | 01/12/2022 12:55:46 |
 | prod-cors-10314d1-581888879              | 01/12/2022 10:22:13 |
 | gunicorn_to_prometheus-4f46ceb-448680323 | 01/12/2022 10:07:16 |
 | main-84c2e5e-047371347                   | 01/12/2022 09:04:22 |
 | sqlalchemy-kusto-a85faff-100934666       | 01/12/2022 08:46:43 |
 | gunicorn_to_prometheus-4d81197-084830501 | 12/29/2021 22:15:45 |
 | gunicorn_to_prometheus-1226634-095810095 | 12/29/2021 21:38:20 |
 | sqlalchemy-kusto-f37a621-652147031       | 12/29/2021 14:59:23 |
 | sqlalchemy-kusto-4916427-980701248       | 12/29/2021 12:55:38 |
```

We need `main-0fc46f1-312768185`

6. Release on dev stage

```
/yunga promote superset d yandex spr main-0fc46f1-312768185
```

7. Release on prod stage

```
/yunga promote superset p azure superset main-0fc46f1-312768185
```

8. You are amazing

## Debugging backend in docker

Follow these instructions to debug the Flask app running inside a docker container.

First add the following to the ./docker-compose.yaml file

```diff
superset:
    env_file: docker/.env
    image: *superset-image
    container_name: superset_app
    command: ["/app/docker/docker-bootstrap.sh", "app"]
    restart: unless-stopped
+   cap_add:
+     - SYS_PTRACE
    ports:
      - 8088:8088
+     - 5678:5678
    user: "root"
    depends_on: *superset-depends-on
    volumes: *superset-volumes
    environment:
      CYPRESS_CONFIG: "${CYPRESS_CONFIG}"
```

Start Superset as usual

```bash
docker-compose up
```

Install the required libraries and packages to the docker container

Enter the superset_app container

```bash
docker exec -it superset_app /bin/bash
root@39ce8cf9d6ab:/app#
```

Run the following commands inside the container

```bash
apt update
apt install -y gdb
apt install -y net-tools
apt install -y procps
pip install debugpy
```

Find the PID for the Flask process. Make sure to use the first PID. The Flask app will re-spawn a sub-process every time you change any of the python code. So it's important to use the first PID.

```bash
ps -ef

UID        PID  PPID  C STIME TTY          TIME CMD
root         1     0  0 14:09 ?        00:00:00 bash /app/docker/docker-bootstrap.sh app
root         6     1  4 14:09 ?        00:00:04 /usr/local/bin/python /usr/bin/flask run -p 8088 --with-threads --reload --debugger --host=0.0.0.0
root        10     6  7 14:09 ?        00:00:07 /usr/local/bin/python /usr/bin/flask run -p 8088 --with-threads --reload --debugger --host=0.0.0.0
```

Inject debugpy into the running Flask process. In this case PID 6.

```bash
python3 -m debugpy --listen 0.0.0.0:5678 --pid 6
```

Verify that debugpy is listening on port 5678

```bash
netstat -tunap

Active Internet connections (servers and established)
Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name
tcp        0      0 0.0.0.0:5678            0.0.0.0:*               LISTEN      462/python
tcp        0      0 0.0.0.0:8088            0.0.0.0:*               LISTEN      6/python
```

You are now ready to attach a debugger to the process. Using VSCode you can configure a launch configuration file .vscode/launch.json like so.

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Attach to Superset App in Docker Container",
      "type": "python",
      "request": "attach",
      "connect": {
        "host": "127.0.0.1",
        "port": 5678
      },
      "pathMappings": [
        {
          "localRoot": "${workspaceFolder}",
          "remoteRoot": "/app"
        }
      ]
    }
  ]
}
```

VSCode will not stop on breakpoints right away. We've attached to PID 6 however it does not yet know of any sub-processes. In order to "wake up" the debugger you need to modify a python file. This will trigger Flask to reload the code and create a new sub-process. This new sub-process will be detected by VSCode and breakpoints will be activated.
