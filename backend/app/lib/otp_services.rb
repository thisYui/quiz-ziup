class OTPServices
  OTP_EXPIRE_TIME = 1.minutes

  def self.generate_otp
    "%06d" % rand(0..999999)
  end

  def self.send_otp(email)
    otp = generate_otp
    puts I18n.t('auth.otp.notice') + ' ' + email + " - OTP: #{otp}"

    Rails.cache.write("otp_#{email}", otp, expires_in: OTP_EXPIRE_TIME)
    otp
  end

  def self.confirm_otp(email, input_otp)
    stored_otp = Rails.cache.read("otp_#{email}")
    if stored_otp && input_otp == stored_otp
      puts I18n.t('auth.otp.success') + ' ' + email
      Rails.cache.delete("otp_#{email}")
      true
    else
      puts I18n.t('auth.otp.failure') + ' ' + email
      false
    end
  end
end
