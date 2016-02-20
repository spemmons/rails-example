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

        should 'return an error response on show' do
          get :show,id: 1
          assert_response :unprocessable_entity
          assert_equal '["No jog time given"]',response.body
        end

        should 'return an error on create without attributes' do
          assert_no_difference 'JogTime.count' do
            get :create
            assert_response :unprocessable_entity
            assert_equal '["Date invalid","Distance is not a number","Duration is not a number"]',response.body
          end
        end

        should 'return an error response on update' do
          get :update,id: 1,jog_time: {date: Time.zone.local(2016,1,1),duration: 10,distance: 1}
          assert_response :unprocessable_entity
          assert_equal '["No jog time given"]',response.body
        end

        should 'return an error response on destroy' do
          assert_no_difference 'JogTime.count' do
            get :destroy,id: 1
            assert_response :unprocessable_entity
            assert_equal '["No jog time given"]',response.body
          end
        end

        should 'return an empty array on weekly_summaries' do
          get :weekly_summaries
          assert_response :success
          assert_equal '[]',response.body
        end

      end

      context 'with several existing job_times' do
        setup do
          @jogtime1 = @user.jog_times.create!(date: Time.zone.local(2016,1,1),duration: 30,distance: 1)
          @jogtime2 = @user.jog_times.create!(date: Time.zone.local(2016,1,2),duration: 20,distance: 3)
          @jogtime3 = @user.jog_times.create!(date: Time.zone.local(2016,1,3),duration: 10,distance: 2)
        end

        should 'return an array of all elements on index with no filters' do
          get :index
          assert_response :success
          assert_equal [@jogtime1.as_json,@jogtime2.as_json,@jogtime3.as_json].to_json,response.body
        end

        should 'return an array of 2 with a date range skipping the first' do
          get :index,from: @jogtime2.date,to: @jogtime3.date + 1.day
          assert_response :success
          assert_equal [@jogtime2.as_json,@jogtime3.as_json].to_json,response.body
        end

        should 'return an array of 2 with a limit of 2' do
          get :index,limit: 2
          assert_response :success
          assert_equal [@jogtime1.as_json,@jogtime2.as_json].to_json,response.body
        end

        should 'return an array of 2 with a limit of 2 and sort by date' do
          get :index,limit: 2,sort: 'date'
          assert_response :success
          assert_equal [@jogtime3.as_json,@jogtime2.as_json].to_json,response.body
        end

        should 'return an array of 2 with a limit of 2 and sort by duration' do
          get :index,limit: 2,sort: 'duration'
          assert_response :success
          assert_equal [@jogtime1.as_json,@jogtime2.as_json].to_json,response.body
        end

        should 'return an array of 2 with a limit of 2 and sort by distance' do
          get :index,limit: 2,sort: 'distance'
          assert_response :success
          assert_equal [@jogtime2.as_json,@jogtime3.as_json].to_json,response.body
        end

        should 'return an array of 2 with a limit of 2 and sort by speed' do
          get :index,limit: 2,sort: 'speed'
          assert_response :success
          assert_equal [@jogtime3.as_json,@jogtime2.as_json].to_json,response.body
        end

        should 'return a jog_time on show' do
          get :show,id: @jogtime1.id
          assert_response :success
          assert_equal '{"id":1,"user_id":1,"date":"2016-01-01T00:00:00.000Z","duration":30,"distance":1.0}',response.body
        end

        should 'return a new jog_time on create' do
          assert_difference 'JogTime.count' do
            get :create,jog_time: {date: Time.zone.local(2016,1,4),duration: 40,distance: 4}
            assert_response :success
            assert_equal '{"id":4,"user_id":1,"date":"2016-01-04T00:00:00.000Z","duration":40,"distance":4.0}',response.body
          end
        end

        should 'return an error on update with invalid params' do
          assert_no_difference 'JogTime.count' do
            get :update,id: @jogtime1.id,jog_time: {date: 'abc'}
            assert_response :unprocessable_entity
            assert_equal '["Date invalid"]',response.body
          end
        end

        should 'return an updated jog_time on update with valid params' do
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
            assert_equal '{"id":1,"user_id":1,"date":"2016-01-01T00:00:00.000Z","duration":30,"distance":1.0}',response.body
          end
        end

        should 'return an array of 2 on weekly_summaries' do
          @jogtime4 = @user.jog_times.create!(date: Time.zone.local(2016,2,1),duration: 1,distance: 1)

          get :weekly_summaries
          assert_response :success
          assert_equal '[{"date":"2015-12-28T00:00:00.000Z","count":3,"distance_min":1.0,"distance_max":3.0,"distance_mean":2.0,"duration_min":10,"duration_max":30,"duration_mean":20,"speed_min":0.03333333333333333,"speed_max":0.2,"speed_mean":0.12777777777777777},{"date":"2016-02-01T00:00:00.000Z","count":1,"distance_min":1.0,"distance_max":1.0,"distance_mean":1.0,"duration_min":1,"duration_max":1,"duration_mean":1,"speed_min":1.0,"speed_max":1.0,"speed_mean":1.0}]',response.body
        end
      end
    end
      
  end
  
  context 'admin current_user' do
    setup do
      @user = FactoryGirl.create(:admin_user)
      @jog_time = @user.jog_times.create(date: Time.zone.local(2016,1,1),duration: 10,distance: 1)
      set_authentication_headers_for(@user)
    end

    context 'when accessing jog times for another user' do

      should 'fail with unauthorized on index' do
        get :index,user_id: @user.id
        assert_response :success
        assert_equal [@jog_time.as_json].to_json,response.body
      end

      should 'fail with success on show' do
        get :show,id: @jog_time.id,user_id: @user.id
        assert_response :success
        assert_equal @jog_time.to_json,response.body
      end

      should 'fail with success on create' do
        assert_difference 'JogTime.count' do
          get :create,user_id: @user.id,jog_time: {date: Time.zone.local(2016,1,2),duration: 20,distance: 2}
          assert_response :success
          assert_equal JogTime.last.to_json,response.body
        end
      end

      should 'fail with success on update' do
        get :update,id: @jog_time.id,user_id: @user.id
        assert_response :success
        assert_equal @jog_time.to_json,response.body
      end

      should 'fail with success on destroy' do
        assert_difference 'JogTime.count',-1 do
          get :destroy,id: @jog_time.id,user_id: @user.id
          assert_response :success
          assert_equal @jog_time.to_json,response.body
        end
      end
    end

  end
end
