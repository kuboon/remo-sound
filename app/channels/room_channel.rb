class RoomChannel < ApplicationCable::Channel
  def subscribed
    stream_from 'sound'
  end

  def unsubscribed; end

  def sound; end
end
