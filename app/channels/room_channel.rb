class RoomChannel < ApplicationCable::Channel
  def subscribed
    stream_from 'sound:'+params[:key]
  end

  def unsubscribed; end

  def sound(data)
    ActionCable.server.broadcast('sound:'+params[:key], data)
  end
end
