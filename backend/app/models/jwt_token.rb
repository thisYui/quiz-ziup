class JwtToken < ApplicationRecord
  belongs_to :user

  def self.find_by_token_info(params)
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

  def self.find_by_jti(jwt_token, ip_address)
    jwt_token[:ip_address] = ip_address

    record = find_by_token_info(jwt_token)
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

  def self.renew_token(jwt_token, ip_address)
    # Tìm kiếm token theo thông tin thiết bị
    record = JwtToken.find_by_token_info(jwt_token)

    return nil if record.nil?

    # Tạo token mới
    new_jti = JwtService.encode({ user_id: record.user_id })
    record.update(jti: new_jti, ip_address: ip_address, exp: 1.hour.from_now)

    new_jti
  end

  def self.delete_token(jwt_token, ip_address)
    # Tìm kiếm token theo thông tin thiết bị
    jwt_token[:ip_address] = ip_address
    record = find_by_token_info(jwt_token)
    return nil if record.nil?

    puts record.inspect

    if record.user_id.to_i == jwt_token[:user_id].to_i
      record.destroy
      return true
    end
    nil
  end
end
