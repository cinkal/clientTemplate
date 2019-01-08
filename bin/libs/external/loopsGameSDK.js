'use strict';

var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
};

/**
 * Created by xiaoconglau on 02/10/2017.
 */
/**
 *
 **/

(function () {

  console.log('init sdk.');
  var SDKConfig = {
    MODE: {
      PUBLISH: 0,
      DEVELOP: 1
    },
    CONNECT_MODE: {
      VIDEO_PATH: 0,
      DIRECTLY: 1
    },
    PUBLISH_MODE: {
      LIVE: 0,
      LOBBY: 1
    },
    LOCALSTORAGE_SESSION_DATA_KEY: 'SDK_LOCALSTORAGE_SESSION_DATA_KEY',
    LOCALSTORAGE_ROUND_ID_KEY: 'SDK_LOCALSTORAGE_ROUND_ID_KEY',
    VERSION: '1.0',
    BROADCAST_TIME_INTERVAL: 4 * 1000,
    GLOBE_HOST_MESSAGE_CALLBACK_KEY: 'SDK_GLOBE_HOST_MESSAGE_CALLBACK_KEY',
    GLOBE_WATCHER_MESSAGE_CALLBACK_KEY: 'SDK_GLOBE_WATCHER_MESSAGE_CALLBACK_KEY',
    GLOBE_MODE_KEY: 'SDK_GLOBE_MODE_KEY',
    GLOBE_DEBUG_LOG_TO_DI_KEY: 'SDK_GLOBE_DEBUG_LOG_TO_DI_KEY',
    DI: {
      REQUEST_TYPE: 0,
      RESPONSE_TYPE: 1
    }
  };

  var DevProxy = function () {
    // let server_host = "https://apiloopstest.shabikplus.mozat.com";
    var server_host = 'http://192.168.50.15:3000/';
    var server_sig = '&sig=bf6b13bd37ec4173b7b075dc92bf989a';
    // let server_host = "http://192.168.128.62:2080";
    // POST
    var api_get_user = '/profile/bulk_query';
    var api_get_game_list = '/game-platform/get-game-app-info';
    var api_get_broadcast_session = '/broadcast/session';
    var api_request_new_round = '/game/round/prepare';
    var api_start_new_round = '/game/round/start';
    var api_submit_result = '/game/round/end';
    var api_request_join_round = '/game/round/join';
    var api_send_in_game_data = '/game/game_msg/send';
    var api_game_broadcast = '/game/game_msg/broadcast';
    var api_extend = '/game/game_msg/extend';
    var api_call_platform_api = '/game-platform/game-sdk';
    var api_get_owner_profile = '/profile/show';
    var sessionDatas = void 0;
    if (localStorage && localStorage.getItem(SDKConfig.LOCALSTORAGE_SESSION_DATA_KEY)) {
      sessionDatas = JSON.parse(localStorage.getItem(SDKConfig.LOCALSTORAGE_SESSION_DATA_KEY));
    } else {
      sessionDatas = { version: SDKConfig.VERSION };
    }

    var session_suffix = 'game-session-368-';
    var webSocket = void 0;

    /**
     * \u83B7\u53D6\u4E00\u4E2A\u4F1A\u8BDD\u6570\u636E\u3002
     * @param key \u662F\u4E00\u4E2A\u5B57\u7B26\u4E32
     */
    function getSessionDataImpl(key) {
      return sessionDatas[key];
    }

    function getSessionDatasImpl() {
      return sessionDatas;
    }

    /**
     * \u5411PK App \u6C47\u62A5\u5F53\u524D\u5DF2\u7ECF\u6E38\u620F\u52A0\u8F7D\u597D\u4E86
     */
    function reportGameReadyImpl(gameId) {}
    // window.PKJSBridge.call('reportGameReady', { "game_id": gameId });


    /**
     * report to game that (server says) there's insufficient deposit on this user's account.
     * @param data is not in used yet, pass a {} is ok.
     */
    function reportInsufficientDepositImpl(data) {
      // window.PKJSBridge.call('reportInsufficientDeposit', data);
      alert('Client pop up top up dialog.');
    }

    /**
     * \u5411App \u6C47\u62A5\u5F53\u524D\u6E38\u620F\u72B6\u6001\u3002
     * \u6CE8\u610F \u5982\u679C\u5F53\u524D\u5C1A\u672A\u51C6\u5907\u597D\uFF08requestNewRound \u6CA1\u6709\u5F97\u5230\u6210\u529F\u7684\u8FD4\u56DE\uFF09\uFF0C\u9664 STATE_IDLE \u4E4B\u5916\u7684\u4EFB\u4F55\u72B6\u6001\u4FE1\u606F\u90FD\u4E0D\u4F1A\u88AB\u4F20\u9012\u3002
     */
    function reportGameStateImpl(stateId, stateData, stateTtl) {
      // window.PKJSBridge.call('reportState', { "state_id": stateId, "state_data": stateData, "state_ttl": stateTtl });
      if (window.broadcastTimeInterval) {
        clearInterval(window.broadcastTimeInterval);
      }
      window.broadcastTimeInterval = setInterval(function () {
        var url = server_host + api_game_broadcast + '?uid=' + getSessionDataImpl('user_id') + server_sig;

        var requestData = genCommonRequestData();
        requestData.round_id = localStorage.getItem(SDKConfig.LOCALSTORAGE_ROUND_ID_KEY);
        stateData.state_id = stateId;
        stateData.round_id = localStorage.getItem(SDKConfig.LOCALSTORAGE_ROUND_ID_KEY);
        requestData.game_data = JSON.stringify(stateData);
        // console.log(JSON.stringify(requestData));
        fetch(url, {
          method: 'post',
          headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestData)
        }).then(function (response) {
          return response.status == 200;
        }).then(function (success) {
          console.log('broadcast success');
        }).catch(function (err) {
          console.log('broadcast fail');
          console.log(err);
        });
      }, SDKConfig.BROADCAST_TIME_INTERVAL);
    }

    /**
     * \u6CE8\u518C\u6E38\u620F\u72B6\u6001\u66F4\u65B0
     * @param {Function} stateCallback(stateObj) stateObj \u7ED3\u6784\u4E3A { "state_id":0, "state_data":{...} }
     */
    function registerGameStateChangedImpl(stateCallback) {
      // window.PKJSBridge.on('setState', stateCallback);
      window[SDKConfig.GLOBE_WATCHER_MESSAGE_CALLBACK_KEY] = {};
      window[SDKConfig.GLOBE_WATCHER_MESSAGE_CALLBACK_KEY].latestMessage = '';
      window[SDKConfig.GLOBE_WATCHER_MESSAGE_CALLBACK_KEY].callback = stateCallback;
    }

    /**
     * \u6279\u91CF\u83B7\u53D6\u7528\u6237\u4FE1\u606F
     * @param userIds \u7ED3\u6784\u4E3A { "user_ids": [100001, 200003, 123456] }
     * @param {Function} getUsersCallback(users) users \u7ED3\u6784\u662F {"users":[ {...}, {...}, ... ]}, \u5305\u542B\u6240\u8BF7\u6C42\u7684\u6240\u6709\u7528\u6237\u4FE1\u606F\uFF08\u53EA\u8981\u662F\u5BA2\u6237\u7AEF\u80FD\u53D6\u5230\u4E14\u5141\u8BB8\u7684\uFF09\u3002\u4E0D\u4FDD\u8BC1users \u91CC\u7684\u987A\u5E8F\u548CuserIds \u7684\u987A\u5E8F\u76F8\u540C\u3002
     */
    function getUsersImpl(userIds, getUsersCallback) {
      var url = server_host + api_get_user + '?uid=' + getSessionDataImpl('user_id') + server_sig;
      var _userIds = userIds;
      if (userIds.user_ids) {
        _userIds = userIds.user_ids;
      }
      fetch(url, {
        method: 'post',
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          uid: 100001,
          user_ids: _userIds
        })
      }).then(function (response) {
        return response.json();
      }).then(function (data) {
        var gameData = genGameData(data);
        getUsersCallback(gameData);
      }).catch(function () {
        console.log('user profile error');
      });
    }

    /**
     * For HOST only.
     * @param data is the data to be sent, it should contain settings.
     * @param {Function} respCallback(respData) will be invoked when server responses.
     */
    function requestNewRoundImpl(data, respCallback) {
      // window.PKJSBridge.invoke('requestNewRound', data, respCallback);
      var url = server_host + api_request_new_round + '?uid=' + getSessionDataImpl('user_id') + server_sig;
      var requestData = genCommonRequestData();
      requestData.setting = data;
      console.log(requestData);
      fetch(url, {
        method: 'post',
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      }).then(function (response) {
        return response.json();
      }).then(function (data) {
        var gameData = genGameData(data);
        localStorage.setItem(SDKConfig.LOCALSTORAGE_ROUND_ID_KEY, gameData.data.round_id);
        console.log('requestNewRound');
        console.log(gameData);
        respCallback(gameData);
      }).catch(function (err) {
        console.log('requestNewRound error');
        console.log(err);
      });
    }

    function genGameData(apiData) {
      var gameData = {};
      gameData.code = 200;
      if (apiData instanceof Array) {
        gameData.array = apiData;
      } else if ((typeof apiData === 'undefined' ? 'undefined' : _typeof(apiData)) === 'object') {
        gameData.data = apiData;
      } else {
        gameData.data = JSON.parse(apiData);
      }
      return gameData;
    }

    function genCommonRequestData() {
      var ret = {};
      ret.game_id = sessionDatas.game_id;
      ret.host_id = sessionDatas.host_id;
      ret.session_id = sessionDatas.session_id;
      ret.round_id = localStorage.getItem(SDKConfig.LOCALSTORAGE_ROUND_ID_KEY);
      return ret;
    }

    /**
     * For HOST only.
     * @param data is the data to be sent
     * @param {Function} respCallback(respData) will be invoked when server responses.
     */
    function requestRoundStartImpl(data, respCallback) {
      // window.PKJSBridge.invoke('requestStartARound', data, respCallback);
      var url = server_host + api_start_new_round + '?uid=' + getSessionDataImpl('user_id') + server_sig;
      var requestData = genCommonRequestData();
      requestData.game_data = JSON.stringify(data);
      console.log(requestData);
      fetch(url, {
        method: 'post',
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      }).then(function (response) {
        return response.json();
      }).then(function (data) {
        var gameData = genGameData(data);
        console.log('requestRoundStart');
        console.log(gameData);
        respCallback(gameData);
      }).catch(function (err) {
        console.log('requestRoundStart error');
        console.log(err);
      });
    }

    /**
     * For HOST only.
     * @param data is the data to be sent, it should contain bonus, etc
     * @param {Function} respCallback(respData) will be invoked when server responses.
     */
    function submitRoundResultImpl(data, respCallback) {
      // window.PKJSBridge.invoke('submitRoundResult', data, respCallback);
      var url = server_host + api_submit_result + '?uid=' + getSessionDataImpl('user_id') + server_sig;
      var requestData = genCommonRequestData();
      requestData.game_data = JSON.stringify(data);
      console.log(requestData);
      fetch(url, {
        method: 'post',
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      }).then(function (response) {
        return response.json();
      }).then(function (data) {
        var gameData = genGameData(data);
        console.log('submitRoundResult');
        console.log(gameData);
        respCallback(gameData);
      }).catch(function (err) {
        console.log('submitRoundResult error');
        console.log(err);
      });
    }

    /**
     * For NON-HOST only.
     * @param data is the data to be sent.
     * @param {Function} respCallback(respData) will be invoked when server responses.
     */
    function requestJoinARoundImpl(data, respCallback) {
      // window.PKJSBridge.invoke('requestJoinARound', data, respCallback);
      var url = server_host + api_request_join_round + '?uid=' + getSessionDataImpl('user_id') + server_sig;
      var requestData = genCommonRequestData();
      requestData.user_id = sessionDatas.user_id;
      console.log('join data:' + JSON.stringify(requestData));
      fetch(url, {
        method: 'post',
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      }).then(function (response) {
        return response.json();
      }).then(function (data) {
        var gameData = genGameData(data);
        localStorage.setItem(SDKConfig.LOCALSTORAGE_ROUND_ID_KEY, gameData.data.round_id);
        console.log('requestJoinARound');
        console.log(gameData);
        respCallback(gameData);
      }).catch(function (err) {
        console.log('requestJoinARound error');
        respCallback(err);
      });
    }

    /**
     * Available for all.
     * @param data is the data to be sent.
     * @param {Function} respCallback(respData) will be invoked when server responses.
     */
    function requestExtendImpl(data, respCallback) {
      // window.PKJSBridge.invoke('requestExtend', data, respCallback);
      var url = server_host + api_extend + '?uid=' + getSessionDataImpl('user_id') + server_sig;
      var requestData = genCommonRequestData();
      requestData.user_id = sessionDatas.user_id;
      requestData.game_data = JSON.stringify(data);
      console.log(requestData);
      fetch(url, {
        method: 'post',
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      }).then(function (response) {
        return response.json();
      }).then(function (data) {
        var gameData = genGameData(data);
        console.log('requestExtend');
        console.log(gameData);
        respCallback(gameData);
      }).catch(function (err) {
        console.log('requestExtend error');
        console.log(err);
      });
    }

    /**
     * Send the game's internal data to game-logic server.
     * @param data is the data to be sent.
     * @param {Function} respCallback(respData) will be invoked when server responses.
     */
    function requestSendInGameDataImpl(data, respCallback) {
      // window.PKJSBridge.invoke('requestSendInGameData', data, respCallback);
      var url = server_host + api_send_in_game_data + '?uid=' + getSessionDataImpl('user_id') + server_sig;

      var requestData = genCommonRequestData();
      requestData.user_id = sessionDatas.user_id;
      requestData.game_data = JSON.stringify(data);
      console.log(requestData);
      fetch(url, {
        method: 'post',
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      }).then(function (response) {
        return response.json();
      }).then(function (data) {
        var gameData = genGameData(data);
        console.log('requestSendInGameData');
        console.log(gameData);
        respCallback(gameData);
      }).catch(function (err) {
        console.log('requestSendInGameData error');
        console.log(err);
      });
    }

    /**
     * display a toast.
     * @param text is the string to be displayed.
     */
    function toastImpl(text) {
      alert(text);
    }

    /**
     * Register a callback to handle incoming p2p message.
     * @param {Function} onP2pCallback(msgObj) , msgObj structure is { 'from':INT, 'target':INT, 'action':INT, 'msg_data':JSON }, \u76EE\u524Daction \u503C\u6709\u4E24\u4E2A\uFF1AP2PMESSAGE(100),JOIN(101)\u3002
     */
    function registerOnP2pMsgImpl(onP2pCallback) {
      // window.PKJSBridge.on('p2pMsg', onP2pCallback);
      window[SDKConfig.GLOBE_HOST_MESSAGE_CALLBACK_KEY] = {};
      window[SDKConfig.GLOBE_HOST_MESSAGE_CALLBACK_KEY].latestMessage = '';
      window[SDKConfig.GLOBE_HOST_MESSAGE_CALLBACK_KEY].callback = onP2pCallback;
    }

    /**
     * \u4E3Bapp \u8DF3\u8F6C\u5230\u6307\u5B9A\u9875\u9762\u3002
     * @param url \u4E3A\u8981\u8DF3\u8F6C\u5230\u7684url\u3002
     * @param closeThis \u4E3A\u4E00\u4E2Aint \u503C\uFF0C\u9ED8\u8BA4\u4E3A0\uFF0C\u975E0\u5219\u8868\u793A\u8DF3\u8F6C\u540E\u5173\u95ED\u5F53\u524D\u9875\u9762\u3002
     */
    function openUrlImpl(url, closeThis) {
      // window.PKJSBridge.invoke('openUrl', { "url": url, "closeThis": closeThis });
    }

    function logToAppImpl(msg) {
      console.log(msg);
    }

    function mapWSDataToWatcher(data) {
      var ret = {};
      var gameData = JSON.parse(data.game_data);
      localStorage.setItem(SDKConfig.LOCALSTORAGE_ROUND_ID_KEY, gameData.round_id);
      ret.state_id = gameData.state_id;
      ret.state_data = gameData;
      return ret;
    }

    /**
     * \u65E5\u5FD7\u57CB\u70B9\u3002
     * @param data \u4E3A\u4E00\u4E2AJSON Object, \u91CC\u9762\u5305\u542B\u8981\u8BB0\u5F55\u7684\u5185\u5BB9\u3002
     */
    function logToStatisticsImpl(data) {
      // window.PKJSBridge.call('logToStatistics', data);
      console.log('LOG:' + JSON.stringify(data));
    }

    /**
     * \u8BF7\u6C42\u5173\u95ED\u5E76\u91CA\u653E\u5F53\u524DwebView\u3002
     * @param txt \u662F\u4E00\u4E2A\u5B57\u7B26\u4E32\uFF0C\u4F9B\u5BA2\u6237\u7AEF\u5728\u5173\u95EDwebview \u65F6\u5F39\u51FAtoast\u3002
     */
    function closeWithMsgImpl(txt) {}
    // window.PKJSBridge.call('closeWithMsg', { 'text': txt });


    /**
     * \u8BF7\u6C42\u64AD\u653E\u4E00\u6761\u58F0\u97F3\uFF0C\u5E76\u6307\u5B9A\u5FAA\u73AF\u6B21\u6570\u3002
     * @param path \u4E3A\u58F0\u97F3\u5B8C\u6574\u8DEF\u5F84\uFF0C\u65E0\u987B\u540E\u7F00\u540D\u3002\u5982\uFF1A/media/bgm
     * @param \u5FAA\u73AF\u6B21\u6570\uFF0Crepeat=1 \u8868\u793A\u4E00\u5171\u64AD\u653E 2 \u904D\uFF0C0 \u8868\u793A\u4E0D\u91CD\u590D\uFF0C-1 \u8868\u793A\u65E0\u9650\u5FAA\u73AF\u91CD\u590D\u64AD\u653E\u3002
     * @param {Function} onPlayingCallback(playObj) \u662F\u4E00\u4E2A\u56DE\u8C03\uFF0CplayObj \u7ED3\u6784\u4E3A {'track_id':INT}, trackId \u53EF\u7528\u4E8E\u8C03\u7528 stopPlaying\u3002
     */
    function playSoundImpl(path, repeat, onPlayingCallback) {}
    // window.PKJSBridge.invoke('playSound', { 'sound_path': path, 'sound_repeat': repeat }, onPlayingCallback);


    /**
     * \u8BF7\u6C42\u505C\u6B62\u64AD\u653E\u4E00\u4E2A\u58F0\u97F3\u3002
     * @param soundTrackId \u4E3A\u4ECE playSound \u7684\u56DE\u8C03\u4E2D\u5F97\u5230\u7684 trackId\u3002
     */
    function stopPlayingImpl(soundTrackId) {}
    // window.PKJSBridge.call('stopPlaying', { 'track_id': soundTrackId });


    /**
     * \u901A\u7528\u63A5\u53E3\u3002\u5177\u4F53\u8BF7\u6C42\u770B\u8BF7\u6C42\u7684\u51FD\u6570\u540D\u3002
     * @param name \u4E3A\u8981\u8BF7\u6C42\u7684\u51FD\u6570\u540D\u3002
     * @param data \u4E3A\u5305\u542B\u8BF7\u6C42\u6570\u636E\u7684json object\uFF0C\u7ED3\u6784\u81EA\u7531\u5B9A\u4E49\u3002
     * @param {Function} callbackFunc(callbackData) \u662F\u4E00\u4E2A\u56DE\u8C03\uFF0CcallbackData \u7684\u7C7B\u578B\u548C\u7ED3\u6784\uFF0C\u6BCF\u4E2A\u8C03\u7528\u53EF\u4EE5\u81EA\u7531\u5B9A\u4E49\u3002
     */
    function callHostAppImpl(name, data, callbackFunc) {
      var appData = {
        name: name,
        data: data
      };
      alert('call app  - data :' + JSON.stringify(appData));
      // window.PKJSBridge.invoke('callHostApp', { 'name': name, 'data': data }, callbackFunc);
    }

    function callPlatformApiImpl(cmd, data, callbackFunc) {
      var url = server_host + api_call_platform_api + '?uid=' + getSessionDataImpl('user_id') + server_sig + '&cmd=' + cmd;
      var requestData = data;
      console.log(requestData);
      fetch(url, {
        method: 'post',
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      }).then(function (response) {
        return response.json();
      }).then(function (rdata) {
        console.log('callPlatformApiImpl');
        console.log(rdata);
        callbackFunc(rdata);
      }).catch(function (err) {
        console.log('callPlatformApiImpl error');
        console.log(err);
      });
    }

    function reportGameStartImpl() {
      console.log('call game start to client');
    }

    function reportGameEndImpl() {
      console.log('call game end to client');
    }

    // todo
    function broadcastToVideoChannelImpl(seq, ttl) {
      window.PKJSBridge.invoke('broadcastToVideoChannel', {
        ttl: ttl,
        seq: seq
      });
    }

    // todo
    function registerVideoChannelDataImpl(callbackFunc) {
      window.PKJSBridge.on('videoChannelData', callbackFunc);
    }

    function prepareDevelopEnvironmentImpl(callback) {
      console.log('prepareDevelopEnvironmentImpl');
      window[SDKConfig.GLOBE_HOST_MESSAGE_CALLBACK_KEY] = {};
      var gameId = 1;
      if (sessionDatas && sessionDatas.game_id) {
        gameId = sessionDatas.game_id;
      }
      sessionDatas = { version: SDKConfig.VERSION };

      var div = document.createElement('div');
      div.id = 'sdk_setting';
      div.style.backgroundColor = '#fff';
      div.style.position = 'absolute';
      div.style.zIndex = 9999;
      div.style.top = 0;
      div.style.bottom = 0;
      div.style.left = 0;
      div.style.right = 0;
      var hostId = 940816;
      var watcherId = 191250;
      div.innerHTML = '<div id="game_setting" style="position:fixed;top:0;left:0;right:0;bottom:0;background-color: #fff"> <div id="sdk_identify_select" style="margin: 0 auto;width: 70%;text-align: center;margin-top: 80px"> <input type="radio" name="sdk_identify" value="0" checked>host <input type="radio" name="sdk_identify" value="1">watcher </div> <div id="sdk_game_id_wap" style="margin: 0 auto;width: 70%;text-align: center;margin-top: 20px"> <span style="display:inline-block;width: 80px;text-align: right">game id:</span> <input type="text" name="sdk_game_id" id="sdk_game_id" width="100px" height="30px" value="' + gameId + '" style="padding:5px;height:30px;border: 1px solid #000"/> </div> <div id="sdk_host_id_wap" style="margin: 0 auto;width: 70%;text-align: center;margin-top: 20px"> <span style="display:inline-block;width: 80px;text-align: right">host id:</span> <input type="text" name="sdk_host_id" id="sdk_host_id" width="100px" height="30px" value="' + hostId + '" style="padding:5px;height:30px;border: 1px solid #000"/> </div> <div id="sdk_watcher_id_wap" style="display:none;margin: 0 auto;width: 70%;text-align: center;margin-top: 20px"> <span style="display:inline-block;width: 80px;text-align: right">watcher id:</span> <input type="text" name="sdk_watcher_id" value="' + watcherId + '" id="sdk_watcher_id" width="100px" height="30px" style="padding:5px;height:30px;border: 1px solid #000"/> </div> <div id="option_user_jd_wrap" style="margin: 0 auto;width: 70%;text-align: center;margin-top: 20px"> 964287 782475 721073 274688 969988 958924 </div> <div id="sdk_submit_wap" style="margin: 0 auto;width: 70%;text-align: center;margin-top: 20px"> <button id="sdk_submit" style="margin: 0 auto;margin-top: 20px;width: 50px;height: 30px;border: 1px solid #333;border-radius: 5px;background-color: #eee"> Start </button> </div> <div id="loading" style="display:none;position:absolute;top:0;left:0;right:0;bottom:0;background-color:rgba(255, 255, 255, 0.8)"> <img src="http://tradelinkiq.com/Images/ajax-spinner.gif" style="position:absolute;top:50%;left:50%;margin-left:-25px;margin-top:-25px;" width="50px" height="50px"/> </div> </div>';
      document.body.appendChild(div);

      var identifys = document.getElementsByName('sdk_identify');
      var hostIdWrap = document.getElementById('sdk_host_id_wap');
      var watcherIdWrap = document.getElementById('sdk_watcher_id_wap');
      var loading = document.getElementById('loading');
      // 0 host, 1 watcher
      var identifyValue = 0;

      var _loop = function _loop(i) {
        identifys[i].onclick = function () {
          var val = identifys[i].value;
          identifyValue = val;
          if (val === 0) {
            // host
            hostIdWrap.style.display = 'block';
            watcherIdWrap.style.display = 'none';
          } else {
            hostIdWrap.style.display = 'block';
            watcherIdWrap.style.display = 'block';
          }
        };
      };

      for (var i = 0; i < identifys.length; i++) {
        _loop(i);
      }
      document.getElementById('sdk_submit').onclick = function () {
        loading.style.display = 'block';
        var hostId = document.getElementById('sdk_host_id').value;
        var watcherId = document.getElementById('sdk_watcher_id').value;
        var gameId = parseInt(document.getElementById('sdk_game_id').value);
        console.log('hostId:' + hostId);
        console.log('watcherId:' + watcherId);
        console.log('gameId:' + gameId);
        console.log('identifyValue:' + identifyValue);
        var isHost = identifyValue === 0;
        sessionDatas.game_id = gameId;
        sessionDatas.app_id = gameId;
        sessionDatas.session_id = session_suffix + hostId;

        webSocket = new WebSocket('ws://websocket-test.loopslive.com:2048/ws?room=' + hostId);
        webSocket.onerror = function (err) {
          console.log('ws error:' + err);
        };
        webSocket.onmessage = function (data) {
          var wsData = data.data;
          // console.log(wsData);
          if (!sessionDatas.session_id && wsData.session_id) {
            sessionDatas.session_id = wsData.session_id;
            if (_isSessionDatasReady()) {
              localStorage.setItem(SDKConfig.LOCALSTORAGE_SESSION_DATA_KEY, JSON.stringify(sessionDatas));
              callback(true);
            }
          }
          if (isHost) {
            if (window[SDKConfig.GLOBE_HOST_MESSAGE_CALLBACK_KEY].callback && window[SDKConfig.GLOBE_HOST_MESSAGE_CALLBACK_KEY].latestMessage !== wsData) {
              var wsDataObj = JSON.parse(wsData);
              // todo move from and target logic to game side
              if (wsDataObj.msgType === 201) {
                wsDataObj.from = wsDataObj.user_id;
                wsDataObj.target = wsDataObj.host_id;
                if (wsDataObj.game_data) {
                  wsDataObj.msg_data = JSON.parse(wsDataObj.game_data);
                }
                wsData = JSON.stringify(wsDataObj);
              }
              window[SDKConfig.GLOBE_HOST_MESSAGE_CALLBACK_KEY].latestMessage = wsData;
              window[SDKConfig.GLOBE_HOST_MESSAGE_CALLBACK_KEY].callback(JSON.parse(wsData));
            }
          } else if (window[SDKConfig.GLOBE_WATCHER_MESSAGE_CALLBACK_KEY] && window[SDKConfig.GLOBE_WATCHER_MESSAGE_CALLBACK_KEY].callback && window[SDKConfig.GLOBE_WATCHER_MESSAGE_CALLBACK_KEY].latestMessage !== wsData) {
            if (JSON.parse(wsData).msgType !== 202) {
              // only handle broadcast message
              return;
            }
            window[SDKConfig.GLOBE_WATCHER_MESSAGE_CALLBACK_KEY].latestMessage = wsData;
            window[SDKConfig.GLOBE_WATCHER_MESSAGE_CALLBACK_KEY].callback(mapWSDataToWatcher(JSON.parse(wsData)));
          }
        };

        if (identifyValue == 0) {
          // host
          sessionDatas.host_id = parseInt(hostId);
          sessionDatas.user_id = parseInt(hostId);
          sessionDatas.uid = parseInt(hostId);
        } else {
          sessionDatas.host_id = parseInt(hostId);
          sessionDatas.user_id = parseInt(watcherId);
          sessionDatas.uid = parseInt(watcherId);
        }
        // fetch game setting
        var gameSettingUrl = server_host + api_get_game_list + '?uid=' + hostId + server_sig;
        // gameSettingUrl = "https://api.github.com/users/github";
        fetch(gameSettingUrl, {
          method: 'POST',
          headers: {
            Accept: 'application/json, text/javascript, */*; q=0.01',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
          },
          mode: 'cors',
          credentials: 'include',
          cache: 'default',
          body: JSON.stringify({
            host_id: 0,
            session_id: 'string'
          })
        }).then(function (response) {
          return response.json();
        }).then(function (data) {
          console.log('game setting');
          console.log(data);
          if (data && data.game_app_infos) {
            sessionDatas.game_settings = {};
            for (var i = 0; i < data.game_app_infos.length; i++) {
              var gameObj = data.game_app_infos[i];
              if (gameObj.id == gameId) {
                sessionDatas.game_version = gameObj.version;
                sessionDatas.version = gameObj.version;
                if (gameObj.settings) {
                  sessionDatas.game_settings = JSON.parse(gameObj.settings);
                } else {
                  sessionDatas.game_settings = {};
                }
              }
            }
          }
          if (_isSessionDatasReady()) {
            document.body.removeChild(document.getElementById('sdk_setting'));
            localStorage.setItem(SDKConfig.LOCALSTORAGE_SESSION_DATA_KEY, JSON.stringify(sessionDatas));
            callback(true);
          }
        }).catch(function (err) {
          console.log('game setting error');
        });
      };
    }

    function _isSessionDatasReady() {
      return sessionDatas && sessionDatas.user_id && sessionDatas.host_id && sessionDatas.game_id && sessionDatas.game_settings && sessionDatas.session_id;
    }

    function getOwnerBalanceImpl(callback) {
      var uid = getSessionDataImpl('user_id');
      var url = server_host + api_get_owner_profile + '?uid=' + uid + server_sig;
      // gameSettingUrl = "https://api.github.com/users/github";
      fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json, text/javascript, */*; q=0.01',
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        mode: 'cors',
        credentials: 'include',
        cache: 'default'
      }).then(function (response) {
        return response.json();
      }).then(function (data) {
        console.log('getOwnerBalanceImpl');
        console.log(data);
        var ret = {};
        ret.coins = data.coins;
        ret.diamonds = data.diamonds;
        callback(ret);
      }).catch(function (err) {
        console.log('game setting error');
      });
    }

    function registerHostCloseLiveStreamEventImpl(callbackFunc) {
      window.PKJSBridge.on('hostCloseLiveStream', callbackFunc);
    }

    function registerGameViewStateChangeEventImpl(callbackFunc) {
      window.PKJSBridge.on('gameViewStateChange', callbackFunc);
    }

    function registerUserCloseVideoEventImpl(callbackFunc) {
      window.PKJSBridge.on('userCloseVideo', callbackFunc);
    }

    function closeVideoImpl() {
      window.PKJSBridge.invoke('closeVideo', {});
    }

    return {
      prepareDevelopEnvironment: prepareDevelopEnvironmentImpl,

      /**
       * client api
       */
      getSessionData: getSessionDataImpl,
      openUrl: openUrlImpl,
      getSessionDatas: getSessionDatasImpl,
      reportGameReady: reportGameReadyImpl,
      reportInsufficientDeposit: reportInsufficientDepositImpl,
      toast: toastImpl,
      logToApp: logToAppImpl,
      logToStatistics: logToStatisticsImpl,
      closeWithMsg: closeWithMsgImpl,
      playSound: playSoundImpl,
      stopPlaying: stopPlayingImpl,
      callHostApp: callHostAppImpl,

      /**
       * platform api\uFF0Cinclude broadcast
       */
      getUsers: getUsersImpl,
      reportGameState: reportGameStateImpl,
      requestNewRound: requestNewRoundImpl,
      requestRoundStart: requestRoundStartImpl,
      submitRoundResult: submitRoundResultImpl,
      requestJoinARound: requestJoinARoundImpl,

      /**
       * socket listener
       */
      registerGameStateChanged: registerGameStateChangedImpl,
      registerOnP2pMsg: registerOnP2pMsgImpl,

      /**
       * game server
       */
      requestSendInGameData: requestSendInGameDataImpl,

      /**
       * extend
       */
      requestExtend: requestExtendImpl,

      callPlatformApi: callPlatformApiImpl,
      reportGameStart: reportGameStartImpl,
      reportGameEnd: reportGameEndImpl,
      broadcastToVideoChannel: broadcastToVideoChannelImpl,
      registerVideoChannelData: registerVideoChannelDataImpl,
      getOwnerBalance: getOwnerBalanceImpl,
      registerHostCloseLiveStreamEvent: registerHostCloseLiveStreamEventImpl,
      registerGameViewStateChange: registerGameViewStateChangeEventImpl,
      registerUserCloseVideoEvent: registerUserCloseVideoEventImpl,
      closeVideo: closeVideoImpl
    };
  }();

  var PublishProxy = function () {
    // constants
    var STATE_IDLE = 0;
    var STATE_PREPARING = STATE_IDLE + 1;
    var STATE_RESULT = 255;
    var SYSTEM_STATE_TTL = 10000; // 10 seconds
    // end of const

    var mHostId = 0;
    var mMyUserId = 0;

    /**
     * \u5F53API \u51C6\u5907\u597D\u540E\u6267\u884C\uFF0C\u4F7F\u7528\u65B9\u6CD5\uFF1A
     * PKApi.ready(function(Api){
     *     // \u53C2\u6570\u4E2D\u7684Api\uFF0C\u5373\u662FPKApi \u5BF9\u8C61
     * });
     * @param readyCallback
     */
    function onPKJsBridgeReady(readyCallback) {
      if (readyCallback && typeof readyCallback === 'function') {
        var Api = this;
        var pkReadyFunc = function pkReadyFunc() {
          mMyUserId = Api.getSessionData('user_id');
          mHostId = Api.getSessionData('host_id');

          readyCallback(Api);
        };
        if (typeof window.PKJSBridge === 'undefined') {
          if (document.addEventListener) {
            document.addEventListener('PKJSBridgeReady', pkReadyFunc, false);
          } else if (document.attachEvent) {
            document.attachEvent('PKJSBridgeReady', pkReadyFunc);
            document.attachEvent('onPKJSBridgeReady', pkReadyFunc);
          } else {
            console.error('====== unable to attachEvent ======');
          }
        } else {
          pkReadyFunc();
        }
      }
    }

    /**
     * \u6CE8\u518C\u4E00\u4E2A\u56DE\u8C03\uFF0C\u5F53PK \u6E38\u620F\u9875\u9762\u79BB\u5F00\u5C4F\u5E55\u7684\u65F6\u5019\u56DE\u8C03
     */
    function onPKJsSysPause(pauseCallback) {
      window.PKJSBridge.on('sys:onpause', pauseCallback);
    }

    /**
     * \u6CE8\u518C\u4E00\u4E2A\u56DE\u8C03\uFF0C\u5F53PK \u6E38\u620F\u9875\u9762\u91CD\u65B0\u56DE\u5230\u5C4F\u5E55\u7684\u65F6\u5019\u56DE\u8C03
     */
    function onPKJsSysResume(resumeCallback) {
      window.PKJSBridge.on('sys:onresume', resumeCallback);
    }

    /**
     * \u83B7\u53D6\u4E00\u4E2A\u4F1A\u8BDD\u6570\u636E\u3002
     * @param key \u662F\u4E00\u4E2A\u5B57\u7B26\u4E32
     */
    function getSessionDataImpl(key) {
      if (key === 'version') {
        return window.PKJSBridge.env('game_version') || window.PKJSBridge.env(key);
      } else if (key === 'app_id') {
        return window.PKJSBridge.env('app_id') || window.PKJSBridge.env(key);
      } else if (key === 'uid') {
        return window.PKJSBridge.env('uid') || window.PKJSBridge.env(key);
      }
      return window.PKJSBridge.env(key);
    }

    function getSessionDatasImpl() {
      var ret = window.PKJSBridge.session_datas();
      if (!ret.version) {
        ret.version = ret.game_version;
        ret.app_id = ret.game_id;
        ret.uid = ret.user_id;
      }
      return ret;
    }

    /**
     * \u5411PK App \u6C47\u62A5\u5F53\u524D\u5DF2\u7ECF\u6E38\u620F\u52A0\u8F7D\u597D\u4E86
     */
    function reportGameReadyImpl(gameId) {
      window.PKJSBridge.call('reportGameReady', { game_id: gameId });
    }

    /**
     * report to game that (server says) there's insufficient deposit on this user's account.
     * @param data is not in used yet, pass a {} is ok.
     */
    function reportInsufficientDepositImpl() {
      window.PKJSBridge.call('reportInsufficientDeposit', {});
    }

    /**
     * \u5411App \u6C47\u62A5\u5F53\u524D\u6E38\u620F\u72B6\u6001\u3002
     * \u6CE8\u610F \u5982\u679C\u5F53\u524D\u5C1A\u672A\u51C6\u5907\u597D\uFF08requestNewRound \u6CA1\u6709\u5F97\u5230\u6210\u529F\u7684\u8FD4\u56DE\uFF09\uFF0C\u9664 STATE_IDLE \u4E4B\u5916\u7684\u4EFB\u4F55\u72B6\u6001\u4FE1\u606F\u90FD\u4E0D\u4F1A\u88AB\u4F20\u9012\u3002
     */
    function reportGameStateImpl(stateId, stateData, stateTtl) {
      window.PKJSBridge.call('reportState', {
        state_id: stateId,
        state_data: stateData,
        state_ttl: stateTtl
      });
    }

    /**
     * \u6CE8\u518C\u6E38\u620F\u72B6\u6001\u66F4\u65B0
     * @param {Function} stateCallback(stateObj) stateObj \u7ED3\u6784\u4E3A { "state_id":0, "state_data":{...} }
     */
    function registerGameStateChangedImpl(stateCallback) {
      window.PKJSBridge.on('setState', stateCallback);
    }

    /**
     * \u6279\u91CF\u83B7\u53D6\u7528\u6237\u4FE1\u606F
     * @param userIds \u7ED3\u6784\u4E3A { "user_ids": [100001, 200003, 123456] }
     * @param {Function} getUsersCallback(users) \u5305\u542B\u6240\u8BF7\u6C42\u7684\u6240\u6709\u7528\u6237\u4FE1\u606F\uFF08\u53EA\u8981\u662F\u5BA2\u6237\u7AEF\u80FD\u53D6\u5230\u4E14\u5141\u8BB8\u7684\uFF09\u3002\u4E0D\u4FDD\u8BC1users \u91CC\u7684\u987A\u5E8F\u548CuserIds \u7684\u987A\u5E8F\u76F8\u540C\u3002
     */
    function getUsersImpl(userIds, getUsersCallback) {
      window.PKJSBridge.invoke('getUsers', userIds, getUsersCallback);
    }

    /**
     * For HOST only.
     * @param data is the data to be sent, it should contain settings.
     * @param {Function} respCallback(respData) will be invoked when server responses.
     */
    function requestNewRoundImpl(data, respCallback) {
      window.PKJSBridge.invoke('requestNewRound', data, respCallback);
    }

    /**
     * For HOST only.
     * @param data is the data to be sent
     * @param {Function} respCallback(respData) will be invoked when server responses.
     */
    function requestRoundStartImpl(data, respCallback) {
      window.PKJSBridge.invoke('requestStartARound', data, respCallback);
    }

    /**
     * For HOST only.
     * @param data is the data to be sent, it should contain bonus, etc
     * @param {Function} respCallback(respData) will be invoked when server responses.
     */
    function submitRoundResultImpl(data, respCallback) {
      window.PKJSBridge.invoke('submitRoundResult', data, respCallback);
    }

    /**
     * For NON-HOST only.
     * @param data is the data to be sent.
     * @param {Function} respCallback(respData) will be invoked when server responses.
     */
    function requestJoinARoundImpl(data, respCallback) {
      window.PKJSBridge.invoke('requestJoinARound', data, respCallback);
    }

    /**
     * Available for all.
     * @param data is the data to be sent.
     * @param {Function} respCallback(respData) will be invoked when server responses.
     */
    function requestExtendImpl(data, respCallback) {
      window.PKJSBridge.invoke('requestExtend', data, respCallback);
    }

    /**
     * Send the game's internal data to game-logic server.
     * @param data is the data to be sent.
     * @param {Function} respCallback(respData) will be invoked when server responses.
     */
    function requestSendInGameDataImpl(data, respCallback) {
      window.PKJSBridge.invoke('requestSendInGameData', data, respCallback);
    }

    /**
     * display a toast.
     * @param text is the string to be displayed.
     */
    function toastImpl(text) {
      window.PKJSBridge.call('toast', { text: text });
    }

    /**
     * Register a callback to handle incoming p2p message.
     * @param {Function} onP2pCallback(msgObj) , msgObj structure is { 'from':INT, 'target':INT, 'action':INT, 'msg_data':JSON }, \u76EE\u524Daction \u503C\u6709\u4E24\u4E2A\uFF1AP2PMESSAGE(100),JOIN(101)\u3002
     */
    function registerOnP2pMsgImpl(onP2pCallback) {
      window.PKJSBridge.on('p2pMsg', onP2pCallback);
    }

    /**
     * \u4E3Bapp \u8DF3\u8F6C\u5230\u6307\u5B9A\u9875\u9762\u3002
     * @param url \u4E3A\u8981\u8DF3\u8F6C\u5230\u7684url\u3002
     * @param closeThis \u4E3A\u4E00\u4E2Aint \u503C\uFF0C\u9ED8\u8BA4\u4E3A0\uFF0C\u975E0\u5219\u8868\u793A\u8DF3\u8F6C\u540E\u5173\u95ED\u5F53\u524D\u9875\u9762\u3002
     */
    function openUrlImpl(url, closeThis) {
      window.PKJSBridge.invoke('openUrl', {
        url: url,
        closeThis: closeThis
      });
    }

    function logToAppImpl(msg) {
      window.PKJSBridge.call('log', { msg: msg });
    }

    /**
     * \u65E5\u5FD7\u57CB\u70B9\u3002
     * @param data \u4E3A\u4E00\u4E2AJSON Object, \u91CC\u9762\u5305\u542B\u8981\u8BB0\u5F55\u7684\u5185\u5BB9\u3002
     */
    function logToStatisticsImpl(data) {
      window.PKJSBridge.call('logToStatistics', data);
    }

    /**
     * \u8BF7\u6C42\u5173\u95ED\u5E76\u91CA\u653E\u5F53\u524DwebView\u3002
     * @param txt \u662F\u4E00\u4E2A\u5B57\u7B26\u4E32\uFF0C\u4F9B\u5BA2\u6237\u7AEF\u5728\u5173\u95EDwebview \u65F6\u5F39\u51FAtoast\u3002
     */
    function closeWithMsgImpl(txt) {
      window.PKJSBridge.call('closeWithMsg', { text: txt });
    }

    /**
     * \u8BF7\u6C42\u64AD\u653E\u4E00\u6761\u58F0\u97F3\uFF0C\u5E76\u6307\u5B9A\u5FAA\u73AF\u6B21\u6570\u3002
     * @param path \u4E3A\u58F0\u97F3\u5B8C\u6574\u8DEF\u5F84\uFF0C\u65E0\u987B\u540E\u7F00\u540D\u3002\u5982\uFF1A/media/bgm
     * @param \u5FAA\u73AF\u6B21\u6570\uFF0Crepeat=1 \u8868\u793A\u4E00\u5171\u64AD\u653E 2 \u904D\uFF0C0 \u8868\u793A\u4E0D\u91CD\u590D\uFF0C-1 \u8868\u793A\u65E0\u9650\u5FAA\u73AF\u91CD\u590D\u64AD\u653E\u3002
     * @param {Function} onPlayingCallback(playObj) \u662F\u4E00\u4E2A\u56DE\u8C03\uFF0CplayObj \u7ED3\u6784\u4E3A {'track_id':INT}, trackId \u53EF\u7528\u4E8E\u8C03\u7528 stopPlaying\u3002
     */
    function playSoundImpl(path, repeat, onPlayingCallback) {
      window.PKJSBridge.invoke('playSound', {
        sound_path: path,
        sound_repeat: repeat
      }, onPlayingCallback);
    }

    /**
     * \u8BF7\u6C42\u505C\u6B62\u64AD\u653E\u4E00\u4E2A\u58F0\u97F3\u3002
     * @param soundTrackId \u4E3A\u4ECE playSound \u7684\u56DE\u8C03\u4E2D\u5F97\u5230\u7684 trackId\u3002
     */
    function stopPlayingImpl(soundTrackId) {
      window.PKJSBridge.call('stopPlaying', { track_id: soundTrackId });
    }

    /**
     * \u901A\u7528\u63A5\u53E3\u3002\u5177\u4F53\u8BF7\u6C42\u770B\u8BF7\u6C42\u7684\u51FD\u6570\u540D\u3002
     * @param name \u4E3A\u8981\u8BF7\u6C42\u7684\u51FD\u6570\u540D\u3002
     * @param data \u4E3A\u5305\u542B\u8BF7\u6C42\u6570\u636E\u7684json object\uFF0C\u7ED3\u6784\u81EA\u7531\u5B9A\u4E49\u3002
     * @param {Function} callbackFunc(callbackData) \u662F\u4E00\u4E2A\u56DE\u8C03\uFF0CcallbackData \u7684\u7C7B\u578B\u548C\u7ED3\u6784\uFF0C\u6BCF\u4E2A\u8C03\u7528\u53EF\u4EE5\u81EA\u7531\u5B9A\u4E49\u3002
     */
    function callHostAppImpl(name, data, callbackFunc) {
      window.PKJSBridge.invoke('callHostApp', {
        name: name,
        data: data
      }, callbackFunc);
    }

    function callPlatformApiImpl(cmd, data, callbackFunc) {
      window.PKJSBridge.invoke('callPlatformApi', {
        cmd: cmd,
        data: data
      }, callbackFunc);
    }

    function reportGameStartImpl() {
      window.PKJSBridge.invoke('reportGameStart', {});
    }

    function reportGameEndImpl() {
      window.PKJSBridge.invoke('reportGameEnd', {});
    }

    function broadcastToVideoChannelImpl(seq, ttl) {
      window.PKJSBridge.invoke('broadcastToVideoChannel', {
        ttl: ttl,
        seq: seq
      });
    }

    function registerVideoChannelDataImpl(callbackFunc) {
      window.PKJSBridge.on('videoChannelData', callbackFunc);
    }

    function getOwnerBalanceImpl(callback) {
      window.PKJSBridge.invoke('getOwnerBalance', {}, callback);
    }

    function registerHostCloseLiveStreamEventImpl(callbackFunc) {
      window.PKJSBridge.on('hostCloseLiveStream', callbackFunc);
    }

    function registerGameViewStateChangeEventImpl(callbackFunc) {
      window.PKJSBridge.on('gameViewStateChange', callbackFunc);
    }

    function registerUserCloseVideoEventImpl(callbackFunc) {
      window.PKJSBridge.on('userCloseVideo', callbackFunc);
    }

    function closeVideoImpl() {
      window.PKJSBridge.invoke('closeVideo', {});
    }

    return {
      version: '2.1',
      onReady: onPKJsBridgeReady,
      registerOnPause: onPKJsSysPause,
      registerOnResume: onPKJsSysResume,
      getSessionData: getSessionDataImpl,
      openUrl: openUrlImpl,
      getSessionDatas: getSessionDatasImpl,
      getUsers: getUsersImpl,
      reportGameReady: reportGameReadyImpl,
      reportInsufficientDeposit: reportInsufficientDepositImpl,

      reportGameState: reportGameStateImpl,
      registerGameStateChanged: registerGameStateChangedImpl,

      requestNewRound: requestNewRoundImpl,
      requestRoundStart: requestRoundStartImpl,
      submitRoundResult: submitRoundResultImpl,
      requestJoinARound: requestJoinARoundImpl,

      requestExtend: requestExtendImpl,
      requestSendInGameData: requestSendInGameDataImpl,

      registerOnP2pMsg: registerOnP2pMsgImpl,

      toast: toastImpl,
      logToApp: logToAppImpl,
      logToStatistics: logToStatisticsImpl,
      closeWithMsg: closeWithMsgImpl,
      playSound: playSoundImpl,
      stopPlaying: stopPlayingImpl,
      callHostApp: callHostAppImpl,

      /**
       * 2.0 API
       */
      callPlatformApi: callPlatformApiImpl,
      reportGameStart: reportGameStartImpl,
      reportGameEnd: reportGameEndImpl,
      broadcastToVideoChannel: broadcastToVideoChannelImpl,
      registerVideoChannelData: registerVideoChannelDataImpl,
      getOwnerBalance: getOwnerBalanceImpl,
      registerHostCloseLiveStreamEvent: registerHostCloseLiveStreamEventImpl,
      registerGameViewStateChangeEvent: registerGameViewStateChangeEventImpl,
      registerUserCloseVideoEvent: registerUserCloseVideoEventImpl,
      closeVideo: closeVideoImpl
    };
  }();

  var PkApi = function () {
    var mHostId = 0;
    var mMyUserId = 0;
    var diLogId = 100077;
    var enableDebugToDILog = function () {
      if (window[SDKConfig.GLOBE_DEBUG_LOG_TO_DI_KEY]) {
        return true;
      }
      return false;
    }();

    /**
     * 1 \u4EE3\u8868\u53D1\u5E03\u6A21\u5F0F, 0 \u4EE3\u8868\u5F00\u53D1\u6A21\u5F0F
     * @type {number}
     */
    var mDevelopMode = 0;
    /**
     * 0 \u89C6\u9891\u6D41\u4F20\u9001\u8FDE\u63A5\u6A21\u5F0F\uFF0C1 \u76F4\u8FDE\u6A21\u5F0F
     * @type {number}
     */
    var mConnectMode = 0;
    var proxy = function () {
      if (window[SDKConfig.GLOBE_MODE_KEY] && window[SDKConfig.GLOBE_MODE_KEY] == SDKConfig.MODE.DEVELOP) {
        return DevProxy;
      }
      return PublishProxy;
    }();

    function initImpl(initObject) {
      mDevelopMode = initObject.developMode;
      mConnectMode = initObject.connectMode;
      window[SDKConfig.GLOBE_DEBUG_LOG_TO_DI_KEY] = initObject.enableDebugToDILog;
      enableDebugToDILog = initObject.enableDebugToDILog;
      window[SDKConfig.GLOBE_MODE_KEY] = initObject.developMode;
      if (initObject.developMode == SDKConfig.MODE.DEVELOP) {
        proxy = DevProxy;
      } else {
        proxy = PublishProxy;
      }
    }

    /**
     * \u5F53API \u51C6\u5907\u597D\u540E\u6267\u884C\uFF0C\u4F7F\u7528\u65B9\u6CD5\uFF1A
     * PKApi.ready(function(Api){
     *     // \u53C2\u6570\u4E2D\u7684Api\uFF0C\u5373\u662FPKApi \u5BF9\u8C61
     * });
     * @param readyCallback
     */
    function onPKJsBridgeReady(readyCallback) {
      var _this = this;

      console.log('sdk connect model:' + mConnectMode + ', develop model:' + mDevelopMode);
      if (mDevelopMode == SDKConfig.MODE.DEVELOP) {
        proxy.prepareDevelopEnvironment(function (success) {
          if (success) {
            readyCallback(_this);
          }
        });
        return;
      }
      if (readyCallback && typeof readyCallback === 'function') {
        var Api = this;
        var pkReadyFunc = function pkReadyFunc() {
          mMyUserId = Api.getSessionData('user_id');
          mHostId = Api.getSessionData('host_id');
          proxy.reportGameReady(Api.getSessionData('game_id'));
          readyCallback(Api);
        };

        if (typeof window.PKJSBridge === 'undefined') {
          if (document.addEventListener) {
            document.addEventListener('PKJSBridgeReady', pkReadyFunc, false);
          } else if (document.attachEvent) {
            document.attachEvent('PKJSBridgeReady', pkReadyFunc);
            document.attachEvent('onPKJSBridgeReady', pkReadyFunc);
          } else {
            console.error('====== unable to attachEvent ======');
          }
        } else {
          pkReadyFunc();
        }
      }
    }

    function debugLogToDI(type, action, rdata) {
      if (!enableDebugToDILog) return;
      if (proxy.getSessionData('session_id') === '-1') return;
      var data = {};
      data.id = diLogId;
      data.type = type;
      data.action = action;
      data.ts = Date.now();
      if (type === SDKConfig.DI.REQUEST_TYPE) {
        data.requestData = rdata;
      } else {
        data.responseData = rdata;
      }
      if (proxy.getSessionData('game_id')) {
        data.gameId = proxy.getSessionData('game_id');
        if (proxy.getSessionData('zone')) {
          data.gameId = proxy.getSessionData('zone') + '-' + data.gameId;
        }
      }
      if (proxy.getSessionData('game_version') || proxy.getSessionData('game_version') === 0) {
        data.gameVersion = proxy.getSessionData('game_version');
      }
      if (proxy.getSessionData('session_id')) {
        data.session = proxy.getSessionData('session_id');
      }
      data.platform = 'js';
      proxy.logToStatistics(data);
    }

    return {
      version: '2.0',
      /**
       * debug use only
       */
      init: initImpl,
      prepareDevelopEnvironment: function prepareDevelopEnvironment(callback) {
        proxy.prepareDevelopEnvironment(callback);
      },

      /**
       * ready entrance
       */
      onReady: onPKJsBridgeReady,

      /**
       * old api , do not use after third game
       *
       */
      reportGameState: function reportGameState(stateId, stateData, stateTtl) {
        var rData = {
          state_id: stateId,
          state_data: stateData,
          state_ttl: stateTtl
        };
        debugLogToDI(SDKConfig.DI.REQUEST_TYPE, 'reportGameState', rData);
        proxy.reportGameState(stateId, stateData, stateTtl);
      },
      requestNewRound: function requestNewRound(data, respCallback) {
        debugLogToDI(SDKConfig.DI.REQUEST_TYPE, 'requestNewRound', data);
        proxy.requestNewRound(data, function (res) {
          debugLogToDI(SDKConfig.DI.RESPONSE_TYPE, 'requestNewRound', res);
          respCallback(res);
        });
      },
      requestRoundStart: function requestRoundStart(data, respCallback) {
        debugLogToDI(SDKConfig.DI.REQUEST_TYPE, 'requestRoundStart', data);
        proxy.requestRoundStart(data, function (res) {
          debugLogToDI(SDKConfig.DI.RESPONSE_TYPE, 'requestRoundStart', res);
          respCallback(res);
        });
      },
      submitRoundResult: function submitRoundResult(data, respCallback) {
        debugLogToDI(SDKConfig.DI.REQUEST_TYPE, 'submitRoundResult', data);
        proxy.submitRoundResult(data, function (res) {
          debugLogToDI(SDKConfig.DI.RESPONSE_TYPE, 'submitRoundResult', res);
          respCallback(res);
        });
      },
      requestJoinARound: function requestJoinARound(data, respCallback) {
        debugLogToDI(SDKConfig.DI.REQUEST_TYPE, 'requestJoinARound', data);
        proxy.requestJoinARound(data, function (res) {
          debugLogToDI(SDKConfig.DI.RESPONSE_TYPE, 'requestJoinARound', res);
          respCallback(res);
        });
      },

      registerGameStateChanged: function registerGameStateChanged(callback) {
        proxy.registerGameStateChanged(function (data) {
          debugLogToDI(SDKConfig.DI.RESPONSE_TYPE, 'registerGameStateChanged', data);
          callback(data);
        });
      },
      registerOnP2pMsg: function registerOnP2pMsg(callback) {
        proxy.registerOnP2pMsg(function (data) {
          debugLogToDI(SDKConfig.DI.RESPONSE_TYPE, 'registerOnP2pMsg', data);
          callback(data);
        });
      },

      requestSendInGameData: function requestSendInGameData(data, respCallback) {
        debugLogToDI(SDKConfig.DI.REQUEST_TYPE, 'requestSendInGameData', data);
        proxy.requestSendInGameData(data, function (res) {
          debugLogToDI(SDKConfig.DI.RESPONSE_TYPE, 'requestSendInGameData', res);
          respCallback(res);
        });
      },
      requestExtend: function requestExtend(data, respCallback) {
        debugLogToDI(SDKConfig.DI.REQUEST_TYPE, 'requestExtend', data);
        proxy.requestExtend(data, function (res) {
          debugLogToDI(SDKConfig.DI.RESPONSE_TYPE, 'requestExtend', res);
          respCallback(res);
        });
      },

      openUrl: function openUrl(url, closeThis) {
        var rData = {
          url: url,
          closeThis: closeThis
        };
        debugLogToDI(SDKConfig.DI.REQUEST_TYPE, 'openUrl', rData);
        proxy.openUrl(url, closeThis);
      },

      /**
       * client api
       */
      getSessionDatas: function getSessionDatas() {
        return proxy.getSessionDatas();
      },

      getSessionData: function getSessionData(key) {
        return (
          // debugLogToDI(SDKConfig.DI.REQUEST_TYPE, 'getSessionData', key);
          // debugLogToDI(SDKConfig.DI.RESPONSE_TYPE, 'getSessionData',
          //  proxy.getSessionData(key));
          proxy.getSessionData(key)
        );
      },

      reportGameReady: function reportGameReady(gameId) {
        debugLogToDI(SDKConfig.DI.REQUEST_TYPE, 'reportGameReady', gameId);
        proxy.reportGameReady(gameId);
      },
      reportInsufficientDeposit: function reportInsufficientDeposit() {
        debugLogToDI(SDKConfig.DI.REQUEST_TYPE, 'reportInsufficientDeposit', {});
        proxy.reportInsufficientDeposit();
      },
      toast: function toast(text) {
        debugLogToDI(SDKConfig.DI.REQUEST_TYPE, 'toast', text);
        proxy.toast(text);
      },
      logToApp: function logToApp(msg) {
        proxy.logToApp(msg);
      },
      logToStatistics: function logToStatistics(data) {
        proxy.logToStatistics(data);
      },
      closeWithMsg: function closeWithMsg(msg) {
        debugLogToDI(SDKConfig.DI.REQUEST_TYPE, 'closeWithMsg', msg);
        proxy.closeWithMsg(msg);
      },
      playSound: function playSound(path, repeat, onPlayingCallback) {
        var rData = {
          sound_path: path,
          sound_repeat: repeat
        };
        debugLogToDI(SDKConfig.DI.REQUEST_TYPE, 'playSound', rData);
        proxy.playSound(path, repeat, function (data) {
          debugLogToDI(SDKConfig.DI.RESPONSE_TYPE, 'playSound', data);
          onPlayingCallback(data);
        });
      },
      stopPlaying: function stopPlaying(soundTrackId) {
        var rData = { track_id: soundTrackId };
        debugLogToDI(SDKConfig.DI.REQUEST_TYPE, 'stopPlaying', rData);
        proxy.stopPlaying(soundTrackId);
      },
      callHostApp: function callHostApp(name, data, callbackFunc) {
        var rData = {
          name: name,
          data: data
        };
        debugLogToDI(SDKConfig.DI.REQUEST_TYPE, 'callHostApp', rData);
        proxy.callHostApp(name, data, function (data) {
          debugLogToDI(SDKConfig.DI.RESPONSE_TYPE, 'callHostApp', data);
          callbackFunc(data);
        });
      },
      /**
       * platform api
       */
      getUsers: function getUsers(userIds, getUsersCallback) {
        // debugLogToDI(SDKConfig.DI.REQUEST_TYPE, 'getUsers', userIds);
        proxy.getUsers(userIds, function (data) {
          // debugLogToDI(SDKConfig.DI.RESPONSE_TYPE, 'getUsers', data);
          getUsersCallback(data);
        });
      },

      /**
       *
       * 2.0 api
       *
       */
      callPlatformApi: function callPlatformApi(cmd, data, callbackFunc) {
        var logData = {};
        logData.cmd = cmd;
        logData.data = data;
        debugLogToDI(SDKConfig.DI.REQUEST_TYPE, 'callPlatformApi-' + cmd, logData);
        proxy.callPlatformApi(cmd, data, function (rdata) {
          debugLogToDI(SDKConfig.DI.RESPONSE_TYPE, 'callPlatformApi-' + cmd, rdata);
          callbackFunc(rdata);
        });
      },
      reportGameStart: function reportGameStart() {
        proxy.reportGameStart();
      },
      reportGameEnd: function reportGameEnd() {
        proxy.reportGameEnd();
      },
      broadcastToVideoChannel: function broadcastToVideoChannel(seq, ttl) {
        proxy.broadcastToVideoChannel(seq, ttl);
      },
      registerVideoChannelData: function registerVideoChannelData(callbackFunc) {
        proxy.registerVideoChannelData(callbackFunc);
      },
      canPlayAudio: function canPlayAudio() {
        return proxy.getSessionData('user_id') !== proxy.getSessionData('host_id');
      },
      getOwnerBalance: function getOwnerBalance(callback) {
        proxy.getOwnerBalance(function (rdata) {
          callback(rdata);
        });
      },
      registerHostCloseLiveStreamEvent: function registerHostCloseLiveStreamEvent(callbackFunc) {
        proxy.registerHostCloseLiveStreamEvent(function (rdata) {
          callbackFunc(rdata);
        });
      },

      registerGameViewStateChangeEvent: function registerGameViewStateChangeEvent(callbackFunc) {
        proxy.registerGameViewStateChangeEvent(function (rdata) {
          callbackFunc(rdata);
        });
      },

      registerUserCloseVideoEvent: function registerUserCloseVideoEvent(callbackFunc) {
        proxy.registerUserCloseVideoEvent(function (rdata) {
          callbackFunc(rdata);
        });
      },

      closeVideo: function closeVideo() {
        proxy.closeVideo();
      },

      isOpenOutsideVideo: function canPlayAudio() {
        return !proxy.getSessionData('session_id') || proxy.getSessionData('session_id') === "-1";
      }
    };
  }();
  window.PkApi = PkApi;
  window.PKApi = PkApi;
  window.SDKConfig = SDKConfig;
  return window.PkApi;
})();
