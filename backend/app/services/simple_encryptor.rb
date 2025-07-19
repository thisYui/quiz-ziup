require 'openssl'
require 'base64'
require 'json'
require 'digest'

class SimpleEncryptor
  def initialize
    # tạo key 32 bytes từ ENV
    @key = Digest::SHA256.digest(ENV['ENCRYPTION_KEY'])
  end

  def encrypt(data)
    cipher = OpenSSL::Cipher.new('AES-256-CBC')
    cipher.encrypt
    iv = cipher.random_iv
    cipher.key = @key
    cipher.iv = iv

    encrypted = cipher.update(data.to_json) + cipher.final

    # gộp iv + encrypted lại và mã hóa toàn bộ thành 1 chuỗi base64
    Base64.strict_encode64(iv + encrypted)
  end

  def decrypt(encoded_string)
    raw = Base64.strict_decode64(encoded_string)

    # tách iv và encrypted từ raw
    iv = raw[0...16] # AES-256-CBC dùng IV 16 bytes
    encrypted_data = raw[16..]

    cipher = OpenSSL::Cipher.new('AES-256-CBC')
    cipher.decrypt
    cipher.key = @key
    cipher.iv = iv

    decrypted = cipher.update(encrypted_data) + cipher.final
    JSON.parse(decrypted)
  end
end
