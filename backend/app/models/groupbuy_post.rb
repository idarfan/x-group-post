class GroupbuyPost < ApplicationRecord
  has_many :post_images, dependent: :destroy
  accepts_nested_attributes_for :post_images

  validates :product_name, presence: true
  validates :original_description, presence: true
  validates :source_language, inclusion: { in: %w[en ja zh_cn zh_tw auto] }
  validates :status, inclusion: { in: %w[draft published] }

  def post_content
    edited_post || generated_post || ""
  end
end
