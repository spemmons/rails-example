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

    context 'when the requested user does not exist' do

      should 'return a null response on show' do
        get :show,id: 2
        assert_response :success
        assert_equal 'null',response.body
      end

      should 'return a null response on update' do
        get :update,id: 2
        assert_response :success
        assert_equal 'null',response.body
      end

      should 'return a null response on destroy' do
        assert_no_difference 'User.count' do
          get :destroy,id: 2
          assert_response :success
          assert_equal 'null',response.body
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
        assert_equal %([{"id":1,"email":"manager@test.com","roles":["manager"]},{"id":2,"email":"user@test.com","roles":[]}]),response.body
      end

      should 'return a user on show' do
        get :show,id: @other.id
        assert_response :success
        assert_equal '{"id":2,"email":"user@test.com","roles":[]}',response.body
      end

      should 'return a new user on create' do
        assert_difference 'User.count' do
          get :create,user: {email: 'new@test.com',password: 'testing!!',roles: [:admin]}
          assert_response :success
          assert_equal '{"id":3,"email":"new@test.com","roles":[]}',response.body
        end
      end

      should 'return an updated user on update' do
        assert_no_difference 'User.count' do
          get :update,id: @other.id,user: {duration: 50,distance: 5}
          assert_response :success
          assert_equal '{"id":2,"email":"user@test.com","roles":[]}',response.body
        end
      end

      should 'return a user on destroy' do
        assert_difference 'User.count',-1 do
          get :destroy,id: @other.id
          assert_response :success
          assert_equal '{"id":2,"email":"user@test.com","roles":[]}',response.body
        end
      end
      
    end

  end
end
