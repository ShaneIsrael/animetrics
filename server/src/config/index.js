module.exports = {
  environment: process.env.NODE_ENV || 'dev',
  spaces: {
    edge: 'https://cdn.animetrics.co',
    origin: 'https://animetrics.sfo2.digitaloceanspaces.com'
  },
  sentry: {
    dsn: process.env.SENTRY_DSN
  },
  twilio: {
    sid: process.env.TWILIO_SID,
    auth_token: process.env.TWILIO_AUTH_TOKEN,
    contacts: {
      admin: process.env.TWILIO_ADMIN_CONTACT,
      animetrics: process.env.TWILIO_ANIMETRICS_CONTACT
    }
  },
  dev: {
    telegram: {
      ANIMETRICS_DISCUSSION_BOT_TOKEN: process.env.TELEGRAM_DEV_DISCUSSION_BOT_TOKEN,
      discussion_feed_channel: process.env.TELEGRAM_DEV_DISCUSSION_FEED_CHANNEL
    },
    reddit: {
      CLIENT_ID: process.env.REDDIT_CLIENT_ID,
      CLIENT_SECRET: process.env.REDDIT_CLIENT_SECRET,
      REFRESH_TOKEN: process.env.REDDIT_REFRESH_TOKEN,
    },
    tvdb: {
      API_KEY: process.env.TVDB_API_KEY,
    },
    assets: {
      imagesRootPath: '/mnt/c/git/animetrics/ui/build/images',
      detectFacePath: '/mnt/c/git/animetrics/server/src/tools/detectFace.py',
      detectFaceConfPath: '/mnt/c/git/animetrics/server/src/config/libcascade_animeface.xml',
    },
    aws: {
      endpoint: 'sfo2.digitaloceanspaces.com',
      access_key_id: process.env.DIGITAL_OCEAN_SPACES_ACCESS_KEY_ID,
      access_key_secret: process.env.DIGITAL_OCEAN_SPACES_ACCESS_KEY_SECRET,
    },
  },
  prod: {
    telegram: {
      ANIMETRICS_DISCUSSION_BOT_TOKEN: process.env.TELEGRAM_DISCUSSION_BOT_TOKEN,
      discussion_feed_channel: process.env.TELEGRAM_DISCUSSION_FEED_CHANNEL
    },
    reddit: {
      CLIENT_ID: process.env.REDDIT_CLIENT_ID,
      CLIENT_SECRET: process.env.REDDIT_CLIENT_SECRET,
      REFRESH_TOKEN: process.env.REDDIT_REFRESH_TOKEN,
    },
    tvdb: {
      API_KEY: process.env.TVDB_API_KEY,
    },
    assets: {
      imagesRootPath: '/temp',
      detectFacePath: '/root/animetrics/server/src/tools/detectFace.py',
      detectFaceConfPath: '/root/animetrics/server/src/config/libcascade_animeface.xml',
    },
    aws: {
      endpoint: 'sfo2.digitaloceanspaces.com',
      access_key_id: process.env.DIGITAL_OCEAN_SPACES_ACCESS_KEY_ID,
      access_key_secret: process.env.DIGITAL_OCEAN_SPACES_ACCESS_KEY_SECRET,
    },
  },
  mac: {
    telegram: {
      ANIMETRICS_DISCUSSION_BOT_TOKEN: process.env.TELEGRAM_DEV_DISCUSSION_BOT_TOKEN,
      discussion_feed_channel: process.env.TELEGRAM_DEV_DISCUSSION_FEED_CHANNEL
    },
    reddit: {
      CLIENT_ID: process.env.REDDIT_CLIENT_ID,
      CLIENT_SECRET: process.env.REDDIT_CLIENT_SECRET,
      REFRESH_TOKEN: process.env.REDDIT_REFRESH_TOKEN,
    },
    tvdb: {
      API_KEY: process.env.TVDB_API_KEY,
    },
    assets: {
      imagesRootPath: '/Users/sisrael/git/anime-episode-ranking/ui/public/images',
      detectFacePath: '/Users/sisrael/git/anime-episode-ranking/server/src/tools/detectFace.py',
      detectFaceConfPath: '/Users/sisrael/git/anime-episode-ranking/server/src/config/libcascade_animeface.xml',
    },
    aws: {
      endpoint: 'sfo2.digitaloceanspaces.com',
      access_key_id: process.env.DIGITAL_OCEAN_SPACES_ACCESS_KEY_ID,
      access_key_secret: process.env.DIGITAL_OCEAN_SPACES_ACCESS_KEY_SECRET,
    },
  },
}
