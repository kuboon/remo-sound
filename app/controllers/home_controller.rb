class HomeController < ApplicationController
  before_action :set_key, only: %w[host graph]

  def guest
    @ch_key = params["ch_key"]
  end

  private

  def set_key
    @key = params['key']
    @ch_key =  Digest::SHA256.hexdigest(@key)
  end
end
