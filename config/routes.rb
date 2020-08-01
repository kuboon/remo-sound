Rails.application.routes.draw do
  root 'home#index'
  get 'host', to: 'home#host'
  post 'api/send_sound'
end
