module Api
  class ImagesController < ApplicationController
    def show
      image = PostImage.find(params[:id])
      send_data image.image_data,
                type: image.content_type,
                disposition: "inline",
                filename: image.filename
    rescue ActiveRecord::RecordNotFound
      render json: { error: "找不到圖片" }, status: :not_found
    end

    # POST /api/images/from_path
    # Body: { "path": "/mnt/c/Users/.../product.jpg" }
    def from_path
      raw_path = params[:path].to_s.strip
      resolved = resolve_path(raw_path)

      unless File.exist?(resolved)
        return render json: { error: "檔案不存在: #{resolved}" }, status: :not_found
      end

      unless File.readable?(resolved)
        return render json: { error: "無法讀取: #{resolved}" }, status: :forbidden
      end

      content_type = Marcel::MimeType.for(Pathname.new(resolved))
      unless content_type&.start_with?("image/")
        return render json: { error: "非圖片檔案: #{content_type}" }, status: :unprocessable_entity
      end

      send_file resolved, type: content_type, disposition: "inline"
    end

    private

    def resolve_path(path)
      case path
      when /\A[A-Za-z]:\\/
        drive    = path[0].downcase
        unix_path = path[2..].tr("\\", "/")
        "/mnt/#{drive}#{unix_path}"
      when /\A~\//
        File.expand_path(path)
      else
        File.expand_path(path)
      end
    end
  end
end
