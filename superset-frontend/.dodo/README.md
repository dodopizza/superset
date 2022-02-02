# DODO SUPERSET FRONTEND

## for local development

1. Remove `node_modules`
2. Execute this code in `superset/superset-frontend` directory

```
npm install && npm link ../../superset-ui/plugins/legacy-plugin-chart-pivot-table ../../superset-ui/plugins/plugin-chart-echarts ../../superset-ui/plugins/legacy-preset-chart-nvd3 ../../superset-ui/plugins/plugin-chart-pivot-table
```

3. Be sure that your plugin version in `package.json` matches the version in superset-ui repo (that you are linking to)
4. If everything ran smoothly - open localhost:8088 (to ensure that docker image is running)
5. if it run smoothly and you are ready for local development, run:
```
npm run dev-server
```
It will be a proxy to localhost:8088 and will be running on localhost:9000
6. To ensure that all packages are linked, after running `npm run dev-server` you should see in the output in the console:
```
npm run dev-server

> superset@1.3.1 dev-server /Users/a.kazakov/WORK/DODO/DEV/DE/superset/superset-frontend
> cross-env NODE_ENV=development BABEL_ENV=development node --max_old_space_size=4096 ./node_modules/webpack-dev-server/bin/webpack-dev-server.js --mode=development

[Superset Plugin] Use symlink source for @superset-ui/legacy-plugin-chart-pivot-table @ ^0.17.41
[Superset Plugin] Use symlink source for @superset-ui/legacy-preset-chart-nvd3 @ ^0.17.41
[Superset Plugin] Use symlink source for @superset-ui/plugin-chart-echarts @ ^0.17.84
[Superset Plugin] Use symlink source for @superset-ui/plugin-chart-pivot-table @ ^0.17.41

```

P.S. If everything is linked and there are no errors and you are on the localhost:9000, when you update the file from those linked plugins - you will have hot reload on your :9000.

*this is until we switch to .npmrc*


## Checking the production version

If you are ready to deploy and there is no errors in the console while running `npm run dev-server`, be sure to run `npm run build`. The nasty errors might apper in PRODUCTION mode and NOT appear in DEVELOPMENT mode.

```
npm install && npm install ../../superset-ui/plugins/legacy-plugin-chart-pivot-table ../../superset-ui/plugins/plugin-chart-echarts ../../superset-ui/plugins/legacy-preset-chart-nvd3 ../../superset-ui/plugins/plugin-chart-pivot-table
```

You should see a message in the end of the output
```
+ @superset-ui/legacy-plugin-chart-pivot-table@0.17.41
+ @superset-ui/legacy-preset-chart-nvd3@0.17.41
+ @superset-ui/plugin-chart-echarts@0.17.84
+ @superset-ui/plugin-chart-pivot-table@0.17.41
removed XX packages, updated XX packages and audited XXXX packages in XX.XXs

```
When commiting, do not forget to change the `package.json` file back

## Important change from November 2021

Instead of linking the `superset-ui` plugins using npm link, we now have a dodo npm

## When developing localy you need to change some files, without commiting them later:

`.npmrc` file:
```
you need to get the token to install the superset-ui plugins
```

`docker-compose.yml` file:

```
x-superset-image: &superset-image apache/superset:latest-dev
=>
x-superset-image: &superset-image apache/superset:1.3.1
```

`config.py` file:

```
"DASHBOARD_NATIVE_FILTERS": False
=>
"DASHBOARD_NATIVE_FILTERS": True
```