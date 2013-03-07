remoteStorage.defineModule('sockethub_credentials', function(privateClient, publicClient) {
  return {
    exports: {
      init: function() {
        privateClient.release('');
        publicClient.release('');
      },

      getConfig: function(type) {
        return privateClient.getObject(type);
      },

      writeConfig: function(type, data) {//type is probably 'credentials' here
        return privateClient.storeObject(type, type, data);
      }
    }
  };
});

