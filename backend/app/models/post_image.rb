class PostImage < ApplicationRecord
  belongs_to :groupbuy_post

  validates :filename, presence: true
  validates :content_type, presence: true
  validates :image_data, presence: true
  validates :position, inclusion: { in: 1..4 },
            uniqueness: { scope: :groupbuy_post_id }
end
