import { readFileSync } from 'fs';

import Router from '@koa/router';
import Koa from 'koa';
import mount from 'koa-mount';
import serve from 'koa-static';
import { render } from 'mustache';
import pino from 'pino';

const BADGE = process.env.BADGE;
const DATABASE_URL = process.env.DATABASE_URL;
const DEBUG = process.env.DEBUG;
const PORT = process.env.PORT || 3000;

const logger = pino({
  level: DEBUG === 'true' ? 'debug' : 'info',
});

logger.debug({ provided: !!BADGE }, 'application accepts BADGE environment variable');
logger.debug({ provided: !!DATABASE_URL }, 'application accepts DATABASE_URL environment variable');
logger.debug({ provided: !!DEBUG }, 'application accepts DEBUG environment variable');
logger.debug({ provided: !!PORT }, 'application accepts PORT environment variable');

const home = readFileSync('./src/template/index.html').toString();

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

logger.info({ PORT }, 'listening');
app.listen(PORT);
