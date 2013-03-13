remoteStorage.defineModule('contacts', function(privateClient, publicClient) {
  return {
    exports: {
      init: function () {
        //TODO: find out what's making this code error and put it back:
        //privateClient.release('');
        //publicClient.release('');
        privateClient.declareType('contact', {
          description: 'an entry in the user\'s addressbook',
          type: 'object',
          properties: {
            platform: { type: 'string', description: 'Refers to a platform as defined by sockethub, for instance \'facebook\' or \'email\'', required: true },
            name: { type: 'string', description: 'human-readable full name', required: true },
            identifier: { type: 'string', description: 'a string that uniquely identifies this user within the platform', required: true }
          }
        });
      },

      getContacts: function(platform) {
        return privateClient.getAll(platform+'/');
      },

      addContact: function(platform, identifier, name) {
        return privateClient.storeObject('contact', platform+'/'+identifier, {
          platform: platform,
          identifier: identifier,
          name: name
        });
      }
    }
  };
});
