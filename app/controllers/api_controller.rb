class ApiController < ApplicationController
  def send_sound
    ActionCable.server.broadcast('sound', params[:name])
  end
end
