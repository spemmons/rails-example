require 'test_helper'

class Api::JogTimeControllerTest < ActionController::TestCase
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

    context 'when accessing jog times for another user' do
      
      should 'fail with unauthorized on index' do
        get :index,user_id: 1
        assert_response :unauthorized
      end

      should 'fail with unauthorized on show' do
        get :show,id: 1,user_id: 1
        assert_response :unauthorized
      end

      should 'fail with unauthorized on create' do
        get :create,user_id: 1
        assert_response :unauthorized
      end

      should 'fail with unauthorized on update' do
        get :update,id: 1,user_id: 1
        assert_response :unauthorized
      end

      should 'fail with unauthorized on destroy' do
        get :destroy,id: 1,user_id: 1
        assert_response :unauthorized
      end
    end  

    context 'when accessing his own jog times' do

      context 'with no existing job_times' do

        should 'return an empty array on index' do
          get :index
          assert_response :success
          assert_equal '[]',response.body
        end

        should 'return a null response on show' do
          get :show,id: 1
          assert_response :success
          assert_equal 'null',response.body
        end

        should 'return a new jog_time on create' do
          assert_difference 'JogTime.count' do
            get :create,jog_time: {date: Time.zone.local(2016,1,1),duration: 10,distance: 1}
            assert_response :success
            assert_equal '{"id":1,"user_id":1,"date":"2016-01-01T00:00:00.000Z","duration":10,"distance":1.0}',response.body
          end
        end

        should 'return a null response on update' do
          get :update,id: 1,jog_time: {date: Time.zone.local(2016,1,1),duration: 10,distance: 1}
          assert_response :success
          assert_equal 'null',response.body
        end

        should 'return a null response on destroy' do
          assert_no_difference 'JogTime.count' do
            get :destroy,id: 1
            assert_response :success
            assert_equal 'null',response.body
          end
        end

      end

      context 'with several existing job_times' do
        setup do
          @jogtime1 = @user.jog_times.create!(date: Time.zone.local(2016,1,1),duration: 10,distance: 1)
          @jogtime2 = @user.jog_times.create!(date: Time.zone.local(2016,1,2),duration: 20,distance: 2)
          @jogtime3 = @user.jog_times.create!(date: Time.zone.local(2016,1,3),duration: 30,distance: 3)
        end

        should 'return an array of all elements on index' do
          get :index
          assert_response :success
          assert_equal %([{"id":1,"user_id":1,"date":"2016-01-01T00:00:00.000Z","duration":10,"distance":1.0},{"id":2,"user_id":1,"date":"2016-01-02T00:00:00.000Z","duration":20,"distance":2.0},{"id":3,"user_id":1,"date":"2016-01-03T00:00:00.000Z","duration":30,"distance":3.0}]),response.body
        end

        should 'return a jog_time on show' do
          get :show,id: @jogtime1.id
          assert_response :success
          assert_equal '{"id":1,"user_id":1,"date":"2016-01-01T00:00:00.000Z","duration":10,"distance":1.0}',response.body
        end

        should 'return a new jog_time on create' do
          assert_difference 'JogTime.count' do
            get :create,jog_time: {date: Time.zone.local(2016,1,4),duration: 40,distance: 4}
            assert_response :success
            assert_equal '{"id":4,"user_id":1,"date":"2016-01-04T00:00:00.000Z","duration":40,"distance":4.0}',response.body
          end
        end

        should 'return an updated jog_time on update' do
          assert_no_difference 'JogTime.count' do
            get :update,id: @jogtime1.id,jog_time: {duration: 50,distance: 5}
            assert_response :success
            assert_equal '{"id":1,"user_id":1,"date":"2016-01-01T00:00:00.000Z","duration":50,"distance":5.0}',response.body
          end
        end

        should 'return a jog_time on destroy' do
          assert_difference 'JogTime.count',-1 do
            get :destroy,id: @jogtime1.id
            assert_response :success
            assert_equal '{"id":1,"user_id":1,"date":"2016-01-01T00:00:00.000Z","duration":10,"distance":1.0}',response.body
          end
        end
      end
    end
      
  end
  
  context 'admin current_user' do
    setup do
      @user = FactoryGirl.create(:admin_user)
      set_authentication_headers_for(@user)
    end

    context 'when accessing jog times for another user' do

      should 'fail with unauthorized on index' do
        get :index,user_id: 1
        assert_response :success
      end

      should 'fail with success on show' do
        get :show,id: 1,user_id: 1
        assert_response :success
      end

      should 'fail with success on create' do
        get :create,user_id: 1,jog_time: {date: Time.zone.local(2016,1,1),duration: 10,distance: 1}
        assert_response :success
      end

      should 'fail with success on update' do
        get :update,id: 1,user_id: 1
        assert_response :success
      end

      should 'fail with success on destroy' do
        get :destroy,id: 1,user_id: 1
        assert_response :success
      end
    end

  end
end
