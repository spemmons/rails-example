class JogTime < ActiveRecord::Base
  belongs_to :user

  def as_json(options = {})
    super(only: [:id,:user_id,:date,:duration,:distance])
  end
end
