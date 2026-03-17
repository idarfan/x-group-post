# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_03_17_123121) do
  create_table "groupbuy_posts", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.text "edited_post"
    t.date "end_date"
    t.text "generated_post"
    t.string "group_price"
    t.string "order_method"
    t.text "original_description", null: false
    t.string "product_name", null: false
    t.text "shipping_json"
    t.string "source_language", default: "en", null: false
    t.date "start_date"
    t.string "status", default: "draft", null: false
    t.text "translated_description"
    t.datetime "updated_at", null: false
  end

  create_table "post_images", force: :cascade do |t|
    t.string "content_type", null: false
    t.datetime "created_at", null: false
    t.string "filename", null: false
    t.integer "groupbuy_post_id", null: false
    t.binary "image_data", null: false
    t.integer "position", default: 1, null: false
    t.datetime "updated_at", null: false
    t.index ["groupbuy_post_id", "position"], name: "index_post_images_on_groupbuy_post_id_and_position", unique: true
    t.index ["groupbuy_post_id"], name: "index_post_images_on_groupbuy_post_id"
  end

  add_foreign_key "post_images", "groupbuy_posts"
end
