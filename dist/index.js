"use strict";

var _fs = require("fs");

var _router = _interopRequireDefault(require("@koa/router"));

var _koa = _interopRequireDefault(require("koa"));

var _koaMount = _interopRequireDefault(require("koa-mount"));

var _koaStatic = _interopRequireDefault(require("koa-static"));

var _mustache = require("mustache");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var home = (0, _fs.readFileSync)('./src/template/index.html').toString();
var PORT = process.env.PORT || 3000;
var BADGE = process.env.BADGE;
var DATABASE_URL = process.env.DATABASE_URL;
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
app.listen(PORT);