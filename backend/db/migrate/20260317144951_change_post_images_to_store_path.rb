class ChangePostImagesToStorePath < ActiveRecord::Migration[8.1]
  def change
    remove_column :post_images, :image_data,    :binary
    remove_column :post_images, :content_type,  :string

    add_column :post_images, :image_path,  :string, null: false, default: ""
    add_column :post_images, :path_type,   :string, null: false, default: "linux"
    # path_type: "windows" | "wsl2" | "linux"
  end
end
