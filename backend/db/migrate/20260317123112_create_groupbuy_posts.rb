class CreateGroupbuyPosts < ActiveRecord::Migration[8.1]
  def change
    create_table :groupbuy_posts do |t|
      t.string  :product_name,           null: false
      t.text    :original_description,   null: false
      t.string  :source_language,        null: false, default: "en"
      t.text    :translated_description
      t.text    :generated_post
      t.text    :edited_post
      t.string  :group_price
      t.date    :start_date
      t.date    :end_date
      t.string  :order_method
      t.text    :shipping_json
      t.string  :status,                 null: false, default: "draft"
      t.timestamps
    end
  end
end
