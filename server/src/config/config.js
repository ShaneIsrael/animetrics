module.exports = {
  environment: 'local',
  dev: {
    reddit: {
      CLIENT_ID: 'o1P2JRGCX5FQlA',
      CLIENT_SECRET: 'zGvwomVvHhEzqgSrXP8dhUuFzSY',
      REFRESH_TOKEN: '10419841-pv1qeYS2Y8t0LhHSYQzyaOjLySk',
    },
    tvdb: {
      API_KEY: 'A2I7IOGLBSTNR757',
    },
    assets: {
      imagesRootPath: '/mnt/c/git/animetrics/ui/build/images',
      detectFacePath: '/mnt/c/git/animetrics/server/src/tools/detectFace.py',
      detectFaceConfPath: '/mnt/c/git/animetrics/server/src/config/libcascade_animeface.xml',
    },
  },
}
