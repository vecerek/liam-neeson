# README

This little project is the result of a school assignment for Identity and Access Management class at Aalbor University. It shows how Facebook Login and Facebook Graph API can be used to retrieve user data and use them in a "meaningful" way. In this specific case, we decided to provide the user data to Liam Neeson - just to make his life easier when looking for his next target.

The front-end has been implemented using React 16. The assets are compiled to a single bundle using Webpack 3 and being served by a Rails 5 web app running on Heroku. This repo should serve to anyone with the intention to create any project with such a setup. Hence, we also specify the steps the project has been set up.

## Setting up the web app

First, let's start with a completely fresh installation of the latest Ruby version (at the time of writing) using our favorite ruby version manager.
```
$ rvm install 2.5.1
```

Then, create a directory and a project-specific gemset. And let's install the gems serving our foundation, namely `bundler`, `nokogiri` and `rails`.
```
$ mkdir liam-neeson
$ cd liam-neeson
$ rvm use ruby-2.5.1@liam-neeson --ruby-version --create
$ gem install bundler
$ gem install nokogiri
$ gem install rails
```

After that, we can create a new rails project in the current working directory. For our application, there is no need for a database so we can apply the `--skip-active-record` argument. Also, we specify the webpack optimization for React by providing the argument `--webpack=react`. Rails 5 already ships with the gem `webpacker`, so we can make use of it. We also specified the `-T` argument, which will skip the generation of the testing boilerplate. In this project, we won't be writing any tests. BUT you definitely should!
```
$ rails new . --webpack=react --skip-active-record -T
```

After setting up a fresh Rails project, we have experienced some problems (maybe due to the webpack configuration) and we weren't able to run rails correctly. Deleting the `rails` and `rake` binaries and running a `rake app:update:bin` command fixed the issue for us.
```
$ rm bin/rails bin/rake
$ rake app:update:bin
```

To run multiple processes at the same time, we're using Foreman, so let's add it to our `Gemfile`.
```ruby
gem 'foreman', '>= 0.84.0'
```

Run bundle install.
```
$ bundle install
```

And create a local Procfile, so that Foreman knows how to start our app.
```
$ echo "web: bundle exec rails s
webpacker: ./bin/webpack-dev-server" >> Procfile.dev
```

And as a proof of concept, just launch Foreman loading the config from our `Procfile.dev` created in the previous step and run it on port 3000. The default react page should show up at `localhost:3000`.
```
foreman start -f Procfile.dev -p 3000
```

Congrats, you have a working Rails + React setup :-)
