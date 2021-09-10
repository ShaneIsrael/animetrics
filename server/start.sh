pm2 delete animetrics
source .env
pm2 start env.config.js --env production --log-date-format 'DD-MM HH:mm:ss.SSS'
