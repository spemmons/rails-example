class User < ActiveRecord::Base

  # Include default devise modules. Others available are:
  # :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable, :recoverable, :rememberable, :trackable, :validatable, :confirmable
  include DeviseTokenAuth::Concerns::User

  alias_attribute :name,:email

  # NOTE: Following methods are overwritten to allow devise token auth login without confirmation
  # Currently devise token auth does now support auto login for unconfirmed emails on sign up
  def confirmed?
    true
  end

  def confirmation_required?
    confirmed_at.nil?
  end

  def pending_any_confirmation
    if confirmed_at.nil?
      yield
    else
      self.errors.add(:email, :already_confirmed)
      false
    end
  end
end
