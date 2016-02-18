Rails.application.routes.draw do
  ActiveAdmin.routes(self)

  devise_for :users, :controllers => {registrations: 'registrations'}

  root to: 'home#index'

  namespace :api do
    mount_devise_token_auth_for 'User', at: 'auth'

    resources :user do
      resources :jog_time
    end

    resources :jog_time
  end

end
