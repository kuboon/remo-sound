class RoomChannel < ApplicationCable::Channel
  def subscribed
    stream_from 'sound'
  end

  def unsubscribed; end

  def sound(data)
    ActionCable.server.broadcast('sound', data)
  end
end
