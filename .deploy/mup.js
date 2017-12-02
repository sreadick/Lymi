module.exports = {
  servers: {
    one: {
      host: '52.91.193.74',
      username: 'ubuntu',
      // username: 'root',
      pem: '~/Downloads/SSH/VirginiaKeyPair.pem'
    }
  },
  meteor: {
    name: 'LymeLog',
    path: '../',
    docker: {
      image: 'abernix/meteord:base'
    },
    servers: {
      one: {}
    },
    buildOptions: {
      serverOnly: true
    },
    env: {
      ROOT_URL: 'http://app.com',
      MONGO_URL: 'mongodb://skyz:undecisive@ds113566.mlab.com:13566/lymelogdb',
    }
  },
  mongo: {
    version: '3.4.1',
    servers: {
      one: {}
    }
  }
};
