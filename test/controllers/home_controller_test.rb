require 'test_helper'

class HomeControllerTest < ActionController::TestCase
  context 'index action' do
    should 'respond with success' do
      get :index
      assert_response :success
    end
  end
end
