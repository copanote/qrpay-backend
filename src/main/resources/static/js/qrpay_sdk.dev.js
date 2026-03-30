/*!
 * commitVersion: b3d9020
 * Build Date: 3/30/2026, 10:13:42 PM
 * Author: dongwook.shin
 *
 */
/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(self, () => {
	return /******/ (() => { // webpackBootstrap
		/******/ 	"use strict";
		/******/ 	var __webpack_modules__ = ({

			/***/ "./src/context.js":
			/*!************************!*\
              !*** ./src/context.js ***!
              \************************/
			/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

				eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nconst Context = () => {\n  const profile = `${\"development\"}`;\n  const context = p => {\n    switch (p) {\n      case 'local':\n        return {\n          loggable: true\n        };\n      case 'development':\n        return {\n          loggable: true\n        };\n      case 'production':\n        return {\n          loggable: false\n        };\n    }\n  };\n  return context(profile);\n};\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Context);\n\n//# sourceURL=webpack://qrpay_js_sdk/./src/context.js?");

				/***/ }),

			/***/ "./src/index.js":
			/*!**********************!*\
              !*** ./src/index.js ***!
              \**********************/
			/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

				eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"qrpaySdk\": () => (/* binding */ qrpay_sdk),\n/* harmony export */   \"qrpayStorage\": () => (/* binding */ qrpay_Storage)\n/* harmony export */ });\n/* harmony import */ var _qrpay_sdk__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./qrpay_sdk */ \"./src/qrpay_sdk.js\");\n/* harmony import */ var _qrpay_storage__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./qrpay_storage */ \"./src/qrpay_storage.js\");\n\n\nconst qrpay_sdk = (0,_qrpay_sdk__WEBPACK_IMPORTED_MODULE_0__[\"default\"])();\nconst qrpay_Storage = (0,_qrpay_storage__WEBPACK_IMPORTED_MODULE_1__[\"default\"])();\n\n\n//# sourceURL=webpack://qrpay_js_sdk/./src/index.js?");

				/***/ }),

			/***/ "./src/qrpay_sdk.js":
			/*!**************************!*\
              !*** ./src/qrpay_sdk.js ***!
              \**************************/
			/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

				eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var _context__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./context */ \"./src/context.js\");\n/* harmony import */ var _qrpay_storage__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./qrpay_storage */ \"./src/qrpay_storage.js\");\n\n\n\n// ─── 상수 ──────────────────────────────────────────────────────────────────\n\nconst AUTH_APIS = {\n  AUTH_LOGIN: '/qrpay/auth/login',\n  AUTH_REFRESH: '/qrpay/auth/refresh',\n  AUTH_LOGOUT: '/qrpay/auth/logout'\n};\nconst PAGES_APIS = {\n  PAGES_LOGIN: '/qrpay/pages/login',\n  PAGES_MAIN: '/qrpay/pages/home/mpmqr',\n  PAGES_NOTICE: '/qrpay/pages/settings/notice',\n  PAGES_GUIDE: '/qrpay/pages/settings/guide',\n  PAGES_TERMS_SERVICE: '/qrpay/pages/settings/terms-service',\n  PAGES_TERMS_SERVICE_TERMS: '/pages/settings/terms-service/terms',\n  PAGES_TERMS_SERVICE_PERMISSIONS: '/qrpay/pages/settings/terms-service/permissions',\n  PAGES_TERMS_SERVICE_CANCEL: '/qrpay/pages/settings/terms-service/cancel'\n};\nconst REST_APIS = {\n  MERCHANT: {\n    INFO: '/qrpay/api/v1/merchant/info',\n    EMPLOYEES: '/qrpay/api/v1/merchant/employees',\n    ADD_EMPLOYEES: '/qrpay/api/v1/merchant/add-employee',\n    MPMQR: '/qrpay/api/v1/merchant/mpmqr',\n    CHANGE_NAME: '/qrpay/api/v1/merchant/change-name',\n    CHANGE_TIP: '/qrpay/api/v1/merchant/change-tip',\n    CHANGE_VAT: '/qrpay/api/v1/merchant/change-vat'\n  },\n  MEMBER: {},\n  QR_KIT: {}\n};\nconst QRPAY_CODE = {\n  RE_ATHENTICATE: {\n    ok: false,\n    status: 401,\n    code: 'EQ401',\n    message: 'Authentication Required.'\n  },\n  FETCH_ERROR: {\n    ok: false,\n    status: 999,\n    code: 'EQ999',\n    message: 'Fetch Promise Rejected(Network error, CORS, etc.)'\n  },\n  API_ERROR: {\n    ok: false,\n    status: 500,\n    code: 'EQ500',\n    message: 'application error'\n  }\n};\n\n// ─── SDK 팩토리 ────────────────────────────────────────────────────────────\n\nconst QRPAY_SDK = () => {\n  const context = (0,_context__WEBPACK_IMPORTED_MODULE_0__[\"default\"])();\n  const qrpay_storage = (0,_qrpay_storage__WEBPACK_IMPORTED_MODULE_1__[\"default\"])();\n  const {\n    loggable\n  } = context;\n\n  // ─── 인증 ────────────────────────────────────────────────────────────────\n\n  const authenticate = async function (username, password, keypadRefId) {\n    let {\n      deviceId,\n      deviceType,\n      modelName,\n      osName,\n      appVersion,\n      pushToken\n    } = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};\n    const data = await fetchPostAsync(AUTH_APIS.AUTH_LOGIN, {\n      loginId: username,\n      password: password,\n      keypadRefId: keypadRefId,\n      deviceInfo: {\n        deviceId,\n        deviceType,\n        modelName,\n        osName,\n        appVersion,\n        pushToken\n      }\n    });\n    if (loggable) {\n      console.log('Authentication data:', data);\n    }\n    if (data.ok) {\n      const {\n        accessToken,\n        accessTokenExpiresIn,\n        refreshToken\n      } = data;\n      qrpay_storage.save('accessToken', accessToken);\n      qrpay_storage.save('accessTokenExpiresIn', accessTokenExpiresIn);\n      qrpay_storage.save('refreshToken', refreshToken);\n    }\n    return data;\n  };\n  const refresh = async () => {\n    const refreshToken = qrpay_storage.find('refreshToken');\n    if (!refreshToken) {\n      return {\n        ok: false,\n        status: 401,\n        error: 'No refresh token available'\n      };\n    }\n    const data = await fetchPostAsync(AUTH_APIS.AUTH_REFRESH, {\n      refreshToken: refreshToken\n    });\n    if (loggable) {\n      console.log('Refresh data:', data);\n    }\n    if (data.ok) {\n      const {\n        accessToken,\n        accessTokenExpiresIn\n      } = data;\n      qrpay_storage.save('accessToken', accessToken);\n      qrpay_storage.save('accessTokenExpiresIn', accessTokenExpiresIn);\n    }\n    return data;\n  };\n  const logout = async () => {\n    const refreshToken = qrpay_storage.find('refreshToken');\n    if (!refreshToken) {\n      return {\n        ok: false,\n        error: 'No refresh token available'\n      };\n    }\n    const data = await fetchPostAsync(AUTH_APIS.AUTH_LOGOUT, {\n      refreshToken: refreshToken\n    });\n    if (!data.ok) {\n      console.error('Logout failed:', data);\n    }\n    qrpay_storage.remove('accessToken');\n    qrpay_storage.remove('accessTokenExpiresIn');\n    qrpay_storage.remove('refreshToken');\n    return {\n      ok: true\n    };\n  };\n  const getAccessToken = () => ({\n    accessToken: qrpay_storage.find('accessToken'),\n    accessTokenExpiresIn: qrpay_storage.find('accessTokenExpiresIn')\n  });\n  const getRefreshToken = () => qrpay_storage.find('refreshToken');\n  const verifyAccessToken = () => {\n    const {\n      accessToken,\n      accessTokenExpiresIn\n    } = getAccessToken();\n    if (!accessToken) return false;\n    if (Date.now() >= accessTokenExpiresIn) return false;\n    return true;\n  };\n\n  // ─── HTTP 헬퍼 ───────────────────────────────────────────────────────────\n\n  async function _fetch(method, url, data) {\n    let accessToken = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : getAccessToken().accessToken;\n    const authHeader = accessToken ? {\n      Authorization: `Bearer ${accessToken}`\n    } : {};\n    try {\n      const response = await fetch(url, {\n        method,\n        credentials: 'include',\n        headers: {\n          'Content-Type': 'application/json',\n          ...authHeader\n        },\n        ...(data !== undefined && {\n          body: JSON.stringify(data)\n        })\n      });\n      if (response.ok) {\n        const json = await response.json().catch(() => ({}));\n        return {\n          ok: true,\n          ...json\n        };\n      }\n      const errorBody = await response.json().catch(() => ({}));\n      console.error('Http status:', response.status, response.statusText);\n      console.error('Error body:', errorBody);\n      return {\n        ok: false,\n        status: response.status,\n        statusText: response.statusText,\n        error: errorBody\n      };\n    } catch (error) {\n      console.error('Fetch error:', error);\n      return {\n        ok: false,\n        ...QRPAY_CODE.FETCH_ERROR,\n        error\n      };\n    }\n  }\n  const fetchPostAsync = (url, data, accessToken) => _fetch('POST', url, data, accessToken);\n  const fetchGetAsync = (url, accessToken) => _fetch('GET', url, undefined, accessToken);\n  function fetchPostPromise(url, data) {\n    let accessToken = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;\n    if (accessToken === undefined) accessToken = getAccessToken().accessToken;\n    const authHeader = accessToken ? {\n      Authorization: `Bearer ${accessToken}`\n    } : {};\n    return fetch(url, {\n      method: 'POST',\n      credentials: 'include',\n      headers: {\n        'Content-Type': 'application/json',\n        ...authHeader\n      },\n      body: JSON.stringify(data)\n    }).catch(error => {\n      console.error('Fetch error:', error);\n      return Promise.reject({\n        ...QRPAY_CODE.FETCH_ERROR,\n        error\n      });\n    });\n  }\n  function fetchGetPromise(url) {\n    let accessToken = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;\n    if (accessToken === undefined) accessToken = getAccessToken().accessToken;\n    const authHeader = accessToken ? {\n      Authorization: `Bearer ${accessToken}`\n    } : {};\n    return fetch(url, {\n      method: 'GET',\n      credentials: 'include',\n      headers: {\n        'Content-Type': 'application/json',\n        ...authHeader\n      }\n    }).catch(error => {\n      console.error('Fetch error:', error);\n      return Promise.reject({\n        ...QRPAY_CODE.FETCH_ERROR,\n        error\n      });\n    });\n  }\n\n  // ─── Public API ──────────────────────────────────────────────────────────\n\n  return {\n    getAccessToken,\n    getRefreshToken,\n    verifyAccessToken,\n    authenticate,\n    refresh,\n    logout,\n    fetchPostAsync,\n    fetchGetAsync,\n    fetchPostPromise,\n    fetchGetPromise,\n    QRPAY_CODE,\n    AUTH_APIS,\n    PAGES_APIS,\n    REST_APIS\n  };\n};\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (QRPAY_SDK);\n\n//# sourceURL=webpack://qrpay_js_sdk/./src/qrpay_sdk.js?");

				/***/ }),

			/***/ "./src/qrpay_storage.js":
			/*!******************************!*\
              !*** ./src/qrpay_storage.js ***!
              \******************************/
			/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

				eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\nconst QRPAY_STORAGE = () => {\n  const STORAGE_KEY_PREFIX = 'QRPAY_'; // 키 충돌방지 prefix\n  const createKey = key => `${STORAGE_KEY_PREFIX}${key}`;\n  const save = (key, value) => {\n    const skey = createKey(key);\n    try {\n      localStorage.setItem(skey, JSON.stringify(value));\n      return true;\n    } catch (e) {\n      console.error('Error saving to localStorage', e);\n    }\n    return false;\n  };\n  const find = key => {\n    const skey = createKey(key);\n    try {\n      const item = localStorage.getItem(skey);\n      return item ? JSON.parse(item) : null;\n    } catch (e) {\n      console.error('Error reading from localStorage', e);\n    }\n    return null;\n  };\n  const remove = key => {\n    const skey = createKey(key);\n    try {\n      localStorage.removeItem(skey);\n      return true;\n    } catch (e) {\n      console.error('Error removing from localStorage', e);\n    }\n    return false;\n  };\n  const clearAll = () => {\n    try {\n      localStorage.clear();\n      // Object.keys(localStorage).forEach((key) => {\n      //   if (key.startsWith(STORAGE_KEY_PREFIX)) {\n      //     localStorage.removeItem(key);\n      //   }\n      // });\n      return true;\n    } catch (e) {\n      console.error('Error clearing localStorage', e);\n    }\n    return false;\n  };\n  const publicAPI = {\n    save: save,\n    find: find,\n    remove: remove,\n    clearAll: clearAll\n  };\n  return publicAPI;\n};\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (QRPAY_STORAGE);\n\n//# sourceURL=webpack://qrpay_js_sdk/./src/qrpay_storage.js?");

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
		/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
		/******/
		/******/ 	return __webpack_exports__;
		/******/ })()
		;
});