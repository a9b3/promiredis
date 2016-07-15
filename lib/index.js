'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _redis = require('redis');

var _redis2 = _interopRequireDefault(_redis);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var RedisClient = function RedisClient() {
  var _this = this;

  (0, _classCallCheck3.default)(this, RedisClient);
  this.namespace = undefined;
  this.client = undefined;

  this.initialize = function (_ref) {
    var namespace = _ref.namespace;
    var port = _ref.port;
    var host = _ref.host;

    (0, _invariant2.default)(port && host && namespace, '\'port\', \'host\', \'namespace\' must be provided');

    if (_this.client) return;
    _this.namespace = namespace;
    // wrap all redis functions with promises
    // it'll append the word Async behind every function name
    // ex:
    //  client.get
    //  client.getAsync
    _bluebird2.default.promisifyAll(_redis2.default.RedisClient.prototype);
    _bluebird2.default.promisifyAll(_redis2.default.Multi.prototype);

    _this.client = _redis2.default.createClient(port, host);
  };

  this.getClient = function () {
    (0, _invariant2.default)(_this.client, 'call initialize() first.');
    return _this.client;
  };

  this.get = function () {
    var _ref2 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(key) {
      var res;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return _this.getClient().getAsync(_this.namespace + '/' + key);

            case 2:
              res = _context.sent;
              return _context.abrupt('return', JSON.parse(res));

            case 4:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, _this);
    }));

    return function (_x) {
      return _ref2.apply(this, arguments);
    };
  }();

  this.set = function () {
    var _ref3 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee2(key, value) {
      var reply;
      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return _this.getClient().setAsync(_this.namespace + '/' + key, (0, _stringify2.default)(value));

            case 2:
              reply = _context2.sent;

              if (reply) {
                _context2.next = 5;
                break;
              }

              throw new Error('Unable to set in redis');

            case 5:
              return _context2.abrupt('return', reply);

            case 6:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, _this);
    }));

    return function (_x2, _x3) {
      return _ref3.apply(this, arguments);
    };
  }();

  this.del = function () {
    var _ref4 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee3(key) {
      return _regenerator2.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              return _context3.abrupt('return', _this.getClient().delAsync(_this.namespace + '/' + key));

            case 1:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, _this);
    }));

    return function (_x4) {
      return _ref4.apply(this, arguments);
    };
  }();

  this.expire = function () {
    var _ref5 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee4(key, expireSec) {
      var reply;
      return _regenerator2.default.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return _this.getClient().expireAsync(_this.namespace + '/' + key, expireSec);

            case 2:
              reply = _context4.sent;

              if (reply) {
                _context4.next = 5;
                break;
              }

              throw new Error('Unable to set expiration');

            case 5:
              return _context4.abrupt('return', reply);

            case 6:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, _this);
    }));

    return function (_x5, _x6) {
      return _ref5.apply(this, arguments);
    };
  }();

  this.flushDb = function () {
    var _ref6 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee5() {
      var key = arguments.length <= 0 || arguments[0] === undefined ? '*' : arguments[0];
      var keysToDelete, i;
      return _regenerator2.default.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return _this.keys(key);

            case 2:
              keysToDelete = _context5.sent;
              i = 0;

            case 4:
              if (!(i < keysToDelete.length)) {
                _context5.next = 10;
                break;
              }

              _context5.next = 7;
              return _this.getClient().delAsync(keysToDelete[i]);

            case 7:
              i++;
              _context5.next = 4;
              break;

            case 10:
            case 'end':
              return _context5.stop();
          }
        }
      }, _callee5, _this);
    }));

    return function (_x7) {
      return _ref6.apply(this, arguments);
    };
  }();

  this.keys = function () {
    var _ref7 = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee6() {
      var key = arguments.length <= 0 || arguments[0] === undefined ? '*' : arguments[0];
      return _regenerator2.default.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.next = 2;
              return _this.getClient().keysAsync(_this.namespace + '/' + key);

            case 2:
              return _context6.abrupt('return', _context6.sent);

            case 3:
            case 'end':
              return _context6.stop();
          }
        }
      }, _callee6, _this);
    }));

    return function (_x9) {
      return _ref7.apply(this, arguments);
    };
  }();
};

exports.default = new RedisClient();