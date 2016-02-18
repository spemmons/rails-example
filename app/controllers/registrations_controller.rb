class RegistrationsController < Devise::RegistrationsController

  def create
    build_resource(params.require(:user).permit(:email,:password))

    if resource.save
      if resource.active_for_authentication?
        set_flash_message :notice, :signed_up if is_navigational_format?
        sign_up(resource_name, resource)
      else
        set_flash_message :notice, :"signed_up_but_#{resource.inactive_message}" if is_navigational_format?
        expire_session_data_after_sign_in!
      end
      render json: {success: true}
    else
      clean_up_passwords resource
      render status: 422,json: {success: false,errors: resource.errors.to_a}
    end
  end

  def sign_up(resource_name, resource)
    sign_in(resource_name, resource)
  end

end