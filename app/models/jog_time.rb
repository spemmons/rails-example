class JogTime < ActiveRecord::Base
  belongs_to :user

  validates :user_id,:date,presence: {message: 'invalid'}

  validates :distance,:duration,numericality: {greater_than: 0.0}

  def speed
    (distance / duration).round(4) rescue nil
  end

  def as_json(options = {})
    super(only: [:id,:user_id,:date,:duration,:distance])
  end
end
