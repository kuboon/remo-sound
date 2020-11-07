Rails.application.routes.draw do
  root 'home#index'
  get ':ch_key/play', to: 'home#guest', as: :guest
  get ':key/host', to: 'home#host', as: :host
  get ':key/graph', to: 'home#graph', as: :graph

  # post 'api/send_sound'
end
