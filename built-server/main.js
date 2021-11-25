/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/scripts/utility/math.ts":
/*!*************************************!*\
  !*** ./src/scripts/utility/math.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"randBetween\": () => (/* binding */ randBetween),\n/* harmony export */   \"toPolar\": () => (/* binding */ toPolar),\n/* harmony export */   \"toCartesian\": () => (/* binding */ toCartesian),\n/* harmony export */   \"isInsideCircle\": () => (/* binding */ isInsideCircle),\n/* harmony export */   \"perlinNoise1D\": () => (/* binding */ perlinNoise1D)\n/* harmony export */ });\nfunction randBetween(min, max) {\r\n    return Math.random() * (max - min) + min;\r\n}\r\nfunction toPolar(x, y) {\r\n    return {\r\n        r: Math.sqrt(x * x + y * y),\r\n        angle: Math.atan2(y, x),\r\n    };\r\n}\r\nfunction toCartesian(r, angle) {\r\n    return {\r\n        x: r * Math.cos(angle),\r\n        y: r * Math.sin(angle),\r\n    };\r\n}\r\nfunction isInsideCircle(x, y, radius) {\r\n    // Originaly sqrt(X^2 + Y^2) = r \r\n    // we can get rid of the square root by squaring on both sides \r\n    // this is a micro optimization\r\n    return (x * x + y * y) <= (radius * radius);\r\n}\r\n// https://en.wikipedia.org/wiki/Perlin_noise\r\nfunction perlinNoise1D(seed, octaves, bias) {\r\n    let output = [];\r\n    const count = seed.length;\r\n    for (let x = 0; x < count; x++) {\r\n        let noise = 0.0;\r\n        let scaleAcc = 0.0;\r\n        let scale = 1.0;\r\n        for (let o = 0; o < octaves; o++) {\r\n            let pitch = seed.length >> o;\r\n            let sample1 = Math.floor(x / pitch) * pitch;\r\n            let sample2 = (sample1 + pitch) % count;\r\n            let blend = (x - sample1) / pitch;\r\n            let sample = (1.0 - blend) * seed[sample1] + blend * seed[sample2];\r\n            scaleAcc += scale;\r\n            noise += sample * scale;\r\n            scale = scale / bias;\r\n        }\r\n        // Scale to seed range\r\n        output.push(noise / scaleAcc);\r\n    }\r\n    return output;\r\n}\r\n\n\n//# sourceURL=webpack://tanks/./src/scripts/utility/math.ts?");

/***/ }),

/***/ "./src/server/main.ts":
/*!****************************!*\
  !*** ./src/server/main.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Color\": () => (/* binding */ Color)\n/* harmony export */ });\n/* harmony import */ var http__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! http */ \"http\");\n/* harmony import */ var http__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(http__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! express */ \"express\");\n/* harmony import */ var express__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(express__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var socket_io__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! socket.io */ \"socket.io\");\n/* harmony import */ var socket_io__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(socket_io__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _scripts_utility_math__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../scripts/utility/math */ \"./src/scripts/utility/math.ts\");\n\r\n\r\n\r\n// import { StrictEventEmitter } from 'socket.io/dist/typed-events';\r\n\r\n// import { Tank } from '../scripts/objects/tank';\r\nconst app = express__WEBPACK_IMPORTED_MODULE_1___default()();\r\nconst port = process.env.PORT || 4000;\r\nconst server = (0,http__WEBPACK_IMPORTED_MODULE_0__.createServer)(app);\r\nconst io = new socket_io__WEBPACK_IMPORTED_MODULE_2__.Server(server, {\r\n    pingTimeout: 5000,\r\n    connectTimeout: 10000,\r\n    pingInterval: 1000,\r\n});\r\n// Blue color is playing the right side\r\n// Red  color is playing the left  side\r\nvar Color;\r\n(function (Color) {\r\n    Color[Color[\"Blue\"] = 0] = \"Blue\";\r\n    Color[Color[\"Red\"] = 1] = \"Red\";\r\n})(Color || (Color = {}));\r\nconst WIDTH = 800;\r\nconst HEIGHT = 600;\r\nlet players = [];\r\nlet terrain = {\r\n    width: WIDTH,\r\n    height: HEIGHT,\r\n    surfaceNoiseSeed: [...Array(WIDTH)].map(Math.random),\r\n};\r\nlet tankBlue = {\r\n    color: 0,\r\n    x: (0,_scripts_utility_math__WEBPACK_IMPORTED_MODULE_3__.randBetween)(0, terrain.width * 0.3),\r\n    y: 0,\r\n};\r\nlet tankRed = {\r\n    color: Color.Red,\r\n    x: (0,_scripts_utility_math__WEBPACK_IMPORTED_MODULE_3__.randBetween)(terrain.width * 0.7, terrain.width),\r\n    y: 0,\r\n};\r\nio.on(\"connection\", (socket) => {\r\n    console.log(`Player with socket ${socket.id} has connected`);\r\n    console.log('Current players ID');\r\n    players.forEach((player) => {\r\n        console.log(player.socket.id);\r\n    });\r\n    // console.log('A player has connected');\r\n    // If room is filled dc them\r\n    if (players.length >= 2) {\r\n        socket.send('The room is full. Sorry!');\r\n        socket.disconnect(true);\r\n        return;\r\n    }\r\n    let you, enemy;\r\n    if (players.length === 0) {\r\n        you = tankBlue;\r\n        enemy = tankRed;\r\n    }\r\n    else {\r\n        you = tankRed;\r\n        enemy = tankBlue;\r\n    }\r\n    let player = { socket: socket, tank: you };\r\n    players.push(player);\r\n    socket.send(`Hello there! You are player ${you.color} `);\r\n    io.to(socket.id).emit('init-tanks', you, enemy);\r\n    socket.emit('init-terrain', terrain);\r\n    socket.on('exit', () => {\r\n        // let isPlayerIsInTheList = players.some( player => {\r\n        //     return player.socket.id === socket.id\r\n        // });\r\n        // console.log('Was player in the list: ', isPlayerIsInTheList);\r\n        // if (isPlayerIsInTheList) {\r\n        //     socket.send(`A player has left. Game Over.`);\r\n        //     socket.emit('game-over');\r\n        // }\r\n    });\r\n    socket.on('disconnect', (reason) => {\r\n        console.log('A player has disconnect');\r\n        let isPlayerIsInTheList = players.some(player => {\r\n            return player.socket.id === socket.id;\r\n        });\r\n        console.log('Was player in the list: ', isPlayerIsInTheList);\r\n        if (isPlayerIsInTheList) {\r\n            socket.send(`A player has left. Game Over.`);\r\n            socket.emit('game-over');\r\n        }\r\n    });\r\n});\r\nserver.listen(port);\r\n\n\n//# sourceURL=webpack://tanks/./src/server/main.ts?");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/***/ ((module) => {

module.exports = require("express");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("http");

/***/ }),

/***/ "socket.io":
/*!****************************!*\
  !*** external "socket.io" ***!
  \****************************/
/***/ ((module) => {

module.exports = require("socket.io");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/server/main.ts");
/******/ 	
/******/ })()
;