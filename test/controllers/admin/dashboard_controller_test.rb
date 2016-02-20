require 'test_helper'

class Admin::DashboardControllerTest < ActionController::TestCase
  include Devise::TestHelpers

  context 'regular user' do
    setup do
      sign_in @user = FactoryGirl.create(:user)
    end

    should 'redirect to home' do
      get :index
      assert_redirected_to '/'
    end
  end

  context 'admin user' do
    setup do
      sign_in @user = FactoryGirl.create(:admin_user)
      @item = @user
    end

    should 'render list' do
      get :index
      assert_response :success
    end
  end

end