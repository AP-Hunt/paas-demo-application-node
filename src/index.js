import { readFileSync } from 'fs';

import Router from '@koa/router';
import Koa from 'koa';
import mount from 'koa-mount';
import serve from 'koa-static';
import { render } from 'mustache';

const home = readFileSync('./src/template/index.html').toString();

const PORT = process.env.PORT || 3000;
const BADGE = process.env.BADGE;
const DATABASE_URL = process.env.DATABASE_URL;

const app = new Koa();
const router = new Router();

router.get('/', (ctx, next) => {
  ctx.body = render(home, {
    badge: BADGE,
    database: DATABASE_URL !== undefined,
  });
});

app.use(mount('/assets', serve('dist/assets')));
app.use(mount('/assets', serve('node_modules/govuk-frontend/govuk')));
app.use(mount('/assets', serve('node_modules/govuk-frontend/govuk/assets')));

app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(PORT);
