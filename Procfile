web: bundle exec rackup config.ru -p $PORT
resque: env TERM_CHILD=1 QUEUES="sentences" RESQUE_TERM_TIMEOUT=7 bundle exec rake resque:work
