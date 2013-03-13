remoteStorage.defineModule('contacts', function(privateClient, publicClient) {
  return {
    exports: {
      init: function() {
        privateClient.release('');
        publicClient.release('');
      },

      getContacts: function(platform) {
        return privateClient.getAll(platform+'/');
      },

      addContact: function(platform, address, data) {
        return privateClient.storeObject('contact', platform+'/'+address, data);
      }
    }
  };
});
