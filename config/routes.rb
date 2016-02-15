Rails.application.routes.draw do
  ActiveAdmin.routes(self)

  devise_for :users

  root to: 'home#index'

  namespace :api do
    mount_devise_token_auth_for 'User', at: 'auth'
  end

end
