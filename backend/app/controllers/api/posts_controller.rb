module Api
  class PostsController < ApplicationController
    def index
      posts = GroupbuyPost.order(created_at: :desc).limit(50)
      render json: posts.as_json(
        only: %i[id product_name group_price status created_at],
        include: { post_images: { only: %i[id filename position] } }
      )
    end

    def show
      post = GroupbuyPost.find(params[:id])
      render json: post.as_json(include: { post_images: { only: %i[id filename position] } })
    rescue ActiveRecord::RecordNotFound
      render json: { error: "找不到記錄" }, status: :not_found
    end

    def create
      post = GroupbuyPost.new(post_params)

      if params[:images].present?
        params[:images].each_with_index do |img, idx|
          post.post_images.build(
            filename: img.original_filename,
            content_type: img.content_type,
            image_data: img.read,
            position: idx + 1
          )
        end
      end

      if post.save
        render json: post.as_json(include: :post_images), status: :created
      else
        render json: { errors: post.errors.full_messages }, status: :unprocessable_entity
      end
    end

    def update
      post = GroupbuyPost.find(params[:id])
      if post.update(post_params)
        render json: post
      else
        render json: { errors: post.errors.full_messages }, status: :unprocessable_entity
      end
    rescue ActiveRecord::RecordNotFound
      render json: { error: "找不到記錄" }, status: :not_found
    end

    def destroy
      post = GroupbuyPost.find(params[:id])
      post.destroy
      head :no_content
    rescue ActiveRecord::RecordNotFound
      render json: { error: "找不到記錄" }, status: :not_found
    end

    private

    def post_params
      params.permit(
        :product_name, :original_description, :source_language,
        :translated_description, :generated_post, :edited_post,
        :group_price, :start_date, :end_date,
        :order_method, :shipping_json, :status
      )
    end
  end
end
