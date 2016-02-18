class ApiController < ApplicationController
  include DeviseTokenAuth::Concerns::SetUserByToken

  prepend_before_filter :authenticate_user!

  before_action :force_json_format

protected

  def force_json_format
    request.format = :json
  end
end
