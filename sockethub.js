window.sockethub = (function() {
  var sock, host, secret,
    handler = {
      error: function(err) {
        console.log(err);
      },
      activity: function(activity) {
        console.log(activity);
      },
      ready: function() {
        console.log('ready');
      }
    };
  function send(data) {
    data.rid = new Date().getTime();
    if(sock && sock.readyState == WebSocket.OPEN) {
      console.log('[sockethub OUT]', JSON.stringify(data));
      sock.send(JSON.stringify(data));
      return data.rid;
    } else {
      handler.error('sockethub is not open, sorry');
    }
  }
  function addContact(platform, address, name) {
    console.log('no contact discovery handler', platform, address, name);
  }
  
  return {
    oncontact: function(cb) {
      addContact = cb;
    },
    connect: function(setHost, setSecret) {
      host = setHost;
      sock = new WebSocket('ws://'+host+'/', 'sockethub');
      sock.onopen = function() {
        secret = setSecret;
        registerRid = send({
          platform: 'dispatcher',
          verb: 'register',
          object: {
            secret: secret
          }
        });
      };
      sock.onmessage = function(e) {
        var data;
        try {
          data = JSON.parse(e.data);
        } catch(err) {
          handler.error('bogus message: '+e.data);
          return;
        }
        console.log('[sockethub IN]', JSON.stringify(data));
        if(data.verb == 'confirm') {
          return;
        }
        if(data.rid && data.rid == registerRid && data.verb == 'register') {
          if(data.status) {
            handler.ready();
          } else {
            handler.error(data.message);
          }
        } else if(data.verb == 'fetch' && data.status && data.object && data.object.data) {
          for(var i=0; i<data.object.data.length; i++) {
            addContact(data.platform, data.object.data[i].id, data.object.data[i].name);
          }
        } else {
          handler.activity(data);
        }
      };
      sock.onclose = function() {
        if(secret) {
          sockethub.connect(host, secret);
        } else {
          handler.error('could not connect to the sockethub server on '+host);
        }
      }
    },
    post: function(platform, credentials, object, target) {
      send({
        platform: 'dispatcher',
        verb: 'set',
        object: {
          credentials: {
            me: {
              actor: {
                address: "me"
              },
              access_token: credentials.token
            }
          }
        },
        target: {
          platform: platform
        }
      });
      send({
        platform: platform,
        verb: 'post',
        object: object,
        target: target,
        actor: {
          address: 'me'
        }
      });
    },
    fetch: function(platform, credentials, object, target) {
      send({
        platform: 'dispatcher',
        verb: 'set',
        object: {
          credentials: {
            me: {
              actor: {
                address: "me"
              },
              access_token: credentials.token
            }
          }
        },
        target: {
          platform: platform
        }
      });
      //fetching:
      send({
        platform: platform,
        verb: 'fetch',
        actor: {
          address: 'me'
        },
        target: target
      });
    },
    getState: function() {
      return sock.readyState;
    },
    reset: function() {
      sock.close();
    },
    on: function(event, cb) {
      handler[event] = cb;
    }
  };
})();
