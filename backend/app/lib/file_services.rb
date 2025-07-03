class FileServices
  def self.get_file_path(file_name)
    Rails.root.join('public', 'uploads', file_name)
  end

  def self.file_exists?(file_name)
    file_path = get_file_path(file_name)
    File.exist?(file_path)
  end

  def self.delete_file(file_name)
    file_path = get_file_path(file_name)
    File.delete(file_path) if file_exists?(file_name)
  rescue Errno::ENOENT
    false
  end

  def self.save_file(file_name, file_content)
    file_path = get_file_path(file_name)
    File.open(file_path, 'wb') do |file|
      file.write(file_content)
    end
    true
  rescue StandardError => e
    Rails.logger.error("Failed to save file #{file_name}: #{e.message}")
    false
  end

  def self.update_file(file_name, new_content)
    file_path = get_file_path(file_name)
    return false unless file_exists?(file_name)

    File.open(file_path, 'wb') do |file|
      file.write(new_content)
    end
    true
  rescue StandardError => e
    Rails.logger.error("Failed to update file #{file_name}: #{e.message}")
    false
  end
end