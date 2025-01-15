"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
// webSocketServer.js

var WebSocket = require('ws');
var redis = require('redis');
var moment = require('moment');
var ClientManager = require('../websocket/clientManager');
var Logger = require('../utils/logger');
var HealthChecker = require('../websocket/healthChecker');
var QueueManager = require('../websocket/queueManager'); // Import QueueManager

// Intervalles paramétrables
var HEARTBEAT_INTERVAL = 1000; // 1 seconde pour le health check
var STATUS_UPDATE_INTERVAL = 1000; // 1 seconde pour sendStatusUpdates

// Variable pour stocker l'instance unique
var globalWSS = null;
var WebSocketServer = /*#__PURE__*/function () {
  function WebSocketServer() {
    _classCallCheck(this, WebSocketServer);
    // Panels attendus
    this.expectedPanels = ['indret', 'aval', 'amont'];

    // Création du WebSocket server
    this.wss = new WebSocket.Server({
      port: 8080
    });

    // Instancier le client manager
    this.clientManager = new ClientManager(WebSocket);

    // Création du client Redis (v4+)
    this.redisClient = redis.createClient();

    // QueueManager (gestion des instructions en Redis)
    this.queueManager = new QueueManager(this.redisClient, this.expectedPanels);

    // Instructions envoyées en attente d'ack
    this.sentInstructions = {};

    // Gérer les erreurs Redis
    this.redisClient.on('error', function (err) {
      return console.error('Redis Client Error', err);
    });

    // Initialiser le serveur (async)
    this.init();
  }
  return _createClass(WebSocketServer, [{
    key: "init",
    value: function () {
      var _init = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              this.setupServer();

              // Connexion à Redis
              _context.next = 4;
              return this.redisClient.connect();
            case 4:
              console.log('Redis client connected');
              Logger.appendLog('backend', 'WebSocket Server Started', {
                message: 'WebSocket server started and Redis client connected'
              });

              // Vider les queues Redis
              _context.next = 8;
              return this.queueManager.clearAllQueues();
            case 8:
              // Commencer à traiter les queues
              this.processQueues();

              // Nettoyage périodique (instructions sans ack)
              this.startCleanupInterval();
              _context.next = 16;
              break;
            case 12:
              _context.prev = 12;
              _context.t0 = _context["catch"](0);
              console.error('Failed to connect to Redis:', _context.t0);
              Logger.appendLog('Backend', 'WebSocket Server Start Failed', {
                error: _context.t0.message
              });
            case 16:
            case "end":
              return _context.stop();
          }
        }, _callee, this, [[0, 12]]);
      }));
      function init() {
        return _init.apply(this, arguments);
      }
      return init;
    }()
  }, {
    key: "setupServer",
    value: function setupServer() {
      var _this = this;
      console.log('WebSocket server is running on port 8080');
      console.log('Starting health check interval...');

      // Health checks (heartbeat/ping)
      this.healthCheckIntervalId = setInterval(function () {
        return _this.checkProblems();
      }, HEARTBEAT_INTERVAL);

      // Statut panels vers "frontend"
      this.statusUpdateIntervalId = setInterval(function () {
        return _this.sendStatusUpdates();
      }, STATUS_UPDATE_INTERVAL);

      // Gestion des connexions
      this.wss.on('connection', function (ws) {
        return _this.handleConnection(ws);
      });

      // Erreurs server-level
      this.wss.on('error', function (error) {
        console.error('WebSocket server error:', error);
      });
    }
  }, {
    key: "handleConnection",
    value: function handleConnection(ws) {
      var _this2 = this;
      console.log('[WebSocketServer] New connection established.');
      ws.on('message', function (message) {
        _this2.handleMessage(ws, message);
      });
      ws.on('close', function () {
        console.log('[WebSocketServer] Connection closed.');
        _this2.handleClose(ws);
      });
      ws.on('error', function (error) {
        console.error("[WebSocketServer] Connection error: ".concat(error));
        _this2.handleClose(ws);
      });

      // Instructions initiales éventuelles
      this.sendInitialInstructions(ws);
    }
  }, {
    key: "handleMessage",
    value: function () {
      var _handleMessage = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee2(ws, rawMessage) {
        var message;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              _context2.prev = 0;
              message = JSON.parse(rawMessage);
              _context2.next = 10;
              break;
            case 4:
              _context2.prev = 4;
              _context2.t0 = _context2["catch"](0);
              console.log('Invalid JSON received.');
              ws.send(JSON.stringify({
                error: 'Invalid JSON'
              }));
              Logger.appendLog('Unknown Client', 'Error', {
                error: 'Invalid JSON'
              });
              return _context2.abrupt("return");
            case 10:
              _context2.t1 = message.type;
              _context2.next = _context2.t1 === 'instruction' ? 13 : _context2.t1 === 'register' ? 17 : _context2.t1 === 'heartbeat' ? 19 : _context2.t1 === 'acknowledgement' ? 21 : _context2.t1 === 'modify_queue' ? 24 : _context2.t1 === 'ping' ? 27 : 29;
              break;
            case 13:
              console.log('[WebSocketServer] Instruction received:', message);
              _context2.next = 16;
              return this.handleInstruction(message);
            case 16:
              return _context2.abrupt("break", 32);
            case 17:
              this.handleRegister(ws, message);
              return _context2.abrupt("break", 32);
            case 19:
              this.clientManager.updateHeartbeat(ws, message);
              return _context2.abrupt("break", 32);
            case 21:
              _context2.next = 23;
              return this.handleAcknowledgement(message);
            case 23:
              return _context2.abrupt("break", 32);
            case 24:
              _context2.next = 26;
              return this.handleModifyQueue(message);
            case 26:
              return _context2.abrupt("break", 32);
            case 27:
              ws.send(JSON.stringify({
                type: 'pong'
              }));
              return _context2.abrupt("break", 32);
            case 29:
              console.log(message);
              console.log("Unknown message type: ".concat(message.type));
              Logger.appendLog(message.name || 'Unknown Client', "Unknown Event: ".concat(message.type), message);
            case 32:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this, [[0, 4]]);
      }));
      function handleMessage(_x, _x2) {
        return _handleMessage.apply(this, arguments);
      }
      return handleMessage;
    }()
  }, {
    key: "handleInstruction",
    value: function () {
      var _handleInstruction = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee3(message) {
        var targetPanels, _iterator, _step, panelName, instructionItem, role;
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              if (!(message.to !== 'panel')) {
                _context3.next = 3;
                break;
              }
              console.log('Invalid instruction target:', message.to);
              return _context3.abrupt("return");
            case 3:
              // Sur un panel précis ou sur tous
              targetPanels = message.name === 'all' ? this.expectedPanels : [message.name];
              _iterator = _createForOfIteratorHelper(targetPanels);
              _context3.prev = 5;
              _iterator.s();
            case 7:
              if ((_step = _iterator.n()).done) {
                _context3.next = 26;
                break;
              }
              panelName = _step.value;
              _context3.next = 11;
              return this.queueManager.enqueueInstruction(panelName, message.instruction, message.role);
            case 11:
              instructionItem = _context3.sent;
              _context3.t0 = this.clientManager;
              _context3.t1 = JSON;
              _context3.t2 = panelName;
              _context3.next = 17;
              return this.queueManager.getQueue(panelName);
            case 17:
              _context3.t3 = _context3.sent;
              _context3.t4 = {
                type: 'queue_update',
                panelName: _context3.t2,
                queue: _context3.t3
              };
              _context3.t5 = _context3.t1.stringify.call(_context3.t1, _context3.t4);
              _context3.t0.sendToFrontend.call(_context3.t0, _context3.t5);
              // Log
              role = message.role || message.from || 'unknown';
              Logger.appendLog(panelName, "User ".concat(role, " enqueued instruction (").concat(message.instruction, ")"), {
                instruction: message.instruction,
                instructionId: instructionItem.id,
                role: role
              });
              console.log("[WebSocketServer] Instruction enqueued for ".concat(panelName, ": ").concat(message.instruction, " with id ").concat(instructionItem.id));
            case 24:
              _context3.next = 7;
              break;
            case 26:
              _context3.next = 31;
              break;
            case 28:
              _context3.prev = 28;
              _context3.t6 = _context3["catch"](5);
              _iterator.e(_context3.t6);
            case 31:
              _context3.prev = 31;
              _iterator.f();
              return _context3.finish(31);
            case 34:
            case "end":
              return _context3.stop();
          }
        }, _callee3, this, [[5, 28, 31, 34]]);
      }));
      function handleInstruction(_x3) {
        return _handleInstruction.apply(this, arguments);
      }
      return handleInstruction;
    }()
  }, {
    key: "handleRegister",
    value: function handleRegister(ws, message) {
      var clientType = message.clientType,
        name = message.name;

      // Un seul user possible ?
      if (clientType === 'user') {
        this.clientManager.removeClientsByType('user', ws);
      }
      this.clientManager.addClient(ws, {
        clientType: clientType,
        name: name,
        lastHeartbeat: Date.now(),
        sectorStatus: message.sectorStatus !== undefined ? message.sectorStatus : true,
        state: message.state || 'off',
        cpuTemp: message.cpuTemp || null,
        isDoorOpen: message.isDoorOpen || false,
        maintenanceMode: message.maintenanceMode || false
      });

      // Notifier frontends
      this.clientManager.sendToFrontend(JSON.stringify({
        type: 'panel_registered',
        name: name
      }));
      var role = message.from || 'unknown';
      Logger.appendLog(name, 'Panel connection', {
        panelName: name,
        role: role
      });
      console.log("[WebSocketServer] Panel registered: ".concat(name));
    }
  }, {
    key: "handleClose",
    value: function handleClose(ws) {
      var clientInfo = this.clientManager.getClientInfo(ws);
      if (!clientInfo || !clientInfo.name) {
        console.log('Disconnected client without registration.');
        Logger.appendLog('Unknown Client', 'Disconnected client without registration.');
        return;
      }
      var panelName = clientInfo.name;
      this.clientManager.removeClient(ws);
      console.log("[WebSocketServer] Panel disconnected: ".concat(panelName));
      Logger.appendLog(panelName, 'Disconnected', {
        message: 'WebSocket connection closed.'
      });
    }
  }, {
    key: "sendInitialInstructions",
    value: function sendInitialInstructions(ws) {
      // e.g. ws.send(JSON.stringify({ type: 'welcome' }));
    }
  }, {
    key: "checkProblems",
    value: function () {
      var _checkProblems = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee4() {
        var clients, allOk, _iterator2, _step2, client, panelName, instruction, instructionItem;
        return _regeneratorRuntime().wrap(function _callee4$(_context4) {
          while (1) switch (_context4.prev = _context4.next) {
            case 0:
              clients = this.clientManager.getClients();
              _context4.next = 3;
              return HealthChecker.checkProblems(clients, this.expectedPanels, this.queueManager);
            case 3:
              allOk = _context4.sent;
              console.log("[HealthChecker] All systems OK: ".concat(allOk));
              if (allOk) {
                _context4.next = 30;
                break;
              }
              _iterator2 = _createForOfIteratorHelper(clients);
              _context4.prev = 7;
              _iterator2.s();
            case 9:
              if ((_step2 = _iterator2.n()).done) {
                _context4.next = 22;
                break;
              }
              client = _step2.value;
              console.log("[HealthChecker] Checking client ".concat(client.name, " with state: ").concat(client.connected));
              if (!(client.state === 'on')) {
                _context4.next = 20;
                break;
              }
              panelName = client.name;
              instruction = 'off';
              _context4.next = 17;
              return this.queueManager.enqueueInstruction(panelName, instruction, 'auto');
            case 17:
              instructionItem = _context4.sent;
              console.log("[HealthChecker] Enqueued auto-off instruction for ".concat(panelName, ": ").concat(instruction, " with id ").concat(instructionItem.id));
              Logger.appendLog(panelName, 'Auto-Off Instruction Enqueued', {
                instruction: instruction,
                instructionId: instructionItem.id,
                role: 'auto'
              });
            case 20:
              _context4.next = 9;
              break;
            case 22:
              _context4.next = 27;
              break;
            case 24:
              _context4.prev = 24;
              _context4.t0 = _context4["catch"](7);
              _iterator2.e(_context4.t0);
            case 27:
              _context4.prev = 27;
              _iterator2.f();
              return _context4.finish(27);
            case 30:
            case "end":
              return _context4.stop();
          }
        }, _callee4, this, [[7, 24, 27, 30]]);
      }));
      function checkProblems() {
        return _checkProblems.apply(this, arguments);
      }
      return checkProblems;
    }()
  }, {
    key: "sendStatusUpdates",
    value: function () {
      var _sendStatusUpdates = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee5() {
        var panelStatus, statusMessage;
        return _regeneratorRuntime().wrap(function _callee5$(_context5) {
          while (1) switch (_context5.prev = _context5.next) {
            case 0:
              panelStatus = {};
              this.clientManager.getLastClientData().forEach(function (clientInfo) {
                var panelName = clientInfo.name;
                var currentStatus = clientInfo.currentStatus || 'offline';
                var lastHeartbeatTime = moment(clientInfo.lastHeartbeat);
                panelStatus[panelName] = {
                  status: currentStatus,
                  connected: clientInfo.connected,
                  state: clientInfo.state,
                  cpuTemp: clientInfo.cpuTemp,
                  isDoorOpen: clientInfo.isDoorOpen,
                  sectorStatus: clientInfo.sectorStatus,
                  maintenanceMode: clientInfo.maintenanceMode,
                  lastHeartbeat: Math.floor((Date.now() - lastHeartbeatTime) / 1000),
                  lastHeartbeatTimestamp: lastHeartbeatTime.format('YYYY-MM-DD HH:mm:ss')
                };
              });

              // Panels attendus non connectés
              this.expectedPanels.forEach(function (panel) {
                if (!panelStatus[panel]) {
                  panelStatus[panel] = {
                    status: 'offline',
                    connected: false,
                    state: null,
                    cpuTemp: null,
                    isDoorOpen: null,
                    sectorStatus: null,
                    maintenanceMode: null,
                    lastHeartbeat: null,
                    lastHeartbeatTimestamp: null
                  };
                }
              });
              statusMessage = JSON.stringify({
                type: 'status',
                panelStatus: panelStatus
              });
              this.clientManager.sendToFrontend(statusMessage);
            case 5:
            case "end":
              return _context5.stop();
          }
        }, _callee5, this);
      }));
      function sendStatusUpdates() {
        return _sendStatusUpdates.apply(this, arguments);
      }
      return sendStatusUpdates;
    }()
  }, {
    key: "processQueues",
    value: function () {
      var _processQueues = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee7() {
        var _this3 = this;
        return _regeneratorRuntime().wrap(function _callee7$(_context7) {
          while (1) switch (_context7.prev = _context7.next) {
            case 0:
              setInterval(/*#__PURE__*/_asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee6() {
                var _iterator3, _step3, panelName, queue, nextInstruction, panelClient, instructionMessage, panelClientInfo, panelStatus;
                return _regeneratorRuntime().wrap(function _callee6$(_context6) {
                  while (1) switch (_context6.prev = _context6.next) {
                    case 0:
                      _iterator3 = _createForOfIteratorHelper(_this3.expectedPanels);
                      _context6.prev = 1;
                      _iterator3.s();
                    case 3:
                      if ((_step3 = _iterator3.n()).done) {
                        _context6.next = 30;
                        break;
                      }
                      panelName = _step3.value;
                      _context6.next = 7;
                      return _this3.queueManager.getQueue(panelName);
                    case 7:
                      queue = _context6.sent;
                      if (!(queue.length === 0)) {
                        _context6.next = 10;
                        break;
                      }
                      return _context6.abrupt("continue", 28);
                    case 10:
                      nextInstruction = queue[0];
                      console.log("[ProcessQueues] Next instruction for ".concat(panelName, ":"), nextInstruction);
                      if (!(nextInstruction.status === 'pending')) {
                        _context6.next = 28;
                        break;
                      }
                      panelClient = _this3.clientManager.getClientByName(panelName);
                      if (!panelClient) {
                        _context6.next = 27;
                        break;
                      }
                      instructionMessage = {
                        type: 'instruction',
                        instruction: nextInstruction.instruction,
                        instructionId: nextInstruction.id,
                        to: 'panel',
                        panelName: panelName
                      };
                      panelClient.ws.send(JSON.stringify(instructionMessage));
                      nextInstruction.status = 'sent';
                      _context6.next = 20;
                      return _this3.queueManager.removeInstruction(panelName, nextInstruction.id);
                    case 20:
                      _this3.storeSentInstruction(panelName, nextInstruction);
                      panelClientInfo = _this3.clientManager.getClientInfoByName(panelName);
                      panelStatus = panelClientInfo ? {
                        status: panelClientInfo.currentStatus || 'unknown',
                        state: panelClientInfo.state || 'unknown',
                        cpuTemp: panelClientInfo.cpuTemp || null,
                        isDoorOpen: panelClientInfo.isDoorOpen || false,
                        sectorStatus: panelClientInfo.sectorStatus || null,
                        maintenanceMode: panelClientInfo.maintenanceMode || false
                      } : {
                        status: 'unknown'
                      };
                      Logger.appendLog(panelName, "Serveur transmitted instruction (".concat(nextInstruction.instruction, ") to ").concat(panelName), {
                        instruction: nextInstruction.instruction,
                        instructionId: nextInstruction.id,
                        panelStatus: panelStatus
                      });
                      console.log("[WebSocketServer] Sent instruction ".concat(nextInstruction.id, " (").concat(nextInstruction.instruction, ") to ").concat(panelName, ", panel status:"), panelStatus);
                      _context6.next = 28;
                      break;
                    case 27:
                      console.warn("Panel ".concat(panelName, " is not connected. Cannot send instruction."));
                    case 28:
                      _context6.next = 3;
                      break;
                    case 30:
                      _context6.next = 35;
                      break;
                    case 32:
                      _context6.prev = 32;
                      _context6.t0 = _context6["catch"](1);
                      _iterator3.e(_context6.t0);
                    case 35:
                      _context6.prev = 35;
                      _iterator3.f();
                      return _context6.finish(35);
                    case 38:
                    case "end":
                      return _context6.stop();
                  }
                }, _callee6, null, [[1, 32, 35, 38]]);
              })), 1000);
            case 1:
            case "end":
              return _context7.stop();
          }
        }, _callee7);
      }));
      function processQueues() {
        return _processQueues.apply(this, arguments);
      }
      return processQueues;
    }()
  }, {
    key: "storeSentInstruction",
    value: function storeSentInstruction(panelName, instruction) {
      if (!this.sentInstructions[panelName]) {
        this.sentInstructions[panelName] = [];
      }
      this.sentInstructions[panelName].push(instruction);
    }
  }, {
    key: "getSentInstructions",
    value: function getSentInstructions(panelName) {
      return this.sentInstructions[panelName] || [];
    }
  }, {
    key: "handleAcknowledgement",
    value: function () {
      var _handleAcknowledgement = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee8(message) {
        var panelName, instructionId, status, acknowledgedInstruction, idx, updatedQueue, instruction, panelClientInfo, panelStatus;
        return _regeneratorRuntime().wrap(function _callee8$(_context8) {
          while (1) switch (_context8.prev = _context8.next) {
            case 0:
              panelName = message.panelName, instructionId = message.instructionId, status = message.status;
              acknowledgedInstruction = null;
              if (this.sentInstructions[panelName]) {
                idx = this.sentInstructions[panelName].findIndex(function (instr) {
                  return instr.id === instructionId;
                });
                if (idx !== -1) {
                  acknowledgedInstruction = this.sentInstructions[panelName][idx];
                  this.sentInstructions[panelName].splice(idx, 1);
                }
              }
              _context8.next = 5;
              return this.queueManager.getQueue(panelName);
            case 5:
              updatedQueue = _context8.sent;
              this.clientManager.sendToFrontend(JSON.stringify({
                type: 'queue_update',
                panelName: panelName,
                queue: updatedQueue
              }));
              instruction = acknowledgedInstruction ? acknowledgedInstruction.instruction : 'unknown';
              panelClientInfo = this.clientManager.getClientInfoByName(panelName);
              panelStatus = panelClientInfo ? {
                status: panelClientInfo.currentStatus || 'unknown',
                state: panelClientInfo.state || 'unknown',
                cpuTemp: panelClientInfo.cpuTemp || null,
                isDoorOpen: panelClientInfo.isDoorOpen || false,
                sectorStatus: panelClientInfo.sectorStatus || null,
                maintenanceMode: panelClientInfo.maintenanceMode || false
              } : {
                status: 'unknown'
              };
              Logger.appendLog(panelName, "Instruction  (".concat(instruction, ") acknowledged by ").concat(panelName), {
                instruction: instruction,
                instructionId: instructionId,
                status: status,
                panelStatus: panelStatus
              });
              console.log("[WebSocketServer] Instruction ".concat(instructionId, " (").concat(instruction, ") acknowledged by ").concat(panelName, " with status: ").concat(status, ", panel status:"), panelStatus);
            case 12:
            case "end":
              return _context8.stop();
          }
        }, _callee8, this);
      }));
      function handleAcknowledgement(_x4) {
        return _handleAcknowledgement.apply(this, arguments);
      }
      return handleAcknowledgement;
    }()
  }, {
    key: "handleModifyQueue",
    value: function () {
      var _handleModifyQueue = _asyncToGenerator(/*#__PURE__*/_regeneratorRuntime().mark(function _callee9(message) {
        var action, panelName, instructionId, updatedQueue;
        return _regeneratorRuntime().wrap(function _callee9$(_context9) {
          while (1) switch (_context9.prev = _context9.next) {
            case 0:
              action = message.action, panelName = message.panelName, instructionId = message.instructionId;
              if (!(action === 'delete')) {
                _context9.next = 9;
                break;
              }
              _context9.next = 4;
              return this.queueManager.removeInstruction(panelName, instructionId);
            case 4:
              _context9.next = 6;
              return this.queueManager.getQueue(panelName);
            case 6:
              updatedQueue = _context9.sent;
              this.clientManager.sendToFrontend(JSON.stringify({
                type: 'queue_update',
                panelName: panelName,
                queue: updatedQueue
              }));
              console.log("[WebSocketServer] Instruction ".concat(instructionId, " removed from queue for ").concat(panelName));
            case 9:
            case "end":
              return _context9.stop();
          }
        }, _callee9, this);
      }));
      function handleModifyQueue(_x5) {
        return _handleModifyQueue.apply(this, arguments);
      }
      return handleModifyQueue;
    }()
  }, {
    key: "startCleanupInterval",
    value: function startCleanupInterval() {
      var _this4 = this;
      var MAX_WAIT_TIME = 60000; // 60s
      var CLEANUP_INTERVAL = 10000; // 10s

      setInterval(function () {
        var now = Date.now();
        var _loop = function _loop(panelName) {
          _this4.sentInstructions[panelName] = _this4.sentInstructions[panelName].filter(function (instruction) {
            if (now - instruction.timestamp > MAX_WAIT_TIME) {
              console.warn("Instruction ".concat(instruction.id, " to ").concat(panelName, " has not been acknowledged after ").concat(MAX_WAIT_TIME, " ms."));
              _this4.resendInstruction(panelName, instruction);
              return false;
            }
            return true;
          });
        };
        for (var panelName in _this4.sentInstructions) {
          _loop(panelName);
        }
      }, CLEANUP_INTERVAL);
    }
  }, {
    key: "resendInstruction",
    value: function resendInstruction(panelName, instruction) {
      var panelClient = this.clientManager.getClientByName(panelName);
      if (!panelClient) {
        console.warn("Cannot resend instruction to ".concat(panelName, " as it is not connected."));
        return;
      }
      var instructionMessage = {
        type: 'instruction',
        instruction: instruction.instruction,
        instructionId: instruction.id,
        to: 'panel',
        panelName: panelName
      };
      panelClient.ws.send(JSON.stringify(instructionMessage));
      console.log("[WebSocketServer] Resent instruction ".concat(instruction.id, " to ").concat(panelName));
      instruction.timestamp = Date.now();
      this.storeSentInstruction(panelName, instruction);
    }
  }]);
}();
/**
 * Crée une instance unique du WebSocketServer.
 */
function createWebSocketServer() {
  if (!globalWSS) {
    globalWSS = new WebSocketServer();
  }
  return globalWSS;
}

/**
 * Récupère le clientManager de l'unique instance WebSocketServer (ou null si pas encore créé).
 */
function getClientManager() {
  return globalWSS ? globalWSS.clientManager : null;
}
module.exports = {
  WebSocketServer: WebSocketServer,
  createWebSocketServer: createWebSocketServer,
  getClientManager: getClientManager
};