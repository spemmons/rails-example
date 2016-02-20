require 'test_helper'

class Api::UserControllerTest < ActionController::TestCase
  context 'no current_user' do
    should 'fail with unauthorized on index' do
      get :index
      assert_response :unauthorized
    end

    should 'fail with unauthorized on show' do
      get :show,id: 1
      assert_response :unauthorized
    end

    should 'fail with unauthorized on create' do
      get :create
      assert_response :unauthorized
    end

    should 'fail with unauthorized on update' do
      get :update,id: 1
      assert_response :unauthorized
    end

    should 'fail with unauthorized on destroy' do
      get :destroy,id: 1
      assert_response :unauthorized
    end
  end

  context 'regular current_user' do
    setup do
      @user = FactoryGirl.create(:user)
      set_authentication_headers_for(@user)
    end

    should 'fail with unauthorized on index' do
      get :index
      assert_response :unauthorized
    end

    should 'fail with unauthorized on show' do
      get :show,id: 1
      assert_response :unauthorized
    end

    should 'fail with unauthorized on create' do
      get :create,user_id: 1
      assert_response :unauthorized
    end

    should 'fail with unauthorized on update' do
      get :update,id: 1
      assert_response :unauthorized
    end

    should 'fail with unauthorized on destroy' do
      get :destroy,id: 1
      assert_response :unauthorized
    end

  end
  
  context 'manager current_user' do
    setup do
      @user = FactoryGirl.create(:manager_user,email: 'manager@test.com')
      set_authentication_headers_for(@user)
    end

    should 'not be able to delete himself' do
      assert_no_difference 'User.count' do
        get :destroy,id: @user.to_param
        assert_response :unprocessable_entity
        assert_equal '["User cannot delete self"]',response.body
      end
    end

    context 'when the requested user does not exist' do

      should 'return an error response on show' do
        get :show,id: 2
        assert_response :unprocessable_entity
        assert_equal '["No user given"]',response.body
      end

      should 'return an error response on update' do
        get :update,id: 2
        assert_response :unprocessable_entity
        assert_equal '["No user given"]',response.body
      end

      should 'return an error response on destroy' do
        assert_no_difference 'User.count' do
          get :destroy,id: 2
          assert_response :unprocessable_entity
          assert_equal '["No user given"]',response.body
        end
      end
      
    end
    
    context 'when other users exist' do
      setup do
        @other = FactoryGirl.create(:user,email: 'user@test.com')
      end

      should 'return an array of all elements on index' do
        get :index
        assert_response :success
        assert_equal [@user.as_json,@other.as_json].to_json,response.body
      end

      should 'return a user on show' do
        get :show,id: @other.id
        assert_response :success
        assert_equal @other.to_json,response.body
      end

      should 'return an error on create with invalid params' do
        assert_no_difference 'User.count' do
          get :create,user: {email: 'new@test.com'}
          assert_response :unprocessable_entity
          assert_equal %(["Password can't be blank"]),response.body
        end
      end

      should 'return a new user on create with valid params' do
        assert_difference 'User.count' do
          get :create,user: {email: 'new@test.com',password: 'testing!!',roles: [:admin]}
          assert_response :success
          assert_equal User.last.to_json,response.body
        end
      end

      should 'return an error on update with invalid parameters' do
        assert_no_difference 'User.count' do
          get :update,id: @other.id,user: {email: 'test'}
          assert_response :unprocessable_entity
          assert_equal %(["Email is not an email"]),response.body
        end
      end

      should 'return an updated user on update with valid parameters' do
        assert_no_difference 'User.count' do
          get :update,id: @other.id,user: {roles: 'admin'}
          assert_response :success
          @other.reload
          assert_equal @other.to_json,response.body
          assert_equal [:admin],@other.roles
        end
      end

      should 'return a user on destroy' do
        assert_difference 'User.count',-1 do
          get :destroy,id: @other.id
          assert_response :success
          assert_equal @other.to_json,response.body
        end
      end
      
    end

  end
end
