ENV['RAILS_ENV'] ||= 'test'
require File.expand_path('../../config/environment', __FILE__)
require 'rails/test_help'

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
