require 'test_helper'

class Admin::JogTimesControllerTest < ActionController::TestCase
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
      @item = @user.jog_times.create(date: Time.zone.local(2016,1,1),duration: 10,distance: 1)
    end

    should 'render list' do
      get :index
      assert_response :success
    end

    should 'render show' do
      get :show,id: @item.to_param
      assert_response :success
    end

    should 'render edit' do
      get :edit,id: @item.to_param
      assert_response :success
    end

  end

end