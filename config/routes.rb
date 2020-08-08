Rails.application.routes.draw do
  root 'home#index'
  get 'host', to: 'home#host'
  get 'graph', to: 'home#graph'

  # post 'api/send_sound'
end
