"use strict";

var _fs = require("fs");

var _router = _interopRequireDefault(require("@koa/router"));

var _koa = _interopRequireDefault(require("koa"));

var _koaMount = _interopRequireDefault(require("koa-mount"));

var _koaStatic = _interopRequireDefault(require("koa-static"));

var _mustache = require("mustache");

var _pino = _interopRequireDefault(require("pino"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BADGE = process.env.BADGE;
var DATABASE_URL = process.env.DATABASE_URL;
var DEBUG = process.env.DEBUG;
var PORT = process.env.PORT || 3000;
var logger = (0, _pino.default)({
  level: DEBUG === 'true' ? 'debug' : 'info'
});
logger.debug({
  provided: !!BADGE
}, 'application accepts BADGE environment variable');
logger.debug({
  provided: !!DATABASE_URL
}, 'application accepts DATABASE_URL environment variable');
logger.debug({
  provided: !!DEBUG
}, 'application accepts DEBUG environment variable');
logger.debug({
  provided: !!PORT
}, 'application accepts PORT environment variable');
var home = (0, _fs.readFileSync)('./src/template/index.html').toString();
var app = new _koa.default();
var router = new _router.default();
router.get('/', (ctx, next) => {
  ctx.body = (0, _mustache.render)(home, {
    badge: BADGE,
    database: DATABASE_URL !== undefined
  });
});
app.use((0, _koaMount.default)('/assets', (0, _koaStatic.default)('dist/assets')));
app.use((0, _koaMount.default)('/assets', (0, _koaStatic.default)('node_modules/govuk-frontend/govuk')));
app.use((0, _koaMount.default)('/assets', (0, _koaStatic.default)('node_modules/govuk-frontend/govuk/assets')));
app.use(router.routes()).use(router.allowedMethods());
logger.info({
  PORT
}, 'listening');
app.listen(PORT);