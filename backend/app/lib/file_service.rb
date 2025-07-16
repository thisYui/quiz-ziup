require 'base64'

class FileService
  def self.get_file_path(file_name)
    Rails.root.join('storage', file_name)
  end

  def self.get_file_url(file_name, request = nil)
    if request.present?
      "#{request.protocol}#{request.host_with_port}/storage/#{file_name}"
    else
      # fallback nếu không có request
      host = Rails.application.routes.default_url_options[:host] || 'localhost:3000'
      port = Rails.application.routes.default_url_options[:port] || 3000
      "http://#{host}:#{port}/storage/#{file_name}"
    end
  end

  def self.file_exists?(file_name)
    File.exist?(get_file_path(file_name))
  end

  def self.delete_file(file_name)
    file_path = get_file_path(file_name)
    File.delete(file_path) if file_exists?(file_name)
  rescue Errno::ENOENT
    false
  end

  def self.save_file(file_name, file_content)
    file_path = get_file_path(file_name)

    FileUtils.mkdir_p(File.dirname(file_path))

    File.open(file_path, 'wb') do |file|
      file.write(Base64.decode64(file_content))  # 👈 decode base64 trước
    end

    true
  rescue StandardError => e
    Rails.logger.error("Failed to save file #{file_name} for id=#{id}: #{e.message}")
    false
  end

  def self.update_file(new_content, new_name, old_name)
    # Xóa file cũ
    delete_file(old_name)

    # Lưu file mới với tên mới
    save_file(new_name, new_content)
  end
end