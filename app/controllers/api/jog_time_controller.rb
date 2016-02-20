class Api::JogTimeController < ApiController

  before_filter :authorize_user
  before_action :set_user
  before_action :set_jog_time,except: [:index,:create]

  def index
    scope = @user.jog_times
    scope = scope.limit(params[:limit]) if params[:limit] and params[:limit].to_i > 0
    scope = scope_by_sort(scope,params[:sort])
    scope = scope_by_date_range(scope,params[:from],params[:to])

    render inline: scope.to_a.to_json
  end

  def show
    return missing_jog_time unless @jog_time

    render inline: @jog_time.to_json
  end

  def create
    jog_time = @user.jog_times.create(valid_params)
    if jog_time.errors.any?
      render(status: :unprocessable_entity,json: jog_time.errors.to_a)
    else
      render inline: jog_time.to_json
    end
  end

  def update
    return missing_jog_time unless @jog_time

    if @jog_time.update_attributes(valid_params)
      render inline: @jog_time.to_json
    else
      render(status: :unprocessable_entity,json: @jog_time.errors.to_a)
    end
  end

  def destroy
    return missing_jog_time unless @jog_time

    @jog_time.delete
    render inline: @jog_time.to_json
  end

protected

  def authorize_user
    authorize!(:manage,:user) if params[:user_id]
    authorize!(:manage,:jog_time)
  end

  def set_user
    @user = params[:user_id] ? User.find_by_id(params[:user_id]) : current_user
  end

  def set_jog_time
    @jog_time = @user.jog_times.find_by_id(params[:id])
  end

  def missing_jog_time
    render(status: :unprocessable_entity,json: ['No jog time given'])
  end

  def valid_params
    params.require(:jog_time).permit(:date,:duration,:distance)
  end

  def scope_by_sort(scope,sort)
    case sort
      when nil     then scope
      when 'speed' then scope.order('(distance/duration) desc')
      else              scope.order("#{sort} desc")
    end
  end

  def scope_by_date_range(scope,from,to)
    return scope unless from and to

    scope.where('date between ? and ?',from,to)

  rescue
    scope
  end

end