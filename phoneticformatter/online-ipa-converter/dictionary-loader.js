/**
 * Dictionary loader with IndexedDB cache.
 * Expects prebuilt word→IPA[] JSON from scripts/build-ipa-dict.py
 */
(function (global) {
  "use strict";

  var DB_NAME = "pf-ipa-dict";
  var DB_VERSION = 1;
  var STORE = "meta";
  var CACHE_KEY = "ipa-dict-v1";
  var DEFAULT_URL = "../data/ipa-dict.json";

  function openDb() {
    return new Promise(function (resolve, reject) {
      if (!global.indexedDB) {
        resolve(null);
        return;
      }
      var req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = function () {
        var db = req.result;
        if (!db.objectStoreNames.contains(STORE)) {
          db.createObjectStore(STORE);
        }
      };
      req.onsuccess = function () {
        resolve(req.result);
      };
      req.onerror = function () {
        resolve(null);
      };
    });
  }

  function idbGet(db, key) {
    return new Promise(function (resolve) {
      if (!db) {
        resolve(null);
        return;
      }
      try {
        var tx = db.transaction(STORE, "readonly");
        var req = tx.objectStore(STORE).get(key);
        req.onsuccess = function () {
          resolve(req.result || null);
        };
        req.onerror = function () {
          resolve(null);
        };
      } catch (e) {
        resolve(null);
      }
    });
  }

  function idbSet(db, key, value) {
    return new Promise(function (resolve) {
      if (!db) {
        resolve(false);
        return;
      }
      try {
        var tx = db.transaction(STORE, "readwrite");
        tx.objectStore(STORE).put(value, key);
        tx.oncomplete = function () {
          resolve(true);
        };
        tx.onerror = function () {
          resolve(false);
        };
      } catch (e) {
        resolve(false);
      }
    });
  }

  /**
   * @returns {Promise<Map<string, string[]>>}
   */
  function loadDictionary(url) {
    var dictUrl = url || DEFAULT_URL;
    return openDb().then(function (db) {
      return idbGet(db, CACHE_KEY).then(function (cached) {
        if (cached && typeof cached === "object") {
          return objectToMap(cached);
        }
        return fetch(dictUrl, { credentials: "same-origin" })
          .then(function (res) {
            if (!res.ok) throw new Error("Failed to load dictionary (" + res.status + ")");
            return res.json();
          })
          .then(function (obj) {
            idbSet(db, CACHE_KEY, obj);
            return objectToMap(obj);
          });
      });
    });
  }

  function objectToMap(obj) {
    var map = new Map();
    var keys = Object.keys(obj);
    for (var i = 0; i < keys.length; i++) {
      map.set(keys[i], obj[keys[i]]);
    }
    return map;
  }

  global.PhoneticDictionaryLoader = {
    load: loadDictionary,
    DEFAULT_URL: DEFAULT_URL,
  };
})(typeof window !== "undefined" ? window : self);
