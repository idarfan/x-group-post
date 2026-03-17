class PostImage < ApplicationRecord
  belongs_to :groupbuy_post

  validates :filename,   presence: true
  validates :image_path, presence: true
  validates :path_type,  inclusion: { in: %w[windows wsl2 linux] }
  validates :position,   inclusion: { in: 1..4 },
            uniqueness: { scope: :groupbuy_post_id }

  # 將任意路徑格式解析為 WSL2 可讀的 Unix 路徑
  def resolved_path
    case path_type
    when "windows"
      drive     = image_path[0].downcase
      unix_part = image_path[2..].tr("\\", "/")
      "/mnt/#{drive}#{unix_part}"
    else
      File.expand_path(image_path)
    end
  end
end
