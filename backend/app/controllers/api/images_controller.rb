module Api
  class ImagesController < ApplicationController
    # GET /api/images/:id — 依儲存路徑回傳圖片
    def show
      image    = PostImage.find(params[:id])
      resolved = image.resolved_path

      return render json: { error: "檔案不存在: #{resolved}" }, status: :not_found   unless File.exist?(resolved)
      return render json: { error: "無法讀取: #{resolved}" },   status: :forbidden   unless File.readable?(resolved)

      content_type = Marcel::MimeType.for(Pathname.new(resolved))
      send_file resolved, type: content_type, disposition: "inline"
    rescue ActiveRecord::RecordNotFound
      render json: { error: "找不到圖片記錄" }, status: :not_found
    end

    # POST /api/images/from_path — 直接從路徑預覽（不存 DB）
    def from_path
      raw_path  = params[:path].to_s.strip
      resolved  = resolve_path(raw_path)

      return render json: { error: "檔案不存在: #{resolved}" },    status: :not_found        unless File.exist?(resolved)
      return render json: { error: "無法讀取: #{resolved}" },      status: :forbidden        unless File.readable?(resolved)

      content_type = Marcel::MimeType.for(Pathname.new(resolved))
      return render json: { error: "非圖片檔案: #{content_type}" }, status: :unprocessable_entity unless content_type&.start_with?("image/")

      send_file resolved, type: content_type, disposition: "inline"
    end

    private

    def resolve_path(path)
      case path
      when /\A[A-Za-z]:\\/
        drive     = path[0].downcase
        unix_part = path[2..].tr("\\", "/")
        "/mnt/#{drive}#{unix_part}"
      else
        File.expand_path(path)
      end
    end
  end
end
