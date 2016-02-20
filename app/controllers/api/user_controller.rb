class Api::UserController < ApiController

  before_filter :authorize_user
  before_action :set_user,except: [:index,:create]

  def index
    render inline: User.all.to_a.to_json
  end

  def show
    return missing_user unless @user

    render inline: @user.to_json
  end

  def create
    user = User.create(valid_params)
    if user.errors.any?
      render(status: :unprocessable_entity,json: user.errors.to_a)
    else
      render inline: user.to_json
    end
  end

  def update
    return missing_user unless @user

    if @user.update_attributes(valid_params)
      render inline: user.to_json
    else
      render(status: :unprocessable_entity,json: user.errors.to_a)
    end
  end

  def destroy
    return missing_user unless @user

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

  def missing_user
    render(status: :unprocessable_entity,json: ['No user given'])
  end

  def valid_params
    params.require(:user).permit(:email,:password,:roles)
  end

end