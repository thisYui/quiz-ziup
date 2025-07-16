class FilesController < ApplicationController
  def show
    id = params[:id]
    filename = "#{params[:filename]}.#{params[:format]}"
    path = Rails.root.join("storage", id, filename)

    if File.exist?(path)
      mime_type = Mime::Type.lookup_by_extension(params[:format])
      send_file path, disposition: 'inline', type: mime_type
    else
      render plain: 'File not found', status: :not_found
    end
  end
end
