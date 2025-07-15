class FileServices
  def self.get_file_path(file_name, id)
    Rails.root.join('storage', id.to_s, file_name)
  end

  def self.file_exists?(file_name, id)
    File.exist?(get_file_path(file_name, id))
  end

  def self.delete_file(file_name, id)
    file_path = get_file_path(file_name, id)
    File.delete(file_path) if file_exists?(file_name, id)
  rescue Errno::ENOENT
    false
  end

  def self.save_file(file_name, file_content, id)
    file_path = get_file_path(file_name, id)

    # Tạo thư mục nếu chưa tồn tại
    FileUtils.mkdir_p(File.dirname(file_path))

    # Nếu là update file bị ghi đè
    File.open(file_path, 'wb') do |file|
      file.write(file_content)
    end
    true
  rescue StandardError => e
    Rails.logger.error("Failed to save file #{file_name} for id=#{id}: #{e.message}")
    false
  end

  def self.update_file(new_content, new_name, old_name, id)
    # Xóa file cũ
    delete_file(old_name, id)

    # Lưu file mới với tên mới
    save_file(new_name, new_content, id)
  end
end