class CleanupExpiredTokensJob < ApplicationJob
  queue_as :default

  def perform
    # Xóa tất cả token có thời gian hết hạn < thời điểm hiện tại
    expired_count = JwtToken.where('exp < ?', Time.current).delete_all
    Rails.logger.info "[CleanupExpiredTokensJob] Đã xóa #{expired_count} token hết hạn lúc #{Time.current}"
  end
end
