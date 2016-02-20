class Api::UserController < ApiController

  before_filter :authorize_user
  before_action :set_user,except: [:index,:create]

  def index
    render inline: User.all.to_a.to_json
  end

  def show
    render inline: @user.to_json
  end

  def create
    render inline: User.create(valid_params).to_json
  end

  def update
    @user.update_attributes(valid_params) if @user
    render inline: @user.to_json
  end

  def destroy
    @user.delete if @user
    render inline: @user.to_json
  end

protected

  def authorize_user
    authorize!(:manage,:user)
  end

  def set_user
    @user = User.find_by_id(params[:id])
  end

  def valid_params
    params.require(:user).permit(:email,:password,:roles)
  end

end