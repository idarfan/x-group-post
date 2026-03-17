class CreatePostImages < ActiveRecord::Migration[8.1]
  def change
    create_table :post_images do |t|
      t.references :groupbuy_post, null: false, foreign_key: true
      t.string  :filename,      null: false
      t.string  :content_type,  null: false
      t.binary  :image_data,    null: false
      t.integer :position,      null: false, default: 1
      t.timestamps
    end

    add_index :post_images, [:groupbuy_post_id, :position], unique: true
  end
end
