require 'simplecov'
require 'minitest/reporters'
require 'mocha/mini_test'

SimpleCov.start do
  add_filter '/test/'
end

ENV['RAILS_ENV'] ||= 'test'
require File.expand_path('../../config/environment', __FILE__)
require 'rails/test_help'

Minitest::Reporters.use! [Minitest::Reporters::DefaultReporter.new(color: true,slow_count: 10,slow_suite_count: 5,fast_fail: true)]

class ActiveSupport::TestCase
  # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
  fixtures :all

  # Add more helper methods to be used by all tests here...

  include Devise::TestHelpers
  include ActiveJob::TestHelper
  ActiveRecord::Migration.check_pending!

  def set_authentication_headers_for(user)
    @request.headers.merge!(user.create_new_auth_token)
  end
end
