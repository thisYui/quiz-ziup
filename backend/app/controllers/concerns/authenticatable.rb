module Authenticatable
  extend ActiveSupport::Concern

  included do
    before_action :authenticate_request
  end

  private

  def authenticate_request
    header = request.headers['Authorization']
    token = header&.split(' ')&.last

    decoded = JwtService.decode(token)
    if decoded && (user = User.find_by(id: decoded[:user_id]))
      @current_user = user
    else
      render json: { error: 'Unauthorized' }, status: :unauthorized
    end
  end

  def current_user
    @current_user
  end
end
