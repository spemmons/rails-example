source 'https://rubygems.org'
ruby '2.2.3'

gem 'rails', '4.2.5.1'
gem 'sqlite3'

gem 'haml'
gem 'haml-rails'
gem 'sass-rails', '~> 5.0'
gem 'bootstrap-sass', '~> 3.3.6'
gem 'uglifier', '>= 1.3.0'
gem 'coffee-rails', '~> 4.1.0'
gem 'bower-rails'
gem 'therubyracer', platforms: :ruby
gem 'angular-rails-templates'

# Use jquery as the JavaScript library
gem 'jquery-rails'
gem 'turbolinks'
gem 'jbuilder', '~> 2.0'

# bundle exec rake doc:rails generates the API under doc/api.
gem 'sdoc', '~> 0.4.0', group: :doc

# Use ActiveModel has_secure_password
gem 'bcrypt', '~> 3.1.7'

gem 'puma'

gem 'activeadmin', github: 'streamatica/activeadmin'
gem 'bitmask_attributes'
gem 'devise'
gem 'devise_token_auth',github: 'streamatica/devise_token_auth'
gem 'cancan'

group :development, :test do
  gem 'brakeman', require: false
end

group :development do
  # Access an IRB console on exception pages or by using <%= console %> in views
  gem 'web-console', '~> 2.0'

  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem 'spring'
end

group :test do
  gem 'factory_girl_rails'
  gem 'shoulda'
  gem 'mocha'
  gem 'simplecov', require: false
  gem 'minitest-reporters', require: false
  gem 'capybara'
  gem 'poltergeist'
  gem 'database_cleaner'
  gem 'capybara-screenshot'
end

