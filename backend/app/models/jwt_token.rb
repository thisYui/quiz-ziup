class JwtToken < ApplicationRecord
  belongs_to :user

  def self.find(params)
    # Tìm kiếm token theo thông tin thiết bị
    JwtToken.where(
      device: params[:device],
      ip_address: params[:ip_address],
      user_agent: params[:user_agent]
    ).find_by(jti: params[:jti])
  end

  # Thêm token mới

  def self.add_token(user_id, params, ip_address)
    # Kiểm tra thông tin thiết bị
    return nil unless params[:device] && params[:user_agent]

    # Tạo một hash chứa thông tin JWT token
    jwt_token = {
      device: params[:device],
      ip_address: ip_address,
      user_agent: params[:user_agent]
    }

    # Create a new JWT token
    jti = JwtService.encode({ user_id: user_id })
    exp = 1.hour.from_now

    # Add additional information to the token
    jwt_token[:user_id] = user_id
    jwt_token[:jti] = jti
    jwt_token[:exp] = exp

    JwtToken.create(jwt_token)

    jti
  end

  def self.find_by_jti(jwt_token)
    # tìm token theo thông tin thiết bị
    record = JwtToken.find(jwt_token)

    return nil if record.nil?

    begin
      payload = JwtService.decode(jwt_token[:jti])
      return record.user_id if payload["user_id"] == record.user_id
    rescue => e
      Rails.logger.warn "JWT decode failed: #{e.message}"
      return nil
    end

    nil
  end

  def self.renew_token(jwt_token)
    # Tìm kiếm token theo thông tin thiết bị
    record = JwtToken.find(jwt_token)

    return nil if record.nil?

    # Tạo token mới
    new_jti = JwtService.encode({ user_id: record.user_id })
    record.update(jti: new_jti, exp: 1.hour.from_now)

    new_jti
  end

  def self.delete_token(jwt_token)
    # Tìm kiếm token theo thông tin thiết bị
    record = JwtToken.find(jwt_token)

    return nil if record.nil?

    # Xóa token
    if record.user_id == jwt_token[:user_id]
      record.destroy
      return true
    end
    nil
  end
end
