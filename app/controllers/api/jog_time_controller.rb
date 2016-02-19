class Api::JogTimeController < ApiController

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
    render inline: @jog_time.to_json
  end

  def create
    render inline: @user.jog_times.create(valid_params).to_json
  end

  def update
    @jog_time.update_attributes(valid_params) if @jog_time
    render inline: @jog_time.to_json
  end

  def destroy
    @jog_time.delete if @jog_time
    render inline: @jog_time.to_json
  end

protected

  def set_user
    @user = params[:user_id] ? User.find_by_id(params[:user_id]) : current_user
  end

  def set_jog_time
    @jog_time = @user.jog_times.find_by_id(params[:id])
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