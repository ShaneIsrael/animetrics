module.exports = {
  environment: process.env.NODE_ENV || 'dev',
  dev: {
    reddit: {
      CLIENT_ID: 'o1P2JRGCX5FQlA',
      CLIENT_SECRET: 'zGvwomVvHhEzqgSrXP8dhUuFzSY',
      REFRESH_TOKEN: '10419841-pv1qeYS2Y8t0LhHSYQzyaOjLySk',
    },
    tvdb: {
      API_KEY: '364A3D46-3293-42EF-891B-F671ACFD9A75',
    },
    assets: {
      imagesRootPath: '/mnt/c/git/animetrics/ui/build/images',
      detectFacePath: '/mnt/c/git/animetrics/server/src/tools/detectFace.py',
      detectFaceConfPath: '/mnt/c/git/animetrics/server/src/config/libcascade_animeface.xml',
    },
    aws: {
      endpoint: 'sfo2.digitaloceanspaces.com',
      access_key_id: 'SHW64UJLEICUJPDMHTSP',
      access_key_secret: '54ORrWz/8A/FKA3z9lTVYAXUaJ8xb8q4tQz73TvS070',
    },
  },
  prod: {
    reddit: {
      CLIENT_ID: 'o1P2JRGCX5FQlA',
      CLIENT_SECRET: 'zGvwomVvHhEzqgSrXP8dhUuFzSY',
      REFRESH_TOKEN: '10419841-pv1qeYS2Y8t0LhHSYQzyaOjLySk',
    },
    tvdb: {
      API_KEY: '364A3D46-3293-42EF-891B-F671ACFD9A75',
    },
    assets: {
      imagesRootPath: '/temp',
      detectFacePath: '/var/www/animetrics/server/src/tools/detectFace.py',
      detectFaceConfPath: '/var/www/animetrics/server/src/config/libcascade_animeface.xml',
    },
    aws: {
      endpoint: 'sfo2.digitaloceanspaces.com',
      access_key_id: 'SHW64UJLEICUJPDMHTSP',
      access_key_secret: '54ORrWz/8A/FKA3z9lTVYAXUaJ8xb8q4tQz73TvS070',
    },
  },
  mac: {
    reddit: {
      CLIENT_ID: 'o1P2JRGCX5FQlA',
      CLIENT_SECRET: 'zGvwomVvHhEzqgSrXP8dhUuFzSY',
      REFRESH_TOKEN: '10419841-pv1qeYS2Y8t0LhHSYQzyaOjLySk',
    },
    tvdb: {
      API_KEY: '364A3D46-3293-42EF-891B-F671ACFD9A75',
    },
    assets: {
      imagesRootPath: '/Users/sisrael/git/anime-episode-ranking/ui/public/images',
      detectFacePath: '/Users/sisrael/git/anime-episode-ranking/server/src/tools/detectFace.py',
      detectFaceConfPath: '/Users/sisrael/git/anime-episode-ranking/server/src/config/libcascade_animeface.xml',
    },
    aws: {
      endpoint: 'sfo2.digitaloceanspaces.com',
      access_key_id: 'SHW64UJLEICUJPDMHTSP',
      access_key_secret: '54ORrWz/8A/FKA3z9lTVYAXUaJ8xb8q4tQz73TvS070',
    },
  },
}
