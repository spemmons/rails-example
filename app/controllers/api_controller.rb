class ApiController < ApplicationController
  include DeviseTokenAuth::Concerns::SetUserByToken

  prepend_before_filter :authenticate_user!

  before_action :force_json_format

  rescue_from CanCan::AccessDenied do |exception|
    render(status: :unauthorized,json: exception.to_s)
  end

protected

  def force_json_format
    request.format = :json
  end
end
