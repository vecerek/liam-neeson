# README

This README would normally document whatever steps are necessary to get the
application up and running.

```
$ rvm install 2.5.1
```

```
$ mkdir liam-neeson
$ cd liam-neeson
$ rvm use ruby-2.5.1@liam-neeson --ruby-version --create
$ gem install bundler
$ gem install nokogiri
$ gem install rails
```

```
$ rails new . --webpack=react --skip-active-record -T
```

```
$ rm bin/rails bin/rake
$ rake app:update:bin
```

```ruby
gem 'foreman', '>= 0.84.0'
```

```
$ bundle install
```

```
$ echo "web: bundle exec rails s
webpacker: ./bin/webpack-dev-server" >> Procfile.dev
```

```
foreman start -f Procfile.dev -p 3000
```
