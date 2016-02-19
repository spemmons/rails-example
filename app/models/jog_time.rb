class JogTime < ActiveRecord::Base
  belongs_to :user

  def speed
    (distance / duration).round(4) rescue nil
  end

  def as_json(options = {})
    super(only: [:id,:user_id,:date,:duration,:distance])
  end
end
