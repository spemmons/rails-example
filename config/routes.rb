Rails.application.routes.draw do
  ActiveAdmin.routes(self)

  devise_for :users

  root to: 'home#index'

  namespace :api do
    mount_devise_token_auth_for 'User', at: 'auth'

    resources :user do
      resources :jog_time

      get 'weekly_summaries' => 'jog_time#weekly_summaries'
    end

    resources :jog_time

    get 'weekly_summaries' => 'jog_time#weekly_summaries'

  end

end
